import {type Friendship} from '../types/models/friendModels.types';
import {type User} from '../types/models/userModels.types';
import {queryDb} from '../database/db';
import {getUser} from './userModels';

export const getFriendship = async (tableName: string, friendOneId: number, friendTwoId: number) => {
	try {
		const result = await queryDb(`
			SELECT * FROM ${tableName}
			WHERE (friend_one_id = $1 AND friend_two_id = $2)
			OR (friend_one_id = $2 AND friend_two_id = $1)
		`, [friendOneId, friendTwoId]);

		return result?.rows[0] as Friendship;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const getFriends = async (
	friendsTable: string,
	usersTable: string,
	userId: number,
	sort = 'created_at',
	page = 0,
	limit = 10,
	accepted = true,
) => {
	try {
		const result = await queryDb(`
			SELECT * FROM ${friendsTable}
			WHERE (friend_one_id = $1
			OR friend_two_id = $1)
			AND friendship_accepted = $2 
			ORDER BY ${sort} DESC
			LIMIT $3 OFFSET $4
		`, [userId, accepted, limit, page * limit]);

		const friendships = result?.rows as Friendship[];

		if (!friendships.length) {
			throw new Error('No friends found');
		}

		const friendsPromises = friendships.map(async friendship => {
			const friendId = friendship.friend_one_id === userId ? friendship.friend_two_id : friendship.friend_one_id;

			const friend = getUser(usersTable, 'id', friendId);
			return friend;
		});

		const friends = await Promise.all(friendsPromises);
		return friends as User[];
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const addFriend = async (tableName: string, friendOneId: number, friendTwoId: number) => {
	try {
		const result = await queryDb<number>(`
			INSERT INTO ${tableName} (friend_one_id, friend_two_id, friend_initiator)
			VALUES ($1, $2, $1) RETURNING *;
		`, [friendOneId, friendTwoId]);

		return result?.rows[0] as Friendship;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const removeFriend = async (friendsTable: string, usersTable: string, friendOneId: number, friendTwoId: number, friendship_accepted: boolean) => {
	try {
		await queryDb(`
			DELETE FROM ${friendsTable}
			WHERE (friend_one_id = $1 AND friend_two_id = $2)
			OR (friend_one_id = $2 AND friend_two_id = $1)
		`, [friendOneId, friendTwoId]);

		if (friendship_accepted) {
			await queryDb(`
				UPDATE ${usersTable}
				SET friends = friends - 1
				WHERE id = $1
			`, [friendOneId]);

			await queryDb(`
				UPDATE ${usersTable}
				SET friends = friends - 1
				WHERE id = $1
			`, [friendTwoId]);
		}

		return {message: 'Successfully ended friendship'};
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const updateFriendship = async (friendsTable: string, usersTable: string, friendOneId: number, friendTwoId: number) => {
	try {
		const result = await queryDb(`
			UPDATE ${friendsTable}
			SET friendship_accepted = $1
			WHERE (friend_one_id = $2 AND friend_two_id = $3)
			OR (friend_one_id = $3 AND friend_two_id = $2) RETURNING *
		`, [true, friendOneId, friendTwoId]);

		await queryDb(`
			UPDATE ${usersTable}
			SET friends = friends + 1
			WHERE id = $1
		`, [friendOneId]);

		await queryDb(`
			UPDATE ${usersTable}
			SET friends = friends + 1
			WHERE id = $1
		`, [friendTwoId]);

		return result?.rows[0] as Friendship;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
