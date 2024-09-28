import type { PageServerLoad, Actions } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { checkoutSchema } from '$lib/schema';
import type { Action } from '@sveltejs/kit';

import { stripe } from '$lib/stripe';
// in src/routes/checkout/+page.server.ts

let user: any;

export const load: PageServerLoad = async ({ locals }) => {
	user = locals.user;

	if (!user) {
		throw redirect(303, '/auth/login');
	}

	return {
		form: await superValidate(zod(checkoutSchema))
	};
};

export const actions: Actions = {
	default: (async ({ request, locals }) => {
		const form = await superValidate(request, zod(checkoutSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// create the customer
		const customer = await stripe.customers.create({
			email: form.data.email,
			name: form.data.name
		});

		// set a cookie
		//cookies.set('customerId', customer.id)

		// redirect to collect payment
		throw redirect(303, '/checkout/payment');
	}) as Action
};
