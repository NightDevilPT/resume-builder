"use client";

import { TemplateConfig, SectionType } from "@/interfaces/templates";
import { ResumeData } from "@/interfaces/resume";
import { Card } from "@/components/ui/card";
import {
	getGridLayout,
	generateCSSVariables,
	A4_DIMENSIONS,
	toTitleCase,
	getFontWeightValue,
} from "@/lib/utils/template-helpers";
import {
	PersonalInfoSection,
	ExperienceSection,
	EducationSection,
	SkillsSection,
	ProjectsSection,
	CertificationsSection,
	AchievementsSection,
} from "./sections";
import { dummyData } from "@/constants/default-template";

interface TemplatePreviewProps {
	config: TemplateConfig;
	resumeData?: ResumeData; // Optional user resume data
}

export function TemplatePreview({ config, resumeData }: TemplatePreviewProps) {
	// Use user's resume data if provided, otherwise use dummy data
	const data = resumeData || dummyData;

	// Normalize data for display
	const displayData = {
		personalInfo: {
			...data.personalInfo,
			linkedin:
				data.personalInfo.links?.find((l) =>
					l.label?.toLowerCase().includes("linkedin")
				)?.url || "",
			github:
				data.personalInfo.links?.find((l) =>
					l.label?.toLowerCase().includes("github")
				)?.url || "",
		},
		experience: data.experience.map((exp) => ({
			...exp,
			title: exp.jobTitle,
			startDate: exp.startDate,
			endDate: exp.endDate || null,
		})),
		education: data.education.map((edu) => ({
			...edu,
			gpa: edu.gradeValue
				? `${edu.gradeType.toUpperCase()}: ${edu.gradeValue}`
				: "",
		})),
		skills: {
			technical: data.skills.technical.map((s) => s.name),
			soft: data.skills.soft.map((s) => s.name),
			languages: data.skills.languages.map(
				(l) => `${l.language} (${l.proficiency})`
			),
		},
		projects: data.projects,
		certifications: data.certifications.map((cert) => ({
			...cert,
			issuer: cert.issuingOrganization,
			year: cert.issueDate
				? new Date(cert.issueDate).getFullYear().toString()
				: "",
		})),
		achievements: data.achievements.map((ach) => ({
			...ach,
			year: ach.date ? new Date(ach.date).getFullYear().toString() : "",
		})),
	};

	if (!config || !config.name) {
		return (
			<Card className="p-8 text-center">
				<p className="text-muted-foreground">
					Start configuring your template to see a live preview
				</p>
			</Card>
		);
	}

	// Generate CSS variables from config
	const cssVars = config.colors
		? generateCSSVariables(config.colors)
		: generateCSSVariables({
				primary: "#2563eb",
				secondary: "#64748b",
				accent: "#0ea5e9",
				text: "#1e293b",
				textLight: "#64748b",
				background: "#ffffff",
				border: "#e2e8f0",
				link: "#2563eb",
		  });

	// Helper to get grid column position based on position and layout type
	const getGridColumnPosition = (position: string): string => {
		const layoutType = config.layout?.type;

		if (position === "full-width") return ""; // Already handled by col-span-full

		switch (layoutType) {
			case "single-column":
				return ""; // Only one column, no need to specify

			case "two-column-equal":
			case "two-column-left-heavy":
			case "two-column-right-heavy":
				if (position === "left") return "1";
				if (position === "right") return "2";
				return "";

			case "three-column":
				if (position === "left") return "1";
				if (position === "center") return "2";
				if (position === "right") return "3";
				return "";

			default:
				return "";
		}
	};

	// Determine grid columns for skills based on layout and position
	const getSkillsGridCols = (position?: string) => {
		const layoutType = config.layout?.type;

		// Single column layout → 4 columns for skills
		if (layoutType === "single-column") return "grid-cols-4";

		// Two column layouts → 2 columns for skills
		if (
			layoutType === "two-column-equal" ||
			layoutType === "two-column-left-heavy" ||
			layoutType === "two-column-right-heavy"
		) {
			return "grid-cols-2";
		}

		// Three column layout → 1 column for skills
		if (layoutType === "three-column") return "grid-cols-1";

		// Default for any other layout type
		return "grid-cols-2";
	};

	// Render section content based on type
	const renderSectionContent = (type: SectionType, position?: string) => {
		switch (type) {
			case "personal-info":
				return (
					<PersonalInfoSection
						data={displayData.personalInfo}
						config={config.personalInfoConfig}
						typography={config.typography}
					/>
				);

			case "experience":
				return (
					<ExperienceSection
						data={displayData.experience}
						config={config.experienceConfig}
						typography={config.typography}
					/>
				);

			case "education":
				return (
					<EducationSection
						data={displayData.education}
						config={config.educationConfig}
						typography={config.typography}
					/>
				);

			case "skills":
				return (
					<SkillsSection
						data={displayData.skills}
						config={config.skillsConfig}
						skillsGridCols={getSkillsGridCols(position)}
					/>
				);

			case "projects":
				return (
					<ProjectsSection
						data={displayData.projects}
						config={config.projectsConfig}
						typography={config.typography}
					/>
				);

			case "certifications":
				return (
					<CertificationsSection
						data={displayData.certifications}
						config={config.certificationsConfig}
						typography={config.typography}
					/>
				);

			case "achievements":
				return (
					<AchievementsSection
						data={displayData.achievements}
						config={config.achievementsConfig}
						typography={config.typography}
					/>
				);

			default:
				return (
					<div
						className="text-[0.7rem]"
						style={{ color: "var(--template-text-light)" }}
					>
						{type} content preview
					</div>
				);
		}
	};

	return (
		<div className="resume-preview">
			{/* A4 Paper Container */}
			<Card
				className="shadow-none overflow-hidden flex-shrink-0"
				id="resume-preview"
				style={{
					...cssVars,
					backgroundColor: "var(--template-background)",
					fontFamily: config.typography?.bodyFont || "Geist",
					width: A4_DIMENSIONS.width,
					minWidth: A4_DIMENSIONS.width,
					maxWidth: A4_DIMENSIONS.width,
					fontSize: "0.75rem", // Base font size scaled for A4 preview
				}}
			>
				<div className="h-full p-6">
					{/* Layout Preview */}
					<div
						className="grid"
						style={{
							gridTemplateColumns: config.layout
								? getGridLayout(config.layout)
								: "1fr",
							gap: config.layout?.gap || "1.5rem",
						}}
					>
						{/* Render sections based on config */}
						{config.layout?.sections &&
						config.layout.sections.length > 0 ? (
							<>
								{/* Group sections by position */}
								{["full-width", "left", "center", "right"].map(
									(position) => {
										const sectionsInPosition =
											config.layout?.sections
												?.filter(
													(s) =>
														s.position ===
															position &&
														s.visibility
												)
												.sort(
													(a, b) => a.order - b.order
												);

										if (
											!sectionsInPosition ||
											sectionsInPosition.length === 0
										)
											return null;

										const gridColumn =
											getGridColumnPosition(position);

										return (
											<div
												key={position}
												className={
													position === "full-width"
														? "col-span-full"
														: ""
												}
												style={{
													gridColumn:
														gridColumn || undefined,
												}}
											>
												{sectionsInPosition.map(
													(section, idx) => (
														<div
															key={idx}
															className="mb-3 last:mb-0"
															style={{
																borderBottom:
																	config
																		.typography
																		?.showDividers &&
																	idx <
																		sectionsInPosition.length -
																			1
																		? `1px solid var(--template-border)`
																		: "none",
																paddingBottom:
																	config
																		.typography
																		?.showDividers &&
																	idx <
																		sectionsInPosition.length -
																			1
																		? "0.75rem"
																		: "0",
															}}
														>
															{/* Only show section heading if not personal-info */}
															{section.type !==
																"personal-info" && (
																<h3
																	className="mb-2"
																	style={{
																		fontSize:
																			(() => {
																				const sizeMap: Record<
																					string,
																					string
																				> =
																					{
																						xs: "0.7rem",
																						sm: "0.8rem",
																						base: "0.9rem",
																						lg: "1rem",
																						xl: "1.15rem",
																						"2xl": "1.35rem",
																					};
																				return (
																					sizeMap[
																						config
																							.typography
																							?.headingSize ||
																							"xl"
																					] ||
																					"1.15rem"
																				);
																			})(),
																		fontWeight:
																			getFontWeightValue(config.typography?.headingWeight),
																		fontFamily:
																			config
																				.typography
																				?.headingFont ||
																			"Geist",
																		color: "var(--template-primary)",
																		textTransform:
																			config
																				.typography
																				?.headingUppercase
																				? "uppercase"
																				: "none",
																		borderBottom:
																			config
																				.typography
																				?.headingUnderline
																				? `1.5px solid var(--template-primary)`
																				: "none",
																		paddingBottom:
																			config
																				.typography
																				?.headingUnderline
																				? "0.15rem"
																				: "0",
																		lineHeight:
																			"1.2",
																	}}
																>
																	{section.customLabel ||
																		toTitleCase(
																			section.type
																		)}
																</h3>
															)}
															{/* Section Content */}
															{renderSectionContent(
																section.type,
																position
															)}
														</div>
													)
												)}
											</div>
										);
									}
								)}
							</>
						) : (
							<div className="col-span-full text-center py-12">
								<p className="text-sm text-muted-foreground">
									No sections configured. Add sections in the
									"Sections" tab to see preview.
								</p>
							</div>
						)}
					</div>
				</div>
			</Card>
		</div>
	);
}
