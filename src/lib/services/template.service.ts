/**
 * Template Service
 * Business logic for template CRUD operations
 */

import { prisma } from "./prisma.service";
import { TemplateConfig } from "@/interfaces/templates";
import type {
	CreateTemplateInput,
	UpdateTemplateInput,
	TemplateQueryParams,
} from "@/lib/validations/template.validations";

/**
 * Create a new template
 */
export async function createTemplate(
	data: CreateTemplateInput
): Promise<TemplateConfig> {
	const template = await prisma.template.create({
		data: {
			name: data.name,
			description: data.description,
			thumbnail: data.thumbnail,
			categories: data.categories,
			pricing: data.pricing as any,
			layout: data.layout as any,
			colors: data.colors as any,
			typography: data.typography as any,
			spacing: data.spacing as any,
			borders: data.borders as any,
			permissions: data.permissions as any,
			personalInfoConfig: data.personalInfoConfig as any,
			experienceConfig: data.experienceConfig as any,
			educationConfig: data.educationConfig as any,
			skillsConfig: data.skillsConfig as any,
			projectsConfig: data.projectsConfig as any,
			certificationsConfig: data.certificationsConfig as any,
			achievementsConfig: data.achievementsConfig as any,
			createdBy: data.createdBy,
			tags: data.tags || [],
			previewImage: data.previewImage,
			isPublished: data.isPublished || false,
			isActive: true,
			usageCount: 0,
			rating: 0,
		},
	});

	return mapTemplateToConfig(template);
}

/**
 * Get all templates with filters and pagination
 */
export async function getAllTemplates(
	params: TemplateQueryParams
): Promise<{ templates: TemplateConfig[]; total: number }> {
	const {
		page,
		pageSize,
		category,
		isPaid,
		isPublished,
		search,
		sortBy,
		sortOrder,
	} = params;

	// Build where clause
	const where: any = {};

	if (category) {
		where.categories = { has: category };
	}

	// NOTE: For PostgreSQL, we can't directly filter JSON fields in the query
	// We'll fetch all and filter in memory for isPaid
	// Alternatively, you could use raw SQL or create a computed column

	if (isPublished !== undefined) {
		where.isPublished = isPublished;
	}

	if (search) {
		where.OR = [
			{ name: { contains: search, mode: "insensitive" } },
			{ description: { contains: search, mode: "insensitive" } },
			{ tags: { has: search } },
		];
	}

	// Fetch templates
	let templates = await prisma.template.findMany({
		where,
		orderBy: { [sortBy]: sortOrder },
	});

	// Filter by isPaid in memory (PostgreSQL can't filter JSON fields easily)
	if (isPaid !== undefined) {
		templates = templates.filter((t: any) => {
			const pricing = t.pricing as { isPaid?: boolean };
			return pricing.isPaid === isPaid;
		});
	}

	// Count total after filtering
	const total = templates.length;

	// Apply pagination after filtering
	const paginatedTemplates = templates.slice(
		(page - 1) * pageSize,
		page * pageSize
	);

	return {
		templates: paginatedTemplates.map(mapTemplateToConfig),
		total,
	};
}

/**
 * Get template by ID
 */
export async function getTemplateById(id: string): Promise<TemplateConfig | null> {
	const template = await prisma.template.findUnique({
		where: { id },
	});

	if (!template) return null;
	return mapTemplateToConfig(template);
}

/**
 * Update template
 */
export async function updateTemplate(
	data: UpdateTemplateInput
): Promise<TemplateConfig> {
	const { id, ...updateData } = data;

	const template = await prisma.template.update({
		where: { id },
		data: {
			...(updateData.name && { name: updateData.name }),
			...(updateData.description && { description: updateData.description }),
			...(updateData.thumbnail && { thumbnail: updateData.thumbnail }),
			...(updateData.categories && { categories: updateData.categories }),
			...(updateData.pricing && { pricing: updateData.pricing as any }),
			...(updateData.permissions && { permissions: updateData.permissions as any }),
			...(updateData.layout && { layout: updateData.layout as any }),
			...(updateData.colors && { colors: updateData.colors as any }),
			...(updateData.typography && { typography: updateData.typography as any }),
			...(updateData.spacing && { spacing: updateData.spacing as any }),
			...(updateData.borders && { borders: updateData.borders as any }),
			...(updateData.personalInfoConfig && {
				personalInfoConfig: updateData.personalInfoConfig as any,
			}),
			...(updateData.experienceConfig && {
				experienceConfig: updateData.experienceConfig as any,
			}),
			...(updateData.educationConfig && {
				educationConfig: updateData.educationConfig as any,
			}),
			...(updateData.skillsConfig && {
				skillsConfig: updateData.skillsConfig as any,
			}),
			...(updateData.projectsConfig && {
				projectsConfig: updateData.projectsConfig as any,
			}),
			...(updateData.certificationsConfig && {
				certificationsConfig: updateData.certificationsConfig as any,
			}),
			...(updateData.achievementsConfig && {
				achievementsConfig: updateData.achievementsConfig as any,
			}),
			...(updateData.tags && { tags: updateData.tags }),
			...(updateData.previewImage && { previewImage: updateData.previewImage }),
			...(updateData.isPublished !== undefined && {
				isPublished: updateData.isPublished,
			}),
			...(updateData.isActive !== undefined && {
				isActive: updateData.isActive,
			}),
		},
	});

	return mapTemplateToConfig(template);
}

/**
 * Delete template
 */
export async function deleteTemplate(id: string): Promise<void> {
	await prisma.template.delete({
		where: { id },
	});
}

/**
 * Map Prisma Template to TemplateConfig interface
 */
function mapTemplateToConfig(template: any): TemplateConfig {
	return {
		id: template.id,
		name: template.name,
		description: template.description,
		thumbnail: template.thumbnail,
		categories: template.categories,
		pricing: template.pricing as any,
		layout: template.layout as any,
		colors: template.colors as any,
		typography: template.typography as any,
		permissions: template.permissions as any,
		spacing: template.spacing as any,
		borders: template.borders as any,
		personalInfoConfig: template.personalInfoConfig as any,
		experienceConfig: template.experienceConfig as any,
		educationConfig: template.educationConfig as any,
		skillsConfig: template.skillsConfig as any,
		projectsConfig: template.projectsConfig as any,
		certificationsConfig: template.certificationsConfig as any,
		achievementsConfig: template.achievementsConfig as any,
		metadata: {
			createdBy: template.createdBy,
			createdAt: template.createdAt.toISOString(),
			updatedAt: template.updatedAt.toISOString(),
			isPublished: template.isPublished,
			isActive: template.isActive,
			usageCount: template.usageCount,
			rating: template.rating,
			tags: template.tags,
			previewImage: template.previewImage || undefined,
		},
	};
}

