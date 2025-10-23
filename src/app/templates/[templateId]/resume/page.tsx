"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ResumeProvider } from "@/components/providers/resume-form-provider";
import { ResumeStepper } from "@/components/pages/resume-page";
import { templateFactory } from "@/lib/templates/template-factory";

export default function ResumeWithTemplatePage() {
	const params = useParams();
	const router = useRouter();
	const templateId = params.templateId as string;

	const template = templateFactory.getTemplate(templateId);

	if (!template) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Template Not Found</h1>
					<p className="text-gray-600 mb-4">
						The requested template could not be found.
					</p>
					<button
						onClick={() => router.push("/templates")}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						Back to Templates
					</button>
				</div>
			</div>
		);
	}

	return (
		<ResumeProvider initialTemplateId={templateId}>
			<ResumeStepper />
		</ResumeProvider>
	);
}
