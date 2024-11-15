import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { validateData } from '$lib/utils';
import { followUserSchema } from '$lib/schema';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;

	// Check if user is authenticated
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}

	try {
		// Fetch the user profile directly by ID
		const userProfile = await locals.pb.collection('users').getOne(id);

		if (!userProfile) {
			throw redirect(404, '/not-found');
		}

		// Fetch the user's posts
		const posts = await locals.pb.collection('posts').getFullList({
			filter: `author = "${id}"`,
			sort: '-created'
		});

		// Transform posts to include author details
		const transformedPosts = posts.map((post) => ({
			...post,
			username: userProfile.username,
			avatar: userProfile.avatar,
			verified: userProfile.verified
		}));

		// Fetch all users and filter followers
		const allUsers = await locals.pb.collection('users').getFullList();
		const followers = allUsers.filter((user) => user.following.includes(id));

		return {
			userProfile,
			userPosts: transformedPosts,
			userFollowers: followers
		};
	} catch (err) {
		console.error('Error loading data:', err);
		throw redirect(500, '/error');
	}
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

		const userId = formData.userId as string;
		const currentUserId = formData.currentUserId as string;

		try {
			// Fetch current user and target user
			const [currentUser, user] = await Promise.all([
				locals.pb.collection('users').getOne(currentUserId),
				locals.pb.collection('users').getOne(userId)
			]);

			// Check if user is already followed
			const isFollowing = currentUser.following.includes(userId);

			if (isFollowing) {
				// Unfollow user
				currentUser.following = currentUser.following.filter((id: any) => id !== userId);
			} else {
				// Follow user and create notification
				currentUser.following.push(userId);

				await locals.pb.collection('notifications').create({
					title: 'New Follower',
					message: 'Followed you',
					user: userId,
					referencedPost: '',
					referencedUser: currentUserId
				});
			}

			// Update current user's following list
			await locals.pb.collection('users').update(currentUserId, {
				following: currentUser.following
			});

			return { success: true };
		} catch (err) {
			console.error('Error following/unfollowing user:', err);
			return fail(500, { error: 'Error following/unfollowing user' });
		}
	}
};
