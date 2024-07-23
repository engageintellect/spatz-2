<script lang="ts">
	import Image from '$lib/assets/images/results/result-29.png?enhanced';
	import { Button } from '$lib/components/ui/button/index.js';

	import { onDestroy, onMount, tick } from 'svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Carousel from './Carousel.svelte';
	import LazyImage from '$lib/components/ui/LazyImage.svelte';

	let gsapInstance: any;
	let ScrollTriggerInstance: any;

	const initializeAnimations = () => {
		tick();

		gsapInstance.from('.text-section', {
			duration: 1,
			opacity: 0,
			// y: 20,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.text-section',
				start: 'top 80%',
				toggleActions: 'play none none none'
			}
		});

		// gsapInstance.from('.image-section', {
		// 	duration: 1,
		// 	opacity: 0,
		// 	scale: 0.95,
		// 	ease: 'power2.out',
		// 	scrollTrigger: {
		// 		trigger: '.image-section',
		// 		start: 'top 80%',
		// 		toggleActions: 'play none none none'
		// 	}
		// });
	};

	onMount(() => {
		if (typeof window !== 'undefined') {
			import('gsap').then(({ gsap }) => {
				import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
					gsap.registerPlugin(ScrollTrigger);
					gsapInstance = gsap;
					ScrollTriggerInstance = ScrollTrigger;
					initializeAnimations();
					ScrollTriggerInstance.refresh();
				});
			});
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined' && ScrollTriggerInstance) {
			ScrollTriggerInstance.getAll().forEach((trigger: any) => trigger.kill());
		}
	});
</script>

<div class="md:rounded-lg md:border md:p-5 md:shadow-lg">
	<div class="text-section flex flex-col gap-5 p-2 md:p-0">
		<div class="text-5xl font-bold uppercase">See the difference</div>
		<div class="text-2xl font-thin">
			See the stunning results of our treatments with real before and after photos from our clients.
		</div>

		<a href="/results">
			<Button variant="outline" size="lg" class="w-fit uppercase">View All Before & Afters</Button>
		</a>
	</div>

	<Carousel />
	<!-- <a href="/results">
		<div
			class="image-section mt-5 rounded-lg bg-gradient-to-b from-emerald-100 to-lime-100 p-2 shadow-lg dark:bg-gradient-to-b dark:from-emerald-500 dark:to-lime-700 md:p-10"
		>
			<div class="relative">
				<enhanced:img src={Image} alt="Difference" class="rounded-lg shadow-lg"></enhanced:img>
				<div class="absolute left-5 top-5 text-lg text-white drop-shadow">before</div>
				<div class="absolute right-5 top-5 text-lg text-white drop-shadow">after</div>
			</div>
		</div>
	</a> -->
</div>
