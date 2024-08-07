<script lang="ts">
	import { PUBLIC_REPOSITORY_URL } from '$env/static/public';
	export let stars;
	export let issues;
	export let forks;

	import BlurIn from '$lib/components/magic-ui/BlurIn.svelte';

	import Icon from '@iconify/svelte';
</script>

<div class="flex w-full flex-col rounded-lg border shadow-lg sm:flex-row">
	<a
		href={`${PUBLIC_REPOSITORY_URL}`}
		class="group w-full border-b p-2 px-5 sm:p-5 md:border-b-0 md:border-r"
	>
		<div class="stat-title">Stars</div>
		<div class="flex items-center justify-between">
			<BlurIn word={stars || 0} class="" />
			<div>
				<Icon
					icon="mdi:star"
					class="h-12 w-12 text-primary text-yellow-500 transition-all duration-300 md:group-hover:scale-105"
				/>
			</div>
		</div>
		<div class="stat-desc">total stars</div>
	</a>

	<a
		href={`${PUBLIC_REPOSITORY_URL}/issues`}
		class="group w-full border-b p-2 px-5 sm:p-5 md:border-b-0 md:border-r"
	>
		<div class="stat-title">Issues</div>
		<div class="flex items-center justify-between">
			<BlurIn word={issues || 0} class="" />
			<div>
				<Icon
					icon="octicon:issue-opened-24"
					class="h-12 w-12 text-primary text-sky-500 transition-all duration-300 md:group-hover:scale-105"
				/>
			</div>
		</div>
		<div class="stat-desc">open issues</div>
	</a>

	<a href={`${PUBLIC_REPOSITORY_URL}`} class="group w-full p-2 px-5 sm:p-5">
		<div class="stat-title">Forks</div>
		<div class="flex items-center justify-between">
			<BlurIn word={forks || 0} class="" />

			<div>
				<Icon
					icon="carbon:fork"
					class="h-12 w-12 text-primary text-purple-500 transition-all duration-300 md:group-hover:scale-105"
				/>
			</div>
		</div>

		<div class="stat-desc">total forks</div>
	</a>
</div>
