<script lang="ts">
	import type { PageData } from './$types.js';
	export let data: PageData;
	import { onMount } from 'svelte';
	import AboutCard from '$lib/components/ui/AboutCard.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import Hero from '$lib/components/ui/Hero.svelte';
	import Difference from '$lib/components/ui/Difference.svelte';
	import SocialLinks from '$lib/components/ui/SocialLinks.svelte';
	import Quote from '$lib/components/ui/Quote.svelte';
	import Locations from '$lib/components/ui/Locations.svelte';
	import { companyInfo } from '$lib/data.js';
	import { currentUser } from '$lib/stores/user.js';
</script>

<svelte:head>
	<title>Home : {companyInfo.name}</title>
	<meta
		name="description"
		content={`${companyInfo.name} is dedicated to providing top-notch services to our clients.`}
	/>
</svelte:head>

<div class="flex flex-col gap-10 md:gap-20">
	{#if $currentUser}
		<div class="flex flex-col gap-5 p-5">
			<h1 class="text-3xl font-bold">Welcome back, {$currentUser.username}</h1>
			<p class="text-lg">
				We are glad to have you back. You can now access all our services and products.
			</p>
		</div>
	{:else}
		<Hero />
	{/if}
	<!-- <Hero /> -->
	<!-- <AboutCard /> -->
	<!-- <Quote /> -->
	<!-- <Difference /> -->
	<!-- <Locations /> -->
	<!-- <SocialLinks /> -->
	<!-- <div
		class="mb-5 flex h-full w-full flex-col justify-center gap-5 rounded-lg p-5 transition-all duration-500 sm:min-h-full md:mb-20 md:flex-row md:justify-center md:border md:shadow-lg"
	>
		<Form data={data.form} />
	</div> -->
</div>
