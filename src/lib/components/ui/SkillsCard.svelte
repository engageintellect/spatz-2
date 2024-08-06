<script lang="ts">
	import StackOrbit from '$lib/components/ui/StackOrbit.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import { onDestroy, onMount, tick } from 'svelte';
	import pocketbaseImage from '$lib/assets/images/pocketbase.png?enhanced';
	import { M } from 'svelte-motion';
	import MeteorCard from '$lib/components/ui/MeteorCard.svelte';

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
		<StackOrbit />

		<!-- <div class="absolute left-0 top-0 p-5 text-3xl font-bold uppercase drop-shadow">
			<div>Sveltekit</div>
			<div>PocketBase</div>
			<div>AI</div>
			<div>Tailwind</div>
			<div>Zod</div>
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
				Combining SvelteKit, PocketBase, OpenAI, TailwindCSS, and Zod makes a powerful tech stack.
				This minimal setup leverages each technology's strengths for modern, efficient, and scalable
				web applications. SvelteKit provides a reactive framework for enhanced productivity and
				performance. PocketBase offers a lightweight backend with real-time capabilities. AI
				integration enables personalized user experiences and intelligent automation. TailwindCSS
				ensures a cohesive design system with utility-first CSS, and Zod brings type-safe schema
				validation for data integrity. Together, these tools enable developers to build
				sophisticated, responsive, and high-performance applications with ease.
			</div>
			<div class="flex items-center gap-2">
				<a href="/technologies">
					<Button
						size="lg"
						variant="default"
						class="bg-orange-500 lowercase transition-all duration-300 hover:bg-orange-600 dark:hover:bg-orange-400"
						>Technologies</Button
					>
				</a>
				<a href="/contact">
					<Button size="lg" variant="outline" class="w-fit lowercase">Feedback</Button>
				</a>
			</div>
		</div>
	</div>

	<!-- CARD 3 -->
	<div class="card3 relative order-4 flex h-full w-full md:order-3">
		<div class="z-20 flex w-full flex-col gap-5 p-2 md:p-5">
			<div class="w-full text-3xl font-bold">DATABASE, AUTH, ADMIN PANEL</div>
			<div class="">
				PocketBase is the ideal backend solution for rapidly building modern web applications with
				minimal friction. It offers authentication, a high-performance database, an intuitive admin
				panel, logging, and complex query support—all within a single file. This lightweight
				platform enables developers to quickly create responsive, secure, and scalable applications.
				PocketBase's real-time capabilities ensure seamless data synchronization and instant updates
				across clients. Its RESTful API and WebSocket support provide robust connectivity options,
				making it easy to integrate with various frontend frameworks. With PocketBase, you get a
				highly performant solution that can scale surprisingly large, allowing you to focus on
				feature development without worrying about backend complexities.
			</div>
		</div>
	</div>

	<!-- CARD 4 -->
	<div
		class="card4 relative order-3 flex h-full min-h-[500px] w-full overflow-hidden rounded-lg bg-neutral-300 text-white shadow-lg dark:bg-neutral-500 md:order-4"
	>
		<!-- <MeteorCard /> -->
		<enhanced:img
			src={pocketbaseImage}
			alt="PocketBase"
			class="absolute bottom-0 right-0 h-full rounded-lg object-cover object-right"
		></enhanced:img>
	</div>

	<!-- CARD 5 -->
	<div
		class="card5 relative order-5 flex h-full min-h-[500px] w-full rounded-lg bg-gradient-to-bl from-orange-500 to-yellow-500 text-white shadow-lg dark:bg-yellow-300"
	>
		<div class="absolute bottom-0 right-0 h-full w-full overflow-hidden text-white drop-shadow-lg">
			<MeteorCard />
		</div>
		<Icon
			icon="material-symbols:rocket-launch"
			class="absolute bottom-0 right-0 m-5 h-72 w-72 animate-slowBounce text-white drop-shadow-lg"
		/>
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
				<a href="https://bento.engage-dev.com/tags/svelte">
					<Button
						size="lg"
						variant="default"
						class="bg-yellow-500 lowercase hover:bg-yellow-400 dark:bg-yellow-300 dark:hover:bg-yellow-200"
						>View Examples</Button
					>
				</a>
			</div>
		</div>
	</div>
</div>
