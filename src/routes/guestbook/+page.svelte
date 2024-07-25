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

					ScrollTrigger.batch('.post-wrapper.hidden', {
						onEnter: (batch) => {
							batch.forEach((el) => el.classList.remove('hidden'));
							gsap.fromTo(
								batch,
								{ opacity: 0, y: 50 },
								{
									opacity: 1,
									y: 0,
									duration: 1,
									stagger: 0.2,
									ease: 'power4.out'
								}
							);
						}
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

<div class="px-2">
	<div class="mx-auto w-full max-w-lg transition-all duration-300">
		<div class="">
			<h1 class="text-7xl font-bold text-primary">
				guest<span class="guestbook-book font-thin text-primary/50">book</span>
			</h1>
		</div>

		<div class="my-2 mt-5 flex flex-col gap-5">
			<form action="?/createPost" method="POST" class="w-full" use:enhance>
				<div class="form-control gap-0">
					<!-- <div>sign the guestbook</div> -->
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
								<div class="post-wrapper hidden">
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
		<div class="flex justify-center bg-red-400">
			<ScrollToTopButton />
		</div>
	{/if}
</div>

<style>
	.hidden {
		display: none;
	}
</style>
