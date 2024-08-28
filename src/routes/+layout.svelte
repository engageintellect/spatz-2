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

	// Force the page to scroll to the top on each navigation
	afterNavigate(() => {
		if (typeof window !== 'undefined') {
			window.scrollTo(0, 0);
		}
	});

	// Set the user data from the server
	export let data: PageData;
	$: currentUser.set(data.user);

	// Scroll to the top on initial mount (for mobile browsers)
	onMount(() => {
		if (typeof window !== 'undefined') {
			// Check if we're on a mobile device
			const isMobile = /Mobi|Android/i.test(navigator.userAgent);

			// If it's a mobile device, scroll to the top
			if (isMobile) {
				window.scrollTo(0, 0);
			}

			// Disable scroll restoration (prevents Chrome from trying to restore the scroll position)
			if ('scrollRestoration' in history) {
				history.scrollRestoration = 'manual';
			}
		}
	});

	// START VIEW TRANSITIONS API
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		// @ts-ignore <-- This is a private API so we need to ignore the TS error
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			// @ts-ignore <-- This is a private API so we need to ignore the TS error
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
	// END VIEW TRANSITIONS API
</script>

<ModeWatcher defaultMode={'dark'} />
<Toaster position="bottom-right" richColors={true} />
<Toast icon={$toast.icon} type={$toast.type} message={$toast.message} show={$toast.show} />

{#if $currentUser}
	<Command />
{/if}

<div class="flex min-h-screen flex-col">
	<Nav />
	<main class="mx-auto my-5 w-full max-w-5xl flex-grow overflow-x-clip px-2 md:my-10">
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
