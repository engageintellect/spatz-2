<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let src: string;
	export let imgClass: string = '';
	export let alt: string = '';
	export let loading: string = 'lazy'; // default to lazy, but allow override
	let image: HTMLImageElement;

	// Function to handle image loading
	const loadImage = () => {
		if (image && image.dataset.src) {
			image.src = image.dataset.src;
			image.removeAttribute('data-src'); // Remove data-src once it's loaded
		}
	};

	onMount(() => {
		if (loading === 'lazy') {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							loadImage();
							observer.unobserve(image);
						}
					});
				},
				{ rootMargin: '0px 0px 50px 0px' } // Adjust as needed
			);

			if (image) {
				observer.observe(image);
			}

			return () => {
				if (image) {
					observer.unobserve(image);
				}
			};
		} else {
			loadImage();
		}
	});
</script>

<img in:fade bind:this={image} data-src={src} {alt} class={imgClass} />
