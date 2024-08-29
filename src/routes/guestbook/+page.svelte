<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { page } from '$app/stores';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import { enhance, applyAction } from '$app/forms';
	import { currentUser } from '$lib/stores/user.js';
	import { getImageURL } from '$lib/utils';
	import Post from '$lib/components/ui/Post.svelte';
	import PostInputArea from '$lib/components/ui/PostInputArea.svelte';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { gsap } from 'gsap';
	import { toast } from 'svelte-sonner';
	import { lazyLoad } from '$lib/lazyLoad';

	let isSubmitting = false;

	export let data: {
		user: App.User;
		posts: App.Post[];
		comments: App.Comment[];
	};

	export let form: {
		data: {
			content?: string;
			post?: string;
		};
		errors: {
			content?: string[];
		};
	};

	let loading = false;

	$: currentUser.set(data.user);

	let showScrollToTop = false;

	let sortOption = 'date'; // Default sort option

	function sortByDate(posts: App.Post[]) {
		return posts.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
	}

	function sortByLikes(posts: App.Post[]) {
		return posts.sort((a, b) => b.likes.length - a.likes.length); // Sort by the length of likes array
	}

	function sortByCurrentUser(posts: App.Post[]) {
		return posts.filter((post) => post.author === $currentUser.id);
	}

	$: sortedPosts = (() => {
		let posts = [...data.posts];
		switch (sortOption) {
			case 'likes':
				return sortByLikes(posts);
			case 'user':
				return sortByCurrentUser(posts);

			case 'date':
			default:
				return sortByDate(posts);
		}
	})();

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
		await tick(); // Ensure the DOM is fully updated
		window.addEventListener('scroll', handleScroll);

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

<div class="">
	<div class="mx-auto w-full max-w-lg transition-all duration-300">
		<div class="">
			<h1 class="flex items-center text-7xl font-bold text-primary">
				<span class="title-guest">guest</span>
				<span class="title-book font-thin text-primary/50">book</span>
			</h1>
		</div>

		<div class="user-input my-2 mt-5 flex flex-col gap-5">
			<form
				action="?/createPost"
				method="POST"
				class="w-full"
				use:enhance={({ cancel }) => {
					if (isSubmitting) return cancel(); // Prevent multiple submissions
					isSubmitting = true;

					return async ({ result, update }) => {
						if (result.type === 'success') {
							toast('Post submission success!', {});
							await update();
							await tick();
							const newPost = document.querySelector('.post-wrapper:first-child');
							if (newPost) {
								gsap.fromTo(
									newPost,
									{ opacity: 0, y: 0, scale: 0.95 },
									{
										opacity: 1,
										y: 0,
										scale: 1,
										duration: 2,
										ease: 'power4.out'
									}
								);
							}
						} else {
							// Apply form errors to the state
							applyAction(result);
							toast.error('Failed to submit Post', {});
						}

						await update(); // Ensure form state (including errors) is updated
						isSubmitting = false;
					};
				}}
			>
				<div class="form-control gap-0">
					<input type="hidden" name="author" value={data?.user?.id} />
					<PostInputArea
						avatar={$currentUser?.avatar
							? getImageURL($currentUser?.collectionId, $currentUser?.id, $currentUser?.avatar)
							: `https://ui-avatars.com/api/?name=${$currentUser?.email}`}
						{isSubmitting}
						id="content"
						value={form?.data?.content ?? ''}
						errors={form?.errors?.content}
						disabled={loading}
						placeholder={'type your post here...'}
					/>
				</div>
			</form>

			<div class="w-full">
				<div class="">
					<div class="flex items-end justify-between gap-5 border-b">
						<div class="mb-2 text-xl font-thin">posts: {data.posts.length}</div>

						<div class="my-4 flex items-end justify-end gap-2">
							<Button
								size="sm"
								variant={sortOption === 'date' ? 'default' : 'outline'}
								on:click={() => (sortOption = 'date')}
							>
								New
								<Icon icon="mdi:fire" class="ml-1 h-4 w-4" />
							</Button>
							<Button
								size="sm"
								variant={sortOption === 'likes' ? 'default' : 'outline'}
								on:click={() => (sortOption = 'likes')}
							>
								Likes
								<Icon icon="mdi:heart" class="ml-1 h-4 w-4" />
							</Button>
						</div>
					</div>

					<div class="flex flex-col">
						{#if sortedPosts.length > 0}
							{#each sortedPosts as post}
								<div class="post-wrapper invisible border-b">
									<Post
										comments={post.comments}
										id={post.id}
										postDate={post.created}
										postAuthor={post.username}
										avatar={post?.avatar
											? getImageURL($currentUser?.collectionId, post?.author, post?.avatar)
											: `https://ui-avatars.com/api/?name=${post?.username}`}
										postContent={post.content}
										likes={post.likes}
										currentUser={$currentUser}
									></Post>
								</div>
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

	{#if showScrollToTop === true}
		<div class="flex justify-center">
			<ScrollToTopButton />
		</div>
	{/if}
</div>
