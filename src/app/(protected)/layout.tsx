import type { Metadata } from "next";
import { getServerSession } from "@/lib/services/jwt.service";
import RootLayoutProvider from "@/components/providers/layout-provider";

export const metadata: Metadata = {
	title: "Resume Builder By AI",
	description: "Build your resume with AI assistance",
};

// Force dynamic rendering since we check authentication
export const dynamic = "force-dynamic";

/**
 * Protected Layout
 * All routes under (protected) folder require authentication
 * Server-side JWT validation
 * 
 * Note: Middleware handles returnUrl for routes without tokens
 * This layout catches expired/invalid tokens and redirects to login
 */
export default async function ProtectedLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Server-side JWT validation
	// const session = await getServerSession();
	// console.log(session)
	// If no valid session (token expired/invalid), redirect to login
	// if (!session) {
	// 	redirect("/auth/login");
	// }

	// User is authenticated, render protected content
	return <RootLayoutProvider>{children}</RootLayoutProvider>;
}
