import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/services/prisma.service";
import { NextRequest, NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth.validations";

/**
 * POST /api/auth/forgot-password
 * Sends a password reset OTP to the user's email
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const validationResult = forgotPasswordSchema.safeParse(body);

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
		const normalizedEmail = email.toLowerCase();

		// Check if user exists
		const user = await prisma.user.findUnique({
			where: { email: normalizedEmail },
			select: {
				id: true,
				email: true,
				firstName: true,
				emailVerified: true,
				isActive: true,
				isBanned: true,
			},
		});

		// For security, don't reveal if user exists or not
		// Always return success even if user doesn't exist
		if (!user) {
			// Log for monitoring purposes
			console.log(`[FORGOT_PASSWORD] Attempt for non-existent email: ${normalizedEmail}`);
			
			return NextResponse.json(
				{
					success: true,
					data: {
						message: "If an account exists with this email, you will receive a password reset code.",
						email: normalizedEmail,
					},
				},
				{ status: 200 }
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

		// Check for too many requests (rate limiting)
		const recentOtpRequests = await prisma.user.findUnique({
			where: { id: user.id },
			select: {
				updatedAt: true,
			},
		});

		if (recentOtpRequests?.updatedAt) {
			const lastRequestTime = recentOtpRequests.updatedAt.getTime();
			const now = Date.now();
			const timeSinceLastRequest = (now - lastRequestTime) / 1000; // in seconds

			// Allow only one OTP request per minute
			if (timeSinceLastRequest < 60) {
				const waitTime = Math.ceil(60 - timeSinceLastRequest);
				return NextResponse.json(
					{
						success: false,
						error: {
							code: "TOO_MANY_REQUESTS",
							message: `Please wait ${waitTime} seconds before requesting another code.`,
							details: {
								waitTime,
							},
						},
					},
					{ status: 429 }
				);
			}
		}

		// Generate 6-digit OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		// Set OTP expiration (10 minutes from now)
		const otpExpiredAt = new Date();
		otpExpiredAt.setMinutes(otpExpiredAt.getMinutes() + 10);

		// Update user with new OTP
		await prisma.user.update({
			where: { id: user.id },
			data: {
				otp,
				otpExpiredAt
			},
		});

		// TODO: Send password reset email with OTP
		// For development, log the OTP
		if (process.env.NODE_ENV === "development") {
			console.log(`[DEV] Password reset OTP for ${normalizedEmail}: ${otp}`);
		}

		return NextResponse.json(
			{
				success: true,
				data: {
					message: "If an account exists with this email, you will receive a password reset code.",
					email: normalizedEmail,
					expiresIn: "10 minutes",
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("[FORGOT_PASSWORD_ERROR]:", error);

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
					message: "An unexpected error occurred while processing your request",
				},
			},
			{ status: 500 }
		);
	}
}