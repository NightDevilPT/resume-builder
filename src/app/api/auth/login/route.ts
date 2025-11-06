import {
	generateTokens,
	getCookieOptions,
	getTokenMaxAge,
} from "@/lib/services/jwt.service";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/services/prisma.service";
import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth.validations";

/**
 * POST /api/auth/login
 * Authenticates a user with email and password
 * Handles email verification and OTP expiration
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const validationResult = loginSchema.safeParse(body);

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

		const { email, password, rememberMe } = validationResult.data;

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
						code: "INVALID_CREDENTIALS",
						message: "Invalid email or password",
					},
				},
				{ status: 401 }
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

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "INVALID_CREDENTIALS",
						message: "Invalid email or password",
					},
				},
				{ status: 401 }
			);
		}

		// Check if email is verified
		if (!user.emailVerified) {
			// Check if OTP exists and if it's expired
			const now = new Date();
			const isOtpExpired =
				!user.otpExpiredAt || user.otpExpiredAt < now || !user.otp;

			// If OTP is expired or doesn't exist, generate a new one
			if (isOtpExpired) {
				// Generate new 6-digit OTP
				const newOtp = Math.floor(
					100000 + Math.random() * 900000
				).toString();

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
					console.log(`[DEV] New OTP for ${email}: ${newOtp}`);
				}

				// TODO: Send new OTP email to user

				return NextResponse.json(
					{
						success: false,
						error: {
							code: "EMAIL_NOT_VERIFIED",
							message:
								"Your email is not verified. A new verification code has been sent to your email.",
							details: {
								email: user.email,
								userId: user.id,
								otpRegenerated: true,
							},
						},
					},
					{ status: 403 }
				);
			}

			// OTP is still valid
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "EMAIL_NOT_VERIFIED",
						message:
							"Your email is not verified. Please check your email for the verification code.",
						details: {
							email: user.email,
							userId: user.id,
							otpRegenerated: false,
						},
					},
				},
				{ status: 403 }
			);
		}

		// Update last login time
		await prisma.user.update({
			where: { id: user.id },
			data: {
				lastLoginAt: new Date(),
			},
		});

		// Prepare user data for response (exclude sensitive fields)
		const userData = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			userName: user.userName,
			email: user.email,
			emailVerified: user.emailVerified,
			avatar: user.avatar,
			bio: user.bio,
			phone: user.phone,
			role: user.role,
			isActive: user.isActive,
			lastLoginAt: new Date(),
			createdAt: user.createdAt,
		};

		// Generate JWT tokens
		const { accessToken, refreshToken } = generateTokens(
			{
				userId: user.id,
				email: user.email,
				role: user.role,
			},
			rememberMe
		);

		// Get token max ages based on rememberMe flag
		const tokenMaxAge = getTokenMaxAge(rememberMe);

		// Create response with user data
		const response = NextResponse.json(
			{
				success: true,
				data: {
					user: userData,
					message: "Login successful!",
					accessToken, // Include in response for client-side storage if needed
				},
			},
			{ status: 200 }
		);

		// Set HTTP-only cookies for tokens
		response.cookies.set(
			"accessToken",
			accessToken,
			getCookieOptions(tokenMaxAge.accessToken)
		);

		response.cookies.set(
			"refreshToken",
			refreshToken,
			getCookieOptions(tokenMaxAge.refreshToken)
		);

		return response;
	} catch (error) {
		console.error("[LOGIN_ERROR]:", error);

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
					message: "An unexpected error occurred during login",
				},
			},
			{ status: 500 }
		);
	}
}
