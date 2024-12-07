import type { PageServerLoad, Actions } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginUserSchema } from '$lib/schema';
import type { Action } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(loginUserSchema))
	};
};

export const actions: Actions = {
	default: (async ({ request, locals }) => {
		const form = await superValidate(request, zod(loginUserSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await locals.pb.collection('users').authWithPassword(form.data.email, form.data.password);
			if (!locals.pb?.authStore?.record) {
				locals.pb.authStore.clear();
				return {
					notVerified: true
				};
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}

		throw redirect(303, '/');
	}) as Action
};
