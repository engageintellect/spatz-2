import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

type AgentResponse = {
	prompt: string;
	response: string;
};

const defaultValue: AgentResponse = { prompt: '', response: '' };

const stored = isBrowser ? localStorage.getItem('agentResponse') : null;
const parsed = stored ? JSON.parse(stored) : defaultValue;

function createAgentResponseStore() {
	const { subscribe, set, update } = writable<AgentResponse>(parsed);

	return {
		subscribe,
		set,
		update,
		reset: () => set(defaultValue)
	};
}

export const agentResponse = createAgentResponseStore();

if (isBrowser) {
	agentResponse.subscribe((value) => {
		localStorage.setItem('agentResponse', JSON.stringify(value));
	});
}
