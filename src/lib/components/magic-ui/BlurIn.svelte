<script lang="ts">
	import { cn } from '$lib/utils';
	import { Motion } from 'svelte-motion';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';

	let sidebar = useSidebar();

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
			`${sidebar.state === 'expanded' ? ' lg:text-5xl' : ' md:text-5xl'} font-display text-center text-3xl font-bold tracking-[-0.02em] drop-shadow-sm`
		)}
		use:motion
	>
		{word}
	</h1>
</Motion>
