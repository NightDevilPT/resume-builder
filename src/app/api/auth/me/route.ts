import { prisma } from "@/lib/services/prisma.service";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/me
 * Returns the authenticated user's data
 * Requires valid access token in cookies
 */
export async function GET(request: NextRequest) {
	try {
		// Get authenticated user from token
		const authUser = getAuthUser(request);
		
		if (!authUser) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "UNAUTHORIZED",
						message: "Authentication required. Please log in.",
					},
				},
				{ status: 401 }
			);
		}

		// Fetch complete user data from database
		const user = await prisma.user.findUnique({
			where: {
				id: authUser.userId,
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
				isBanned: true,
				lastLoginAt: true,
				createdAt: true,
				updatedAt: true,
				// Exclude sensitive fields
				password: false,
				otp: false,
				otpExpiredAt: false,
			},
		});

		// Check if user still exists
		if (!user) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "USER_NOT_FOUND",
						message: "User account no longer exists.",
					},
				},
				{ status: 404 }
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

		// Return user data
		return NextResponse.json(
			{
				success: true,
				data: {
					user: {
						id: user.id,
						firstName: user.firstName,
						lastName: user.lastName,
						fullName: `${user.firstName} ${user.lastName}`,
						userName: user.userName,
						email: user.email,
						emailVerified: user.emailVerified,
						avatar: user.avatar,
						bio: user.bio,
						phone: user.phone,
						role: user.role,
						isActive: user.isActive,
						lastLoginAt: user.lastLoginAt,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt,
					},
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("[ME_API_ERROR]:", error);

		// Handle token expiration or invalid token errors
		if (
			error instanceof Error &&
			(error.message.includes("expired") ||
				error.message.includes("invalid"))
		) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "TOKEN_INVALID",
						message: "Your session has expired. Please log in again.",
					},
				},
				{ status: 401 }
			);
		}

		// Generic error
		return NextResponse.json(
			{
				success: false,
				error: {
					code: "INTERNAL_ERROR",
					message: "An unexpected error occurred.",
				},
			},
			{ status: 500 }
		);
	}
}

