"use client";

import { TemplateConfig } from "@/interfaces/templates";
import { TemplateCard } from "./TemplateCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplatesContentProps {
	templates: TemplateConfig[];
	isLoading: boolean;
	gridColumns: 2 | 3;
	onTemplateClick: (templateId: string) => void;
	onClearFilters: () => void;
}

export function TemplatesContent({
	templates,
	isLoading,
	gridColumns,
	onTemplateClick,
	onClearFilters,
}: TemplatesContentProps) {
	if (isLoading) {
		return (
			<div className="flex-1 flex items-center justify-center">
				<div className="text-center space-y-4">
					<Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
					<div>
						<h3 className="text-lg font-semibold">Loading templates...</h3>
						<p className="text-muted-foreground text-sm mt-1">
							Please wait while we fetch the best templates for you
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (templates.length === 0) {
		return (
			<div className="flex-1 flex items-center justify-center">
				<div className="text-center space-y-4 max-w-md">
					<div className="mx-auto w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center">
						<FileText className="h-10 w-10 text-muted-foreground" />
					</div>
					<div>
						<h3 className="text-2xl font-semibold">No templates found</h3>
						<p className="text-muted-foreground mt-2">
							We couldn't find any templates matching your criteria.
							Try adjusting your filters or search query.
						</p>
					</div>
					<Button onClick={onClearFilters} size="lg">
						<X className="h-4 w-4 mr-2" />
						Clear All Filters
					</Button>
				</div>
			</div>
		);
	}

	return (
		<ScrollArea className="h-full">
			<div
				className={cn(
					"grid gap-6 pr-4 pb-4",
					gridColumns === 2
						? "grid-cols-1 lg:grid-cols-2"
						: "grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"
				)}
			>
				{templates.map((template) => (
					<TemplateCard
						key={template.id}
						template={template}
						onClick={() => onTemplateClick(template.id)}
					/>
				))}
			</div>
		</ScrollArea>
	);
}

