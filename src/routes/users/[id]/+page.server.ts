import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { validateData } from '$lib/utils';
import { followUserSchema } from '$lib/schema';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}

	const user = await locals.pb.collection('users').getOne(id, {});

	// GET POSTS
	const posts = await locals.pb.collection('posts').getFullList({
		filter: `author = "${id}"`, // Use single equals sign (=) and properly quote the id
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

	// GET USER FOLLOWERS
	const followers = await locals.pb.collection('users').getFullList({
		filter: `following ~ "${id}"`
	});

	return {
		userProfile: user,
		userPosts: transformedPosts,
		userFollowers: followers,
		users: users
	};
};

// Define the actions
export const actions: Actions = {
	followUser: async ({ request, locals }) => {
		const { formData, errors } = await validateData(await request.formData(), followUserSchema);
		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			const user = await locals.pb.collection('users').getOne(formData.userId);
			const currentUser = await locals.pb.collection('users').getOne(formData.currentUserId);

			if (currentUser.following.includes(user.id)) {
				currentUser.following = currentUser.following.filter((id: any) => id !== user.id);
			} else {
				currentUser.following.push(user.id);

				const data = {
					title: 'New Follower',
					message: 'Followed you',
					user: user.id,
					referencedPost: '',
					referencedUser: currentUser.id
				};

				await locals.pb.collection('notifications').create(data);
			}

			await locals.pb
				.collection('users')
				.update(currentUser.id, { following: currentUser.following });

			return {
				success: true
			};
		} catch (err) {
			console.error('Error following user:', err);
			return {
				error: 'Error following user'
			};
		}
	}
};
