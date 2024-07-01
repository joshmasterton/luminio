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

export type PostWithUserInfo = {
	id: number;
	user_id: number;
	username: string;
	post: string;
	likes: number;
	dislikes: number;
	comments: number;
	profile_picture: string;
	post_picture?: string;
	created_at: Date;
};

export type CommentWithUserInfo = {
	id: number;
	post_id: number;
	comment_parent_id?: number;
	user_id: number;
	username: string;
	comment: string;
	likes: number;
	dislikes: number;
	comments: number;
	profile_picture: string;
	created_at: Date;
};

export type Friendship = {
	id: number;
	friend_one_id: number;
	friend_two_id: number;
	friend_initiator: number;
	friendship_accepted: boolean;
	created_at: Date;
};
