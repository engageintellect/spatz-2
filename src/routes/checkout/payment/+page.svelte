<!-- in src/routes/checkout/payment/+page.svelte -->
<script lang="ts">
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { Elements, PaymentElement } from 'svelte-stripe';

	// data from server
	export let data;

	let clientSecret = PUBLIC_STRIPE_KEY;
	let returnUrl = '/checkout/success';

	// destructure server data
	$: data;

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
		// ask Stripe to confirm the payment
		const { error } = await stripe.confirmPayment({
			// pass instance that was used to create the Payment Element
			elements,

			// specify where to send the user when payment succeeeds
			confirmParams: {
				return_url: returnUrl
			}
		});

		if (error) {
			// handle error
			console.error(error);
		}
	}
</script>

<h1>Payment</h1>

{#if stripe}
	<form on:submit|preventDefault={submit}>
		<!-- container for Stripe components -->
		<Elements {stripe} {clientSecret} bind:elements>
			<!-- display payment related fields -->
			<PaymentElement />
		</Elements>

		<button>Pay</button>
	</form>
{:else}
	Loading Stripe...
{/if}
