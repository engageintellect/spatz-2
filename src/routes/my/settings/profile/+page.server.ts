// TypeScript/ SvelteKit: Cleaned up code for updating user profiles.

import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { updateProfileSchema } from '$lib/schema';
import { validateData } from '$lib/utils';
import { serialize } from 'object-to-formdata';

export const load: PageServerLoad = ({ locals }) => {
    if (!locals.pb.authStore.isValid) {
        throw redirect(303, '/auth/login');
    }
};

export const actions: Actions = {
    updateProfile: async ({ request, locals }) => {
        try {
            const body = await request.formData();
            if (body.has('avatar') && body.get('avatar') instanceof File && (body.get('avatar') as File).size === 0) {
                body.delete('avatar');
            }

            const { formData, errors } = await validateData(body, updateProfileSchema);

            if (errors) {
                return fail(400, { data: formData, errors: errors.fieldErrors });
            }

            const { name, job_title, avatar } = await locals.pb.collection('users').update(locals.user?.id, serialize(formData));

            // Update local user state
            if (locals.user) {
                locals.user.name = name;
                locals.user.job_title = job_title;
                locals.user.avatar = avatar;
            }

            return { success: true };
        } catch (err) {
            console.error('Error updating profile:', err);
            throw error(500, 'Failed to update profile.');
        }
    }
};
