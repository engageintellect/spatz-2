<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';

	import { getImageURL } from '$lib/utils.js';

	export let data: any;
	import Post from '$lib/components/ui/Post.svelte';
	import { currentUser } from '$lib/stores/user';

	function goBack() {
		window.history.back();
	}

	$: currentUser.set(data.user);

	let loading = false;
</script>

<div class="mx-auto max-w-lg">
	<div class="flex justify-start">
		<Button
			on:click={goBack}
			size="sm"
			variant="outline"
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
	</div>
	<div class="mx-auto mt-10 max-w-lg rounded-lg">
		<div class="flex items-start justify-start gap-2 md:gap-5">
			<div class="h-16 w-16 md:h-24 md:w-24">
				<img
					class="h-full w-full rounded-full border object-cover shadow"
					alt={data.userProfile.username}
					src={data.userProfile?.avatar
						? getImageURL(
								data.userProfile?.collectionId,
								data.userProfile?.id,
								data.userProfile?.avatar
							)
						: `https://ui-avatars.com/api/?name=${data.userProfile?.username}`}
				/>
			</div>

			<div class="flex flex-col">
				<div class="text-2xl">
					{data.userProfile.username}
				</div>

				<div class="text-lg font-thin text-foreground/70">
					{data.userProfile.job_title}
				</div>
			</div>
		</div>

		{#if data.userPosts}
			<div class="mb-2 mt-10 text-xl font-thin">
				{data.userProfile.username} has {data.userPosts.length} posts:
			</div>

			<div class="grid grid-cols-1 gap-2">
				{#each data.userPosts as post}
					<div class="border-t">
						<Post
							postAuthorId={post.author}
							postAuthor={post.username}
							postContent={post.content}
							comments={post.mentionedBy}
							postDate={post.created}
							avatar={data.userProfile.avatar
								? getImageURL(
										data.userProfile.collectionId,
										data.userProfile.id,
										data.userProfile.avatar
									)
								: `https://ui-avatars.com/api/?name=${post.author.username}`}
							likes={post.likes}
							id={post.id}
							currentUser={$currentUser}
						/>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
