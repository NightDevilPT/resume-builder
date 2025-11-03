/**
 * Template Validation Schemas
 * Zod schemas for validating template data
 */

import { z } from "zod";

// Layout type schema
const layoutTypeSchema = z.enum([
	"single-column",
	"two-column-equal",
	"two-column-left-heavy",
	"two-column-right-heavy",
	"three-column",
]);

// Section type schema
const sectionTypeSchema = z.enum([
	"personal-info",
	"experience",
	"education",
	"skills",
	"projects",
	"certifications",
	"achievements",
]);

// Section position schema
const sectionPositionSchema = z.enum(["left", "right", "center", "full-width"]);

// Font weight schema
const fontWeightSchema = z.enum(["light", "normal", "medium", "semibold", "bold"]);

// Skill display format schema
const skillDisplayFormatSchema = z.enum([
	"bars",
	"dots",
	"percentage",
	"text",
	"stars",
	"badge-level",
	"list",
	"chips",
	"circles",
]);

// Column ratio schema
const columnRatioSchema = z.object({
	left: z.number().min(0).max(100),
	right: z.number().min(0).max(100),
});

// Section config schema
const sectionConfigSchema = z.object({
	type: sectionTypeSchema,
	position: sectionPositionSchema,
	order: z.number().int().min(0),
	visibility: z.boolean(),
	required: z.boolean(),
	customLabel: z.string().optional(),
});

// Color scheme schema
const colorSchemeSchema = z.object({
	primary: z.string(),
	secondary: z.string(),
	accent: z.string(),
	text: z.string(),
	textLight: z.string(),
	background: z.string(),
	border: z.string(),
	link: z.string(),
});

// Typography schema
const typographySchema = z.object({
	headingFont: z.string(),
	bodyFont: z.string(),
	nameSize: z.string(),
	nameWeight: fontWeightSchema,
	headingSize: z.string(),
	headingWeight: fontWeightSchema,
	headingUppercase: z.boolean(),
	headingUnderline: z.boolean(),
	subheadingSize: z.string(),
	subheadingWeight: fontWeightSchema,
	lineHeight: z.string(),
	showIcons: z.boolean(),
	showDividers: z.boolean(),
});

// Spacing schema
const spacingSchema = z.object({
	section: z.string(),
	item: z.string(),
	margin: z.string(),
	padding: z.string(),
});

// Border config schema
const borderConfigSchema = z.object({
	width: z.string(),
	style: z.enum(["solid", "dashed", "dotted", "double", "none"]),
	color: z.string(),
	radius: z.string(),
});

// Layout config schema
const layoutConfigSchema = z.object({
	type: layoutTypeSchema,
	columnRatio: columnRatioSchema.optional(),
	threeColumnRatio: z.tuple([z.number(), z.number(), z.number()]).optional(),
	gap: z.string(),
	sections: z.array(sectionConfigSchema),
});

// Pricing info schema
const pricingInfoSchema = z.object({
	isPaid: z.boolean(),
	price: z.number().int().min(0).optional(),
	tier: z.enum(["free", "basic", "premium", "custom"]).optional(),
});

// Permissions schema
const permissionsSchema = z.object({
	canChangeColors: z.boolean(),
	canChangeFonts: z.boolean(),
	canChangeLayout: z.boolean(),
	canChangeSections: z.boolean(),
	canChangeSectionConfig: z.boolean(),
	canChangeSpacing: z.boolean(),
	canChangeBorders: z.boolean(),
});

// Personal info config schema
const personalInfoConfigSchema = z.object({
	showWebsite: z.boolean(),
	showLinks: z.boolean(),
	showSummary: z.boolean(),
	summaryPosition: z.enum(["below-contact", "separate-section"]),
	contactLayout: z.enum(["horizontal", "vertical", "grid"]),
	showIcons: z.boolean(),
});

// Experience config schema
const experienceConfigSchema = z.object({
	showLocation: z.boolean(),
	showDescription: z.boolean(),
	showAchievements: z.boolean(),
	showSkillsUsed: z.boolean(),
	dateFormat: z.enum(["short", "long", "year-only"]),
	achievementsAsBullets: z.boolean(),
});

// Education config schema
const educationConfigSchema = z.object({
	showLocation: z.boolean(),
	showGrade: z.boolean(),
	showAchievements: z.boolean(),
	showCoursework: z.boolean(),
	dateFormat: z.enum(["short", "long", "year-only"]),
	achievementsAsBullets: z.boolean(),
});

// Skills config schema
const skillsConfigSchema = z.object({
	displayFormat: skillDisplayFormatSchema,
	showLevel: z.boolean(),
	groupByCategory: z.boolean(),
	showYearsOfExperience: z.boolean().optional(),
	technicalSkillsLabel: z.string().optional(),
	softSkillsLabel: z.string().optional(),
	languagesLabel: z.string().optional(),
});

// Projects config schema
const projectsConfigSchema = z.object({
	showSubtitle: z.boolean(),
	showDescription: z.boolean(),
	showTechnologies: z.boolean(),
	showLinks: z.boolean(),
	showDates: z.boolean(),
	showHighlights: z.boolean(),
	dateFormat: z.enum(["short", "long", "year-only"]),
	highlightsAsBullets: z.boolean(),
});

// Certifications config schema
const certificationsConfigSchema = z.object({
	showIssueDate: z.boolean(),
	showExpirationDate: z.boolean(),
	showCredentialUrl: z.boolean(),
	dateFormat: z.enum(["short", "long", "year-only"]),
	urlAsQRCode: z.boolean().optional(),
});

// Achievements config schema
const achievementsConfigSchema = z.object({
	showIssuer: z.boolean(),
	showDate: z.boolean(),
	showDescription: z.boolean(),
	dateFormat: z.enum(["short", "long", "year-only"]),
});

// Template metadata schema (for validation only - not for creation)
const templateMetadataSchema = z.object({
	createdBy: z.string(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	isPublished: z.boolean(),
	isActive: z.boolean(),
	usageCount: z.number().int().min(0),
	rating: z.number().min(0).max(5),
	tags: z.array(z.string()),
	previewImage: z.string().url().optional(),
});

// Complete template config schema
export const templateConfigSchema = z.object({
	id: z.string(),
	name: z.string().min(3).max(100),
	description: z.string().min(10).max(500),
	thumbnail: z.string().url(),
	categories: z.array(z.string()).min(1),
	pricing: pricingInfoSchema,
	permissions: permissionsSchema,
	layout: layoutConfigSchema,
	colors: colorSchemeSchema,
	typography: typographySchema,
	spacing: spacingSchema,
	borders: borderConfigSchema,
	personalInfoConfig: personalInfoConfigSchema,
	experienceConfig: experienceConfigSchema,
	educationConfig: educationConfigSchema,
	skillsConfig: skillsConfigSchema,
	projectsConfig: projectsConfigSchema,
	certificationsConfig: certificationsConfigSchema,
	achievementsConfig: achievementsConfigSchema,
	metadata: templateMetadataSchema,
});

// Create template schema (omit id and metadata)
export const createTemplateSchema = z.object({
	name: z.string().min(3).max(100),
	description: z.string().min(10).max(500),
	thumbnail: z.string().url(),
	categories: z.array(z.string()).min(1),
	pricing: pricingInfoSchema,
	layout: layoutConfigSchema,
	colors: colorSchemeSchema,
	typography: typographySchema,
	spacing: spacingSchema,
	permissions: permissionsSchema,
	borders: borderConfigSchema,
	personalInfoConfig: personalInfoConfigSchema,
	experienceConfig: experienceConfigSchema,
	educationConfig: educationConfigSchema,
	skillsConfig: skillsConfigSchema,
	projectsConfig: projectsConfigSchema,
	certificationsConfig: certificationsConfigSchema,
	achievementsConfig: achievementsConfigSchema,
	createdBy: z.string().min(1),
	tags: z.array(z.string()).default([]),
	previewImage: z.string().url().optional(),
	isPublished: z.boolean().default(false),
});

// Update template schema (all fields optional except id)
export const updateTemplateSchema = z.object({
	id: z.string(),
	name: z.string().min(3).max(100).optional(),
	description: z.string().min(10).max(500).optional(),
	thumbnail: z.string().url().optional(),
	categories: z.array(z.string()).min(1).optional(),
	pricing: pricingInfoSchema.optional(),
	permissions: permissionsSchema.optional(),
	layout: layoutConfigSchema.optional(),
	colors: colorSchemeSchema.optional(),
	typography: typographySchema.optional(),
	spacing: spacingSchema.optional(),
	borders: borderConfigSchema.optional(),
	personalInfoConfig: personalInfoConfigSchema.optional(),
	experienceConfig: experienceConfigSchema.optional(),
	educationConfig: educationConfigSchema.optional(),
	skillsConfig: skillsConfigSchema.optional(),
	projectsConfig: projectsConfigSchema.optional(),
	certificationsConfig: certificationsConfigSchema.optional(),
	achievementsConfig: achievementsConfigSchema.optional(),
	tags: z.array(z.string()).optional(),
	previewImage: z.string().url().optional(),
	isPublished: z.boolean().optional(),
	isActive: z.boolean().optional(),
});

// Query params schema for listing templates
export const templateQuerySchema = z.object({
	page: z.string().transform(Number).pipe(z.number().int().min(1)).default(1),
	pageSize: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).default(10),
	category: z.string().optional(),
	isPaid: z.string().transform((val) => val === "true").optional(),
	isPublished: z.string().transform((val) => val === "true").optional(),
	search: z.string().optional(),
	sortBy: z.enum(["createdAt", "updatedAt", "name", "rating", "usageCount"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Infer types from schemas
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type TemplateQueryParams = z.infer<typeof templateQuerySchema>;

