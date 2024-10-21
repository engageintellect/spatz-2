<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import Particles from '$lib/components/magic-ui/Particles.svelte';
	import Globe from '$lib/components/magic-ui/Globe.svelte';
	import GlobeSection from '../ui/GlobeSection.svelte';

	let quote: string = $state();

	const fetchQuote = async () => {
		const response = await fetch('/api/fortune');
		const data = await response.json();
		quote = data;
	};

	let theme: any = $state();

	let gsapInstance: any;
	let ScrollTriggerInstance: any;

	const initializeAnimations = () => {
		tick();

		const isLargeScreen = window.matchMedia('(min-width: 768px)').matches;
		if (isLargeScreen) {
			gsapInstance.from('.quote-animation', {
				duration: 3,
				opacity: 0,
				scale: 0.95,
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
		theme = localStorage.getItem('mode-watcher-mode');
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

		fetchQuote();
	});

	onDestroy(() => {
		if (typeof window !== 'undefined' && ScrollTriggerInstance) {
			ScrollTriggerInstance.getAll().forEach((trigger: any) => trigger.kill());
		}
	});
</script>

<div class="quote-animation relative mx-auto flex h-full min-h-[525px] w-full justify-center pt-40">
	<Particles
		className="particles-animation absolute inset-0 h-full z-0 particle-grid"
		color={`${theme === 'light' ? '#e5e5e5' : '#525252'}`}
	/>
	<div class="w-full max-w-lg text-2xl md:text-3xl">
		<div class="px-2 font-thin italic leading-normal md:px-0">
			<div>
				{#if quote}
					{#each quote.split('\n') as line, index (line)}
						<span
							class={`block ${line.trim().startsWith('-') && index === quote.split('\n').length - 1 ? 'mb-5 mt-10 text-right' : ''}`}
							>{line.trim()}</span
						>
					{/each}
				{:else}
					Loading...
				{/if}
			</div>

			<GlobeSection />
			<!-- <div class="mt-10 text-right">— Jitka Zavadilova</div> -->
		</div>
	</div>
</div>
