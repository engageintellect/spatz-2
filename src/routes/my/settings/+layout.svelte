<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { animateMainStagger } from '$lib/animations';
	const navigation = [
		{
			title: 'Profile',
			href: '/my/settings/profile'
		},
		{
			title: 'Account',
			href: '/my/settings/account'
		},
		{
			title: 'Security',
			href: '/my/settings/security'
		}
	];

	onMount(() => {
		animateMainStagger();
	});
</script>

<div class="animate-item mx-auto h-full w-full max-w-2xl">
	<!-- <div class="text-7xl">settings</div> -->
</div>
<div
	class="animate-item mx-auto flex h-full w-full max-w-2xl gap-5 rounded-lg md:border md:p-5 md:shadow-lg"
>
	<ul class="flex w-40 flex-col gap-1">
		{#each navigation as navItem}
			<li class="">
				<a href={navItem.href} class="text-lg">
					<Button
						class="w-full"
						variant={`${$page.url.pathname === navItem.href ? 'default' : 'outline'}`}
					>
						{navItem.title}
					</Button>
				</a>
			</li>
		{/each}
	</ul>
	<div class="animate-item w-full max-w-lg px-2">
		<slot />
	</div>
</div>
