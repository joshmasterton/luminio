export type Comment = {
	id: number;
	post_id: number;
	comment_parent_id?: number;
	user_id: number;
	comment: string;
	likes: number;
	dislikes: number;
	comments: number;
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
