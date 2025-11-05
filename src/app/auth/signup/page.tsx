import { Metadata } from "next";
import { SignupForm } from "@/components/pages/auth/SignupForm";

export const metadata: Metadata = {
	title: "Sign Up | ResumeCraft",
	description: "Create your ResumeCraft account and start building professional resumes",
};

export default function SignupPage() {
	return (
		<div className="min-h-screen flex flex-col">
			{/* Main Content */}
			<main className="flex-1 flex items-center justify-center p-4 bg-muted/30">
				<div className="w-full max-w-md">
					<SignupForm />
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t py-6">
				<div className="container mx-auto px-4">
					<div className="text-center text-sm text-muted-foreground">
						© {new Date().getFullYear()} ResumeCraft. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}

