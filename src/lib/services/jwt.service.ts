import jwt from "jsonwebtoken";

/**
 * JWT Service
 * Handles token generation and verification for authentication
 */

// Token payload interface
export interface TokenPayload {
	userId: string;
	email: string;
	role: string;
}

// Decoded token interface
export interface DecodedToken extends TokenPayload {
	iat: number;
	exp: number;
	type: "access" | "refresh";
}

// Environment variables with defaults for development
const ACCESS_TOKEN_SECRET =
	process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret-key";
const REFRESH_TOKEN_SECRET =
	process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret-key";

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days
const REFRESH_TOKEN_EXPIRY_REMEMBER_ME = "30d"; // 30 days if remember me

/**
 * Generate access and refresh tokens
 * @param payload - User data to encode in the token
 * @param rememberMe - Whether to extend refresh token expiry
 * @returns Object containing access and refresh tokens
 */
export function generateTokens(
	payload: TokenPayload,
	rememberMe: boolean = false
): {
	accessToken: string;
	refreshToken: string;
} {
	try {
		// Generate access token (short-lived)
		const accessToken = jwt.sign(
			{
				...payload,
				type: "access",
			},
			ACCESS_TOKEN_SECRET,
			{
				expiresIn: ACCESS_TOKEN_EXPIRY,
			}
		);

		// Generate refresh token (long-lived)
		const refreshTokenExpiry = rememberMe
			? REFRESH_TOKEN_EXPIRY_REMEMBER_ME
			: REFRESH_TOKEN_EXPIRY;

		const refreshToken = jwt.sign(
			{
				...payload,
				type: "refresh",
			},
			REFRESH_TOKEN_SECRET,
			{
				expiresIn: refreshTokenExpiry,
			}
		);

		return {
			accessToken,
			refreshToken,
		};
	} catch (error) {
		console.error("[JWT_GENERATE_ERROR]:", error);
		throw new Error("Failed to generate tokens");
	}
}

/**
 * Verify and decode a token (supports both access and refresh tokens)
 * @param token - The JWT token to verify
 * @param type - Token type to verify ("access" or "refresh")
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export function verifyToken(
	token: string,
	type: "access" | "refresh" = "access"
): DecodedToken {
	try {
		// Select appropriate secret based on token type
		const secret =
			type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

		// Verify and decode token
		const decoded = jwt.verify(token, secret) as DecodedToken;

		// Verify token type matches
		if (decoded.type !== type) {
			throw new Error(`Invalid token type. Expected ${type} token.`);
		}

		return decoded;
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new Error("Token has expired");
		}

		if (error instanceof jwt.JsonWebTokenError) {
			throw new Error("Invalid token");
		}

		console.error("[JWT_VERIFY_ERROR]:", error);
		throw new Error("Failed to verify token");
	}
}

/**
 * Safely verify token without throwing errors
 * Returns null for expired/invalid tokens instead of throwing
 * Used in auth helpers and middleware
 * @param token - The JWT token to verify
 * @param type - Token type to verify ("access" or "refresh")
 * @returns Decoded token payload or null if invalid/expired
 */
export function safeVerifyToken(
	token: string,
	type: "access" | "refresh" = "access"
): DecodedToken | null {
	try {
		const secret =
			type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
		const decoded = jwt.verify(token, secret) as DecodedToken;

		if (decoded.type !== type) {
			return null;
		}

		return decoded;
	} catch (error) {
		// Silently return null for expired or invalid tokens
		return null;
	}
}

/**
 * Generate cookie options for token storage
 * @param maxAge - Cookie expiration in seconds (not milliseconds!)
 * @returns Cookie configuration object
 */
export function getCookieOptions(maxAge?: number) {
	return {
		httpOnly: true, // Prevents JavaScript access (XSS protection)
		secure: process.env.NODE_ENV === "production", // HTTPS only in production
		sameSite: "lax" as const, // CSRF protection
		path: "/", // Cookie available everywhere
		maxAge: maxAge || 15 * 60, // Default 15 minutes (in seconds)
	};
}

/**
 * Parse token expiry string to milliseconds
 * @param expiry - Expiry string (e.g., "15m", "7d")
 * @returns Expiry time in milliseconds
 */
export function parseExpiryToMs(expiry: string): number {
	const unit = expiry.slice(-1);
	const value = parseInt(expiry.slice(0, -1));

	switch (unit) {
		case "s":
			return value * 1000;
		case "m":
			return value * 60 * 1000;
		case "h":
			return value * 60 * 60 * 1000;
		case "d":
			return value * 24 * 60 * 60 * 1000;
		default:
			return value;
	}
}

/**
 * Get cookie max age for tokens
 * @param rememberMe - Whether user wants to stay logged in
 * @returns Object with access and refresh token max ages (in seconds for cookie usage)
 */
export function getTokenMaxAge(rememberMe: boolean = false) {
	return {
		accessToken: Math.floor(parseExpiryToMs(ACCESS_TOKEN_EXPIRY) / 1000), // Convert ms to seconds
		refreshToken: Math.floor(
			parseExpiryToMs(rememberMe ? REFRESH_TOKEN_EXPIRY_REMEMBER_ME : REFRESH_TOKEN_EXPIRY) / 1000
		), // Convert ms to seconds
	};
}

// ============================================================================
// SERVER-SIDE AUTHENTICATION UTILITIES
// ============================================================================

import { cookies } from "next/headers";
import type { User } from "@/interfaces/user";

/**
 * Server Session Interface
 */
export interface ServerSession {
	user: {
		id: string;
		email: string;
		role: string;
	};
	accessToken: string;
}

/**
 * Get Server Session
 * Validates JWT token from cookies and returns user session
 * 
 * @returns ServerSession if authenticated, null otherwise
 * 
 * @example
 * // In Server Component or Server Action
 * const session = await getServerSession();
 * if (!session) {
 *   redirect('/auth/login');
 * }
 */
export async function getServerSession(): Promise<ServerSession | null> {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get("accessToken")?.value;

		if (!accessToken) {
			return null;
		}

		// Verify the token safely (returns null for expired/invalid tokens)
		const decoded = safeVerifyToken(accessToken, "access");

		if (!decoded || !decoded.userId) {
			return null;
		}

		return {
			user: {
				id: decoded.userId,
				email: decoded.email,
				role: decoded.role,
			},
			accessToken,
		};
	} catch (error) {
		// Log only unexpected errors
		console.error("[SERVER_AUTH_ERROR]:", error);
		return null;
	}
}

/**
 * Get User from Server Session
 * Fetches complete user data from database using session
 * 
 * @returns User object if authenticated, null otherwise
 * 
 * @example
 * const user = await getServerUser();
 * if (!user) {
 *   redirect('/auth/login');
 * }
 */
export async function getServerUser(): Promise<User | null> {
	const session = await getServerSession();

	if (!session) {
		return null;
	}

	try {
		// Import prisma dynamically to avoid edge runtime issues
		const { prisma } = await import("@/lib/services/prisma.service");

		const dbUser = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				firstName: true,
				lastName: true,
				userName: true,
				email: true,
				avatar: true,
				bio: true,
				phone: true,
				emailVerified: true,
				isActive: true,
				isBanned: true,
				role: true,
				lastLoginAt: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!dbUser) {
			console.log("[SERVER_AUTH] User not found in database");
			return null;
		}

		if (dbUser.isBanned) {
			console.log("[SERVER_AUTH] User is banned");
			return null;
		}

		if (!dbUser.isActive) {
			console.log("[SERVER_AUTH] User is inactive");
			return null;
		}

		// Cast role to proper type
		return {
			...dbUser,
			role: dbUser.role as "user" | "admin",
		};
	} catch (error) {
		console.error("[GET_SERVER_USER_ERROR]:", error);
		return null;
	}
}

/**
 * Require Server Session
 * Throws error if no session found - use in Server Actions
 * 
 * @throws Error if not authenticated
 * @returns ServerSession
 * 
 * @example
 * // In Server Action
 * export async function updateProfile(data: ProfileData) {
 *   const session = await requireServerSession();
 *   // session is guaranteed to exist here
 * }
 */
export async function requireServerSession(): Promise<ServerSession> {
	const session = await getServerSession();

	if (!session) {
		throw new Error("Unauthorized - Authentication required");
	}

	return session;
}

/**
 * Require Server User
 * Throws error if no user found - use in Server Actions
 * 
 * @throws Error if not authenticated or user not found
 * @returns User
 * 
 * @example
 * // In Server Action
 * export async function deleteAccount() {
 *   const user = await requireServerUser();
 *   // user is guaranteed to exist here
 * }
 */
export async function requireServerUser(): Promise<User> {
	const user = await getServerUser();

	if (!user) {
		throw new Error("Unauthorized - User not found");
	}

	return user;
}

/**
 * Check if user has required role
 * 
 * @param requiredRole - Required role to check
 * @returns true if user has required role
 * 
 * @example
 * const isAdmin = await hasRole('admin');
 * if (!isAdmin) {
 *   return { error: 'Admin access required' };
 * }
 */
export async function hasRole(requiredRole: "user" | "admin"): Promise<boolean> {
	const session = await getServerSession();

	if (!session) {
		return false;
	}

	if (requiredRole === "admin") {
		return session.user.role === "admin";
	}

	return true; // All authenticated users have 'user' role
}

/**
 * Get user ID from server session (shorthand)
 * 
 * @returns User ID if authenticated, null otherwise
 * 
 * @example
 * const userId = await getUserId();
 * if (!userId) {
 *   return { error: 'Not authenticated' };
 * }
 */
export async function getUserId(): Promise<string | null> {
	const session = await getServerSession();
	return session?.user.id || null;
}

