<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { page } from '$app/stores';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import { currentUser } from '$lib/stores/user.js';
	import { getImageURL } from '$lib/utils';
	import Post from '$lib/components/ui/Post.svelte';
	import PostInputArea from '$lib/components/ui/PostInputArea.svelte';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { gsap } from 'gsap';
	import { lazyLoad } from '$lib/lazyLoad';
	import ScrollIndicator from '$lib/components/ui/ScrollIndicator.svelte';
	import { animateMainStagger } from '$lib/animations';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js'; // Adjust the path as needed

	let sidebar = useSidebar(); // Initialize the sidebar

	interface Props {
		data: {
			user: App.User;
			posts: App.Post[];
			post: App.Post;
		};
		form: {
			data: {
				content?: string;
				post?: string;
			};
			errors: {
				content?: string[];
			};
		};
	}

	let { data, form }: Props = $props();

	let hidden: boolean = $state(true);
	let loading: boolean = $state(false);
	let isSubmitting: boolean = $state(false);

	$effect(() => {
		currentUser.set(data.user);
	});

	let showScrollToTop = $state(false);
	let sortOption = $state('date'); // Default sort option

	function sortByDate(posts: App.Post[]) {
		return posts.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
	}

	function sortByLikes(posts: App.Post[]) {
		// Create a new sorted array without mutating the original posts array
		return [...posts].sort((a, b) => b.likes.length - a.likes.length);
	}

	function sortByCurrentUser(posts: App.Post[]) {
		return posts.filter((post) => post.author === $currentUser.id);
	}

	function sortByFollowing(posts: App.Post[]) {
		return posts.filter((post) => $currentUser.following.includes(post.author));
	}

	let emptyMentioningPostsCount = $derived(
		data.posts.filter((post) => post.mentioning.length === 0).length
	);

	let sortedPosts = $derived.by(() => {
		let posts = [...data.posts]; // Create a copy of posts to avoid mutation
		switch (sortOption) {
			case 'following':
				return sortByFollowing(posts);
			case 'likes':
				return sortByLikes(posts);
			case 'user':
				return sortByCurrentUser(posts);
			case 'date':
			default:
				return sortByDate(posts);
		}
	});

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
		hidden = false;
		await tick(); // Ensure the DOM is fully updated
		window.addEventListener('scroll', handleScroll);
		animateMainStagger();

		if (typeof window !== 'undefined') {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			// Animate "book" on mount
			gsap.fromTo(
				'.title-guest',
				{ opacity: 0, y: -10 },
				{
					opacity: 1,
					y: 0,
					duration: 1,
					ease: 'power4.out'
				}
			);

			// Animate "book" on mount
			gsap.fromTo(
				'.title-book',
				{ opacity: 0, x: -50 },
				{
					opacity: 1,
					x: 0,
					duration: 1,
					ease: 'power4.out'
				}
			);

			// Animate text on mount
			gsap.fromTo(
				'.text-3xl',
				{ opacity: 0, y: 50 },
				{
					opacity: 1,
					y: 0,
					duration: 1,
					ease: 'power4.out'
				}
			);

			// Apply lazy loading to posts
			document.querySelectorAll('.post-wrapper').forEach((el) => {
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

<div
	class={`${sidebar.state === 'expanded' ? 'lg:border' : 'md:border'} animate-item mx-auto mb-20 mt-5 w-full max-w-2xl rounded-lg`}
>
	<div
		class={`${hidden ? 'opacity-0' : ''} ${sidebar.state === 'expanded' ? 'lg:p-5' : 'md:p-5'} w-full max-w-lg`}
	>
		<h1 class="animate-item flex items-center text-6xl font-bold text-primary">
			<span class="title-guest">guest</span>
			<span class="title-book font-thin text-primary/50">book</span>
		</h1>
	</div>

	<div class="user-input my-2 mt-5 flex flex-col gap-5">
		<div class="form-control gap-0">
			<input type="hidden" name="author" value={data?.user?.id} />

			<div class={`${sidebar.state === 'expanded' ? 'lg:px-5' : 'md:px-5'} animate-item pb-10`}>
				<PostInputArea
					action={`/guestbook?/createPost`}
					userId={$currentUser.id}
					avatar={$currentUser?.avatar
						? getImageURL($currentUser?.collectionId, $currentUser?.id, $currentUser?.avatar)
						: `https://ui-avatars.com/api/?name=${$currentUser?.email}&background=random`}
					{isSubmitting}
					id="content"
					value={form?.data?.content ?? ''}
					errors={form?.errors?.content}
					disabled={loading}
					placeholder={'type your post here...'}
					toastSuccess={`Post created by @${$currentUser?.username}!`}
					toastError="Failed to submit post"
				/>
			</div>

			<div class="animate-item w-full">
				<div class="">
					<div
						class={`${sidebar.state === 'expanded' ? 'lg:px-5' : 'md:px-5'} flex items-center justify-between gap-2 pb-2`}
					>
						<div class="text-xl font-thin text-muted-foreground">
							posts: <span class="text-foreground">{sortedPosts.length}</span>
						</div>

						<div class="flex items-end justify-end gap-2">
							<Button
								size="sm"
								variant={sortOption === 'date' ? 'default' : 'ghost'}
								onclick={() => (sortOption = 'date')}
								class="text-xs transition-all duration-300"
							>
								new
								<Icon icon="mdi:fire" class="ml-1 h-4 w-4" />
							</Button>
							<Button
								size="sm"
								variant={sortOption === 'likes' ? 'default' : 'ghost'}
								onclick={() => (sortOption = 'likes')}
								class="text-xs transition-all duration-300"
							>
								likes
								<Icon icon="material-symbols:favorite-rounded" class="ml-1 h-4 w-4" />
							</Button>

							<Button
								size="sm"
								variant={sortOption === 'following' ? 'default' : 'ghost'}
								onclick={() => (sortOption = 'following')}
								class="text-xs transition-all duration-300"
							>
								feed
								<Icon icon="material-symbols:rss-feed" class="ml-1 h-4 w-4" />
							</Button>
						</div>
					</div>

					<div class="flex flex-col">
						{#if sortedPosts.length > 0}
							{#each sortedPosts as post}
								{#if post.mentioning.length === 0}
									<div
										class={`${sidebar.state === 'expanded' ? 'lg:px-5' : 'md:px-5'} post-wrapper border-t`}
									>
										<Post
											postAuthorId={post.author}
											comments={post.mentionedBy}
											id={post.id}
											postDate={post.created}
											postAuthor={post.username}
											avatar={post?.avatar
												? getImageURL($currentUser?.collectionId, post?.author, post?.avatar)
												: `https://ui-avatars.com/api/?name=${post?.username}&background=random`}
											postContent={post.content}
											likes={post.likes}
											currentUser={$currentUser}
											isVerified={post.verified || false}
										></Post>
									</div>
								{/if}
							{/each}
						{:else}
							<div class="alert">
								<div>No posts yet.</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

{#if showScrollToTop === true}
	<div class="flex justify-center">
		<ScrollToTopButton />
	</div>
{/if}
