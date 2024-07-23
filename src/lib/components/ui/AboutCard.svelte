<script lang="ts">
	import jitkaImage from '$lib/assets/images/jitka.png?enhanced';
	import bbjLogo from '$lib/assets/images/bbj-logo.png?enhanced';
	import { Button } from './button/index.js';
	import Icon from '@iconify/svelte';

	import { onDestroy, onMount, tick } from 'svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	let gsapInstance: any;
	let ScrollTriggerInstance: any;
	let imageContainer: HTMLDivElement;
	let section1Container: HTMLDivElement;

	import TikTokStats from './TikTokStats.svelte';
	import { companyInfo } from '$lib/data.js';

	const initializeAnimations = () => {
		tick();

		gsapInstance.from('.section1', {
			duration: 1,
			opacity: 0,
			y: 20,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.section1',
				start: 'top 70%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.section2', {
			duration: 1,
			opacity: 0,
			scale: 0.9,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.section2',
				start: 'top 70%',
				toggleActions: 'play none none none'
			}
		});
	};

	const initializeObserver = () => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
						entry.target.classList.remove('invisible');
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.5
			}
		);

		if (imageContainer) {
			observer.observe(imageContainer);
		}

		if (section1Container) {
			observer.observe(section1Container);
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

			initializeObserver();
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined' && ScrollTriggerInstance) {
			ScrollTriggerInstance.getAll().forEach((trigger: any) => trigger.kill());
		}
	});
</script>

<div
	id="about"
	class="mx-auto flex w-full max-w-4xl flex-col items-center gap-5 rounded-lg transition-all duration-300 md:flex-row md:gap-0"
>
	<div class="section1 invisible relative flex w-full justify-center" bind:this={section1Container}>
		<div class="flex w-full max-w-md flex-col gap-5 text-center lg:p-5">
			<div class="w-full text-4xl font-bold">JITKA ZAVADILOVA, RN</div>
			<div class="text-xl font-thin md:text-2xl">
				Renowned on social media for her exceptional skills, she has become one of the most
				sought-after facial injectors, attracting millions of views.
			</div>
			<div class="flex items-center justify-center gap-5">
				<a href="/about">
					<Button
						size="lg"
						class="group/readMoreButton flex w-full items-center gap-2 text-xl uppercase md:w-fit"
						variant="ghost"
					>
						<div>Read More</div>
						<Icon
							icon="akar-icons:arrow-right"
							class="h-5 w-5 transition-transform duration-300 lg:group-hover/readMoreButton:translate-x-1"
						/>
					</Button>
				</a>
			</div>
			<TikTokStats />
		</div>
	</div>

	<div class="section2 relative flex w-full justify-end">
		<div
			class="invisible relative mx-auto h-80 w-64 transition-opacity duration-500 ease-in-out md:h-[450px] md:w-2/3"
			bind:this={imageContainer}
		>
			<a href="/about">
				<enhanced:img
					src={jitkaImage}
					alt="Jitka"
					class="h-full w-full rounded-full bg-pink-200 object-cover object-top transition-shadow duration-300 hover:shadow-lg md:rounded-lg md:bg-pink-100"
				></enhanced:img>
			</a>
			<div
				class="pointer-events-none absolute bottom-0 left-0 h-1/3 w-full rounded-full md:rounded-lg md:bg-fade-down"
			></div>
		</div>
	</div>
</div>
