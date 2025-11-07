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

		// Delete authentication cookies completely
		response.cookies.delete("accessToken");
		response.cookies.delete("refreshToken");

		return response;
	} catch (error) {
		console.error("[LOGOUT_ERROR]:", error);

		// Even if there's an error, still delete the cookies
		const response = NextResponse.json(
			{
				success: true,
				data: {
					message: "Logged out successfully",
				},
			},
			{ status: 200 }
		);

		// Delete cookies completely
		response.cookies.delete("accessToken");
		response.cookies.delete("refreshToken");

		return response;
	}
}

