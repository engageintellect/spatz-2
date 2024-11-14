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
		//console.log('Starting user data fetch...');

		// Fetch all required data in parallel, only fetching all users if necessary
		const [user, posts, followers, notifications] = await Promise.all([
			locals.pb.collection('users').getOne(id, { autoCancel: false }),
			locals.pb.collection('posts').getFullList({
				filter: `author = "${id}"`,
				sort: '-created',
				autoCancel: false
			}),
			locals.pb.collection('users').getFullList({
				filter: `following ~ "${id}"`,
				autoCancel: false
			}),
			locals.pb.collection('notifications').getFullList({
				filter: `user ~ "${id}"`,
				sort: '-created',
				autoCancel: false,
				expand: 'commentId'
			})
		]);

		// Fetch all users only if necessary for notifications
		let allUsers: any = [''];
		if (notifications.length > 0) {
			allUsers = await locals.pb.collection('users').getFullList({ autoCancel: false });
		}

		// Transform posts and notifications
		const transformedPosts = posts.map((post) => ({
			...post,
			username: user.username,
			avatar: user.avatar
		}));

		const transformedNotifications = notifications.map((notification) => {
			const follower = allUsers.find((user: any) => user.id === notification.referencedUser);
			return {
				...notification,
				username: follower?.username,
				userAvatar: follower?.avatar
			};
		});

		return {
			userProfile: user,
			userPosts: transformedPosts,
			userFollowers: followers,
			notifications: transformedNotifications,
			allUsers // Include all users if fetched
		};
	} catch (err) {
		console.error('Error loading data:', err);
		throw error(500, 'Failed to load user profile data');
	}
};

export const actions: Actions = {
	deleteNotification: async ({ request, locals }) => {
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

			if (notification.user !== locals.pb.authStore.model?.id) {
				throw error(403, 'Unauthorized');
			}

			await locals.pb.collection('notifications').delete(notificationId, { autoCancel: false });
			return { success: true };
		} catch (err) {
			console.error('Error deleting notification:', err);
			return fail(500, { error: 'Error deleting notification' });
		}
	},

	deleteAllNotifications: async ({ locals }) => {
		try {
			const currentUserId = locals.pb.authStore.model?.id;
			if (!currentUserId) throw error(403, 'User not authenticated');

			// Fetch and delete all notifications for the current user
			const userNotifications = await locals.pb.collection('notifications').getFullList({
				filter: `user = "${currentUserId}"`,
				autoCancel: false
			});

			await Promise.all(
				userNotifications.map((notification) =>
					locals.pb.collection('notifications').delete(notification.id, { autoCancel: false })
				)
			);

			console.log('All notifications deleted.');
			return { success: true };
		} catch (err) {
			console.error('Error deleting all notifications:', err);
			return fail(500, { error: 'Error deleting all notifications' });
		}
	}
};
