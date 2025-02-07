<script lang="ts">
	import { PUBLIC_POCKETBASE_ADMIN, PUBLIC_REPOSITORY_URL } from '$env/static/public';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Icon from '@iconify/svelte';
	import { currentUser } from '$lib/stores/user';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js'; // Adjust the path as needed
	import { Button } from '$lib/components/ui/button/index.js';

	const { notifications }: any = $props();

	function handleLogout() {
		pb.authStore.clear();
		localStorage.removeItem('chatMessages');
		goto('/');
	}

	// Menu items
	const user = [
		{
			title: 'Notifications',
			url: `/notifications/${$currentUser.id}`,
			icon: 'material-symbols:notifications'
		},
		{ title: 'Profile', url: '/my/settings/profile', icon: 'mdi:account' },
		{ title: 'Account', url: '/my/settings/account', icon: 'mdi:settings' },
		{ title: 'Billing', url: '/my/settings/subscription', icon: 'weui:done2-filled' },
		{ title: 'Security', url: '/my/settings/security', icon: 'material-symbols:lock-outline' }
	];

	const app = [
		{ title: 'Guestbook', url: '/guestbook', icon: 'ion:chatbox-outline' },
		{ title: 'User Directory', url: '/users', icon: 'mdi:account-group-outline' },
		{ title: 'AI', url: '/ai', icon: 'tabler:brain' },
		{ title: 'Bitcoin Predition', url: '/bitcoin-prediction', icon: 'akar-icons:bitcoin-fill' },
		{ title: 'PocketBase', url: PUBLIC_POCKETBASE_ADMIN, icon: 'tabler:brain' },
		{ title: 'Subscriptions', url: '/subscriptions', icon: 'carbon:pricing-container' }
	];

	const repo = [
		{ title: 'Repository', url: PUBLIC_REPOSITORY_URL, icon: 'mdi:github' },
		{ title: 'Submit Bug', url: `${PUBLIC_REPOSITORY_URL}/issues/new/choose/`, icon: 'mdi:bug' },
		{ title: 'Donate', url: '/donate', icon: 'mdi:money' },
		{ title: 'Docs', url: `${PUBLIC_REPOSITORY_URL}/blob/main/README.md`, icon: 'mdi:github' },
		{ title: 'Contact', url: '/contact', icon: 'material-symbols:android-contacts' }
	];

	// Helper function to apply active class
	function getClass(url: string) {
		return $page.url.pathname === url ? 'bg-secondary' : '';
	}

	const { setOpenMobile } = useSidebar();
</script>

<Sidebar.Root class="z-50">
	<Sidebar.Header class="">
		<div class="rounded bg-secondary p-2">
			<div class="p-2">
				<div class="flex w-full items-start gap-2">
					<div class="relative">
						<a href={`/users/${$currentUser.id}`} data-sveltekit-preload-data="hover">
							<Avatar />
						</a>
						{#if notifications > 0}
							<a href={`/notifications/${$currentUser.id}`} data-sveltekit-preload-data="hover">
								<div
									class="dropdown-menu-notifications absolute -bottom-1 right-0 rounded-full border border-2 border-background text-xs"
								>
									<Badge size="sm" variant="destructive" class="px-1 py-0 text-xs text-white">
										{notifications}
									</Badge>
								</div>
							</a>
						{/if}
					</div>
					<div class="truncate">
						<a
							href={`/users/${$currentUser.id}`}
							data-sveltekit-preload-data="hover"
							class="flex items-center gap-1"
						>
							<h3 class="overflow-hidden text-ellipsis text-base">@{$currentUser.username}</h3>

							{#if $currentUser.verified === true}
								<Icon icon="material-symbols:verified" class="h-4 w-4 text-info text-info" />
							{/if}
						</a>
						<a href={`/users/${$currentUser.id}`} data-sveltekit-preload-data="hover">
							<p class="overflow-hidden text-ellipsis text-xs font-thin text-foreground/70">
								{$currentUser.email}
							</p>
						</a>
					</div>
				</div>
			</div>
		</div>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>User</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each user as item (item.title)}
						<Sidebar.MenuItem class={getClass(item.url)}>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a
										onclick={() => setOpenMobile(false)}
										data-sveltekit-preload-data="hover"
										href={item.url}
										{...props}
									>
										<Icon icon={item.icon} class="" />
										<span>{item.title}</span>
										{#if item.title === 'Notifications'}
											<Badge
												size="sm"
												variant="destructive"
												class="rounded-full text-xs text-white"
											>
												{notifications}
											</Badge>
										{/if}
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each app as item (item.title)}
						<Sidebar.MenuItem class={getClass(item.url)}>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a
										onclick={() => setOpenMobile(false)}
										data-sveltekit-preload-data="hover"
										href={item.url}
										{...props}
									>
										<Icon icon={item.icon} class="" />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		<Sidebar.Group>
			<Sidebar.GroupLabel>Repo</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each repo as item (item.title)}
						<Sidebar.MenuItem class={getClass(item.url)}>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a
										onclick={() => setOpenMobile(false)}
										data-sveltekit-preload-data="hover"
										href={item.url}
										{...props}
									>
										<Icon icon={item.icon} class="" />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer class="border-t">
		<div class="rounded p-2 hover:bg-secondary">
			<form
				class="flex w-full py-2"
				method="POST"
				action="/auth/logout"
				onsubmit={handleLogout}
				aria-label="Logout"
			>
				<button type="submit" class="flex w-full items-center">
					<Icon icon="mdi:logout" class="mr-2 h-4 w-4" />
					<span>Logout</span>
				</button>
			</form>
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
