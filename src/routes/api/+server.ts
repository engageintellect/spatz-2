import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    return new Response(JSON.stringify({ 
			app: 'beauty-by-jitka',
			version: '0.0.5',
			message: 'Hello World' 
		}), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
