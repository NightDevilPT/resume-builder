import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
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
 * Server-side JWT validation with returnUrl redirect
 */
export default async function ProtectedLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Server-side JWT validation
	const session = await getServerSession();

	// If no valid session (token expired/invalid), redirect to login with returnUrl
	if (!session) {
		// Get the current pathname from headers (set by middleware)
		const headersList = await headers();
		const pathname = headersList.get("x-pathname") || "";
		
		// Redirect with returnUrl if pathname exists
		if (pathname && pathname !== "/" && pathname !== "/auth/login") {
			const returnUrl = encodeURIComponent(pathname);
			redirect(`/auth/login?returnUrl=${returnUrl}`);
		}
		
		// Default redirect without returnUrl
		redirect("/auth/login");
	}

	// User is authenticated, render protected content
	return <RootLayoutProvider>{children}</RootLayoutProvider>;
}
