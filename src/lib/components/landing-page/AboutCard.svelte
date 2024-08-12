<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';

	import { onDestroy, onMount, tick } from 'svelte';

	let gsapInstance: any;
	let ScrollTriggerInstance: any;
	let imageContainer: HTMLDivElement;
	let section1Container: HTMLDivElement;

	let heroHidden = true;
	const initializeAnimations = () => {
		tick();
		heroHidden = false;

		gsapInstance.from('.section1', {
			duration: 1,
			delay: 0.1,
			opacity: 0,
			y: 20,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.section1',
				start: 'top 70%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.section2', {
			duration: 1,
			delay: 0.1,
			opacity: 0,
			scale: 0.9,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.section2',
				start: 'top 70%',
				toggleActions: 'play none none none'
			}
		});
	};

	const initializeObserver = () => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
						entry.target.classList.remove('invisible');
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.5
			}
		);

		if (imageContainer) {
			observer.observe(imageContainer);
		}

		if (section1Container) {
			observer.observe(section1Container);
		}
	};

	onMount(() => {
		if (typeof window !== 'undefined') {
			import('gsap').then(({ gsap }) => {
				import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
					gsap.registerPlugin(ScrollTrigger);
					gsapInstance = gsap;
					ScrollTriggerInstance = ScrollTrigger;
					initializeAnimations();
					ScrollTriggerInstance.refresh();
				});
			});

			initializeObserver();
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined' && ScrollTriggerInstance) {
			ScrollTriggerInstance.getAll().forEach((trigger: any) => trigger.kill());
		}
	});
</script>

<div
	id="about"
	class={` ${heroHidden ? 'opacity-0' : ''} mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-5 rounded-lg transition-all duration-300 md:flex-row md:gap-0`}
>
	<div class="section1 invisible relative flex w-full justify-center" bind:this={section1Container}>
		<div class="flex w-full max-w-md flex-col gap-5 text-center lg:p-5">
			<div class="w-full text-4xl font-bold">@engageintellect</div>
			<div class="text-xl font-thin md:text-2xl">
				I invite you to use and improve this project. Feedback and pull requests are welcome, and
				appreciated.
			</div>
			<div class="flex items-center justify-center gap-5">
				<a href="https://cook.engage-dev.com">
					<Button
						size="lg"
						class="group/readMoreButton flex w-full items-center gap-2 text-xl uppercase md:w-fit"
						variant="ghost"
					>
						<div class="lowercase">Homepage</div>
						<Icon
							icon="mdi:arrow-right"
							class="h-5 w-5 transition-transform duration-300 lg:group-hover/readMoreButton:translate-x-1"
						/>
					</Button>
				</a>
			</div>
			<!-- <TikTokStats /> -->
		</div>
	</div>

	<div class="section2 relative flex w-full justify-end">
		<div
			class="invisible relative mx-auto flex h-52 w-52 items-center justify-center rounded-lg transition-opacity duration-500 ease-in-out md:h-64 md:w-64"
			bind:this={imageContainer}
		>
			<a href="https://github.com/engageintellect/spatz-2">
				<!-- <Icon icon="simple-icons:pocketbase" class="h-52 w-52 text-neutral-900" /> -->
				<img
					src={`https://github.com/engageintellect.png`}
					alt="@engageintellect"
					class="h-full w-full rounded-full object-cover object-top transition-shadow duration-300 hover:shadow-lg md:rounded-lg"
				/>
			</a>
			<!-- <div
				class="pointer-events-none absolute bottom-0 left-0 h-1/3 w-full rounded-full md:rounded-lg md:bg-fade-down"
			></div> -->
		</div>
	</div>
</div>
