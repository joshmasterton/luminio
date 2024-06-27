import {
	afterEach, beforeEach, describe, expect, test,
} from 'vitest';
import {
	createPostsTable, createUsersTable, dropPostsTable, dropUsersTable,
} from '../../src/database/db';
import {createPost, getPost, getPosts} from '../../src/models/postModels';
import {createUser} from '../../src/models/userModels';

describe('postModels', () => {
	let postsTable: string;
	let usersTable: string;

	beforeEach(async () => {
		postsTable = `luminio_posts_test_create_post_${Date.now()}`;
		usersTable = `luminio_users_test_create_post_${Date.now()}`;

		await dropPostsTable(postsTable);
		await dropUsersTable(usersTable);
		await createPostsTable(postsTable);
		await createUsersTable(usersTable);
	});

	afterEach(async () => {
		await dropPostsTable(postsTable);
		await dropUsersTable(usersTable);
	});

	test('Should create a post and get post', async () => {
		const user = await createUser(usersTable, 'testUser', 'test@email.com', 'Password', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, user!.id, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		const post = await getPost(postsTable, usersTable, 1);

		expect(post?.post).toBe('Test post');
		expect(post?.username).toBe('testUser');
		expect(post?.profile_picture).toBe('https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		expect(post?.post_picture).toBe('https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
	});

	test('Throw error if no user provided', async () => {
		await createPost(postsTable, 1, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await expect(getPost(postsTable, usersTable, 1)).rejects.toThrowError('No user found');
	});

	test('Throw error if no post provided', async () => {
		const user = await createUser(usersTable, 'testUser', 'test@email.com', 'Password', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, user!.id, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await expect(getPost(postsTable, usersTable, 4)).rejects.toThrowError('No post found');
	});

	test('Should get posts with default settings', async () => {
		const user = await createUser(usersTable, 'testUser', 'test@email.com', 'Password', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, user!.id, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, user!.id, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, user!.id, 'test post');

		const posts = await getPosts(postsTable, usersTable);

		if (posts) {
			expect(posts[0].id).toBe(3);
			expect(posts[0].post_picture).toBeUndefined();
		}
	});

	test('Should get posts with pagination', async () => {
		const user = await createUser(usersTable, 'testUser', 'test@email.com', 'Password', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, user!.id, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, user!.id, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, user!.id, 'test post');
		await createPost(postsTable, user!.id, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, user!.id, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, user!.id, 'test post');
		await createPost(postsTable, user!.id, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, user!.id, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, user!.id, 'test post');
		await createPost(postsTable, user!.id, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, user!.id, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, user!.id, 'test post');

		const posts = await getPosts(postsTable, usersTable, 'created_at', 1, 2);

		if (posts) {
			expect(posts[0].id).toBe(10);
		}
	});

	test('Should throw error if no user', async () => {
		await createPost(postsTable, 1, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, 1, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		await createPost(postsTable, 1, 'test post', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');

		await expect(getPosts(postsTable, usersTable)).rejects.toThrowError('No user found');
	});
});
