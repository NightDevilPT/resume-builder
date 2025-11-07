import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for Next.js 15
 * Handles auth redirects and adds returnUrl for protected routes
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
	const hasTokens = !!(accessToken || refreshToken);

	// Redirect authenticated users away from auth pages
	if (hasTokens && authRoutes.some((route) => pathname.startsWith(route))) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// For protected routes without tokens, redirect with returnUrl
	if (!hasTokens && protectedRoutes.some((route) => pathname.startsWith(route))) {
		const loginUrl = new URL("/auth/login", request.url);
		loginUrl.searchParams.set("returnUrl", pathname);
		return NextResponse.redirect(loginUrl);
	}

	// Add pathname to headers for server components to access
	const response = NextResponse.next();
	response.headers.set("x-pathname", pathname);
	
	return response;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
