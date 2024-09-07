<script lang="ts">
	import { getImageURL } from '$lib/utils';
	import { onMount } from 'svelte';
	import { lazyLoad } from '$lib/lazyLoad'; // Import the lazy load function

	import ScrollIndicator from '$lib/components/ui/ScrollIndicator.svelte';

	export let data: any;

	onMount(() => {
		// Lazy load the users on mount
		document.querySelectorAll('.user-wrapper').forEach((el) => {
			lazyLoad(el as HTMLElement);
		});
	});
</script>

<ScrollIndicator />

<div class="mx-auto max-w-3xl">
	<div class="mb-2 text-xl font-thin">total users: {data.users.length}</div>

	<div class="animate-item grid grid-cols-1 gap-2 border-t pt-5 sm:grid-cols-2 md:grid-cols-3">
		{#each data.users as user}
			<div
				class={`user-wrapper rounded-lg border p-3 shadow transition-all duration-300 md:hover:border-foreground`}
			>
				<div class="flex items-center gap-2">
					<div>
						<div class="h-10 w-10 md:h-12 md:w-12">
							<img
								class="h-full w-full rounded-full border object-cover shadow"
								alt={user.username}
								src={user?.avatar
									? getImageURL(user?.collectionId, user?.id, user?.avatar)
									: `https://ui-avatars.com/api/?name=${user?.username}`}
							/>
						</div>
					</div>

					<h1 class="truncate whitespace-nowrap text-sm">{user.username}</h1>
				</div>
			</div>
		{/each}
	</div>
</div>
