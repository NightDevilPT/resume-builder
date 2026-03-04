import { Style } from "./style.interface";
import {
  ContentBlock,
  SkillBlock,
  ExperienceItem,
  EducationItem,
  AchievementItem,
} from "./content.interface";

export interface SocialLinks {
  url: string;
  platform: string;
  icon: string;
}

export interface ProfileData {
  name: string;
  title?: string;
  summary?: string | ContentBlock[];
  email?: string;
  phone?: string;
  location?: string;
  socialLinks?: SocialLinks[];
}

export interface BaseSection {
  id?: string;
  title?: string;
  style?: Style;
  order: number;
  // colMap: placement based on the column count defined in the template
  // - "full": spans all columns
  // - "left": first column
  // - "right": last column
  // - "middle": middle column (only valid for 3 columns)
  colMap?: "full" | "left" | "right" | "middle";
}

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
  columns?: number; // number of sub‑columns within the section
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

export type Section =
  | ProfileSection
  | SummarySection
  | SkillsSection
  | ExperienceSection
  | EducationSection
  | AchievementsSection
  | CustomSection;