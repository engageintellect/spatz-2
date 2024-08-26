<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { onMount, tick } from 'svelte';
	import { gsap } from 'gsap';
	import ScrollTrigger from 'gsap/dist/ScrollTrigger';
	import SignGuestbookButton from '$lib/components/ui/SignGuestbookButton.svelte';
	import Hero from '$lib/components/marketing/Hero.svelte';
	import Stats from '$lib/components/marketing/Stats.svelte';
	import About from '$lib/components/marketing/About.svelte';
	import FeaturesFeed from '$lib/components/ui/FeaturesFeed.svelte';
	import GettingStarted from '$lib/components/marketing/GettingStarted.svelte';
	import Contribute from '$lib/components/marketing/Contribute.svelte';

	let stars = 0,
		issues = 0,
		forks = 0;

	const getStars = async () => {
		const res = await fetch(`${PUBLIC_BASE_URL}/api/repo-data`);
		const { stars: fetchedStars, issues: fetchedIssues, forks: fetchedForks } = await res.json();
		stars = fetchedStars;
		issues = fetchedIssues;
		forks = fetchedForks;
	};

	onMount(async () => {
		await getStars();
		gsap.registerPlugin(ScrollTrigger);
		await tick(); // Wait for DOM updates
		applyAnimations();
	});

	async function applyAnimations() {
		await tick(); // Ensure the DOM is fully updated
		gsap.utils.toArray<HTMLElement>('.fade-in').forEach((element: HTMLElement) => {
			gsap.fromTo(
				element,
				{ opacity: 0 },
				{
					opacity: 1,
					y: -20,
					duration: 0.5,
					scrollTrigger: {
						trigger: element,
						start: 'top 90%',
						end: 'bottom top'
					}
				}
			);
		});
	}
</script>

<div class="mx-auto w-full max-w-2xl">
	<div class="flex flex-col gap-16 md:gap-16">
		<div class="fade-in">
			<Hero />
		</div>

		<div class="fade-in">
			<Stats {stars} {issues} {forks} />
		</div>

		<div class="fade-in">
			<About />
		</div>

		<div class="fade-in">
			<FeaturesFeed />
		</div>
		<div class="fade-in">
			<GettingStarted />
		</div>

		<div class="fade-in">
			<SignGuestbookButton />
		</div>
		<div class="fade-in">
			<Contribute />
		</div>
	</div>
</div>

<style>
	.fade-in {
		opacity: 0;
		transition: opacity 0.5s ease-out;
	}
</style>
