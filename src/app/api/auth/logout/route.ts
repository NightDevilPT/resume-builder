import { getAuthUser } from "@/lib/utils/auth-helpers";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Logs out the user by clearing authentication cookies
 */
export async function POST(request: NextRequest) {
	try {
		// Get authenticated user (optional - just for logging)
		const authUser = getAuthUser(request);

		if (authUser) {
			console.log(`[LOGOUT] User ${authUser.email} logged out`);
		}

		// Create response
		const response = NextResponse.json(
			{
				success: true,
				data: {
					message: "Logged out successfully",
				},
			},
			{ status: 200 }
		);

		// Clear authentication cookies
		response.cookies.set("accessToken", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 0, // Expire immediately
		});

		response.cookies.set("refreshToken", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 0, // Expire immediately
		});

		return response;
	} catch (error) {
		console.error("[LOGOUT_ERROR]:", error);

		// Even if there's an error, still clear the cookies
		const response = NextResponse.json(
			{
				success: true,
				data: {
					message: "Logged out successfully",
				},
			},
			{ status: 200 }
		);

		// Clear cookies
		response.cookies.set("accessToken", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 0,
		});

		response.cookies.set("refreshToken", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 0,
		});

		return response;
	}
}

