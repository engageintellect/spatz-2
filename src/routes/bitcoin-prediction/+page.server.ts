import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}

	// Fetch predictions

	const sentiment = await fetch('https://api.alternative.me/fng/');
	const sentimentData = await sentiment.json();
	const response = await fetch('https://pi.engage-intellect.com/btc-price-predictor/predictions');
	const data = await response.json();

	// console.log('predictions:', data.predictions);

	// Extract predictions and model accuracy

	// Transform the predictions to include the new "Was_Correct" property
	const predictionsWithAccuracy = data.predictions.map((prediction: any, index: any, arr: any) => {
		// If there's no previous day, set Was_Correct to null
		if (index === 0) return { ...prediction, Was_Correct: null };

		const prevPrediction = arr[index - 1];
		const priceWentUp = prediction.closePrice > prevPrediction.closePrice;
		const priceWentDown = prediction.closePrice < prevPrediction.closePrice;

		// Determine if the previous prediction was correct
		const wasCorrect =
			(prevPrediction.prediction === 'UP' && priceWentUp) ||
			(prevPrediction.prediction === 'DOWN' && priceWentDown);

		return { ...prediction, wasCorrect: wasCorrect };
	});

	// console.log('predictionsWithAccuracy:', predictionsWithAccuracy);

	return {
		predictions: data,
		predictionsWithAccuracy: predictionsWithAccuracy,
		sentiment: sentimentData
	};
};
