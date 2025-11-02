"use client";

import { TemplateList } from "./TemplateList";
import { TemplateCard } from "./TemplateCard";
import { Button } from "@/components/ui/button";
import { TemplateConfig } from "@/interfaces/templates";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplatesContentProps {
	templates: TemplateConfig[];
	isLoading: boolean;
	gridColumns: 2 | 3;
	viewMode: "card" | "list";
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onTemplateClick: (templateId: string) => void;
	onClearFilters: () => void;
}

export function TemplatesContent({
	templates,
	isLoading,
	gridColumns,
	viewMode,
	currentPage,
	totalPages,
	onPageChange,
	onTemplateClick,
	onClearFilters,
}: TemplatesContentProps) {
	if (isLoading) {
		return (
			<div className="flex-1 flex items-center justify-center">
				<div className="text-center space-y-4">
					<Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
					<div>
						<h3 className="text-lg font-semibold">
							Loading templates...
						</h3>
						<p className="text-muted-foreground text-sm mt-1">
							Please wait while we fetch the best templates for
							you
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
						<h3 className="text-2xl font-semibold">
							No templates found
						</h3>
						<p className="text-muted-foreground mt-2">
							We couldn't find any templates matching your
							criteria. Try adjusting your filters or search
							query.
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
		<div className="h-full flex flex-col overflow-hidden">
			<ScrollArea className="flex-1 overflow-auto">
				{viewMode === "list" ? (
					<div className="space-y-4 pr-4 pb-4">
						{templates.map((template) => (
							<TemplateList
								key={template.id}
								template={template}
								onClick={() => onTemplateClick(template.id)}
							/>
						))}
					</div>
				) : (
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
				)}
			</ScrollArea>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="pt-6">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() =>
										onPageChange(
											Math.max(1, currentPage - 1)
										)
									}
									className={cn(
										"cursor-pointer",
										currentPage === 1 &&
											"pointer-events-none opacity-50"
									)}
								/>
							</PaginationItem>

							{generatePageNumbers().map((page, index) =>
								page === "ellipsis" ? (
									<PaginationItem key={`ellipsis-${index}`}>
										<PaginationEllipsis />
									</PaginationItem>
								) : (
									<PaginationItem key={page}>
										<PaginationLink
											onClick={() => onPageChange(page)}
											isActive={currentPage === page}
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
										onPageChange(
											Math.min(
												totalPages,
												currentPage + 1
											)
										)
									}
									className={cn(
										"cursor-pointer",
										currentPage === totalPages &&
											"pointer-events-none opacity-50"
									)}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	);
}
