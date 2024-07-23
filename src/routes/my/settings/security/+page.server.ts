import { error, fail, redirect } from '@sveltejs/kit';
import { updatePasswordSchema } from '$lib/schema';
import { validateData } from '$lib/utils';

export const load = ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}
};

export const actions = {
	updatePassword: async ({ request, locals }) => {
		const { formData, errors } = await validateData(await request.formData(), updatePasswordSchema);

		if (errors) {
			return fail(400, {
				errors: errors.fieldErrors
			});
		}

		try {
			await locals.pb.collection('users').update(locals?.user?.id, formData);
			locals.pb.authStore.clear();
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, 'Internal Server Error');
		}

		throw redirect(303, '/auth/login');
	}
};