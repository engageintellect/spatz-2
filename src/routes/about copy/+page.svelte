<script lang="ts">
	import jitkaImage from '$lib/assets/images/jitka.png?enhanced';
	import drReynoldsImage from '$lib/assets/images/dr-reynolds.png?enhanced';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Locations from '$lib/components/ui/Locations.svelte';
	import { onDestroy, onMount, tick } from 'svelte';

	function getDirectionsUrl(address: string) {
		return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
	}

	let gsapInstance: any;
	let ScrollTriggerInstance: any;

	const initializeAnimations = () => {
		tick();
		gsapInstance.from('.jitka-section', {
			duration: 1,
			opacity: 0,
			y: 20,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.jitka-section',
				start: 'top 80%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.jitka-section-photo', {
			duration: 1,
			opacity: 0,
			x: 10,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.jitka-section',
				start: 'top 80%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.doctor-section', {
			duration: 1,
			opacity: 0,
			y: 20,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.doctor-section',
				start: 'top 80%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.doctor-section-photo', {
			duration: 1,
			opacity: 0,
			x: -10,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.doctor-section',
				start: 'top 80%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.locations-section', {
			duration: 1,
			opacity: 0,
			y: 50,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.locations-section',
				start: 'top 80%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.booking-section', {
			duration: 1,
			opacity: 0,
			y: 10,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.booking-section',
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

<a href="javascript:history.back()">
	<Button variant="outline" class="flex items-center gap-2">
		<Icon icon="akar-icons:arrow-left" class="" />
		<div class="uppercase">Back</div>
	</Button>
</a>
<div class="mt-5 w-full">
	<!-- JITKA SECTION -->
	<div class="jitka-section mb-5 text-5xl font-thin md:text-7xl">ABOUT</div>
	<div
		class="jitka-section h-full w-full rounded-lg bg-pink-50 p-2 shadow-lg dark:bg-pink-500 md:p-5"
	>
		<div class="w-full text-5xl font-bold md:text-7xl">JITKA ZAVADILOVA, RN</div>
		<div class="mt-2 w-full text-3xl font-thin md:mt-5 md:text-5xl">Founder</div>
		<div class="mt-2 text-3xl text-foreground/70 md:mt-5">
			Serving patients in Orange County and Los Angeles, California.
		</div>

		<enhanced:img
			src={jitkaImage}
			alt="Jitka Zavadilova"
			class="jitka-section-photo mt-5 w-full rounded-lg bg-pink-300 object-cover shadow-xl md:float-right md:mt-5 md:w-1/3"
		></enhanced:img>
		<div class="mt-5 flex flex-col md:flex-row md:items-start">
			<div class="mr-5 flex-1 text-xl font-thin">
				<p>
					Jitka is a certified nurse injector and registered nurse, licensed in both the USA and
					Europe. Originally from the Czech Republic, Jitka began her nursing career at 18, working
					on a med-surg floor for six years before moving to the United States. Her passion for
					aesthetics blossomed while working under a top Cosmetic Dermatologist and Plastic Surgeon
					in Beverly Hills. She has since honed her skills with numerous certifications, including
					Juvederm, Restylane, Botox, and Dysport.
				</p>

				<p class="mt-5">
					Jitka excels in blending fillers with skincare rituals, believing in their harmonious
					pairing to maintain youthful and authentic skin. She is dedicated to recognizing and
					enhancing each person's unique beauty, creating individualized plans to achieve a look
					that best suits their natural features.
				</p>
			</div>
		</div>

		<div class="my-5">
			<div class="flex flex-col items-center gap-2 md:flex-row">
				<a href="/results" class="w-full md:w-fit">
					<Button size="lg" variant="default" class="w-full text-xl uppercase md:w-fit"
						>Patient Gallery</Button
					>
				</a>
				<a href="/contact" class="w-full md:w-fit">
					<Button size="lg" variant="outline" class="w-full text-xl uppercase md:w-fit"
						>Schedule Appointment</Button
					>
				</a>
			</div>
		</div>
	</div>

	<!-- DOCTOR SECTION -->
	<div
		class="doctor-section mt-20 h-full rounded-lg bg-teal-50 p-2 shadow-lg dark:bg-teal-500 md:mt-36 md:p-5"
	>
		<div class="w-full text-5xl font-bold md:text-7xl">STEVEN REYNOLDS, DO</div>
		<div class="mt-2 w-full text-3xl font-thin md:mt-5 md:text-5xl">Medical Director</div>
		<div class="mt-2 text-3xl text-foreground/70 md:mt-5">
			Serving patients in Long Beach, California.
		</div>

		<enhanced:img
			src={drReynoldsImage}
			alt="Dr. Steven Reynolds"
			class="doctor-section-photo mt-5 w-full scale-x-[-1] rounded-lg bg-teal-300 object-cover shadow-xl md:float-left md:mt-5 md:w-1/3"
		></enhanced:img>
		<div class="mt-5 flex flex-col md:flex-row md:items-start">
			<div class="ml-5 flex-1 text-xl font-thin">
				<p>
					Discover unparalleled healthcare with Dr. Reynolds, a seasoned Board Certified Family
					Medicine Specialist based in vibrant Long Beach, California. With over 29 years of
					dedicated practice, Dr. Reynolds brings a wealth of experience and expertise to his
					patients.
				</p>

				<p class="mt-5">
					As the principal investigator at CNS (Collaborative Neuroscience Research) since 2010, Dr.
					Reynolds leads pioneering trials in Long Beach. He also serves as an Associate Professor
					at the esteemed University of Irvine College of Medicine, shaping future medical
					professionals.
				</p>
			</div>
		</div>
	</div>
</div>

<div class="mt-20 md:mt-48">
	<Locations />
</div>

<!-- BOOKING -->
<div class="booking-section my-40 flex w-full flex-col items-center p-2 md:p-5">
	<div class="mb-5 text-5xl font-bold md:text-7xl">Booking</div>
	<a href="/contact">
		<Button size="lg" variant="default" class="flex w-full items-center gap-2 text-xl md:w-fit">
			<div class="uppercase">Schedule a Consultation</div>
			<Icon icon="akar-icons:arrow-right" class="h-5 w-5" />
		</Button>
	</a>
</div>
