// src/lib/stores/chatMessages.ts
import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

const storedContextMessages = isBrowser ? localStorage.getItem('contextChatMessages') : null;
export const contextChatMessages = writable(
	storedContextMessages ? JSON.parse(storedContextMessages) : []
);

if (isBrowser) {
	contextChatMessages.subscribe((value) => {
		localStorage.setItem('contextChatMessages', JSON.stringify(value));
	});
}
