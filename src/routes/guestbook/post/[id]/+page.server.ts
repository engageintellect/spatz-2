import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { validateData } from '$lib/utils';
import {
	createGuestBookPostSchema,
	createPostCommentSchema,
	likeGuestBookPostSchema,
	deleteGuestBookPostSchema,
	deletePostCommentSchema
} from '$lib/schema';

interface CustomError {
	status: number;
	message: string;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	// Extract the post ID from the route parameters
	const { id } = params;

	// Fetch the post data from your database or API
	const post = await locals.pb.collection('posts').getOne(id, { expand: 'comments,author' });

	if (!post) {
		return {
			status: 404,
			error: new Error('Post not found')
		};
	}

	// Fetch additional data if necessary
	const users = await locals.pb.collection('users').getFullList({
		sort: '-created'
	});

	const mentioning = await locals.pb.collection('posts').getFullList({
		sort: '-created'
	});

	// show mentioning if mentioning.mentioning is the same as post.id
	const transformedMentioning = mentioning
		.filter((mention) => mention.mentioning.includes(post.id))
		.map((mention) => {
			const author = users.find((user) => user.id === mention.author);
			return {
				...mention,
				authorUsername: author?.username,
				authorAvatar: author?.avatar,
				comments: mention.comments
			};
		});

	// Transform the post object
	const transformedPost = {
		...post,
		username: users.find((user) => user.id === post.author)?.username,
		avatar: users.find((user) => user.id === post.author)?.avatar
	};

	// Return the transformed post data
	return {
		post: transformedPost,
		mentioning: transformedMentioning
	};
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

	createPostComment: async ({ request, locals }) => {
		const { formData, errors } = await validateData(
			await request.formData(),
			createPostCommentSchema
		);
		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			// Create the comment
			const mentioning = await locals.pb.collection('posts').create(formData);

			// Get the associated post
			const post = await locals.pb.collection('posts').getOne(formData.post);

			// Update the post's comments array to include the new comment ID
			await locals.pb.collection('posts').update(mentioning.id, { mentioning: post.id });

			const currentMentions = post.mentionedBy || [];

			// Append the new mention ID
			currentMentions.push(mentioning.id);

			// Update the post with the new array
			await locals.pb.collection('posts').update(post.id, { mentionedBy: currentMentions });

			return { success: true };
		} catch (err) {
			const customError = err as CustomError;
			console.log('Error: ', 'error creating comment: ' + customError.message);
			throw error(customError.status, customError.message);
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
			if (post.author !== locals.pb.authStore.model?.id) {
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
	},

	deletePostComment: async ({ request, locals }) => {
		try {
			// Parse and validate the commentId and other fields
			const formData = await request.formData();
			const commentId = formData.get('commentId') as string;
			const currentUserId = formData.get('currentUserId') as string;

			if (!commentId || !currentUserId) {
				throw error(400, 'Comment ID or User ID is missing');
			}

			// Validate using schema
			deletePostCommentSchema.parse({ post: commentId });

			// Fetch the comment to ensure it exists
			const comment = await locals.pb.collection('comments').getOne(commentId);

			// Ensure the user is authorized to delete the comment
			if (comment.author !== locals.pb.authStore.model?.id) {
				throw error(403, 'Unauthorized');
			}

			// Perform the delete operation
			await locals.pb.collection('comments').delete(commentId);

			return {
				success: true
			};
		} catch (err) {
			console.error('Error deleting comment:', err);
			return {
				error: 'Error deleting comment'
			};
		}
	}
};
