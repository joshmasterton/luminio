export type Friendship = {
	id: number;
	friend_one_id: number;
	friend_two_id: number;
	friend_initiator: number;
	friendship_accepted: boolean;
	created_at: Date;
};
