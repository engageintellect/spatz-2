<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import { getImageURL } from '$lib/utils.js';
	import { onMount, tick } from 'svelte';
	import { currentUser } from '$lib/stores/user';
	import { animateMainStagger } from '$lib/animations';
	import ScrollIndicator from '$lib/components/ui/ScrollIndicator.svelte';
	import Notification from '$lib/components/ui/Notification.svelte';

	export let data: any;

	const handleScroll = () => {
		const shouldShow = window.scrollY > 100;
		if (shouldShow !== showScrollToTop) {
			showScrollToTop = shouldShow;
		}
	};

	let showScrollToTop = false;
	let hidden = true;

	onMount(() => {
		hidden = false;
		window.addEventListener('scroll', handleScroll);
		animateMainStagger();
	});
</script>

<ScrollIndicator />

<div class={` ${hidden ? 'opacity-0' : ''} mx-auto max-w-2xl`}>
	<div class="flex justify-between">
		<Button
			on:click={() => window.history.back()}
			size="sm"
			variant="outline"
			class="group/backButton backButton flex items-center gap-2"
		>
			<Icon
				icon="mdi:arrow-left"
				class="h-5 w-5 transition-all duration-300 md:group-hover/backButton:-translate-x-1"
			/>
			<span class="text-sm">back</span>
		</Button>
	</div>

	<main class="mx-auto mt-10 max-w-lg rounded-lg">
		{#if data.userPosts.length > 0}
			<div class="animate-item mb-2 mt-10 text-xl font-thin">
				{data.userProfile.username} has {data.notifications.length} notifications:
			</div>

			<div class="animate-item flex flex-col gap-2">
				{#each data.notifications as notification}
					{#if notification.user === data.userProfile.id}
						<Notification
							notificationReferencedPost={notification.referencedPost}
							notificationOwner={notification.user}
							notificationAuthor={notification.referencedUser}
							notificationAuthorUsername={notification.username}
							notificationContent={notification.message}
							postDate={notification.created}
							avatar={notification.userAvatar
								? getImageURL(
										data.userProfile.collectionId,
										notification.referencedUser,
										notification.userAvatar
									)
								: `https://ui-avatars.com/api/?name=${notification.user}&background=random`}
							id={notification.id}
							currentUser={$currentUser}
						/>
					{/if}
				{/each}
			</div>
		{:else}
			<div class="animate-item mt-10 border-b pb-2 text-xl font-thin md:mt-20">
				{$currentUser.username} has no notifications.
			</div>
		{/if}
	</main>

	{#if showScrollToTop === true}
		<div class="flex justify-center">
			<ScrollToTopButton />
		</div>
	{/if}
</div>
