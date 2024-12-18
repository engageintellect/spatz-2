import { writable } from 'svelte/store';

export const toast = writable({
	show: false,
	title: '',
	content: '',
	type: '',
	icon: ''
});
