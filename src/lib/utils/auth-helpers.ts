import { NextRequest } from "next/server";
import { verifyToken, type DecodedToken } from "@/lib/services/jwt.service";

/**
 * Authentication Helper Utilities
 * Helper functions for working with JWT tokens in API routes
 */

/**
 * Get authenticated user from request cookies
 * @param request - Next.js request object
 * @returns Decoded token payload or null if not authenticated
 */
export function getAuthUser(request: NextRequest): DecodedToken | null {
	try {
		// Get access token from cookies
		const accessToken = request.cookies.get("accessToken")?.value;

		if (!accessToken) {
			return null;
		}

		// Verify and decode the token
		const decoded = verifyToken(accessToken, "access");

		return decoded;
	} catch (error) {
		console.error("[GET_AUTH_USER_ERROR]:", error);
		return null;
	}
}

/**
 * Get refresh token from request cookies
 * @param request - Next.js request object
 * @returns Decoded refresh token payload or null if not found
 */
export function getRefreshToken(request: NextRequest): DecodedToken | null {
	try {
		// Get refresh token from cookies
		const refreshToken = request.cookies.get("refreshToken")?.value;

		if (!refreshToken) {
			return null;
		}

		// Verify and decode the refresh token
		const decoded = verifyToken(refreshToken, "refresh");

		return decoded;
	} catch (error) {
		console.error("[GET_REFRESH_TOKEN_ERROR]:", error);
		return null;
	}
}

/**
 * Require authentication for an API route
 * Throws an error if user is not authenticated
 * @param request - Next.js request object
 * @returns Decoded token payload
 * @throws Error if not authenticated
 */
export function requireAuth(request: NextRequest): DecodedToken {
	const user = getAuthUser(request);

	if (!user) {
		throw new Error("Authentication required");
	}

	return user;
}

/**
 * Check if user has specific role
 * @param request - Next.js request object
 * @param role - Required role
 * @returns True if user has the role, false otherwise
 */
export function hasRole(request: NextRequest, role: string): boolean {
	const user = getAuthUser(request);

	if (!user) {
		return false;
	}

	return user.role === role;
}

/**
 * Require specific role for an API route
 * Throws an error if user doesn't have the required role
 * @param request - Next.js request object
 * @param role - Required role
 * @returns Decoded token payload
 * @throws Error if user doesn't have the role
 */
export function requireRole(request: NextRequest, role: string): DecodedToken {
	const user = requireAuth(request);

	if (user.role !== role) {
		throw new Error(`Required role: ${role}`);
	}

	return user;
}

