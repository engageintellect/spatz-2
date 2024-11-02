<script lang="ts">
	import { getImageURL } from '$lib/utils';
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/user';
	import { gsap } from 'gsap';
	import { Button } from '$lib/components/ui/button/index.js';
	import Post from '$lib/components/ui/Post.svelte';
	import PostInputArea from '$lib/components/ui/PostInputArea.svelte';
	import Icon from '@iconify/svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';

	let loading = false;
	let isSubmitting = false;
	let showCommentsForm = $state(false);

	interface Props {
		data: {
			user: App.User;
			posts: App.Post[];
			post: App.Post;
			mentioning: App.Post[];
			respondingTo: App.Post[];
		};
		form: {
			data: {
				content?: string;
				post?: string;
			};
			errors: {
				content?: string[];
			};
		};
	}

	let { data, form }: Props = $props();

	onMount(() => {
		currentUser.set(data.user);
		if (data.post.mentionedBy.length === 0) {
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

<div class="mx-auto max-w-2xl">
	<!-- ------------------------------------ -->
	<!-- RESPONSE TO POST -->
	<!-- ------------------------------------ -->
	{#if data.post.mentioning.length > 0}
		<div class="mx-auto mt-5 max-w-lg gap-0 pb-2">
			{#if data.respondingTo.length > 0}
				<div class="mb-2 flex items-end gap-2">
					<div class="text-sm font-thin">responding to:</div>
				</div>

				<div class="flex items-center gap-2">
					<Badge variant="outline" class="pl-0">
						<div class="flex items-center justify-between gap-2">
							{#each data.respondingTo as mention}
								<a href={`/guestbook/post/${mention.id}`}>
									<div class="flex items-center gap-2">
										<img
											src={mention.authorAvatar
												? getImageURL(
														$currentUser?.collectionId,
														mention.author,
														mention.authorAvatar
													)
												: `https://ui-avatars.com/api/?name=${mention.authorUsername}&background=random`}
											alt={mention.authorUsername}
											class="h-7 w-7 rounded-full"
										/>
										<div class="text-sm font-thin">{mention.authorUsername}</div>
									</div>
								</a>
							{/each}
						</div>
					</Badge>
				</div>
			{/if}
		</div>
	{/if}

	<!-- ------------------------------------ -->
	<!-- MAIN POST -->
	<!-- ------------------------------------ -->
	<div class="post-hero mx-auto mt-5 max-w-lg">
		<Post
			postAuthorId={data.post.author}
			postAuthor={data.post.expand.author.username}
			postContent={data.post.content}
			comments={data.post.mentionedBy}
			postDate={data.post.created}
			avatar={data.post.expand.author.avatar
				? getImageURL($currentUser?.collectionId, data.post.author, data.post.expand.author.avatar)
				: `https://ui-avatars.com/api/?name=${data.post.expand.author.username}&background=random`}
			likes={data.post.likes}
			id={data.post.id}
			currentUser={$currentUser}
		/>
	</div>
</div>

<!-- ------------------------------------ -->
<!-- COMMENT FEED -->
<!-- ------------------------------------ -->
<div class="comment-feed mx-auto mt-5 max-w-lg">
	<div class="flex w-full justify-between border-b pb-2">
		<div class="flex items-center gap-1">
			<span class="text-xl font-thin">comments: {data.post.mentionedBy.length}</span>
		</div>

		<Button variant="ghost" size="sm" onclick={() => (showCommentsForm = !showCommentsForm)}>
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
						: `https://ui-avatars.com/api/?name=${$currentUser?.username}&background=random`}
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

	{#each data.mentioning.slice() as comment}
		<div class="border-b">
			<Post
				postAuthorId={comment.author}
				postAuthor={comment.authorUsername}
				postContent={comment.content}
				comments={comment.mentionedBy}
				postDate={comment.created}
				avatar={comment.authorAvatar
					? getImageURL($currentUser?.collectionId, comment.author, comment.authorAvatar)
					: `https://ui-avatars.com/api/?name=${comment.authorUsername}&background=random`}
				likes={comment.likes}
				id={comment.id}
				currentUser={$currentUser}
			/>
		</div>
	{/each}
</div>
