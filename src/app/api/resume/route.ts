import { prisma } from "@/lib/services/prisma.service";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/resume
 * Returns all resumes created by the authenticated user.
 */
export async function GET(request: NextRequest) {
	try {
		const authUser = getAuthUser(request);

		if (!authUser) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: "UNAUTHORIZED",
						message: "Authentication required. Please sign in.",
					},
				},
				{ status: 401 }
			);
		}

		const resumes = await prisma.resume.findMany({
			where: {
				userId: authUser.userId,
			},
			orderBy: {
				updatedAt: "desc",
			},
			select: {
				id: true,
				name: true,
				description: true,
				data: true,
				templateConfig: true,
				templateVersion: true,
				isPublic: true,
				createdAt: true,
				updatedAt: true,
				template: {
					select: {
						id: true,
						name: true,
						description: true,
						thumbnail: true,
						pricing: true,
						permissions: true,
						categories: true,
					},
				},
			},
		});

		return NextResponse.json(
			{
				success: true,
				data: resumes,
				meta: {
					count: resumes.length,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("[RESUME_LIST_ERROR]:", error);

		return NextResponse.json(
			{
				success: false,
				error: {
					code: "INTERNAL_ERROR",
					message: "Failed to fetch resumes. Please try again later.",
				},
			},
			{ status: 500 }
		);
	}
}

