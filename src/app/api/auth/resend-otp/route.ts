import { z } from "zod";
import { prisma } from "@/lib/services/prisma.service";
import { NextRequest, NextResponse } from "next/server";
import { resendOtpSchema } from "@/lib/validations/auth.validations";

/**
 * POST /api/auth/resend-otp
 * Resends OTP to user's email for verification
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const validationResult = resendOtpSchema.safeParse(body);

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

		const { email } = validationResult.data;

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

		// Check if user is banned
		if (user.isBanned) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "ACCOUNT_BANNED",
						message:
							"Your account has been banned. Please contact support for assistance.",
					},
				},
				{ status: 403 }
			);
		}

		// Check if user is active
		if (!user.isActive) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "ACCOUNT_INACTIVE",
						message:
							"Your account is inactive. Please contact support for assistance.",
					},
				},
				{ status: 403 }
			);
		}

		// Check if OTP was recently sent (optional: implement rate limiting)
		// This prevents abuse by limiting OTP resends
		if (user.otpExpiredAt) {
			const now = new Date();
			const otpCreatedAt = new Date(
				user.otpExpiredAt.getTime() - 10 * 60 * 1000
			); // OTP was created 10 minutes before expiration

			// If OTP was sent less than 1 minute ago, don't send again
			const timeSinceLastOtp = now.getTime() - otpCreatedAt.getTime();
			if (timeSinceLastOtp < 60 * 1000) {
				const remainingSeconds = Math.ceil(
					(60 * 1000 - timeSinceLastOtp) / 1000
				);
				return NextResponse.json(
					{
						success: false,
						error: {
							code: "TOO_MANY_REQUESTS",
							message: `Please wait ${remainingSeconds} seconds before requesting a new code.`,
							details: {
								remainingSeconds,
							},
						},
					},
					{ status: 429 }
				);
			}
		}

		// Generate new 6-digit OTP
		const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

		// Set new OTP expiration (10 minutes from now)
		const newOtpExpiredAt = new Date();
		newOtpExpiredAt.setMinutes(newOtpExpiredAt.getMinutes() + 10);

		// Update user with new OTP
		await prisma.user.update({
			where: { id: user.id },
			data: {
				otp: newOtp,
				otpExpiredAt: newOtpExpiredAt,
			},
		});

		// Log OTP in development
		if (process.env.NODE_ENV === "development") {
			console.log(`[DEV] Resent OTP for ${email}: ${newOtp}`);
		}

		// TODO: Send OTP email to user
		// await sendEmail({
		//   to: user.email,
		//   subject: "Your Verification Code - ResumeCraft",
		//   template: "otp-verification",
		//   data: {
		//     name: user.firstName,
		//     otp: newOtp,
		//     expiresIn: "10 minutes",
		//   },
		// });

		return NextResponse.json(
			{
				success: true,
				data: {
					message:
						"A new verification code has been sent to your email address.",
					email: user.email,
					expiresIn: "10 minutes",
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("[RESEND_OTP_ERROR]:", error);

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
					message: "An unexpected error occurred while resending the code",
				},
			},
			{ status: 500 }
		);
	}
}

