import { TemplateConfig } from "@/interfaces/templates/template.interface";
import { Style } from "@/interfaces/templates/style.interface";
import { ContentBlock } from "@/interfaces/templates/content.interface";

/**
 * Single engine to process a template config and generate a flat style dictionary
 * ready for StyleSheet.create.
 */
export function generateTemplateStyles(
	template: TemplateConfig,
): Record<string, Style> {
	const styles: Record<string, Style> = {};

	// 1. Page style
	if (template.pageStyle) {
		styles.page = template.pageStyle;
	}

	// 2. Layout column styles (optional, for container styling)
	if (Array.isArray(template.layout)) {
		template.layout.forEach((col, index) => {
			if (col.style) {
				styles[`column_${index}`] = col.style;
			}
		});
	}

	// 3. Helper to merge styles: globalStyle + sectionStyle + optional extra
	const globalStyle = template.globalStyle || {};

	// 4. Process each section
	template.sections.forEach((section, secIdx) => {
		// Merge global + section style
		const sectionBaseStyle = { ...globalStyle, ...(section.style || {}) };

		// Section container key (use id if available, otherwise fallback)
		const sectionKey = section.id || `section_${secIdx}`;
		styles[sectionKey] = sectionBaseStyle;

		// Section title (if any) – we could add a default title style or extract from section
		// If you want to support titleStyle, you can add it to BaseSection interface.
		// For now, assume no title style; user can style title via Text inside content.

		// Process based on section type
		switch (section.type) {
			case "profile":
				processProfileSection(
					section,
					sectionBaseStyle,
					styles,
					secIdx,
				);
				break;
			case "summary":
				processSummarySection(
					section,
					sectionBaseStyle,
					styles,
					secIdx,
				);
				break;
			case "skills":
				processSkillsSection(section, sectionBaseStyle, styles, secIdx);
				break;
			case "experience":
				processExperienceSection(
					section,
					sectionBaseStyle,
					styles,
					secIdx,
				);
				break;
			case "education":
				processEducationSection(
					section,
					sectionBaseStyle,
					styles,
					secIdx,
				);
				break;
			case "achievements":
				processAchievementsSection(
					section,
					sectionBaseStyle,
					styles,
					secIdx,
				);
				break;
			case "custom":
				processCustomSection(section, sectionBaseStyle, styles, secIdx);
				break;
		}
	});

	return styles;
}

// Helper to apply block-level style merging and add to styles dictionary
function addBlockStyles(
	blocks: ContentBlock[],
	baseStyle: Style,
	styles: Record<string, Style>,
	prefix: string,
) {
	blocks.forEach((block, idx) => {
		const blockKey = `${prefix}_${idx}`;
		const mergedStyle = { ...baseStyle, ...(block.style || {}) };
		styles[blockKey] = mergedStyle;

		// If block is a list, also add bullet styles (example)
		if (block.type === "list") {
			// You could define bullet and bulletText styles generically
			// They might be overridden by the block's own style, but we keep separate keys.
			if (!styles.bullet) {
				styles.bullet = { width: 15, fontSize: 10, color: "#2563eb" };
			}
			if (!styles.bulletText) {
				styles.bulletText = { fontSize: 10, color: "#334155", flex: 1 };
			}
		}
	});
}

function processProfileSection(
	section: any,
	baseStyle: Style,
	styles: Record<string, Style>,
	idx: number,
) {
	const { data } = section;
	if (data.name) {
		styles.name = { fontSize: 20, fontWeight: "bold", marginBottom: 4 }; // example; could be extracted from data.style if present
	}
	if (data.title) {
		styles.title = { fontSize: 12, color: "#2563eb", marginBottom: 8 };
	}
	if (data.summary) {
		if (Array.isArray(data.summary)) {
			addBlockStyles(data.summary, baseStyle, styles, `profile_summary`);
		}
	}
	// socialLinks could be styled similarly
}

function processSummarySection(
	section: any,
	baseStyle: Style,
	styles: Record<string, Style>,
	idx: number,
) {
	if (section.content) {
		addBlockStyles(section.content, baseStyle, styles, `summary_${idx}`);
	}
}

function processSkillsSection(
	section: any,
	baseStyle: Style,
	styles: Record<string, Style>,
	idx: number,
) {
	if (section.items) {
		section.items.forEach((item: any, itemIdx: number) => {
			const itemKey = `skill_${idx}_${itemIdx}`;
			const merged = { ...baseStyle, ...(item.style || {}) };
			styles[itemKey] = merged;
		});
	}
}

function processExperienceSection(
	section: any,
	baseStyle: Style,
	styles: Record<string, Style>,
	idx: number,
) {
	if (section.items) {
		section.items.forEach((item: any, itemIdx: number) => {
			if (item.description) {
				addBlockStyles(
					item.description,
					baseStyle,
					styles,
					`exp_${idx}_desc_${itemIdx}`,
				);
			}
		});
	}
}

function processEducationSection(
	section: any,
	baseStyle: Style,
	styles: Record<string, Style>,
	idx: number,
) {
	// Similar to experience
	if (section.items) {
		section.items.forEach((item: any, itemIdx: number) => {
			if (item.description) {
				addBlockStyles(
					item.description,
					baseStyle,
					styles,
					`edu_${idx}_desc_${itemIdx}`,
				);
			}
		});
	}
}

function processAchievementsSection(
	section: any,
	baseStyle: Style,
	styles: Record<string, Style>,
	idx: number,
) {
	// Achievements may have no nested blocks; if you want to style each achievement item, you could add keys.
	// For simplicity, we skip.
}

function processCustomSection(
	section: any,
	baseStyle: Style,
	styles: Record<string, Style>,
	idx: number,
) {
	if (section.content) {
		addBlockStyles(section.content, baseStyle, styles, `custom_${idx}`);
	}
}
