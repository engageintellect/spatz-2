<script lang="ts">
	const { data }: any = $props();
	import { currentUser } from '$lib/stores/user';
	import { animateMainStagger } from '$lib/animations';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import NumberTicker from '$lib/components/ui/NumberTicker.svelte';

	$effect(() => {
		animateMainStagger();
	});
</script>

<div class="mx-auto flex max-w-2xl justify-between">
	<Button
		onclick={() => window.history.back()}
		size="sm"
		variant="outline"
		class="group/backButton backButton flex items-center gap-2"
	>
		<Icon
			icon="mdi:arrow-left"
			class="h-5 w-5 transition-all duration-300 md:group-hover/backButton:-translate-x-1"
		/>
		<span class="text-sm">back</span>
	</Button>
</div>
<div class="mx-auto max-w-lg p-2">
	<div class=" flex flex-col gap-10">
		<div class="animate-item text-6xl">bitcoin model</div>

		{#if !$currentUser.subscribed}
			<div class="animate-item">
				date: {data.predictions.predictions[data.predictions.predictions.length - 1].Date}
			</div>

			<div class="animate-item flex-flex-col">
				<div class=" text-2xl font-bold">about:</div>
				<p class="text-muted-foreground">
					Prediction accuracy is calculated by past correct predictions till today.
				</p>
			</div>

			<div class="animate-item flex-flex-col">
				<div class=" text-2xl font-bold">prediction accuracy:</div>
				<p class="text-muted-foreground">
					Prediction accuracy is calculated by past correct predictions till today.
				</p>

				<div class="animate-item text-7xl font-bold">
					<NumberTicker value={Number(data.predictions.predictionAccuracy.replace('%', ''))} />
					<span> % </span>
				</div>
			</div>

			<div class="">
				<div class="animate-item flex-flex-col">
					<div class=" text-2xl font-bold">prediction:</div>
					<p class="text-muted-foreground">
						Prediction direction is calculated by past correct predictions till today.
					</p>
				</div>

				<div class="animate-item flex items-center gap-5">
					<div class="text-7xl">
						{data.predictions.predictions[data.predictions.predictions.length - 1].Prediction}
					</div>

					<div>
						<Icon
							icon={data.predictions.predictions[data.predictions.predictions.length - 1]
								.Prediction === 'DOWN'
								? 'mdi:arrow-down'
								: 'mdi:arrow-up'}
							class={data.predictions.predictions[data.predictions.predictions.length - 1]
								.Prediction === 'DOWN'
								? 'text-7xl text-destructive'
								: 'text-7xl text-success'}
						/>
					</div>
				</div>
			</div>
		{:else}
			<div>
				<div class="animate-item animate-item text-2xl">subscribe to view predictions</div>
				<Button class="animate-item" href="/subscriptions">Subscription Plans</Button>
			</div>
		{/if}
	</div>
</div>
