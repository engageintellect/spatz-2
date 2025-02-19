import { updateEmailSchema, updateUsernameSchema } from '$lib/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types'; // Ensure the types are imported
import { validateData } from '$lib/utils';

// 'load' function with proper type
export const load: PageServerLoad = ({ locals }) => {
	// Check if user is authenticated
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}
};

// Actions with proper typing
export const actions: Actions = {
	updateEmail: async ({ request, locals }) => {
		// Validate the form data using the provided schema
		const { formData, errors } = await validateData(await request.formData(), updateEmailSchema);

		// Return errors if validation fails
		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			// Attempt to change the user's email
			await locals.pb.collection('users').requestEmailChange(formData.email);
		} catch (err: any) {
			// Handle any errors that occur during the request
			throw error(err.status, err.message);
		}

		// If successful, return success
		return {
			success: true
		};
	},

	updateUsername: async ({ request, locals }) => {
		// Validate the form data using the provided schema
		const { formData, errors } = await validateData(await request.formData(), updateUsernameSchema);

		// Return errors if validation fails
		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			// Check if the username already exists
			await locals.pb.collection('users').getFirstListItem(`username = "${formData.username}"`);
			return fail(406, { data: formData, errors: ['User already exists'], userNameAlreadyExists: true });
		} catch (err: any) {
			// If the username doesn't exist (404), proceed with updating the username
			if (err.status === 404) {
				try {
					// Update the username
					const { username } = await locals.pb
						.collection('users')
						.update(locals?.user?.id!, { username: formData.username });

					// Ensure locals.user is defined
					if (!locals.user) {
						throw error(500, "'locals.user' is null");
					}

					// Update the locals object with the new username
					locals.user.username = username;

					// Return success
					return {
						success: true
					};
				} catch (err: any) {
					// Handle any errors that occur during the username update
					console.log('Error: ', err);
					throw error(err.status, err.message);
				}
			}

			// Log and throw any other errors that occur
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
	}
};
