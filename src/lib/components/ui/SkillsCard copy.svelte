<script lang="ts">
	import girlImage from '$lib/assets/images/girl1.png';
	import jitkaImage from '$lib/assets/images/jitka.png';
	import { Button } from './button/index.js';
	import Icon from '@iconify/svelte';
	import { onDestroy, onMount, tick } from 'svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	let gsapInstance: any;
	let ScrollTriggerInstance: any;

	const initializeAnimations = () => {
		tick();

		gsapInstance.from('.animate-on-scroll-up', {
			duration: 1,
			opacity: 0,
			y: 50,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.animate-on-scroll-up',
				start: 'top 80%', // Adjust as needed
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.animate-on-scroll-down', {
			duration: 1,
			opacity: 0,
			y: -50,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.animate-on-scroll-down',
				start: 'top 80%', // Adjust as needed
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

<div class="my-10 flex w-full flex-col gap-10 md:flex-row md:gap-0">
	<div class="animate-on-scroll-up flex w-full rounded-lg bg-pink-100 shadow-lg dark:bg-pink-500">
		<div class="z-20 flex w-1/2 flex-col gap-5 p-5">
			<div class="w-full text-5xl font-bold">AESTHETICS AND BEAUTY, COMBINED</div>
			<div class="text-xl font-thin">
				We execute each treatment meticulously to deliver optimal outcomes. Attain stunning results
				with tailored treatments that complement your unique features.
			</div>

			<div>
				<a href="/results">
					<Button size="lg" class="group/resultsButton flex items-center gap-2 text-xl">
						<div>See Results</div>
						<Icon
							icon="mdi:arrow-right"
							class="transition-all duration-300 md:group-hover/resultsButton:translate-x-1"
						/>
					</Button>
				</a>
			</div>
		</div>

		<img src={girlImage} alt="Jitka" class="w-1/2 object-cover" />
	</div>

	<div class="animate-on-scroll-down w-full md:translate-y-10">
		<div
			class="flex h-full flex-col gap-5 rounded-lg bg-neutral-100 p-5 shadow-lg dark:bg-neutral-700"
		>
			<div class="flex flex-col gap-2">
				<div class="text-2xl font-bold">Committed to Safety</div>
				<div class="italic">
					"Safety is the cornerstone of Beauty By Jitka. As a fully-trained professional operating
					in a state-of-the-art facility, I provide a safe, comfortable, and exceptional
					experience."
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<div class="text-2xl font-bold">Tailored Treatments</div>
				<div class="italic">
					"I believe in dedicating myself to every treatment, customizing it in unique ways to align
					with your individual goals and beauty. With a thorough consultation process, I can design
					your treatment from scratch for a bespoke approach."
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<div class="text-2xl font-bold">Sneak a Peak</div>
				<div class="italic">
					"Images often convey more than words, and results speak for themselves. Explore our full
					gallery of before-and-after photos to witness the transformations possible through our
					comprehensive suite of treatments."
				</div>
			</div>

			<!-- <Avatar.Root class="h-14 w-14">
				<Avatar.Image
					class="h-full w-full bg-pink-500 object-cover object-top"
					src={jitkaImage}
					alt="@shadcn"
				/>
				<Avatar.Fallback>JV</Avatar.Fallback>
			</Avatar.Root> -->
		</div>
	</div>
</div>
