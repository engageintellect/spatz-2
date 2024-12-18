import { writable } from 'svelte/store';

export const alert = writable({
	show: false,
	message: '',
	type: '',
	icon: ''
});
