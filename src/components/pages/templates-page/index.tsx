"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { API_URLS } from "@/constants/api-urls";
import { TemplateConfig } from "@/interfaces/templates";
import { apiClient } from "@/lib/services/api-client.service";
import { TemplatesFilter } from "./components/TemplatesFilter";
import { TemplatesContent } from "./components/TemplatesContent";
import { Button } from "@/components/ui/button";
import { Grid3x3, LayoutGrid, Sparkles } from "lucide-react";

export default function TemplatesPage() {
	const router = useRouter();
	const [templates, setTemplates] = useState<TemplateConfig[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [priceFilter, setPriceFilter] = useState("all");
	const [sortBy, setSortBy] = useState("createdAt-desc");
	const [gridColumns, setGridColumns] = useState<2 | 3>(3);

	useEffect(() => {
		fetchTemplates();
	}, []);

	const fetchTemplates = async () => {
		try {
			setIsLoading(true);
			const response = await apiClient.getAll<TemplateConfig>(
				API_URLS.TEMPLATE,
				{
					isPublished: true,
					pageSize: 100,
				}
			);

			if (response.success && response.data) {
				const activeTemplates = response.data.filter(
					(t) => t.metadata.isActive && t.metadata.isPublished
				);
				setTemplates(activeTemplates);
			}
		} catch (error) {
			toast.error("Failed to load templates");
		} finally {
			setIsLoading(false);
		}
	};

	const filteredTemplates = templates
		.filter((template) => {
			const matchesSearch =
				searchQuery === "" ||
				template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				template.description
					.toLowerCase()
					.includes(searchQuery.toLowerCase());

			const matchesCategory =
				selectedCategory === "all" ||
				template.categories.some(
					(cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
				);

			const matchesPrice =
				priceFilter === "all" ||
				(priceFilter === "free" && !template.pricing.isPaid) ||
				(priceFilter === "paid" && template.pricing.isPaid);

			return matchesSearch && matchesCategory && matchesPrice;
		})
		.sort((a, b) => {
			const [field, order] = sortBy.split("-");
			let comparison = 0;
			if (field === "name") comparison = a.name.localeCompare(b.name);
			else if (field === "rating")
				comparison = a.metadata.rating - b.metadata.rating;
			else if (field === "usageCount")
				comparison = a.metadata.usageCount - b.metadata.usageCount;
			else
				comparison =
					new Date(a.metadata.createdAt).getTime() -
					new Date(b.metadata.createdAt).getTime();
			return order === "desc" ? -comparison : comparison;
		});

	const activeFiltersCount =
		(searchQuery ? 1 : 0) +
		(selectedCategory !== "all" ? 1 : 0) +
		(priceFilter !== "all" ? 1 : 0);

	const handleClearFilters = () => {
		setSearchQuery("");
		setSelectedCategory("all");
		setPriceFilter("all");
	};

	const handleTemplateClick = (templateId: string) => {
		router.push(`/templates/${templateId}/resume`);
	};

	return (
		<div className="h-full overflow-hidden bg-background flex flex-col">
			{/* Main Content */}
			<div className="container mx-auto px-6 py-8 flex-1 overflow-hidden">
				<div className="h-full grid grid-cols-[300px_1fr] gap-6 overflow-hidden">
					{/* Filters Sidebar */}
					<div className="overflow-hidden">
						<TemplatesFilter
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							selectedCategory={selectedCategory}
							setSelectedCategory={setSelectedCategory}
							priceFilter={priceFilter}
							setPriceFilter={setPriceFilter}
							sortBy={sortBy}
							setSortBy={setSortBy}
							activeFiltersCount={activeFiltersCount}
							onClearFilters={handleClearFilters}
						/>
					</div>

					{/* Templates Grid */}
					<div className="overflow-hidden flex flex-col gap-4">
						{/* Header with Grid Toggle */}
						<div className="flex items-center justify-between">
							<p className="text-sm text-muted-foreground">
								<span className="font-semibold text-foreground">
									{filteredTemplates.length}
								</span>{" "}
								{filteredTemplates.length === 1 ? "template" : "templates"}
							</p>
							<div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
								<Button
									variant={gridColumns === 2 ? "default" : "ghost"}
									size="icon"
									onClick={() => setGridColumns(2)}
									className="h-8 w-8"
								>
									<LayoutGrid className="h-4 w-4" />
								</Button>
								<Button
									variant={gridColumns === 3 ? "default" : "ghost"}
									size="icon"
									onClick={() => setGridColumns(3)}
									className="h-8 w-8"
								>
									<Grid3x3 className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Content */}
						<TemplatesContent
							templates={filteredTemplates}
							isLoading={isLoading}
							gridColumns={gridColumns}
							onTemplateClick={handleTemplateClick}
							onClearFilters={handleClearFilters}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
