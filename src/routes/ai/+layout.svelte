<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { animateMainStagger } from '$lib/animations';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import Icon from '@iconify/svelte';

	let sidebar = useSidebar();

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const navigation = [
		{
			title: 'chat',
			href: '/ai/chat',
			icon: 'material-symbols:chat-bubble-rounded'
		},
		{
			title: 'context',
			href: '/ai/context',
			icon: 'material-symbols:memory'
		},
		{
			title: 'image',
			href: '/ai/image-gen',
			icon: 'material-symbols:add-photo-alternate-outline'
		},
		{
			title: 'agent',
			href: '/ai/agent',
			icon: 'material-symbols:add-photo-alternate-outline'
		}
	];

	onMount(() => {
		animateMainStagger();
		gsap.from('.nav-item', {
			opacity: 0,
			x: 10,
			stagger: 0.1,
			duration: 0.25
		});
	});
</script>

<div class="animate-item bg-base-100 mx-auto w-full max-w-2xl">
	<a href="/ai" class={`${sidebar.state === 'expanded' ? 'lg:px-0' : 'md:px-0'} px-2 text-6xl`}
		>ai</a
	>
</div>
<div
	class={`${sidebar.state === 'expanded' ? 'lg:flex-row lg:gap-10 lg:border lg:p-5 lg:shadow' : 'md:flex-row md:gap-5 md:border md:p-5 md:shadow'} animate-item mx-auto mt-5 flex w-full max-w-2xl flex-col gap-5 rounded-lg`}
>
	<ul
		class={`${sidebar.state === 'expanded' ? 'lg:rounded-box lg:top-16 lg:w-52 lg:px-0' : 'md:rounded-box md:top-16 md:w-52 md:px-0'} sticky flex h-full w-full flex-nowrap gap-2 overflow-auto bg-background px-2`}
	>
		<div
			class={`${sidebar.state === 'expanded' ? 'lg:flex-col' : 'md:flex-col'} flex w-full flex-row gap-1`}
		>
			{#each navigation as navItem}
				<li class="nav-item w-full">
					<a href={navItem.href} class="">
						<Button
							class="flex w-full items-center justify-between"
							variant={`${$page.url.pathname === navItem.href ? 'default' : 'outline'}`}
						>
							<div class="flex w-full items-center justify-between">
								{navItem.title}
								<Icon icon={navItem.icon} class="text-2xl"></Icon>
							</div>
						</Button>
					</a>
				</li>
			{/each}
		</div>
	</ul>
	<div class="animate-item w-full px-2">
		{@render children?.()}
	</div>
</div>

<div class="mx-auto flex max-w-2xl justify-end">
	<ScrollToTopButton />
</div>
