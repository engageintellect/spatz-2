<script lang="ts">
	import Icon from '@iconify/svelte';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import { PUBLIC_POCKETBASE_ADMIN } from '$env/static/public';
	import { currentUser } from '$lib/stores/user';
	import { Badge } from '$lib/components/ui/badge/index.js';

	export let notifications: any;

	function handleLogout() {
		pb.authStore.clear();
		// Clear AI chat messages
		// chatMessages.set([]);
		localStorage.removeItem('chatMessages');
		goto('/');
	}

	onMount(() => {
		gsap.from('.dropdown-menu-item', {
			opacity: 0,
			stagger: 0.1,
			duration: 2.25
		});
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} class="rounded-full p-0">
			<Avatar />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="mt-3 w-fit min-w-52 max-w-64 bg-background" align="end">
		<DropdownMenu.Label class=" p-0">
			<DropdownMenu.Item class="">
				<a
					href={`/users/${$currentUser.id}`}
					data-sveltekit-preload-data="hover"
					class="flex w-full items-center gap-2"
				>
					<div class="dropdown-menu-item">
						<Avatar />
					</div>
					<div class="truncate">
						<h3 class="overflow-hidden text-ellipsis text-base">@{$currentUser.username}</h3>
						<p class="overflow-hidden text-ellipsis text-xs font-thin text-foreground/70">
							{$currentUser.email}
						</p>
					</div>
				</a>
			</DropdownMenu.Item>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />

		<!-- <DropdownMenu.Label>Settings</DropdownMenu.Label> -->

		<DropdownMenu.Group>
			<DropdownMenu.Item>
				<a
					href={`/notifications/${$currentUser.id}`}
					data-sveltekit-preload-data="hover"
					class="flex w-full items-center"
				>
					<Icon icon="material-symbols:notifications" class="mr-2 h-4 w-4" />
					<span>Notifications</span>
				</a>

				{#if notifications > 0}
					<DropdownMenu.Shortcut
						><Badge variant="default">{notifications}</Badge></DropdownMenu.Shortcut
					>
				{/if}
			</DropdownMenu.Item>

			<DropdownMenu.Item>
				<a
					href="/my/settings/profile"
					data-sveltekit-preload-data="hover"
					class="flex w-full items-center"
				>
					<Icon icon="mdi:account" class="mr-2 h-4 w-4" />
					<span>Profile</span>
				</a>
				<!-- <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut> -->
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<a
					href="/my/settings/account"
					data-sveltekit-preload-data="hover"
					class="flex w-full items-center"
				>
					<Icon icon="mdi:settings" class="mr-2 h-4 w-4" />
					<span>Account</span>
				</a>
				<!-- <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut> -->
			</DropdownMenu.Item>

			<DropdownMenu.Item>
				<a
					href="/my/settings/subscription"
					data-sveltekit-preload-data="hover"
					class="flex w-full items-center"
				>
					<Icon icon="weui:done2-filled" class="mr-2 h-4 w-4" />
					<span>Billing</span>
				</a>
				<!-- <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut> -->
			</DropdownMenu.Item>

			<DropdownMenu.Item>
				<a
					href="/my/settings/security"
					data-sveltekit-preload-data="hover"
					class="flex w-full items-center"
				>
					<Icon icon="material-symbols:lock-outline" class="mr-2 h-4 w-4" />
					<span>Security</span>
				</a>
				<!-- <DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut> -->
			</DropdownMenu.Item>

			<!-- <DropdownMenu.Item>
        <Keyboard class="mr-2 h-4 w-4" />
        <Icon icon="mdi:keyboard" class="mr-2 h-4 w-4" />
				<span>Keyboard shortcuts</span>
				<DropdownMenu.Shortcut>⌘K</DropdownMenu.Shortcut>
			</DropdownMenu.Item> -->
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<!-- <DropdownMenu.Label>App</DropdownMenu.Label> -->
		<DropdownMenu.Group>
			<DropdownMenu.Item>
				<!-- <Users class="mr-2 h-4 w-4" /> -->
				<a
					href="/guestbook"
					data-sveltekit-preload-data="hover"
					class="flex w-full w-full items-center"
				>
					<Icon icon="ion:chatbubble-outline" class="mr-2 h-4 w-4" />
					<span>Guestbook</span>
				</a>
			</DropdownMenu.Item>

			<DropdownMenu.Item>
				<a href={`/users`} class="flex w-full w-full items-center">
					<Icon icon="mdi:users" class="mr-2 h-4 w-4" />
					<span>User Directory</span>
				</a>
			</DropdownMenu.Item>

			<DropdownMenu.Item>
				<a href="/ai" data-sveltekit-preload-data="hover" class="flex w-full w-full items-center">
					<Icon icon="tabler:brain" class="mr-2 h-4 w-4" />
					<span>AI</span>
				</a>
			</DropdownMenu.Item>

			<DropdownMenu.Item>
				<a href={PUBLIC_POCKETBASE_ADMIN} class="flex w-full w-full items-center">
					<Icon icon="simple-icons:pocketbase" class="mr-2 h-4 w-4" />
					<span>PocketBase</span>
				</a>
			</DropdownMenu.Item>

			<DropdownMenu.Item>
				<a href={`/subscriptions`} class="flex w-full w-full items-center">
					<Icon icon="carbon:pricing-container" class="mr-2 h-4 w-4" />
					<span>Subscriptions</span>
				</a>
			</DropdownMenu.Item>
		</DropdownMenu.Group>

		<DropdownMenu.Separator />
		<!-- <DropdownMenu.Label>Support</DropdownMenu.Label> -->
		<DropdownMenu.Item>
			<a
				href="https://github.com/engageintellect/spatz-2"
				target="_blank"
				class="flex w-full items-center"
			>
				<Icon icon="mdi:github" class="mr-2 h-4 w-4" />
				<span>Repository</span>
			</a>
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<a
				href="https://github.com/engageintellect/spatz-2/issues/new/choose"
				target="_blank"
				class="flex w-full items-center"
			>
				<Icon icon="mdi:bug" class="mr-2 h-4 w-4" />
				<span>Submit Bug</span>
			</a>
		</DropdownMenu.Item>

		<DropdownMenu.Item>
			<a href="/donate" class="flex w-full items-center">
				<Icon icon="mdi:money" class="mr-2 h-4 w-4" />
				<span>Donate</span>
			</a>
		</DropdownMenu.Item>

		<DropdownMenu.Item>
			<a
				href="https://github.com/engageintellect/spatz-2/blob/main/README.md"
				target="_blank"
				class="flex w-full items-center"
			>
				<Icon icon="mdi:book-open-variant" class="mr-2 h-4 w-4" />
				<span>Docs</span>
			</a>
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
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
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
