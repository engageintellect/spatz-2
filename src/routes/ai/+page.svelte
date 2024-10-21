<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import robot from '$lib/assets/images/robot14-nobg.png';

	let imgRef: HTMLImageElement = $state();

	onMount(() => {
		gsap.from(imgRef, {
			opacity: 0, // Start fully transparent
			delay: 0.1, // Delay the animation
			y: 0, // Start slightly to the left
			duration: 1, // Duration of the animation
			ease: 'power2.out',
			scale: 0.95
		});
	});
</script>

<div class="overflow-hidden">
	<img bind:this={imgRef} src={robot} alt="robot" class="border-b drop-shadow" />
</div>
