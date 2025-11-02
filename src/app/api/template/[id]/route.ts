/**
 * Individual Template API Routes
 * GET /api/template/[id] - Get template by ID
 * PUT /api/template/[id] - Update template
 * DELETE /api/template/[id] - Delete template
 */

import { ZodError } from "zod";
import { TemplateConfig } from "@/interfaces/templates";
import { NextRequest, NextResponse } from "next/server";
import {
	getTemplateById,
	updateTemplate,
	deleteTemplate,
} from "@/lib/services/template.service";
import { ApiResponse } from "@/interfaces/api-response.interface";
import { updateTemplateSchema } from "@/lib/validations/template.validations";

/**
 * GET /api/template/[id]
 * Get a template by ID
 */
export async function GET(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await context.params;

		const template = await getTemplateById(id);

		if (!template) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "NOT_FOUND",
						message: "Template not found",
					},
				},
				{ status: 404 }
			);
		}

		const response: ApiResponse<TemplateConfig> = {
			success: true,
			data: template,
		};

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: {
					code: "INTERNAL_ERROR",
					message: "Failed to fetch template",
				},
			},
			{ status: 500 }
		);
	}
}

/**
 * PUT /api/template/[id]
 * Update a template
 */
export async function PUT(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await context.params;
		const body = await request.json();

		// Validate request body
		const data = updateTemplateSchema.parse({ ...body, id });

		// Update template
		const template = await updateTemplate(data);

		const response: ApiResponse<TemplateConfig> = {
			success: true,
			data: template,
		};

		return NextResponse.json(response, { status: 200 });
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

		// Check if it's a Prisma not found error
		if (
			error instanceof Error &&
			error.message.includes("Record to update not found")
		) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "NOT_FOUND",
						message: "Template not found",
					},
				},
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: {
					code: "INTERNAL_ERROR",
					message: "Failed to update template",
				},
			},
			{ status: 500 }
		);
	}
}

/**
 * DELETE /api/template/[id]
 * Delete a template
 */
export async function DELETE(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await context.params;

		await deleteTemplate(id);

		const response: ApiResponse<{ message: string }> = {
			success: true,
			data: { message: "Template deleted successfully" },
		};

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		// Check if it's a Prisma not found error
		if (
			error instanceof Error &&
			error.message.includes("Record to delete does not exist")
		) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "NOT_FOUND",
						message: "Template not found",
					},
				},
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: {
					code: "INTERNAL_ERROR",
					message: "Failed to delete template",
				},
			},
			{ status: 500 }
		);
	}
}

