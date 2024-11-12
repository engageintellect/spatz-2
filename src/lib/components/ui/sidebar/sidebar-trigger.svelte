<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
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
		<Button class="rounded-full p-0">
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

		<!--
		<Button variant="ghost">
			<Icon icon="mynaui:sidebar" class="h-7 w-7" />
		</Button>
-->
	{:else}
		<Button variant="ghost">
			<Icon icon="mynaui:sidebar" class="h-7 w-7" />
		</Button>
	{/if}
	<span class="sr-only">Toggle Sidebar</span>
</Button>
