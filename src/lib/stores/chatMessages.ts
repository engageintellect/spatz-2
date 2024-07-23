// src/lib/stores/chatMessages.ts
import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

const storedMessages = isBrowser ? localStorage.getItem('chatMessages') : null;
export const chatMessages = writable(storedMessages ? JSON.parse(storedMessages) : []);

if (isBrowser) {
  chatMessages.subscribe((value) => {
    localStorage.setItem('chatMessages', JSON.stringify(value));
  });
}
