import { json } from '@sveltejs/kit';
import { OpenAI } from 'openai';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

// Create OpenAI client
const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
	const { prompt, size = '1024x1024', quality = 'standard' } = await request.json();

	try {
		const result = await openai.images.generate({
			model: 'dall-e-3',
			prompt,
			size,
			quality,
			n: 1
		});

		// Defensive check for result
		if (!result.data || result.data.length === 0) {
			return json({ error: 'No image returned from OpenAI' }, { status: 500 });
		}

		return json({ type: 'image', data: result.data[0].url });
	} catch (err: any) {
		console.error('Image generation error:', err);
		return json({ error: err?.message || 'Unexpected error' }, { status: 500 });
	}
};
