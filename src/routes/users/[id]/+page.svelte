<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';

	import { getImageURL } from '$lib/utils.js';
	import { onMount } from 'svelte';

	export let data: any;
	import Post from '$lib/components/ui/Post.svelte';
	import { currentUser } from '$lib/stores/user';
	import { animateMainStagger } from '$lib/animations';
	import ScrollIndicator from '$lib/components/ui/ScrollIndicator.svelte';

	import { formatFriendlyDate, timeSince } from '$lib/utils';
	function goBack() {
		window.history.back();
	}

	let showScrollToTop = false;

	$: currentUser.set(data.user);

	let loading = false;
	let hidden = true;

	onMount(() => {
		hidden = false;
		window.addEventListener('scroll', handleScroll);
		animateMainStagger();
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
</script>

<ScrollIndicator />

<div class={` ${hidden ? 'opacity-0' : ''} mx-auto max-w-2xl`}>
	<div class="flex justify-between">
		<Button
			on:click={goBack}
			size="sm"
			variant="outline"
			type="submit"
			class="group/backButton backButton animate-item flex items-center gap-2"
			disabled={loading}
		>
			<Icon
				icon="mdi:arrow-left"
				class="h-5 w-5 transition-all duration-300 md:group-hover/backButton:-translate-x-1"
			/>
			<span class="text-sm">back</span>
		</Button>

		{#if data.userProfile.id === $currentUser.id}
			<a href="/my/settings/profile">
				<Button
					size="sm"
					variant="outline"
					class="group/backButton backButton animate-item flex items-center gap-2"
					disabled={loading}
				>
					<span class="text-sm">edit profile</span>
					<Icon
						icon="material-symbols:edit"
						class="h-5 w-5 transition-all duration-300 md:group-hover/backButton:-translate-x-1"
					/>
				</Button>
			</a>
		{/if}
	</div>
	<main class="mx-auto mt-10 max-w-lg rounded-lg">
		<div class="animate-item flex h-full items-start justify-start gap-2 md:gap-5">
			<div class="h-20 w-20 md:h-24 md:w-24">
				<img
					class="h-full w-full rounded-full border object-cover shadow"
					alt={data.userProfile.username}
					src={data.userProfile?.avatar
						? getImageURL(
								data.userProfile?.collectionId,
								data.userProfile?.id,
								data.userProfile?.avatar
							)
						: `https://ui-avatars.com/api/?name=${data.userProfile?.username}&background=random`}
				/>
			</div>

			<div class="flex flex-col">
				<div class="truncate text-2xl">
					{data.userProfile.username}
				</div>

				<div class="font-thin text-foreground/70">
					{data.userProfile.job_title}
				</div>

				<div class="mt-2 truncate text-xs">
					joined: {timeSince(formatFriendlyDate(data.userProfile.created))}
				</div>

				{#if data.userProfile.website}
					<div class="mt-2">
						<a
							href={data.userProfile.website}
							class=" text-sm font-thin text-foreground hover:underline"
						>
							{data.userProfile.website}
						</a>
					</div>
				{/if}
			</div>
		</div>

		{#if data.userPosts.length > 0}
			<div class="animate-item mb-2 mt-10 text-xl font-thin md:mt-20">
				{data.userProfile.username} has {data.userPosts.length} posts:
			</div>

			<div class="grid grid-cols-1 gap-2">
				{#each data.userPosts as post}
					<div class="animate-item border-t">
						<Post
							postAuthorId={post.author}
							postAuthor={post.username}
							postContent={post.content}
							comments={post.mentionedBy}
							postDate={post.created}
							avatar={data.userProfile.avatar
								? getImageURL(
										data.userProfile.collectionId,
										data.userProfile.id,
										data.userProfile.avatar
									)
								: `https://ui-avatars.com/api/?name=${post.username}&background=random`}
							likes={post.likes}
							id={post.id}
							currentUser={$currentUser}
						/>
					</div>
				{/each}
			</div>
		{:else}
			<div class="animate-item mt-10 border-b pb-2 text-xl font-thin md:mt-20">
				{data.userProfile.username} has no posts.
			</div>

			{#if data.userProfile.id === $currentUser.id}
				<Button href="/guestbook" class="animate-item mt-5" variant="default" size="sm">
					<div class="item-center flex gap-2">
						<div>create post</div>

						<Icon icon="mdi:plus" class="h-5 w-5" />
					</div>
				</Button>
			{/if}
		{/if}
	</main>

	{#if showScrollToTop === true}
		<div class="flex justify-center">
			<ScrollToTopButton />
		</div>
	{/if}
</div>
