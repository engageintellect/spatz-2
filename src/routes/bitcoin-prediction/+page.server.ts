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
	const predictionsWithAccuracy = data.predictions.map(
		(prediction: any, index: number, arr: any[]) => {
			// For the last day, there's no next day to compare, so set Was_Correct to null
			if (index === arr.length - 1) return { ...prediction, wasCorrect: null };

			const nextPrediction = arr[index + 1]; // Get the next day's prediction
			const priceGoesUp = nextPrediction.closePrice > prediction.closePrice;
			const priceGoesDown = nextPrediction.closePrice < prediction.closePrice;

			// Determine if the current prediction was correct based on the next day's price
			const wasCorrect =
				(prediction.prediction === 'UP' && priceGoesUp) ||
				(prediction.prediction === 'DOWN' && priceGoesDown);

			return { ...prediction, wasCorrect: wasCorrect };
		}
	);

	console.log('predictionsWithAccuracy:', predictionsWithAccuracy);

	return {
		predictions: data,
		predictionsWithAccuracy: predictionsWithAccuracy,
		sentiment: sentimentData
	};
};
