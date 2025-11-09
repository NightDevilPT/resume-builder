import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { API_URLS } from "@/constants/api-urls";
import { TemplateConfig } from "@/interfaces/templates";
import { ApiResponse } from "@/interfaces/api-response.interface";
import TemplateDetailsPage from "@/components/pages/template-details-page";

type TemplateDetailsRouteProps = {
	params: Promise<{ templateId: string }>;
};

const fetchTemplateById = cache(
	async (templateId: string): Promise<TemplateConfig | null> => {
		const headerStore = await headers();
		const cookieStore = await cookies();

		const host = headerStore.get("host");
		const protocol =
			process.env.NODE_ENV === "production" ? "https" : "http";

		const baseUrl =
			process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
			(host ? `${protocol}://${host}` : "http://localhost:3000");

		const endpoint = `${API_URLS.TEMPLATE}/${templateId}`;
		const url = new URL(endpoint, baseUrl).toString();

		const cookieHeader = cookieStore
			.getAll()
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join("; ");

		const response = await fetch(url, {
			cache: "no-store",
			headers: {
				Accept: "application/json",
				...(cookieHeader ? { cookie: cookieHeader } : {}),
			},
		});

		if (response.status === 404) {
			return null;
		}

		if (!response.ok) {
			throw new Error(
				`Failed to load template ${templateId}: ${response.status}`
			);
		}

		const payload = (await response.json()) as ApiResponse<TemplateConfig>;

		if (!payload.success || !payload.data) {
			return null;
		}

		return payload.data;
	}
);

export async function generateMetadata({
	params,
}: TemplateDetailsRouteProps): Promise<Metadata> {
	const { templateId } = await params;

	try {
		const template = await fetchTemplateById(templateId);

		if (!template) {
			return {
				title: "Template Not Found | ResumeCraft",
				description:
					"The requested template does not exist or is unavailable.",
			};
		}

		return {
			title: `${template.name} Template | ResumeCraft`,
			description: template.description,
		};
	} catch (error) {
		return {
			title: "Template Details | ResumeCraft",
			description:
				"Explore tailored resume templates purpose-built for modern hiring pipelines.",
		};
	}
}

export default async function TemplateDetailsRoute({
	params,
}: TemplateDetailsRouteProps) {
	const { templateId } = await params;

	let template: TemplateConfig | null = null;

	try {
		template = await fetchTemplateById(templateId);
	} catch (error) {
		console.error(error);
	}

	if (!template) {
		notFound();
	}

	return <TemplateDetailsPage template={template} />;
}
