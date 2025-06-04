import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

type GeneratedImage = {
	prompt: string;
	imageUrl: string;
};

const defaultValue: GeneratedImage = { prompt: '', imageUrl: '' };

const stored = isBrowser ? localStorage.getItem('generatedImage') : null;
const parsed = stored ? JSON.parse(stored) : defaultValue;

function createGeneratedImageStore() {
	const { subscribe, set, update } = writable<GeneratedImage>(parsed);

	return {
		subscribe,
		set,
		update,
		reset: () => set(defaultValue)
	};
}

export const generatedImage = createGeneratedImageStore();

if (isBrowser) {
	generatedImage.subscribe((value) => {
		localStorage.setItem('generatedImage', JSON.stringify(value));
	});
}
