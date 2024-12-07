import { pb } from '$lib/pocketbase';
import { currentUser } from '$lib/stores/user';

pb.authStore.loadFromCookie(document.cookie);
pb.authStore.onChange(() => {
	currentUser.set(pb.authStore.record);
	document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
}, true);
