import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for Next.js 15 (Edge Runtime)
 * 
 * IMPORTANT: Middleware runs in Edge Runtime, not Node.js
 * JWT verification with jsonwebtoken library doesn't work in Edge Runtime
 * So we just check if cookies exist - actual JWT validation happens server-side
 */

const authRoutes = ["/auth/login", "/auth/signup", "/auth/verify-email"];

// Protected routes that require authentication
const protectedRoutes = [
	"/dashboard",
	"/profile", 
	"/settings",
	"/templates/admin",
];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get("accessToken")?.value;
	const refreshToken = request.cookies.get("refreshToken")?.value;
	
	// Check if cookies exist and are not empty
	// Note: We can't verify JWT in Edge Runtime, so just check existence
	// Server-side layout will do actual JWT validation
	const hasTokens = 
		(accessToken && accessToken.trim().length > 0) || 
		(refreshToken && refreshToken.trim().length > 0);

	// Redirect users with cookies away from auth pages
	if (hasTokens && authRoutes.some((route) => pathname.startsWith(route))) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// For protected routes without cookies, redirect with returnUrl
	if (!hasTokens && protectedRoutes.some((route) => pathname.startsWith(route))) {
		const loginUrl = new URL("/auth/login", request.url);
		loginUrl.searchParams.set("returnUrl", pathname);
		return NextResponse.redirect(loginUrl);
	}

	// Add pathname to headers for server components
	const response = NextResponse.next();
	response.headers.set("x-pathname", pathname);
	
	return response;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
