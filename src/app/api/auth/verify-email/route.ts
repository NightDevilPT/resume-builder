import { z } from "zod";
import { prisma } from "@/lib/services/prisma.service";
import { NextRequest, NextResponse } from "next/server";
import { verifyEmailSchema } from "@/lib/validations/auth.validations";

/**
 * POST /api/auth/verify-email
 * Verifies user's email with OTP code
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const validationResult = verifyEmailSchema.safeParse(body);

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

		const { email, otp } = validationResult.data;

		// Find user by email
		const user = await prisma.user.findUnique({
			where: {
				email: email.toLowerCase(),
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

		// Check if email is already verified
		if (user.emailVerified) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "ALREADY_VERIFIED",
						message: "Your email is already verified. You can log in now.",
					},
				},
				{ status: 400 }
			);
		}

		// Check if OTP exists
		if (!user.otp) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "OTP_NOT_FOUND",
						message:
							"No verification code found. Please request a new code.",
					},
				},
				{ status: 400 }
			);
		}

		// Check if OTP has expired
		if (!user.otpExpiredAt || user.otpExpiredAt < new Date()) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "OTP_EXPIRED",
						message:
							"Your verification code has expired. Please request a new code.",
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
						message:
							"Invalid verification code. Please check and try again.",
					},
				},
				{ status: 400 }
			);
		}

		// Update user - mark email as verified and clear OTP
		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: {
				emailVerified: true,
				otp: null,
				otpExpiredAt: null,
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				userName: true,
				email: true,
				emailVerified: true,
				avatar: true,
				bio: true,
				phone: true,
				role: true,
				isActive: true,
				createdAt: true,
			},
		});

		return NextResponse.json(
			{
				success: true,
				data: {
					user: updatedUser,
					message:
						"Email verified successfully! You can now log in to your account.",
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("[VERIFY_EMAIL_ERROR]:", error);

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
					message: "An unexpected error occurred during email verification",
				},
			},
			{ status: 500 }
		);
	}
}

