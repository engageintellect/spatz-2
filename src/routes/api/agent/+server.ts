import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

function extractContent(ai: unknown): string {
	// Pass-through if the upstream already returned a string
	if (typeof ai === 'string') return ai;

	// Helper to pull content from an OpenAI-like object
	const getFromObj = (o: any): string => {
		if (!o) return '';
		// n8n-style { ok, reply }
		if (typeof o.reply === 'string') return o.reply;
		// OpenAI chat completion
		const fromChoices = o?.choices?.[0]?.message?.content;
		if (typeof fromChoices === 'string') return fromChoices;
		// Sometimes wrapped under .data
		if (o.data) return getFromObj(o.data);
		return '';
	};

	// Arrays (some setups return an array of completions)
	if (Array.isArray(ai)) {
		// Try first item
		return getFromObj(ai[0]) || '';
	}

	// Plain object
	return getFromObj(ai as any) || '';
}

export const POST: RequestHandler = async ({ request }) => {
	const { prompt } = await request.json();

	try {
		const res = await fetch(env.N8N_AGENT_API, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt })
		});

		if (!res.ok) {
			const text = await res.text();
			return json({ error: text || 'Failed to fetch agent response' }, { status: res.status });
		}

		// Upstream could be:
		// - OpenAI chat completion object
		// - [OpenAI chat completion]
		// - { ok: true, reply: "..." } from n8n
		// - "plain string"
		const upstream = await res.json();
		const content = extractContent(upstream);

		// Always return a clean string in `data` for the client
		return json({ data: content });
	} catch (err: any) {
		console.error('Agent request error:', err);
		return json({ error: err?.message || 'Unexpected error' }, { status: 500 });
	}
};
