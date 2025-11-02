"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateConfig } from "@/interfaces/templates";
import { Eye, Star, TrendingUp, ArrowRight, Gem } from "lucide-react";
import { TemplatePreview } from "@/components/pages/resume-layout-page/components/TemplatePreview";

interface TemplateCardProps {
	template: TemplateConfig;
	onClick?: () => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
	const { name, description, pricing, metadata, categories } = template;

	return (
		<Card
			onClick={onClick}
			className="group relative overflow-hidden border shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-gradient-to-br from-background via-background to-muted/20 p-0"
		>
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

					{/* Hover Overlay with Details */}
					<div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/70 to-foreground/40 opacity-0 group-hover:opacity-100 transition-all duration-500">
						<div className="absolute inset-0 p-6 flex flex-col justify-between">
							{/* Top: Icon */}
							<div className="flex justify-center">
								<div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
									<Eye className="h-12 w-12 text-background drop-shadow-lg" />
								</div>
							</div>

							{/* Bottom: Details */}
							<div className="space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
								{/* Title */}
								<div>
									<h3 className="text-background font-bold text-xl line-clamp-2 drop-shadow-lg">
										{name}
									</h3>
									<p className="text-background/80 text-sm mt-2 line-clamp-3 leading-relaxed">
										{description}
									</p>
								</div>

								{/* Categories */}
								<div className="flex flex-wrap gap-2">
									{categories.slice(0, 4).map((category) => (
										<Badge
											key={category}
											variant="secondary"
											className="bg-background/20 text-background border-0 backdrop-blur-sm"
										>
											{category}
										</Badge>
									))}
								</div>

								{/* Stats */}
								<div className="flex items-center justify-between text-background/90 text-sm pt-2 border-t border-background/20">
									<div className="flex items-center gap-4">
										<div className="flex items-center gap-1.5">
											<Eye className="h-4 w-4" />
											<span className="font-semibold">
												{metadata.usageCount.toLocaleString()}
											</span>
										</div>
										<div className="flex items-center gap-1.5">
											<Star className="h-4 w-4 fill-yellow-500 text-primary" />
											<span className="font-semibold">
												{metadata.rating.toFixed(1)}
											</span>
										</div>
									</div>
									<ArrowRight className="h-5 w-5 animate-pulse" />
								</div>
							</div>
						</div>
					</div>

					{/* Top Badges */}
					<div className="absolute top-4 left-4 right-4 flex items-center justify-start gap-2 z-10">
						{metadata.usageCount > 50 && (
							<Badge className="border-0 shadow-lg">
								<TrendingUp className="h-5 w-5" />
								Popular
							</Badge>
						)}
						<div>
							{pricing.isPaid ? (
								<Badge className="border-0 shadow-lg">
									<Gem className="h-5 w-5" />$ {pricing.price}
								</Badge>
							) : (
								<Badge className="border shadow-lg font-semibold">
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
