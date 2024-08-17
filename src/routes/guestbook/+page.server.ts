import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { validateData } from '$lib/utils';
import {
	createGuestBookPostSchema,
	likeGuestBookPostSchema,
	deleteGuestBookPostSchema
} from '$lib/schema';

// Define the custom error type
interface CustomError {
	status: number;
	message: string;
}

// LOAD FUNCTION
export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}
	// GET POSTS
	const posts = await locals.pb.collection('posts').getFullList({
		sort: '-created'
	});
	// GET USERS
	const users = await locals.pb.collection('users').getFullList({
		fields: 'id,username,avatar'
	});
	// ADD AUTHORS USERNAME TO POST OBJECT
	const transformedPosts = posts.map((post) => ({
		...post,
		username: users.find((user) => user.id === post.author)?.username,
		avatar: users.find((user) => user.id === post.author)?.avatar
	}));

	return { posts: transformedPosts };
};

// Define the actions
export const actions: Actions = {
	createPost: async ({ request, locals }) => {
		const { formData, errors } = await validateData(
			await request.formData(),
			createGuestBookPostSchema
		);
		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}
		try {
			await locals.pb.collection('posts').create(formData);
		} catch (err) {
			const customError = err as CustomError;
			console.log('Error: ', 'error creating post: ' + customError.message);
			throw error(customError.status, customError.message);
		}
		return { success: true };
	},

	likePost: async ({ request, locals }) => {
		try {
			const { formData } = await validateData(await request.formData(), likeGuestBookPostSchema);
			const post = await locals.pb.collection('posts').getOne(formData.postId, { expand: 'likes' });

			const userIndex = post.likes.indexOf(formData.currentUserId);
			if (userIndex !== -1) {
				post.likes.splice(userIndex, 1);
			} else {
				post.likes.push(formData.currentUserId);
			}

			try {
				await locals.pb.collection('posts').update(post.id, { likes: post.likes });
			} catch (err) {
				const customError = err as CustomError;
				console.log('Error: ', 'error liking/unliking post: ' + customError.message);
				throw error(customError.status, customError.message);
			}
			// Fetch the updated post
			const updatedPost = await locals.pb
				.collection('posts')
				.getOne(formData.postId, { expand: 'likes' });

			return {
				success: true,
				post: updatedPost
			};
		} catch (err) {
			console.error('Error processing likePost:', err);
			throw error(500, 'An unknown error occurred');
		}
	},

	deletePost: async ({ request, locals }) => {
		try {
			// Parse and validate the postId
			const formData = await request.formData();
			const postId = formData.get('postId') as string;
			deleteGuestBookPostSchema.parse({ postId });

			// Fetch the post to ensure it exists
			const post = await locals.pb.collection('posts').getOne(postId);

			// Ensure the user is authorized to delete the post

			console.log(locals.pb.authStore)


			//! TODO: look into this
			// @ts-expect-error - ignore type error on this line
			if (post.author !== locals.pb.authStore?.baseModel?.id) {
				throw error(403, 'Unauthorized');
			}

			// Perform the delete operation
			await locals.pb.collection('posts').delete(postId);

			return {
				success: true
			};
		} catch (err) {
			console.error('Error deleting post:', err);
			return {
				error: 'Error deleting post'
			};
		}
	}
};
