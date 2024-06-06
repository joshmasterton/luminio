export type User = {
	id: number;
	username: string;
	email: string;
	friends: number;
	likes: number;
	dislikes: number;
	created_at: Date;
	last_online: Date;
	profile_picture: string;
};
