import { error } from '@sveltejs/kit';

export const actions = {
	resetPassword: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		try {
			console.log('resetPassword', body);
			await locals.pb.collection('users').requestPasswordReset(String(body.email));
			return {
				success: true
			};
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, 'Something went wrong');
		}
	}
};