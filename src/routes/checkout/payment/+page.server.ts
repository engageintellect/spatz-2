import { stripe } from '$lib/stripe';
import type { Cookies } from '@sveltejs/kit';

export async function load({ url, cookies }: { url: URL; cookies: Cookies }) {
	let customerId = cookies.get('customerId') || '';
	let priceId = url.searchParams.get('priceId') || '';
	customerId = 'cus_QhkTWvcvYYhVwF';
	priceId = 'price_1Q3QwrE4bCkGAYMh3D3CniKP';

	if (!customerId || !priceId) {
		throw new Error('Customer ID or Price ID is missing.');
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

	return {
		clientSecret: clientSecret ?? null
	};
}
