<script lang="ts">
	import { cn } from '$lib/utils';
	
	interface Props {
		class?: any;
		reverse?: boolean;
		duration?: number;
		delay?: number;
		radius?: number;
		path?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		class: className = '',
		reverse = false,
		duration = 20,
		delay = 0,
		radius = 50,
		path = true,
		children
	}: Props = $props();
</script>

{#if path}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		version="1.1"
		class="pointer-events-none absolute inset-0 h-full w-full"
	>
		<circle
			class="stroke-white/50 stroke-1"
			cx="50%"
			cy="50%"
			r={radius}
			fill="none"
			stroke-dasharray="4 4"
		/>
	</svg>
	<div
		style:--delay={delay}
		style:--duration={duration}
		style:--radius={radius}
		class={cn(
			'animate-orbit absolute flex h-full w-full transform-gpu items-center justify-center rounded-full border  [animation-delay:calc(var(--delay)*1000ms)] ',
			{ '[animation-direction:reverse]': reverse },
			className
		)}
	>
		{@render children?.()}
	</div>
{/if}
