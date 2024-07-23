<script lang="ts">
	import girlImage from '$lib/assets/images/girl1.png?enhanced';
	import girl2Image from '$lib/assets/images/girl2.png?enhanced';
	import girl3Image from '$lib/assets/images/girl3.png?enhanced';
	import girl4Image from '$lib/assets/images/girl4.png?enhanced';
	import girl5Image from '$lib/assets/images/girl5.png?enhanced';
	import womanBotoxImage from '$lib/assets/images/womanBotox.png?enhanced';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import { onDestroy, onMount, tick } from 'svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import LazyImage from './LazyImage.svelte';

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
		class="card1 relative order-1 flex h-full min-h-[500px] w-full rounded-lg bg-rose-300 text-white shadow-lg dark:bg-rose-500"
	>
		<enhanced:img
			src={girl4Image}
			alt="Jitka"
			class="absolute bottom-0 left-0 h-[550px] rounded-lg object-cover"
		></enhanced:img>
		<div class="z-20 flex w-1/2 flex-col gap-5 p-5">
			<div class="w-full text-5xl font-bold uppercase drop-shadow">Revitalize Refresh Renew</div>
		</div>
	</div>

	<!-- CARD 2 -->
	<div class="card2 relative order-2 flex h-full w-full">
		<div class="z-20 flex w-full flex-col gap-5 p-2 md:p-5">
			<div class="w-full text-3xl font-bold uppercase">services</div>
			<div class="text-2xl font-thin">
				Offering a range of cosmetic injections to address your unique beauty goals.
			</div>
			<ul class="flex flex-col gap-2 text-xl font-thin">
				<li>
					<strong>Botox:</strong> Smooth out fine lines and wrinkles for a youthful appearance.
				</li>
				<li><strong>Dermal Fillers:</strong> Add volume and definition to your facial features.</li>
				<li><strong>Lip Enhancements:</strong> Achieve fuller, more defined lips.</li>
				<li><strong>Skin Rejuvenation:</strong> Revitalize your skin for a fresh, radiant glow.</li>
			</ul>
			<div class="flex items-center gap-2">
				<a href="/services">
					<Button
						size="lg"
						variant="default"
						class="bg-rose-300 uppercase transition-all duration-300 hover:bg-rose-500 dark:bg-rose-500 dark:hover:bg-rose-300"
						>service menu</Button
					>
				</a>
				<a href="/contact">
					<Button size="lg" variant="outline" class="w-fit uppercase">book consultation</Button>
				</a>
			</div>
		</div>
	</div>

	<!-- CARD 3 -->
	<div class="card3 relative order-4 flex h-full w-full md:order-3">
		<div class="z-20 flex w-full flex-col gap-5 p-2 md:p-5">
			<div class="w-full text-3xl font-bold">OUR COMMITMENT TO SAFETY</div>
			<div class="text-2xl font-thin">
				Your safety is our priority. We understand that cosmetic treatments can be a significant
				decision. By prioritizing your safety and comfort, we ensure that you can enjoy the benefits
				of your treatment with peace of mind. Our commitment to excellence in safety and care is
				what sets us apart.
			</div>
			<div class="text-2xl font-thin">
				We follow industry best practices and use only the highest quality products. Our team of
				professionals is dedicated to providing you with the best possible experience.
			</div>
		</div>
	</div>

	<!-- CARD 4 -->
	<div
		class="card4 relative order-3 flex h-full min-h-[500px] w-full rounded-lg bg-neutral-300 text-white shadow-lg dark:bg-neutral-500 md:order-4"
	>
		<enhanced:img
			src={womanBotoxImage}
			alt="Jitka"
			class="absolute bottom-0 right-0 h-full rounded-lg object-cover"
		></enhanced:img>
		<div class="absolute bottom-0 right-0 z-20 flex w-full flex-col gap-5 p-5">
			<div class="w-full text-5xl font-bold drop-shadow">SAFE & EFFECTIVE</div>
		</div>
	</div>

	<!-- CARD 5 -->
	<div
		class="card5 relative order-5 flex h-full min-h-[500px] w-full rounded-lg bg-sky-300 text-white shadow-lg dark:bg-sky-500"
	>
		<enhanced:img
			src={girl2Image}
			alt="Jitka"
			class="absolute bottom-0 right-0 h-[550px] rounded-lg object-cover"
		></enhanced:img>
		<div class="z-20 flex w-2/3 flex-col gap-5 p-5">
			<div class="w-full text-5xl font-bold uppercase drop-shadow">Where Science Meets Beauty</div>
		</div>
	</div>

	<!-- CARD 6 -->
	<div class="card6 relative order-6 flex h-full w-full">
		<div class="z-20 flex w-full flex-col gap-5 p-2 md:p-5">
			<div class="w-full text-3xl font-bold uppercase">results backed by research</div>
			<div class="text-2xl font-thin">
				We believe that the best aesthetic results are achieved through the power of science. Our
				treatments are not only designed to enhance your natural beauty but are also grounded in
				rigorous scientific research and proven methodologies.
			</div>
			<div class="flex items-center gap-2">
				<a href="/results">
					<Button
						size="lg"
						variant="default"
						class="bg-sky-300 uppercase hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-300"
						>View Before & After Gallery</Button
					>
				</a>
			</div>
		</div>
	</div>
</div>
