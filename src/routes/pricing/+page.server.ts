// src/routes/checkout/+page.server.ts

import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { stripe } from '$lib/stripe';
import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}

	const subscriptionPlans = await locals.pb.collection('subscriptions').getFullList({
		sort: 'created'
	});

	console.log('subscriptionPlans:', subscriptionPlans);
	return {
		subscriptionPlans
	};
};

export const actions: Actions = {
	default: async ({ request, locals, cookies, url }) => {
		// Get form data
		const formData = await request.formData();
		const priceId = formData.get('priceId') as string;

		if (!priceId) {
			return fail(400, { error: 'Price ID is missing.' });
		}

		// Get the logged-in user's data
		const user = locals.pb.authStore.model;
		const email = user?.email;

		if (!email) {
			return fail(400, { error: 'User email is missing.' });
		}

		let customerId = user.stripeId;

		// Check if the customer ID already exists or if we need to create/find the customer
		if (!customerId) {
			try {
				// Search for an existing Stripe customer by email
				const customers = await stripe.customers.list({
					email,
					limit: 1
				});

				if (customers.data.length > 0) {
					customerId = customers.data[0].id;
				} else {
					// Create a new customer in Stripe
					const customer = await stripe.customers.create({
						email
					});
					customerId = customer.id;

					// Update the user's record in PocketBase with the new Stripe customer ID
					await locals.pb.collection('users').update(user.id, {
						stripeId: customerId
					});
				}
			} catch (err) {
				console.error('Error finding or creating Stripe customer:', err);
				return fail(500, { error: 'Failed to find or create a Stripe customer.' });
			}
		}

		if (!customerId) {
			return fail(400, { error: 'Customer ID is missing.' });
		}

		const subscription = await stripe.subscriptions.create({
			customer: customerId,
			items: [
				{
					price: priceId
				}
			],
			payment_behavior: 'default_incomplete',
			payment_settings: {
				save_default_payment_method: 'on_subscription'
			},
			expand: ['latest_invoice.payment_intent']
		});

		const latestInvoice = subscription.latest_invoice;

		let clientSecret = null;

		// Ensure latest_invoice and payment_intent exist, and payment_intent is an object
		if (
			latestInvoice &&
			typeof latestInvoice === 'object' &&
			latestInvoice.payment_intent &&
			typeof latestInvoice.payment_intent === 'object'
		) {
			clientSecret = latestInvoice.payment_intent.client_secret;
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			customer: customerId,
			line_items: [
				{
					price: priceId,
					quantity: 1
				}
			],
			mode: 'subscription',
			success_url: `${PUBLIC_BASE_URL}/checkout/success`,
			cancel_url: `${PUBLIC_BASE_URL}/checkout/cancel`
		});

		throw redirect(303, session.url ?? '/');
	}
};
