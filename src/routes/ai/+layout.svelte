<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	const navigation = [
		{
			title: 'chat',
			href: '/ai/chat'
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
</script>

<div class="bg-base-100 mx-auto h-full w-full max-w-2xl">
	<a href="/ai" class="text-7xl">ai</a>
</div>
<div
	class="mx-auto flex h-full w-full max-w-2xl flex-col gap-5 rounded-lg md:flex-row md:gap-10 md:border md:p-5 md:shadow-lg"
>
	<ul
		class="md:rounded-box sticky flex h-full w-full flex-nowrap gap-2 overflow-auto bg-background md:top-16 md:w-40"
	>
		<div class="flex w-full flex-row gap-1 md:flex-col">
			{#each navigation as navItem}
				<li>
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
	<div class="w-full px-2">
		<slot />
	</div>
</div>

<div class="mx-auto flex max-w-2xl justify-end">
	<ScrollToTopButton />
</div>
