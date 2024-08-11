<script lang="ts">
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';

	export let settings =
		{
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
		} || {};

	let element: HTMLDivElement;

	onMount(() => {
		gsap.fromTo(element, settings.before, settings.after);
	});
</script>

<div bind:this={element}>
	<slot />
</div>
