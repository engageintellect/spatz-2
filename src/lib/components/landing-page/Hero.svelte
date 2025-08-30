<script lang="ts">
	import heroImage from '$lib/assets/images/svelteHero.png?enhanced';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import WordsPullUp from '$lib/components/magic-ui/WordsPullUp.svelte';

	function scrollToAnchor() {
		const element = document.getElementById('anchorLink');
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	let heroHidden = $state(true);

	$effect(() => {
		// Simple CSS-based animation trigger
		heroHidden = false;
	});
</script>

<div class={`mb-10 md:my-5 md:mb-20 ${heroHidden ? 'opacity-0' : ''}`}>
	<div
		class="flex w-full flex-col items-start gap-2 rounded-3xl transition-all duration-300 md:flex-row md:gap-5"
	>
		<div class="flex w-full flex-col rounded-l-lg p-2 md:max-w-lg md:p-10 md:p-5">
			<div class="mx-auto flex w-full flex-col items-center gap-5">
				<div
					class="hero-title w-full text-7xl font-bold lowercase tracking-tight transition-all duration-1000 ease-out lg:text-9xl"
				>
					<WordsPullUp
						class="animate-[gradient_3s_ease-in-out_infinite] bg-gradient-to-r from-foreground via-background to-background bg-[length:200%_100%] bg-clip-text text-7xl text-transparent lg:text-8xl"
						words="spatz 2"
					/>
				</div>
			</div>

			<div class="">
				<div class="hero-subtitle mt-5 text-xl font-thin text-muted-foreground transition-all duration-1000 delay-300 ease-out lg:text-2xl">
					<div class="font-base text-xl text-foreground lg:text-2xl">
						The <span class="text-orange-400">"do-everything"</span> template for svelte & sveltekit.
					</div>
					<div class="pt-3 text-sm">
						this time with svelte-animations, superforms, stripe, and shadcn-svelte.
					</div>
					<div class="mt-3 text-xs font-thin text-muted-foreground">
						an updated version of <a
							href="https://spatz.engage-dev.com"
							class="text-foreground underline">spatz</a
						>
					</div>
				</div>
			</div>

			<div class="hero-buttons mx-auto mt-5 flex w-full items-center gap-2 transition-all duration-1000 delay-500 ease-out md:max-w-lg">
				<a href="/auth/register" class="group/bookingsButton w-full">
					<Button size="lg" class="flex w-full items-center gap-2">
						<div class="text-lg lowercase">get started</div>
						<Icon
							icon="material-symbols:rocket-launch"
							class="h-5 w-5 transition-transform duration-300 lg:group-hover/bookingsButton:rotate-45"
						/>
					</Button>
				</a>

				<a href="/auth/login" class="group/bookingsButton w-full">
					<Button size="lg" variant="outline" class="flex w-full items-center gap-2">
						<div class="text-lg lowercase">login</div>
						<Icon
							icon="mdi:arrow-right"
							class="h-5 w-5 transition-transform duration-300 lg:group-hover/bookingsButton:translate-x-1"
						/>
					</Button>
				</a>
			</div>
		</div>

		<div class="hero-photo-background relative w-full transition-all duration-1000 delay-700 ease-out">
			<div
				class="pointer-events-none absolute left-0 h-full w-1/3 opacity-0 md:bg-fade-left md:opacity-100"
			></div>
			<div
				class="pointer-events-none absolute bottom-0 left-0 h-1/3 w-full bg-fade-down opacity-100 md:opacity-0"
			></div>

			<div
				class="mt-5 rounded-3xl rounded-b-none bg-gradient-to-b from-orange-500 to-yellow-500 md:rounded-none md:rounded-r-3xl"
			>
				<div class="hero-photo transition-all duration-1000 delay-900 ease-out">
					<enhanced:img
						src={heroImage}
						alt="logo"
						class="w-full animate-customBounce rounded-lg object-cover drop-shadow-lg md:h-full md:rounded-none md:rounded-r-lg"
					></enhanced:img>
				</div>
			</div>
		</div>
	</div>
	<div id="anchorLink" class="group/scrollDownButton mt-5 hidden w-full justify-center md:flex">
		<button
			onclick={scrollToAnchor}
			class="transition-all duration-300 md:group-hover/scrollDownButton:scale-[102%]"
			aria-label="Scroll Down"
		>
			<Icon
				icon="material-symbols-light:arrow-circle-down-outline"
				class="hero-down-button h-10 w-10 animate-pulse transition-all duration-1000 delay-1100 ease-out"
			/>
		</button>
	</div>
</div>

<style>
	/* CSS-based animations - much lighter than GSAP */
	.hero-title {
		opacity: 0;
		transform: translateY(20px);
		animation: fadeInUp 1s ease-out forwards;
	}

	.hero-subtitle {
		opacity: 0;
		transform: translateY(20px);
		animation: fadeInUp 1s ease-out 0.3s forwards;
	}

	.hero-buttons {
		opacity: 0;
		transform: translateY(10px);
		animation: fadeInUp 1s ease-out 0.5s forwards;
	}

	.hero-photo-background {
		opacity: 0;
		animation: fadeIn 1s ease-out 0.7s forwards;
	}

	.hero-photo {
		opacity: 0;
		transform: scale(0.95);
		animation: fadeInScale 1s ease-out 0.9s forwards;
	}

	.hero-down-button {
		opacity: 0;
		transform: translateY(-10px) scale(0.8);
		animation: fadeInBounce 1s ease-out 1.1s forwards;
	}

	@keyframes fadeInUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeIn {
		to {
			opacity: 1;
		}
	}

	@keyframes fadeInScale {
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes fadeInBounce {
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.gradient-text {
		background: linear-gradient(45deg, #fb923c, #ec4899, #a855f7, #3b82f6, #fb923c);
		background-size: 300% 300%;
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: gradient-shift 3s ease-in-out infinite;
	}

	@keyframes gradient-shift {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}
</style>
