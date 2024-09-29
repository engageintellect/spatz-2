<script lang="ts">
	import { loadStripe, type Stripe } from '@stripe/stripe-js';
	import { onMount } from 'svelte';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { Button } from '$lib/components/ui/button/index.js';

	let stripePromise: Promise<Stripe | null> | undefined;

	let priceId = 'price_1Q3QwrE4bCkGAYMh3D3CniKP'; // Set this to your subscription price ID.
	let customerId = 'cus_QhkTWvcvYYhVwF'; // Get this from your application logic.

	onMount(() => {
		// Load Stripe on mount
		stripePromise = loadStripe(PUBLIC_STRIPE_KEY);
	});

	async function handleSubscribe() {
		const stripe = await stripePromise;
		if (!stripe) {
			console.error('Stripe failed to load');
			return;
		}

		try {
			const response = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ priceId, customerId })
			});
			const { sessionId } = await response.json();
			if (sessionId) {
				await stripe.redirectToCheckout({ sessionId });
			}
		} catch (err) {
			console.error('An error occurred:', err);
		}
	}
</script>

<div class="subscription-card">
	<main class="mx-auto max-w-lg rounded-lg border p-5 shadow-md transition-all duration-300">
		<h1 class="text-4xl font-bold">Subscribe</h1>
		<p class="mt-4 text-lg">Choose your subscription plan to enjoy all our premium features.</p>

		<Button on:click={handleSubscribe} class="mt-5">Subscribe Now</Button>
	</main>
</div>
