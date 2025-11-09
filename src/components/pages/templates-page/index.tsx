"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { API_URLS } from "@/constants/api-urls";
import { TemplateConfig } from "@/interfaces/templates";
import { apiClient } from "@/lib/services/api-client.service";
import { TemplatesFilter } from "./components/TemplatesFilter";
import { TemplatesContent } from "./components/TemplatesContent";

export default function TemplatesPage() {
	const router = useRouter();
	const [templates, setTemplates] = useState<TemplateConfig[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [priceFilter, setPriceFilter] = useState("all");
	const [sortBy, setSortBy] = useState("createdAt-desc");
	const [gridColumns, setGridColumns] = useState<2 | 3>(3);
	const [viewMode, setViewMode] = useState<"card" | "list">("card");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const itemsPerPage = 12;

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

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, selectedCategory, priceFilter, sortBy]);

	const allFilteredTemplates = templates
		.filter((template) => {
			const matchesSearch =
				searchQuery === "" ||
				template.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				template.description
					.toLowerCase()
					.includes(searchQuery.toLowerCase());

			const matchesCategory =
				selectedCategory === "all" ||
				template.categories.some(
					(cat) =>
						cat.toLowerCase() === selectedCategory.toLowerCase()
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

	// Calculate pagination
	const totalItems = allFilteredTemplates.length;
	const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);

	useEffect(() => {
		setTotalPages(calculatedTotalPages);
	}, [calculatedTotalPages]);

	// Get current page templates
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const filteredTemplates = allFilteredTemplates.slice(startIndex, endIndex);

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
		router.push(`/templates/${templateId}`);
	};

	return (
		<div className="h-full bg-background flex flex-col">
			{/* Main Content */}
			<div className="container mx-auto px-6 py-8 overflow-hidden">
				<div className="h-full grid grid-cols-[300px_1fr] gap-6">
					{/* Filters Sidebar */}
					<TemplatesFilter
						viewMode={viewMode}
						setViewMode={setViewMode}
						gridColumns={gridColumns}
						setGridColumns={setGridColumns}
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
					{/* Content */}
					<TemplatesContent
						templates={filteredTemplates}
						isLoading={isLoading}
						gridColumns={gridColumns}
						viewMode={viewMode}
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
						onTemplateClick={handleTemplateClick}
						onClearFilters={handleClearFilters}
					/>
				</div>
			</div>
		</div>
	);
}
