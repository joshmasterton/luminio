/* eslint-disable @typescript-eslint/naming-convention */
import {type PostWithUserInfo} from '../../src/types/pages/Posts.types';

export const mockPost: PostWithUserInfo = {
	id: 1,
	user_id: 1,
	username: 'testUser',
	post: 'test post',
	likes: 0,
	dislikes: 0,
	comments: 0,
	profile_picture: 'testPicture.jpg',
	created_at: new Date(Date.now()),
};

export const mockPostTwo: PostWithUserInfo = {
	id: 2,
	user_id: 1,
	username: 'testUser',
	post: 'test post two',
	likes: 0,
	dislikes: 0,
	comments: 0,
	profile_picture: 'testPicture.jpg',
	created_at: new Date(Date.now()),
};
