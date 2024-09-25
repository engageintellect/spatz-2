import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}

	// GET POSTS
	const posts = await locals.pb.collection('posts').getFullList({
		sort: '-created'
	});

	// GET USERS
	const users = await locals.pb.collection('users').getFullList({
		sort: '-created'
	});

	// TRANSFORM POSTS
	const transformedPosts = posts.map((post) => {
		// Replace the comment IDs with the actual comment objects and include author details

		// Add author's username and avatar to each post
		return {
			...post,
			username: users.find((user) => user.id === post.author)?.username,
			avatar: users.find((user) => user.id === post.author)?.avatar
		};
	});

	return { posts: transformedPosts, users: users };
};
