<script lang="ts">
	import StackOrbit from '$lib/components/ui/StackOrbit.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import { onDestroy, onMount, tick } from 'svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import LazyImage from './LazyImage.svelte';
	import OrbitingCircles from '../magic-ui/OrbitingCircles.svelte';
	import MeteorCard from './MeteorCard.svelte';
	import pocketbaseImage from '$lib/assets/images/pocketbase.png?enhanced';

	let gsapInstance: any;
	let ScrollTriggerInstance: any;

	const initializeAnimations = () => {
		tick();

		gsapInstance.from('.card1', {
			duration: 1,
			opacity: 0,
			y: 20,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.card1',
				start: 'top 90%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.card2', {
			duration: 1,
			opacity: 0,
			y: -20,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.card2',
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

			gsapInstance.from('.card5', {
				duration: 1,
				opacity: 0,
				scale: 0.9,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.card5',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});

			gsapInstance.from('.card6', {
				duration: 1,
				opacity: 0,
				y: 20,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.card6',
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

			gsapInstance.from('.card5', {
				duration: 1,
				opacity: 0,
				y: 20,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.card5',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});

			gsapInstance.from('.card6', {
				duration: 1,
				opacity: 0,
				y: -20,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.card6',
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

<div
	class="mt-20 grid w-full grid-cols-1 gap-10 sm:rounded-lg sm:border sm:p-5 sm:shadow-lg md:grid-cols-2"
>
	<!-- CARD 1 -->
	<div
		class="card1 relative order-1 flex h-full min-h-[500px] w-full overflow-hidden rounded-lg bg-orange-500 text-white shadow-lg"
	>
		<!-- <OrbitingCircles /> -->

		<StackOrbit />

		<div class="absolute left-0 top-0 p-5 text-5xl font-bold uppercase drop-shadow">
			<div>Sveltekit</div>
			<div>PocketBase</div>
			<div>AI</div>
			<div>Tailwind</div>
			<div>Zod</div>
		</div>
		<!-- <enhanced:img
			src={girl4Image}
			alt="Jitka"
			class="absolute bottom-0 left-0 h-[550px] rounded-lg object-cover"
		></enhanced:img> -->
		<!-- <div class="z-20 flex w-1/2 flex-col gap-5 p-5">
			<div class="w-full text-5xl font-bold uppercase drop-shadow">
				Sveltekit Pocketbase AI Tailwind Zod
			</div>
		</div> -->
	</div>

	<!-- CARD 2 -->
	<div class="card2 relative order-2 flex h-full w-full">
		<div class="z-20 flex w-full flex-col gap-5 p-2 md:p-5">
			<div class="w-full text-3xl font-bold uppercase">Why spatz?</div>
			<!-- <div class="text-2xl font-thin">
				Offering a range of cosmetic injections to address your unique beauty goals.
			</div> -->

			<div>
				<strong>
					Combine SvelteKit, PocketBase, Open AI, TailwindCSS, and Zod and you got one hell of a
					tech stack.
				</strong>
				A minimal setup that leverages each technology's strengths to build modern, efficient, and scalable
				web applications. SvelteKit offers a streamlined and reactive framework that enhances developer
				productivity and performance. PocketBase provides a robust and lightweight backend solution with
				real-time capabilities and easy data management. AI integration enables advanced features such
				as personalized user experiences and intelligent automation. TailwindCSS ensures a cohesive and
				visually appealing design system with utility-first CSS, and Zod brings powerful and type-safe
				schema validation, ensuring data integrity and security. Together, these technologies enable
				developers to build sophisticated, responsive, and high-performance applications with ease.
			</div>
			<!-- <ul class="flex flex-col gap-2 text-3xl font-thin">
				<li>
					<strong>Sveltekit</strong>
				</li>
				<li><strong>Pocketbase</strong></li>
				<li><strong>AI</strong></li>
				<li><strong>TailwindCSS</strong></li>
				<li><strong>Zod</strong></li>
			</ul> -->
			<div class="flex items-center gap-2">
				<a href="/technologies">
					<Button
						size="lg"
						variant="default"
						class="bg-orange-500 uppercase transition-all duration-300 hover:bg-orange-600 dark:hover:bg-orange-400"
						>Technologies</Button
					>
				</a>
				<a href="/contact">
					<Button size="lg" variant="outline" class="w-fit uppercase">Feedback</Button>
				</a>
			</div>
		</div>
	</div>

	<!-- CARD 3 -->
	<div class="card3 relative order-4 flex h-full w-full md:order-3">
		<div class="z-20 flex w-full flex-col gap-5 p-2 md:p-5">
			<div class="w-full text-3xl font-bold">DATABASE, AUTH, ADMIN PANEL</div>
			<div class="text-2xl font-thin">
				PocketBase provides an all-in-one solution for your database, authentication, and admin
				panel. Self-documenting REST and Client APIs will have you up and running in a few minutes.
				All in a single file.
			</div>
		</div>
	</div>

	<!-- CARD 4 -->
	<div
		class="card4 relative order-3 flex h-full min-h-[500px] w-full rounded-lg bg-neutral-300 text-white shadow-lg dark:bg-neutral-500 md:order-4"
	>
		<!-- <MeteorCard /> -->
		<enhanced:img
			src={pocketbaseImage}
			alt="Jitka"
			class="absolute bottom-0 right-0 h-full rounded-lg object-cover"
		></enhanced:img>
		<!-- <div class="absolute bottom-0 right-0 z-20 flex w-full flex-col gap-5 p-5">
			<div class="w-full text-5xl font-bold drop-shadow">SAFE & EFFECTIVE</div>
		</div> -->
	</div>

	<!-- CARD 5 -->
	<div
		class="card5 relative order-5 flex h-full min-h-[500px] w-full rounded-lg bg-yellow-500 text-white shadow-lg dark:bg-yellow-300"
	>
		<Icon
			icon="material-symbols:rocket-launch"
			class="absolute bottom-0 right-0 m-5 h-72 w-72 animate-slowBounce text-white drop-shadow-lg"
		/>
		<!-- <enhanced:img
			src={girl2Image}
			alt="Jitka"
			class="absolute bottom-0 right-0 h-[550px] rounded-lg object-cover"
		></enhanced:img> -->
		<div class="z-20 flex w-2/3 flex-col gap-5 p-5">
			<div class="flex w-full flex-col text-5xl font-bold uppercase drop-shadow">
				<div>build</div>
				<div>at</div>
				<div>warp</div>
				<div>speed</div>
			</div>
		</div>
	</div>

	<!-- CARD 6 -->
	<div class="card6 relative order-6 flex h-full w-full">
		<div class="z-20 flex w-full flex-col gap-5 p-2 md:p-5">
			<div class="w-full text-5xl font-bold uppercase">spatz let's you move fast</div>
			<div class="text-2xl font-thin">
				spatz is a complete, minimal toolkit for building modern web applications. It's designed to
				be a flexible and efficient solution for developers who want to create high-quality,
				performant applications with ease.
			</div>
			<div class="flex items-center gap-2">
				<a href="/results">
					<Button
						size="lg"
						variant="default"
						class="bg-yellow-500 uppercase hover:bg-yellow-400 dark:bg-yellow-300 dark:hover:bg-yellow-200"
						>View Before & After Gallery</Button
					>
				</a>
			</div>
		</div>
	</div>
</div>
