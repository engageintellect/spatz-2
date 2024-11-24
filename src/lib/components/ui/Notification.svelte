<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button/index.js';
	import { formatFriendlyDate, timeSince } from '$lib/utils';

	interface Props {
		notificationComment: any;
		notificationReferencedPost: any;
		notificationOwner: any;
		notificationAuthor: any;
		notificationAuthorUsername: any;
		notificationContent: any;
		postDate: any;
		avatar: any;
		id: any;
		currentUser: any;
	}

	let {
		notificationComment,
		notificationReferencedPost,
		notificationOwner,
		notificationAuthor,
		notificationAuthorUsername,
		notificationContent,
		postDate,
		avatar,
		id,
		currentUser
	}: Props = $props();

	let isDeleting = $state(false);
	let deleteLoading = false;
	let dialogOpen = $state(false);

	// Define a type for notification types
	type NotificationType = 'follow' | 'like' | 'comment' | 'default';

	// Define the map for icon and background colors
	const notificationMap: Record<NotificationType, { icon: string; bgColor: string }> = {
		follow: { icon: 'mdi:account', bgColor: 'bg-info text-white' },
		like: { icon: 'material-symbols:favorite-rounded', bgColor: 'bg-destructive text-white' },
		comment: { icon: 'mdi:reply', bgColor: 'bg-purple-500 text-white' },
		default: { icon: 'material-symbols:notifications', bgColor: 'bg-info text-white' }
	};

	// Helper function to determine the notification type
	const getNotificationType = (content: string): NotificationType => {
		if (content.toLowerCase().includes('follow')) return 'follow';
		if (content.toLowerCase().includes('like')) return 'like';
		if (content.toLowerCase().includes('comment')) return 'comment';
		return 'default';
	};

	const notificationType = getNotificationType(notificationContent);
	const { icon, bgColor } = notificationMap[notificationType];
</script>

<div
	class="text-elipsis relative cursor-pointer overflow-x-hidden border-t transition-all duration-300"
>
	<div class="card-body p-3 px-1 transition-all duration-300">
		<div class="flex items-start gap-3">
			<div>
				<a href={`/users/${notificationAuthor}`}>
					<div class="relative h-10 w-10 md:h-12 md:w-12">
						<img
							src={avatar}
							class="mt-1 h-full w-full rounded-full border object-cover shadow"
							alt="user-avatar"
						/>
						<div
							class={`absolute -bottom-1 right-0 flex h-5 w-5 items-center justify-center rounded-full border border-background md:h-6 md:w-6 ${bgColor}`}
						>
							<Icon {icon} class="h-3 w-3 md:h-3.5 md:w-3.5" />
						</div>
					</div>
				</a>
			</div>
			<div class="w-full">
				<div class="flex items-center gap-2">
					<a href={`/users/${notificationAuthor}`} class="text-base lowercase text-primary">
						{notificationAuthorUsername}
					</a>
					<div class="text-xs text-foreground/70">
						{timeSince(formatFriendlyDate(postDate))}
					</div>
				</div>

				<a
					href={notificationComment?.id
						? `/guestbook/post/${notificationComment.id}`
						: notificationReferencedPost
							? `/guestbook/post/${notificationReferencedPost}`
							: `/users/${notificationAuthor}`}
				>
					<div class="pb-2 pr-5 pt-1 text-sm font-thin">{@html notificationContent}</div>
					{#if notificationComment}
						<div class="text-muted-foreground">"{notificationComment.content}"</div>
					{/if}
				</a>

				{#if currentUser.id === notificationOwner}
					<div class="absolute right-0 top-1 flex items-center gap-1">
						<Dialog.Root bind:open={dialogOpen}>
							<Dialog.Trigger>
								<Button
									variant="ghost"
									size="sm"
									onclick={() => (dialogOpen = true)}
									class="group/deleteButton flex scale-[0.75] items-center active:scale-[0.70]"
								>
									<Icon
										icon={'mdi:close'}
										class={`h-5 w-5 transition-all duration-200 group-hover/deleteButton:scale-110 ${deleteLoading ? 'animate-deletePost' : ''}`}
									/>
									<span class="sr-only">Delete</span>
								</Button>
							</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>Are you sure?</Dialog.Title>
									<Dialog.Description>
										Are you sure you want to delete this notification? This action cannot be undone.
										<form
											use:enhance={({ cancel }) => {
												if (isDeleting) return cancel();
												isDeleting = true;

												return async ({ result, update }) => {
													console.log('Result:', result);
													if (result.type === 'success') {
														toast('Notification deleted successfully.', {});
													} else {
														toast.error('Failed to delete notification.', {});
													}
													dialogOpen = false;
													await update();
													isDeleting = false;
												};
											}}
											action={`/notifications/[id]?/deleteNotification`}
											method="POST"
										>
											<input type="hidden" name="notificationId" value={id} />
											<input
												type="hidden"
												name="currentUserId"
												value={currentUser.id}
												disabled={deleteLoading}
											/>
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
		</div>
	</div>
</div>
