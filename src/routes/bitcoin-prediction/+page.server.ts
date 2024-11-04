import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}

	// Fetch predictions
	const response = await fetch('https://pi.engage-intellect.com/btc-price-predictor/predictions');
	const data = await response.json();

	// Extract predictions and model accuracy

	return {
		predictions: data
	};
};
