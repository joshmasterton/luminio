import {
	afterEach, beforeEach, describe, test, expect,
} from 'vitest';
import {
	createFriendsTable, createUsersTable, dropFriendsTable,
	dropUsersTable,
} from '../../src/database/db';
import {
	addFriend, getFriendship, removeFriend, updateFriendship,
} from '../../src/models/friendModels';
import {createUser, getUser} from '../../src/models/userModels';

describe('/friendModels', () => {
	let tableName: string;
	let tableUsersName: string;

	beforeEach(async () => {
		tableName = `luminio_friends_test_friend_models_${Date.now()}`;
		tableUsersName = `luminio_users_test_friend_models_${Date.now()}`;

		await dropFriendsTable(tableName);
		await dropUsersTable(tableUsersName);

		await createFriendsTable(tableName);
		await createUsersTable(tableUsersName);
	});

	afterEach(async () => {
		await dropFriendsTable(tableName);
		await dropUsersTable(tableUsersName);
	});

	test('Should return new friendship', async () => {
		const friendOneId = 1;
		const friendTwoId = 2;

		const newFriendship = await addFriend(tableName, friendOneId, friendTwoId);

		expect(newFriendship?.friend_one_id).toBe(friendOneId);
		expect(newFriendship?.friend_initiator).toBe(friendOneId);
		expect(newFriendship?.friend_two_id).toBe(friendTwoId);
		expect(newFriendship?.friendship_accepted).toBeFalsy();
	});

	test('Should return existing friendship', async () => {
		const friendOneId = 1;
		const friendTwoId = 2;

		await addFriend(tableName, friendOneId, friendTwoId);
		const getNewFriendship = await getFriendship(tableName, friendOneId, friendTwoId);

		expect(getNewFriendship?.friend_one_id).toBe(friendOneId);
		expect(getNewFriendship?.friend_initiator).toBe(friendOneId);
		expect(getNewFriendship?.friend_two_id).toBe(friendTwoId);
		expect(getNewFriendship?.friendship_accepted).toBeFalsy();
	});

	test('Should update existing friendship and update usernames friends', async () => {
		const user = await createUser(tableUsersName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const userTwo = await createUser(tableUsersName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');

		await addFriend(tableName, user!.id, userTwo!.id);
		const updatedFriendship = await updateFriendship(tableName, tableUsersName, user!.id, userTwo!.id);

		const updatedUser = await getUser(tableUsersName, 'id', user!.id);
		const updatedUserTwo = await getUser(tableUsersName, 'id', user!.id);

		expect(updatedUser?.friends).toBe(user!.friends + 1);
		expect(updatedUserTwo?.friends).toBe(userTwo!.friends + 1);
		expect(updatedFriendship?.friendship_accepted).toBeTruthy();
	});

	test('Should return undefined if no existing friendship', async () => {
		const friendOneId = 1;
		const friendTwoId = 2;

		const getNewFriendship = await getFriendship(tableName, friendOneId, friendTwoId);

		expect(getNewFriendship).toBe(undefined);
	});

	test('Should remove friendship and not update users friends if not accepted before', async () => {
		const user = await createUser(tableUsersName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const userTwo = await createUser(tableUsersName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');

		const newFriendship = await addFriend(tableName, user!.id, userTwo!.id);
		const removedFrienship = await removeFriend(tableName, tableUsersName, user!.id, userTwo!.id, newFriendship!.friendship_accepted);

		const updatedUser = await getUser(tableUsersName, 'id', user!.id);
		const updatedUserTwo = await getUser(tableUsersName, 'id', user!.id);

		expect(updatedUser?.friends).toBe(0);
		expect(updatedUserTwo?.friends).toBe(0);
		expect(removedFrienship).toEqual({message: 'Successfully ended friendship'});
	});

	test('Should remove friendship and update users friends if friendship accepted', async () => {
		const user = await createUser(tableUsersName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const userTwo = await createUser(tableUsersName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');

		await addFriend(tableName, user!.id, userTwo!.id);
		const removedFrienship = await removeFriend(tableName, tableUsersName, user!.id, userTwo!.id, true);

		const updatedUser = await getUser(tableUsersName, 'id', user!.id);
		const updatedUserTwo = await getUser(tableUsersName, 'id', user!.id);

		expect(updatedUser?.friends).toBe(user!.friends - 1);
		expect(updatedUserTwo?.friends).toBe(userTwo!.friends - 1);
		expect(removedFrienship).toEqual({message: 'Successfully ended friendship'});
	});
});
