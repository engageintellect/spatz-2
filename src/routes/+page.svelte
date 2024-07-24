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
	import Command from '$lib/components/ui/Command.svelte';
	import SkillsCard from '$lib/components/ui/SkillsCard.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Stats from '$lib/components/ui/Stats.svelte';
	import SpatzMarketing from '$lib/components/ui/SpatzMarketing.svelte';
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
		<!-- <div class="mx-auto flex max-w-2xl flex-col gap-5 rounded-lg p-5 md:border md:shadow-lg">
			<h1 class="text-3xl font-bold">Welcome, @{$currentUser.username}</h1>
			<p class="text-lg">
				We are glad to have you back. You can now access all our services and products.
			</p>
			<Command />

			<a href="/guestbook" class="w-fit">
				<Button>sign the guestbook</Button>
			</a>
		</div> -->

		<SpatzMarketing />

		<!-- <SkillsCard /> -->
	{:else}
		<Hero />
		<AboutCard />
		<SkillsCard />
		<Quote />
		<!-- <Hero /> -->
		<!-- <Difference /> -->
		<!-- <Locations /> -->
		<!-- <SocialLinks /> -->
		<div
			class="mb-5 flex h-full w-full flex-col justify-center gap-5 rounded-lg p-5 transition-all duration-500 sm:min-h-full md:mb-20 md:flex-row md:justify-center md:border md:shadow-lg"
		>
			<Form data={data.form} />
		</div>
	{/if}
</div>
