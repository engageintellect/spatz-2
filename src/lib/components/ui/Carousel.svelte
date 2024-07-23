<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import Autoplay from 'embla-carousel-autoplay';
	import { results } from '$lib/carousel-images';
	import LazyImage from '$lib/components/ui/LazyImage.svelte';

	let autoplay = Autoplay({ delay: 2000, stopOnInteraction: false });

	function handleMouseEnter() {
		autoplay.stop();
	}

	function handleMouseLeave() {
		autoplay.play();
	}

	let gsapInstance: any;
	let ScrollTriggerInstance: any;

	const initializeAnimations = () => {
		tick();

		gsapInstance.from('.gsap-carousel', {
			duration: 3,
			opacity: 0,
			// y: 50,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.gsap-carousel',
				start: 'top 80%',
				toggleActions: 'play none none none'
			}
		});
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

<div>
	<div class="gsap-carousel flex justify-center">
		<Carousel.Root
			opts={{
				active: true,
				align: 'center',
				loop: true
			}}
			class="w-full"
			plugins={[autoplay]}
			on:mouseenter={handleMouseEnter}
			on:mouseleave={handleMouseLeave}
		>
			<Carousel.Content class="flex items-center p-5 md:p-0">
				{#each results as result}
					<Carousel.Item class="py-5 sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
						<a href="/results">
							<Card.Root class="shadow-lg  transition-all duration-200 md:hover:scale-[99%]">
								<Card.Content class="flex h-full w-full items-center justify-center rounded-lg p-0">
									<enhanced:img src={result.image} alt={result.title} class="rounded-lg shadow-lg"
									></enhanced:img>
								</Card.Content>
							</Card.Root>
						</a>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
		</Carousel.Root>
	</div>
</div>
