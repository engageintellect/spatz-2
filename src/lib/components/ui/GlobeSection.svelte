<script lang="ts">
	import { onMount } from 'svelte';
	import type { ComponentType } from 'svelte';
	
	let GlobeComponent: any = null;
	let isLoaded = false;

	onMount(async () => {
		// Lazy load the Globe component
		const module = await import('$lib/components/magic-ui/Globe.svelte');
		GlobeComponent = module.default;
		isLoaded = true;
	});
</script>

<div class="flex h-full w-full items-center justify-center">
	<div
		class="relative flex h-fit w-full max-w-full items-center justify-center overflow-hidden rounded-lg bg-background px-40 pb-40 pt-8 md:pb-60"
	>
		{#if isLoaded && GlobeComponent}
			<svelte:component this={GlobeComponent} class="top-0" />
		{:else}
			<!-- Loading placeholder -->
			<div class="flex h-64 w-64 items-center justify-center rounded-full bg-muted animate-pulse">
				<div class="text-sm text-muted-foreground">Loading...</div>
			</div>
		{/if}
		<div class="pointer-events-none absolute inset-0 h-full"></div>
	</div>
</div>
