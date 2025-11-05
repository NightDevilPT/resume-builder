import { z } from "zod";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/services/prisma.service";
import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/lib/validations/auth.validations";

/**
 * POST /api/auth/signup
 * Creates a new user account with email verification OTP
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const validationResult = signupSchema.safeParse(body);

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

		const { firstName, lastName, userName, email, password } =
			validationResult.data;

		// Check if user already exists (email or username)
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ email: email.toLowerCase() }, { userName: userName.toLowerCase() }],
			},
		});

		if (existingUser) {
			// Determine which field is duplicate
			const duplicateField =
				existingUser.email === email.toLowerCase() ? "email" : "username";

			return NextResponse.json(
				{
					success: false,
					error: {
						code: "USER_EXISTS",
						message: `A user with this ${duplicateField} already exists`,
						details: {
							field: duplicateField,
						},
					},
				},
				{ status: 409 }
			);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Generate 6-digit OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		// Set OTP expiration (10 minutes from now)
		const otpExpiredAt = new Date();
		otpExpiredAt.setMinutes(otpExpiredAt.getMinutes() + 10);

		// Create user
		const user = await prisma.user.create({
			data: {
				firstName,
				lastName,
				userName: userName.toLowerCase(),
				email: email.toLowerCase(),
				password: hashedPassword,
				otp,
				otpExpiredAt,
				emailVerified: false,
				isActive: true,
				isBanned: false,
				role: "user",
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

		// TODO: Send OTP email to user
		// For development, you can log the OTP
		if (process.env.NODE_ENV === "development") {
			console.log(`[DEV] OTP for ${email}: ${otp}`);
		}

		return NextResponse.json(
			{
				success: true,
				data: {
					user,
					message:
						"Account created successfully! Please check your email for the verification code.",
				},
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("[SIGNUP_ERROR]:", error);

		// Handle Prisma errors
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// P2002: Unique constraint violation
			if (error.code === "P2002") {
				const target = (error.meta?.target as string[]) || [];
				const field = target[0] || "field";

				return NextResponse.json(
					{
						success: false,
						error: {
							code: "UNIQUE_CONSTRAINT_ERROR",
							message: `This ${field} is already taken`,
							details: error.meta,
						},
					},
					{ status: 409 }
				);
			}

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
					message: "An unexpected error occurred during signup",
				},
			},
			{ status: 500 }
		);
	}
}

