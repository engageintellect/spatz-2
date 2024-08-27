<script lang="ts">
	import { loadStripe, type Stripe } from '@stripe/stripe-js';
	import { onMount } from 'svelte';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';

	let stripePromise: Promise<Stripe | null> | undefined;
	let amount: number = 0;

	onMount(() => {
		stripePromise = loadStripe(PUBLIC_STRIPE_KEY);
	});

	async function handleDonate(): Promise<void> {
		const stripe = await stripePromise;
		if (!stripe) {
			console.error('Stripe failed to load');
			return;
		}

		try {
			const response = await fetch('/api/donate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ amount })
			});

			if (!response.ok) {
				console.error('Error creating Stripe session:', response.statusText);
				return;
			}

			const { sessionId }: { sessionId: string } = await response.json();

			if (!sessionId) {
				console.error('No session ID returned from the API');
				return;
			}

			const { error } = await stripe.redirectToCheckout({ sessionId });

			if (error) {
				console.error('Error redirecting to checkout:', error.message);
			} else {
				console.log('Redirecting to checkout with session ID:', sessionId);
			}
		} catch (err) {
			console.error('An error occurred:', err);
		}
	}
</script>

<main>
	<h1>Donate</h1>
	<input type="number" bind:value={amount} placeholder="Enter amount" min="1" />
	<button on:click={handleDonate}>Donate ${amount}</button>
</main>
