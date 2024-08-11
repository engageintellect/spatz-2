<script lang="ts">
	import { PUBLIC_REPOSITORY_URL } from '$env/static/public';
	export let stars;
	export let issues;
	export let forks;
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import Animate from '$lib/components/ui/Animate.svelte';

	import BlurIn from '$lib/components/magic-ui/BlurIn.svelte';

	import Icon from '@iconify/svelte';
	onMount(() => {
		// Animate "stack" on mount

		gsap.fromTo(
			'.stat-card',
			{ opacity: 0, y: 10 },
			{
				opacity: 1,
				y: 0,
				duration: 1,
				ease: 'power4.out'
			}
		);
		gsap.fromTo(
			'.stat-title',
			{ opacity: 0 },
			{
				opacity: 1,
				x: 0,
				duration: 2,
				ease: 'power4.out'
			}
		);

		gsap.fromTo(
			'.stat-desc',
			{ opacity: 0, y: 10 },
			{
				opacity: 1,
				y: 0,
				duration: 2,
				ease: 'power4.out'
			}
		);

		gsap.fromTo(
			'.stat-icon',
			{ opacity: 0, y: 10, scale: 0.5 },
			{
				opacity: 1,
				y: 0,
				duration: 3,
				scale: 1,
				ease: 'power4.out'
			}
		);
	});
</script>

<div>
	<Animate
		settings={{
			before: {
				opacity: 0,
				y: -10
			},
			after: {
				opacity: 1,
				y: 0,
				duration: 3,
				ease: 'power4.out'
			}
		}}
	>
		<h1 class="mb-2 text-4xl font-bold text-primary">github stats</h1>
	</Animate>
	<div class="stat-card flex w-full rounded-lg border shadow-lg sm:flex-row">
		<a href={`${PUBLIC_REPOSITORY_URL}`} class="group w-full border-b border-r p-2 md:px-5">
			<div class="stat-title">Stars</div>
			<div class="flex items-center justify-between">
				<BlurIn word={stars || 0} class="" />
				<div class="stat-icon">
					<Icon
						icon="mdi:star"
						class="h-8 w-8 text-yellow-500 transition-all duration-300 md:h-12 md:w-12 md:group-hover:scale-105"
					/>
				</div>
			</div>
			<div class="stat-desc">
				<div class="text-sm">total stars</div>
			</div>
		</a>

		<a href={`${PUBLIC_REPOSITORY_URL}/issues`} class="group w-full border-b border-r p-2 md:px-5">
			<div class="stat-title">Issues</div>
			<div class="flex items-center justify-between">
				<BlurIn word={issues || 0} class="" />
				<div class="stat-icon">
					<Icon
						icon="octicon:issue-opened-24"
						class=" h-8 w-8 text-sky-500 transition-all duration-300 md:h-12 md:w-12 md:group-hover:scale-105"
					/>
				</div>
			</div>
			<div class="stat-desc">
				<div class="text-sm">open issues</div>
			</div>
		</a>

		<a href={`${PUBLIC_REPOSITORY_URL}`} class="group w-full p-2 md:px-5">
			<div class="stat-title">Forks</div>
			<div class="flex items-center justify-between">
				<BlurIn word={forks || 0} class="" />

				<div class="stat-icon">
					<Icon
						icon="carbon:fork"
						class="h-8 w-8 text-purple-500 transition-all duration-300 md:h-12 md:w-12 md:group-hover:scale-105"
					/>
				</div>
			</div>

			<div class="stat-desc">
				<div class="text-sm">total forks</div>
			</div>
		</a>
	</div>
</div>
