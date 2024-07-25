<script lang="ts">
	import heroImage from '$lib/assets/images/svelteHero.png?enhanced';
	import { Button } from './button/index.js';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import Icon from '@iconify/svelte';
	import { siteInfo } from '$lib/data';

	function scrollToAnchor() {
		const element = document.getElementById('anchorLink');
		// console.log(element);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	onMount(() => {
		gsap.from('.animate-logo', {
			duration: 2,
			// x: '100%',
			scale: 0.5,
			opacity: 0,
			ease: 'power4.out',
			delay: 0
		});

		gsap.from('.animate-title', {
			duration: 2,
			opacity: 0,
			ease: 'power4.out',
			delay: 0
		});
		gsap.from('.animate-photo', {
			duration: 7,
			opacity: 0,
			ease: 'power4.out',
			delay: 0
		});

		// gsap.from('.animate-subtitle', {
		// 	duration: 3.0,
		// 	opacity: 0,
		// 	ease: 'power4.out',
		// 	delay: 0
		// });

		gsap.from('.animate-hero-text', {
			duration: 7,
			opacity: 0,
			ease: 'power4.out',
			delay: 0
		});

		gsap.from('.animate-buttons', {
			duration: 0.5,
			y: -10,
			opacity: 0,
			ease: 'power4.out',
			delay: 0
		});

		gsap.from('.animate-down-button', {
			duration: 3,
			opacity: 0,
			y: -10,
			scale: 0.0,
			ease: 'power4.out',
			delay: 0
		});
	});
</script>

<!-- TODO: Debug as to why this works, but throws an error -->

<!-- <svelte:head>
	<link rel="preload" as="image" href={heroImage} />
</svelte:head> -->

<div class="mb-10 md:my-5 md:mb-20">
	<div
		class="flex w-full flex-col gap-2 rounded-lg transition-all duration-300 md:flex-row md:gap-5"
	>
		<div class="flex w-full flex-col rounded-l-lg p-5 md:max-w-lg md:p-10">
			<div class="mx-auto flex w-full flex-col items-center gap-5">
				<!-- <div class="animate-logo h-16 w-16">
					<Icon
						icon="material-symbols:code-rounded"
						class="h-full w-full rounded-full border border-foreground p-2"
					/>
				</div> -->
				<div
					class="animate-title w-full text-7xl font-bold lowercase tracking-tight transition-transform lg:text-7xl"
				>
					{siteInfo.name}
				</div>
			</div>

			<div class="">
				<!-- <div class="animate-subtitle text-3xl text-foreground/80 md:text-4xl">
					Transform Your Look with Confidence and Precision.
				</div> -->

				<div class="animate-hero-text mt-2 text-2xl">
					Back for round two, this time with superforms, shadcn, and magic-ui.
				</div>
			</div>

			<div class="animate-buttons mx-auto mt-10 flex w-full items-center gap-2 md:max-w-lg">
				<a href="/auth/register" class="group/bookingsButton w-full">
					<Button size="lg" class="flex w-full items-center gap-2">
						<div class="uppercase">get started</div>
						<Icon
							icon="material-symbols:rocket-launch"
							class="h-5 w-5 transition-transform duration-300 lg:group-hover/bookingsButton:translate-x-1"
						/>
					</Button>
				</a>

				<a href="/auth/login" class="group/bookingsButton w-full">
					<Button size="lg" variant="outline" class="flex w-full items-center gap-2">
						<div class="uppercase">login</div>
						<Icon
							icon="akar-icons:arrow-right"
							class="h-5 w-5 transition-transform duration-300 lg:group-hover/bookingsButton:translate-x-1"
						/>
					</Button>
				</a>
			</div>
		</div>

		<div class="animate-photo relative w-full">
			<div
				class="pointer-events-none absolute left-0 h-full w-1/3 opacity-0 md:bg-fade-left md:opacity-100"
			></div>
			<div
				class="pointer-events-none absolute bottom-0 left-0 h-1/3 w-full bg-fade-down opacity-100 md:opacity-0"
			></div>

			<div class="">
				<enhanced:img
					src={heroImage}
					alt="logo"
					class="w-full rounded-lg bg-orange-500 object-cover dark:bg-orange-700 md:h-full md:rounded-none md:rounded-r-lg"
				></enhanced:img>
			</div>
		</div>
	</div>
	<div id="anchorLink" class="group/scrollDownButton mt-5 hidden w-full justify-center md:flex">
		<button
			on:click={scrollToAnchor}
			class="transition-all duration-300 md:group-hover/scrollDownButton:scale-[102%]"
			aria-label="Scroll Down"
		>
			<Icon
				icon="material-symbols:arrow-drop-down"
				class="animate-down-button h-16 w-16 animate-pulse"
			/>
		</button>
	</div>
</div>
