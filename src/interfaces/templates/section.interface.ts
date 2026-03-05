import { Style } from "./style.interface";
import { ContentBlock } from "./content.interface";

// ======================
// Social Links (used in Profile)
// ======================
export interface SocialLinks {
	url: string;
	platform: string;
	icon: string;
}

// ======================
// Profile Data
// ======================
export interface ProfileData {
	name: string;
	title?: string;
	summary?: string | ContentBlock[]; // can be plain string or rich content
	email?: string;
	phone?: string;
	location?: string;
	socialLinks?: SocialLinks[];
}

// ======================
// Skill Block (specific to SkillsSection)
// ======================
export interface SkillBlock {
	type?: 'skill'; // optional discriminator, not strictly needed
	name: string;
	level: number; // 0-100
	displayFormat: 'percentage' | 'bar' | 'circle' | 'dots' | 'stars';
	showLevel?: boolean;
	style?: Style; // optional inline style for this skill item
}

// ======================
// Experience Item
// ======================
export interface ExperienceItem {
	id?: string;
	title: string;
	subtitle?: string; // company, institution, etc.
	location?: string;
	startDate?: string;
	endDate?: string | 'present';
	description?: ContentBlock[];
}

// ======================
// Education Item (extends ExperienceItem)
// ======================
export interface EducationItem extends ExperienceItem {
	degree?: string;
	field?: string;
}

// ======================
// Achievement / Certification Item
// ======================
export interface AchievementItem {
	id?: string;
	title: string;
	issuer?: string;
	date?: string;
	description?: string;
	link?: string;
}

// ======================
// Base Section
// ======================
export interface BaseSection {
	id?: string;
	title?: string;
	style?: Style;
	order: number;
	colMap?: "full" | "left" | "right" | "middle";
}

// ======================
// Concrete Section Types
// ======================
export interface ProfileSection extends BaseSection {
	type: "profile";
	data: ProfileData;
}

export interface SummarySection extends BaseSection {
	type: "summary";
	content: ContentBlock[];
}

export interface SkillsSection extends BaseSection {
	type: "skills";
	items: SkillBlock[];
	columns?: number; // number of sub‑columns within the section (for layout)
}

export interface ExperienceSection extends BaseSection {
	type: "experience";
	items: ExperienceItem[];
}

export interface EducationSection extends BaseSection {
	type: "education";
	items: EducationItem[];
}

export interface AchievementsSection extends BaseSection {
	type: "achievements";
	items: AchievementItem[];
}

export interface CustomSection extends BaseSection {
	type: "custom";
	content: ContentBlock[];
}

// ======================
// Union of all Section types
// ======================
export type Section =
	| ProfileSection
	| SummarySection
	| SkillsSection
	| ExperienceSection
	| EducationSection
	| AchievementsSection
	| CustomSection;