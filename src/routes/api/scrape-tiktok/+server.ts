import type { RequestHandler } from '@sveltejs/kit';
import {TIKTOK_SCRAPER_URL} from '$env/static/private'

export const GET: RequestHandler = async () => {
    try {
        const response = await fetch(TIKTOK_SCRAPER_URL);

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Failed to fetch data:', error);

        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 500
        });
    }
};
