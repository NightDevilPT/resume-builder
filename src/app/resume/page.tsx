// app/create-resume/page.tsx
"use client";

import { ResumeStepper } from "@/components/pages/resume-page";
import { ResumeProvider } from "@/components/providers/resume-form-provider";

export default function CreateResumePage() {
	return (
		<main className="w-full h-auto flex justify-center items-center">
			<ResumeProvider totalSteps={9}>
				<ResumeStepper />
			</ResumeProvider>
		</main>
	);
}
