<script lang="ts">
	import { cn } from '$lib/utils';

	export let pulseColor: string = '#0096ff';
	export let duration: string = '1.5s';
	let className: string = '';
	export { className as class };
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
		<slot>Button</slot>
	</div>
	<div
		class="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-lg bg-inherit"
	></div>
</button>
