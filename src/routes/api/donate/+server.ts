import { json, type RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';
import { SECRET_STRIPE_KEY } from '$env/static/private';

const stripe = new Stripe(SECRET_STRIPE_KEY, {
	apiVersion: '2024-06-20'
});

export const POST: RequestHandler = async ({ request }) => {
	const { amount }: { amount: number } = await request.json();

	console.log('this is your amount', amount);

	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount * 100, // Stripe uses the smallest currency unit, e.g., cents
			currency: 'usd'
		});

		return json({ clientSecret: paymentIntent.client_secret });
	} catch (error) {
		return json({ error: (error as Error).message }, { status: 500 });
	}
};
