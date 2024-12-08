<script lang="ts">
	import { formatFriendlyDate } from '$lib/utils';
	const { data }: any = $props();
	import { currentUser } from '$lib/stores/user';
	import { animateMainStagger } from '$lib/animations';
	import { formatFloatToPrice } from '$lib/utils';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import NumberTicker from '$lib/components/ui/NumberTicker.svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js'; // Adjust the path as needed
	import { buttonVariants } from '$lib/components/ui/button/index';
	import * as Tooltip from '$lib/components/ui/tooltip/index';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let sidebar = useSidebar(); // Initialize the sidebar

	$effect(() => {
		animateMainStagger();
	});

	// Chart.js integration
	let chartCanvas: HTMLCanvasElement | null = null;
	let lineChart: any = null;

	const getTailwindColor = (className: string): string => {
		const tempDiv = document.createElement('div');
		tempDiv.className = className;
		document.body.appendChild(tempDiv);

		// Get the computed style color
		const color = getComputedStyle(tempDiv).color;

		// Remove the temporary element
		document.body.removeChild(tempDiv);

		return color;
	};

	// Initialize the chart on mount
	import('chart.js/auto').then(({ default: Chart }) => {
		if (chartCanvas) {
			const closePrices = data.predictionsWithAccuracy
				.slice(-72)
				.map((prediction: any) => prediction.closePrice);
			const dates = data.predictionsWithAccuracy
				.slice(-72)
				.map((prediction: any) => formatFriendlyDate(prediction.date));

			// Get colors dynamically from Tailwind classes
			const borderColor = getTailwindColor('text-muted-foreground dark:text-muted-foreground');
			const backgroundColor = getTailwindColor('bg-foreground dark:bg-foreground');

			lineChart = new Chart(chartCanvas, {
				type: 'line',
				data: {
					labels: dates,
					datasets: [
						{
							label: 'Close Prices (USD)',
							data: closePrices,
							borderColor,
							backgroundColor,
							tension: 0.4,
							fill: true
						}
					]
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							display: true,
							position: 'top'
						}
					},
					scales: {
						x: {
							title: {
								display: true,
								text: 'Date'
							},
							ticks: {
								autoSkip: true,
								maxTicksLimit: 12
							}
						},
						y: {
							title: {
								display: true,
								text: 'Close Price (USD)'
							}
						}
					}
				}
			});
		}
	});

	// Clean up chart instance on unmount
	$effect(() => {
		if (lineChart) {
			lineChart.destroy();
		}
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
	class={`${sidebar.state === 'expanded' ? 'lg:mt-5 lg:border lg:p-5' : 'md:mt-5 md:border md:p-5'} animate-item mx-auto my-5 max-w-2xl rounded-lg`}
>
	<div class="flex flex-col gap-10">
		<div>
			<div class="animate-item text-6xl">
				<span class="font-bold">btc</span> <span class="font-thin">predict</span>
			</div>
			<div class="animate-item mt-5 text-2xl text-muted-foreground">
				{data.predictions.predictions[data.predictions.predictions.length - 1].date}
			</div>
		</div>

		<!-- Chart Section -->
		<div class="animate-item">
			<h2 class="mb-5 text-3xl font-bold">Close Prices (Last 72 Days)</h2>
			<canvas bind:this={chartCanvas} class="h-64 w-full"></canvas>
		</div>

		{#if $currentUser.subscribed}
			<div class="flex flex-col gap-5">
				<div class="animate-item animate-item text-lg">
					You must subscribe to view prediction models
				</div>
				<Button variant="success" class="animate-item w-fit" href="/subscriptions"
					>Subscription Plans</Button
				>
			</div>
		{:else}
			<div class="animate-item flex-flex-col">
				<div class=" mb-2 text-3xl font-bold">about:</div>
				<p class="text-muted-foreground">
					'btc predict' is a machine learning model designed to forecast whether Bitcoin's price
					will rise or fall by the end of the next day. This can be useful for traders who want to
					help form their daily bias.
				</p>
			</div>

			<!-- Prediction Accuracy Section -->
			<div class="animate-item flex-flex-col">
				<div class=" mb-2 text-3xl font-bold">prediction accuracy:</div>
				<p class="text-muted-foreground">
					Prediction accuracy is calculated by past correct predictions till today.
				</p>

				<div class="animate-item mt-5 text-7xl font-bold">
					<div class="">
						<NumberTicker value={Number(data.predictions.predictionAccuracy.replace('%', ''))} />
						<span> % </span>
					</div>
					<div class="mt-2 text-xl font-thin text-muted-foreground">
						over the last {data.predictions.predictions.length} days.
					</div>
				</div>
			</div>

			<!-- Tooltip Section (Unchanged) -->
			<div class="animate-item flex items-center gap-2">
				<div class="mt-5 grid w-full grid-cols-12 gap-1">
					{#each data.predictionsWithAccuracy.slice(-72) as prediction}
						<Tooltip.Provider delayDuration={100}>
							<Tooltip.Root disableCloseOnTriggerClick>
								<Tooltip.Trigger
									class={`h-8 w-full rounded p-2 text-sm ${
										prediction.wasCorrect === null
											? 'animate-pulse border border-muted-foreground/50 bg-background'
											: prediction.wasCorrect === false
												? 'bg-destructive hover:bg-red-300'
												: 'bg-success hover:bg-emerald-300'
									} ${buttonVariants({ variant: 'outline' })}`}
								></Tooltip.Trigger>
								<Tooltip.Content>
									<div>
										<div class="flex items-center gap-2">
											<div>Date:</div>
											<div class="font-bold">{formatFriendlyDate(prediction.date)}</div>
										</div>
										<div class="mt-2 text-sm">
											<div class="flex items-center gap-2">
												<div>Open:</div>
												<div class="font-bold">{formatFloatToPrice(prediction.openPrice)}</div>
											</div>
											<div class="flex items-center gap-2">
												<div>Close:</div>
												<div class="font-bold">{formatFloatToPrice(prediction.closePrice)}</div>
											</div>
										</div>
									</div>
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.Provider>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
