<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { animateMainStagger } from '$lib/animations';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';

	let sidebar = useSidebar();

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const navigation = [
		{
			title: 'chat',
			href: '/ai/chat'
		},
		{
			title: 'context',
			href: '/ai/context'
		},
		{
			title: 'a',
			href: '/ai/a'
		},
		{
			title: 'b',
			href: '/ai/b'
		},
		{
			title: 'c',
			href: '/ai/c'
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
	class={`${sidebar.state === 'expanded' ? 'lg:flex-row lg:gap-10 lg:border lg:p-5 lg:shadow' : 'md:flex-row md:gap-10 md:border md:p-5 md:shadow'} animate-item mx-auto mt-5 flex w-full max-w-2xl flex-col gap-5 rounded-lg`}
>
	<ul
		class={`${sidebar.state === 'expanded' ? 'lg:rounded-box lg:top-16 lg:w-40 lg:px-0' : 'md:rounded-box md:top-16 md:w-40 md:px-0'} sticky flex h-full w-full flex-nowrap gap-2 overflow-auto bg-background px-2`}
	>
		<div
			class={`${sidebar.state === 'expanded' ? 'lg:flex-col' : 'md:flex-col'} flex w-full flex-row gap-1`}
		>
			{#each navigation as navItem}
				<li class="nav-item">
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
		</div>
	</ul>
	<div class="animate-item w-full px-2">
		{@render children?.()}
	</div>
</div>

<div class="mx-auto flex max-w-2xl justify-end">
	<ScrollToTopButton />
</div>
