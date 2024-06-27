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
