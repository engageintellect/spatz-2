<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/ui/Nav.svelte';
	import Footer from '$lib/components/ui/Footer.svelte';
	import Command from '$lib/components/ui/Command.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import type { PageData } from './$types';
	import { currentUser } from '$lib/stores/user';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/ui/AppSidebar.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';

	let showAlert = true;

	let toggleAlert = () => {
		showAlert = !showAlert;
	};

	export let data: PageData;
	let open = true;

	$: currentUser.set(data.user);

	console.log(data);

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
<Toaster position="bottom-right" richColors={false} />

{#if $currentUser}
	<Command />
	<Sidebar.Provider {open}>
		<AppSidebar notifications={data.globalNotifications.length} />
		<div class="flex min-h-[calc(100svh)] w-full flex-col md:min-h-screen">
			<Nav notifications={data.globalNotifications.length} />
			{#if showAlert}
				{#if data.alerts.length > 0}
					<div transition:slide class=" flex w-full justify-between bg-secondary p-2">
						<div class="mx-auto flex w-full max-w-5xl justify-between">
							<div class="flex w-full flex-col">
								<div class="text-sm">{data.alerts[0].title}</div>
								<a href={data.alerts[0].url} class=" text-xs text-muted-foreground">
									{data.alerts[0].content}
								</a>
							</div>

							<Button onclick={toggleAlert} size="icon" variant="ghost">
								<Icon icon="mdi:close" class="h-5 w-5" />
							</Button>
						</div>
					</div>
				{/if}
			{/if}
			<main class={`mx-auto my-2 w-full max-w-5xl flex-grow overflow-x-clip px-2`}>
				<slot />
			</main>
			<Footer />
		</div>
	</Sidebar.Provider>
{:else}
	<div class="flex min-h-[calc(100svh)] w-full flex-col md:min-h-screen">
		<Nav notifications={data.globalNotifications.length} />

		<main class="mx-auto my-2 w-full max-w-5xl flex-grow overflow-x-clip px-2 md:my-5">
			<slot />
		</main>
		<Footer />
	</div>
{/if}
