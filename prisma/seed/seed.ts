/**
 * Prisma Seed Script
 * Populates database with sample template data
 */

import "dotenv/config";
import * as bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Color Schemes Collection
const COLOR_SCHEMES = [
	{
		name: "Ocean Blue",
		primary: "#2563eb",
		secondary: "#3b82f6",
		accent: "#60a5fa",
		text: "#1e293b",
		textLight: "#64748b",
		background: "#ffffff",
		border: "#e2e8f0",
		link: "#2563eb",
	},
	{
		name: "Forest Green",
		primary: "#059669",
		secondary: "#10b981",
		accent: "#34d399",
		text: "#1f2937",
		textLight: "#6b7280",
		background: "#ffffff",
		border: "#d1d5db",
		link: "#059669",
	},
	{
		name: "Royal Purple",
		primary: "#7c3aed",
		secondary: "#8b5cf6",
		accent: "#a78bfa",
		text: "#1e1b4b",
		textLight: "#64748b",
		background: "#ffffff",
		border: "#e0e7ff",
		link: "#7c3aed",
	},
	{
		name: "Sunset Orange",
		primary: "#ea580c",
		secondary: "#f97316",
		accent: "#fb923c",
		text: "#292524",
		textLight: "#78716c",
		background: "#ffffff",
		border: "#e7e5e4",
		link: "#ea580c",
	},
	{
		name: "Midnight Dark",
		primary: "#0f172a",
		secondary: "#1e293b",
		accent: "#334155",
		text: "#0f172a",
		textLight: "#64748b",
		background: "#ffffff",
		border: "#cbd5e1",
		link: "#0f172a",
	},
	{
		name: "Ruby Red",
		primary: "#dc2626",
		secondary: "#ef4444",
		accent: "#f87171",
		text: "#1f2937",
		textLight: "#6b7280",
		background: "#ffffff",
		border: "#e5e7eb",
		link: "#dc2626",
	},
	{
		name: "Teal Fresh",
		primary: "#0d9488",
		secondary: "#14b8a6",
		accent: "#5eead4",
		text: "#134e4a",
		textLight: "#6b7280",
		background: "#ffffff",
		border: "#d1d5db",
		link: "#0d9488",
	},
	{
		name: "Lavender Dream",
		primary: "#a855f7",
		secondary: "#c084fc",
		accent: "#d8b4fe",
		text: "#4c1d95",
		textLight: "#6b7280",
		background: "#ffffff",
		border: "#e9d5ff",
		link: "#a855f7",
	},
];

// Layout Types
const LAYOUTS = [
	{
		type: "single-column" as const,
		columnRatio: undefined,
		threeColumnRatio: undefined,
		gap: "1.5rem",
		sections: [
			{
				type: "personal-info" as const,
				position: "full-width" as const,
				order: 0,
				visibility: true,
				required: true,
			},
			{
				type: "experience" as const,
				position: "full-width" as const,
				order: 1,
				visibility: true,
				required: false,
			},
			{
				type: "education" as const,
				position: "full-width" as const,
				order: 2,
				visibility: true,
				required: false,
			},
			{
				type: "skills" as const,
				position: "full-width" as const,
				order: 3,
				visibility: true,
				required: false,
			},
			{
				type: "projects" as const,
				position: "full-width" as const,
				order: 4,
				visibility: true,
				required: false,
			},
			{
				type: "certifications" as const,
				position: "full-width" as const,
				order: 5,
				visibility: true,
				required: false,
			},
			{
				type: "achievements" as const,
				position: "full-width" as const,
				order: 6,
				visibility: true,
				required: false,
			},
		],
	},
	{
		type: "two-column-equal" as const,
		columnRatio: { left: 50, right: 50 },
		gap: "2rem",
		sections: [
			{
				type: "personal-info" as const,
				position: "full-width" as const,
				order: 0,
				visibility: true,
				required: true,
			},
			{
				type: "experience" as const,
				position: "left" as const,
				order: 1,
				visibility: true,
				required: false,
			},
			{
				type: "education" as const,
				position: "left" as const,
				order: 2,
				visibility: true,
				required: false,
			},
			{
				type: "skills" as const,
				position: "right" as const,
				order: 1,
				visibility: true,
				required: false,
			},
			{
				type: "projects" as const,
				position: "right" as const,
				order: 2,
				visibility: true,
				required: false,
			},
			{
				type: "certifications" as const,
				position: "right" as const,
				order: 3,
				visibility: true,
				required: false,
			},
		],
	},
	{
		type: "two-column-left-heavy" as const,
		columnRatio: { left: 65, right: 35 },
		gap: "1.5rem",
		sections: [
			{
				type: "personal-info" as const,
				position: "full-width" as const,
				order: 0,
				visibility: true,
				required: true,
			},
			{
				type: "experience" as const,
				position: "left" as const,
				order: 1,
				visibility: true,
				required: false,
			},
			{
				type: "education" as const,
				position: "left" as const,
				order: 2,
				visibility: true,
				required: false,
			},
			{
				type: "projects" as const,
				position: "left" as const,
				order: 3,
				visibility: true,
				required: false,
			},
			{
				type: "skills" as const,
				position: "right" as const,
				order: 1,
				visibility: true,
				required: false,
			},
			{
				type: "certifications" as const,
				position: "right" as const,
				order: 2,
				visibility: true,
				required: false,
			},
			{
				type: "achievements" as const,
				position: "right" as const,
				order: 3,
				visibility: true,
				required: false,
			},
		],
	},
	{
		type: "two-column-right-heavy" as const,
		columnRatio: { left: 35, right: 65 },
		gap: "1.5rem",
		sections: [
			{
				type: "personal-info" as const,
				position: "full-width" as const,
				order: 0,
				visibility: true,
				required: true,
			},
			{
				type: "skills" as const,
				position: "left" as const,
				order: 1,
				visibility: true,
				required: false,
			},
			{
				type: "certifications" as const,
				position: "left" as const,
				order: 2,
				visibility: true,
				required: false,
			},
			{
				type: "achievements" as const,
				position: "left" as const,
				order: 3,
				visibility: true,
				required: false,
			},
			{
				type: "experience" as const,
				position: "right" as const,
				order: 1,
				visibility: true,
				required: false,
			},
			{
				type: "education" as const,
				position: "right" as const,
				order: 2,
				visibility: true,
				required: false,
			},
			{
				type: "projects" as const,
				position: "right" as const,
				order: 3,
				visibility: true,
				required: false,
			},
		],
	},
	{
		type: "three-column" as const,
		threeColumnRatio: [25, 50, 25] as [number, number, number],
		gap: "1rem",
		sections: [
			{
				type: "personal-info" as const,
				position: "full-width" as const,
				order: 0,
				visibility: true,
				required: true,
			},
			{
				type: "skills" as const,
				position: "left" as const,
				order: 1,
				visibility: true,
				required: false,
			},
			{
				type: "experience" as const,
				position: "center" as const,
				order: 1,
				visibility: true,
				required: false,
			},
			{
				type: "education" as const,
				position: "center" as const,
				order: 2,
				visibility: true,
				required: false,
			},
			{
				type: "projects" as const,
				position: "center" as const,
				order: 3,
				visibility: true,
				required: false,
			},
			{
				type: "certifications" as const,
				position: "right" as const,
				order: 1,
				visibility: true,
				required: false,
			},
			{
				type: "achievements" as const,
				position: "right" as const,
				order: 2,
				visibility: true,
				required: false,
			},
		],
	},
];

// Typography Presets
const TYPOGRAPHY_PRESETS = [
	{
		headingFont: "Geist",
		bodyFont: "Geist",
		nameSize: "3xl",
		nameWeight: "bold" as const,
		headingSize: "xl",
		headingWeight: "bold" as const,
		headingUppercase: false,
		headingUnderline: true,
		subheadingSize: "base",
		subheadingWeight: "semibold" as const,
		lineHeight: "normal",
		showIcons: true,
		showDividers: true,
	},
	{
		headingFont: "Inter",
		bodyFont: "Inter",
		nameSize: "4xl",
		nameWeight: "bold" as const,
		headingSize: "lg",
		headingWeight: "semibold" as const,
		headingUppercase: true,
		headingUnderline: false,
		subheadingSize: "sm",
		subheadingWeight: "medium" as const,
		lineHeight: "relaxed",
		showIcons: false,
		showDividers: true,
	},
	{
		headingFont: "Roboto",
		bodyFont: "Roboto",
		nameSize: "3xl",
		nameWeight: "bold" as const,
		headingSize: "xl",
		headingWeight: "bold" as const,
		headingUppercase: false,
		headingUnderline: false,
		subheadingSize: "base",
		subheadingWeight: "medium" as const,
		lineHeight: "normal",
		showIcons: true,
		showDividers: false,
	},
	{
		headingFont: "Playfair Display",
		bodyFont: "Open Sans",
		nameSize: "4xl",
		nameWeight: "bold" as const,
		headingSize: "2xl",
		headingWeight: "bold" as const,
		headingUppercase: false,
		headingUnderline: true,
		subheadingSize: "lg",
		subheadingWeight: "semibold" as const,
		lineHeight: "relaxed",
		showIcons: false,
		showDividers: true,
	},
];

// Skill Display Formats
const SKILL_FORMATS = [
	"bars",
	"dots",
	"percentage",
	"text",
	"stars",
	"badge-level",
	"list",
	"chips",
	"circles",
];

const SAMPLE_USERS = [
	{
		firstName: "Ava",
		lastName: "Williams",
		userName: "ava.williams",
		email: "ava.williams@example.com",
		password: "User@123",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ava",
		bio: "Product-focused full stack engineer passionate about crafting delightful user journeys.",
		location: "Austin, TX",
	},
	{
		firstName: "Noah",
		lastName: "Patel",
		userName: "noah.patel",
		email: "noah.patel@example.com",
		password: "User@123",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noah",
		bio: "Data scientist who loves making insights actionable.",
		location: "San Francisco, CA",
	},
	{
		firstName: "Liam",
		lastName: "Martinez",
		userName: "liam.martinez",
		email: "liam.martinez@example.com",
		password: "User@123",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=liam",
		bio: "Sales leader helping teams close faster with tech.",
		location: "Chicago, IL",
	},
	{
		firstName: "Mia",
		lastName: "Chen",
		userName: "mia.chen",
		email: "mia.chen@example.com",
		password: "User@123",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mia",
		bio: "Creative director blending storytelling with bold visuals.",
		location: "New York, NY",
	},
	{
		firstName: "Ethan",
		lastName: "Johnson",
		userName: "ethan.johnson",
		email: "ethan.johnson@example.com",
		password: "User@123",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ethan",
		bio: "DevOps engineer automating cloud infrastructure at scale.",
		location: "Seattle, WA",
	},
	{
		firstName: "Sophia",
		lastName: "Garcia",
		userName: "sophia.garcia",
		email: "sophia.garcia@example.com",
		password: "User@123",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
		bio: "HR specialist helping candidates put their best foot forward.",
		location: "Remote",
	},
];

type ResumeJson = {
	name: string;
	description: string;
	personalInfo: {
		fullName: string;
		email: string;
		phone: string;
		location: string;
		website: string;
		links: Array<{ label: string; url: string }>;
		summary: string;
	};
	experience: Array<{
		id: string;
		order: number;
		jobTitle: string;
		company: string;
		location: string;
		startDate: Date;
		endDate?: Date;
		currentlyWorking: boolean;
		description: string;
		achievements: string[];
		skillsUsed: string[];
	}>;
	education: Array<{
		id: string;
		order: number;
		degree: string;
		institution: string;
		location: string;
		startDate: Date;
		endDate?: Date;
		currentlyStudying: boolean;
		gradeType: "gpa" | "cgpa" | "percentage" | "grade" | "none";
		gradeValue: string;
		achievements: string[];
		coursework: string[];
	}>;
	skills: {
		technical: Array<{ name: string; level: number }>;
		soft: Array<{ name: string; level: number }>;
		languages: Array<{ language: string; proficiency: "Native" | "Fluent" | "Professional" | "Basic" }>;
	};
	projects: Array<{
		id: string;
		order: number;
		name: string;
		subtitle?: string;
		description?: string;
		technologies: string[];
		links: Array<{ label: string; url: string }>;
		startDate: Date;
		endDate?: Date;
		currentlyWorking: boolean;
		highlights: string[];
	}>;
	certifications: Array<{
		id: string;
		order: number;
		name: string;
		issuingOrganization: string;
		issueDate: Date;
		expirationDate?: Date;
		doesNotExpire: boolean;
		credentialUrl: string;
	}>;
	achievements: Array<{
		id: string;
		order: number;
		title: string;
		issuer: string;
		date: Date;
		description: string;
	}>;
};

const toJson = <T>(value: T): T =>
	JSON.parse(
		JSON.stringify(value, (_key, val) =>
			val instanceof Date ? val.toISOString() : val
		)
	);

const generateResumeData = (
	user: { firstName: string; lastName: string; email: string; userName: string },
	template: any
): ResumeJson => {
	const profile = randomFrom(CAREER_PROFILES);
	const fullName = `${user.firstName} ${user.lastName}`;
	const sanitizedHandle = sanitizeHandle(user.userName);
	const nameSlug = slugify(fullName);
	const location = randomFrom(profile.locations);
	const resumeTitle = randomFrom(profile.preferredTitles);
	const linkTemplates = pickSome(
		profile.linkTemplates,
		Math.min(2, profile.linkTemplates.length),
		profile.linkTemplates.length
	);
	const links = linkTemplates.map((link) => ({
		label: link.label,
		url: applyPlaceholders(link.url, {
			username: sanitizedHandle,
			nameSlug,
		}),
	}));
	const website =
		links.find((link) => link.label.toLowerCase().includes("portfolio"))?.
			url ?? links[0]?.url ?? `https://${nameSlug}.com`;

	const experiencesTemplates = pickSome(
		profile.experiences,
		Math.min(2, profile.experiences.length),
		Math.min(4, profile.experiences.length)
	).sort((a, b) => a.startOffsetYears - b.startOffsetYears);
	const experiences = mapWithOrder(experiencesTemplates, (exp, order) =>
		buildExperience(exp, order)
	);

	const educationTemplates = pickSome(
		profile.education,
		1,
		profile.education.length
	).sort((a, b) => a.startOffsetYears - b.startOffsetYears);
	const education = mapWithOrder(educationTemplates, (edu, order) =>
		buildEducation(edu, order)
	);

	const technicalSkills = pickSome(
		profile.technicalSkills,
		Math.min(4, profile.technicalSkills.length),
		Math.min(8, profile.technicalSkills.length)
	);
	const softSkills = pickSome(
		profile.softSkills,
		Math.min(3, profile.softSkills.length),
		Math.min(6, profile.softSkills.length)
	);
	const languages = pickSome(
		profile.languages,
		Math.min(1, profile.languages.length),
		profile.languages.length
	);

	const projectsTemplates = pickSome(
		profile.projects,
		1,
		Math.min(3, profile.projects.length)
	).sort((a, b) => a.startOffsetYears - b.startOffsetYears);
	const projects = mapWithOrder(projectsTemplates, (proj, order) =>
		buildProject(proj, order, sanitizedHandle, nameSlug)
	);

	const certificationsTemplates = pickSome(
		profile.certifications,
		0,
		Math.min(2, profile.certifications.length)
	);
	const certifications = mapWithOrder(
		certificationsTemplates,
		(cert, order) => buildCertification(cert, order, sanitizedHandle)
	);

	const achievementsTemplates = pickSome(
		profile.achievements,
		1,
		Math.min(3, profile.achievements.length)
	).sort((a, b) => a.dateOffsetYears - b.dateOffsetYears);
	const achievements = mapWithOrder(achievementsTemplates, (ach, order) =>
		buildAchievement(ach, order)
	);

	const summary = applyPlaceholders(profile.summary, {
		name: fullName,
		role: profile.role,
	});
	const description = applyPlaceholders(profile.resumeDescription, {
		name: fullName,
		role: profile.role,
		template: template.name,
	});

	const phone = `+1 (555) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`;

	return {
		name: `${fullName} — ${resumeTitle}`,
		description,
		personalInfo: {
			fullName,
			email: user.email,
			phone,
			location,
			website,
			links,
			summary,
		},
		experience: experiences,
		education,
		skills: {
			technical: technicalSkills,
			soft: softSkills,
			languages,
		},
		projects,
		certifications,
		achievements,
	};
};

type SeededUser = { email: string; userName: string; password: string };

async function createSampleUsersWithResumes(templates: any[]) {
	const seededUsers: SeededUser[] = [];
	let totalResumesCreated = 0;

	for (const sample of SAMPLE_USERS) {
		const hashedPassword = await bcrypt.hash(sample.password, 10);
		const user = await prisma.user.create({
			data: {
				firstName: sample.firstName,
				lastName: sample.lastName,
				userName: sample.userName,
				email: sample.email,
				password: hashedPassword,
				avatar: sample.avatar,
				bio: sample.bio,
				phone: "+1 (555) 010-9999",
				emailVerified: true,
				isActive: true,
				isBanned: false,
				role: "user",
				lastLoginAt: new Date(),
			},
		});

		seededUsers.push({ email: user.email, userName: user.userName, password: sample.password });

		const resumeCountForUser = randomInt(1, 3);
		const usedTemplateIds = new Set<string>();

		for (let i = 0; i < resumeCountForUser; i++) {
			const template = randomFrom(templates);
			usedTemplateIds.add(template.id);

			const resumeData = generateResumeData(
				{
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					userName: user.userName,
				},
				template
			);
			const resumeJson = toJson(resumeData);
			const templateSnapshot = toJson(template);

			await prisma.resume.create({
				data: {
					userId: user.id,
					templateId: template.id,
					name: resumeData.name,
					description: resumeData.description,
					data: resumeJson,
					templateConfig: templateSnapshot,
					templateVersion:
						template.updatedAt instanceof Date
							? template.updatedAt.toISOString()
							: new Date().toISOString(),
					isPublic: randomBool(),
				},
			});

			await prisma.template.update({
				where: { id: template.id },
				data: {
					usageCount: {
						increment: 1,
					},
				},
			});

			totalResumesCreated += 1;
		}

		console.log(
			`👤 Seeded user ${user.email} with ${resumeCountForUser} resume(s) using ${usedTemplateIds.size} unique template(s).`
		);
	}

	return { seededUsers, totalResumesCreated };
}

// Template Names and Descriptions
const TEMPLATE_DATA = [
	{
		name: "Professional Executive",
		description:
			"Clean and executive-level resume template perfect for senior positions",
		categories: ["professional", "modern", "executive"],
	},
	{
		name: "Creative Designer",
		description:
			"Bold and creative template ideal for designers and creative professionals",
		categories: ["creative", "bold", "design"],
	},
	{
		name: "Tech Minimalist",
		description:
			"Minimal and modern template for software engineers and tech professionals",
		categories: ["minimal", "modern", "tech"],
	},
	{
		name: "Classic Elegance",
		description:
			"Timeless classic design suitable for traditional industries",
		categories: ["classic", "professional", "traditional"],
	},
	{
		name: "Bold Innovator",
		description: "Stand out with this bold and innovative resume design",
		categories: ["bold", "creative", "modern"],
	},
	{
		name: "Modern Professional",
		description: "Contemporary professional design with clean lines",
		categories: ["modern", "professional", "clean"],
	},
	{
		name: "Academic Scholar",
		description: "Perfect template for academics and researchers",
		categories: ["classic", "academic", "formal"],
	},
	{
		name: "Startup Hustler",
		description:
			"Dynamic template for entrepreneurs and startup professionals",
		categories: ["modern", "bold", "startup"],
	},
	{
		name: "Financial Analyst",
		description: "Professional template tailored for finance professionals",
		categories: ["professional", "classic", "finance"],
	},
	{
		name: "Marketing Guru",
		description:
			"Eye-catching design for marketing and communications roles",
		categories: ["creative", "modern", "marketing"],
	},
	{
		name: "Engineering Pro",
		description: "Technical and structured template for engineers",
		categories: ["professional", "minimal", "tech"],
	},
	{
		name: "Healthcare Professional",
		description: "Clean and trustworthy design for medical professionals",
		categories: ["professional", "clean", "healthcare"],
	},
	{
		name: "Legal Expert",
		description:
			"Traditional and authoritative template for legal professionals",
		categories: ["classic", "professional", "legal"],
	},
	{
		name: "Sales Champion",
		description: "Results-focused template for sales professionals",
		categories: ["modern", "bold", "sales"],
	},
	{
		name: "Data Scientist",
		description: "Analytical and modern design for data professionals",
		categories: ["modern", "minimal", "tech"],
	},
	{
		name: "Product Manager",
		description: "Strategic template showcasing product leadership",
		categories: ["professional", "modern", "product"],
	},
	{
		name: "Consulting Expert",
		description: "Premium template for consulting professionals",
		categories: ["professional", "executive", "consulting"],
	},
	{
		name: "Digital Nomad",
		description: "Flexible template for remote workers and freelancers",
		categories: ["modern", "creative", "freelance"],
	},
	{
		name: "Executive Leader",
		description: "Premium executive template for C-level positions",
		categories: ["executive", "professional", "leadership"],
	},
	{
		name: "Fresh Graduate",
		description:
			"Perfect template for recent graduates and entry-level roles",
		categories: ["modern", "minimal", "entry-level"],
	},
];

// Helper: Random selection from array
const randomFrom = <T>(arr: T[]): T =>
	arr[Math.floor(Math.random() * arr.length)];

// Helper: Random boolean
const randomBool = () => Math.random() > 0.5;

// Helper: Random integer between min and max
const randomInt = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const monthsAgo = (months: number) => {
	const date = new Date();
	date.setMonth(date.getMonth() - months);
	return date;
};

const yearsAgo = (years: number) => monthsAgo(Math.round(years * 12));

const yearsFromNow = (years: number) => {
	const date = new Date();
	date.setMonth(date.getMonth() + Math.round(years * 12));
	return date;
};

const slugify = (value: string) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const sanitizeHandle = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const applyPlaceholders = (template: string, replacements: Record<string, string>) =>
	Object.entries(replacements).reduce(
		(result, [key, val]) =>
			result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "gi"), val),
		template
	);

const pickSome = <T>(array: T[], min = 1, max = array.length): T[] => {
	if (array.length === 0 || max <= 0) {
		return [];
	}
	const actualMin = Math.max(0, Math.min(min, array.length));
	const actualMax = Math.max(actualMin, Math.min(max, array.length));
	const count =
		actualMax === actualMin ? actualMin : randomInt(actualMin, actualMax);
	const pool = [...array];
	const result: T[] = [];
	while (result.length < count && pool.length) {
		const index = randomInt(0, pool.length - 1);
		result.push(pool.splice(index, 1)[0]);
	}
	return result;
};

const mapWithOrder = <T, R>(items: T[], transform: (item: T, order: number) => R): R[] =>
	items.map((item, index) => transform(item, index));

type LinkTemplate = { label: string; url: string };
type SkillTemplate = { name: string; level: number };
type LanguageTemplate = {
	language: string;
	proficiency: "Native" | "Fluent" | "Professional" | "Basic";
};
type ExperienceTemplate = {
	jobTitle: string;
	company: string;
	location: string;
	startOffsetYears: number;
	endOffsetYears?: number;
	currentlyWorking?: boolean;
	description: string;
	achievements: string[];
	skillsUsed: string[];
};
type EducationTemplate = {
	degree: string;
	institution: string;
	location: string;
	startOffsetYears: number;
	endOffsetYears: number;
	currentlyStudying?: boolean;
	gradeType: "gpa" | "cgpa" | "percentage" | "grade" | "none";
	gradeValue: string;
	achievements: string[];
	coursework: string[];
};
type ProjectTemplate = {
	name: string;
	subtitle?: string;
	description?: string;
	technologies: string[];
	links: LinkTemplate[];
	startOffsetYears: number;
	endOffsetYears?: number;
	currentlyWorking?: boolean;
	highlights: string[];
};
type CertificationTemplate = {
	name: string;
	issuingOrganization: string;
	issueOffsetYears: number;
	expiryYearsFromNow?: number;
	doesNotExpire?: boolean;
	credentialUrl: string;
};
type AchievementTemplate = {
	title: string;
	issuer: string;
	dateOffsetYears: number;
	description: string;
};
type CareerProfile = {
	role: string;
	summary: string;
	resumeDescription: string;
	preferredTitles: string[];
	locations: string[];
	linkTemplates: LinkTemplate[];
	experiences: ExperienceTemplate[];
	education: EducationTemplate[];
	technicalSkills: SkillTemplate[];
	softSkills: SkillTemplate[];
	languages: LanguageTemplate[];
	projects: ProjectTemplate[];
	certifications: CertificationTemplate[];
	achievements: AchievementTemplate[];
};

const CAREER_PROFILES: CareerProfile[] = [
	{
		role: "Full Stack Developer",
		summary:
			"{{name}} is a {{role}} shipping resilient web platforms, mentoring engineers, and driving measurable product impact.",
		resumeDescription:
			"This {{role}} resume for {{name}} leverages the {{template}} template to highlight architecture leadership, product velocity, and mentoring wins.",
		preferredTitles: [
			"Full Stack Developer Resume",
			"Senior Software Engineer CV",
			"Staff Engineer Portfolio",
		],
		locations: ["Austin, TX", "Seattle, WA", "Denver, CO", "Remote"],
		linkTemplates: [
			{ label: "LinkedIn", url: "https://linkedin.com/in/{{username}}" },
			{ label: "GitHub", url: "https://github.com/{{username}}" },
			{ label: "Portfolio", url: "https://{{nameSlug}}.dev" },
		],
		experiences: [
			{
				jobTitle: "Lead Full Stack Engineer",
				company: "LuminaTech Labs",
				location: "Remote",
				startOffsetYears: 1.5,
				currentlyWorking: true,
				description:
					"Guiding a cross-functional squad modernizing onboarding across web and mobile surfaces.",
				achievements: [
					"Rolled out customer onboarding flows that boosted activation by 32%.",
					"Introduced a shared component library now used across five product lines.",
				],
				skillsUsed: ["TypeScript", "React", "Node.js", "GraphQL", "AWS"],
			},
			{
				jobTitle: "Full Stack Developer",
				company: "Atlas Innovations",
				location: "Seattle, WA",
				startOffsetYears: 4.2,
				endOffsetYears: 1.8,
				description:
					"Delivered growth experiments and analytics dashboards for self-serve customers.",
				achievements: [
					"Partnered with marketing to release experimentation tooling adopted by 12 teams.",
					"Reduced build times by 40% through webpack and CI optimizations.",
				],
				skillsUsed: ["Next.js", "PostgreSQL", "Redis", "Kubernetes"],
			},
			{
				jobTitle: "Software Engineer",
				company: "Horizon Apps",
				location: "Denver, CO",
				startOffsetYears: 7.5,
				endOffsetYears: 4.3,
				description:
					"Built customer-facing experiences and platform APIs for subscription products.",
				achievements: [
					"Launched billing integrations powering $12M ARR.",
					"Embedded with support org to drive 25% decrease in ticket volume via tooling.",
				],
				skillsUsed: ["React", "Express", "MongoDB", "Docker"],
			},
		],
		education: [
			{
				degree: "B.S. in Computer Science",
				institution: "University of Washington",
				location: "Seattle, WA",
				startOffsetYears: 10.5,
				endOffsetYears: 6.5,
				gradeType: "gpa",
				gradeValue: "3.7",
				achievements: ["Dean's List (6 semesters)", "ACM Programming Team"],
				coursework: [
					"Distributed Systems",
					"Databases",
					"Human-Computer Interaction",
					"Operating Systems",
				],
			},
			{
				degree: "Full Stack Engineering Certificate",
				institution: "CodePath",
				location: "Seattle, WA",
				startOffsetYears: 6.2,
				endOffsetYears: 5.7,
				gradeType: "percentage",
				gradeValue: "96",
				achievements: ["Capstone project top score"],
				coursework: ["React", "Node.js", "Cloud Architecture"],
			},
		],
		technicalSkills: [
			{ name: "TypeScript", level: 9 },
			{ name: "React", level: 9 },
			{ name: "Node.js", level: 8 },
			{ name: "GraphQL", level: 8 },
			{ name: "AWS", level: 7 },
			{ name: "PostgreSQL", level: 7 },
			{ name: "Docker", level: 7 },
			{ name: "CI/CD", level: 8 },
		],
		softSkills: [
			{ name: "Team Leadership", level: 8 },
			{ name: "Communication", level: 9 },
			{ name: "Mentorship", level: 8 },
			{ name: "Problem Solving", level: 9 },
			{ name: "Cross-functional Collaboration", level: 8 },
		],
		languages: [
			{ language: "English", proficiency: "Native" },
			{ language: "Spanish", proficiency: "Professional" },
		],
		projects: [
			{
				name: "Subscription Analytics Platform",
				subtitle: "Self-serve dashboards",
				description:
					"Built real-time analytics for growth teams to monitor lifecycle metrics end-to-end.",
				technologies: ["Next.js", "Supabase", "Tailwind CSS"],
				links: [
					{ label: "Demo", url: "https://demo.{{nameSlug}}.app" },
					{ label: "Case Study", url: "https://{{nameSlug}}.dev/case-study" },
				],
				startOffsetYears: 2.2,
				currentlyWorking: true,
				highlights: [
					"Implemented row-level security to support 5k MAU without performance regressions.",
					"Partnered with design to reach WCAG AA accessibility compliance in a single quarter.",
				],
			},
			{
				name: "Design System Refresh",
				subtitle: "Component library modernization",
				description:
					"Led a squad rebuilding UI primitives with Storybook, design tokens, and testing harnesses.",
				technologies: ["Storybook", "Stitches", "Jest"],
				links: [{ label: "Docs", url: "https://design.{{nameSlug}}.dev" }],
				startOffsetYears: 3.8,
				endOffsetYears: 2.4,
				highlights: [
					"Reduced new feature build time by 30% after rollout.",
					"Shipped accessibility linting integrated into CI pipelines.",
				],
			},
			{
				name: "Event-Driven Checkout",
				description:
					"Implemented async checkout microservices processing thousands of orders per minute.",
				technologies: ["Node.js", "Kafka", "PostgreSQL"],
				links: [{ label: "Architecture", url: "https://{{nameSlug}}.dev/architecture" }],
				startOffsetYears: 5.2,
				endOffsetYears: 3.6,
				highlights: [
					"Achieved 99.95% availability during holiday peak.",
					"Cut payment failures by 18% via observability playbooks.",
				],
			},
		],
		certifications: [
			{
				name: "AWS Certified Developer – Associate",
				issuingOrganization: "Amazon Web Services",
				issueOffsetYears: 1.3,
				expiryYearsFromNow: 2,
				credentialUrl: "https://aws.amazon.com/verification/{{username}}",
			},
			{
				name: "Google Cloud Professional Cloud Architect",
				issuingOrganization: "Google Cloud",
				issueOffsetYears: 2.8,
				expiryYearsFromNow: 1,
				credentialUrl: "https://google.com/cloud/certification/{{username}}",
			},
		],
		achievements: [
			{
				title: "Speaker – JSNation Conference",
				issuer: "JSNation",
				dateOffsetYears: 1,
				description:
					"Delivered a talk on building resilient design systems viewed by 2k+ attendees.",
			},
			{
				title: "Hackathon Champion",
				issuer: "Node Summit",
				dateOffsetYears: 2.2,
				description:
					"Led a team of five to build a predictive analytics service in 36 hours, earning first place.",
			},
			{
				title: "Mentor of the Year",
				issuer: "LuminaTech Labs",
				dateOffsetYears: 0.7,
				description:
					"Recognized for launching an internal mentorship program adopted by 40+ engineers.",
			},
		],
	},
	{
		role: "Data Analyst",
		summary:
			"{{name}} is a {{role}} translating complex data into narratives business leaders act on.",
		resumeDescription:
			"The {{template}} template showcases {{name}}'s {{role}} journey—spotlighting experimentation wins, forecasting accuracy, and cross-team storytelling.",
		preferredTitles: [
			"Senior Data Analyst Resume",
			"Business Intelligence Analyst CV",
			"Analytics Consultant Portfolio",
		],
		locations: ["New York, NY", "Chicago, IL", "Boston, MA", "Remote"],
		linkTemplates: [
			{ label: "LinkedIn", url: "https://linkedin.com/in/{{username}}" },
			{ label: "Portfolio", url: "https://{{nameSlug}}.analytics" },
			{ label: "Medium", url: "https://medium.com/@{{username}}" },
			{ label: "GitHub", url: "https://github.com/{{username}}" },
		],
		experiences: [
			{
				jobTitle: "Senior Data Analyst",
				company: "InsightIQ",
				location: "New York, NY",
				startOffsetYears: 1.8,
				currentlyWorking: true,
				description: "Owns product analytics for subscription growth initiatives.",
				achievements: [
					"Designed experimentation pipeline increasing feature adoption by 18%.",
					"Built revenue forecasting models adopted by finance and product leadership.",
				],
				skillsUsed: ["SQL", "Python", "dbt", "Looker"],
			},
			{
				jobTitle: "Data Analyst",
				company: "Vista Retail Group",
				location: "Boston, MA",
				startOffsetYears: 4.5,
				endOffsetYears: 1.9,
				description: "Analyzed omnichannel initiatives and loyalty program efficacy.",
				achievements: [
					"Launched KPI dashboards for 500+ store managers.",
					"Identified assortment opportunities adding $3.2M quarterly revenue.",
				],
				skillsUsed: ["Tableau", "Snowflake", "R", "Excel"],
			},
			{
				jobTitle: "Business Intelligence Analyst",
				company: "Brightline Media",
				location: "Chicago, IL",
				startOffsetYears: 7.8,
				endOffsetYears: 4.6,
				description: "Delivered advertiser dashboards and campaign reporting.",
				achievements: [
					"Automated weekly reporting, saving 120 analyst hours per quarter.",
					"Developed churn models reducing client attrition by 9%.",
				],
				skillsUsed: ["Power BI", "SQL", "Python"],
			},
		],
		education: [
			{
				degree: "M.S. in Data Analytics",
				institution: "Northeastern University",
				location: "Boston, MA",
				startOffsetYears: 5.8,
				endOffsetYears: 3.5,
				gradeType: "gpa",
				gradeValue: "3.9",
				achievements: ["Graduate Research Fellow", "Published capstone on demand forecasting"],
				coursework: ["Machine Learning", "Data Mining", "Advanced SQL"],
			},
			{
				degree: "B.S. in Economics",
				institution: "Boston College",
				location: "Chestnut Hill, MA",
				startOffsetYears: 9.5,
				endOffsetYears: 5.9,
				gradeType: "gpa",
				gradeValue: "3.6",
				achievements: ["Economics Honor Society", "Analytics Club President"],
				coursework: ["Econometrics", "Statistics", "Financial Modeling"],
			},
		],
		technicalSkills: [
			{ name: "SQL", level: 9 },
			{ name: "Python", level: 8 },
			{ name: "Tableau", level: 9 },
			{ name: "Power BI", level: 8 },
			{ name: "dbt", level: 7 },
			{ name: "Snowflake", level: 7 },
			{ name: "R", level: 7 },
			{ name: "Airflow", level: 6 },
		],
		softSkills: [
			{ name: "Stakeholder Communication", level: 9 },
			{ name: "Storytelling", level: 8 },
			{ name: "Problem Solving", level: 9 },
			{ name: "Experimentation", level: 8 },
			{ name: "Collaboration", level: 8 },
		],
		languages: [
			{ language: "English", proficiency: "Native" },
			{ language: "Mandarin", proficiency: "Professional" },
		],
		projects: [
			{
				name: "Marketing Attribution Model",
				description:
					"Built multi-touch attribution to understand marketing efficiency across paid channels.",
				technologies: ["Python", "dbt", "Looker"],
				links: [{ label: "Notebook", url: "https://github.com/{{username}}/attribution" }],
				startOffsetYears: 1.9,
				endOffsetYears: 1.2,
				highlights: [
					"Surface insights that reallocated $1.1M in budget to high-yield campaigns.",
					"Implemented confidence intervals for executive reporting.",
				],
			},
			{
				name: "Inventory Forecasting",
				subtitle: "Time-series modeling",
				description:
					"Created seasonal demand forecasts for 300+ SKU categories.",
				technologies: ["Python", "Prophet", "SQL"],
				links: [{ label: "Presentation", url: "https://{{nameSlug}}.analytics/forecast" }],
				startOffsetYears: 3.2,
				endOffsetYears: 2.4,
				highlights: [
					"Reduced stockouts by 14% within first two quarters.",
					"Provided scenario planning slider for commercial teams.",
				],
			},
			{
				name: "Executive KPI Dashboard",
				technologies: ["Power BI", "SQL"],
				links: [{ label: "Demo", url: "https://demo.{{nameSlug}}.analytics" }],
				startOffsetYears: 4.8,
				endOffsetYears: 3.6,
				highlights: [
					"Standardized reporting for C-suite with refresh under 5 minutes.",
					"Implemented role-based access for finance and operations stakeholders.",
				],
			},
		],
		certifications: [
			{
				name: "Google Data Analytics Professional Certificate",
				issuingOrganization: "Google",
				issueOffsetYears: 2.5,
				doesNotExpire: true,
				credentialUrl: "https://www.coursera.org/account/accomplishments/professional-cert/{{username}}",
			},
			{
				name: "Tableau Desktop Certified Professional",
				issuingOrganization: "Tableau",
				issueOffsetYears: 1.1,
				expiryYearsFromNow: 1.5,
				credentialUrl: "https://www.credly.com/badges/{{username}}",
			},
		],
		achievements: [
			{
				title: "Analytics Summit Winner",
				issuer: "Data Heroes Summit",
				dateOffsetYears: 1.4,
				description:
					"Awarded first place for presenting actionable insights that improved conversion by 7%.",
			},
			{
				title: "Employee Spotlight",
				issuer: "InsightIQ",
				dateOffsetYears: 0.6,
				description:
					"Recognized for building self-serve analysis enablement playbooks used by 80+ employees.",
			},
			{
				title: "Mentor – Women in Analytics",
				issuer: "Women in Analytics",
				dateOffsetYears: 2,
				description: "Mentored early-career analysts through SQL and dashboarding bootcamps.",
			},
		],
	},
	{
		role: "Product Manager",
		summary:
			"{{name}} is a {{role}} translating customer research into roadmap bets that drive growth.",
		resumeDescription:
			"This {{role}} resume produced with {{template}} underscores discovery rigor, stakeholder leadership, and business outcomes for {{name}}.",
		preferredTitles: [
			"Senior Product Manager Resume",
			"Product Lead CV",
			"Group PM Portfolio",
		],
		locations: ["San Francisco, CA", "Los Angeles, CA", "Remote", "Austin, TX"],
		linkTemplates: [
			{ label: "LinkedIn", url: "https://linkedin.com/in/{{username}}" },
			{ label: "Portfolio", url: "https://{{nameSlug}}.product" },
			{ label: "Medium", url: "https://medium.com/@{{username}}" },
		],
		experiences: [
			{
				jobTitle: "Senior Product Manager",
				company: "Nimbus Apps",
				location: "San Francisco, CA",
				startOffsetYears: 2.1,
				currentlyWorking: true,
				description: "Leading mobile growth squad delivering onboarding and retention wins.",
				achievements: [
					"Launched adaptive onboarding increasing day-30 retention by 14%.",
					"Built monetization roadmap delivering +$4.5M ARR within 12 months.",
				],
				skillsUsed: ["Roadmapping", "Experimentation", "SQL", "Figma"],
			},
			{
				jobTitle: "Product Manager",
				company: "Skyline Collaboration",
				location: "Los Angeles, CA",
				startOffsetYears: 5.4,
				endOffsetYears: 2.2,
				description: "Owned messaging features across web and desktop products.",
				achievements: [
					"Rolled out async collaboration suite adopted by 70% of enterprise customers.",
					"Partnered with research to cut churn by 11% through segment-specific retention plans.",
				],
				skillsUsed: ["Product Analytics", "OKRs", "User Research"],
			},
			{
				jobTitle: "Associate Product Manager",
				company: "BrightSpark",
				location: "Austin, TX",
				startOffsetYears: 8.2,
				endOffsetYears: 5.5,
				description: "Drove roadmap for internal productivity tooling.",
				achievements: [
					"Executed intake process reducing backlog chaos by 35%.",
					"Piloted beta program improving time-to-resolution by 22%.",
				],
				skillsUsed: ["Scrum", "Jira", "Stakeholder Management"],
			},
		],
		education: [
			{
				degree: "MBA, Product Strategy",
				institution: "UCLA Anderson",
				location: "Los Angeles, CA",
				startOffsetYears: 6.4,
				endOffsetYears: 4.6,
				gradeType: "gpa",
				gradeValue: "3.8",
				achievements: ["Anderson Venture Fellow", "Design sprint facilitator"],
				coursework: ["Product Strategy", "Behavioral Economics", "Growth Marketing"],
			},
			{
				degree: "B.S. in Computer Science",
				institution: "University of Texas at Austin",
				location: "Austin, TX",
				startOffsetYears: 10.8,
				endOffsetYears: 6.8,
				gradeType: "gpa",
				gradeValue: "3.6",
				achievements: ["Product Club President", "Hackathon finalist"],
				coursework: ["Human-Computer Interaction", "Software Engineering", "Data Visualization"],
			},
		],
		technicalSkills: [
			{ name: "Product Analytics", level: 8 },
			{ name: "SQL", level: 7 },
			{ name: "Figma", level: 7 },
			{ name: "A/B Testing", level: 8 },
			{ name: "Roadmapping", level: 9 },
			{ name: "OKRs", level: 8 },
			{ name: "Jira", level: 7 },
		],
		softSkills: [
			{ name: "Leadership", level: 8 },
			{ name: "Communication", level: 9 },
			{ name: "Prioritization", level: 9 },
			{ name: "Customer Empathy", level: 8 },
			{ name: "Stakeholder Alignment", level: 8 },
		],
		languages: [
			{ language: "English", proficiency: "Native" },
			{ language: "German", proficiency: "Professional" },
		],
		projects: [
			{
				name: "Mobile Onboarding Redesign",
				description:
					"Led discovery, experimentation, and launch of mobile onboarding experiences.",
				technologies: ["Mixpanel", "Figma", "Amplitude"],
				links: [{ label: "Case Study", url: "https://{{nameSlug}}.product/onboarding" }],
				startOffsetYears: 2.3,
				currentlyWorking: true,
				highlights: [
					"Conducted 30+ user interviews informing roadmap bets.",
					"Rolled out personalization flow increasing activation by 14%.",
				],
			},
			{
				name: "Billing Platform Revamp",
				subtitle: "Enterprise pricing modernization",
				description:
					"Collaborated with finance and engineering to launch usage-based billing.",
				technologies: ["Stripe", "Salesforce", "Looker"],
				links: [{ label: "Pitch Deck", url: "https://{{nameSlug}}.product/billing" }],
				startOffsetYears: 3.7,
				endOffsetYears: 2.5,
				highlights: [
					"Unlocked two new enterprise tiers generating $2M ARR within 9 months.",
					"Delivered admin tooling reducing support tickets by 20%.",
				],
			},
			{
				name: "Research Ops Playbook",
				technologies: ["Notion", "Airtable"],
				links: [{ label: "Playbook", url: "https://{{nameSlug}}.product/research" }],
				startOffsetYears: 4.9,
				endOffsetYears: 3.8,
				highlights: [
					"Created repository enabling self-serve insights for 150+ employees.",
					"Shortened discovery cycles by 25%.",
				],
			},
		],
		certifications: [
			{
				name: "Certified Scrum Product Owner (CSPO)",
				issuingOrganization: "Scrum Alliance",
				issueOffsetYears: 2.6,
				expiryYearsFromNow: 1.4,
				credentialUrl: "https://www.scrumalliance.org/community/member/{{username}}",
			},
			{
				name: "Pragmatic Certified Product Manager",
				issuingOrganization: "Pragmatic Institute",
				issueOffsetYears: 1.3,
				doesNotExpire: true,
				credentialUrl: "https://certs.pragmaticinstitute.com/{{username}}",
			},
		],
		achievements: [
			{
				title: "Feature of the Year",
				issuer: "Nimbus Apps",
				dateOffsetYears: 0.9,
				description: "Mobile feature launch recognized company-wide for revenue impact.",
			},
			{
				title: "Product Mentor",
				issuer: "Women in Product",
				dateOffsetYears: 1.8,
				description: "Mentored five aspiring PMs through cohort-based program.",
			},
			{
				title: "Vision Award",
				issuer: "Skyline Collaboration",
				dateOffsetYears: 3.4,
				description: "Recognized for aligning C-level stakeholders around 2-year platform strategy.",
			},
		],
	},
	{
		role: "Business Analyst",
		summary:
			"{{name}} is a {{role}} turning ambiguous business questions into actionable requirements and measurable impact.",
		resumeDescription:
			"The {{template}} layout presents {{name}}'s {{role}} track record across process optimization, financial modeling, and change management.",
		preferredTitles: [
			"Business Analyst Resume",
			"Operations Analyst CV",
			"Strategy Analyst Portfolio",
		],
		locations: ["Chicago, IL", "Dallas, TX", "Atlanta, GA", "Remote"],
		linkTemplates: [
			{ label: "LinkedIn", url: "https://linkedin.com/in/{{username}}" },
			{ label: "Portfolio", url: "https://{{nameSlug}}.analysis" },
			{ label: "Tableau Public", url: "https://public.tableau.com/app/profile/{{username}}" },
		],
		experiences: [
			{
				jobTitle: "Senior Business Analyst",
				company: "BlueRiver Logistics",
				location: "Chicago, IL",
				startOffsetYears: 1.6,
				currentlyWorking: true,
				description: "Owns analytics roadmap and requirements for logistics automation programs.",
				achievements: [
					"Delivered predictive routing model reducing delivery delays by 21%.",
					"Created KPI frameworks adopted across operations and finance teams.",
				],
				skillsUsed: ["SQL", "Power BI", "Process Mapping", "Stakeholder Management"],
			},
			{
				jobTitle: "Business Analyst",
				company: "Summit Financial",
				location: "Dallas, TX",
				startOffsetYears: 4.7,
				endOffsetYears: 1.7,
				description: "Supported commercial lending transformation initiatives.",
				achievements: [
					"Mapped underwriting process removing 12 manual handoffs.",
					"Partnered with engineering to deliver dashboarding suite for 150 bankers.",
				],
				skillsUsed: ["Visio", "Excel", "PowerPoint"],
			},
			{
				jobTitle: "Operations Analyst",
				company: "BrightWave Retail",
				location: "Atlanta, GA",
				startOffsetYears: 7.6,
				endOffsetYears: 4.8,
				description: "Drove operations reporting and vendor performance tracking.",
				achievements: [
					"Negotiated vendor scorecard program saving $1.2M annually.",
					"Built staffing forecast improving schedule adherence by 15%.",
				],
				skillsUsed: ["Excel", "SQL", "Power BI"],
			},
		],
		education: [
			{
				degree: "M.S. in Business Analytics",
				institution: "DePaul University",
				location: "Chicago, IL",
				startOffsetYears: 5.2,
				endOffsetYears: 3.6,
				gradeType: "gpa",
				gradeValue: "3.8",
				achievements: ["Analytics Fellowship", "Capstone project with Fortune 500 client"],
				coursework: ["Financial Modeling", "Advanced Excel", "Process Optimization"],
			},
			{
				degree: "B.B.A. in Finance",
				institution: "Georgia State University",
				location: "Atlanta, GA",
				startOffsetYears: 9.8,
				endOffsetYears: 5.8,
				gradeType: "gpa",
				gradeValue: "3.5",
				achievements: ["Finance Club VP", "Case competition finalist"],
				coursework: ["Corporate Finance", "Operations Management", "Business Statistics"],
			},
		],
		technicalSkills: [
			{ name: "SQL", level: 8 },
			{ name: "Power BI", level: 8 },
			{ name: "Excel", level: 9 },
			{ name: "Tableau", level: 7 },
			{ name: "Process Mapping", level: 8 },
			{ name: "Financial Modeling", level: 8 },
		],
		softSkills: [
			{ name: "Requirements Gathering", level: 9 },
			{ name: "Stakeholder Communication", level: 8 },
			{ name: "Change Management", level: 8 },
			{ name: "Problem Solving", level: 9 },
			{ name: "Presentation", level: 8 },
		],
		languages: [
			{ language: "English", proficiency: "Native" },
			{ language: "German", proficiency: "Professional" },
		],
		projects: [
			{
				name: "Revenue Forecast Model",
				description:
					"Built regression model forecasting revenue across regions for quarterly planning.",
				technologies: ["Excel", "SQL", "Power BI"],
				links: [{ label: "Overview", url: "https://{{nameSlug}}.analysis/forecast" }],
				startOffsetYears: 2.5,
				endOffsetYears: 1.9,
				highlights: [
					"Improved forecast accuracy by 8 percentage points.",
					"Provided scenario planning used in board reviews.",
				],
			},
			{
				name: "Vendor Scorecard Dashboard",
				technologies: ["Power BI", "SQL"],
				links: [{ label: "Dashboard", url: "https://public.tableau.com/app/profile/{{username}}" }],
				startOffsetYears: 3.7,
				endOffsetYears: 2.7,
				highlights: [
					"Aligned procurement and operations on unified vendor KPIs.",
					"Automated refresh cycle reducing manual work by 10 hours weekly.",
				],
			},
			{
				name: "Workflow Automation Assessment",
				technologies: ["Visio", "Miro"],
				links: [{ label: "Playbook", url: "https://{{nameSlug}}.analysis/workflow" }],
				startOffsetYears: 4.9,
				endOffsetYears: 3.8,
				highlights: [
					"Identified automation opportunities saving 2k staff hours annually.",
					"Produced roadmap prioritized by ROI and complexity.",
				],
			},
		],
		certifications: [
			{
				name: "Certified Business Analysis Professional (CBAP)",
				issuingOrganization: "IIBA",
				issueOffsetYears: 2.2,
				doesNotExpire: false,
				expiryYearsFromNow: 2.8,
				credentialUrl: "https://certifications.iiba.org/{{username}}",
			},
			{
				name: "Lean Six Sigma Green Belt",
				issuingOrganization: "ASQ",
				issueOffsetYears: 3.5,
				doesNotExpire: true,
				credentialUrl: "https://asq.org/cert/{{username}}",
			},
		],
		achievements: [
			{
				title: "Process Excellence Award",
				issuer: "BlueRiver Logistics",
				dateOffsetYears: 0.8,
				description: "Recognized for automating routing process saving $750K annually.",
			},
			{
				title: "Finance Partner of the Quarter",
				issuer: "Summit Financial",
				dateOffsetYears: 2.5,
				description: "Praised for bridging finance and engineering to deliver strategic dashboards.",
			},
			{
				title: "Speaker – Process World",
				issuer: "Process World Conference",
				dateOffsetYears: 1.9,
				description: "Presented case study on change management for enterprise automation.",
			},
		],
	},
	{
		role: "UX Designer",
		summary:
			"{{name}} is a {{role}} crafting accessible, conversion-friendly experiences across product surfaces.",
		resumeDescription:
			"Using the {{template}} template, this {{role}} resume for {{name}} highlights research rigor, design systems, and measurable impact.",
		preferredTitles: [
			"Senior UX Designer Resume",
			"Product Designer CV",
			"UX Lead Portfolio",
		],
		locations: ["New York, NY", "Portland, OR", "Remote", "San Diego, CA"],
		linkTemplates: [
			{ label: "LinkedIn", url: "https://linkedin.com/in/{{username}}" },
			{ label: "Portfolio", url: "https://{{nameSlug}}.design" },
			{ label: "Dribbble", url: "https://dribbble.com/{{username}}" },
		],
		experiences: [
			{
				jobTitle: "Senior UX Designer",
				company: "BrightPixel",
				location: "Portland, OR",
				startOffsetYears: 1.7,
				currentlyWorking: true,
				description: "Leads cross-platform design initiatives for growth surfaces.",
				achievements: [
					"Redesigned onboarding improving activation by 19%.",
					"Built design system scaling to 12 product teams.",
				],
				skillsUsed: ["Figma", "Design Systems", "Accessibility", "Prototyping"],
			},
			{
				jobTitle: "UX Designer",
				company: "Rivera Health",
				location: "Remote",
				startOffsetYears: 4.3,
				endOffsetYears: 1.8,
				description: "Designed telehealth experiences for patients and clinicians.",
				achievements: [
					"Conducted diary studies uncovering insights that improved NPS by 22 points.",
					"Introduced accessibility audits ensuring WCAG AA compliance.",
				],
				skillsUsed: ["User Research", "Accessibility", "Prototyping"],
			},
			{
				jobTitle: "Product Designer",
				company: "SparkRide",
				location: "San Diego, CA",
				startOffsetYears: 7.1,
				endOffsetYears: 4.4,
				description: "Designed rider and driver experiences across mobile apps.",
				achievements: [
					"Shipped in-app support improving ticket resolution by 30%.",
					"Established usability benchmarking practice.",
				],
				skillsUsed: ["Sketch", "Zeplin", "Usability Testing"],
			},
		],
		education: [
			{
				degree: "B.F.A. in Interaction Design",
				institution: "Savannah College of Art and Design",
				location: "Savannah, GA",
				startOffsetYears: 10,
				endOffsetYears: 6.5,
				gradeType: "gpa",
				gradeValue: "3.6",
				achievements: ["UX Club Lead", "Portfolio show finalist"],
				coursework: ["Interaction Design", "Human Factors", "Visual Design"],
			},
			{
				degree: "Certificate in Human-Centered Design",
				institution: "IDEO U",
				location: "Online",
				startOffsetYears: 3.4,
				endOffsetYears: 3,
				gradeType: "grade",
				gradeValue: "Pass",
				achievements: ["Capstone: Service design blueprint for telehealth"],
				coursework: ["Design Thinking", "Service Design"],
			},
		],
		technicalSkills: [
			{ name: "Figma", level: 9 },
			{ name: "Design Systems", level: 8 },
			{ name: "User Research", level: 8 },
			{ name: "Prototyping", level: 8 },
			{ name: "Accessibility", level: 8 },
			{ name: "Motion Design", level: 7 },
		],
		softSkills: [
			{ name: "Collaboration", level: 9 },
			{ name: "Facilitation", level: 8 },
			{ name: "Storytelling", level: 8 },
			{ name: "Empathy", level: 9 },
			{ name: "Leadership", level: 7 },
		],
		languages: [
			{ language: "English", proficiency: "Native" },
			{ language: "French", proficiency: "Professional" },
		],
		projects: [
			{
				name: "Design System Revamp",
				subtitle: "Token-driven architecture",
				description: "Rebuilt design system with tokens and accessibility baked in.",
				technologies: ["Figma", "Tokens Studio", "Storybook"],
				links: [{ label: "Documentation", url: "https://{{nameSlug}}.design/system" }],
				startOffsetYears: 1.8,
				currentlyWorking: true,
				highlights: [
					"Reduced design debt by 35% and sped delivery by 25%.",
					"Implemented audit process ensuring WCAG AA compliance.",
				],
			},
			{
				name: "Mobile Banking App Redesign",
				description: "Led end-to-end redesign improving retention and app store ratings.",
				technologies: ["Figma", "Maze"],
				links: [{ label: "Case Study", url: "https://{{nameSlug}}.design/banking" }],
				startOffsetYears: 3.3,
				endOffsetYears: 2.1,
				highlights: [
					"Raised app rating from 3.2 to 4.6 stars in six months.",
					"Drove 12% increase in mobile deposits via improved flows.",
				],
			},
			{
				name: "Research Repository",
				technologies: ["Notion", "Dovetail"],
				links: [{ label: "Playbook", url: "https://{{nameSlug}}.design/research" }],
				startOffsetYears: 4.5,
				endOffsetYears: 3.4,
				highlights: [
					"Created reusable research hub leveraged by 80+ teammates.",
					"Accelerated research synthesis cycles by 40%.",
				],
			},
		],
		certifications: [
			{
				name: "NN/g UX Certification",
				issuingOrganization: "Nielsen Norman Group",
				issueOffsetYears: 2.4,
				doesNotExpire: true,
				credentialUrl: "https://www.nngroup.com/ux-certification/verify/{{username}}",
			},
			{
				name: "Google UX Design Certificate",
				issuingOrganization: "Google",
				issueOffsetYears: 3.1,
				doesNotExpire: true,
				credentialUrl: "https://coursera.org/account/accomplishments/professional-cert/{{username}}",
			},
		],
		achievements: [
			{
				title: "DesignOps Champion",
				issuer: "BrightPixel",
				dateOffsetYears: 0.9,
				description: "Recognized for scaling design system and accessibility practice company-wide.",
			},
			{
				title: "UX Awards Finalist",
				issuer: "UX Awards",
				dateOffsetYears: 2.6,
				description: "Shortlisted for telehealth experience redesign.",
			},
			{
				title: "Mentor – ADPList",
				issuer: "ADPList",
				dateOffsetYears: 1.5,
				description: "Mentored designers globally on research and design systems best practices.",
			},
		],
	},
	{
		role: "High School Teacher",
		summary:
			"{{name}} is a {{role}} inspiring student achievement through inclusive instruction and community partnerships.",
		resumeDescription:
			"The {{template}} template surfaces {{name}}'s {{role}} impact—curriculum innovation, student growth, and extracurricular leadership.",
		preferredTitles: [
			"Secondary Teacher Resume",
			"STEM Educator CV",
			"Instructional Leader Portfolio",
		],
		locations: ["Chicago, IL", "Boston, MA", "Philadelphia, PA", "Remote"],
		linkTemplates: [
			{ label: "LinkedIn", url: "https://linkedin.com/in/{{username}}" },
			{ label: "Teaching Portfolio", url: "https://{{nameSlug}}.teaching" },
			{ label: "Teachers Pay Teachers", url: "https://www.teacherspayteachers.com/Store/{{nameSlug}}" },
		],
		experiences: [
			{
				jobTitle: "STEM Department Lead",
				company: "Riverbend High School",
				location: "Chicago, IL",
				startOffsetYears: 1.4,
				currentlyWorking: true,
				description: "Guides STEM curriculum design and coaches a team of eight teachers.",
				achievements: [
					"Implemented project-based learning increasing STEM enrollment by 25%.",
					"Secured $80K grant for robotics lab expansion.",
				],
				skillsUsed: ["Curriculum Design", "STEM Instruction", "Grant Writing"],
			},
			{
				jobTitle: "Physics Teacher",
				company: "Lakeside Academy",
				location: "Boston, MA",
				startOffsetYears: 4.6,
				endOffsetYears: 1.6,
				description: "Taught honors physics and AP physics, leading AP exam prep.",
				achievements: [
					"Raised AP exam pass rate from 68% to 91% in two years.",
					"Launched after-school robotics team winning regional finals.",
				],
				skillsUsed: ["Lesson Planning", "Differentiated Instruction", "Student Mentoring"],
			},
			{
				jobTitle: "Science Teacher",
				company: "Greenfield Charter School",
				location: "Philadelphia, PA",
				startOffsetYears: 7.8,
				endOffsetYears: 4.7,
				description: "Delivered integrated science curriculum and coordinated community STEM nights.",
				achievements: [
					"Designed interdisciplinary units resulting in 15% improvement in benchmark scores.",
					"Partnered with local university to host annual STEM fair.",
				],
				skillsUsed: ["Classroom Management", "Assessment Design", "Community Partnerships"],
			},
		],
		education: [
			{
				degree: "M.Ed. in Curriculum & Instruction",
				institution: "Boston University",
				location: "Boston, MA",
				startOffsetYears: 6.2,
				endOffsetYears: 4.4,
				gradeType: "gpa",
				gradeValue: "3.9",
				achievements: ["Graduate Teaching Fellow", "Capstone on project-based learning"],
				coursework: ["Assessment Design", "Instructional Leadership", "STEM Curriculum"],
			},
			{
				degree: "B.A. in Physics Education",
				institution: "Temple University",
				location: "Philadelphia, PA",
				startOffsetYears: 12,
				endOffsetYears: 8,
				gradeType: "gpa",
				gradeValue: "3.7",
				achievements: ["Student Teacher of the Year", "STEM Mentor"],
				coursework: ["Physics", "Educational Psychology", "Instructional Technology"],
			},
		],
		technicalSkills: [
			{ name: "Curriculum Design", level: 9 },
			{ name: "Instructional Technology", level: 8 },
			{ name: "Learning Management Systems", level: 8 },
			{ name: "Project-Based Learning", level: 9 },
			{ name: "Data-Driven Instruction", level: 8 },
		],
		softSkills: [
			{ name: "Classroom Management", level: 9 },
			{ name: "Student Mentoring", level: 9 },
			{ name: "Parent Communication", level: 8 },
			{ name: "Collaboration", level: 8 },
			{ name: "Leadership", level: 8 },
		],
		languages: [
			{ language: "English", proficiency: "Native" },
			{ language: "Spanish", proficiency: "Professional" },
			{ language: "French", proficiency: "Basic" },
		],
		projects: [
			{
				name: "STEM Curriculum Revamp",
				description:
					"Led district-wide initiative to revamp STEM curriculum with project-based learning modules.",
				technologies: ["Google Classroom", "Nearpod", "Scratch"],
				links: [{ label: "Curriculum", url: "https://{{nameSlug}}.teaching/stem" }],
				startOffsetYears: 1.9,
				currentlyWorking: true,
				highlights: [
					"Increased student STEM club participation by 40%.",
					"Developed teacher training materials adopted by 5 schools.",
				],
			},
			{
				name: "Robotics Club Expansion",
				description:
					"Scaled after-school robotics club and secured regional competition wins.",
				technologies: ["LEGO EV3", "Arduino"],
				links: [{ label: "Club Site", url: "https://{{nameSlug}}.teaching/robotics" }],
				startOffsetYears: 3.2,
				endOffsetYears: 1.5,
				highlights: [
					"Introduced mentorship program pairing students with local engineers.",
					"Team placed first in regional robotics challenge.",
				],
			},
			{
				name: "Equity in STEM Initiative",
				description:
					"Partnered with nonprofits to increase STEM access for underrepresented students.",
				technologies: ["Google Forms", "Miro"],
				links: [{ label: "Program Overview", url: "https://{{nameSlug}}.teaching/equity" }],
				startOffsetYears: 4.4,
				endOffsetYears: 2.9,
				highlights: [
					"Expanded program participation to 200 students annually.",
					"Secured multi-year sponsorship with local tech firms.",
				],
			},
		],
		certifications: [
			{
				name: "Illinois Professional Educator License",
				issuingOrganization: "Illinois State Board of Education",
				issueOffsetYears: 3,
				expiryYearsFromNow: 2,
				credentialUrl: "https://isbe.net/educators/{{username}}",
			},
			{
				name: "Google Certified Educator Level 2",
				issuingOrganization: "Google for Education",
				issueOffsetYears: 1.2,
				doesNotExpire: false,
				expiryYearsFromNow: 1.8,
				credentialUrl: "https://education.google.com/educator-certifications/?id={{username}}",
			},
		],
		achievements: [
			{
				title: "Teacher of the Year",
				issuer: "Riverbend High School",
				dateOffsetYears: 0.7,
				description: "Honored for advancing STEM achievement and inclusive instruction.",
			},
			{
				title: "National Board Certification",
				issuer: "NBPTS",
				dateOffsetYears: 2.4,
				description: "Awarded advanced certification demonstrating accomplished teaching.",
			},
			{
				title: "Community STEM Advocate",
				issuer: "Chicago STEM Coalition",
				dateOffsetYears: 1.6,
				description: "Recognized for building partnerships driving STEM access.",
			},
		],
	},
];

const buildExperience = (template: ExperienceTemplate, order: number) => {
	const startDate = yearsAgo(template.startOffsetYears);
	const endDate = template.currentlyWorking
		? undefined
		: yearsAgo(template.endOffsetYears ?? Math.max(template.startOffsetYears - 1, 0.25));
	return {
		id: randomUUID(),
		order,
		jobTitle: template.jobTitle,
		company: template.company,
		location: template.location,
		startDate,
		endDate,
		currentlyWorking: template.currentlyWorking ?? !template.endOffsetYears,
		description: template.description,
		achievements: template.achievements,
		skillsUsed: template.skillsUsed,
	};
};

const buildEducation = (template: EducationTemplate, order: number) => {
	const startDate = yearsAgo(template.startOffsetYears);
	const endDate = template.currentlyStudying
		? undefined
		: yearsAgo(template.endOffsetYears);
	return {
		id: randomUUID(),
		order,
		degree: template.degree,
		institution: template.institution,
		location: template.location,
		startDate,
		endDate,
		currentlyStudying: template.currentlyStudying ?? false,
		gradeType: template.gradeType,
		gradeValue: template.gradeValue,
		achievements: template.achievements,
		coursework: template.coursework,
	};
};

const buildProject = (
	template: ProjectTemplate,
	order: number,
	username: string,
	nameSlug: string
) => {
	const startDate = yearsAgo(template.startOffsetYears);
	const endDate = template.currentlyWorking
		? undefined
		: template.endOffsetYears !== undefined
		? yearsAgo(template.endOffsetYears)
		: undefined;
	return {
		id: randomUUID(),
		order,
		name: template.name,
		subtitle: template.subtitle,
		description: template.description,
		technologies: template.technologies,
		links: template.links.map((link) => ({
			label: link.label,
			url: applyPlaceholders(link.url, {
				username,
				nameSlug,
			}),
		})),
		startDate,
		endDate,
		currentlyWorking: template.currentlyWorking ?? false,
		highlights: template.highlights,
	};
};

const buildCertification = (
	template: CertificationTemplate,
	order: number,
	username: string
) => {
	const issueDate = yearsAgo(template.issueOffsetYears);
	const expirationDate = template.doesNotExpire
		? undefined
		: template.expiryYearsFromNow !== undefined
		? yearsFromNow(template.expiryYearsFromNow)
		: undefined;
	return {
		id: randomUUID(),
		order,
		name: template.name,
		issuingOrganization: template.issuingOrganization,
		issueDate,
		expirationDate,
		doesNotExpire: template.doesNotExpire ?? false,
		credentialUrl: applyPlaceholders(template.credentialUrl, { username }),
	};
};

const buildAchievement = (template: AchievementTemplate, order: number) => ({
	id: randomUUID(),
	order,
	title: template.title,
	issuer: template.issuer,
	date: yearsAgo(template.dateOffsetYears),
	description: template.description,
});

// Permission Presets
const PERMISSION_PRESETS = [
	{
		name: "Fully Customizable",
		permissions: {
			canChangeColors: true,
			canChangeFonts: true,
			canChangeLayout: true,
			canChangeSections: true,
			canChangeSectionConfig: true,
			canChangeSpacing: true,
			canChangeBorders: true,
		},
	},
	{
		name: "Colors & Fonts Only",
		permissions: {
			canChangeColors: true,
			canChangeFonts: true,
			canChangeLayout: false,
			canChangeSections: false,
			canChangeSectionConfig: true,
			canChangeSpacing: false,
			canChangeBorders: false,
		},
	},
	{
		name: "Layout Locked",
		permissions: {
			canChangeColors: true,
			canChangeFonts: true,
			canChangeLayout: false,
			canChangeSections: false,
			canChangeSectionConfig: true,
			canChangeSpacing: true,
			canChangeBorders: true,
		},
	},
	{
		name: "Design Locked",
		permissions: {
			canChangeColors: false,
			canChangeFonts: false,
			canChangeLayout: false,
			canChangeSections: true,
			canChangeSectionConfig: true,
			canChangeSpacing: false,
			canChangeBorders: false,
		},
	},
	{
		name: "Premium Flexible",
		permissions: {
			canChangeColors: true,
			canChangeFonts: true,
			canChangeLayout: true,
			canChangeSections: true,
			canChangeSectionConfig: true,
			canChangeSpacing: true,
			canChangeBorders: true,
		},
	},
	{
		name: "Basic Limited",
		permissions: {
			canChangeColors: true,
			canChangeFonts: false,
			canChangeLayout: false,
			canChangeSections: false,
			canChangeSectionConfig: true,
			canChangeSpacing: false,
			canChangeBorders: false,
		},
	},
];

async function main() {
	console.log("🌱 Starting database seed...");

	// Clear existing data
	await prisma.template.deleteMany({});
	await prisma.user.deleteMany({});
	console.log("Cleared existing data");

	// Create Admin User
	const adminEmail = process.env.EMAIL_ID || "admin@resumecraft.com";
	const adminPassword = process.env.PASSWORD || "Admin@123";
	const hashedPassword = await bcrypt.hash(adminPassword, 10);

	const adminUser = await prisma.user.create({
		data: {
			firstName: "Admin",
			lastName: "User",
			userName: "admin",
			email: adminEmail,
			password: hashedPassword,
			emailVerified: true,
			isActive: true,
			isBanned: false,
			role: "admin",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
			bio: "System administrator with full access to all features",
		},
	});

	console.log(`✅ Created admin user: ${adminUser.email}`);
	console.log(`   Username: ${adminUser.userName}`);
	console.log(`   Password: ${adminPassword} (from .env)`);

	const templates = [];

	for (let i = 0; i < 40; i++) {
		// Cycle through template data (20 templates, reuse with different configs)
		const templateIndex = i % TEMPLATE_DATA.length;
		const templateData = TEMPLATE_DATA[templateIndex];
		const colorScheme = randomFrom(COLOR_SCHEMES);
		const layout = randomFrom(LAYOUTS);
		const typography = randomFrom(TYPOGRAPHY_PRESETS);
		const skillFormat = randomFrom(SKILL_FORMATS);
		const isPaid = randomBool();
		
		// Assign permissions based on pricing tier
		// Free templates: more restrictions
		// Premium templates: more flexibility
		let permissionPreset;
		if (isPaid) {
			// Premium templates get better permissions
			permissionPreset = randomFrom([
				PERMISSION_PRESETS[0], // Fully Customizable
				PERMISSION_PRESETS[4], // Premium Flexible
				PERMISSION_PRESETS[2], // Layout Locked
			]);
		} else {
			// Free templates get more limited permissions
			permissionPreset = randomFrom([
				PERMISSION_PRESETS[1], // Colors & Fonts Only
				PERMISSION_PRESETS[3], // Design Locked
				PERMISSION_PRESETS[5], // Basic Limited
				PERMISSION_PRESETS[0], // Some free templates fully customizable
			]);
		}

		// Add variation number if reusing template
		const templateName =
			i >= TEMPLATE_DATA.length
				? `${templateData.name} v${
						Math.floor(i / TEMPLATE_DATA.length) + 1
				  }`
				: templateData.name;

		const template = await prisma.template.create({
			data: {
				name: templateName,
				description: templateData.description,
				thumbnail: `https://placehold.co/400x600/png?text=${encodeURIComponent(
					templateData.name
				)}`,
				categories: templateData.categories,

				// Pricing
				pricing: {
					isPaid,
					price: isPaid ? randomInt(5, 25) : 0,
					tier: isPaid ? randomFrom(["basic", "premium"]) : "free",
				},

				// Permissions
				permissions: permissionPreset.permissions,

				// Layout
				layout,

				// Colors
				colors: colorScheme,

				// Typography
				typography,

				// Spacing
				spacing: {
					section: randomFrom(["1rem", "1.5rem", "2rem"]),
					item: randomFrom(["0.75rem", "1rem", "1.25rem"]),
					margin: randomFrom(["1rem", "1.5rem", "2rem"]),
					padding: randomFrom(["1rem", "1.5rem", "2rem"]),
				},

				// Borders
				borders: {
					width: randomFrom(["1px", "2px"]),
					style: randomFrom(["solid", "dashed", "dotted"]),
					color: colorScheme.border,
					radius: randomFrom(["0", "0.25rem", "0.5rem", "0.75rem"]),
				},

				// Personal Info Config
				personalInfoConfig: {
					showWebsite: randomBool(),
					showLinks: randomBool(),
					showSummary: true,
					summaryPosition: randomFrom([
						"below-contact",
						"separate-section",
					]),
					contactLayout: randomFrom([
						"horizontal",
						"vertical",
						"grid",
					]),
					showIcons: randomBool(),
				},

				// Experience Config
				experienceConfig: {
					showLocation: randomBool(),
					showDescription: randomBool(),
					showAchievements: true,
					showSkillsUsed: randomBool(),
					dateFormat: randomFrom(["short", "long", "year-only"]),
					achievementsAsBullets: randomBool(),
				},

				// Education Config
				educationConfig: {
					showLocation: randomBool(),
					showGrade: randomBool(),
					showAchievements: randomBool(),
					showCoursework: randomBool(),
					dateFormat: randomFrom(["short", "long", "year-only"]),
					achievementsAsBullets: randomBool(),
				},

				// Skills Config
				skillsConfig: {
					displayFormat: skillFormat,
					showLevel: randomBool(),
					groupByCategory: randomBool(),
					showYearsOfExperience: randomBool(),
					technicalSkillsLabel: "Technical Skills",
					softSkillsLabel: "Soft Skills",
					languagesLabel: "Languages",
				},

				// Projects Config
				projectsConfig: {
					showSubtitle: randomBool(),
					showDescription: true,
					showTechnologies: randomBool(),
					showLinks: randomBool(),
					showDates: randomBool(),
					showHighlights: randomBool(),
					dateFormat: randomFrom(["short", "long", "year-only"]),
					highlightsAsBullets: randomBool(),
				},

				// Certifications Config
				certificationsConfig: {
					showIssueDate: randomBool(),
					showExpirationDate: randomBool(),
					showCredentialUrl: randomBool(),
					dateFormat: randomFrom(["short", "long", "year-only"]),
					urlAsQRCode: randomBool(),
				},

				// Achievements Config
				achievementsConfig: {
					showIssuer: randomBool(),
					showDate: randomBool(),
					showDescription: randomBool(),
					dateFormat: randomFrom(["short", "long", "year-only"]),
				},

				// Metadata
				createdBy: "seed-script",
				tags: [
					...templateData.categories,
					colorScheme.name.toLowerCase().replace(/\s+/g, "-"),
				],
				previewImage: `https://placehold.co/800x1000/png?text=${encodeURIComponent(
					templateData.name
				)}`,
				isPublished: true,
				isActive: true,
				usageCount: 0,
				rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
			},
		});

		templates.push(template);
		console.log(`✅ Created template ${i + 1}/40: ${templateName}`);
	}

	// Create sample users and their resumes referencing templates
	const { seededUsers, totalResumesCreated } = await createSampleUsersWithResumes(templates);

	const templatesWithUsage = await prisma.template.findMany({
		select: {
			id: true,
			name: true,
			usageCount: true,
			pricing: true,
		},
		orderBy: {
			usageCount: "desc",
		},
	});

	console.log(`\n🎉 Successfully seeded ${templates.length} templates!`);
	console.log("\n📊 Seed Summary:");
	console.log(`   👤 Users: ${seededUsers.length} sample users + 1 admin`);
	console.log(`   📄 Templates: ${templates.length} created`);
	console.log(`   📝 Resumes: ${totalResumesCreated} generated for sample users`);
	console.log(
		`   - Free: ${
			templates.filter((t: any) => !(t.pricing as any).isPaid).length
		}`
	);
	console.log(
		`   - Premium: ${
			templates.filter((t: any) => (t.pricing as any).isPaid).length
		}`
	);
	console.log(
		`   - Avg Rating: ${(
			templates.reduce((sum: number, t: any) => sum + t.rating, 0) /
			templates.length
		).toFixed(1)}`
	);
	console.log(`\n🔐 Permission Distribution:`);
	console.log(
		`   - Fully Customizable: ${
			templates.filter((t: any) => (t.permissions as any).canChangeLayout && (t.permissions as any).canChangeColors).length
		}`
	);
	console.log(
		`   - Layout Locked: ${
			templates.filter((t: any) => !(t.permissions as any).canChangeLayout && (t.permissions as any).canChangeColors).length
		}`
	);
	console.log(
		`   - Design Locked: ${
			templates.filter((t: any) => !(t.permissions as any).canChangeColors && (t.permissions as any).canChangeSections).length
		}`
	);
	console.log("\n🔑 Admin Credentials:");
	console.log(`   Email: ${adminEmail}`);
	console.log(`   Username: admin`);
	console.log(`   Password: ${adminPassword}`);
	console.log("\n👥 Sample User Credentials:");
	seededUsers.forEach((user, index) => {
		console.log(
			`   ${index + 1}. ${user.email} (username: ${user.userName}) / ${user.password}`
		);
	});
	console.log("\n📈 Template Usage (Top 10):");
	templatesWithUsage.slice(0, 10).forEach((template, index) => {
		const pricing = template.pricing as { isPaid?: boolean } | null;
		const tierLabel = pricing?.isPaid ? "Paid" : "Free";
		console.log(
			`   ${index + 1}. ${template.name} — ${template.usageCount} resume(s) (${tierLabel})`
		);
	});
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
