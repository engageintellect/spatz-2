// src/lib/stores/generatedImage.ts
import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

type GeneratedImage = {
	prompt: string;
	imageUrl: string;
};

const stored = isBrowser ? localStorage.getItem('generatedImage') : null;
export const generatedImage = writable<GeneratedImage>(
	stored ? JSON.parse(stored) : { prompt: '', imageUrl: '' }
);

if (isBrowser) {
	generatedImage.subscribe((value) => {
		localStorage.setItem('generatedImage', JSON.stringify(value));
	});
}
