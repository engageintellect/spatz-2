<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { timeSince, formatFriendlyDate } from '$lib/utils';

	export let postAuthor;
	export let postContent;
	export let comments;
	export let postDate;
	export let avatar;
	export let likes;
	export let id;
	export let currentUser;

	let loading = false;
	let isLiked: boolean;
	let optimisticLikes = likes.length;

	onMount(() => {
		isLiked = likes.includes(currentUser.id);
	});

	const toggleLiked = () => {
		isLiked = !isLiked;
		if (isLiked) {
			optimisticLikes += 1;
		} else {
			optimisticLikes -= 1;
		}
	};

	const handleCommentClick = () => {
		goto(`/guestbook/post/${id}`);
	};
</script>

<div class="text-elipsis relative cursor-pointer overflow-x-hidden transition-all duration-300">
	<div class="card-body mt-2 px-1 transition-all duration-300 md:px-1">
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
						{timeSince(formatFriendlyDate(postDate))}
					</div>
				</div>

				<a href={`/guestbook/post/${id}`}>
					<div class="pb-2 pr-5 pt-1 font-thin">{@html postContent}</div>
				</a>

				<div class="mb-4 mt-2 flex items-center gap-5">
					<div class="flex items-center gap-1">
						<form
							use:enhance={() => {
								loading = true;
								toggleLiked();

								return async ({ result }) => {
									if (result.type === 'failure') {
										toggleLiked();
									} else {
									}
									loading = false;
								};
							}}
							action="?/likePost"
							method="POST"
						>
							<input type="hidden" name="postId" value={id} />
							<input type="hidden" name="currentUserId" value={currentUser.id} disabled={loading} />
							<button type="submit" class="flex items-center">
								<Icon
									icon={isLiked ? 'ph:heart-fill' : 'ph:heart'}
									class={`h-5 w-5 ${isLiked ? 'text-destructive' : ''} ${loading ? 'animate-likePost' : ''}`}
								/>
								<span class="sr-only">Like</span>
							</button>
						</form>
						<div class="font-thin">{optimisticLikes ?? 0}</div>
					</div>

					<button class="font-thin" on:click={handleCommentClick}>
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
				</div>
			</div>
		</div>
	</div>
</div>
