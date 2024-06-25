export type ErrorResponse = {
	error: string;
};

export type User = {
	id: number;
	username: string;
	email: string;
	friends: number;
	comments: number;
	likes: number;
	dislikes: number;
	created_at: Date;
	last_online: Date;
	profile_picture: string;
};

export type Friendship = {
	id: number;
	friend_one_id: number;
	friend_two_id: number;
	friend_initiator: number;
	friendship_accepted: boolean;
	created_at: Date;
};
