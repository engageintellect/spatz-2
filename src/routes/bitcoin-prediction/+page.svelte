<script lang="ts">
	const { data }: any = $props();
	import { currentUser } from '$lib/stores/user';
	import { animateMainStagger } from '$lib/animations';
	import { formatFloatToPrice } from '$lib/utils';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import NumberTicker from '$lib/components/ui/NumberTicker.svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js'; // Adjust the path as needed

	let sidebar = useSidebar(); // Initialize the sidebar

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
<div
	class={`${sidebar.state === 'expanded' ? 'lg:mt-5 lg:border lg:p-5' : 'md:mt-5 md:border md:p-5'} animate-item mx-auto mt-5 max-w-2xl rounded-lg`}
>
	<div class="mb-20 flex flex-col gap-10">
		<div class="animate-item text-6xl">
			<span class="font-bold">btc</span> <span class="font-thin">predict</span>
		</div>

		{#if !$currentUser.subscribed}
			<div class="animate-item">
				date: {data.predictions.predictions[data.predictions.predictions.length - 1].Date}
			</div>

			<div class="animate-item flex-flex-col">
				<div class=" text-2xl font-bold">about:</div>
				<p class="text-muted-foreground">
					'btc predict' is a machine learning model that predicts the direction that the price of
					Bitcoin will move and close at during the following day.
				</p>
			</div>

			<div class="animate-item flex-flex-col">
				<div class=" text-2xl font-bold">prediction accuracy:</div>
				<p class="text-muted-foreground">
					Prediction accuracy is calculated by past correct predictions till today.
				</p>

				<div class="animate-item mt-5 text-6xl font-bold">
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

				<div class="animate-item mt-5 flex items-center gap-2">
					<div class="text-6xl">
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
								? 'text-6xl text-destructive'
								: 'text-6xl text-success'}
						/>
					</div>
				</div>
			</div>

			<div class="">
				<div class="animate-item flex-flex-col">
					<div class=" text-2xl font-bold">history:</div>
					<p class="text-muted-foreground">
						Prediction history is calculated by past correct predictions till today.
					</p>
				</div>

				<div class="animate-item mt-5 flex items-center gap-2">
					<div class="grid w-full grid-cols-3 gap-2">
						{#each data.predictions.predictions.reverse() as prediction}
							<div
								class={`w-full rounded-lg border p-2 text-sm ${prediction.Prediction === 'DOWN' ? 'bg-destructive' : 'bg-success'}`}
							>
								<div>
									{prediction.Date}
								</div>
								<div>
									open: {formatFloatToPrice(prediction.Open_Price)}
								</div>
								<div>
									close: {formatFloatToPrice(prediction.Close_Price)}
								</div>

								<div>
									{prediction.Prediction}
								</div>
							</div>
						{/each}
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
