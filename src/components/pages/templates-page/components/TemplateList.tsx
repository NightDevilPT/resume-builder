"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TemplateConfig } from "@/interfaces/templates";
import { Eye, Heart, Star, ArrowRight, TrendingUp } from "lucide-react";
import { TemplatePreview } from "@/components/pages/resume-layout-page/components/TemplatePreview";

interface TemplateListProps {
	template: TemplateConfig;
	onClick?: () => void;
}

export function TemplateList({ template, onClick }: TemplateListProps) {
	const { name, description, pricing, metadata, categories } = template;

	return (
		<Card className="group relative overflow-hidden border shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-background">
			<div
				className="grid grid-cols-[300px_1fr] gap-6 p-6"
				onClick={onClick}
			>
				{/* Left: Preview */}
				<div className="relative w-full h-[380px] bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl overflow-hidden flex-shrink-0">
					{/* Decorative blur elements */}
					<div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
					<div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />

					<div className="absolute inset-0 flex items-center justify-center p-4">
						<div
							className="origin-center pointer-events-none transform group-hover:scale-105 transition-transform duration-500"
							style={{
								transform: "scale(0.45)",
							}}
						>
							<TemplatePreview config={template} />
						</div>
					</div>

					{/* Hover Overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
						<Eye className="h-10 w-10 text-background drop-shadow-lg" />
					</div>
				</div>

				{/* Right: Details */}
				<div className="flex flex-col justify-between min-w-0">
					{/* Top Section */}
					<div className="space-y-4">
						{/* Title */}
						<div className="space-y-2">
							<h3 className="font-bold text-2xl line-clamp-2 group-hover:text-primary transition-colors">
								{name}
							</h3>

							<p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
								{description}
							</p>
						</div>

						{/* Categories */}
						<div className="flex flex-wrap gap-2">
							{categories.map((category, index) => (
								<Badge
									key={category}
									variant="outline"
									className="text-xs font-medium hover:bg-primary/10 transition-colors"
								>
									{category}
								</Badge>
							))}
						</div>

						{/* Stats */}
						<div className="flex items-center gap-6 text-sm pt-2">
							<div className="flex items-center gap-2">
								<Eye className="h-4 w-4 text-muted-foreground" />
								<div>
									<span className="font-semibold text-foreground">
										{metadata.usageCount.toLocaleString()}
									</span>
									<span className="text-muted-foreground ml-1">
										uses
									</span>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Star className="h-4 w-4 fill-primary text-primary" />
								<div>
									<span className="font-semibold text-foreground">
										{metadata.rating.toFixed(1)}
									</span>
									<span className="text-muted-foreground ml-1">
										rating
									</span>
								</div>
							</div>
						</div>
						{/* Badges Row */}
						<div className="flex items-center gap-2 flex-wrap">
							{/* Popular Badge */}
							{metadata.usageCount > 50 && (
								<Badge>
									<TrendingUp className="h-3 w-3" />
									Popular
								</Badge>
							)}

							{/* Price Badge */}
							{pricing.isPaid ? (
								<Badge>${pricing.price}</Badge>
							) : (
								<Badge>FREE</Badge>
							)}

							{/* Rating Badge */}
							{metadata.rating >= 4.5 && (
								<Badge>
									<Star className="h-3 w-3 fill-primary text-primary" />
									{metadata.rating.toFixed(1)}
								</Badge>
							)}
						</div>
					</div>

					{/* Bottom Section: Actions */}
					<div className="flex items-center justify-between pt-6 border-t mt-6">
						<Button
							variant="ghost"
							size="sm"
							className="gap-2 hover:text-destructive transition-colors"
							onClick={(e) => {
								e.stopPropagation();
								// Handle save/favorite
							}}
						>
							<Heart className="h-4 w-4" />
							Save for Later
						</Button>

						<Button
							variant="default"
							size="sm"
							className="gap-2 group-hover:gap-3 transition-all"
						>
							Use Template
							<ArrowRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</Card>
	);
}
