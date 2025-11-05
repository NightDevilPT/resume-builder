import { z } from "zod";

/**
 * Signup validation schema
 */
export const signupSchema = z
	.object({
		firstName: z
			.string()
			.min(1, "First name is required")
			.max(50, "First name must be less than 50 characters")
			.regex(
				/^[a-zA-Z\s'-]+$/,
				"First name can only contain letters, spaces, hyphens and apostrophes"
			),
		lastName: z
			.string()
			.min(1, "Last name is required")
			.max(50, "Last name must be less than 50 characters")
			.regex(
				/^[a-zA-Z\s'-]+$/,
				"Last name can only contain letters, spaces, hyphens and apostrophes"
			),
		userName: z
			.string()
			.min(3, "Username must be at least 3 characters")
			.max(30, "Username must be less than 30 characters")
			.regex(
				/^[a-zA-Z0-9_-]+$/,
				"Username can only contain letters, numbers, underscores and hyphens"
			)
			.toLowerCase(),
		email: z
			.string()
			.min(1, "Email is required")
			.email("Please enter a valid email address")
			.toLowerCase(),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(100, "Password must be less than 100 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number"
			),
		confirmPassword: z.string().min(1, "Please confirm your password"),
		acceptTerms: z
			.boolean()
			.refine((val) => val === true, {
				message: "You must accept the terms and conditions",
			}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type SignupFormValues = z.infer<typeof signupSchema>;

/**
 * Login validation schema
 */
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address")
		.toLowerCase(),
	password: z.string().min(1, "Password is required"),
	rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Forgot password validation schema
 */
export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address")
		.toLowerCase(),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(100, "Password must be less than 100 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number"
			),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

/**
 * Email verification validation schema
 */
export const verifyEmailSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address")
		.toLowerCase(),
	otp: z
		.string()
		.min(6, "OTP must be 6 digits")
		.max(6, "OTP must be 6 digits")
		.regex(/^\d{6}$/, "OTP must contain only numbers"),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

/**
 * Resend OTP validation schema
 */
export const resendOtpSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address")
		.toLowerCase(),
});

export type ResendOtpFormValues = z.infer<typeof resendOtpSchema>;

