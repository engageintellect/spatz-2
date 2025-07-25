<script lang="ts">
	import { formatFriendlyDate, timeSince, getImageURL } from '$lib/utils';
	import { onMount, tick, onDestroy } from 'svelte';
	import { lazyLoad } from '$lib/lazyLoad'; // Import the lazy load function
	import { Input } from '$lib/components/ui/input/index.js'; // Import the Input component
	import { page } from '$app/stores';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import Icon from '@iconify/svelte';
	import { animateMainStagger } from '$lib/animations';
	import { Button } from '$lib/components/ui/button/index.js';
	import { currentUser } from '$lib/stores/user.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js'; // Adjust the path as needed

	let sidebar = useSidebar(); // Initialize the sidebar

	import { gsap } from 'gsap';
	import ScrollIndicator from '$lib/components/ui/ScrollIndicator.svelte';

	interface Props {
		data: any;
	}

	let { data }: Props = $props();

	let hidden = $state(true);

	let filter = $state(''); // Add a filter variable
	let showScrollToTop = $state(false);

	$effect(() => {
		$currentUser = data.user;
	});

	let sortOption = $state('all'); // Default sort option

	// Reactive block to handle filtering users based on filter text and sort option
	let filteredUsers = $derived(
		(() => {
			let result = data.users.filter((user: any) =>
				user.username.toLowerCase().includes(filter.toLowerCase())
			);
			if (sortOption === 'following') {
				result = result.filter((user: any) => $currentUser.following.includes(user.id));
			}
			return result;
		})()
	);

	const handleScroll = () => {
		const shouldShow = window.scrollY > 100;
		if (shouldShow !== showScrollToTop) {
			showScrollToTop = shouldShow;
			if (showScrollToTop) {
				gsap.to('.scroll-to-top-btn', {
					opacity: 1,
					y: 0,
					duration: 1,
					ease: 'power4.out'
				});
			} else {
				gsap.to('.scroll-to-top-btn', {
					opacity: 0,
					y: 20,
					duration: 1,
					ease: 'power4.out'
				});
			}
		}
	};

	onMount(async () => {
		await tick();
		animateMainStagger();
		window.addEventListener('scroll', handleScroll);

		if (typeof window !== 'undefined') {
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);
			hidden = false;

			gsap.fromTo(
				'.animate-user',
				{ opacity: 0, y: -10 },
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					ease: 'power4.out'
				}
			);
			gsap.fromTo(
				'.animate-db',
				{ opacity: 0, x: -50 },
				{
					opacity: 1,
					x: 0,
					duration: 1,
					ease: 'power4.out'
				}
			);
			gsap.fromTo(
				'.animate-input',
				{ opacity: 0, scale: 0.95 },
				{
					opacity: 1,
					scale: 1,
					duration: 1,
					ease: 'power4.out'
				}
			);
			gsap.fromTo(
				'.animate-grid',
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					delay: 0.25,
					y: 0,
					duration: 1,
					ease: 'power4.out'
				}
			);

			document.querySelectorAll('.user-wrapper').forEach((el) => {
				lazyLoad(el as HTMLElement);
			});
			ScrollTrigger.refresh();

			const unsubscribe = page.subscribe(() => {
				ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
				ScrollTrigger.refresh();
			});

			onDestroy(() => {
				unsubscribe();
				ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
				window.removeEventListener('scroll', handleScroll);
			});
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
				ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
				window.removeEventListener('scroll', handleScroll);
			});
		}
	});
</script>

<ScrollIndicator />

<div class={`${hidden ? 'opacity-0' : ''} mx-auto max-w-2xl`}>
	<Button
		onclick={() => window.history.back()}
		size="sm"
		variant="outline"
		class="group/backButton backButton flex items-center gap-2"
	>
		<Icon
			icon="mdi:arrow-left"
			class="h-5 w-5 transition-all duration-300 md:group-hover/backButton:-translate-x-1"
		/>
		<span class="text-sm">back</span>
	</Button>

	<div
		class={`${sidebar.state === 'expanded' ? 'lg:border lg:p-5' : 'md:border md:p-5'} animate-item mt-5 rounded-lg`}
	>
		<div class="bg-base-100 mx-auto h-full w-full">
			<h1 class="flex items-center gap-2 text-6xl font-bold text-primary">
				<span class="animate-user">user</span>
				<span class="animate-db font-thin text-primary/50">db</span>
			</h1>
		</div>

		<!-- Add an input field to filter by username -->
		<div class="sticky top-[57px] z-50 mb-5 bg-background pt-5">
			<div
				class="animate-input mb-5 flex items-center rounded-lg border bg-background bg-background px-2 focus-within:ring-0 focus-within:ring-offset-1"
			>
				<Icon icon={`material-symbols:search`} class="h-7 w-7" />
				<Input
					type="text"
					class="border-none p-2 outline-none focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
					placeholder="Search users by username..."
					bind:value={filter}
				/>
			</div>

			<div class=" flex items-center justify-between border-b pb-2 text-xl font-thin">
				<!-- Display the total count of filtered users -->
				<div class="text-muted-foreground">
					{filter ? 'query matches' : 'total users'}:
					<span class="text-foreground">{filteredUsers.length}</span>
				</div>

				<div class="flex items-center gap-2">
					<Button
						size="sm"
						variant={sortOption === 'all' ? 'default' : 'ghost'}
						onclick={() => (sortOption = 'all')}
						class="flex items-center gap-2 text-xs transition-all duration-300"
					>
						<div>all</div>
						<Icon
							icon="material-symbols:background-grid-small"
							class={`${sortOption === 'all' ? 'text-success' : ''} h-4 w-4`}
						/>
					</Button>

					<Button
						size="sm"
						variant={sortOption === 'following' ? 'default' : 'ghost'}
						onclick={() => (sortOption = 'following')}
						class="flex items-center gap-2 text-xs transition-all duration-300"
					>
						<div>following</div>
						<Icon
							icon="mingcute:user-follow-fill"
							class={`${sortOption === 'following' ? 'text-info' : ''} h-4 w-4`}
						/>
					</Button>
				</div>
			</div>
		</div>

		<!-- Display filtered users -->
		<div class="animate-grid grid grid-cols-1 gap-2 px-1 pb-40 sm:grid-cols-2 md:grid-cols-3">
			{#each filteredUsers as user}
				<a href={`/users/${user.id}`} class="user-wrapper group/userCard">
					<div class={`rounded-lg border p-3 transition-all duration-300 md:hover:bg-secondary`}>
						<div class="flex flex-row items-center gap-2">
							<div>
								<div class="h-10 w-10">
									<img
										class="transition-translate h-full w-full rounded-full border object-cover duration-200 md:group-hover/userCard:scale-[102%]"
										alt={user.username}
										src={user?.avatar
											? getImageURL(user?.collectionId, user?.id, user?.avatar)
											: `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
									/>
								</div>
							</div>

							<div class="flex flex-col truncate">
								<h1 class="truncate whitespace-nowrap text-sm">{user.username}</h1>
								<h1 class="mt-1 truncate whitespace-nowrap text-[0.75rem] text-muted-foreground">
									joined {timeSince(formatFriendlyDate(user.created))}
								</h1>
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>

{#if showScrollToTop === true}
	<div class="flex justify-center">
		<ScrollToTopButton />
	</div>
{/if}
