<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import * as Dialog from '$lib/components/ui/dialog';
	import { fade } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button/index.js';
	import { formatFriendlyDate, timeSince } from '$lib/utils';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js'; // Adjust the path as needed

	let sidebar = useSidebar(); // Initialize the sidebar

	interface Props {
		postAuthor: any;
		postAuthorId: any;
		postContent: any;
		comments: any;
		postDate: any;
		avatar: any;
		likes: any;
		id: any;
		currentUser: any;
		isVerified: boolean;
	}

	let {
		postAuthor,
		postAuthorId,
		postContent,
		comments,
		postDate,
		avatar,
		likes,
		id,
		currentUser,
		isVerified
	}: Props = $props();

	let isDeleting = $state(false);
	let deleteLoading = false;
	let dialogOpen = $state(false);

	let isLiked = $state(false);
	let optimisticLikes: number = $state(0);
	let hasOptimisticallyUpdated = $state(false); // Track if the user has clicked the like button
	let isLocked = $state(false); // Lock to prevent premature syncing

	// Remove the onMount block and use a reactive statement

	// Set initial likes count and liked state on mount
	$effect(() => {
		isLiked = likes.includes(currentUser.id);
		optimisticLikes = likes.length; // Set the actual number of likes on mount
	});

	// Sync with parent data only if not locked and no optimistic update
	$effect(() => {
		if (!hasOptimisticallyUpdated && !isLocked && likes.length !== optimisticLikes) {
			optimisticLikes = likes.length; // Sync with actual likes only if no optimistic update and not locked
		}
	});

	// Toggle liked state and update the number of likes optimistically
	const toggleLiked = () => {
		isLiked = !isLiked;
		if (isLiked) {
			optimisticLikes += 1;
		} else {
			optimisticLikes = Math.max(optimisticLikes - 1, 0); // Ensure optimisticLikes doesn't go below 0
		}
		hasOptimisticallyUpdated = true; // Mark as updated optimistically
		isLocked = true; // Lock to prevent syncing with parent during submission
	};
</script>

<div
	class={`${sidebar.state === 'expanded' ? '' : ''} text-elipsis relative cursor-pointer overflow-x-hidden transition-all duration-300`}
>
	<div class="card-body p-3 px-1 transition-all duration-300">
		<div class="flex items-start gap-3">
			<div>
				<a href={`/users/${postAuthorId}`}>
					<div class="h-10 w-10 md:h-12 md:w-12">
						<img
							src={avatar}
							class="mt-1 h-full w-full rounded-full object-cover"
							alt="user-avatar"
						/>
					</div>
				</a>
			</div>
			<div class="w-full">
				<div class="flex items-center gap-2">
					<a href={`/users/${postAuthorId}`} class="text-base lowercase text-primary"
						>{postAuthor}</a
					>

					{#if isVerified === true}
						<Icon icon="material-symbols:verified" class="h-4 w-4 text-info text-info" />
					{/if}
					<div class="text-xs text-foreground/70">
						{timeSince(formatFriendlyDate(postDate))}
					</div>
				</div>

				<a href={`/guestbook/post/${id}`}>
					<div class="pb-2 pr-5 pt-1 font-thin">{@html postContent}</div>
				</a>

				<div class=" flex items-center gap-5">
					<div class="flex items-center gap-1">
						<form
							use:enhance={() => {
								// Optimistically update the like count and liked state on click
								toggleLiked();

								// Return the function for form submission
								return async ({ result, update }) => {
									// Wait for the DOM and state to settle
									await update();

									if (result.type === 'failure') {
										// Roll back the optimistic update if the server response fails
										toast.error('Failed to like the post.');
										toggleLiked(); // Roll back optimistic update
										hasOptimisticallyUpdated = false;
										isLocked = false; // Unlock after failure
									} else {
										// Wait for the DOM and reactivity system to fully update
										await tick();

										// Success: check if likes.length matches optimisticLikes
										if (likes.length !== optimisticLikes) {
											// Rollback if they don't match
											optimisticLikes = likes.length;
											toast.error('Server count mismatch, rolling back.');
										} else {
											toast.success(`${isLiked ? 'Liked' : 'Unliked'} post by @${postAuthor}`);
										}

										// Reset flags after handling the server response
										hasOptimisticallyUpdated = false; // Reset the optimistic update state
										isLocked = false; // Unlock after success
									}
								};
							}}
							action={`/guestbook?/likePost`}
							method="POST"
						>
							<input type="hidden" name="postId" value={id} />
							<input type="hidden" name="currentUserId" value={currentUser.id} />

							<button type="submit" class="flex items-center">
								<Icon
									icon={isLiked
										? 'material-symbols:favorite-rounded'
										: 'material-symbols:favorite-outline-rounded'}
									class={`h-5 w-5 ${isLiked ? 'text-destructive' : ''}`}
								/>
								<span class="sr-only">Like</span>
							</button>
						</form>

						<!-- Display the actual likes count initially, then update optimistically -->
						<div class="font-thin">{optimisticLikes ?? 0}</div>
					</div>

					<button class="font-thin" onclick={() => goto(`/guestbook/post/${id}`)}>
						<div class="flex items-center gap-1">
							<Icon icon="mdi:comment-outline" class="h-5 w-5" />
							<div>{comments.length}</div>
						</div>
					</button>

					{#if typeof window !== 'undefined'}
						<a
							href={`mailto:?subject=check this out&body=${encodeURIComponent(window.location.href)}`}
						>
							<Icon icon="tabler:send" class="text-base-content h-5 w-5" />
						</a>
					{/if}

					{#if currentUser.username === postAuthor}
						<div class="absolute right-0 top-1 flex items-center gap-1">
							<Dialog.Root bind:open={dialogOpen}>
								<Dialog.Trigger>
									<div>
										<Button
											variant="ghost"
											size="sm"
											onclick={() => (dialogOpen = true)}
											class="group/deleteButton flex scale-[0.75] items-center active:scale-[0.70]"
										>
											<Icon
												icon={'mdi:close'}
												class={`h-5 w-5 transition-all duration-200 group-hover/deleteButton:scale-110 ${deleteLoading ? 'animate-deletePost' : ''}`}
											/>
											<span class="sr-only">Delete</span>
										</Button>
									</div>
								</Dialog.Trigger>
								<Dialog.Content>
									<Dialog.Header>
										<Dialog.Title>Are you sure?</Dialog.Title>
										<Dialog.Description>
											Are you sure you want to delete this post? This action cannot be undone.
											<form
												use:enhance={({ cancel }) => {
													if (isDeleting) return cancel(); // Prevent multiple submissions
													isDeleting = true;

													return async ({ result, update }) => {
														if (result.type === 'success') {
															dialogOpen = false;
															toast('Post deleted successfully.', {});
														} else {
															toast.error('Failed to delete post.', {});
														}

														if (window.location.href.split('/').pop() === `${id}`) {
															goto('/guestbook');
														} else {
															await update();
														}

														isDeleting = false;
													};
												}}
												action={`/guestbook?/deletePost`}
												method="POST"
											>
												<input type="hidden" name="postId" value={id} />
												<input
													type="hidden"
													name="currentUserId"
													value={currentUser.id}
													disabled={deleteLoading}
												/>

												<div class="mt-5 flex items-center justify-between gap-2">
													<Button type="submit" variant="destructive" class="w-full text-white"
														>delete</Button
													>

													<Button
														variant="default"
														type="button"
														onclick={() => (dialogOpen = false)}
														class="w-full">cancel</Button
													>
												</div>
											</form>
										</Dialog.Description>
									</Dialog.Header>
								</Dialog.Content>
							</Dialog.Root>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
