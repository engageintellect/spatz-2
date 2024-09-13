<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';

	import { getImageURL } from '$lib/utils.js';
	import { onMount } from 'svelte';

	export let data: any;
	import Post from '$lib/components/ui/Post.svelte';
	import { currentUser } from '$lib/stores/user';
	import { animateMainStagger } from '$lib/animations';

	function goBack() {
		window.history.back();
	}

	$: currentUser.set(data.user);

	let loading = false;
	let hidden = true;

	onMount(() => {
		hidden = false;
		animateMainStagger();
	});
</script>

<div class={` ${hidden ? 'opacity-0' : ''} mx-auto max-w-lg`}>
	<div class="flex justify-between">
		<Button
			on:click={goBack}
			size="sm"
			variant="outline"
			type="submit"
			class="group/backButton backButton animate-item flex items-center gap-2"
			disabled={loading}
		>
			<Icon
				icon="mdi:arrow-left"
				class="h-5 w-5 transition-all duration-300 md:group-hover/backButton:-translate-x-1"
			/>
			<span class="text-sm">back</span>
		</Button>

		{#if data.userProfile.id === $currentUser.id}
			<a href="/my/settings/profile">
				<Button
					size="sm"
					variant="outline"
					class="group/backButton backButton animate-item flex items-center gap-2"
					disabled={loading}
				>
					<Icon
						icon="material-symbols:edit"
						class="h-5 w-5 transition-all duration-300 md:group-hover/backButton:-translate-x-1"
					/>
					<span class="text-sm">edit profile</span>
				</Button>
			</a>
		{/if}
	</div>
	<div class="mx-auto mt-10 max-w-lg rounded-lg">
		<div class="animate-item flex items-start justify-start gap-2 md:gap-5">
			<div class="h-20 w-20 md:h-24 md:w-24">
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

				{#if data.userProfile.website}
					<div class="mt-2">
						<a
							href={data.userProfile.website}
							class=" text-sm font-thin text-foreground hover:underline"
						>
							{data.userProfile.website}
						</a>
					</div>
				{/if}
			</div>
		</div>

		{#if data.userPosts}
			<div class="animate-item mb-2 mt-10 text-xl font-thin">
				{data.userProfile.username} has {data.userPosts.length} posts:
			</div>

			<div class="grid grid-cols-1 gap-2">
				{#each data.userPosts as post}
					<div class="animate-item border-t">
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
