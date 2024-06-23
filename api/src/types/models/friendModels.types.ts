export type Friendship = {
	id: number;
	friend_one_username: string;
	friend_two_username: string;
	friend_initiator: string;
	friendship_accepted: boolean;
	created_at: Date;
};
