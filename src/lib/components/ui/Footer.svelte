<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const currentYear = new Date().getFullYear();
	import { companyInfo } from '$lib/data';

	let showFooter = false;

	onMount(() => {
		setTimeout(() => {
			showFooter = true;
		}, 500);
	});
</script>

{#if showFooter}
	<footer class="w-full border-t py-5" in:fade={{ duration: 1000 }}>
		<div class="mx-auto flex w-full max-w-5xl items-center justify-center">
			<a href="https://github.com/engageintellect" class="text-sm">
				&copy; {currentYear}
				{companyInfo.name}. All rights reserved.
			</a>
		</div>
	</footer>
{/if}
