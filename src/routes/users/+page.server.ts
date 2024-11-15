import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}

	// GET USERS
	const users = await locals.pb.collection('users').getFullList({
		sort: '-created'
	});

	return { users: users };
};
