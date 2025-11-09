"use client";

import {
	TemplateHighlightItem,
	TemplateHighlights,
} from "./_components/template-highlights";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Layers, Palette, Sparkles } from "lucide-react";
import { TemplateConfig } from "@/interfaces/templates";
import { TemplateHeader } from "./_components/template-header";
import { TemplateDeepDive } from "./_components/template-deep-dive";
import { TemplatePreviewPanel } from "./_components/template-preview-panel";

type TemplateDetailsPageProps = {
	template: TemplateConfig;
};

const LAYOUT_LABELS: Record<string, string> = {
	"single-column": "Single Column",
	"two-column-equal": "Two Column — Balanced",
	"two-column-left-heavy": "Two Column — Emphasis Left",
	"two-column-right-heavy": "Two Column — Emphasis Right",
	"three-column": "Three Column",
};

const PERMISSION_LABELS: Record<keyof TemplateConfig["permissions"], string> = {
	canChangeColors: "Custom color palette",
	canChangeFonts: "Typography adjustments",
	canChangeLayout: "Switch layout type",
	canChangeSections: "Add, remove, or reorder sections",
	canChangeSectionConfig: "Fine-tune section settings",
	canChangeSpacing: "Adjust spacing and margins",
	canChangeBorders: "Modify border treatments",
};

function getPriceLabel(template: TemplateConfig): string {
	if (!template.pricing.isPaid) {
		return "Free";
	}

	if (typeof template.pricing.price === "number") {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(template.pricing.price);
	}

	return template.pricing.tier
		? `${template.pricing.tier} plan`
		: "Premium";
}

export function TemplateDetailsPage({ template }: TemplateDetailsPageProps) {
	const router = useRouter();

	const layoutLabel = useMemo(
		() =>
			template.layout?.type
				? LAYOUT_LABELS[template.layout.type] || "Custom layout"
				: "Custom layout",
		[template.layout?.type]
	);

	const visibleSections = useMemo(() => {
		const sections = template.layout?.sections ?? [];
		return sections
			.filter((section) => section.visibility)
			.sort((a, b) => a.order - b.order);
	}, [template.layout?.sections]);

	const requiredSectionCount = useMemo(
		() => visibleSections.filter((section) => section.required).length,
		[visibleSections]
	);

	const highlightItems = useMemo<TemplateHighlightItem[]>(
		() => [
			{
				icon: Layers,
				title: layoutLabel,
				description: `Optimized for ${
					template.layout?.type === "single-column"
						? "focused storytelling"
						: `${visibleSections.length} structured content blocks`
				} with intuitive flow.`,
			},
			{
				icon: Sparkles,
				title: "Curated narrative",
				description: `${requiredSectionCount} core sections are pre-configured to keep hiring managers focused on what matters.`,
			},
			{
				icon: Palette,
				title: "Polished visuals",
				description: `A modern palette anchored by ${template.colors.primary} with typography set in ${template.typography.headingFont} / ${template.typography.bodyFont}.`,
			},
		],
		[
			layoutLabel,
			requiredSectionCount,
			template.colors.primary,
			template.layout?.type,
			template.typography.bodyFont,
			template.typography.headingFont,
			visibleSections.length,
		]
	);

	const colorEntries = useMemo(
		() =>
			(
				Object.entries(template.colors ?? {}) as Array<[string, string]>
			).filter(([, value]) => Boolean(value)),
		[template.colors]
	);

	const permissionEntries = useMemo(
		() =>
			(
				Object.entries(
					template.permissions
				) as Array<[keyof TemplateConfig["permissions"], boolean]>
			).map(([key, value]) => ({
				key,
				label: PERMISSION_LABELS[key],
				value,
			})),
		[template.permissions]
	);

	const handleUseTemplate = useCallback(() => {
		router.push(`/templates/${template.id}/resume`);
	}, [router, template.id]);

	const handleBrowseTemplates = useCallback(
		(templateId: string) => {
			router.push(`/templates?highlight=${templateId}`);
		},
		[router]
	);

	const priceLabel = useMemo(() => getPriceLabel(template), [template]);

	return (
		<div className="bg-background">
			<div className="container mx-auto px-6 py-10">
				<div className="flex flex-col gap-10 xl:flex-row">
					<div className="flex-1 space-y-9">
						<TemplateHeader
							template={template}
							priceLabel={priceLabel}
							onUseTemplate={handleUseTemplate}
							onBrowseTemplates={handleBrowseTemplates}
						/>

						<div className="xl:hidden">
							<TemplatePreviewPanel
								template={template}
								priceLabel={priceLabel}
								onUseTemplate={handleUseTemplate}
							/>
						</div>

						<TemplateHighlights items={highlightItems} />

						<TemplateDeepDive
							template={template}
							layoutLabel={layoutLabel}
							requiredSectionCount={requiredSectionCount}
							visibleSections={visibleSections}
							colorEntries={colorEntries}
							permissionEntries={permissionEntries}
						/>
					</div>

					<aside className="hidden w-full xl:block xl:w-[420px]">
						<div className="space-y-6">
							<TemplatePreviewPanel
								template={template}
								priceLabel={priceLabel}
								onUseTemplate={handleUseTemplate}
							/>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}

export default TemplateDetailsPage;

