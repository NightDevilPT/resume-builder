/**
 * Template Configuration Interfaces
 * Defines the structure for resume templates with support for various layouts
 */

// Layout configuration types
export type LayoutType =
  | "single-column"
  | "two-column-equal"
  | "two-column-left-heavy"
  | "two-column-right-heavy"
  | "three-column";

// Column width ratios for two-column layouts
export interface ColumnRatio {
  left: number; // e.g., 60 for 60%
  right: number; // e.g., 40 for 40%
}

// Section types available in the resume (matching ResumeData structure)
export type SectionType =
  | "personal-info"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "achievements";

// Position of section in the layout
export type SectionPosition = "left" | "right" | "center" | "full-width";

// Font weight options
export type FontWeight = "light" | "normal" | "medium" | "semibold" | "bold";

// Template Permissions - Controls what users can customize
export interface TemplatePermissions {
  canChangeColors: boolean;           // Allow changing color scheme
  canChangeFonts: boolean;            // Allow changing font families and typography
  canChangeLayout: boolean;           // Allow changing layout type (single/two/three column)
  canChangeSections: boolean;         // Allow adding/removing/reordering sections
  canChangeSectionConfig: boolean;    // Allow changing section-specific settings (e.g., show/hide fields)
  canChangeSpacing: boolean;          // Allow changing margins, padding, gaps
  canChangeBorders: boolean;          // Allow changing border styles
}

// Skill proficiency display format
export type SkillDisplayFormat = 
  | "bars" 
  | "dots" 
  | "percentage" 
  | "text" 
  | "stars" 
  | "badge-level" 
  | "list" 
  | "chips"
  | "circles";

// Individual section configuration
export interface SectionConfig {
  type: SectionType;
  position: SectionPosition;
  order: number; // Order within the column/position
  visibility: boolean;
  required: boolean; // Whether this section must have content
  customLabel?: string; // Optional custom label for the section
}

// Color scheme for the template
export interface ColorScheme {
  primary: string; // Main brand color
  secondary: string; // Secondary accent color
  accent: string; // Tertiary accent color
  text: string; // Main text color
  textLight: string; // Light text color
  background: string; // Background color
  border: string; // Border color
  link: string; // Hyperlink color
}

// Typography configuration
export interface Typography {
  headingFont: string; // Font family for headings
  bodyFont: string; // Font family for body text
  nameSize: string; // Size for candidate name (e.g., "3xl", "4xl")
  nameWeight: FontWeight; // Font weight for candidate name
  headingSize: string; // Size for headings (e.g., "lg", "xl")
  headingWeight: FontWeight; // Font weight for headings
  headingUppercase: boolean; // Whether headings should be uppercase
  headingUnderline: boolean; // Whether to underline headings
  subheadingSize: string; // Size for subheadings (e.g., job titles, project names)
  subheadingWeight: FontWeight; // Font weight for subheadings
  lineHeight: string; // Line height (e.g., "relaxed", "normal", "tight")
  showIcons: boolean; // Whether to show icons in sections
  showDividers: boolean; // Whether to show dividers between sections
}

// Spacing configuration
export interface Spacing {
  section: string; // Space between sections
  item: string; // Space between items within a section
  margin: string; // Page margins
  padding: string; // Internal padding
}

// Border configuration
export interface BorderConfig {
  width: string;
  style: "solid" | "dashed" | "dotted" | "double" | "none";
  color: string;
  radius: string; // Border radius
}

// Layout configuration based on layout type
export interface LayoutConfig {
  type: LayoutType;
  columnRatio?: ColumnRatio; // Only for two-column layouts
  threeColumnRatio?: [number, number, number]; // Only for three-column layouts
  gap: string; // Gap between columns
  sections: SectionConfig[];
}

// Personal Info display configuration
export interface PersonalInfoConfig {
  showWebsite: boolean;
  showLinks: boolean;
  showSummary: boolean;
  summaryPosition: "below-contact" | "separate-section"; // Where to display summary
  contactLayout: "horizontal" | "vertical" | "grid";
  showIcons: boolean;
}

// Experience display configuration
export interface ExperienceConfig {
  showLocation: boolean;
  showDescription: boolean;
  showAchievements: boolean;
  showSkillsUsed: boolean;
  dateFormat: "short" | "long" | "year-only"; // e.g., "Jan 2020", "January 2020", "2020"
  achievementsAsBullets: boolean;
}

// Education display configuration
export interface EducationConfig {
  showLocation: boolean;
  showGrade: boolean;
  showAchievements: boolean;
  showCoursework: boolean;
  dateFormat: "short" | "long" | "year-only";
  achievementsAsBullets: boolean;
}

// Skills display configuration
export interface SkillsConfig {
  displayFormat: SkillDisplayFormat;
  showLevel: boolean; // Whether to show proficiency level
  groupByCategory: boolean; // Group technical/soft/languages separately
  showYearsOfExperience?: boolean;
  technicalSkillsLabel?: string; // Custom label for technical skills
  softSkillsLabel?: string; // Custom label for soft skills
  languagesLabel?: string; // Custom label for languages
}

// Projects display configuration
export interface ProjectsConfig {
  showSubtitle: boolean;
  showDescription: boolean;
  showTechnologies: boolean;
  showLinks: boolean;
  showDates: boolean;
  showHighlights: boolean;
  dateFormat: "short" | "long" | "year-only";
  highlightsAsBullets: boolean;
}

// Certifications display configuration
export interface CertificationsConfig {
  showIssueDate: boolean;
  showExpirationDate: boolean;
  showCredentialUrl: boolean;
  dateFormat: "short" | "long" | "year-only";
  urlAsQRCode?: boolean; // Display credential URL as QR code
}

// Achievements display configuration
export interface AchievementsConfig {
  showIssuer: boolean;
  showDate: boolean;
  showDescription: boolean;
  dateFormat: "short" | "long" | "year-only";
}


// Template metadata
export interface TemplateMetadata {
  createdBy: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isPublished: boolean;
  isActive: boolean;
  usageCount: number;
  rating: number; // Average rating 0-5
  tags: string[];
  previewImage?: string; // URL to preview image
}

// Pricing information
export interface PricingInfo {
  isPaid: boolean;
  price?: number; // Price in cents
  tier?: "free" | "basic" | "premium" | "custom";
}

// Complete template configuration
export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  thumbnail: string; // URL to thumbnail image
  categories: string[]; // e.g., "Modern", "Classic", "Creative", "Academic"
  
  // Pricing
  pricing: PricingInfo;
  
  // Permissions - What users can customize
  permissions: TemplatePermissions;
  
  // Layout and sections
  layout: LayoutConfig;
  
  // Styling
  colors: ColorScheme;
  typography: Typography;
  spacing: Spacing;
  borders: BorderConfig;
  
  // Section-specific configurations (matching ResumeData structure)
  personalInfoConfig: PersonalInfoConfig;
  experienceConfig: ExperienceConfig;
  educationConfig: EducationConfig;
  skillsConfig: SkillsConfig;
  projectsConfig: ProjectsConfig;
  certificationsConfig: CertificationsConfig;
  achievementsConfig: AchievementsConfig;
  
  // Metadata
  metadata: TemplateMetadata;
}

// Preset column ratios for common layouts
export const COLUMN_RATIOS = {
  EQUAL: { left: 50, right: 50 },
  LEFT_HEAVY: { left: 60, right: 40 },
  LEFT_VERY_HEAVY: { left: 70, right: 30 },
  RIGHT_HEAVY: { left: 40, right: 60 },
  RIGHT_VERY_HEAVY: { left: 30, right: 70 },
} as const;

// Default section order for different positions
export const DEFAULT_SECTION_ORDER = {
  LEFT: ["experience", "projects"],
  RIGHT: ["skills", "education", "certifications", "achievements"],
  FULL_WIDTH: ["personal-info"],
} as const;

// Helper type for creating new templates
export type CreateTemplateInput = Omit<
  TemplateConfig,
  "id" | "metadata"
> & {
  metadata?: Partial<TemplateMetadata>;
};

// Helper type for updating templates
export type UpdateTemplateInput = Partial<Omit<TemplateConfig, "id">>;

