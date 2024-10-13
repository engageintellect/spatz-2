<script lang="ts">
	import { onMount } from 'svelte';
	import { animateMainStagger } from '$lib/animations';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';

	let hidden = true;

	onMount(() => {
		hidden = false;
		animateMainStagger();
	});
</script>

<main
	class={`${hidden ? 'opacity-0' : ''} animate-item mx-auto max-w-lg rounded-lg p-2 md:border md:p-5 md:shadow`}
>
	<h1 class="animate-item text-3xl font-bold">payment success</h1>
	<p class="animate-item mt-5 text-lg">
		Thank you for your subscription! Your payment was successful.
	</p>
	<div class="animate-item mt-5 flex items-center justify-between gap-2">
		<Button href="/" variant="default" class="flex w-full items-center gap-2">
			<Icon icon="mdi:home" class="h-5 w-5" />
			<div>go home</div>
		</Button>
		<Button href="/subscriptions" variant="success" class="flex w-full items-center gap-2">
			<div>subscriptions</div>
			<Icon icon="mdi:arrow-right" class="h-5 w-5" />
		</Button>
	</div>
</main>
