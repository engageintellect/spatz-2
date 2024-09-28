<script lang="ts">
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { Elements, PaymentElement } from 'svelte-stripe';
	import { Button } from '$lib/components/ui/button/index.js';

	let returnUrl = 'http://localhost:5173';

	// data from server
	export let data;

	// destructure server data
	$: ({ clientSecret } = data);

	const appearance = {
		theme: 'flat'
	};

	// Stripe instance
	let stripe: any;

	// Stripe Elements instance
	let elements: any;

	// when component mounts
	onMount(async () => {
		// load the Stripe client
		stripe = await loadStripe(PUBLIC_STRIPE_KEY);
	});

	// handle form submission
	async function submit() {
		if (!stripe || !elements) {
			console.error('Stripe or Elements is not loaded');
			return;
		}

		// ask Stripe to confirm the payment
		const { error } = await stripe.confirmPayment({
			// pass instance that was used to create the Payment Element
			elements,

			// specify where to send the user when payment succeeds
			confirmParams: {
				return_url: returnUrl
			}
		});

		if (error) {
			// handle error
			console.error('Payment confirmation error:', error);
		}
	}
</script>

<div class="mx-auto max-w-2xl p-2 md:p-5">
	<h1>Payment</h1>

	{#if stripe}
		<form on:submit|preventDefault={submit}>
			<!-- container for Stripe components -->
			<Elements
				{stripe}
				{clientSecret}
				theme="flat"
				labels="floating"
				variables={{ colorPrimary: '#7c4dff' }}
				bind:elements
			>
				<!-- display payment related fields -->
				<PaymentElement />
			</Elements>

			<div class="w-full max-w-md">
				<Button class="w-full">Pay</Button>
			</div>
		</form>
	{:else}
		Loading Stripe...
	{/if}
</div>
