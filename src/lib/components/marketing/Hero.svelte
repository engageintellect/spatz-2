<script lang="ts">
	import { PUBLIC_DOCS_URL, PUBLIC_REPOSITORY_URL } from '$env/static/public';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';

	onMount(() => {
		gsap.fromTo(
			'.spatz-stack',
			{ opacity: 0 },
			{
				opacity: 1,
				x: 0,
				duration: 3,
				ease: 'power4.out'
			}
		);

		gsap.fromTo(
			'.spatz-stack-2',
			{ opacity: 0, x: -25 },
			{
				opacity: 1,
				x: 0,
				duration: 2,
				ease: 'power4.out'
			}
		);
	});
</script>

<div class="mt-5 md:mt-0">
	<h1 class="text-7xl md:text-8xl">
		<div class="spatz-stack flex items-center font-extrabold tracking-tight">
			<div>spatz</div>
			<div class="spatz-stack-2 font-thin tracking-tighter text-foreground/[50%]">2</div>
		</div>
	</h1>

	<div class="my-5 flex flex-col gap-2 md:my-10 md:flex-row md:gap-5">
		<p class=" text-xs text-muted-foreground">
			<kbd
				class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
			>
				<span class="text-xs">⌘</span>j
			</kbd>
			<span class="pl-1"> to open the command palette. </span>
		</p>
		<p class=" text-xs text-muted-foreground">
			<kbd
				class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
			>
				<span class="text-xs">⌘</span>b
			</kbd>
			<span class="pl-1"> to open & close the sidebar. </span>
		</p>
	</div>
	<div class="mt-2 grid w-full grid-cols-2 gap-2 md:grid-cols-3">
		<a
			href="https://github.com/new?template_name=spatz-2&template_owner=engageintellect"
			class=" flex-1"
		>
			<Button variant="default" class="w-full bg-teal-500 hover:bg-teal-400">
				<div class="flex items-center gap-2">
					use template
					<Icon icon="mdi-download" class="h-5 w-5" />
				</div>
			</Button>
		</a>
		<a href={PUBLIC_REPOSITORY_URL} class="group/githubButton flex-1">
			<Button variant="default" class="w-full">
				<div class="flex items-center gap-2">
					star on github
					<Icon
						icon="mdi-star"
						class="transition-color h-5 w-5 duration-300 md:group-hover/githubButton:text-yellow-500"
					/>
				</div>
			</Button>
		</a>

		<a href={PUBLIC_DOCS_URL} class="group/githubButton col-span-2 w-full md:col-span-1">
			<Button variant="outline" class="w-full">
				<div class="flex items-center gap-2">
					docs

					<Icon
						icon="material-symbols:docs-outline"
						class="transition-color h-5 w-5 duration-300 md:group-hover/githubButton:text-teal-500"
					/>
				</div>
			</Button>
		</a>
	</div>
</div>
