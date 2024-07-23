<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { companyInfo } from '$lib/data';

	let stuff: any;

	const getLikes = async () => {
		const res = await fetch('/api/scrape-tiktok');
		stuff = await res.json();
		return stuff;
	};

	onMount(async () => {
		getLikes();
	});
</script>

{#if stuff}
	<div in:fade={{ duration: 500 }} class="flex w-full items-center justify-center gap-5">
		<div class="flex items-center gap-1">
			<strong>{stuff.followers}</strong> followers, and <strong>{stuff.likes}</strong> likes on
			<a href={companyInfo.socials.tiktok.url} class="flex items-center gap-1">
				<div><strong>tiktok</strong></div>
				<Icon icon="ic:baseline-tiktok" class="text-xl" />
			</a>
		</div>
	</div>
{:else}
	<div class="flex w-full items-center justify-center gap-2">
		<Icon icon="svg-spinners:8-dots-rotate" class="" />
		<div class="animate-pulse">Calculating current social stats...</div>
	</div>
{/if}
