import { Metadata } from "next";
import { SignupForm } from "@/components/pages/auth/SignupForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FieldDescription } from "@/components/ui/field";
import Link from "next/link";
import {
	FileText,
	Sparkles,
	Shield,
	Trophy,
	Users,
	Rocket,
	CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
	title: "Sign Up | ResumeCraft",
	description:
		"Create your ResumeCraft account and start building professional resumes",
};

export default function SignupPage() {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			{/* Left Column - Form Section */}
			<div className="bg-muted relative hidden lg:flex lg:flex-col lg:items-center lg:justify-center p-10">
				<div className="max-w-md space-y-8">
					{/* Main Heading */}
					<div className="space-y-4">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
							<Rocket className="h-8 w-8 text-primary" />
						</div>
						<h2 className="text-4xl font-bold tracking-tight">
							Start Your Success Story
						</h2>
						<p className="text-muted-foreground text-lg">
							Join thousands of professionals who have landed their dream
							jobs with ResumeCraft.
						</p>
					</div>

					{/* Feature List */}
					<div className="space-y-6 pt-4">
						<div className="flex items-start gap-4">
							<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
								<Sparkles className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold mb-1">AI-Powered Assistance</h3>
								<p className="text-sm text-muted-foreground">
									Get intelligent suggestions to make your resume stand
									out to recruiters.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
								<Trophy className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold mb-1">Expert Templates</h3>
								<p className="text-sm text-muted-foreground">
									Access professionally designed templates that pass ATS
									systems.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
								<Shield className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold mb-1">Bank-Level Security</h3>
								<p className="text-sm text-muted-foreground">
									Your personal information is protected with
									enterprise-grade encryption.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
								<Users className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold mb-1">10,000+ Happy Users</h3>
								<p className="text-sm text-muted-foreground">
									Trusted by job seekers at top companies like Google,
									Microsoft, and Amazon.
								</p>
							</div>
						</div>
					</div>

					{/* Benefits Checklist */}
					<div className="pt-6 border-t space-y-3">
						<p className="font-semibold mb-3">What you get:</p>
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm">
								<CheckCircle2 className="h-4 w-4 text-primary" />
								<span>Unlimited resume downloads</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<CheckCircle2 className="h-4 w-4 text-primary" />
								<span>Multiple template options</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<CheckCircle2 className="h-4 w-4 text-primary" />
								<span>Real-time preview</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<CheckCircle2 className="h-4 w-4 text-primary" />
								<span>24/7 support access</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right Column - Feature Highlights */}
			<div className="flex flex-col gap-4 p-6 md:p-10">
				{/* Centered Form with ScrollArea */}
				<div className="flex flex-1 items-center justify-center">
					<ScrollArea className="h-[calc(100vh-8rem)] lg:h-auto">
						<SignupForm />

						{/* Terms & Conditions */}
						<FieldDescription className="text-center mt-6 px-2">
							By continuing, you agree to our{" "}
							<Link
								href="/terms"
								className="font-medium text-primary hover:underline"
							>
								Terms
							</Link>{" "}
							and{" "}
							<Link
								href="/privacy"
								className="font-medium text-primary hover:underline"
							>
								Privacy Policy
							</Link>
							.
						</FieldDescription>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}

