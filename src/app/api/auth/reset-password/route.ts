import { z } from "zod";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/services/prisma.service";
import { NextRequest, NextResponse } from "next/server";

// Create a complete schema instead of extending
const resetPasswordWithOtpSchema = z
	.object({
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

type ResetPasswordWithOtpValues = z.infer<typeof resetPasswordWithOtpSchema>;

/**
 * POST /api/auth/reset-password
 * Resets user password using OTP verification
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const validationResult = resetPasswordWithOtpSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "VALIDATION_ERROR",
						message: "Invalid request data",
						details: validationResult.error.issues,
					},
				},
				{ status: 400 }
			);
		}

		const { email, otp, password } = validationResult.data;
		const normalizedEmail = email.toLowerCase();

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email: normalizedEmail },
			select: {
				id: true,
				email: true,
				otp: true,
				otpExpiredAt: true,
				emailVerified: true,
				isActive: true,
				isBanned: true,
			},
		});

		// Check if user exists
		if (!user) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "USER_NOT_FOUND",
						message: "No account found with this email address",
					},
				},
				{ status: 404 }
			);
		}

		// Check if user is banned or inactive
		if (user.isBanned) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "ACCOUNT_BANNED",
						message: "Your account has been banned. Please contact support.",
					},
				},
				{ status: 403 }
			);
		}

		if (!user.isActive) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "ACCOUNT_INACTIVE",
						message: "Your account is inactive. Please contact support.",
					},
				},
				{ status: 403 }
			);
		}

		// Check if email is verified
		if (!user.emailVerified) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "EMAIL_NOT_VERIFIED",
						message: "Please verify your email first before resetting password.",
						details: {
							email: normalizedEmail,
						},
					},
				},
				{ status: 403 }
			);
		}

		// Verify OTP exists
		if (!user.otp) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "NO_OTP_REQUESTED",
						message: "No password reset code has been requested. Please request a new code.",
					},
				},
				{ status: 400 }
			);
		}

		// Check if OTP is expired
		if (user.otpExpiredAt && new Date() > user.otpExpiredAt) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "OTP_EXPIRED",
						message: "Password reset code has expired. Please request a new one.",
					},
				},
				{ status: 400 }
			);
		}

		// Verify OTP
		if (user.otp !== otp) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "INVALID_OTP",
						message: "Invalid password reset code. Please try again.",
					},
				},
				{ status: 400 }
			);
		}

		// Hash new password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Update user password and clear OTP
		await prisma.user.update({
			where: { id: user.id },
			data: {
				password: hashedPassword,
				otp: null, // Clear OTP after successful reset
				otpExpiredAt: null,
				updatedAt: new Date(),
			},
		});

		// TODO: Send password changed notification email
		if (process.env.NODE_ENV === "development") {
			console.log(`[DEV] Password reset successful for ${normalizedEmail}`);
		}

		return NextResponse.json(
			{
				success: true,
				data: {
					message: "Password reset successful! You can now login with your new password.",
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("[RESET_PASSWORD_ERROR]:", error);

		// Handle Prisma errors
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "DATABASE_ERROR",
						message: "Database operation failed",
						details: error.message,
					},
				},
				{ status: 500 }
			);
		}

		// Handle Zod validation errors
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "VALIDATION_ERROR",
						message: "Invalid request data",
						details: error.issues,
					},
				},
				{ status: 400 }
			);
		}

		// Generic error
		return NextResponse.json(
			{
				success: false,
				error: {
					code: "INTERNAL_ERROR",
					message: "An unexpected error occurred while resetting your password",
				},
			},
			{ status: 500 }
		);
	}
}