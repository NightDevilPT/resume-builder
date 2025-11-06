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
 * Generate cookie options for token storage
 * @param maxAge - Cookie expiration in milliseconds
 * @returns Cookie configuration object
 */
export function getCookieOptions(maxAge?: number) {
	return {
		httpOnly: true, // Prevents JavaScript access (XSS protection)
		secure: process.env.NODE_ENV === "production", // HTTPS only in production
		sameSite: "lax" as const, // CSRF protection
		path: "/", // Cookie available everywhere
		maxAge: maxAge || 15 * 60 * 1000, // Default 15 minutes (in milliseconds)
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
 * @returns Object with access and refresh token max ages (in milliseconds)
 */
export function getTokenMaxAge(rememberMe: boolean = false) {
	return {
		accessToken: parseExpiryToMs(ACCESS_TOKEN_EXPIRY),
		refreshToken: parseExpiryToMs(
			rememberMe ? REFRESH_TOKEN_EXPIRY_REMEMBER_ME : REFRESH_TOKEN_EXPIRY
		),
	};
}

