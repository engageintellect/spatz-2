<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { getImageURL } from '$lib/utils';
	import { currentUser } from '$lib/stores/user';
</script>

<Avatar.Root class="">
	<Avatar.Image
		class="transition-transform duration-300 ease-in-out hover:scale-105"
		src={$currentUser?.avatar
			? getImageURL($currentUser?.collectionId, $currentUser?.id, $currentUser?.avatar)
			: `https://ui-avatars.com/api/?name=${$currentUser?.username}&background=random`}
		alt="User avatar"
	/>
	<Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>
