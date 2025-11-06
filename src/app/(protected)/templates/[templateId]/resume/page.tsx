"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ResumeProvider } from "@/components/providers/resume-form-provider";
import { ResumeStepper } from "@/components/pages/resume-page";

export default function ResumeWithTemplatePage() {
	const params = useParams();
	const router = useRouter();
	const templateId = params.templateId as string;

	return (
		<ResumeProvider initialTemplateId={templateId}>
			<ResumeStepper />
		</ResumeProvider>
	);
}
