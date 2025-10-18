// components/resume/ResumeStepper.tsx
"use client";

import {
	BreadcrumbItem,
	CustomBreadcrumb,
} from "@/components/shared/breadcrumb";
import { SkillsForm } from "./skills";
import { ReviewStep } from "./review";
import { ProjectsForm } from "./projects";
import { EducationForm } from "./educations";
import { ExperienceForm } from "./experience";
import { ResumeMetaForm } from "./resume-meta";
import { AchievementsForm } from "./achivements";
import { PersonalInfoForm } from "./personal-info";
import { CertificationsForm } from "./certifications";
import { useResume } from "@/components/providers/resume-form-provider";

// Update the steps array - add the new first step
const steps = [
	{
		id: 0,
		title: "Resume Details",
		component: ResumeMetaForm, // Use the new component
		description: "Name and describe your resume",
	},
	{
		id: 1,
		title: "Personal Info",
		component: PersonalInfoForm,
		description: "Basic information and contact details",
	},
	{
		id: 2, // Updated from 1 to 2
		title: "Experience",
		component: ExperienceForm,
		description: "Professional work history",
	},
	{
		id: 3, // Updated from 2 to 3
		title: "Education",
		component: EducationForm,
		description: "Academic background",
	},
	{
		id: 4, // Updated from 3 to 4
		title: "Skills",
		component: SkillsForm,
		description: "Technical and soft skills",
	},
	{
		id: 5, // Updated from 4 to 5
		title: "Projects",
		component: ProjectsForm,
		description: "Personal and professional projects",
	},
	{
		id: 6, // Updated from 5 to 6
		title: "Certifications",
		component: CertificationsForm,
		description: "Professional certifications",
	},
	{
		id: 7, // Updated from 6 to 7
		title: "Achievements",
		component: AchievementsForm,
		description: "Awards and recognitions",
	},
	{
		id: 8, // Updated from 7 to 8
		title: "Review",
		component: ReviewStep,
		description: "Final review and download",
	},
];

export function ResumeStepper() {
	const { currentStep, goToStep } = useResume();
	const CurrentComponent = steps[currentStep].component;
	const currentStepData = steps[currentStep];

	// Update breadcrumb items
	const breadcrumbItems: BreadcrumbItem[] = steps.map((step, index) => ({
		id: step.id.toString(),
		label: step.title,
		onClick: index <= currentStep ? () => goToStep(index) : undefined,
		isCurrent: index === currentStep,
		disabled: index > currentStep,
	}));

	return (
		<div className="container h-[calc(100vh-100px)]">
			{/* Page Header */}
			<div className="text-center mt-5">
				<h1 className="text-3xl font-bold tracking-tight mb-3">
					Build Your Professional Resume
				</h1>
				<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
					Create an ATS-friendly resume that stands out. Follow the
					steps below to build your perfect resume.
				</p>
			</div>

			<div className="w-full grid grid-cols-2 gap-5 pb-5">
				<div className="w-full">
					<CustomBreadcrumb
						items={breadcrumbItems}
						maxVisible={4}
						separator="›"
					/>

					<CurrentComponent />
				</div>

				<div className="">{/* Preview panel will go here */}</div>
			</div>
		</div>
	);
}
