<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import { animateMainStagger } from '$lib/animations';
	import { currentUser } from '$lib/stores/user.js';
	import { loadStripe, type Stripe } from '@stripe/stripe-js';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';

	let stripePromise: Promise<Stripe | null> | undefined;

	stripePromise = loadStripe(PUBLIC_STRIPE_KEY);

	let hidden = true;
	export let data;

	onMount(() => {
		hidden = false;
		animateMainStagger();
	});
</script>

<main
	class={`${hidden ? 'opacity-0' : ''} animate-item mx-auto max-w-4xl rounded-lg bg-background p-2 shadow-md md:border md:p-5`}
>
	<!-- Pricing Header -->
	<h1 class="animate-item text-center text-5xl font-bold lowercase">pricing plans</h1>
	<p class="animate-item mt-4 text-center text-lg text-muted-foreground">
		Choose the plan that best suits your needs. No hidden fees, no surprises.
	</p>

	<!-- Pricing Options -->
	<div class="animate-item mt-10 grid gap-5 sm:grid-cols-1 md:grid-cols-3">
		{#each data.subscriptionPlans as plan}
			<div
				class="flex flex-col justify-between rounded-lg border p-5 transition-shadow hover:shadow"
			>
				<div>
					<h2 class="text-2xl font-bold">{plan.cardTitle}</h2>
					<p class="mt-2 text-muted-foreground">{plan.cardDescription}</p>
					<div class="mt-4 text-4xl font-bold">
						${plan.price}<span class="text-xl">/{plan.type}</span>
					</div>
					<ul class="mt-4 text-sm text-muted-foreground">
						{#each plan.cardData as item}
							<li class="items center flex">
								<Icon icon="mdi:check" class="mr-2 h-5 w-5 text-green-500" />
								{item}
							</li>
						{/each}
					</ul>
				</div>
				<div class="pt-5">
					<form method="POST">
						<input type="hidden" name="priceId" value={plan.priceId} />
						<Button
							type="submit"
							variant={`${plan.type === 'month' ? 'success' : 'default'}`}
							class="flex w-full items-center justify-center gap-2"
						>
							<div>Choose <span class="capitalize">{plan.type}ly</span></div></Button
						>
					</form>
				</div>
			</div>
		{/each}
	</div>
</main>
