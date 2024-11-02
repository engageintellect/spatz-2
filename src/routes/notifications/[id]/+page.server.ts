import type { PageServerLoad } from './$types';
import { redirect, error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { validateData } from '$lib/utils';
import { deleteNotificationSchema } from '$lib/schema';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}

	try {
		console.log('Starting user data fetch...');

		const [userResult, postsResult, followersResult, notificationsResult] =
			await Promise.allSettled([
				locals.pb.collection('users').getOne(id, { autoCancel: false }),
				locals.pb
					.collection('posts')
					.getFullList({ filter: `author = "${id}"`, sort: '-created', autoCancel: false }),
				locals.pb
					.collection('users')
					.getFullList({ filter: `following ~ "${id}"`, autoCancel: false }),
				locals.pb
					.collection('notifications')
					.getFullList({ filter: `user ~ "${id}"`, sort: '-created', autoCancel: false })
			]);

		if (userResult.status === 'rejected') throw error(500, 'User data failed to load');
		const user = userResult.value;

		const posts = postsResult.status === 'fulfilled' ? postsResult.value : [];
		const followers = followersResult.status === 'fulfilled' ? followersResult.value : [];
		const notifications =
			notificationsResult.status === 'fulfilled' ? notificationsResult.value : [];

		const transformedPosts = posts.map((post) => ({
			...post,
			username: user.username,
			avatar: user.avatar
		}));

		const transformedNotifications = notifications.map((notification) => ({
			...notification,
			username: followers.find((follower) => follower.id === notification.referencedUser)?.username,
			userAvatar: followers.find((follower) => follower.id === notification.referencedUser)?.avatar
		}));

		return {
			userProfile: user,
			userPosts: transformedPosts,
			userFollowers: followers,
			notifications: transformedNotifications
		};
	} catch (err) {
		console.error('Error loading data:', err);
		throw error(500, 'Failed to load user profile data');
	}
};

export const actions: Actions = {
	deleteNotification: async ({ request, locals }) => {
		console.log('Deleting notification...');
		try {
			const { formData, errors } = await validateData(
				await request.formData(),
				deleteNotificationSchema
			);
			if (errors) return fail(400, { errors });

			const notificationId = formData.notificationId as string;
			deleteNotificationSchema.parse({ notificationId });

			const notification = await locals.pb
				.collection('notifications')
				.getOne(notificationId, { autoCancel: false });
			if (notification.user !== locals.pb.authStore.model?.id) throw error(403, 'Unauthorized');

			await locals.pb.collection('notifications').delete(notificationId, { autoCancel: false });
			return { success: true };
		} catch (err) {
			console.error('Error in deleteNotification action:', err);
			return fail(500, { error: 'Error deleting notification' });
		}
	},

	deleteAllNotifications: async ({ locals }) => {
		try {
			console.log('Fetching all notifications for the current user...');
			const currentUserId = locals.pb.authStore.model?.id;

			if (!currentUserId) throw error(403, 'User not authenticated');

			// Fetch all notifications for the current user
			const userNotifications = await locals.pb.collection('notifications').getFullList({
				filter: `user = "${currentUserId}"`,
				autoCancel: false
			});

			console.log(`Found ${userNotifications.length} notifications to delete.`);

			// Delete each notification in a loop
			for (const notification of userNotifications) {
				await locals.pb.collection('notifications').delete(notification.id, { autoCancel: false });
				console.log(`Deleted notification with ID: ${notification.id}`);
			}

			console.log('All notifications deleted.');
			return { success: true };
		} catch (err) {
			console.error('Error in deleteAllNotifications action:', err);
			return fail(500, { error: 'Error deleting all notifications' });
		}
	}
};
