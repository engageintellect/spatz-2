<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';

	const featureLinks = [
		{
			title: 'Feature 1',
			description: 'This is a description of feature 1'
		},
		{
			title: 'Feature 2',
			description: 'This is a description of feature 2'
		},
		{
			title: 'Feature 3',
			description: 'This is a description of feature 3'
		},
		{
			title: 'Feature 4',
			description: 'This is a description of feature 4'
		}
	];
</script>

<div class="grid grid-cols-4 gap-2">
	{#each featureLinks as feature}
		<div class="">
			<Button variant="outline" class="w-full">{feature.title}</Button>
		</div>
	{/each}
</div>
