<script lang="ts">
	import { loadStripe, type Stripe } from '@stripe/stripe-js';
	import { onMount } from 'svelte';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Icon from '@iconify/svelte';
	import { gsap } from 'gsap';

	let stripePromise: Promise<Stripe | null> | undefined;
	let amount: number;

	let prices = [1, 5, 10, 20, 50, 100];

	onMount(() => {
		stripePromise = loadStripe(PUBLIC_STRIPE_KEY);
		gsap.fromTo(
			'.donate-card',
			{ opacity: 0, y: 20, scale: 0.95 },
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 1,
				delay: 0.1,
				ease: 'power4.out'
			}
		);

		gsap.fromTo(
			'.donate-button',
			{ opacity: 0, scale: 0.95 },
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 2,
				delay: 0.1,
				ease: 'power4.out',
				stagger: 0.1
			}
		);
	});

	async function handleDonate(): Promise<void> {
		const stripe = await stripePromise;
		if (!stripe) {
			console.error('Stripe failed to load');
			return;
		}

		try {
			const theme = localStorage.getItem('mode-watcher-mode') || 'light';

			const response = await fetch('/api/donate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ amount, theme })
			});

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

	function donationMessage(amount: number): string {
		const boldAmount = `<span class="font-bold bg-success text-success-foreground py-1 px-2 rounded-lg">$${amount === null ? '0' : amount}</span>`;
		if (amount === null || amount === undefined)
			return 'Enter an amount to donate, or choose from the options below.';
		if (amount === 0 || amount === null || amount === undefined)
			return 'You have chosen not to donate at this time.';
		if (amount === 1) return `Thank you for your ${boldAmount} donation! Every bit helps.`;
		if (amount <= 5) return `Your ${boldAmount} donation is greatly appreciated!`;
		if (amount <= 10) return `Thank you for your ${boldAmount} donation! Your support means a lot.`;
		if (amount <= 15)
			return `Thank you for your ${boldAmount} donation! You're making a difference.`;
		if (amount <= 20)
			return `Thank you for your ${boldAmount} donation! We are grateful for your generosity.`;
		if (amount <= 25)
			return `Wow, a ${boldAmount} donation! Thank you for your incredible support.`;
		if (amount <= 50) return `A ${boldAmount} donation is amazing! Thank you for your generosity.`;
		if (amount <= 100)
			return `Your ${boldAmount} donation is deeply appreciated. Thank you for your outstanding support!`;

		return `You are donating ${boldAmount}. Thank you for your contribution!`;
	}
</script>

<div class="donate-card">
	<main
		class="mx-auto max-w-lg rounded-lg p-2 transition-all duration-300 md:border md:p-5 md:shadow"
	>
		<h1 class="text-5xl font-bold md:text-7xl">donate</h1>

		<div class="mt-10">
			<p>{@html donationMessage(amount)}</p>

			<div class="mt-5 flex items-center gap-2">
				<Input
					type="number"
					bind:value={amount}
					class="focus:outline-none"
					placeholder="Enter amount"
					min="1"
				/>

				<Button on:click={handleDonate} class="group/donateButton">
					<div class="flex items-center gap-2">
						<div>donate</div>
						<Icon
							icon="mdi:send"
							class="h-5 w-5 transition-all duration-300 md:active:animate-bounce md:group-hover/donateButton:translate-x-1 md:group-hover/donateButton:-rotate-45"
						/>
					</div>
				</Button>
			</div>
		</div>

		<div class="mt-10 grid grid-cols-2 gap-2 md:grid-cols-3">
			{#each prices as price}
				<Button
					variant="success"
					class="donate-button transition-transform duration-300 md:hover:scale-[102%] md:hover:shadow"
					on:click={() => {
						amount = price;
						handleDonate();
					}}
				>
					<div>$ {price}</div>
				</Button>
			{/each}
		</div>
	</main>
</div>
