<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import { siteInfo } from '$lib/data';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { currentUser } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import DropdownMenuItem from '$lib/components/ui/DropdownMenu.svelte';
	import DropdownMenu from '$lib/components/ui/DropdownMenu.svelte';

	onMount(() => {
		gsap.from('.nav-logo', { delay: 0.5, opacity: 0, duration: 1 });
		gsap.from('.buttons', { delay: 0.5, opacity: 0, duration: 2 });
		gsap.from('.nav', { delay: 0.25, opacity: 0, duration: 0.75 });
	});

	function handleLogout() {
		pb.authStore.clear();
		// Clear AI chat messages
		// chatMessages.set([]);
		localStorage.removeItem('chatMessages');
		goto('/');
	}
</script>

<nav class="nav sticky top-0 -z-[-1] border-b bg-background p-2">
	<div class="mx-auto flex w-full max-w-5xl items-center justify-between">
		<a href="/" class="nav-logo" aria-label="Home">
			<div class="px-2 text-2xl font-bold">spatz</div>
		</a>

		<div class="buttons flex items-center gap-2">
			{#if $currentUser}
				<ThemeToggle />
				<DropdownMenu />
			{:else}
				<div class="flex items-center gap-2">
					<a href="/auth/login">
						<Button variant="ghost">login</Button>
					</a>
					<a href="/auth/register">
						<Button variant="ghost">register</Button>
					</a>
				</div>
			{/if}
		</div>
	</div>
</nav>
