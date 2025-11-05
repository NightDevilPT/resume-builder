import { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/pages/auth/VerifyEmailForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail } from "lucide-react";

export const metadata: Metadata = {
	title: "Verify Email - ResumeCraft",
	description: "Verify your email address to complete registration",
};

/**
 * Loading fallback for VerifyEmailForm
 */
function VerifyEmailFormSkeleton() {
	return (
		<Card className="w-full">
			<CardHeader className="space-y-1">
				<div className="flex items-center justify-center mb-2">
					<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
						<Mail className="h-6 w-6 text-primary" />
					</div>
				</div>
				<CardTitle className="text-2xl text-center">
					Verify Your Email
				</CardTitle>
				<CardDescription className="text-center">
					Loading verification form...
				</CardDescription>
			</CardHeader>
			<CardContent className="flex items-center justify-center py-8">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</CardContent>
		</Card>
	);
}

/**
 * Email Verification Page
 * 
 * Allows users to:
 * - Enter 6-digit OTP sent to their email
 * - Resend OTP if expired or not received
 * - Automatically redirects to login on successful verification
 */
export default function VerifyEmailPage() {
	return (
		<div className="container flex items-center justify-center min-h-screen py-8">
			<div className="w-full max-w-md">
				<Suspense fallback={<VerifyEmailFormSkeleton />}>
					<VerifyEmailForm />
				</Suspense>
			</div>
		</div>
	);
}

