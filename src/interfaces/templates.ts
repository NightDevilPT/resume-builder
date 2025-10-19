import { ResumeData } from "./resume";

// Template Layout Types
export type LayoutType =
	| "single-column"
	| "two-column-equal"
	| "two-column-left-heavy" // 60-40
	| "two-column-right-heavy" // 40-60
	| "three-column";

export type SectionPosition = "left" | "right" | "center" | "full-width";

export type SectionType =
	| "personalInfo"
	| "summary"
	| "experience"
	| "education"
	| "skills"
	| "projects"
	| "certifications"
	| "achievements";

// Section Configuration
export interface SectionConfig {
	id: string;
	type: SectionType;
	label: string;
	position: SectionPosition; // Where the section appears
	order: number; // Order within its position
	visible: boolean; // Can be toggled by user
	required: boolean; // Must be filled
	styling: {
		fontSize: number;
		fontWeight: "normal" | "bold" | "semibold";
		color: string;
		spacing: number;
		showIcons: boolean;
		showDivider: boolean;
	};
}

// Template Style Configuration
export interface TemplateStyle {
	// Colors
	primaryColor: string;
	secondaryColor: string;
	accentColor: string;
	textColor: string;
	backgroundColor: string;

	// Typography
	fontFamily: string;
	headingFont: string;
	bodyFont: string;
	fontSize: {
		heading: number;
		subheading: number;
		body: number;
		small: number;
	};

	// Spacing
	padding: number;
	margin: number;
	sectionSpacing: number;

	// Border & Effects
	borderRadius: number;
	showBorders: boolean;
	showShadow: boolean;
}

// Main Template Configuration
export interface TemplateConfig {
	id: string;
	name: string;
	description: string;
	thumbnail: string; // Preview image URL
	category: string; // e.g., "Modern", "Classic", "Creative", "ATS-Friendly"

	// Access Control
	isPaid: boolean;
	price: number; // 0 if free
	tier: "free" | "basic" | "premium" | "enterprise";

	// Layout Configuration
	layout: {
		type: LayoutType;
		columnRatio?: string; // e.g., "60-40", "70-30"
		pageSize: "A4" | "Letter" | "Legal";
		orientation: "portrait" | "landscape";
	};

	// Section Configuration
	sections: SectionConfig[];

	// Styling
	style: TemplateStyle;

	// Metadata
	createdBy: string; // Admin user ID
	createdAt: Date;
	updatedAt: Date;
	isPublished: boolean; // Visible to users
	isActive: boolean; // Can be selected
	usageCount: number; // Track popularity
	rating: number; // User ratings
	tags: string[]; // For filtering
}
