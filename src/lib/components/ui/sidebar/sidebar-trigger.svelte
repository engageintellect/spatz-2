<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { fade } from 'svelte/transition';
	import Avatar from '../Avatar.svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js'; // Adjust the path as needed
	import Icon from '@iconify/svelte';

	let {
		sidebar = useSidebar(),
		notifications = 0,
		ref = $bindable(null),
		class: className,
		onclick,
		...restProps
	}: any & {
		onclick?: (e: MouseEvent) => void;
	} = $props();
</script>

<Button
	type="button"
	onclick={(e: any) => {
		onclick?.(e);
		sidebar.toggle();
	}}
	data-sidebar="trigger"
	variant="ghost"
	size="icon"
	class={cn('h-7 w-7', className)}
	{...restProps}
>
	{#if sidebar.state == 'collapsed' || sidebar.isMobile}
		<div in:fade>
			<Button size="icon" class="mt-1 rounded-full">
				<div class="relative">
					<Avatar />
					{#if notifications > 0}
						<div
							class="dropdown-menu-notifications absolute -bottom-1 right-0 rounded-full border border-2 border-background text-xs"
						>
							<Badge size="sm" variant="destructive" class="px-1 py-0 text-xs text-white"
								>{notifications}</Badge
							>
						</div>
					{/if}
				</div>
			</Button>
		</div>

		<!--
		<Button variant="ghost">
			<Icon icon="mynaui:sidebar" class="h-7 w-7" />
		</Button>
-->
	{:else}
		<div in:fade>
			<Button variant="ghost">
				<Icon icon="mynaui:sidebar" class="h-7 w-7" />
			</Button>
		</div>
	{/if}
	<span class="sr-only">Toggle Sidebar</span>
</Button>
