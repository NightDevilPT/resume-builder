/**
 * Template Helper Utilities
 * Reusable functions for template rendering and formatting
 */

import { LayoutConfig } from "@/interfaces/templates";

/**
 * Convert font size name to rem value (scaled for A4 preview)
 */
export function getFontSize(size: string): string {
	const sizeMap: Record<string, string> = {
		xs: "0.65rem",
		sm: "0.75rem",
		base: "0.85rem",
		lg: "0.95rem",
		xl: "1.1rem",
		"2xl": "1.3rem",
		"3xl": "1.6rem",
		"4xl": "1.9rem",
	};
	return sizeMap[size] || "0.85rem";
}

/**
 * Format date based on specified format type
 */
export function formatDate(
	date: Date | null,
	format: "short" | "long" | "year-only"
): string | null {
	if (!date) return null;

	switch (format) {
		case "year-only":
			return date.getFullYear().toString();
		case "long":
			return date.toLocaleDateString("en-US", {
				month: "long",
				year: "numeric",
			});
		case "short":
		default:
			return date.toLocaleDateString("en-US", {
				month: "short",
				year: "numeric",
			});
	}
}

/**
 * Format date range (e.g., "Jan 2020 - Present")
 */
export function formatDateRange(
	startDate: Date,
	endDate: Date | null,
	format: "short" | "long" | "year-only",
	currentLabel: string = "Present"
): string {
	const start = formatDate(startDate, format);
	const end = endDate ? formatDate(endDate, format) : currentLabel;
	return `${start} - ${end}`;
}

/**
 * Get CSS grid template columns string based on layout config
 */
export function getGridLayout(layout: LayoutConfig): string {
	if (!layout) return "1fr";

	switch (layout.type) {
		case "single-column":
			return "1fr";

		case "two-column-equal":
		case "two-column-left-heavy":
		case "two-column-right-heavy":
			if (layout.columnRatio) {
				const { left, right } = layout.columnRatio;
				return `${left}fr ${right}fr`;
			}
			return "1fr 1fr";

		case "three-column":
			if (layout.threeColumnRatio) {
				return layout.threeColumnRatio.map((r) => `${r}fr`).join(" ");
			}
			return "1fr 1fr 1fr";

		default:
			return "1fr";
	}
}

/**
 * Generate CSS variables object from template colors
 */
export function generateCSSVariables(colors: {
	primary: string;
	secondary: string;
	accent: string;
	text: string;
	textLight: string;
	background: string;
	border: string;
	link: string;
}): React.CSSProperties {
	return {
		"--template-primary": colors.primary,
		"--template-secondary": colors.secondary,
		"--template-accent": colors.accent,
		"--template-text": colors.text,
		"--template-text-light": colors.textLight,
		"--template-background": colors.background,
		"--template-border": colors.border,
		"--template-link": colors.link,
	} as React.CSSProperties;
}

/**
 * Capitalize first letter of each word in a string
 */
export function toTitleCase(str: string): string {
	return str
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

/**
 * Get A4 paper dimensions
 */
export const A4_DIMENSIONS = {
	width: "210mm",
	height: "297mm",
	aspectRatio: "210 / 297",
} as const;

/**
 * Price formatting utilities
 */
export function formatPrice(priceInCents: number): string {
	return `$${(priceInCents / 100).toFixed(2)}`;
}

export function parsePriceToCents(priceInDollars: string): number {
	return Math.round(parseFloat(priceInDollars) * 100);
}

