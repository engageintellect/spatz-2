<script lang="ts">
	import { formatFriendlyDate } from '$lib/utils';
	// Chart.js integration
	import type { Chart } from 'chart.js';

	import { useSidebar } from '$lib/components/ui/sidebar/index.js';

	let sidebar: any = $state(useSidebar());

	console.log('sidebar', sidebar.state);

	let chartCanvas: HTMLCanvasElement | null = null;
	let lineChart: Chart | null = null;

	// Define the shape of the `data` object
	interface Prediction {
		closePrice: number;
		date: string;
	}
	interface Props {
		data: {
			predictionsWithAccuracy: Prediction[];
		};
	}

	// Extract `data` with proper typing
	let { data }: Props = $props();

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
				.map((prediction) => prediction.closePrice);
			const dates = data.predictionsWithAccuracy
				.slice(-72)
				.map((prediction) => formatFriendlyDate(prediction.date));

			// Get colors dynamically from Tailwind classes
			const borderColor = getTailwindColor('text-neutral-500');
			const backgroundColor = getTailwindColor('text-neutral-300');

			lineChart = new Chart(chartCanvas, {
				type: 'line',
				data: {
					labels: dates,
					datasets: [
						{
							label: 'Close Price (USD)',
							data: closePrices,
							borderColor,
							backgroundColor,
							tension: 0.5,
							fill: false
						}
					]
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							display: false,
							position: 'top'
						},
						title: { display: false }
					},

					scales: {
						x: {
							display: false,
							grid: { display: false }
						},
						y: {
							ticks: {
								align: 'end',
								color: '#fff',
								callback: (value: any) => {
									return '$' + value.toFixed(2);
								}
							},
							display: false,
							position: 'right',
							grid: {
								display: false
							},
							border: {
								color: '#fff'
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

TODO: Fix overflow bug when the sidebar opens/closes in tablet view

<canvas bind:this={chartCanvas} class="h-full max-h-64 w-full rounded-lg p-2"></canvas>
