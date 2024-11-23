<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let showButton = $state(false);

	function checkScroll() {
		showButton = window.scrollY > 100;
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	onMount(() => {
		window.addEventListener('scroll', checkScroll);
		return () => {
			window.removeEventListener('scroll', checkScroll);
		};
	});
</script>

{#if showButton}
	<div transition:fade={{ duration: 500 }} class="fixed bottom-3 p-2">
		<Button variant="default" onclick={scrollToTop} class="flex items-center gap-2 shadow-lg">
			<div class="uppercase">scroll to top</div>
			<Icon icon="mdi-arrow-up" class="h-5 w-5" />
		</Button>
	</div>
{/if}
