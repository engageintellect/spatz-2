import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { fail, error } from '@sveltejs/kit';
import { validateData } from '$lib/utils';
import { deleteNotificationSchema, followUserSchema } from '$lib/schema';

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

	// TRANSFORM USER NOTIFICATIONS
	const notifications = await locals.pb.collection('notifications').getFullList({
		filter: `user ~ "${id}"`,
		sort: '-created'
	});

	//console.log('notifications:', notifications);

	const transformedNotifications = notifications.map((notification) => {
		return {
			...notification,
			username: users.find((user) => user.id === notification.referencedUser)?.username,
			userAvatar: users.find((user) => user.id === notification.referencedUser)?.avatar
		};
	});

	//console.log('userprofile', user);
	//console.log('transformedNotifications:', transformedNotifications);

	return {
		userProfile: user,
		userPosts: transformedPosts,
		userFollowers: followers,
		notifications: transformedNotifications,
		users: users
	};
};

// Define the actions
export const actions: Actions = {
	deleteNotification: async ({ request, locals }) => {
		try {
			// Parse and validate the postId
			const { formData, errors } = await validateData(
				await request.formData(),
				deleteNotificationSchema
			);

			const notificationId = formData.notificationId as string;
			deleteNotificationSchema.parse({ notificationId });

			// Ensure the notification exists
			const notification = await locals.pb.collection('notifications').getOne(notificationId);

			// Ensure the user is authorized to delete the post
			if (notification.user !== locals.pb.authStore.model?.id) {
				throw error(403, 'Unauthorized');
			}

			// Recursive function to delete a post and all posts mentioning it
			const deleteNotification = async (notificationId: string) => {
				await locals.pb.collection('notifications').delete(notificationId);
			};

			await deleteNotification(notificationId);

			return {
				success: true
			};
		} catch (err) {
			console.error('Error deleting post:', err);
			return {
				error: 'Error deleting post'
			};
		}
	}
};
