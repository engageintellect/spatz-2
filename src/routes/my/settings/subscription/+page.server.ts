// src/routes/subscriptions/+page.server.ts

import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { stripe } from '$lib/stripe';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}

	const products = await stripe.products.list();
	const subs = await stripe.subscriptions.list();
	const pbSubscriptions = await locals.pb.collection('subscriptions').getFullList({
		sort: 'created'
	});

	const user = await stripe.customers.list({
		email: locals?.pb?.authStore?.model?.email,
		limit: 1
	});

	let existingSubscriptions;

	if (user.data.length > 0) {
		existingSubscriptions = subs.data
			.filter((sub) => sub.customer === user.data[0].id)
			.map((sub) => sub);
	}

	return {
		pbSubscriptions: pbSubscriptions,
		products: products,
		existingSubscriptions: existingSubscriptions
	};
};

export const actions: Actions = {
	cancelSubscription: async ({ request, locals }) => {
		const formData = await request.formData();
		const subId = formData.get('subId') as string;

		if (!subId) {
			return fail(400, { error: 'Subscription ID is missing.' });
		}

		// Check if the user is authenticated
		if (!locals.pb.authStore.isValid) {
			throw redirect(303, '/auth/login');
		}

		try {
			// Cancel the subscription immediately
			const canceledSubscription = await stripe.subscriptions.cancel(subId);

			console.log('Canceled Subscription:', canceledSubscription);

			// Redirect back to the subscription page with a success message
			return {
				success: true,
				message: 'Subscription successfully canceled.'
			};
		} catch (err) {
			console.error('Error canceling subscription:', err);
			return fail(500, { error: 'Failed to cancel subscription.' });
		}
	},

	manageSubscription: async ({ request, locals }) => {
		if (!locals.pb.authStore.isValid) {
			throw redirect(303, '/auth/login');
		}

		const user = locals.pb.authStore.model;
		const email = user?.email;

		if (!email) {
			return fail(400, { error: 'User email is missing.' });
		}

		let customerId;

		try {
			const customers = await stripe.customers.list({
				email,
				limit: 1
			});

			if (customers.data.length > 0) {
				customerId = customers.data[0].id;
			} else {
				return fail(400, { error: 'Stripe customer not found.' });
			}
		} catch (err) {
			console.error('Error finding Stripe customer:', err);
			return fail(500, { error: 'Failed to find the Stripe customer.' });
		}

		try {
			const portalSession = await stripe.billingPortal.sessions.create({
				customer: customerId,
				return_url: `${PUBLIC_BASE_URL}/account`
			});

			console.log('portalSession:', portalSession);

			// Return the URL to the client
			return {
				success: true,
				redirectUrl: portalSession.url
			};
		} catch (err) {
			console.error('Error creating billing portal session:', err);
			return fail(500, { error: 'Failed to open the billing portal.' });
		}
	}
};
