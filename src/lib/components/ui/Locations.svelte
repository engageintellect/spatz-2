<script lang="ts">
	import LocationCard from '$lib/components/ui/LocationCard.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import { companyInfo } from '$lib/data';

	import { onDestroy, onMount, tick } from 'svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	let gsapInstance: any;
	let ScrollTriggerInstance: any;

	const initializeAnimations = () => {
		tick();

		const isLargeScreen = window.matchMedia('(min-width: 768px)').matches;

		if (isLargeScreen) {
			gsapInstance.from('.animate-locations', {
				duration: 1,
				opacity: 0,
				y: 20,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.animate-locations',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});
		} else {
			gsapInstance.from('.animate-locations', {
				duration: 1,
				opacity: 0,
				y: 20,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.animate-locations',
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

	// Function to generate Google Maps directions URL
	function getDirectionsUrl(address: string) {
		return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
	}
</script>

<!-- LOCATIONS SECTION -->
<div class="animate-locations z-0 w-full rounded-lg border p-2 shadow-lg md:p-5">
	<div class="mb-5 text-5xl font-bold uppercase">Locations</div>
	<div class="flex flex-col items-center gap-5 sm:flex-row">
		<div class="w-full">
			<div class="w-full text-xl font-thin">Corona Del Mar</div>
			<div class="w-full text-lg">{companyInfo.locations.coronaDelMar.address}</div>
			<a href={getDirectionsUrl(companyInfo.locations.coronaDelMar.address)} target="_blank">
				<Button variant="outline" class="flex items-center gap-2">
					<div class="uppercase">Directions</div>
					<Icon icon="material-symbols:location-on" class="h-5 w-5" />
				</Button>
			</a>
			<div class="mt-2">
				<a href={getDirectionsUrl(companyInfo.locations.coronaDelMar.address)} target="_blank">
					<LocationCard
						center={[-117.8725, 33.6007]}
						name={companyInfo.locations.coronaDelMar.address}
					/>
				</a>
			</div>
		</div>
		<div class="w-full">
			<div class="w-full text-xl font-thin">Long Beach</div>
			<div class="w-full text-lg">{companyInfo.locations.longBeach.address}</div>
			<a href={getDirectionsUrl(companyInfo.locations.longBeach.address)} target="_blank">
				<Button variant="outline" class="flex items-center gap-2">
					<div class="uppercase">Directions</div>
					<Icon icon="material-symbols:location-on" class="h-5 w-5" />
				</Button>
			</a>
			<div class="mt-2">
				<a href={getDirectionsUrl(companyInfo.locations.longBeach.address)} target="_blank">
					<LocationCard
						center={[-118.1229, 33.7562]}
						name={companyInfo.locations.longBeach.address}
					/>
				</a>
			</div>
		</div>
	</div>
</div>
