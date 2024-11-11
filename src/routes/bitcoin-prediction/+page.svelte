<script lang="ts">
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
		<div>
			<div class="animate-item text-6xl">
				<span class="font-bold">btc</span> <span class="font-thin">predict</span>
			</div>
			<div class="animate-item mt-5 text-2xl text-muted-foreground">
				{data.predictions.predictions[data.predictions.predictions.length - 1].Date}
			</div>
		</div>

		{#if !$currentUser.subscribed}
			<div class="animate-item flex-flex-col">
				<div class=" text-2xl font-bold">about:</div>

				<p class="text-muted-foreground">
					'btc predict' is a machine learning model designed to forecast whether Bitcoin's price
					will rise or fall by the end of the next day. This can be useful for traders who want to
					help form their daily bias.
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

				<div class="animate-item flex items-center gap-2">
					<div class="mt-5 grid w-full grid-cols-12 gap-1">
						{#each data.predictionsWithAccuracy as prediction}
							<Tooltip.Provider delayDuration={200}>
								<Tooltip.Root>
									<Tooltip.Trigger
										class={`h-8 w-full rounded p-2 text-sm ${prediction.Was_Correct === false ? 'bg-destructive hover:bg-red-300' : 'bg-success hover:bg-emerald-300'} ${buttonVariants({ variant: 'outline' })}`}
									></Tooltip.Trigger>
									<Tooltip.Content>
										<div class="">
											<div class="flex items-center gap-2">
												<div class="">Date:</div>
												<div class="font-bold">{prediction.Date}</div>
											</div>

											<div class="mt-2 text-sm">
												<div class="flex items-center gap-2">
													<div class="">Open:</div>

													<div class="font-bold">
														{formatFloatToPrice(prediction.Open_Price)}
													</div>
												</div>
												<div class="flex items-center gap-2">
													<div class="">Close:</div>

													<div class="font-bold">
														{formatFloatToPrice(prediction.Close_Price)}
													</div>
												</div>
											</div>

											<div class="mt-2 text-sm">
												<div class="flex items-center gap-2">
													<div>Prediction:</div>
													<div class="font-bold">
														{prediction.Prediction}
													</div>
												</div>

												<div class="flex items-center gap-2">
													<div>Result:</div>

													<div class="font-bold">
														{prediction.Was_Correct ? 'Correct' : 'Incorrect'}
													</div>

													<Icon
														icon={prediction.Was_Correct ? 'mdi:check' : 'mdi:close'}
														class={`h-4 w-4 ${prediction.Was_Correct ? 'text-success' : 'text-destructive'}`}
													/>
												</div>
											</div>
										</div>
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>
						{/each}
					</div>
				</div>
			</div>

			<div class="">
				<div class="animate-item flex-flex-col">
					<div class=" text-2xl font-bold">prediction:</div>
					<p class="text-muted-foreground">
						Tommorow's "Close Price" prediction direction is calculated by past correct predictions
						till today.
					</p>
				</div>

				<div class="animate-item mt-5 flex items-center gap-2">
					<Badge variant="outline" class="px-6 py-2">
						<div class="text-5xl">
							{data.predictions.predictions[data.predictions.predictions.length - 1].Prediction ===
							'UP'
								? 'BUY'
								: 'SELL'}
						</div>

						<div>
							<Icon
								icon={data.predictions.predictions[data.predictions.predictions.length - 1]
									.Prediction === 'DOWN'
									? 'mdi:arrow-down'
									: 'mdi:arrow-up'}
								class={data.predictions.predictions[data.predictions.predictions.length - 1]
									.Prediction === 'DOWN'
									? 'text-5xl text-destructive'
									: 'text-5xl text-success'}
							/>
						</div>
					</Badge>
				</div>
			</div>

			<div class="">
				<div class="animate-item flex-flex-col">
					<div class=" text-2xl font-bold">sentiment:</div>

					<div class="mt-5 flex items-center gap-2">
						<div class="">
							<div
								class={`${data.sentiment.data[0].value > 50 ? 'text-destructive' : 'text-success'} flex items-center gap-2 text-2xl`}
							>
								<div class="font-bold">
									{data.sentiment.data[0].value_classification}
								</div>

								<Badge size="lg">
									{data.sentiment.data[0].value} / 100
								</Badge>
							</div>
						</div>
					</div>

					<div class="flex flex-col gap-2 text-muted-foreground">
						<p>
							The crypto market behaviour is very emotional. People tend to get greedy when the
							market is rising which results in FOMO (Fear of missing out). Also, people often sell
							their coins in irrational reaction of seeing red numbers. With our Fear and Greed
							Index, we try to save you from your own emotional overreactions. There are two simple
							assumptions:
						</p>

						<ul class="list-disc pl-10">
							<li>
								Extreme fear can be a sign that investors are too worried. That could be a buying
								opportunity.
							</li>

							<li>
								When Investors are getting too greedy, that means the market is due for a
								correction.
							</li>
						</ul>

						<p>
							Therefore, we analyze the current sentiment of the Bitcoin market and crunch the
							numbers into a simple meter from 0 to 100. Zero means "Extreme Fear", while 100 means
							"Extreme Greed".
						</p>
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
