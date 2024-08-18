<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { page } from '$app/stores';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import { enhance } from '$app/forms';
	import { currentUser } from '$lib/stores/user.js';
	import { getImageURL } from '$lib/utils';
	import Post from '$lib/components/ui/Post.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { gsap } from 'gsap'; // Ensure GSAP is directly imported

	export let form: {
		data: {
			content?: string;
		};
		errors: {
			content?: string[];
		};
	};

	export let data: {
		user: App.User;
		posts: App.Post[];
	};

	let loading = false;

	$: currentUser.set(data.user);

	let showScrollToTop = false;

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

	function lazyLoad(target: HTMLElement) {
		const observer = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
						entry.target.classList.remove('invisible');
						gsap.fromTo(
							entry.target,
							{ opacity: 0, y: 50 },
							{
								opacity: 1,
								y: 0,
								duration: 1,
								ease: 'power4.out',
								stagger: 0.1 // Adding stagger here
							}
						);
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.1
			}
		);
		observer.observe(target);
	}

	onMount(() => {
		tick();
		window.addEventListener('scroll', handleScroll);

		if (typeof window !== 'undefined') {
			import('gsap').then(({ gsap }) => {
				import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
					gsap.registerPlugin(ScrollTrigger);

					// Animate "book" on mount
					gsap.fromTo(
						'.guestbook-book',
						{ opacity: 0, x: -50 },
						{
							opacity: 1,
							x: 0,
							duration: 3,
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
				});
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
			<h1 class="text-7xl font-bold text-primary">
				guest<span class="guestbook-book font-thin text-primary/50">book</span>
			</h1>
		</div>

		<div class="my-2 mt-5 flex flex-col gap-5">
			<form action="?/createPost" method="POST" class="w-full" use:enhance>
				<div class="form-control gap-0">
					<input type="hidden" name="author" value={data?.user?.id} />
					<TextArea
						id="content"
						value={form?.data?.content ?? ''}
						errors={form?.errors?.content}
						disabled={loading}
						placeholder={'type your post here...'}
					/>

					<Button type="submit" class="group/submitButton">
						{#if loading}
							<span class="loading loading-spinner loading-md"></span>
						{:else}
							submit <Icon
								icon="mdi-send"
								class="ml-2 h-5 w-5 transition-all duration-300 md:group-hover/submitButton:translate-x-1"
							/>
						{/if}
					</Button>
				</div>
			</form>

			<div class="w-full">
				<div class="">
					<div class="mb-2 text-3xl font-thin">posts</div>
					<div class="flex flex-col">
						{#if data.posts.length > 0}
							{#each data.posts as post}
								<div class="post-wrapper invisible">
									<Post
										id={post.id}
										postDate={post.created}
										postAuthor={post.username}
										avatar={post?.avatar
											? getImageURL($currentUser?.collectionId, post?.author, post?.avatar)
											: `https://ui-avatars.com/api/?name=${post?.username}`}
										postContent={post.content}
										likes={post.likes}
										currentUser={$currentUser}
									/>
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

<style>
	.invisible {
		opacity: 0;
		height: auto;
	}

	.visible {
		opacity: 1;
	}
</style>
