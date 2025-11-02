"use client";

import { TemplateConfig } from "@/interfaces/templates";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Star, Sparkles, TrendingUp } from "lucide-react";
import { TemplatePreview } from "@/components/pages/resume-layout-page/components/TemplatePreview";

interface TemplateCardProps {
	template: TemplateConfig;
	onClick?: () => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
	const { name, description, pricing, metadata, categories } = template;

	return (
		<Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-gradient-to-br from-background via-background to-muted/20 p-0">
			{/* Animated gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

			<div className="relative">
				{/* Preview Section */}
				<div className="relative w-full h-[450px] bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden rounded-t-xl">
					{/* Decorative elements */}
					<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
					<div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />

					<div className="absolute inset-0 flex items-center justify-center p-6">
						<div
							className="origin-center pointer-events-none transform group-hover:scale-105 transition-transform duration-500"
							style={{
								transform: "scale(0.48)",
							}}
						>
							<TemplatePreview config={template} />
						</div>
					</div>

					{/* Hover Overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
						<div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
							<div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
								<Eye className="h-14 w-14 text-white drop-shadow-lg" />
							</div>
							<div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
								<p className="text-white font-bold text-xl tracking-wide drop-shadow-lg">
									Use This Template
								</p>
								<p className="text-white/80 text-sm mt-1 text-center">
									Click to get started
								</p>
							</div>
						</div>
					</div>

					{/* Top Badges */}
					<div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
						{metadata.usageCount > 50 && (
							<Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg gap-1">
								<TrendingUp className="h-3 w-3" />
								Popular
							</Badge>
						)}
						<div className="ml-auto">
							{pricing.isPaid ? (
								<Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 shadow-lg font-semibold">
									${pricing.price}
								</Badge>
							) : (
								<Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg font-semibold">
									FREE
								</Badge>
							)}
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
