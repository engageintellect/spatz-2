<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';

	export let postAuthor;
	export let postContent;
	export let comments;
	export let postDate;
	export let avatar;
	export let likes; // actual likes array from parent
	export let id;
	export let currentUser;

	let isLiked = false;
	let optimisticLikes: number;
	let hasOptimisticallyUpdated = false; // Track if the user has clicked the like button
	let isLocked = false; // Lock to prevent premature syncing

	// Set initial likes count and liked state on mount
	onMount(() => {
		isLiked = likes.includes(currentUser.id);
		optimisticLikes = likes.length; // Set the actual number of likes on mount
	});

	// Sync with parent data only if not locked and no optimistic update
	$: if (!hasOptimisticallyUpdated && !isLocked && likes.length !== optimisticLikes) {
		optimisticLikes = likes.length; // Sync with actual likes only if no optimistic update and not locked
	}

	// Toggle liked state and update the number of likes optimistically
	const toggleLiked = () => {
		isLiked = !isLiked;
		optimisticLikes = isLiked ? optimisticLikes + 1 : optimisticLikes - 1;
		hasOptimisticallyUpdated = true; // Mark as updated optimistically
		isLocked = true; // Lock to prevent syncing with parent during submission
	};
</script>

<div class="text-elipsis relative cursor-pointer overflow-x-hidden transition-all duration-300">
	<div class="card-body p-3 px-1 transition-all duration-300">
		<div class="flex items-start gap-2">
			<div>
				<a href={`/guestbook/post/${id}`}>
					<div class="h-10 w-10 md:h-12 md:w-12">
						<img
							src={avatar}
							class="mt-1 h-full w-full rounded-full border object-cover shadow"
							alt="user-avatar"
						/>
					</div>
				</a>
			</div>
			<div class="w-full">
				<div class="flex items-center gap-2">
					<div class="text-base lowercase text-primary">{postAuthor}</div>
					<div class="text-xs text-foreground/70">
						{new Date(postDate).toLocaleString()}
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
											toast.success(`${isLiked ? 'Liked' : 'Unliked'} post by ${postAuthor}`);
										}

										// Reset flags after handling the server response
										hasOptimisticallyUpdated = false; // Reset the optimistic update state
										isLocked = false; // Unlock after success
									}
								};
							}}
							action="?/likePost"
							method="POST"
						>
							<input type="hidden" name="postId" value={id} />
							<input type="hidden" name="currentUserId" value={currentUser.id} />
							<button type="submit" class="flex items-center">
								<Icon
									icon={isLiked ? 'ph:heart-fill' : 'ph:heart'}
									class={`h-5 w-5 ${isLiked ? 'text-destructive' : ''}`}
								/>
								<span class="sr-only">Like</span>
							</button>
						</form>

						<!-- Display the actual likes count initially, then update optimistically -->
						<div class="font-thin">{optimisticLikes}</div>
					</div>

					<button class="font-thin" on:click={() => goto(`/guestbook/post/${id}`)}>
						<div class="flex items-center gap-1">
							<Icon icon="mdi:comment-outline" class="h-5 w-5" />
							<div>{comments.length}</div>
						</div>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
