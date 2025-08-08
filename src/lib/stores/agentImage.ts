import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

type AgentImage = {
	prompt: string;
	imageUrl: string;
};

const defaultValue: AgentImage = { prompt: '', imageUrl: '' };

const stored = isBrowser ? localStorage.getItem('agentImage') : null;
const parsed = stored ? JSON.parse(stored) : defaultValue;

function createAgentImageStore() {
	const { subscribe, set, update } = writable<AgentImage>(parsed);

	return {
		subscribe,
		set,
		update,
		reset: () => set(defaultValue)
	};
}

export const agentImage = createAgentImageStore();

if (isBrowser) {
	agentImage.subscribe((value) => {
		localStorage.setItem('agentImage', JSON.stringify(value));
	});
}
