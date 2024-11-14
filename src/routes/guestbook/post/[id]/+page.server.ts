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

	// Fetch the post with expanded comments and author
	const post = await locals.pb.collection('posts').getOne(id, { expand: 'comments,author' });

	if (!post) {
		throw error(404, 'Post not found');
	}

	// Fetch all users and posts once
	const [users, posts] = await Promise.all([
		locals.pb.collection('users').getFullList({ sort: '-created' }),
		locals.pb.collection('posts').getFullList({ sort: '-created' })
	]);

	// Create a map for users by their IDs for quick lookups
	const usersMap = new Map(users.map((user) => [user.id, user]));

	// Transform mentioning posts
	const transformedMentioning = posts
		.filter((mention) => mention.mentioning.includes(post.id))
		.map((mention) => ({
			...mention,
			authorUsername: usersMap.get(mention.author)?.username,
			authorAvatar: usersMap.get(mention.author)?.avatar,
			comments: mention.comments
		}));

	// Transform the current post
	const author = usersMap.get(post.author);
	const transformedPost = {
		...post,
		username: author?.username,
		avatar: author?.avatar,
		verified: author?.verified
	};

	// Fetch respondingTo posts if they exist
	const respondingTo = post.mentioning?.length
		? await Promise.all(
				post.mentioning.map(async (mentionId: string) => {
					const mentionedPost = await locals.pb.collection('posts').getOne(mentionId, {
						expand: 'author,comments'
					});
					const mentionedAuthor = usersMap.get(mentionedPost.author);
					return {
						...mentionedPost,
						authorUsername: mentionedAuthor?.username,
						authorAvatar: mentionedAuthor?.avatar
					};
				})
			)
		: [];

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
			const comment = await locals.pb.collection('posts').create(formData);

			// Get the associated post
			const post = await locals.pb.collection('posts').getOne(formData.post);

			// Update the post's mentioning and mentionedBy arrays
			await locals.pb.collection('posts').update(comment.id, { mentioning: post.id });

			const currentMentions = post.mentionedBy || [];
			currentMentions.push(comment.id);
			await locals.pb.collection('posts').update(post.id, { mentionedBy: currentMentions });

			// Create a notification
			if (post.author !== comment.author) {
				await locals.pb.collection('notifications').create({
					title: 'New Comment',
					message: 'Replied to your post',
					user: post.author,
					referencedUser: comment.author,
					referencedPost: post.id,
					commentId: comment.id
				});
			}

			return { success: true };
		} catch (err) {
			const customError = err as CustomError;
			console.error('Error creating comment:', customError.message);
			throw error(customError.status || 500, customError.message || 'Unknown error');
		}
	},

	deletePostComment: async ({ request, locals }) => {
		try {
			const formData = await request.formData();
			const commentId = formData.get('commentId') as string;
			const currentUserId = formData.get('currentUserId') as string;

			if (!commentId || !currentUserId) {
				throw error(400, 'Comment ID or User ID is missing');
			}

			deletePostCommentSchema.parse({ post: commentId });

			const comment = await locals.pb.collection('comments').getOne(commentId);

			if (comment.author !== locals.pb.authStore.model?.id) {
				throw error(403, 'Unauthorized');
			}

			await locals.pb.collection('comments').delete(commentId);

			return { success: true };
		} catch (err) {
			console.error('Error deleting comment:', err);
			return fail(500, { error: 'Error deleting comment' });
		}
	}
};
