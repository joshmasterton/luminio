import {type Friendship} from '../types/models/friendModels.types';
import {queryDb} from '../database/db';

export const getFriendship = async (tableName: string, friendOneUsername: string, friendTwoUsername: string) => {
	try {
		const result = await queryDb(`
			SELECT * FROM ${tableName}
			WHERE friend_one_username = $1
			AND friend_two_username = $2
		`, [friendOneUsername, friendTwoUsername]);

		return result?.rows[0] as Friendship;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const addFriend = async (tableName: string, friendOneUsername: string, friendTwoUsername: string) => {
	try {
		const result = await queryDb(`
			INSERT INTO ${tableName} (friend_one_username, friend_two_username, friend_initiator)
			VALUES ($1, $2, $1) RETURNING *;
		`, [friendOneUsername, friendTwoUsername]);

		return result?.rows[0] as Friendship;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const removeFriend = async (tableName: string, friendOneUsername: string, friendTwoUsername: string) => {
	try {
		const result = await queryDb(`
			DELETE FROM ${tableName}
			WHERE friend_one_username = $1
			AND friend_two_username = $2
		`, [friendOneUsername, friendTwoUsername]);

		return result?.rows[0] as Friendship;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const updateFriendship = async (tableName: string, friendOneUsername: string, friendTwoUsername: string) => {
	try {
		const result = await queryDb(`
			UPDATE ${tableName}
			SET friendship_accepted = $1
			WHERE friend_one_username = $2
			AND friend_two_username = $3
		`, [true, friendOneUsername, friendTwoUsername]);

		return result?.rows[0] as Friendship;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
