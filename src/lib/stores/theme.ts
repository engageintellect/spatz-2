// src/stores/theme.ts

import { writable } from 'svelte/store';

// Fallback to 'default' if storedTheme is null
const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('selectedTheme') ?? 'engage-dark-neutral' : 'engage-dark-neutral';

export const selectedTheme = writable(storedTheme);

if (typeof window !== 'undefined') {
  selectedTheme.subscribe((value) => {
    localStorage.setItem('selectedTheme', value);
  });
}
