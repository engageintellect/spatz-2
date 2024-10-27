import type { LayoutServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/schema';
import { stripe } from '$lib/stripe';

// Load this data everywhere
export const load: LayoutServerLoad = async ({ locals }) => {
	const subs = await stripe.subscriptions.list();

	const user = await stripe.customers.list({
		email: locals?.pb?.authStore?.model?.email,
		limit: 1
	});

	let existingSubscriptions: any;

	if (user.data.length > 0) {
		existingSubscriptions = subs.data
			.filter((sub) => sub.customer === user.data[0].id)
			.map((sub) => sub);
	}

	if (locals.pb.authStore.isValid) {
		if (existingSubscriptions.length > 0 && existingSubscriptions[0].status === 'active') {
			await locals.pb
				.collection('users')
				.update(locals?.pb?.authStore?.model?.id, { subscribed: true });
		} else {
			await locals.pb
				.collection('users')
				.update(locals?.pb?.authStore?.model?.id, { subscribed: false });
		}
	}

	const notifications = await locals.pb.collection('notifications').getFullList({
		filter: `user ~ "${locals?.pb?.authStore?.model?.id}"`,
		sort: '-created'
	});

	return {
		user: locals.user,
		globalNotifications: notifications,
		form: await superValidate(zod(formSchema))
	};
};
