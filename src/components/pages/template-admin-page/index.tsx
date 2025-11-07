"use client";

import {
	Plus,
	Search,
	Edit,
	Trash2,
	Eye,
	EyeOff,
	FileText,
	Loader2,
} from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	TEMPLATE_CATEGORIES,
	TEMPLATE_PRICE_FILTERS,
	TEMPLATE_STATUS_FILTERS,
	ITEMS_PER_PAGE_OPTIONS,
} from "@/constants/template-filters";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_URLS } from "@/constants/api-urls";
import { LayoutGrid, LayoutList, X } from "lucide-react";
import { TemplateConfig } from "@/interfaces/templates";
import { apiClient } from "@/lib/services/api-client.service";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Template Admin Page
 * Admin panel for managing templates (CRUD operations)
 * Supports both card view and table view with pagination and filters
 */
export default function TemplateAdminPage() {
	const router = useRouter();
	const [templates, setTemplates] = useState<TemplateConfig[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [viewMode, setViewMode] = useState<"card" | "table">("table");
	const [currentPage, setCurrentPage] = useState(1);
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [pricingFilter, setPricingFilter] = useState("all");
	const [itemsPerPage, setItemsPerPage] = useState(10);

	useEffect(() => {
		fetchTemplates();
	}, []);

	const fetchTemplates = async () => {
		try {
			setIsLoading(true);
			const response = await apiClient.getAll<TemplateConfig>(
				API_URLS.TEMPLATE,
				{ pageSize: 100 }
			);

			if (response.success && response.data) {
				setTemplates(response.data);
			}
		} catch (error) {
			toast.error("Failed to load templates");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateNew = () => {
		router.push("/templates/admin/create");
	};

	const handleEdit = (templateId: string) => {
		router.push(`/templates/admin/edit/${templateId}`);
	};

	const handleDelete = async (templateId: string, templateName: string) => {
		if (!confirm(`Are you sure you want to delete "${templateName}"?`)) {
			return;
		}

		try {
			await apiClient.delete(`${API_URLS.TEMPLATE}/${templateId}`);
			toast.success("Template deleted successfully");
			fetchTemplates();
		} catch (error) {
			toast.error("Failed to delete template");
		}
	};

	const handleTogglePublish = async (template: TemplateConfig) => {
		try {
			await apiClient.put(`${API_URLS.TEMPLATE}/${template.id}`, {
				...template,
				metadata: {
					...template.metadata,
					isPublished: !template.metadata.isPublished,
				},
			});
			toast.success(
				template.metadata.isPublished
					? "Template unpublished"
					: "Template published"
			);
			fetchTemplates();
		} catch (error) {
			toast.error("Failed to update template");
		}
	};

	// Reset to page 1 when filters or items per page change
	useEffect(() => {
		setCurrentPage(1);
	}, [
		searchQuery,
		categoryFilter,
		statusFilter,
		pricingFilter,
		itemsPerPage,
	]);

	// Apply filters
	const filteredTemplates = templates.filter((template) => {
		// Search filter
		const matchesSearch =
			searchQuery === "" ||
			template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			template.description
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

		// Category filter
		const matchesCategory =
			categoryFilter === "all" ||
			template.categories.some(
				(cat) => cat.toLowerCase() === categoryFilter.toLowerCase()
			);

		// Status filter
		const matchesStatus =
			statusFilter === "all" ||
			(statusFilter === "published" && template.metadata.isPublished) ||
			(statusFilter === "draft" && !template.metadata.isPublished) ||
			(statusFilter === "inactive" && !template.metadata.isActive);

		// Pricing filter
		const matchesPricing =
			pricingFilter === "all" ||
			(pricingFilter === "free" && !template.pricing.isPaid) ||
			(pricingFilter === "paid" && template.pricing.isPaid);

		return (
			matchesSearch && matchesCategory && matchesStatus && matchesPricing
		);
	});

	// Pagination
	const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);

	// Generate page numbers with ellipsis
	const generatePageNumbers = () => {
		const pages: (number | "ellipsis")[] = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible + 2) {
			// Show all pages
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			if (currentPage > 3) {
				pages.push("ellipsis");
			}

			// Show pages around current page
			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push("ellipsis");
			}

			// Always show last page
			if (totalPages > 1) {
				pages.push(totalPages);
			}
		}

		return pages;
	};

	return (
		<div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<CardTitle className="text-xl sm:text-2xl">
								Template Management
							</CardTitle>
							<p className="text-xs sm:text-sm text-muted-foreground mt-1">
								Create, edit, and manage resume templates
							</p>
						</div>
						<Button
							onClick={handleCreateNew}
							className="gap-2 w-full sm:w-auto"
						>
							<Plus className="h-4 w-4" />
							<span className="sm:inline">Create Template</span>
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{/* Search & View Toggle */}
					<div className="flex flex-col gap-4 mb-6">
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search templates..."
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									className="pl-10"
								/>
							</div>
							<Tabs
								value={viewMode}
								onValueChange={(v) =>
									setViewMode(v as "card" | "table")
								}
								className="w-full sm:w-auto"
							>
								<TabsList className="grid w-full grid-cols-2 sm:w-auto">
									<TabsTrigger
										value="table"
										className="gap-2"
									>
										<LayoutList className="h-4 w-4" />
										<span className="hidden sm:inline">
											Table
										</span>
									</TabsTrigger>
									<TabsTrigger value="card" className="gap-2">
										<LayoutGrid className="h-4 w-4" />
										<span className="hidden sm:inline">
											Cards
										</span>
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>

						{/* Filters */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:flex-wrap gap-3">
							{/* Category Filter */}
							<Select
								value={categoryFilter}
								onValueChange={setCategoryFilter}
							>
								<SelectTrigger className="w-full xl:w-[180px]">
									<SelectValue placeholder="Category" />
								</SelectTrigger>
								<SelectContent>
									{TEMPLATE_CATEGORIES.map((cat) => (
										<SelectItem key={cat.id} value={cat.id}>
											{cat.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{/* Status Filter */}
							<Select
								value={statusFilter}
								onValueChange={setStatusFilter}
							>
								<SelectTrigger className="w-full xl:w-[180px]">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									{TEMPLATE_STATUS_FILTERS.map((status) => (
										<SelectItem
											key={status.id}
											value={status.id}
										>
											{status.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{/* Pricing Filter */}
							<Select
								value={pricingFilter}
								onValueChange={setPricingFilter}
							>
								<SelectTrigger className="w-full xl:w-[180px]">
									<SelectValue placeholder="Pricing" />
								</SelectTrigger>
								<SelectContent>
									{TEMPLATE_PRICE_FILTERS.map((price) => (
										<SelectItem
											key={price.id}
											value={price.id}
										>
											{price.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{/* Items Per Page */}
							<Select
								value={itemsPerPage.toString()}
								onValueChange={(v) =>
									setItemsPerPage(Number(v))
								}
							>
								<SelectTrigger className="w-full xl:w-[140px]">
									<SelectValue placeholder="Per page" />
								</SelectTrigger>
								<SelectContent>
									{ITEMS_PER_PAGE_OPTIONS.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value.toString()}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{/* Clear Filters */}
							{(categoryFilter !== "all" ||
								statusFilter !== "all" ||
								pricingFilter !== "all" ||
								searchQuery) && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										setCategoryFilter("all");
										setStatusFilter("all");
										setPricingFilter("all");
										setSearchQuery("");
									}}
									className="sm:col-span-2 lg:col-span-4 xl:w-auto"
								>
									Clear Filters
								</Button>
							)}
						</div>
					</div>

					{/* Loading State */}
					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
						</div>
					) : filteredTemplates.length === 0 ? (
						<div className="text-center py-12">
							<FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">
								No templates found
							</h3>
							<p className="text-sm text-muted-foreground mb-4">
								{searchQuery
									? "Try a different search term"
									: "Get started by creating your first template"}
							</p>
							{!searchQuery && (
								<Button
									onClick={handleCreateNew}
									className="gap-2"
								>
									<Plus className="h-4 w-4" />
									Create Template
								</Button>
							)}
						</div>
					) : viewMode === "table" ? (
						/* Table View - Scrollable on mobile */
						<div className="overflow-x-auto -mx-4 sm:mx-0">
							<Table className="min-w-[800px]">
								<TableHeader>
									<TableRow>
										<TableHead className="min-w-[200px] px-4">
											Template
										</TableHead>
										<TableHead className="min-w-[150px]">
											Categories
										</TableHead>
										<TableHead className="min-w-[100px]">
											Pricing
										</TableHead>
										<TableHead className="min-w-[100px]">
											Status
										</TableHead>
										<TableHead className="min-w-[80px]">
											Usage
										</TableHead>
										<TableHead className="text-right min-w-[180px] px-4">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{paginatedTemplates.map((template) => (
										<TableRow key={template.id}>
											<TableCell className="px-4">
												<div className="flex items-center gap-2 sm:gap-3">
													<div className="w-10 h-14 sm:w-12 sm:h-16 bg-muted rounded border overflow-hidden shrink-0">
														{template.thumbnail && (
															<img
																src={
																	template.thumbnail
																}
																alt={
																	template.name
																}
																className="w-full h-full object-cover"
															/>
														)}
													</div>
													<div className="min-w-0">
														<p className="font-medium text-sm truncate">
															{template.name}
														</p>
														<p className="text-xs text-muted-foreground line-clamp-1">
															{
																template.description
															}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex flex-wrap gap-1">
													{template.categories
														.slice(0, 2)
														.map((cat) => (
															<Badge
																key={cat}
																variant="outline"
																className="text-xs"
															>
																{cat}
															</Badge>
														))}
													{template.categories
														.length > 2 && (
														<Badge
															variant="outline"
															className="text-xs"
														>
															+
															{template.categories
																.length - 2}
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell>
												<Badge
													variant={
														template.pricing.isPaid
															? "default"
															: "secondary"
													}
												>
													{template.pricing.isPaid
														? `$${template.pricing.price}`
														: "Free"}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex flex-col gap-1">
													<Badge
														variant={
															template.metadata
																.isPublished
																? "default"
																: "outline"
														}
													>
														{template.metadata
															.isPublished
															? "Published"
															: "Draft"}
													</Badge>
													{!template.metadata
														.isActive && (
														<Badge
															variant="destructive"
															className="text-xs"
														>
															Inactive
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell>
												<p className="text-sm">
													{
														template.metadata
															.usageCount
													}{" "}
													uses
												</p>
											</TableCell>
											<TableCell className="px-4">
												<div className="flex items-center justify-end gap-1 sm:gap-2">
													<Button
														variant="ghost"
														size="icon"
														onClick={() =>
															router.push(
																`/templates/${template.id}/resume`
															)
														}
														title="Use this template to create resume"
														className="h-8 w-8 sm:h-9 sm:w-9"
													>
														<FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() =>
															handleTogglePublish(
																template
															)
														}
														title={
															template.metadata
																.isPublished
																? "Unpublish"
																: "Publish"
														}
														className="h-8 w-8 sm:h-9 sm:w-9"
													>
														{template.metadata
															.isPublished ? (
															<EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
														) : (
															<Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
														)}
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() =>
															handleEdit(
																template.id
															)
														}
														title="Edit template"
														className="h-8 w-8 sm:h-9 sm:w-9"
													>
														<Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() =>
															handleDelete(
																template.id,
																template.name
															)
														}
														title="Delete template"
														className="text-destructive hover:text-destructive h-8 w-8 sm:h-9 sm:w-9"
													>
														<Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						/* Card View */
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{paginatedTemplates.map((template) => (
								<Card
									key={template.id}
									className="flex flex-col"
								>
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<CardTitle className="text-base line-clamp-1">
													{template.name}
												</CardTitle>
												<CardDescription className="text-xs mt-1 line-clamp-2">
													{template.description}
												</CardDescription>
											</div>
											<Badge
												variant={
													template.pricing.isPaid
														? "default"
														: "secondary"
												}
												className="shrink-0"
											>
												{template.pricing.isPaid
													? `$${template.pricing.price}`
													: "Free"}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="pb-3 space-y-3 flex-1">
										{/* Template Thumbnail */}
										{/* {template.thumbnail && (
											<div className="w-full aspect-[8.5/11] bg-muted rounded border overflow-hidden">
												<img
													src={template.thumbnail}
													alt={template.name}
													className="w-full h-full object-cover"
												/>
											</div>
										)} */}

										{/* Status Badges */}
										<div className="flex flex-wrap gap-2">
											<Badge
												variant={
													template.metadata
														.isPublished
														? "default"
														: "outline"
												}
												className="text-xs"
											>
												{template.metadata.isPublished
													? "Published"
													: "Draft"}
											</Badge>
											{!template.metadata.isActive && (
												<Badge
													variant="destructive"
													className="text-xs"
												>
													Inactive
												</Badge>
											)}
										</div>

										{/* Categories */}
										<div className="flex flex-wrap gap-1">
											{template.categories
												.slice(0, 3)
												.map((cat) => (
													<Badge
														key={cat}
														variant="outline"
														className="text-xs"
													>
														{cat}
													</Badge>
												))}
											{template.categories.length > 3 && (
												<Badge
													variant="outline"
													className="text-xs"
												>
													+
													{template.categories
														.length - 3}
												</Badge>
											)}
										</div>

										{/* Stats */}
										<div className="flex items-center justify-between text-xs text-muted-foreground">
											<span>
												{template.metadata.usageCount}{" "}
												uses
											</span>
											<span>
												{template.metadata.rating.toFixed(
													1
												)}
												⭐
											</span>
										</div>
									</CardContent>
									<CardFooter className="pt-3 flex-col gap-2">
										{/* Use Template Button */}
										<Button
											size="sm"
											className="w-full gap-2"
											onClick={() =>
												router.push(
													`/templates/${template.id}/resume`
												)
											}
										>
											<FileText className="h-3.5 w-3.5" />
											Use Template
										</Button>

										{/* Admin Actions */}
										<div className="flex items-center gap-2 w-full">
											<Button
												variant="outline"
												size="sm"
												className="flex-1 gap-2"
												onClick={() =>
													handleEdit(template.id)
												}
											>
												<Edit className="h-3.5 w-3.5" />
												Edit
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													handleTogglePublish(
														template
													)
												}
												title={
													template.metadata
														.isPublished
														? "Unpublish"
														: "Publish"
												}
											>
												{template.metadata
													.isPublished ? (
													<EyeOff className="h-3.5 w-3.5" />
												) : (
													<Eye className="h-3.5 w-3.5" />
												)}
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													handleDelete(
														template.id,
														template.name
													)
												}
												title="Delete template"
												className="text-destructive hover:text-destructive"
											>
												<Trash2 className="h-3.5 w-3.5" />
											</Button>
										</div>
									</CardFooter>
								</Card>
							))}
						</div>
					)}

					{/* Pagination */}
					{!isLoading && filteredTemplates.length > 0 && (
						<div className="mt-6 pt-6 border-t">
							<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
								{/* Summary */}
								<p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
									Showing {startIndex + 1}-
									{Math.min(
										endIndex,
										filteredTemplates.length
									)}{" "}
									of {filteredTemplates.length} templates
									{searchQuery &&
										` matching "${searchQuery}"`}
								</p>

								{/* Pagination Controls */}
								{totalPages > 1 && (
									<Pagination>
										<PaginationContent>
											<PaginationItem>
												<PaginationPrevious
													onClick={() =>
														setCurrentPage(
															Math.max(
																1,
																currentPage - 1
															)
														)
													}
													className={cn(
														"cursor-pointer",
														currentPage === 1 &&
															"pointer-events-none opacity-50"
													)}
												/>
											</PaginationItem>

											{generatePageNumbers().map(
												(page, index) =>
													page === "ellipsis" ? (
														<PaginationItem
															key={`ellipsis-${index}`}
														>
															<PaginationEllipsis />
														</PaginationItem>
													) : (
														<PaginationItem
															key={page}
														>
															<PaginationLink
																onClick={() =>
																	setCurrentPage(
																		page
																	)
																}
																isActive={
																	currentPage ===
																	page
																}
																className="cursor-pointer"
															>
																{page}
															</PaginationLink>
														</PaginationItem>
													)
											)}

											<PaginationItem>
												<PaginationNext
													onClick={() =>
														setCurrentPage(
															Math.min(
																totalPages,
																currentPage + 1
															)
														)
													}
													className={cn(
														"cursor-pointer",
														currentPage ===
															totalPages &&
															"pointer-events-none opacity-50"
													)}
												/>
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								)}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
