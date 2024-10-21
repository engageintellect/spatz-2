<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { animateMainStagger } from '$lib/animations';
	import Icon from '@iconify/svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	const navigation = [
		{
			title: 'Profile',
			href: '/my/settings/profile',
			icon: 'mdi:account'
		},
		{
			title: 'Account',
			href: '/my/settings/account',
			icon: 'mdi:settings'
		},

		{
			title: 'Billing',
			href: '/my/settings/subscription',
			icon: 'weui:done2-filled'
		},

		{
			title: 'Security',
			href: '/my/settings/security',
			icon: 'material-symbols:lock-outline'
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
						class="flex w-full items-center justify-between gap-2"
						variant={`${$page.url.pathname === navItem.href ? 'default' : 'outline'}`}
					>
						<div>
							{navItem.title}
						</div>
						<Icon icon={navItem.icon} class="h-4 w-4" />
					</Button>
				</a>
			</li>
		{/each}
	</ul>
	<div class="animate-item w-full max-w-lg px-2">
		{@render children?.()}
	</div>
</div>
