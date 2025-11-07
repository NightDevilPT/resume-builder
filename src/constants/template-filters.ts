import {
	FileText,
	Sparkles,
	Type,
	TrendingUp,
	Star,
	Filter,
} from "lucide-react";

/**
 * Template Filter Constants
 * Shared between user templates page and admin templates page
 */

export const TEMPLATE_CATEGORIES = [
	{ id: "all", label: "All Templates", icon: FileText, count: 0 },
	{ id: "modern", label: "Modern", icon: Sparkles, count: 0 },
	{ id: "classic", label: "Classic", icon: Type, count: 0 },
	{ id: "creative", label: "Creative", icon: TrendingUp, count: 0 },
	{ id: "professional", label: "Professional", icon: Star, count: 0 },
	{ id: "minimal", label: "Minimal", icon: Filter, count: 0 },
	{ id: "bold", label: "Bold", icon: TrendingUp, count: 0 },
];

export const TEMPLATE_PRICE_FILTERS = [
	{ id: "all", label: "All Prices", desc: "Show everything" },
	{ id: "free", label: "Free", desc: "No cost templates" },
	{ id: "paid", label: "Premium", desc: "Paid templates" },
];

export const TEMPLATE_SORT_OPTIONS = [
	{ id: "createdAt-desc", label: "Newest", desc: "Latest additions" },
	{ id: "rating-desc", label: "Top Rated", desc: "Highest ratings" },
	{ id: "usageCount-desc", label: "Popular", desc: "Most used" },
	{ id: "name-asc", label: "A-Z", desc: "Alphabetical" },
];

export const TEMPLATE_STATUS_FILTERS = [
	{ id: "all", label: "All Status" },
	{ id: "published", label: "Published" },
	{ id: "draft", label: "Draft" },
	{ id: "inactive", label: "Inactive" },
];

export const ITEMS_PER_PAGE_OPTIONS = [
	{ value: 5, label: "5 per page" },
	{ value: 10, label: "10 per page" },
	{ value: 20, label: "20 per page" },
	{ value: 50, label: "50 per page" },
	{ value: 100, label: "100 per page" },
];

