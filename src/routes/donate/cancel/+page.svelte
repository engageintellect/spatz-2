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
	class={`${hidden ? 'opacity-0' : ''} animate-item mx-auto max-w-lg rounded-lg p-2 md:border md:p-5 md:shadow`}
>
	<h1 class="animate-item text-3xl font-bold">payment canceled</h1>
	<p class="animate-item mt-4 text-lg">
		It looks like your payment was cancelled. If this was a mistake, you can try again.
	</p>
	<div class="animate-item mt-5 flex items-center justify-between gap-2">
		<Button href="/" variant="default" class="flex w-full items-center gap-2">
			<Icon icon="mdi:home" class="h-5 w-5" />
			<div>go home</div>
		</Button>
		<Button href="/donate" variant="success" class="flex w-full items-center gap-2">
			<div>try again</div>
			<Icon icon="mdi:arrow-right" class="h-5 w-5" />
		</Button>
	</div>
</main>
