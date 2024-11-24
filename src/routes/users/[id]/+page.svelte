<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import { enhance } from '$app/forms';
	import { getImageURL } from '$lib/utils.js';
	import { onMount, tick } from 'svelte';
	import { currentUser } from '$lib/stores/user';
	import { animateMainStagger } from '$lib/animations';
	import ScrollIndicator from '$lib/components/ui/ScrollIndicator.svelte';
	import { formatFriendlyDate, timeSince } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import Post from '$lib/components/ui/Post.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import Drawer from '$lib/components/ui/Drawer.svelte';

	export let data: any;

	let isFollowing = false;
	let optimisticFollowers = data.userFollowers.length; // Set initial follower count
	let hasOptimisticallyUpdated = false; // To track if optimistic update happened
	let isLocked = false; // To prevent updates while submitting

	// Update `isFollowing` reactively based on whether the current user is in the followers list
	$: isFollowing = data.userFollowers.map((follower: any) => follower.id).includes($currentUser.id);

	// Sync with parent data only if not locked and no optimistic update
	$: if (
		!hasOptimisticallyUpdated &&
		!isLocked &&
		data.userFollowers.length !== optimisticFollowers
	) {
		optimisticFollowers = data.userFollowers.length; // Sync with actual follower count if not locked
	}

	const toggleFollowing = () => {
		isFollowing = !isFollowing;
		if (isFollowing) {
			optimisticFollowers += 1;
		} else {
			optimisticFollowers = Math.max(optimisticFollowers - 1, 0); // Ensure followers don't go below 0
		}
		hasOptimisticallyUpdated = true; // Mark optimistic update
		isLocked = true; // Lock to prevent syncing during submission
	};

	const handleScroll = () => {
		const shouldShow = window.scrollY > 100;
		if (shouldShow !== showScrollToTop) {
			showScrollToTop = shouldShow;
		}
	};

	let showScrollToTop = false;
	let hidden = true;

	onMount(() => {
		hidden = false;
		window.addEventListener('scroll', handleScroll);
		animateMainStagger();
	});
</script>

<ScrollIndicator />

<div class={` ${hidden ? 'opacity-0' : ''} mx-auto max-w-2xl`}>
	<div class="flex justify-between">
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

		{#if data.userProfile.id === $currentUser.id}
			<a href="/my/settings/profile">
				<Button
					size="sm"
					variant="outline"
					class="group/backButton backButton animate-item flex items-center gap-2"
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
				<div class="flex items-center gap-1">
					<div class="truncate text-2xl">{data.userProfile.username}</div>

					{#if data.userProfile.verified === true}
						<Icon icon="material-symbols:verified" class="h-5 w-5 text-info text-info" />
					{/if}
				</div>

				<div class="font-thin text-foreground/70">{data.userProfile.job_title}</div>
				<div class="mt-2 truncate text-xs">
					joined: {timeSince(formatFriendlyDate(data.userProfile.created))}
				</div>
				{#if data.userProfile.website}
					<div class="mt-2">
						<a
							href={data.userProfile.website}
							class="text-sm font-thin text-foreground hover:underline"
							>{data.userProfile.website}</a
						>
					</div>
				{/if}

				<!-- Display the optimistic follower count -->
				<div class="mt-5 flex items-center gap-5 text-sm font-thin text-foreground/70">
					<Drawer>
						{#snippet title()}
							followers
						{/snippet}

						{#snippet description()}
							{`${data.userProfile.username} has ${data.userFollowers.length} ${data.userFollowers.length === 1 ? 'follower' : 'followers'}`}
						{/snippet}

						{#snippet trigger()}
							<div>
								{optimisticFollowers}
								{optimisticFollowers === 1 ? ' follower' : ' followers'}
							</div>
						{/snippet}

						{#snippet content()}
							<div class="flex h-full max-h-96 flex-col gap-2 overflow-scroll p-5">
								{#each data.userFollowers as follower}
									<a href={`/users/${follower.id}`} class="flex items-center gap-2">
										<img
											src={follower.avatar
												? getImageURL(follower.collectionId, follower.id, follower.avatar)
												: `https://ui-avatars.com/api/?name=${follower.username}&background=random`}
											alt={follower.username}
											class="h-10 w-10 rounded-full object-cover"
										/>
										<div class="text-sm font-thin">{follower.username}</div>
									</a>
								{/each}
							</div>
						{/snippet}
					</Drawer>

					<Drawer>
						{#snippet title()}
							following
						{/snippet}

						{#snippet description()}
							{`${data.userProfile.username} is following ${data.userProfile.following.length} ${data.userProfile.following.length === 1 ? 'user' : 'users'}`}
						{/snippet}

						{#snippet trigger()}
							<div>
								{data.userProfile.following.length} following
							</div>
						{/snippet}

						{#snippet content()}
							<div class="flex h-full max-h-96 flex-col gap-2 overflow-scroll p-5">
								{#each data.users as following}
									{#if data.userProfile.following.includes(following.id)}
										<a href={`/users/${following.id}`} class="flex items-center gap-2">
											<img
												src={following.avatar
													? getImageURL(following.collectionId, following.id, following.avatar)
													: `https://ui-avatars.com/api/?name=${following.username}&background=random`}
												alt={following.username}
												class="h-10 w-10 rounded-full object-cover"
											/>
											<div class="text-sm font-thin lowercase">{following.username}</div>
										</a>
									{/if}
								{/each}
							</div>
						{/snippet}
					</Drawer>
				</div>
			</div>
		</div>

		{#if data.userProfile.id !== $currentUser.id}
			<div class="mt-10 flex items-center gap-2">
				<form
					action="?/followUser"
					method="POST"
					class="w-full"
					use:enhance={() => {
						toggleFollowing();
						tick();

						return async ({ result, update }) => {
							await update();
							if (result.type === 'failure') {
								// Roll back optimistic update if server response fails
								toast.error('Failed to update follow status.');
								toggleFollowing();
								hasOptimisticallyUpdated = false;
								isLocked = false;
							} else {
								// Success: verify follower count matches
								if (data.userFollowers.length !== optimisticFollowers) {
									optimisticFollowers = data.userFollowers.length;
									toast.error('Server count mismatch, rolling back.');
								} else {
									toast.success(
										`${isFollowing ? 'Followed' : 'Unfollowed'} @${data.userProfile.username}`
									);
								}
								hasOptimisticallyUpdated = false;
								isLocked = false;
							}
						};
					}}
				>
					<input type="hidden" name="userId" value={data.userProfile.id} />
					<input type="hidden" name="currentUserId" value={$currentUser.id} />
					{#if isFollowing}
						<Button type="submit" class="animate-item w-full" variant="destructive" size="sm">
							<div class="flex gap-2">
								<div>Unfollow</div>
								<Icon icon="mdi:minus" class="h-5 w-5" />
							</div>
						</Button>
					{:else}
						<Button type="submit" class="animate-item w-full" variant="success" size="sm">
							<div class="flex gap-2">
								<div>Follow</div>
								<Icon icon="mdi:plus" class="h-5 w-5" />
							</div>
						</Button>
					{/if}
				</form>

				<Button href="/guestbook" class="animate-item w-full" variant="outline" size="sm">
					<div class="flex gap-2">
						<div>Mention</div>
						<Icon icon="mdi:plus" class="h-5 w-5" />
					</div>
				</Button>
			</div>
		{/if}

		{#if data.userPosts.length > 0}
			<div class="animate-item mb-2 mt-10 text-xl font-thin text-muted-foreground">
				{data.userProfile.username} has <span class="text-foreground">{data.userPosts.length}</span>
				posts:
			</div>

			<div class="grid grid-cols-1">
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
							isVerified={post.verified}
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
