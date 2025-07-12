<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import { getImageURL } from '$lib/utils.js';
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/user';
	import { animateMainStagger } from '$lib/animations';
	import ScrollIndicator from '$lib/components/ui/ScrollIndicator.svelte';
	import Notification from '$lib/components/ui/Notification.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js'; // Adjust the path as needed

	let sidebar = useSidebar(); // Initialize the sidebar

	let dialogOpen = false;
	let isDeleting = false;
	let deleteLoading = false;

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
		animateMainStagger();
		window.addEventListener('scroll', handleScroll);
	});
</script>

<ScrollIndicator />

<div class={` ${hidden ? 'opacity-0' : ''} mx-auto max-w-2xl`}>
	<div class="flex justify-between">
		<Button
			onclick={() => window.history.back()}
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

	<main
		class={`${sidebar.state === 'expanded' ? 'lg:border lg:p-5' : 'md:border md:p-5'} animate-item mx-auto max-w-2xl rounded-lg md:mt-5`}
	>
		{#if data.notifications.length > 0}
			<div class="animate-item text-6xl">notifications</div>

			<div class="animate-item mt-5 flex items-center justify-between gap-2 pb-2">
				<div class="text-xl font-thin">
					<span class="text-muted-foreground">new notifications:</span>
					{data.notifications.length}
				</div>

				{#if data.notifications.length > 0}
					<div class="flex items-end justify-end gap-2">
						<Dialog.Root bind:open={dialogOpen}>
							<Dialog.Trigger class="flex w-full justify-end">
								<div>
									<Button
										variant="destructive"
										size="sm"
										onclick={() => (dialogOpen = true)}
										class="group/deleteButton transition-scale flex scale-[0.80] items-center gap-2 duration-300 active:scale-[0.78]"
									>
										<div>clear all</div>
										<Icon
											icon={'mdi:trash'}
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
										Are you sure you want to delete ALL your notifications? This action cannot be
										undone.
										<form
											use:enhance={({ cancel }) => {
												if (isDeleting) return cancel(); // Prevent multiple submissions
												isDeleting = true;

												return async ({ result, update }) => {
													console.log('THIS IS RESULT', result);
													if (result.type === 'success') {
														toast('Notifications deleted successfully.', {});
													} else {
														toast.error('Failed to delete notifications.', {});
													}

													await update();
													dialogOpen = false;

													isDeleting = false;
												};
											}}
											action={`/notifications/[id]?/deleteAllNotifications`}
											method="POST"
										>
											<div class="mt-5 flex items-center justify-between gap-2">
												<Button type="submit" variant="destructive" class="w-full text-white"
													>delete</Button
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

			<div class="animate-item flex flex-col">
				{#if data.notifications.length > 0}
					{#each data.notifications as notification}
						{#if notification.user === data.userProfile.id}
							<Notification
								notificationComment={notification.expand?.commentId}
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
				{/if}
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
