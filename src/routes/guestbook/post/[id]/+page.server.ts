import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { validateData } from '$lib/utils';
import { createPostCommentSchema, deletePostCommentSchema } from '$lib/schema';

interface CustomError {
	status: number;
	message: string;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;

	const post = await locals.pb.collection('posts').getOne(id, { expand: 'comments,author' });

	if (!post) {
		return {
			status: 404,
			error: new Error('Post not found')
		};
	}

	const users = await locals.pb.collection('users').getFullList({
		sort: '-created'
	});

	const posts = await locals.pb.collection('posts').getFullList({
		sort: '-created'
	});

	const transformedMentioning = posts
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

	const transformedPost = {
		...post,
		username: users.find((user) => user.id === post.author)?.username,
		avatar: users.find((user) => user.id === post.author)?.avatar
	};

	let respondingTo = [];
	if (post.mentioning && post.mentioning.length > 0) {
		respondingTo = await Promise.all(
			post.mentioning.map(async (mentionId: string) => {
				const mentionedPost = await locals.pb.collection('posts').getOne(mentionId, {
					expand: 'author,comments'
				});
				const author = users.find((user) => user.id === mentionedPost.author);
				return {
					...mentionedPost,
					authorUsername: author?.username,
					authorAvatar: author?.avatar
				};
			})
		);
	}

	return {
		post: transformedPost,
		mentioning: transformedMentioning,
		respondingTo
	};
};

export const actions: Actions = {
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
