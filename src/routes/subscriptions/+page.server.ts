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

	// Fetch available products and subscriptions
	const products = await stripe.products.list();
	const subs = await stripe.subscriptions.list();
	const pbSubscriptions = await locals.pb.collection('subscriptions').getFullList({
		sort: 'created'
	});

	// Filter subscriptions belonging to the current customer
	let existingSubs = subs.data
		.filter((sub) => sub.customer === locals?.pb?.authStore?.model?.stripeId)
		.map((sub) => sub.id);

	console.log('Existing Subscriptions:', existingSubs);

	return {
		pbSubscriptions: pbSubscriptions,
		products: products,
		existingSubs: existingSubs
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// Get form data
		const formData = await request.formData();
		const priceId = formData.get('priceId') as string;
		const planType = formData.get('planType') as string;

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
						stripeId: customerId,
						subscribed: planType
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

		// Check if the user already has an existing subscription
		const subs = await stripe.subscriptions.list({
			customer: customerId,
			status: 'all'
		});

		const existingSubscription = subs.data.find(
			(sub) => sub.customer === customerId && sub.status !== 'canceled'
		);

		if (existingSubscription) {
			console.log('Existing Subscription found:', existingSubscription.id);

			// Check the status of the existing subscription
			if (
				existingSubscription.status === 'incomplete' ||
				existingSubscription.status === 'past_due'
			) {
				// If there's an existing incomplete or past_due subscription, use the latest invoice to complete payment
				const latestInvoice = await stripe.invoices.retrieve(
					existingSubscription.latest_invoice as string
				);

				if (latestInvoice.payment_intent && typeof latestInvoice.payment_intent === 'string') {
					const paymentIntent = await stripe.paymentIntents.retrieve(latestInvoice.payment_intent);

					if (
						paymentIntent.status === 'requires_payment_method' ||
						paymentIntent.status === 'requires_action'
					) {
						// Redirect the user to Stripe to complete payment
						const session = await stripe.checkout.sessions.create({
							payment_method_types: ['card'],
							mode: 'setup',
							customer: customerId,
							success_url: `${PUBLIC_BASE_URL}/checkout/success`,
							cancel_url: `${PUBLIC_BASE_URL}/checkout/cancel`
						});

						throw redirect(303, session.url ?? '/');
					}
				}
			} else {
				return fail(400, { error: 'You already have an active subscription.' });
			}
		}

		// If no existing subscription, create a new subscription
		try {
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

			// Redirect to the Stripe Checkout page
			throw redirect(303, session.url ?? '/');
		} catch (err) {
			console.error('Error creating Stripe checkout session:', err);
			return fail(500, { error: 'Failed to create Stripe checkout session.' });
		}
	}
};
