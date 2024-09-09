<script lang="ts">
	import { getImageURL } from '$lib/utils';
	import { onMount } from 'svelte';
	import { lazyLoad } from '$lib/lazyLoad'; // Import the lazy load function
	import { Input } from '$lib/components/ui/input/index.js'; // Import the Input component

	import ScrollIndicator from '$lib/components/ui/ScrollIndicator.svelte';

	export let data: any;

	let filter = ''; // Add a filter variable

	onMount(() => {
		// Lazy load the users on mount
		document.querySelectorAll('.user-wrapper').forEach((el) => {
			lazyLoad(el as HTMLElement);
		});
	});

	// Reactive filteredUsers array based on the filter input
	$: filteredUsers = data.users.filter((user: any) =>
		user.username.toLowerCase().includes(filter.toLowerCase())
	);
</script>

<ScrollIndicator />

<div class="mx-auto max-w-lg">
	<div class="bg-base-100 mx-auto mb-5 h-full w-full max-w-2xl">
		<a href="/ai" class="px-2 text-7xl md:px-0">user db</a>
	</div>

	<!-- Add an input field to filter by username -->
	<Input
		type="text"
		class="mb-4 w-full rounded-lg border p-2 shadow"
		placeholder="Search users by username..."
		bind:value={filter}
	/>

	<div class="mb-2 text-xl font-thin">
		<!-- Display the total count of filtered users -->
		{filter ? 'query matches' : 'total users'}: {filteredUsers.length}
	</div>

	<!-- Display filtered users -->
	<div class="grid grid-cols-1 gap-2 border-t pt-5 sm:grid-cols-2 md:grid-cols-3">
		{#each filteredUsers as user}
			<a href={`/users/${user.id}`}>
				<div
					class={`user-wrapper rounded-lg border p-3 shadow transition-all duration-300 md:hover:border-foreground`}
				>
					<div class="flex flex-row items-center gap-2 sm:flex-col">
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
			</a>
		{/each}
	</div>
</div>
