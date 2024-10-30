<script lang="ts">
	import { cn } from '$lib/utils';
	import { Motion } from 'svelte-motion';

	interface Props {
		word?: string;
		variant?: {
		hidden: { filter: string; opacity: number };
		visible: { filter: string; opacity: number };
	};
		duration?: number;
		class?: string;
	}

	let {
		word = 'Blur In',
		variant = {
		hidden: { filter: 'blur(10px)', opacity: 0 },
		visible: { filter: 'blur(0px)', opacity: 1 }
	},
		duration = 0.75,
		class: className = ''
	}: Props = $props();
	

	let defaultVariants = {
		hidden: { filter: 'blur(10px)', opacity: 0 },
		visible: { filter: 'blur(0px)', opacity: 1 }
	};
	let combinedVariants = variant || defaultVariants;
</script>

<Motion
	initial="hidden"
	animate="visible"
	transition={{ duration }}
	variants={combinedVariants}
	let:motion
>
	<h1
		class={cn(
			className,
			'font-display text-center text-3xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-5xl md:leading-[5rem]'
		)}
		use:motion
	>
		{word}
	</h1>
</Motion>
