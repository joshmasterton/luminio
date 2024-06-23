import {
	addFriend, getFriendship, removeFriend, updateFriendship,
} from '../models/friendModels';

export const addRemoveFriend = async (tableName: string, type: string, friendOneUsername: string, friendTwoUsername: string) => {
	try {
		const existingFrienship = await getFriendship(tableName, friendOneUsername, friendTwoUsername);

		if (existingFrienship) {
			if (existingFrienship.friend_initiator === existingFrienship.friend_one_username) {
				throw new Error('Friendship already exists');
			}

			return await updateFriendship(tableName, friendOneUsername, friendTwoUsername);
		}

		if (type === 'add') {
			return await addFriend(tableName, friendOneUsername, friendTwoUsername);
		}

		if (type === 'remove') {
			return await removeFriend(tableName, friendOneUsername, friendTwoUsername);
		}
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
