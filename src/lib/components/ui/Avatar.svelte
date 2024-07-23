<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { getImageURL } from '$lib/utils';
	import { currentUser } from '$lib/stores/user';
</script>

<Avatar.Root class="">
	<Avatar.Image
		src={$currentUser?.avatar
			? getImageURL($currentUser?.collectionId, $currentUser?.id, $currentUser?.avatar)
			: `https://ui-avatars.com/api/?name=${$currentUser?.email}`}
		alt="User avatar"
	/>
	<Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>
