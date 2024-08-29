<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	export let postAuthor;
	export let postContent;
	export let comments;
	export let postDate;
	export let avatar;
	export let likes;
	export let id;
	export let currentUser;
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';

	let loading = false;
	let isDeleting = false;
	let deleteLoading = false;
	let showComments = true;
	let dialogOpen = false;

	import { formatFriendlyDate, timeSince } from '$lib/utils';

	const handleCommentClick = () => {
		if (window.location.href.split('/').pop() === 'guestbook') {
			goto(`/guestbook/post/${id}`);
		} else {
			showComments = !showComments;
		}
	};
</script>

<div class="text-elipsis relative cursor-pointer overflow-x-hidden transition-all duration-300">
	<div class="card-body mt-2 px-1 transition-all duration-300 md:px-1">
		<div class="flex items-start gap-2">
			<div class="">
				<a href={`/guestbook/post/${id}`}>
					<div class="h-10 w-10 md:h-12 md:w-12">
						<img
							src={avatar}
							class="mt-1 h-full w-full rounded-full object-cover shadow"
							alt="user-avatar"
						/>
					</div>
				</a>
			</div>
			<div class="w-full">
				<div class="flex items-center gap-2">
					<div class="text-base lowercase text-primary">{postAuthor}</div>

					<div
						class={`text-xs ${timeSince(formatFriendlyDate(postDate)) === 'just now' ? 'text-primary' : 'text-foreground/70'}`}
					>
						{timeSince(formatFriendlyDate(postDate))}
					</div>
				</div>

				<a href={`/guestbook/post/${id}`}>
					<div class="pb-2 pr-5 pt-1 font-thin">{@html postContent}</div>
				</a>

				<div class="mt-2 flex items-center gap-5">
					<div class="flex items-center gap-1">
						<form
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									await update();
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
									icon={likes.includes(currentUser.id) ? 'ph:heart-fill' : 'ph:heart'}
									class={`h-5 w-5 ${likes.includes(currentUser.id) ? 'text-destructive' : ''} ${loading ? 'animate-likePost' : ''}`}
								/>
								<span class="sr-only">Like</span>
							</button>
						</form>
						<div class="font-thin">{likes.length ?? 0}</div>
					</div>

					<button class="font-thin" on:click={handleCommentClick}>
						<div class="flex items-center gap-1">
							<Icon icon="mdi:comment-outline" class="h-5 w-5" />
							<div>
								{comments.length}
							</div>
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
											on:click={() => (dialogOpen = true)}
											class="group/deleteButton flex scale-[0.75] items-center active:scale-[0.70] "
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
															toast('Post deleted successfully.', {});
														} else {
															toast.error('Failed to delete post.', {});
														}

														if (window.location.href.split('/').pop() !== 'guestbook') {
															goto('/guestbook');
														} else {
															await update();
														}

														isDeleting = false;
													};
												}}
												action="?/deletePost"
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
													<Button
														type="submit"
														variant="destructive"
														on:click={() => (dialogOpen = false)}
														class="w-full text-white">delete</Button
													>

													<Button
														variant="default"
														type="button"
														on:click={() => (dialogOpen = false)}
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

				{#if showComments}
					<div class="mt-3">
						<slot name="commentsFeed" />
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
