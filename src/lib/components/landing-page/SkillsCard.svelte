<script lang="ts">
	import StackOrbit from '$lib/components/ui/StackOrbit.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import { onDestroy, onMount, tick } from 'svelte';
	import pocketbaseImage from '$lib/assets/images/pocketbase.png?enhanced';
	import MeteorCard from '$lib/components/ui/MeteorCard.svelte';

	let gsapInstance: any;
	let ScrollTriggerInstance: any;

	const randomizeAnimation = () => {
		const rocketship = document.getElementById('rocketship');

		if (rocketship) {
			const randomDuration = () => Math.random() * 3 + 2; // Duration between 2s and 5s
			const randomDelay = () => Math.random() * 1 + 0.5; // Delay between 0.5s and 1.5s
			const randomX = () => Math.random() * 10 - 10; // Random horizontal movement between -10px and 10px
			const randomY = () => Math.random() * 10 - 10; // Random vertical movement between -10px and 10px
			const randomScale = () => Math.random() * 0.5 + 0.5; // Scale between 0.8 and 1

			// Scale in and out
			gsapInstance.to(rocketship, {
				scale: randomScale(),
				duration: randomDuration(),
				ease: 'power2.inOut',
				repeat: -1,
				yoyo: true,
				delay: randomDelay()
			});

			// Move side to side
			gsapInstance.to(rocketship, {
				x: randomX(),
				y: randomY(),
				duration: randomDuration(),
				ease: 'power2.inOut',
				repeat: -1,
				yoyo: true,
				delay: randomDelay()
			});
		}
	};

	const initializeAnimations = () => {
		tick();

		gsapInstance.from('.orbitCard', {
			duration: 1,
			opacity: 0,
			y: 20,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.orbitCard',
				start: 'top 90%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.rocketText', {
			duration: 1,
			opacity: 0,
			y: -20,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.rocketText',
				start: 'top 90%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.rocketAnimation', {
			duration: 2,
			opacity: 1,
			x: 200,
			scale: 0.5,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.rocketAnimation',
				start: 'top 90%',
				toggleActions: 'play none none none'
			}
		});

		const isLargeScreen = window.matchMedia('(min-width: 768px)').matches;

		if (isLargeScreen) {
			gsapInstance.from('.card3', {
				duration: 1,
				opacity: 0,
				x: -20,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.card3',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});
			gsapInstance.from('.card4', {
				duration: 1,
				opacity: 0,
				x: 20,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.card4',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});

			gsapInstance.from('.rocketCard', {
				duration: 1,
				opacity: 0,
				scale: 0.9,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.rocketCard',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});

			gsapInstance.from('.orbitText', {
				duration: 1,
				opacity: 0,
				y: 20,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.orbitText',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});
		} else {
			gsapInstance.from('.card3', {
				duration: 1,
				opacity: 0,
				y: -20,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.card3',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});
			gsapInstance.from('.card4', {
				duration: 1,
				opacity: 0,
				y: 20,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.card4',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});

			gsapInstance.from('.rocketCard', {
				duration: 1,
				opacity: 0,
				y: 20,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.rocketCard',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});

			gsapInstance.from('.orbitText', {
				duration: 1,
				opacity: 0,
				y: -20,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.orbitText',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});
		}

		randomizeAnimation(); // Apply the random animation to the rocketship
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

<div
	class="mt-20 grid w-full grid-cols-1 gap-10 sm:rounded-lg sm:border sm:p-5 sm:shadow-lg md:grid-cols-2"
>
	<!-- CARD 1 -->
	<div
		class="rocketCard relative order-1 flex h-full min-h-[360px] w-full overflow-hidden rounded-lg bg-gradient-to-bl from-orange-500 to-yellow-500 text-white shadow-lg"
	>
		<div class="absolute bottom-0 right-0 h-full w-full overflow-hidden text-white drop-shadow-lg">
			<MeteorCard />
		</div>

		<div id="rocketship" class="rocketAnimation absolute bottom-0 right-0 h-72 w-72">
			<Icon
				icon="material-symbols:rocket-launch"
				class="absolute bottom-5 right-5 m-5 h-72 w-72 text-white drop-shadow-lg"
			/>
		</div>
		<div class="z-20 flex w-2/3 flex-col gap-5 p-5">
			<div class="flex w-full flex-col text-5xl font-bold uppercase text-yellow-300 drop-shadow">
				<div>build</div>
				<div>at</div>
				<div>warp</div>
				<div>speed</div>
			</div>
		</div>
	</div>

	<!-- CARD 2 -->
	<div class="orbitText relative order-2 flex h-full w-full">
		<div class="z-20 flex w-full flex-col gap-5 p-2 md:p-5">
			<div class="w-full text-3xl font-bold uppercase">build apps faster</div>
			<div class="text-lg font-thin">
				spatz is a complete, minimal toolkit for building modern web applications. It's designed to
				be a flexible and efficient solution for developers who want to create high-quality,
				performant applications with ease.
			</div>
			<div class="flex items-center gap-2">
				<a href="https://bento.engage-dev.com/tags/spatz">
					<Button
						size="lg"
						variant="default"
						class="bg-gradient-to-br from-orange-500 to-yellow-700 lowercase transition-shadow duration-200  hover:shadow"
						>View Examples</Button
					>
				</a>
			</div>
		</div>
	</div>

	<!-- CARD 3 -->
	<div
		class="orbitCard relative order-5 flex h-full min-h-[360px] w-full rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg"
	>
		<StackOrbit />
	</div>

	<!-- CARD 4 -->
	<div class="rocketText relative order-6 flex h-full w-full">
		<div class="z-20 flex w-full flex-col gap-5 p-2 md:p-5">
			<div class="w-full text-3xl font-bold uppercase">Why spatz?</div>

			<div class="text-lg">
				Combining SvelteKit, PocketBase, OpenAI, TailwindCSS, and Zod makes a powerful tech stack.
				This minimal setup leverages each technology's strengths for modern, efficient, and scalable
				web applications.
			</div>
			<div class="flex items-center gap-2">
				<a href="/technologies">
					<Button
						size="lg"
						variant="default"
						class="bg-gradient-to-br from-orange-500 to-orange-700 lowercase transition-shadow duration-200 hover:shadow"
						>Technologies</Button
					>
				</a>
				<a href="/contact">
					<Button size="lg" variant="outline" class="w-fit lowercase">Feedback</Button>
				</a>
			</div>
		</div>
	</div>

	<!-- CARD 5 -->
	<div class="card3 relative order-4 flex h-full w-full md:order-3">
		<div class="z-20 flex w-full flex-col gap-5 p-2 md:p-5">
			<div class="w-full text-3xl font-bold uppercase">Users & Data</div>

			<div class="text-lg">
				PocketBase makes for an ideal backend solution for rapidly building modern web applications
				with minimal friction. It offers authentication, a high-performance database, an intuitive
				admin panel, logging, and complex query support—all within a single file. This lightweight
				platform enables developers to quickly create responsive, secure, and scalable applications.
			</div>
		</div>
	</div>

	<!-- CARD 6 -->
	<div
		class="card4 relative order-3 flex h-full min-h-[360px] w-full overflow-hidden rounded-lg border border-orange-500 bg-neutral-300 text-white shadow-lg dark:bg-neutral-500 md:order-4"
	>
		<enhanced:img
			src={pocketbaseImage}
			alt="PocketBase"
			class="absolute bottom-0 right-0 h-full rounded-lg object-cover object-right"
		></enhanced:img>
	</div>
</div>
