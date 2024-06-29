import {
	afterEach, beforeEach, describe, test, expect,
} from 'vitest';
import {
	createFriendsTable, createUsersTable, dropFriendsTable,
	dropUsersTable,
} from '../../src/database/db';
import {
	addFriend, getFriendship, getFriends, removeFriend, updateFriendship,
} from '../../src/models/friendModels';
import {createUser, getUser} from '../../src/models/userModels';
import {addRemoveFriend} from '../../src/services/friendshipsServices/addRemoveFriendServices';

describe('/friendModels', () => {
	let friendsTable: string;
	let usersTable: string;

	beforeEach(async () => {
		friendsTable = `luminio_friends_test_friend_models_${Date.now()}`;
		usersTable = `luminio_users_test_friend_models_${Date.now()}`;

		await dropFriendsTable(friendsTable);
		await dropUsersTable(usersTable);

		await createFriendsTable(friendsTable);
		await createUsersTable(usersTable);
	});

	afterEach(async () => {
		await dropFriendsTable(friendsTable);
		await dropUsersTable(usersTable);
	});

	test('Should return new friendship', async () => {
		const friendOneId = 1;
		const friendTwoId = 2;

		const newFriendship = await addFriend(friendsTable, friendOneId, friendTwoId);

		expect(newFriendship?.friend_one_id).toBe(friendOneId);
		expect(newFriendship?.friend_initiator).toBe(friendOneId);
		expect(newFriendship?.friend_two_id).toBe(friendTwoId);
		expect(newFriendship?.friendship_accepted).toBeFalsy();
	});

	test('Should return existing friendship', async () => {
		const friendOneId = 1;
		const friendTwoId = 2;

		await addFriend(friendsTable, friendOneId, friendTwoId);
		const getNewFriendship = await getFriendship(friendsTable, friendOneId, friendTwoId);

		expect(getNewFriendship?.friend_one_id).toBe(friendOneId);
		expect(getNewFriendship?.friend_initiator).toBe(friendOneId);
		expect(getNewFriendship?.friend_two_id).toBe(friendTwoId);
		expect(getNewFriendship?.friendship_accepted).toBeFalsy();
	});

	test('Should return existing friendships', async () => {
		const user = await createUser(usersTable, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const userTwo = await createUser(usersTable, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(usersTable, 'testUserThree', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(usersTable, 'testUserFour', 'test1@email.com', 'Password', 'profile.jpg');

		await addRemoveFriend(friendsTable, usersTable, 'add', user!.id, userTwo!.id);
		await addRemoveFriend(friendsTable, usersTable, 'add', userTwo!.id, user!.id);
		const friendships = await getFriends(friendsTable, usersTable, user!.id);

		expect(friendships?.[0].id).toBe(2);
		expect(friendships?.[0].username).toBe('testUserTwo');
	});

	test('Should return error if no friends found', async () => {
		const user = await createUser(usersTable, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(usersTable, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(usersTable, 'testUserThree', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(usersTable, 'testUserFour', 'test1@email.com', 'Password', 'profile.jpg');

		await expect(getFriends(friendsTable, usersTable, user!.id)).rejects.toThrowError('No friends found');
	});

	test('Should update existing friendship and update usernames friends', async () => {
		const user = await createUser(usersTable, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const userTwo = await createUser(usersTable, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');

		await addFriend(friendsTable, user!.id, userTwo!.id);
		const updatedFriendship = await updateFriendship(friendsTable, usersTable, user!.id, userTwo!.id);

		const updatedUser = await getUser(usersTable, 'id', user!.id);
		const updatedUserTwo = await getUser(usersTable, 'id', user!.id);

		expect(updatedUser?.friends).toBe(user!.friends + 1);
		expect(updatedUserTwo?.friends).toBe(userTwo!.friends + 1);
		expect(updatedFriendship?.friendship_accepted).toBeTruthy();
	});

	test('Should return undefined if no existing friendship', async () => {
		const friendOneId = 1;
		const friendTwoId = 2;

		const getNewFriendship = await getFriendship(friendsTable, friendOneId, friendTwoId);

		expect(getNewFriendship).toBe(undefined);
	});

	test('Should remove friendship and not update users friends if not accepted before', async () => {
		const user = await createUser(usersTable, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const userTwo = await createUser(usersTable, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');

		const newFriendship = await addFriend(friendsTable, user!.id, userTwo!.id);
		const removedFrienship = await removeFriend(friendsTable, usersTable, user!.id, userTwo!.id, newFriendship!.friendship_accepted);

		const updatedUser = await getUser(usersTable, 'id', user!.id);
		const updatedUserTwo = await getUser(usersTable, 'id', user!.id);

		expect(updatedUser?.friends).toBe(0);
		expect(updatedUserTwo?.friends).toBe(0);
		expect(removedFrienship).toEqual({message: 'Successfully ended friendship'});
	});

	test('Should remove friendship and update users friends if friendship accepted', async () => {
		const user = await createUser(usersTable, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const userTwo = await createUser(usersTable, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');

		await addFriend(friendsTable, user!.id, userTwo!.id);
		const removedFrienship = await removeFriend(friendsTable, usersTable, user!.id, userTwo!.id, true);

		const updatedUser = await getUser(usersTable, 'id', user!.id);
		const updatedUserTwo = await getUser(usersTable, 'id', user!.id);

		expect(updatedUser?.friends).toBe(user!.friends - 1);
		expect(updatedUserTwo?.friends).toBe(userTwo!.friends - 1);
		expect(removedFrienship).toEqual({message: 'Successfully ended friendship'});
	});
});
