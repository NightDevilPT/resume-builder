"use client";

import {
	Search,
	FileText,
	Sparkles,
	Type,
	TrendingUp,
	Star,
	Filter,
	DollarSign,
	Clock,
	X,
	Check,
	LayoutGrid,
	List
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const CATEGORIES = [
	{ id: "all", label: "All Templates", icon: FileText, count: 0 },
	{ id: "modern", label: "Modern", icon: Sparkles, count: 0 },
	{ id: "classic", label: "Classic", icon: Type, count: 0 },
	{ id: "creative", label: "Creative", icon: TrendingUp, count: 0 },
	{ id: "professional", label: "Professional", icon: Star, count: 0 },
	{ id: "minimal", label: "Minimal", icon: Filter, count: 0 },
	{ id: "bold", label: "Bold", icon: TrendingUp, count: 0 },
];

const PRICE_FILTERS = [
	{ id: "all", label: "All Prices", desc: "Show everything" },
	{ id: "free", label: "Free", desc: "No cost templates" },
	{ id: "paid", label: "Premium", desc: "Paid templates" },
];

const SORT_OPTIONS = [
	{ id: "createdAt-desc", label: "Newest", desc: "Latest additions" },
	{ id: "rating-desc", label: "Top Rated", desc: "Highest ratings" },
	{ id: "usageCount-desc", label: "Popular", desc: "Most used" },
	{ id: "name-asc", label: "A-Z", desc: "Alphabetical" },
];

interface TemplatesFilterProps {
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	selectedCategory: string;
	setSelectedCategory: (value: string) => void;
	priceFilter: string;
	setPriceFilter: (value: string) => void;
	sortBy: string;
	setSortBy: (value: string) => void;
	viewMode: "card" | "list";
	setViewMode: (mode: "card" | "list") => void;
	gridColumns: 2 | 3;
	setGridColumns: (cols: 2 | 3) => void;
	activeFiltersCount: number;
	onClearFilters: () => void;
}

export function TemplatesFilter({
	searchQuery,
	setSearchQuery,
	selectedCategory,
	setSelectedCategory,
	priceFilter,
	setPriceFilter,
	sortBy,
	setSortBy,
	viewMode,
	setViewMode,
	gridColumns,
	setGridColumns,
	activeFiltersCount,
	onClearFilters,
}: TemplatesFilterProps) {
	return (
		<ScrollArea className="h-[calc(100vh-100px)] pr-4">
			<div className="space-y-3">
				{/* Search */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 px-1">
						<Search className="h-3.5 w-3.5 text-muted-foreground" />
						<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Search
						</span>
					</div>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Find templates..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 h-11 border-muted-foreground/20 focus-visible:ring-1"
						/>
					</div>
				</div>

				<Separator className="bg-muted-foreground/10" />

				{/* Categories */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 px-1">
						<FileText className="h-3.5 w-3.5 text-muted-foreground" />
						<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Category
						</span>
					</div>
					<div className="grid grid-cols-2 gap-2">
						{CATEGORIES.map((category) => {
							const Icon = category.icon;
							const isActive = selectedCategory === category.id;
							return (
								<button
									key={category.id}
									onClick={() =>
										setSelectedCategory(category.id)
									}
									className={cn(
										"group relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-200 min-h-[80px]",
										isActive
											? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
											: "bg-accent/30 text-muted-foreground hover:text-foreground hover:bg-accent/60 hover:scale-[1.02]"
									)}
								>
									<Icon
										className={cn(
											"h-6 w-6 transition-transform duration-200 group-hover:scale-110",
											isActive &&
												"text-primary-foreground"
										)}
									/>
									<span className="text-xs font-semibold text-center leading-tight">
										{category.label}
									</span>

									{isActive && (
										<div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary-foreground/20 flex items-center justify-center">
											<Check className="h-2.5 w-2.5 text-primary-foreground" />
										</div>
									)}
								</button>
							);
						})}
					</div>
				</div>

				<Separator className="bg-muted-foreground/10" />

				{/* Price */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 px-1">
						<DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
						<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Price Range
						</span>
					</div>
					<div className="grid grid-cols-2 gap-2">
						{PRICE_FILTERS.map((filter) => {
							const isActive = priceFilter === filter.id;
							return (
								<button
									key={filter.id}
									onClick={() => setPriceFilter(filter.id)}
									className={cn(
										"group relative flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all duration-200 border-2 min-h-[70px]",
										isActive
											? "bg-primary text-primary-foreground border-primary shadow-md"
											: "bg-accent/20 border-transparent hover:bg-accent/40 hover:border-border"
									)}
								>
									<div
										className={cn(
											"text-xs font-bold text-center",
											isActive &&
												"text-primary-foreground"
										)}
									>
										{filter.label}
									</div>
									<div
										className={cn(
											"text-[10px] leading-tight text-center",
											isActive
												? "text-primary-foreground/80"
												: "text-muted-foreground"
										)}
									>
										{filter.desc}
									</div>
									{isActive && (
										<div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary-foreground/20 flex items-center justify-center">
											<Check className="h-2.5 w-2.5 text-primary-foreground" />
										</div>
									)}
								</button>
							);
						})}
					</div>
				</div>

				<Separator className="bg-muted-foreground/10" />

				{/* Sort */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 px-1">
						<TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
						<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Sort By
						</span>
					</div>
					<div className="grid grid-cols-2 gap-2">
						{SORT_OPTIONS.map((option) => {
							const isActive = sortBy === option.id;
							return (
								<button
									key={option.id}
									onClick={() => setSortBy(option.id)}
									className={cn(
										"group relative flex flex-col items-start gap-1 p-3 rounded-xl transition-all duration-200 border-2 min-h-[70px]",
										isActive
											? "bg-primary text-primary-foreground border-primary shadow-md"
											: "bg-accent/20 border-transparent hover:bg-accent/40 hover:border-border"
									)}
								>
									<div
										className={cn(
											"text-xs font-bold",
											isActive &&
												"text-primary-foreground"
										)}
									>
										{option.label}
									</div>
									<div
										className={cn(
											"text-[10px] leading-tight",
											isActive
												? "text-primary-foreground/80"
												: "text-muted-foreground"
										)}
									>
										{option.desc}
									</div>
									{isActive && (
										<div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary-foreground/20 flex items-center justify-center">
											<Check className="h-2.5 w-2.5 text-primary-foreground" />
										</div>
									)}
								</button>
							);
						})}
					</div>
				</div>

				<Separator className="bg-muted-foreground/10" />

				{/* View Layout */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 px-1">
						<LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
						<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							View Layout
						</span>
					</div>
					
					{/* View Mode Toggle */}
					<div className="grid grid-cols-2 gap-2">
						<button
							onClick={() => setViewMode("card")}
							className={cn(
								"flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-200 border-2 min-h-[70px]",
								viewMode === "card"
									? "bg-primary text-primary-foreground border-primary shadow-md"
									: "bg-accent/20 border-transparent hover:bg-accent/40 hover:border-border"
							)}
						>
							<LayoutGrid className={cn("h-5 w-5", viewMode === "card" && "text-primary-foreground")} />
							<span className={cn("text-xs font-bold", viewMode === "card" && "text-primary-foreground")}>
								Card
							</span>
							{viewMode === "card" && (
								<div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary-foreground/20 flex items-center justify-center">
									<Check className="h-2.5 w-2.5 text-primary-foreground" />
								</div>
							)}
						</button>
						
						<button
							onClick={() => setViewMode("list")}
							className={cn(
								"flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-200 border-2 min-h-[70px]",
								viewMode === "list"
									? "bg-primary text-primary-foreground border-primary shadow-md"
									: "bg-accent/20 border-transparent hover:bg-accent/40 hover:border-border"
							)}
						>
							<List className={cn("h-5 w-5", viewMode === "list" && "text-primary-foreground")} />
							<span className={cn("text-xs font-bold", viewMode === "list" && "text-primary-foreground")}>
								List
							</span>
							{viewMode === "list" && (
								<div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary-foreground/20 flex items-center justify-center">
									<Check className="h-2.5 w-2.5 text-primary-foreground" />
								</div>
							)}
						</button>
					</div>
				</div>

				{/* Clear Filters */}
				{activeFiltersCount > 0 && (
					<>
						<Separator className="bg-muted-foreground/10" />
						<Button
							variant="outline"
							onClick={onClearFilters}
							className="w-full h-11 gap-2 font-semibold border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
						>
							<X className="h-4 w-4" />
							Clear {activeFiltersCount} Filter
							{activeFiltersCount > 1 ? "s" : ""}
						</Button>
					</>
				)}
			</div>
		</ScrollArea>
	);
}
