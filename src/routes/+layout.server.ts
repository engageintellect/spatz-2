import type { LayoutServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/schema';

// Load this data everywhere
export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: locals.user,
		form: await superValidate(zod(formSchema))
	};
};
