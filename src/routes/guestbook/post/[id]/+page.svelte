<script lang="ts">
	import { getImageURL } from '$lib/utils';
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/user';
	import { timeSince, formatFriendlyDate } from '$lib/utils';
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

		gsap
			.timeline()
			.from('.backButton', {
				opacity: 0,
				x: -10,
				duration: 0.5,
				ease: 'power4.out'
			})
			.from(
				'.post-hero',
				{
					opacity: 0,
					y: 10,
					scale: 0.95,
					duration: 0.8,
					ease: 'power4.out'
				},
				'-=0.5'
			)
			.from(
				'.comment-feed',
				{
					opacity: 0,
					y: 30,
					duration: 1,
					stagger: 0.15,
					ease: 'power4.out'
				},
				'-=0.75'
			);
	});
</script>

<div class="mx-auto max-w-lg">
	<Button
		on:click={goBack}
		size="sm"
		variant="ghost"
		type="submit"
		class="group/backButton backButton flex items-center gap-2"
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
		/>
	</div>
</div>

<div class="comment-feed mx-auto mt-5 max-w-lg">
	<div class="flex w-full justify-between border-b pb-2">
		<div class="flex items-center gap-1">
			<span class="text-xl font-thin">comments: {data.post.comments.length}</span>
		</div>

		<Button variant="ghost" size="sm" on:click={() => (showCommentsForm = !showCommentsForm)}>
			{#if showCommentsForm}
				<div class="flex items-center gap-1">
					<span>hide input</span>
					<Icon icon="ic:baseline-minus" class="h-5 w-5" />
				</div>
			{:else}
				<div class="flex items-center gap-1">
					<span>add comment</span>
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
			<div class="mt-5 gap-0 border-b pb-5">
				<input type="hidden" name="author" value={data?.user?.id} />
				<PostInputArea
					action="?/createPostComment"
					toastSuccess="Comment submission success!"
					toastError="Failed to submit comment"
					recordId={data.post.id}
					postId={data.post.id}
					userId={$currentUser?.id}
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
