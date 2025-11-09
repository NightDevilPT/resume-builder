"use client";

import { cn } from "@/lib/utils";
import { memo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { TemplateConfig } from "@/interfaces/templates";
import { CalendarClock, Sparkles, UserCheck } from "lucide-react";

type TemplateHeaderProps = {
	template: TemplateConfig;
	priceLabel: string;
	onUseTemplate: () => void;
	onBrowseTemplates: (templateId: string) => void;
};

function TemplateHeaderComponent({
	template,
	priceLabel,
	onUseTemplate,
	onBrowseTemplates,
}: TemplateHeaderProps) {
	const handleBrowse = useCallback(
		() => onBrowseTemplates(template.id),
		[onBrowseTemplates, template.id]
	);

	return (
		<header className="space-y-6 rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-muted/30 p-8 shadow-xl">
			<div className="flex flex-wrap items-center gap-3">
				<Badge
					variant={template.pricing.isPaid ? "default" : "secondary"}
					className={cn(
						"text-xs font-semibold uppercase tracking-wide",
						!template.pricing.isPaid &&
							"bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
					)}
				>
					{priceLabel}
				</Badge>
				{template.categories.map((category) => (
					<Badge
						key={category}
						variant="outline"
						className="text-xs font-medium uppercase tracking-wide"
					>
						{category}
					</Badge>
				))}
			</div>

			<div className="space-y-3">
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]">
					{template.name}
				</h1>
				<p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
					{template.description}
				</p>
			</div>

			<div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
				<div className="flex items-center gap-2">
					<Sparkles className="h-4 w-4 text-primary" />
					<span>
						{template.metadata.rating.toFixed(1)} / 5.0 rating
					</span>
				</div>
				<div className="flex items-center gap-2">
					<UserCheck className="h-4 w-4 text-primary" />
					<span>
						{template.metadata.usageCount.toLocaleString()} resumes
						launched
					</span>
				</div>
				<div className="flex items-center gap-2">
					<CalendarClock className="h-4 w-4 text-primary" />
					<span>
						Updated{" "}
						{formatDistanceToNow(
							new Date(template.metadata.updatedAt),
							{
								addSuffix: true,
							}
						)}
					</span>
				</div>
			</div>

			<div className="flex flex-wrap gap-3">
				<Button size="lg" onClick={onUseTemplate}>
					Use this template
				</Button>
				<Button size="lg" variant="secondary" onClick={handleBrowse}>
					Browse more templates
				</Button>
			</div>
		</header>
	);
}

TemplateHeaderComponent.displayName = "TemplateHeader";

export const TemplateHeader = memo(TemplateHeaderComponent);
