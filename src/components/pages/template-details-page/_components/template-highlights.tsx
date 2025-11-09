"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { memo } from "react";
import { LucideIcon } from "lucide-react";


export type TemplateHighlightItem = {
	icon: LucideIcon;
	title: string;
	description: string;
};

type TemplateHighlightsProps = {
	items: TemplateHighlightItem[];
};

function TemplateHighlightsComponent({ items }: TemplateHighlightsProps) {
	if (!items.length) {
		return null;
	}

	return (
		<section className="grid gap-5 md:grid-cols-3">
			{items.map((item) => (
				<Card
					key={item.title}
					className="border-border/60 bg-background/95 shadow-sm transition hover:shadow-lg"
				>
					<CardHeader className="space-y-3 pb-4">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<item.icon className="h-5 w-5" />
						</div>
						<CardTitle className="text-base font-semibold">{item.title}</CardTitle>
						<CardDescription className="text-sm leading-relaxed text-muted-foreground">
							{item.description}
						</CardDescription>
					</CardHeader>
				</Card>
			))}
		</section>
	);
}

TemplateHighlightsComponent.displayName = "TemplateHighlights";

export const TemplateHighlights = memo(TemplateHighlightsComponent);
