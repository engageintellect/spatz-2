<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import { animateMainStagger } from '$lib/animations';

	let hidden = true;

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
		<!-- Weekly Plan -->
		<div
			class="flex flex-col justify-between rounded-lg border p-5 shadow transition-shadow hover:shadow-lg"
		>
			<div>
				<h2 class="text-2xl font-bold">Weekly Plan</h2>
				<p class="mt-2 text-muted-foreground">Perfect for short-term needs.</p>
				<div class="mt-4 text-4xl font-bold">$1<span class="text-xl">/week</span></div>
				<ul class="mt-4 text-sm text-muted-foreground">
					<li class="flex items-center">
						<Icon icon="mdi:check" class="mr-2 h-5 w-5 text-green-500" />
						Access to all features
					</li>
					<li class="flex items-center">
						<Icon icon="mdi:check" class="mr-2 h-5 w-5 text-green-500" />
						Email support
					</li>
					<li class="flex items-center">
						<Icon icon="mdi:check" class="mr-2 h-5 w-5 text-green-500" />
						Cancel anytime
					</li>
				</ul>
			</div>
			<div class="pt-5">
				<Button
					href="/checkout"
					variant="default"
					class="flex w-full items-center justify-center gap-2"
				>
					<div>Choose Weekly</div>
				</Button>
			</div>
		</div>

		<!-- Monthly Plan -->
		<div
			class="flex flex-col justify-between rounded-lg border p-5 shadow transition-shadow hover:shadow-lg"
		>
			<div>
				<h2 class="text-2xl font-bold">Monthly Plan</h2>
				<p class="mt-2 text-muted-foreground">Ideal for ongoing projects.</p>
				<div class="mt-4 text-4xl font-bold">$3<span class="text-xl">/month</span></div>
				<ul class="mt-4 text-sm text-muted-foreground">
					<li class="flex items-center">
						<Icon icon="mdi:check" class="mr-2 h-5 w-5 text-green-500" />
						All weekly plan features
					</li>
					<li class="flex items-center">
						<Icon icon="mdi:check" class="mr-2 h-5 w-5 text-green-500" />
						Priority support
					</li>
					<li class="flex items-center">
						<Icon icon="mdi:check" class="mr-2 h-5 w-5 text-green-500" />
						Discount on future purchases
					</li>
				</ul>
			</div>
			<div class="pt-5">
				<Button
					href="/checkout"
					variant="success"
					class="flex w-full items-center justify-center gap-2"
				>
					<div>Choose Monthly</div>
				</Button>
			</div>
		</div>

		<!-- Yearly Plan -->
		<div
			class="flex flex-col justify-between rounded-lg border p-5 shadow transition-shadow hover:shadow-lg"
		>
			<div>
				<h2 class="text-2xl font-bold">Yearly Plan</h2>
				<p class="mt-2 text-muted-foreground">Best value for long-term users.</p>
				<div class="mt-4 text-4xl font-bold">$30<span class="text-xl">/year</span></div>
				<ul class="mt-4 text-sm text-muted-foreground">
					<li class="flex items-center">
						<Icon icon="mdi:check" class="mr-2 h-5 w-5 text-green-500" />
						All monthly plan features
					</li>
					<li class="flex items-center">
						<Icon icon="mdi:check" class="mr-2 h-5 w-5 text-green-500" />
						Dedicated account manager
					</li>
					<li class="flex items-center">
						<Icon icon="mdi:check" class="mr-2 h-5 w-5 text-green-500" />
						Free upgrades
					</li>
				</ul>
			</div>
			<div class="pt-5">
				<Button
					href="/checkout"
					variant="default"
					class="flex w-full items-center justify-center gap-2"
				>
					<div>Choose Yearly</div>
				</Button>
			</div>
		</div>
	</div>
</main>
