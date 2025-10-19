import {
	FileText,
	User,
	Briefcase,
	GraduationCap,
	Code,
	FolderGit2,
	Award,
	Trophy,
	Lightbulb,
} from "lucide-react";
import { SkillsPage } from "./skills";
import { EducationPage } from "./education";
import { ExperiencePage } from "./experience";
import type { LucideIcon } from "lucide-react";
import { ResumeMetaPage } from "./resume-meta";
import { PersonalInfoPage } from "./personal-info";

export interface StepConfig {
	id: number;
	title: string;
	description: string;
	icon: LucideIcon;
	component: React.ComponentType;
}

export const RESUME_STEPS: StepConfig[] = [
	{
		id: 0,
		title: "Resume Info",
		description: "Name and description",
		icon: FileText,
		component: ResumeMetaPage,
	},
	{
		id: 1,
		title: "Personal Info",
		description: "Contact details",
		icon: User,
		component: PersonalInfoPage,
	},
	{
		id: 2,
		title: "Experience",
		description: "Work history",
		icon: Briefcase,
		component: ExperiencePage,
	},
	{
		id: 3,
		title: "Education",
		description: "Academic background",
		icon: GraduationCap,
		component: EducationPage,
	},
	{
		id: 4,
		title: "Skills",
		description: "Technical & soft skills",
		icon: Code,
		component: SkillsPage,
	},
	{
		id: 5,
		title: "Projects",
		description: "Portfolio projects",
		icon: FolderGit2,
		component: () => <div>Projects Form - Coming Soon</div>,
	},
	{
		id: 6,
		title: "Certifications",
		description: "Professional certifications",
		icon: Award,
		component: () => <div>Certifications Form - Coming Soon</div>,
	},
	{
		id: 7,
		title: "Achievements",
		description: "Notable accomplishments",
		icon: Trophy,
		component: () => <div>Achievements Form - Coming Soon</div>,
	},
	{
		id: 8,
		title: "Review",
		description: "Final review",
		icon: Lightbulb,
		component: () => <div>Review & Export - Coming Soon</div>,
	},
];
