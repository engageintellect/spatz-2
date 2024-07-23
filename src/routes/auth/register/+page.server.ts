import type { PageServerLoad, Actions } from "./$types";
import { fail, error, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { registerUserSchema } from "$lib/schema";
import type { Action } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(registerUserSchema)),
  };
};


export const actions: Actions = {
  default: (async ({request, locals}) => {
    const form = await superValidate(await request, zod(registerUserSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

		const emailHandle = form.data.email.split('@')[0].toLowerCase();
		const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generate random 4 digit number
		const username = `${emailHandle}${randomDigits}`;
 
		 try {
			 await locals.pb.collection('users').create({ username, ...form.data });
			 await locals.pb.collection('users').requestVerification(form.data.email);
		 } catch (err) {
			 console.log('Error: ', err);
			 throw error(500, 'Something went wrong');
		 }
		throw redirect(303, '/auth/login');

  }) as Action,
};

