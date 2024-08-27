import { writable } from 'svelte/store';

export const toast = writable({
	show: false,
	message: '',
	type: '',
	icon: ''
});
