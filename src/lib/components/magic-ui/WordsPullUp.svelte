<script lang="ts">
	import { cn } from '$lib/utils';
	import { Motion } from 'svelte-motion';


	interface Props {
		words?: string;
		wrapperFramerProps?: any;
		framerProps?: any;
		class?: any;
	}

	let {
		words = 'Pull Up',
		wrapperFramerProps = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.5
			}
		}
	},
		framerProps = {
		hidden: { y: 20, opacity: 0 },
		show: { y: 0, opacity: 1 }
	},
		class: className = ''
	}: Props = $props();
	

	let wordSplit = words.split(' ');
</script>

<Motion variants={wrapperFramerProps} initial="hidden" animate="show" let:motion>
	<h1 class={cn('', className)} use:motion>
		{#each wordSplit as word, i}
			<Motion variants={framerProps} let:motion>
				<span class="inline-block" use:motion>
					{#if word === ''}
						<span>&nbsp;</span>
					{:else}
						{word}
					{/if}
				</span>
			</Motion>
		{/each}
	</h1>
</Motion>
