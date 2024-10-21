// src/routes/subscriptions/+page.server.ts

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

	//console.log('existingSubscriptions:', existingSubscriptions);

	return {
		pbSubscriptions: pbSubscriptions,
		products: products,
		existingSubscriptions: existingSubscriptions
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
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

		let customerId;

		// Check if the customer ID already exists or if we need to create/find the customer
		if (!customerId) {
			try {
				// Search for an existing Stripe customer by email
				const customers = await stripe.customers.list({
					email,
					limit: 1
				});

				//console.log('customers:', customers);

				if (customers.data.length > 0) {
					customerId = customers.data[0].id;
				} else {
					// Create a new customer in Stripe
					const customer = await stripe.customers.create({
						email
					});
					customerId = customer.id;
				}
			} catch (err) {
				console.error('Error finding or creating Stripe customer:', err);
				return fail(500, { error: 'Failed to find or create a Stripe customer.' });
			}
		}

		if (!customerId) {
			return fail(400, { error: 'Customer ID is missing.' });
		}

		const subs = await stripe.subscriptions.list({
			customer: customerId,
			status: 'all'
		});
		//console.log('subscriptions:', subs);

		//console.log('pb stripe id', locals?.pb?.authStore?.model);
		const hasSubscriptions = subs.data.filter(
			(sub) => sub.customer === customerId && sub.status !== 'incomplete_expired'
		);

		//console.log('has subscriptions:', hasSubscriptions.length);

		if (hasSubscriptions.length < 1 || hasSubscriptions[0].status === 'canceled') {
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
		} else {
			//console.log('You already have an active subscription.');
			return fail(400, { error: 'You already have an active subscription.' });
		}
	}
};
