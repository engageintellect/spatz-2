<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	let gsapInstance: any;
	let ScrollTriggerInstance: any;

	const initializeAnimations = () => {
		tick();

		const isLargeScreen = window.matchMedia('(min-width: 768px)').matches;

		if (isLargeScreen) {
			gsapInstance.from('.quote-animation', {
				duration: 3,
				opacity: 0,
				// x: -20,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.quote-animation',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});
		} else {
			gsapInstance.from('.quote-animation', {
				duration: 3,
				opacity: 0,
				// y: -50,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.quote-animation',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});
		}
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

<div class="quote-animation mx-auto my-40 flex w-full justify-center p-5">
	<div class="w-full max-w-lg text-3xl md:text-5xl">
		<div class="font-thin italic leading-normal">
			<div class="">
				“I believe in everyone’s unique beauty and approach each patient with an individual plan to
				achieve a look that suits their natural features best!”
			</div>
			<div class="mt-10 text-right">— Jitka Zavadilova</div>
		</div>
	</div>
</div>
