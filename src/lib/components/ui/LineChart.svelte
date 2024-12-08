<script lang="ts">
	import { onMount } from 'svelte';

	let chartCanvas: any | null = null;
	let lineChart: any = null;

	// Props as reactive state
	let labels: any = $state(); // X-axis labels (dates)
	let data: any = $state(); // Y-axis data (close prices)

	// Initialize the chart
	onMount(() => {
		import('chart.js/auto').then(({ default: Chart }) => {
			if (chartCanvas) {
				lineChart = new Chart(chartCanvas, {
					type: 'line',
					data: {
						labels,
						datasets: [
							{
								label: 'Close Prices (USD)',
								data,
								borderColor: 'rgba(75, 192, 192, 1)',
								backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
	});

	// Cleanup on unmount
	$effect(() => {
		if (lineChart) {
			lineChart.destroy();
		}
	});
</script>

<canvas bind:this={chartCanvas} class="h-64 w-full"></canvas>
