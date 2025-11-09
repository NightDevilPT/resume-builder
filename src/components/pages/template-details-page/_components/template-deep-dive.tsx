"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { memo, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { TemplateConfig, SectionType } from "@/interfaces/templates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


type VisibleSection = TemplateConfig["layout"]["sections"][number];

type TemplateDeepDiveProps = {
	template: TemplateConfig;
	layoutLabel: string;
	requiredSectionCount: number;
	visibleSections: VisibleSection[];
	colorEntries: Array<[string, string]>;
	permissionEntries: Array<{
		key: keyof TemplateConfig["permissions"];
		label: string;
		value: boolean;
	}>;
};

const SECTION_LABELS: Record<SectionType, string> = {
	"personal-info": "Personal Information",
	experience: "Experience",
	education: "Education",
	skills: "Skills",
	projects: "Projects",
	certifications: "Certifications",
	achievements: "Achievements",
};

const TemplateDeepDiveComponent = ({
	template,
	layoutLabel,
	requiredSectionCount,
	visibleSections,
	colorEntries,
	permissionEntries,
}: TemplateDeepDiveProps) => {
	const overviewMetrics = useMemo(
		() => [
			{
				label: "Layout type",
				value: layoutLabel,
				hint: "Structure driving the resume narrative",
			},
			{
				label: "Visible sections",
				value: String(visibleSections.length),
				hint: "Active content blocks in this template",
			},
			{
				label: "Core sections",
				value: String(requiredSectionCount),
				hint: "Mandatory sections enforced for consistency",
			},
		],
		[layoutLabel, requiredSectionCount, visibleSections.length]
	);

	return (
		<section className="space-y-6">
			<div className="flex items-center justify-between gap-2">
				<h2 className="text-xl font-semibold tracking-tight text-foreground">
					Template deep dive
				</h2>
				<span className="text-sm text-muted-foreground">
					Understand how this layout is wired before you commit.
				</span>
			</div>

			<Tabs
				defaultValue="overview"
				className="rounded-2xl border border-border/60 bg-background/95 p-6 shadow-sm"
			>
				<TabsList className="grid w-full gap-2 bg-muted/40 p-1 sm:grid-cols-4">
					<TabsTrigger value="overview" className="data-[state=active]:bg-background">
						Overview
					</TabsTrigger>
					<TabsTrigger value="layout" className="data-[state=active]:bg-background">
						Layout & Sections
					</TabsTrigger>
					<TabsTrigger value="styling" className="data-[state=active]:bg-background">
						Styling
					</TabsTrigger>
					<TabsTrigger value="permissions" className="data-[state=active]:bg-background">
						Customization
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="mt-6 space-y-6">
					<Card className="border border-border/80 bg-background">
						<CardHeader className="pb-4">
							<CardTitle className="text-base font-semibold text-foreground">
								At a glance
							</CardTitle>
							<CardDescription className="text-sm">
								Key metrics that define how this template is orchestrated.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-3">
							{overviewMetrics.map((metric) => (
								<div
									key={metric.label}
									className="rounded-xl border border-border/70 bg-muted/40 p-4"
								>
									<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
										{metric.label}
									</p>
									<p className="mt-1 text-lg font-semibold text-foreground">
										{metric.value}
									</p>
									<p className="mt-2 text-xs text-muted-foreground">
										{metric.hint}
									</p>
								</div>
							))}
						</CardContent>
					</Card>

					<Card className="border-border/60 bg-muted/20">
						<CardHeader>
							<CardTitle className="text-base font-semibold text-foreground">
								What you get
							</CardTitle>
							<CardDescription className="text-sm">
								A quick summary of the structure and readiness
								of this template.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
							<DetailBlock
								label="Layout"
								value={layoutLabel}
								description={`${
									template.layout?.sections.length ?? 0
								} configurable blocks`}
							/>
							<DetailBlock
								label="Core sections"
								value={`${requiredSectionCount} required / ${visibleSections.length} visible`}
								description="Ensures every resume covers the essentials"
							/>
							<DetailBlock
								label="Typography"
								value={`${template.typography.headingFont} · ${template.typography.bodyFont}`}
								description={`Heading size ${template.typography.headingSize} · body ${template.typography.lineHeight} line-height`}
							/>
							<DetailBlock
								label="Color system"
								value={`Primary ${template.colors.primary}`}
								description={`Harmonized with accent ${template.colors.accent}`}
							/>
						</CardContent>
					</Card>

					<Card className="border-border/60">
						<CardHeader>
							<CardTitle className="text-base font-semibold text-foreground">
								Template tags
							</CardTitle>
							<CardDescription className="text-sm">
								Quick filters to help you position this template
								for the right roles.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-wrap gap-2">
							{template.metadata.tags.length > 0 ? (
								template.metadata.tags.map((tag) => (
									<Badge
										key={tag}
										variant="secondary"
										className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
									>
										{tag}
									</Badge>
								))
							) : (
								<span className="text-sm text-muted-foreground">
									No tags assigned yet.
								</span>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="layout" className="mt-6 space-y-6">
					<Card className="border-border/60 bg-muted/20">
						<CardHeader>
							<CardTitle className="text-base font-semibold text-foreground">
								Section map
							</CardTitle>
							<CardDescription className="text-sm">
								Review the flow and placement for every section.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid grid-cols-1 gap-5 md:grid-cols-3">
							{visibleSections.length > 0 ? (
								visibleSections.map((section) => (
									<div
										key={`${section.type}-${section.order}`}
										className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-4 transition hover:border-primary/60 hover:bg-primary/5"
									>
										<div className="flex flex-wrap items-center justify-between gap-3">
											<div className="flex items-center gap-3">
												<Badge
													variant="outline"
													className="border-border/60 text-xs font-medium text-foreground"
												>
													{
														SECTION_LABELS[
															section.type
														]
													}
												</Badge>
												<span className="text-xs uppercase text-muted-foreground">
													Position ·{" "}
													{section.position}
												</span>
											</div>
											<span className="text-xs font-mono text-muted-foreground">
												Order{" "}
												{section.order
													.toString()
													.padStart(2, "0")}
											</span>
										</div>
										<div className="flex flex-wrap gap-2">
											{section.required ? (
												<Badge className="border-0 bg-primary/15 text-primary">
													Must-have
												</Badge>
											) : (
												<Badge variant="secondary" className="border-0">
													Optional
												</Badge>
											)}
											{section.customLabel ? (
												<Badge variant="outline">
													Label: {section.customLabel}
												</Badge>
											) : null}
										</div>
									</div>
								))
							) : (
								<p className="text-sm text-muted-foreground">
									This template does not expose visible
									sections yet.
								</p>
							)}
						</CardContent>
					</Card>

					<Card className="border-border/60 bg-muted/10">
						<CardHeader>
							<CardTitle className="text-base font-semibold text-foreground">
								Spacing rhythm
							</CardTitle>
							<CardDescription className="text-sm">
								Margins and spacing calibrate how content
								breathes across the page.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
							<SpacingBlock
								label="Section spacing"
								value={template.spacing.section}
								description="Gap between major blocks"
							/>
							<SpacingBlock
								label="Item spacing"
								value={template.spacing.item}
								description="Spacing inside each section"
							/>
							<SpacingBlock
								label="Page margin"
								value={template.spacing.margin}
								description="Outer breathing room"
							/>
							<SpacingBlock
								label="Inner padding"
								value={template.spacing.padding}
								description="Content padding within the frame"
							/>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="styling" className="mt-6 space-y-6">
					<Card className="border-border/60 bg-muted/20">
						<CardHeader>
							<CardTitle className="text-base font-semibold text-foreground">
								Color palette
							</CardTitle>
							<CardDescription className="text-sm">
								Palette crafted to balance impact and
								readability.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-wrap gap-4">
							{colorEntries.map(([key, value]) => (
								<div
									key={key}
									className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 pr-5"
								>
									<div
										className="h-10 w-10 rounded-lg border border-border/40 shadow-sm"
										style={{ backgroundColor: value }}
									/>
									<div className="space-y-1">
										<p className="text-xs uppercase text-muted-foreground">
											{key}
										</p>
										<p className="text-sm font-medium">
											{value}
										</p>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					<Card className="border-border/60 bg-muted/10">
						<CardHeader>
							<CardTitle className="text-base font-semibold text-foreground">
								Typography system
							</CardTitle>
							<CardDescription className="text-sm">
								Fonts, scale, and treatments that carry the
								visual tone.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
							<SpacingBlock
								label="Heading font"
								value={template.typography.headingFont}
								description={`Weight ${template.typography.headingWeight} · size ${template.typography.headingSize}`}
							/>
							<SpacingBlock
								label="Body font"
								value={template.typography.bodyFont}
								description={`Line height ${template.typography.lineHeight}`}
							/>
							<SpacingBlock
								label="Name styling"
								value={`Size ${template.typography.nameSize}`}
								description={`Weight ${template.typography.nameWeight}`}
							/>
							<div className="rounded-xl border border-dashed border-border/60 p-4">
								<p className="text-xs uppercase text-muted-foreground">
									Section accents
								</p>
								<p className="text-sm text-muted-foreground">
									Headings{" "}
									{template.typography.headingUppercase
										? "uppercase"
										: "sentence case"}
									{template.typography.headingUnderline
										? " · underlined"
										: ""}
									{template.typography.showDividers
										? " · dividers on"
										: " · dividers off"}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="border-border/60 bg-muted/10">
						<CardHeader>
							<CardTitle className="text-base font-semibold text-foreground">
								Border treatments
							</CardTitle>
							<CardDescription className="text-sm">
								Border styling that frames content without
								distraction.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-wrap gap-4">
							<SpacingBlock
								label="Width"
								value={template.borders.width}
							/>
							<SpacingBlock
								label="Style"
								value={template.borders.style}
								valueClassName="capitalize"
							/>
							<SpacingBlock
								label="Color"
								value={template.borders.color}
							/>
							<SpacingBlock
								label="Radius"
								value={template.borders.radius}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="permissions" className="mt-6 space-y-6">
					<Card className="border-border/60 bg-muted/20">
						<CardHeader>
							<CardTitle className="text-base font-semibold text-foreground">
								What users can customize
							</CardTitle>
							<CardDescription className="text-sm">
								Set expectations for the configurability of this
								template in the builder.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
							{permissionEntries.map((permission) => (
								<div
									key={permission.key}
									className={`flex items-start gap-3 rounded-xl border p-4 ${
										permission.value
											? "border-emerald-500/30 bg-emerald-500/10"
											: "border-border/60 bg-muted/20"
									}`}
								>
									<div className="mt-0.5">
										{permission.value ? (
											<CheckCircle2 className="h-5 w-5 text-emerald-600" />
										) : (
											<XCircle className="h-5 w-5 text-muted-foreground" />
										)}
									</div>
									<div>
										<p className="text-sm font-semibold">
											{permission.label}
										</p>
										<p className="text-xs text-muted-foreground">
											{permission.value
												? "Editable in the builder."
												: "Locked to preserve design integrity."}
										</p>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					<Card className="border-border/60 bg-muted/10">
						<CardHeader>
							<CardTitle className="text-base font-semibold text-foreground">
								Template governance
							</CardTitle>
							<CardDescription className="text-sm">
								Operational metadata that powers analytics and
								lifecycle management.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
							<DetailBlock
								label="Status"
								value={
									template.metadata.isPublished
										? "Published"
										: "Draft"
								}
								description={
									template.metadata.isActive
										? "Active in catalog"
										: "Inactive / hidden"
								}
							/>
							<DetailBlock
								label="Created"
								value={format(
									new Date(template.metadata.createdAt),
									"PPP"
								)}
								description={`By ${
									template.metadata.createdBy || "unknown"
								}`}
							/>
							<DetailBlock
								label="Last updated"
								value={format(
									new Date(template.metadata.updatedAt),
									"PPP"
								)}
								description={formatDistanceToNow(
									new Date(template.metadata.updatedAt),
									{
										addSuffix: true,
									}
								)}
							/>
							<DetailBlock
								label="Usage & rating"
								value={`${template.metadata.usageCount.toLocaleString()} uses`}
								description={`Average rating ${template.metadata.rating.toFixed(
									1
								)}`}
							/>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</section>
	);
};

TemplateDeepDiveComponent.displayName = "TemplateDeepDive";

export const TemplateDeepDive = memo(TemplateDeepDiveComponent);

type DetailBlockProps = {
	label: string;
	value: string;
	description?: string;
	valueClassName?: string;
};

function DetailBlock({
	label,
	value,
	description,
	valueClassName,
}: DetailBlockProps) {
	return (
		<div className="space-y-1.5">
			<p className="text-sm font-medium text-muted-foreground">{label}</p>
			<p className={`text-base font-semibold ${valueClassName ?? ""}`}>
				{value}
			</p>
			{description ? (
				<p className="text-sm text-muted-foreground">{description}</p>
			) : null}
		</div>
	);
}

function SpacingBlock(props: DetailBlockProps) {
	return (
		<div className="rounded-xl border border-dashed border-border/60 p-4">
			<DetailBlock {...props} />
		</div>
	);
}
