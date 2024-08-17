<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	export let postAuthor;
	export let postContent;
	export let postDate;
	export let avatar;
	export let likes;
	export let id;
	export let currentUser;
	import { Button } from '$lib/components/ui/button/index.js';

	let loading = false;
	let deleteLoading = false;

	import { formatFriendlyDate, timeSince } from '$lib/utils';
</script>

<div class="cursor-pointer border-b transition-all duration-300">
	<div class="card-body p-3 transition-all duration-300">
		<div class="flex items-start gap-3">
			<div class="">
				<div class="h-12 w-12">
					<img
						src={avatar}
						class="h-full w-full rounded-full object-cover shadow"
						alt="user-avatar"
					/>
				</div>
			</div>
			<div class="w-full">
				<div class="flex items-center gap-2">
					<div class="text-base lowercase text-primary hover:underline">{postAuthor}</div>

					<div
						class={`text-xs ${timeSince(formatFriendlyDate(postDate)) === 'just now' ? 'text-primary' : 'text-foreground/70'}`}
					>
						{timeSince(formatFriendlyDate(postDate))}
					</div>
				</div>

				<div class="pb-2 pt-1 font-thin">{@html postContent}</div>

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
									class={`h-5 w-5 text-destructive ${loading ? 'animate-likePost' : ''}`}
								/>
								<span class="sr-only">Like</span>
							</button>
						</form>
						<div class="font-thin">{likes.length ?? 0}</div>
					</div>
					{#if typeof window !== 'undefined'}
						<a
							href={`mailto:?subject=check this out&body=${encodeURIComponent(window.location.href)}`}
						>
							<Icon icon="tabler:send" class="text-base-content h-5 w-5" />
						</a>
					{/if}

					{#if currentUser.username === postAuthor}
						<div class="absolute right-2 top-2 flex items-center gap-1">
							<form
								use:enhance={() => {
									deleteLoading = true;
									return async ({ update }) => {
										await update();
										deleteLoading = false;
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
								<Button variant="ghost" type="submit" class="group/deleteButton flex items-center">
									<Icon
										icon={'mdi:close'}
										class={`h-5 w-5 transition-all duration-200 group-hover/deleteButton:scale-110 ${deleteLoading ? 'animate-bounce' : ''}`}
									/>
									<span class="sr-only">Delete</span>
								</Button>
							</form>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
