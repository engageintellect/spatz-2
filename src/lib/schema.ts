import { z } from 'zod';
import { Filter } from 'bad-words';

const filter = new Filter();

const imageTypes = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
	'image/svg+xml',
	'image/gif'
];

// ------------------------------
// REGISTER USER
// ------------------------------
export const registerUserSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Email must be a valid email' }),
		password: z
			.string({ required_error: 'Password is required' })
			.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
				message:
					'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'
			}),
		passwordConfirm: z
			.string({ required_error: 'Confirm Password is required' })
			.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
				message:
					'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'
			})
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Password & Confirm password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Password & Confirm password must match',
				path: ['passwordConfirm']
			});
		}
	});

export type RegisterUserSchema = typeof registerUserSchema;

// ------------------------------
// LOGIN USER
// ------------------------------
export const loginUserSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email.' }),
	password: z.string({ required_error: 'Password is required' })
});

export type LoginUserSchema = typeof loginUserSchema;

// ------------------------------
// UPDATE PASSWORD
// ------------------------------
export const updatePasswordSchema = z
	.object({
		oldPassword: z.string({ required_error: 'Old password is required' }),
		password: z
			.string({ required_error: 'Password is required' })
			.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
				message:
					'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'
			}),
		passwordConfirm: z
			.string({ required_error: 'Confirm Password is required' })
			.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
				message:
					'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'
			})
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Password & Confirm password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Password & Confirm password must match',
				path: ['passwordConfirm']
			});
		}
	});

// ------------------------------
// PASSWORD RESET
// ------------------------------
export const resetPasswordSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email.' }),
	password: z.string({ required_error: 'Password is required' })
});

// ------------------------------
// UPDATE EMAIL
// ------------------------------
export const updateEmailSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email' })
});
export type UpdateEmailSchema = typeof updateEmailSchema;

// ------------------------------
// UPDATE USERNAME
// ------------------------------
export const updateUsernameSchema = z.object({
	username: z
		.string({ required_error: 'Username is required' })
		.min(3, { message: 'Username must be at least 3 characters' })
		.max(24, { message: 'Username must be 24 characters or less' })
		.regex(/^[a-zA-Z0-9]*$/, { message: 'Username can only contain letters or numbers.' })
});
export type UpdateUsernameSchema = typeof updateUsernameSchema;

// ------------------------------
// UPDATE PROFILE
// ------------------------------
export const updateProfileSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(1, { message: 'Name is required' })
		.max(64, { message: 'Name must be 64 characters or less' })
		.trim(),

	job_title: z
		.string({ required_error: 'Job Title is required' })
		.min(1, { message: 'Job Title is required' })
		.max(64, { message: 'Job Title must be 64 characters or less' })
		.trim(),

	website: z.string().url({ message: 'Must be a valid URL' }).optional(), // Optional if users aren't required to enter a website

	avatar: z
		.instanceof(Blob)
		.optional()
		.superRefine((val, ctx) => {
			if (val) {
				if (val.size > 5242880) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Avatar must be less than 5MB'
					});
				}

				if (!imageTypes.includes(val.type)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Unsupported file type. Supported formats: jpeg, jpg, png, webp, svg, gif'
					});
				}
			}
		})
});

// ------------------------------
//FOLLOW USER
// ------------------------------

export const followUserSchema = z.object({
	userId: z.string(),
	currentUserId: z.string()
});

export type FollowUserSchema = typeof followUserSchema;

// ------------------------------
//  CONTACT FORM
// ------------------------------
export const formSchema = z.object({
	firstName: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters' })
		.max(50, { message: 'Name must be at most 50 characters' })
		.refine((value) => !filter.isProfane(value), {
			message: 'First Name contains inappropriate language'
		}),
	lastName: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters' })
		.max(50, { message: 'Name must be at most 50 characters' })
		.refine((value) => !filter.isProfane(value), {
			message: 'Last Name contains inappropriate language'
		}),
	email: z.string().email({ message: 'Invalid email address' }),
	type: z
		.string()
		.min(2, { message: 'Type must be selected' })
		.max(50, { message: 'Type must be selected' }),
	priority: z
		.string()
		.min(1, { message: 'Location must be selected' })
		.max(2, { message: 'Location must be selected' }),
	message: z
		.string()
		.min(10, { message: 'Message must be at least 10 characters' })
		.max(500, { message: 'Message must be at most 500 characters' })
		.refine((value) => !filter.isProfane(value), {
			message: 'Message contains inappropriate language'
		})
});

export type FormSchema = typeof formSchema;

// ------------------------------
// CREATE GUEST BOOK POST
// ------------------------------
export const createGuestBookPostSchema = z.object({
	author: z.string().refine((value) => !filter.isProfane(value), {
		message: 'Author name contains inappropriate language'
	}),
	content: z
		.string({ required_error: 'Message is required' })
		.min(1, { message: 'Message must be at least 1 character' })
		.max(250, { message: 'Message must be 250 characters or less' })
		.refine((value) => !filter.isProfane(value), {
			message: 'Message contains inappropriate language'
		})
});

// ------------------------------
// CREATE POST COMMENT
// ------------------------------
export const createPostCommentSchema = z.object({
	author: z.string(),
	content: z
		.string({ required_error: 'Message is required' })
		.min(1, { message: 'Message must be at least 1 character' })
		.max(250, { message: 'Message must be 250 characters or less' })
		.refine((value) => !filter.isProfane(value), {
			message: 'Message contains inappropriate language'
		}),
	post: z.string()
});

// ------------------------------
// LIKE GUEST BOOK POST
// ------------------------------
export const likeGuestBookPostSchema = z.object({
	postId: z.string(),
	currentUserId: z.string()
});

// ------------------------------
// DELETE GUEST BOOK POST
// ------------------------------
export const deleteGuestBookPostSchema = z.object({
	postId: z.string()
});

// ------------------------------
// DELETE POST COMMENT
// ------------------------------
export const deletePostCommentSchema = z.object({
	post: z.string()
});
