<script lang="ts">
	import Icon from '@iconify/svelte';
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import TechnologyCard from '$lib/components/ui/TechnologyCard.svelte';
	import { services } from '$lib/data';
	import Input from '$lib/components/ui/input/input.svelte';
	import { siteInfo } from '$lib/data';
	import { goBack } from '$lib/utils';

	let showModal = $state(false);
	let modalImageSrc = $state('');

	function openModal(src: any) {
		modalImageSrc = src;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	onMount(() => {
		const images = document.querySelectorAll('.animate-results');
		gsap.from(images, {
			duration: 1,
			opacity: 0,
			y: 20,
			stagger: 0.1,
			ease: 'power2.out'
		});

		gsap.from('.animate-title', {
			duration: 0.5,
			opacity: 0,
			x: 20,
			ease: 'power2.out'
		});
	});

	let searchFiler = $state('');
</script>

<svelte:head>
	<title>Services : {siteInfo.name}</title>
	<meta name="description" content={`${siteInfo.name} services menu.`} />
</svelte:head>

<div>
	<div class="flex items-center justify-between gap-5">
		<Button onclick={goBack} variant="outline" class="flex items-center gap-2">
			<Icon icon="mdi:arrow-left" class="" />
			<div class="lowercase">Back</div>
		</Button>

		<Input bind:value={searchFiler} placeholder="Filter Technologies" class="w-full max-w-lg" />

		<!-- <a href={'javascript:history.back()'}>
			<Button size="lg" variant="outline" class="flex items-center gap-2">
				<Icon icon="akar-icons:arrow-left" class="" />
				<div class="uppercase">Back</div>
			</Button>
		</a> -->
	</div>

	<div class="animate-results my-5 grid gap-2 md:grid-cols-2 md:gap-5">
		{#if searchFiler === ''}
			{#each services as service}
				<a href="/contact">
					<TechnologyCard
						name={service.name}
						description={service.description}
						img={service.img}
						comingSoon={service.coming_soon}
					/>
				</a>
			{/each}
		{:else}
			{#each services as service}
				{#if service.name.toLowerCase().includes(searchFiler.toLowerCase())}
					<a href="/contact">
						<TechnologyCard
							name={service.name}
							description={service.description}
							img={service.img}
							comingSoon={service.coming_soon}
						/>
					</a>
				{/if}
			{/each}
		{/if}
	</div>

	{#if showModal}
		<Modal imageSrc={modalImageSrc} onClose={closeModal} />
	{/if}
</div>
