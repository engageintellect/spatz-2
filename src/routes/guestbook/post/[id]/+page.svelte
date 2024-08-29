<script lang="ts">
	import { getImageURL } from '$lib/utils';
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/user';
	import { toast } from 'svelte-sonner';
	import { timeSince, formatFriendlyDate } from '$lib/utils';
	import { enhance, applyAction } from '$app/forms';
	import { tick } from 'svelte';
	import { gsap } from 'gsap';
	import { Button } from '$lib/components/ui/button/index.js';
	import Post from '$lib/components/ui/Post.svelte';
	import PostInputArea from '$lib/components/ui/PostInputArea.svelte';
	import Comment from '$lib/components/ui/Comment.svelte';
	import Icon from '@iconify/svelte';
	export let data: {
		user: App.User;
		posts: App.Post[];
		post: App.Post;
		comments: App.Comment[];
	};

	$: currentUser.set(data.user);

	let loading = false;
	let isSubmitting = false;

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
		if (data.post.comments.length === 0) {
			showCommentsForm = true;
		}
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
		class="group/backButton flex items-center gap-2"
		disabled={loading}
	>
		<Icon
			icon="mdi:arrow-left"
			class="h-5 w-5 transition-all duration-300 md:group-hover/backButton:-translate-x-1"
		/>
		<span class="text-sm">back</span>
	</Button>

	<!-- ------------------------------------ -->
	<!-- MAIN POST -->
	<!-- ------------------------------------ -->

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

	<!-- ------------------------------------ -->
	<!-- ADD COMMENT -->
	<!-- ------------------------------------ -->
	{#if showCommentsForm}
		<div>
			<form
				action="?/createPostComment"
				method="POST"
				class="mb-10 w-full"
				use:enhance={({ cancel }) => {
					if (isSubmitting) return cancel();
					isSubmitting = true;

					return async ({ result, update }) => {
						if (result.type === 'success') {
							toast('Comment submission success!', {});
							await update();
							await tick();

							const newPost = document.querySelector('.post-wrapper:first-child');
							if (newPost) {
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
							applyAction(result);
							toast.error('Failed to submit comment', {});
						}

						await update();
						isSubmitting = false;
					};
				}}
			>
				<div class="mt-5 gap-0">
					<input type="hidden" name="author" value={data?.user?.id} />
					<input type="hidden" name="recordId" value={data.post?.id} />
					<input type="hidden" name="post" value={data.post?.id} />
					<PostInputArea
						avatar={$currentUser?.avatar
							? getImageURL($currentUser?.collectionId, $currentUser?.id, $currentUser?.avatar)
							: `https://ui-avatars.com/api/?name=${$currentUser?.email}`}
						id="content"
						value={form?.data?.content ?? ''}
						errors={form?.errors?.content}
						disabled={loading}
						{isSubmitting}
						placeholder={`type your reply to ${data.post.expand.author.username} here...`}
					/>
				</div>
			</form>
		</div>
	{/if}

	<!-- ------------------------------------ -->
	<!-- COMMENT FEED -->
	<!-- ------------------------------------ -->
	{#each data.post.comments.slice().reverse() as comment}
		<Comment
			currentUser={$currentUser}
			userId={comment.author}
			username={comment.authorUsername}
			commentId={comment.id}
			avatar={comment.authorAvatar}
			createdDate={timeSince(formatFriendlyDate(comment.created))}
			comment={comment.content}
		/>
	{/each}
</div>
