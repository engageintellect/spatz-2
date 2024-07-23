import type { PageServerLoad, Actions } from "./$types";
import { fail, error, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { resetPasswordSchema } from "$lib/schema";
import type { Action } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(resetPasswordSchema)),
  };
};

export const actions: Actions = {
  default: (async ({request, locals}) => {
	console.log('applying resetpassword action')
    const form = await superValidate(await request, zod(resetPasswordSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

		const body = form.data.email
		console.log('this is the body', body)

		try {
			await locals.pb.collection('users').requestPasswordReset(String(body));
			return {
				success: true
			};
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, 'Something went wrong');
		}


		throw redirect(303, '/');

  }) as Action,
};

