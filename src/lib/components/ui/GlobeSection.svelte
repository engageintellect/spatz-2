<script>
	import Globe from '$lib/components/magic-ui/Globe.svelte';
</script>

<div class="flex h-full w-full items-center justify-center">
	<div
		class="relative flex h-fit w-full max-w-full items-center justify-center overflow-hidden rounded-lg bg-background px-40 pb-40 pt-8 md:pb-60"
	>
		<Globe class="top-0" />
		<div class="pointer-events-none absolute inset-0 h-full"></div>
	</div>
</div>
