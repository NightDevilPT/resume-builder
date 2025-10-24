"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { TemplateConfig } from "@/interfaces/templates";
import { Eye, Filter, DollarSign, Gift } from "lucide-react";
import { templateFactory } from "@/lib/templates/template-factory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TemplatesPage = () => {
	const [templates, setTemplates] = useState<TemplateConfig[]>([]);
	const [filteredTemplates, setFilteredTemplates] = useState<
		TemplateConfig[]
	>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedPrice, setSelectedPrice] = useState("all");
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// Initialize templates
		templateFactory.initializeTemplates();
		const allTemplates = templateFactory.getAllTemplates();
		setTemplates(allTemplates);
		setFilteredTemplates(allTemplates);
		setLoading(false);
	}, []);

	useEffect(() => {
		let filtered = templates;

		// Filter by search query
		if (searchQuery) {
			filtered = templateFactory.searchTemplates(searchQuery);
		}

		// Filter by category
		if (selectedCategory !== "all") {
			filtered = filtered.filter(
				(template) =>
					template.category.toLowerCase() ===
					selectedCategory.toLowerCase()
			);
		}

		// Filter by price
		if (selectedPrice === "free") {
			filtered = filtered.filter((template) => !template.pricing.isPaid);
		} else if (selectedPrice === "paid") {
			filtered = filtered.filter((template) => template.pricing.isPaid);
		}

		setFilteredTemplates(filtered);
	}, [templates, searchQuery, selectedCategory, selectedPrice]);

	const categories = Array.from(
		new Set(templates.map((template) => template.category))
	);

	const getTemplatePreview = (template: TemplateConfig) => {
		return templateFactory.renderSkeleton(template.id, "template-preview", {
			style: {
				transform: "scale(0.6)",
				transformOrigin: "top left",
				width: "167%",
				height: "167%",
				pointerEvents: "none",
				maxHeight: "350px",
				overflow: "hidden",
			},
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">
						Loading templates...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Filters and Search */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Templates Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
					{filteredTemplates.map((template) => (
						<Card
							key={template.id}
							className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 p-4 gap-0"
						>
							<CardHeader className="p-0">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<CardTitle className="text-xl font-semibold text-foreground mb-2">
											{template.name}
										</CardTitle>
									</div>
									{/* Pricing Badge with Icon */}
									<div className="ml-2">
										{template.pricing.isPaid ? (
											<Badge
												variant="default"
												className="flex items-center gap-1.5 px-3 py-1"
											>
												<DollarSign className="h-4 w-4" />
												<span className="font-semibold">
													{templateFactory.templatePrice(
														template.id
													)}
												</span>
											</Badge>
										) : (
											<Badge
												variant="secondary"
												className="flex items-center gap-1.5 px-3 py-1"
											>
												<Gift className="h-4 w-4" />
												<span className="font-semibold">
													Free
												</span>
											</Badge>
										)}
									</div>
								</div>
							</CardHeader>

							<CardContent className="space-y-4 p-0">
								{/* Template Preview */}
								<div className="relative bg-muted/30 rounded-lg overflow-hidden border-2 border-border group-hover:border-primary/30 transition-colors">
									<div className="aspect-[8.5/11] relative overflow-hidden bg-background">
										<div className="absolute inset-0 flex items-start justify-center p-3">
											{getTemplatePreview(template)}
										</div>
									</div>
									<div className="absolute inset-0 bg-background/0 group-hover:bg-background/80 transition-all duration-300 flex items-center justify-center">
										<Button
											variant="secondary"
											size="sm"
											className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
											onClick={() => {
												router.push(
													`/templates/${template.id}/resume`
												);
											}}
										>
											<Eye className="h-4 w-4 mr-2" />
											Preview
										</Button>
									</div>
								</div>

								{/* Template Preview Description */}
								<div className="text-center">
									<p className="text-xs text-muted-foreground">
										Preview shows the template structure and
										layout
									</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* No Results */}
				{filteredTemplates.length === 0 && (
					<Card className="text-center py-12">
						<CardContent>
							<Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium text-foreground mb-2">
								No templates found
							</h3>
							<p className="text-muted-foreground mb-4">
								Try adjusting your search criteria or browse all
								templates.
							</p>
							<Button
								variant="outline"
								onClick={() => {
									setSearchQuery("");
									setSelectedCategory("all");
									setSelectedPrice("all");
								}}
							>
								Clear Filters
							</Button>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Footer CTA */}
			<div className="bg-primary text-primary-foreground py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl font-bold mb-4">
						Ready to Create Your Resume?
					</h2>
					<p className="text-xl mb-6 opacity-90">
						Choose from our professional templates and start
						building your perfect resume today.
					</p>
					<Button size="lg" variant="secondary" asChild>
						<Link href="/resume">Get Started</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default TemplatesPage;
