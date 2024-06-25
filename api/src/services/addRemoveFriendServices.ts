import {
	addFriend, getFriendship, removeFriend, updateFriendship,
} from '../models/friendModels';

export const addRemoveFriend = async (friendsTable: string, usersTable: string, type: string, friendOneId: number, friendTwoId: number) => {
	try {
		const existingFrienship = await getFriendship(friendsTable, friendOneId, friendTwoId);

		if (existingFrienship) {
			if (type === 'add') {
				if (existingFrienship.friendship_accepted) {
					throw new Error('Friendship already exists');
				}

				if (existingFrienship.friend_initiator !== friendOneId) {
					return await updateFriendship(friendsTable, usersTable, friendOneId, friendTwoId);
				}

				throw new Error('Friendship request already sent');
			}

			if (type === 'remove') {
				return await removeFriend(friendsTable, usersTable, friendOneId, friendTwoId, existingFrienship.friendship_accepted);
			}
		}

		if (type === 'add') {
			return await addFriend(friendsTable, friendOneId, friendTwoId);
		}

		if (type === 'remove') {
			throw new Error('No friendship to remove');
		}
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
