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
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let data: PageData;

	// 1. Maka a variable that stores old pathname.
	let pathname = '';
	// 2. When the layout page mount, store the pathname.
	onMount(() => {
		pathname = $page.url.pathname;
	});

	// 4. Store the pathname before navigating.
	beforeNavigate(() => {
		pathname = $page.url.pathname;
	});

	// 3. Compare the pathnames and if they are different then make the scroll top.
	afterNavigate(() => {
		if (pathname === $page.url.pathname) return;
		window.scrollTo({ top: 0, behavior: 'auto' });
	});

	$: currentUser.set(data.user);

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
