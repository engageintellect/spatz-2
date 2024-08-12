<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { onMount } from 'svelte';
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

	onMount(() => {
		getStars();
	});
</script>

<div class="mx-auto w-full max-w-2xl">
	<div class="flex flex-col gap-16 md:gap-16">
		<Hero />
		<Stats {stars} {issues} {forks} />
		<About />
		<FeaturesFeed />
		<GettingStarted />
		<Contribute />
	</div>
</div>
