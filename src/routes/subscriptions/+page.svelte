<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import { animateMainStagger } from '$lib/animations';
	import { loadStripe, type Stripe } from '@stripe/stripe-js';
	import { env } from '$env/dynamic/public';

	let stripePromise: Promise<Stripe | null> | undefined;
	stripePromise = loadStripe(env.PUBLIC_STRIPE_KEY);

	let hidden = true;
	export let data: {
		pbSubscriptions: Array<{
			cardTitle: string;
			cardDescription: string;
			price: number;
			type: string;
			cardData: string[];
			priceId: string;
			productId: any;
		}>;
		products: any;
		existingSubscriptions: any;
	};

	onMount(() => {
		hidden = false;
		animateMainStagger();
	});
</script>

<main
	class={`${hidden ? 'opacity-0' : ''} animate-item mx-auto max-w-4xl rounded-lg bg-background p-2 shadow-md md:border md:p-5`}
>
	<!-- Pricing Header -->

	<h1 class="animate-item text-center text-5xl font-bold lowercase">subscriptions</h1>

	{#if data.existingSubscriptions.length > 0}
		<div class="mt-5 flex flex-col items-center justify-between gap-5">
			<div class="animate-item text-center text-lg text-muted-foreground">
				You are currently subscribed to {data?.existingSubscriptions[0]?.plan?.interval}ly plan.
			</div>

			<Button href="/my/settings/subscription" class="animate-item">manage subscription</Button>
		</div>
	{:else}
		<p class="animate-item mt-4 text-center text-lg text-muted-foreground">
			Choose the plan that best suits your needs. No hidden fees, no surprises. Cancel at any time.
		</p>
	{/if}

	<!-- Pricing Options -->
	<div class="animate-item mt-10 grid gap-5 sm:grid-cols-1 md:grid-cols-3">
		{#each data.pbSubscriptions as plan}
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
						<input type="hidden" name="planType" value={plan.type} />
						<Button
							type="submit"
							variant={`${plan.type === 'month' ? 'success' : 'default'}`}
							class="flex w-full items-center justify-center gap-2"
						>
							<div>Choose <span class="capitalize">{plan.type}ly</span></div>
						</Button>
					</form>
				</div>
			</div>
		{/each}
	</div>
</main>
