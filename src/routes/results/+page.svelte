<script lang="ts">
	import Icon from '@iconify/svelte';
	import { results } from '$lib/carousel-images';
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import LazyImage from '$lib/components/ui/LazyImage.svelte';
	import { companyInfo } from '$lib/data';

	let showModal = false;
	let modalImageSrc = '';

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
			x: 50,
			ease: 'power2.out'
		});
	});
</script>

<svelte:head>
	<title>Before & Afters : {companyInfo.name}</title>
	<meta
		name="description"
		content={`${companyInfo.name} "Before & After" results from our clients.`}
	/>
</svelte:head>

<div>
	<a href={'javascript:history.back()'}>
		<Button size="lg" variant="outline" class="flex items-center gap-2">
			<Icon icon="akar-icons:arrow-left" class="" />
			<div class="uppercase">Back</div>
		</Button>
	</a>
	<!-- <div class="animate-title mt-5 flex items-center gap-5">
		<div class="text-5xl font-bold md:text-7xl">Gallery</div>
		<Icon icon="ri:gallery-view-2" class="text-5xl md:text-7xl" />
	</div> -->

	<div class="animate-results my-5 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
		{#each results as result}
			<div class="animate-results group">
				<button
					class="h-full w-full cursor-pointer rounded-lg object-cover shadow-lg transition-all duration-300 md:group-hover:-translate-y-[1px] md:group-hover:saturate-[110%]"
					on:click={() => openModal(result.image)}
					on:keydown={(e) => e.key === 'Enter' && openModal(result.image)}
				>
					<enhanced:img
						src={result.image}
						alt="result"
						class="h-full w-full rounded-lg object-cover"
					></enhanced:img>
				</button>
			</div>
		{/each}
	</div>

	{#if showModal}
		<Modal imageSrc={modalImageSrc} onClose={closeModal} />
	{/if}
</div>
