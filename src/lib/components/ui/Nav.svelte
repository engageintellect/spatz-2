<script lang="ts">
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { currentUser } from '$lib/stores/user';
	import { siteInfo } from '$lib/data.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import DropdownMenu from './DropdownMenu.svelte';

	const { notifications } = $props();

	let navHidden = $state(true);
	onMount(() => {
		gsap
			.timeline({
				onStart: () => {
					navHidden = false;
				}
			})
			.from('.nav-logo', { delay: 0.5, opacity: 0, duration: 1 })
			.from('.buttons', { delay: 0.5, opacity: 0, duration: 2 }, '-=1.5')
			.from('.nav', { delay: 0.25, opacity: 0, duration: 0.75 }, '-=2.25');
	});
</script>

<nav class={`nav sticky top-0 -z-[-1] border-b bg-background p-2 ${navHidden ? 'opacity-0' : ''}`}>
	<div class="mx-auto flex w-full max-w-5xl items-center justify-between">
		<a href="/" class="nav-logo" aria-label="Home">
			<div class="px-2 text-2xl font-bold transition-all duration-300 md:hover:scale-[102%]">
				{siteInfo.name}
			</div>
		</a>

		<div class="buttons flex items-center gap-5 pr-2">
			{#if $currentUser}
				<ThemeToggle />
				<Sidebar.Trigger {notifications} />
				<!-- <DropdownMenu {notifications} /> -->
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
