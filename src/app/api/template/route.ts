/**
 * Template API Routes
 * GET /api/template - Get all templates with filters
 * POST /api/template - Create a new template
 */

import {
	createTemplateSchema,
	templateQuerySchema,
} from "@/lib/validations/template.validations";
import {
	createTemplate,
	getAllTemplates,
} from "@/lib/services/template.service";
import { ZodError } from "zod";
import { TemplateConfig } from "@/interfaces/templates";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/interfaces/api-response.interface";

/**
 * GET /api/template
 * Get all templates with filters and pagination
 */
export async function GET(request: NextRequest) {
	try {
		// Parse query params
		const searchParams = Object.fromEntries(request.nextUrl.searchParams);
		const params = templateQuerySchema.parse(searchParams);

		// Fetch templates
		const { templates, total } = await getAllTemplates(params);

		// Calculate pagination meta
		const totalPages = Math.ceil(total / params.pageSize);
		const hasNextPage = params.page < totalPages;
		const hasPreviousPage = params.page > 1;

		const response: ApiResponse<TemplateConfig[]> = {
			success: true,
			data: templates,
			meta: {
				currentPage: params.page,
				totalPages,
				totalItems: total,
				pageSize: params.pageSize,
				hasNextPage,
				hasPreviousPage,
				nextPage: hasNextPage ? params.page + 1 : params.page,
				previousPage: hasPreviousPage ? params.page - 1 : params.page,
			},
		};

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "VALIDATION_ERROR",
						message: "Invalid query parameters",
						details: error.flatten(),
					},
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: {
					code: "INTERNAL_ERROR",
					message: "Failed to fetch templates",
				},
			},
			{ status: 500 }
		);
	}
}

/**
 * POST /api/template
 * Create a new template
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const data = createTemplateSchema.parse(body);

		// Create template
		const template = await createTemplate(data);

		const response: ApiResponse<TemplateConfig> = {
			success: true,
			data: template,
		};

		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "VALIDATION_ERROR",
						message: "Invalid template data",
						details: error.flatten(),
					},
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: {
					code: "INTERNAL_ERROR",
					message: "Failed to create template",
				},
			},
			{ status: 500 }
		);
	}
}
