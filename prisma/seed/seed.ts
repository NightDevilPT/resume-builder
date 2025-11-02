/**
 * Prisma Seed Script
 * Populates database with sample template data
 */

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

async function main() {
	console.log("🌱 Starting database seed...");

	// Clear existing templates
	await prisma.template.deleteMany({});
	console.log("🗑️  Cleared existing templates");

	const templates = [];

	for (let i = 0; i < 20; i++) {
		const templateData = TEMPLATE_DATA[i];
		const colorScheme = randomFrom(COLOR_SCHEMES);
		const layout = randomFrom(LAYOUTS);
		const typography = randomFrom(TYPOGRAPHY_PRESETS);
		const skillFormat = randomFrom(SKILL_FORMATS);
		const isPaid = randomBool();

		const template = await prisma.template.create({
			data: {
				name: templateData.name,
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
				usageCount: randomInt(0, 500),
				rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
			},
		});

		templates.push(template);
		console.log(`✅ Created template ${i + 1}/20: ${templateData.name}`);
	}

	console.log(`\n🎉 Successfully seeded ${templates.length} templates!`);
	console.log("\n📊 Template Statistics:");
	console.log(
		`   - Free templates: ${
			templates.filter((t: any) => !(t.pricing as any).isPaid).length
		}`
	);
	console.log(
		`   - Premium templates: ${
			templates.filter((t: any) => (t.pricing as any).isPaid).length
		}`
	);
	console.log(
		`   - Average rating: ${(
			templates.reduce((sum: number, t: any) => sum + t.rating, 0) /
			templates.length
		).toFixed(1)}`
	);
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
