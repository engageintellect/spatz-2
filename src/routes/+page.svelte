<script lang="ts">
	import type { PageData } from './$types.js';
	import { fade, slide } from 'svelte/transition';
	export let data: PageData;
	import AboutCard from '$lib/components/ui/AboutCard.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import Hero from '$lib/components/ui/Hero.svelte';
	import Quote from '$lib/components/ui/Quote.svelte';
	import { companyInfo } from '$lib/data.js';
	import { currentUser } from '$lib/stores/user.js';
	import Command from '$lib/components/ui/Command.svelte';
	import SkillsCard from '$lib/components/ui/SkillsCard.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import SpatzMarketing from '$lib/components/ui/SpatzMarketing.svelte';

	let showWelcome = true;

	const handleWelcome = () => {
		showWelcome = false;
	};
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
		{#if showWelcome}
			<div
				out:fade={{ duration: 200 }}
				class="mx-auto flex max-w-2xl flex-col gap-5 rounded-lg p-5 md:border md:shadow-lg"
			>
				<h1 class="text-3xl font-bold">Welcome, @{$currentUser.username}</h1>
				<p class="text-lg">
					We are glad to have you back. You can now access all our services and products.
				</p>
				<Command />

				<div class="flex items-center gap-2">
					<a href="/guestbook" class="w-fit">
						<Button>sign the guestbook</Button>
					</a>

					<Button variant="outline" class="w-fit" on:click={handleWelcome}>dismiss</Button>
				</div>
			</div>
		{/if}

		{#if !showWelcome}
			<div in:fade={{ duration: 200, delay: 200 }}>
				<SpatzMarketing />
			</div>
		{/if}

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
