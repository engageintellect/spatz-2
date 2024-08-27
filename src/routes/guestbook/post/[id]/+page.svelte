<script lang="ts">
	import { getImageURL } from '$lib/utils';
	import { onMount } from 'svelte';
	import Post from '$lib/components/ui/Post.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { currentUser } from '$lib/stores/user';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { timeSince, formatFriendlyDate } from '$lib/utils';
	import { enhance, applyAction } from '$app/forms';
	import { tick } from 'svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import { gsap } from 'gsap';
	export let data: {
		user: App.User;
		posts: App.Post[];
		post: App.Post;
		comments: App.Comment[];
	};

	$: currentUser.set(data.user);

	let loading = false;
	let isSubmitting = false;
	let isDeleting = false;
	let deleteLoading = false;

	let showCommentsForm = false;

	function goBack() {
		window.history.back();
	}

	export let form: {
		data: {
			content?: string;
			post?: string;
		};
		errors: {
			content?: string[];
		};
	};

	onMount(() => {
		gsap.from('.post-hero', {
			opacity: 0,
			y: 0,
			scale: 0.95,
			stagger: 0.1,
			duration: 1,
			ease: 'power4.out'
		});

		gsap.from('.comment-feed', {
			opacity: 0,
			y: 50,
			stagger: 0.1,
			duration: 1,
			ease: 'power4.out'
		});
	});
</script>

<div class="mx-auto max-w-lg">
	<Button
		on:click={goBack}
		size="sm"
		variant="ghost"
		type="submit"
		class="flex items-center gap-1"
		disabled={loading}
	>
		<Icon icon="mdi:arrow-left" class="h-5 w-5" />
		<span class="text-xs">back</span>
	</Button>

	<div class="post-hero mt-5">
		<Post
			postAuthor={data.post.expand.author.username}
			postContent={data.post.content}
			comments={data.post.comments}
			postDate={data.post.created}
			avatar={data.post.expand.author.avatar
				? getImageURL($currentUser?.collectionId, data.post.author, data.post.expand.author.avatar)
				: `https://ui-avatars.com/api/?name=${data.post.expand.author.username}`}
			likes={data.post.likes}
			id={data.post.id}
			currentUser={$currentUser}
		></Post>
	</div>
</div>

<div class="comment-feed mx-auto mt-5 max-w-lg">
	<div class="flex w-full justify-between border-b pb-2">
		<div class="flex items-center gap-1">
			<span class="text-xl font-thin">comments: {data.post.comments.length}</span>
		</div>

		<Button variant="ghost" size="sm" on:click={() => (showCommentsForm = !showCommentsForm)}>
			{#if showCommentsForm}
				<Icon icon="mdi:close" class="h-5 w-5" />
			{:else}
				<div class="flex items-center gap-1">
					<span>reply</span>
					<Icon icon="mdi:plus" class="h-5 w-5" />
				</div>
			{/if}
		</Button>
	</div>

	{#if showCommentsForm || data.post.comments.length === 0}
		<div>
			<form
				action="?/createPostComment"
				method="POST"
				class="mb-10 w-full"
				use:enhance={({ cancel }) => {
					if (isSubmitting) return cancel(); // Prevent multiple submissions
					isSubmitting = true;

					return async ({ result, update }) => {
						if (result.type === 'success') {
							toast('Comment submission success!', {});
							await update();
							await tick();

							// Find the newly added post (assuming it's added at the top)
							const newPost = document.querySelector('.post-wrapper:first-child');
							if (newPost) {
								// Apply a fade-in and scale-in animation to the new post
								gsap.fromTo(
									newPost,
									{ opacity: 0, y: 0, scale: 0.95 },
									{
										opacity: 1,
										y: 0,
										scale: 1,
										duration: 2,
										ease: 'power4.out'
									}
								);
							}
						} else {
							// Apply form errors to the state
							applyAction(result);
							toast.error('Failed to submit comment', {});
						}

						await update(); // Ensure form state (including errors) is updated
						isSubmitting = false;
					};
				}}
			>
				<div class="form-control gap-0">
					<input type="hidden" name="author" value={data?.user?.id} />
					<input type="hidden" name="recordId" value={data.post?.id} />
					<input type="hidden" name="post" value={data.post?.id} />
					<TextArea
						id="content"
						value={form?.data?.content ?? ''}
						errors={form?.errors?.content}
						disabled={loading}
						placeholder={`type your reply to ${data.post.expand.author.username} here...`}
					/>

					<Button type="submit" class="group/submitButton w-full" disabled={loading}>
						submit
						{#if isSubmitting}
							<Icon icon="eos-icons:loading" class="ml-2 h-5 w-5" />
						{:else}
							<Icon
								icon="mdi-send"
								class="ml-2 h-5 w-5 transition-all duration-300 md:group-hover/submitButton:translate-x-1"
							/>
						{/if}
					</Button>
				</div>
			</form>
		</div>
	{/if}

	{#each data.post.comments.slice().reverse() as comment}
		<div class="relative flex items-start gap-2 border-b py-5 pl-2">
			<img
				src={comment?.authorAvatar
					? getImageURL($currentUser?.collectionId, comment?.author, comment?.authorAvatar)
					: `https://ui-avatars.com/api/?name=${$currentUser?.email}`}
				class="h-8 w-8 rounded-full object-cover"
				alt="user-avatar"
			/>

			<div class="-mt-1 flex flex-col">
				<div class="flex items-center gap-2">
					<div class="text-sm">
						{comment?.authorUsername}
					</div>
					<div class="text-xs text-foreground/70">
						{timeSince(formatFriendlyDate(comment?.created))}
					</div>
				</div>
				<div class="mt-1 font-thin">{comment?.content}</div>
			</div>

			{#if $currentUser.username === comment.authorUsername}
				<div class="absolute right-0 top-1 flex items-center gap-1">
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
						<input type="hidden" name="commentId" value={comment.id} />
						<input
							type="hidden"
							name="currentUserId"
							value={$currentUser.id}
							disabled={deleteLoading}
						/>
						<Button
							variant="ghost"
							size="sm"
							type="submit"
							class="group/deleteButton flex scale-[0.75] items-center active:scale-[0.70] "
						>
							<Icon
								icon={'mdi:close'}
								class={`h-5 w-5 transition-all duration-200 group-hover/deleteButton:scale-110 ${deleteLoading ? 'animate-deletePost' : ''}`}
							/>
							<span class="sr-only">Delete</span>
						</Button>
					</form>
				</div>
			{/if}
		</div>
	{/each}
</div>
