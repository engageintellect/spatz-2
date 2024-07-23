import { z } from "zod";

const imageTypes = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
	'image/svg+xml',
	'image/gif'
];

export const loginUserSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email.' }),
	password: z
    .string({ required_error: 'Password is required' })
});

export type LoginUserSchema = typeof loginUserSchema;

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


export const resetPasswordSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email.' }),
	password: z
    .string({ required_error: 'Password is required' })
});

export const updateEmailSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email' })
});

export const updateUsernameSchema = z.object({
	username: z
		.string({ required_error: 'Username is required' })
		.min(3, { message: 'Username must be at least 3 characters' })
		.max(24, { message: 'Username must be 24 characters or less' })
		.regex(/^[a-zA-Z0-9]*$/, { message: 'Username can only contain letters or numbers.' })
});

export type ResetPasswordSchema = typeof resetPasswordSchema;

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


export const formSchema = z.object({
  firstName: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  lastName: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  phone: z.string()
    .min(10, { message: "Phone number must contain at least 10 characters" })
    .max(15, { message: "Phone number must be at most 15 characters" }),
  email: z.string()
    .email({ message: "Invalid email address" }),
  type: z.string()
    .min(2, { message: "Message type must be selected" })
    .max(50, { message: "Message type must be selected" }),
  location: z.string()
    .min(2, { message: "Location must be selected" })
    .max(50, { message: "Location must be selected" }),
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(500, { message: "Message must be at most 500 characters" }),
});

export type FormSchema = typeof formSchema;



export const registerUserSchema = z
	.object({
		// name: z
		// 	.string({ required_error: 'Name is required' })
		// 	.regex(/^[a-zA-z\s]*$/, { message: 'Name can only contain letters and spaces.' })
		// 	.min(2, { message: 'Name must be at least 2 characters' })
		// 	.max(64, { message: 'Name must be less than 64 characters' })
		// 	.trim(),

		// job_title: z
		// 	.string({ required_error: 'Job Title is required' })
		// 	.regex(/^[a-zA-z\s]*$/, { message: 'Job Title can only contain letters and spaces.' })
		// 	.min(2, { message: 'Job Title must be at least 2 characters' })
		// 	.max(64, { message: 'Job Title must be less than 64 characters' })
		// 	.trim(),

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