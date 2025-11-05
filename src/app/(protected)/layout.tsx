import type { Metadata } from "next";
import RootLayoutProvider from "@/components/providers/layout-provider";

export const metadata: Metadata = {
	title: "Resume Builder By AI",
	description: "Build your resume with AI assistance",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <RootLayoutProvider>{children}</RootLayoutProvider>;
}
