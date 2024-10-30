<script lang="ts">
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';

	interface Props {
		settings?: any;
		children?: import('svelte').Snippet;
	}

	let {
		settings = {
			before: {
				opacity: 0,
				y: 10
			},
			after: {
				opacity: 1,
				y: 0,
				duration: 3,
				ease: 'power4.out'
			}
		} || {},
		children
	}: Props = $props();

	let element: any = $state();

	onMount(() => {
		gsap.fromTo(element, settings.before, settings.after);
	});
</script>

<div bind:this={element}>
	{@render children?.()}
</div>
