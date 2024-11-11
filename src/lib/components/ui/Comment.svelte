<script lang="ts">
	import { getImageURL } from '$lib/utils';
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';

	interface Props {
		currentUser: any;
		userId: any;
		username: any;
		commentId: any;
		avatar: any;
		createdDate: any;
		comment: any;
	}

	let { currentUser, userId, username, commentId, avatar, createdDate, comment }: Props = $props();
	let dialogOpen = $state(false);
	let isDeleting = $state(false);
	let deleteLoading = false;
</script>

<div class="relative flex items-start gap-2 border-b py-5 pl-2">
	<img
		src={username
			? getImageURL(currentUser.collectionId, userId, avatar)
			: `https://ui-avatars.com/api/?name=${currentUser?.email}`}
		class="h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
		alt="user-avatar"
	/>

	<div class="-mt-1 flex flex-col">
		<div class="flex items-center gap-2">
			<div class="text-sm">
				{username}
			</div>
			<div class="text-xs text-foreground/70">
				{createdDate}
			</div>
		</div>
		<div class="mt-1 font-thin">{comment}</div>
	</div>

	{#if currentUser.username === username}
		<div class="absolute right-0 top-1 flex items-center gap-1">
			<Dialog.Root bind:open={dialogOpen}>
				<Dialog.Trigger>
					<div>
						<Button
							variant="ghost"
							size="sm"
							onclick={() => (dialogOpen = true)}
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
											toast('Comment deleted successfully.', {});
										} else {
											toast.error('Failed to delete comment.', {});
										}

										await update();
										isDeleting = false;
									};
								}}
								action="?/deletePostComment"
								method="POST"
							>
								<input type="hidden" name="commentId" value={commentId} />
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
										onclick={() => (dialogOpen = false)}
										class="w-full text-white">delete</Button
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
