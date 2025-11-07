import { Metadata } from "next";
import { Suspense } from "react";
import { FieldDescription } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
	Sparkles,
	Zap,
	Shield,
	Award,
	TrendingUp,
	CheckCircle2,
	Users,
	Trophy,
} from "lucide-react";
import { LoginForm } from "@/components/pages/auth/LoginForm";

export const metadata: Metadata = {
	title: "Sign In | ResumeCraft",
	description: "Sign in to your ResumeCraft account",
};

export default function LoginPage() {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			{/* Left Column - Form Section */}
			<div className="flex flex-col gap-4 p-6 md:p-10">
				{/* Centered Form with ScrollArea */}
				<div className="flex flex-1 items-center justify-center">
					<ScrollArea className="h-[calc(100vh-8rem)] lg:h-auto">
						<Suspense
							fallback={
								<div className="flex items-center justify-center min-h-[400px]">
									<Loader2 className="h-8 w-8 animate-spin text-primary" />
								</div>
							}
						>
							<LoginForm />
						</Suspense>

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
			{/* Right Column - Feature Highlights */}

			<div className="bg-muted relative hidden lg:flex lg:flex-col lg:items-center lg:justify-center p-10">
				<div className="max-w-md space-y-8">
					{/* Main Heading */}
					<div className="space-y-4">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
							<Sparkles className="h-8 w-8 text-primary" />
						</div>
						<h2 className="text-4xl font-bold tracking-tight">
							Welcome Back
						</h2>
						<p className="text-muted-foreground text-lg">
							Continue building your perfect resume and land your
							dream job with ResumeCraft.
						</p>
					</div>

					{/* Feature List */}
					<div className="space-y-6 pt-4">
						<div className="flex items-start gap-4">
							<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
								<Zap className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold mb-1">
									Quick Access
								</h3>
								<p className="text-sm text-muted-foreground">
									Pick up right where you left off with
									instant access to all your resumes.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
								<Award className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold mb-1">
									Professional Templates
								</h3>
								<p className="text-sm text-muted-foreground">
									Choose from expertly designed templates
									crafted by hiring professionals.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
								<Shield className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold mb-1">
									Secure & Private
								</h3>
								<p className="text-sm text-muted-foreground">
									Your data is encrypted and protected with
									industry-standard security.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
								<TrendingUp className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold mb-1">
									Land More Interviews
								</h3>
								<p className="text-sm text-muted-foreground">
									Our users report 3x more interview callbacks
									with ResumeCraft resumes.
								</p>
							</div>
						</div>
					</div>

					{/* Benefits Checklist */}
					<div className="pt-6 border-t space-y-3">
						<p className="font-semibold mb-3">Your benefits:</p>
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm">
								<CheckCircle2 className="h-4 w-4 text-primary" />
								<span>Access all your saved resumes</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<CheckCircle2 className="h-4 w-4 text-primary" />
								<span>Continue editing instantly</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<CheckCircle2 className="h-4 w-4 text-primary" />
								<span>Download unlimited PDFs</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<CheckCircle2 className="h-4 w-4 text-primary" />
								<span>Cloud sync across devices</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
