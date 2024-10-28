import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { validateData } from '$lib/utils';
import {
	createGuestBookPostSchema,
	createPostCommentSchema,
	likeGuestBookPostSchema,
	deleteGuestBookPostSchema
} from '$lib/schema';

// Define the custom error type
interface CustomError {
	status: number;
	message: string;
}

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
		sort: '-created'
	});

	// TRANSFORM POSTS
	const transformedPosts = posts.map((post) => {
		// Replace the comment IDs with the actual comment objects and include author details

		// Add author's username and avatar to each post
		return {
			...post,
			userId: users.find((user) => user.id === post.author),
			username: users.find((user) => user.id === post.author)?.username,
			avatar: users.find((user) => user.id === post.author)?.avatar
		};
	});

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
				await locals.pb.collection('notifications').create({
					user: post.author,
					referencedUser: formData.currentUserId,
					referencedPost: post.id,
					title: 'New Like',
					message: 'Liked your post'
				});
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

			// Ensure the post exists
			const post = await locals.pb.collection('posts').getOne(postId);

			// Ensure the user is authorized to delete the post
			if (post.author !== locals.pb.authStore.model?.id) {
				throw error(403, 'Unauthorized');
			}

			// Recursive function to delete a post and all posts mentioning it
			const deletePostAndMentions = async (currentPostId: string) => {
				// Find posts that mention the current post's ID
				const mentioningPosts = await locals.pb.collection('posts').getFullList({
					filter: `mentioning ~ "${currentPostId}"`
				});

				// Recursively delete each post that mentions the current post
				for (const mentioningPost of mentioningPosts) {
					await deletePostAndMentions(mentioningPost.id); // Recursive call to handle nested mentions
				}

				// Delete the current post
				await locals.pb.collection('posts').delete(currentPostId);
			};

			// Start the deletion process with the selected post
			await deletePostAndMentions(postId);

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
