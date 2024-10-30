<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		pulseColor?: string;
		duration?: string;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		pulseColor = '#0096ff',
		duration = '1.5s',
		class: className = '',
		children
	}: Props = $props();
	
</script>

<button
	class={cn(
		'relative flex cursor-pointer items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-center text-white dark:bg-blue-500 dark:text-black',
		className
	)}
	style:--pulse-color={pulseColor}
	style:--duration={duration}
>
	<div class="relative z-10">
		{@render children?.()}
	</div>
	<div
		class="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-lg bg-inherit"
	></div>
</button>
