<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { onMount, tick } from 'svelte';
	import SignGuestbookButton from '$lib/components/ui/SignGuestbookButton.svelte';
	import Hero from '$lib/components/marketing/Hero.svelte';
	import Stats from '$lib/components/marketing/Stats.svelte';
	import About from '$lib/components/marketing/About.svelte';
	import FeaturesFeed from '$lib/components/ui/FeaturesFeed.svelte';
	import GettingStarted from '$lib/components/marketing/GettingStarted.svelte';
	import Contribute from '$lib/components/marketing/Contribute.svelte';
	import { animateMainStagger } from '$lib/animations';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';

	let hidden = $state(true);
	let sidebar = useSidebar();

	let stars = $state(0),
		issues = $state(0),
		forks = $state(0);

	const getStars = async () => {
		const res = await fetch(`${PUBLIC_BASE_URL}/api/repo-data`);
		const { stars: fetchedStars, issues: fetchedIssues, forks: fetchedForks } = await res.json();
		stars = fetchedStars;
		issues = fetchedIssues;
		forks = fetchedForks;
	};

	onMount(async () => {
		hidden = false;
		animateMainStagger();
		await getStars();
		await tick(); // Wait for DOM updates
	});
</script>

<div
	class={`${hidden ? 'opacity-0' : ''} animate-item mx-auto w-full max-w-2xl px-2 leading-relaxed md:px-0`}
>
	<div class="mb-10 flex flex-col gap-16 md:gap-16">
		<div class="">
			<Hero />
		</div>

		<div class="animate-item">
			<About />
		</div>

		<div class="animate-item">
			<Stats {stars} {issues} {forks} />
		</div>

		<div class="animate-item">
			<SignGuestbookButton />
		</div>

		<div
			class={`${sidebar.state === 'expanded' ? 'sm:hidden lg:block' : '' && sidebar.isMobile} animate-item`}
		>
			<FeaturesFeed />
		</div>
		<div class="animate-item">
			<GettingStarted />
		</div>

		<div class="animate-item">
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
