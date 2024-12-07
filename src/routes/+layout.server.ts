import type { LayoutServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/schema';
import { stripe } from '$lib/stripe';

// Load this data everywhere
export const load: LayoutServerLoad = async ({ locals }) => {
	const subs = await stripe.subscriptions.list();

	const user = await stripe.customers.list({
		email: locals?.pb?.authStore?.record?.email,
		limit: 1
	});

	let existingSubscriptions: any = [];
	if (user.data.length > 0) {
		existingSubscriptions = subs.data.filter((sub) => sub.customer === user.data[0].id);
	}

	const userId = locals?.pb?.authStore?.record?.id;

	// Check if userId exists and auth is valid before proceeding
	if (userId && locals.pb.authStore.isValid) {
		const isSubscribed =
			existingSubscriptions.length > 0 && existingSubscriptions[0].status === 'active';

		await locals.pb.collection('users').update(userId, { subscribed: isSubscribed });
	}

	const notifications = await locals.pb.collection('notifications').getFullList({
		filter: `user ~ "${locals?.pb?.authStore?.record?.id}"`,
		sort: '-created'
	});

	return {
		user: locals.user,
		globalNotifications: notifications,
		form: await superValidate(zod(formSchema))
	};
};
