<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Nav from '$lib/components/ui/Nav.svelte';
	import type { PageData } from './$types';
	import Footer from '$lib/components/ui/Footer.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from '$lib/stores/toast';
	import Command from '$lib/components/ui/Command.svelte';
	import { currentUser } from '$lib/stores/user';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data: PageData;
	$: currentUser.set(data.user);

	afterNavigate(() => {
		window.scrollTo(0, 0); // Ensure scroll resets to top after navigating
	});

	onMount(() => {
		window.scrollTo(0, 0); // Ensure scroll resets to top when the component mounts

		// Disable scroll restoration in browsers that support it
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		}
	});
</script>

<ModeWatcher defaultMode={'dark'} />
<Toaster position="bottom-right" richColors={true} />
<Toast icon={$toast.icon} type={$toast.type} message={$toast.message} show={$toast.show} />

{#if $currentUser}
	<Command />
{/if}

<!-- Adjusted Layout with min-h-screen -->
<div class="flex min-h-[calc(100vh)] flex-col">
	<Nav />
	<main class="mx-auto my-5 w-full max-w-5xl flex-grow px-2 md:my-10">
		<slot />
	</main>
	<Footer />
</div>

<style>
	html,
	body {
		height: 100%;
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}
</style>
