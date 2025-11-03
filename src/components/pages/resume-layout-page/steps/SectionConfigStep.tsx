"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toTitleCase } from "@/lib/utils/template-helpers";
import { TemplateConfig, SectionType } from "@/interfaces/templates";

interface SectionConfigStepProps {
	config: Partial<TemplateConfig>;
	updateConfig: (section: string, data: any) => void;
}

// Reusable component for toggle switches
const ToggleSwitch: React.FC<{
	label: string;
	checked: boolean;
	onCheckedChange: (value: boolean) => void;
}> = ({ label, checked, onCheckedChange }) => (
	<div className="flex items-center justify-between">
		<Label className="text-sm">{label}</Label>
		<Switch checked={checked} onCheckedChange={onCheckedChange} />
	</div>
);

// Reusable component for badge buttons
const BadgeButtonGroup: React.FC<{
	label: string;
	options: string[];
	selected: string;
	onSelect: (value: string) => void;
}> = ({ label, options, selected, onSelect }) => (
	<div className="space-y-2">
		<Label className="text-sm">{label}</Label>
		<div className="flex flex-wrap gap-2">
			{options.map((option) => (
				<Badge
					key={option}
					variant={selected === option ? "default" : "outline"}
					className="cursor-pointer hover:bg-primary/90 transition-colors"
					onClick={() => onSelect(option)}
				>
					{toTitleCase(option)}
				</Badge>
			))}
		</div>
	</div>
);

// Configuration metadata for each section type
const SECTION_CONFIGS: Record<
	SectionType,
	{
		configKey: string;
		toggles: Array<{ key: string; label: string }>;
		displayFormat?: { key: string; options: string[] };
		hasDateFormat?: boolean;
	}
> = {
	"personal-info": {
		configKey: "personalInfoConfig",
		toggles: [
			{ key: "showWebsite", label: "Show Website" },
			{ key: "showLinks", label: "Show Links" },
			{ key: "showSummary", label: "Show Summary" },
			{ key: "showIcons", label: "Show Icons" },
		],
	},
	experience: {
		configKey: "experienceConfig",
		toggles: [
			{ key: "showLocation", label: "Show Location" },
			{ key: "showAchievements", label: "Show Achievements" },
		],
		hasDateFormat: true,
	},
	education: {
		configKey: "educationConfig",
		toggles: [
			{ key: "showLocation", label: "Show Location" },
			{ key: "showGrade", label: "Show Grade/GPA" },
		],
		hasDateFormat: true,
	},
	skills: {
		configKey: "skillsConfig",
		displayFormat: {
			key: "displayFormat",
			options: [
				"bars",
				"dots",
				"circles",
				"percentage",
				"stars",
				"badge-level",
				"list",
				"chips",
				"text",
			],
		},
		toggles: [
			{ key: "showLevel", label: "Show Level" },
			{ key: "groupByCategory", label: "Group by Category" },
		],
	},
	projects: {
		configKey: "projectsConfig",
		toggles: [
			{ key: "showDescription", label: "Show Description" },
			{ key: "showTechnologies", label: "Show Technologies" },
		],
	},
	certifications: {
		configKey: "certificationsConfig",
		toggles: [
			{ key: "showIssueDate", label: "Show Issue Date" },
			{ key: "showCredentialUrl", label: "Show Credential URL" },
		],
	},
	achievements: {
		configKey: "achievementsConfig",
		toggles: [
			{ key: "showIssuer", label: "Show Issuer" },
			{ key: "showDate", label: "Show Date" },
		],
	},
};

export function SectionConfigStep({
	config,
	updateConfig,
}: SectionConfigStepProps) {
	const [selectedSection, setSelectedSection] = useState<SectionType | "">(
		""
	);

	const sectionTypes: SectionType[] = [
		"personal-info",
		"experience",
		"education",
		"skills",
		"projects",
		"certifications",
		"achievements",
	];

	const dateFormats = ["short", "long", "year-only"];

	// Get available positions based on layout type
	const getAvailablePositions = () => {
		const layoutType = config.layout?.type;

		if (layoutType === "single-column") {
			return ["full-width"];
		}

		if (layoutType?.startsWith("two-column")) {
			return ["full-width", "left", "right"];
		}

		if (layoutType === "three-column") {
			return ["full-width", "left", "center", "right"];
		}

		return ["full-width"];
	};

	const availablePositions = getAvailablePositions();
	const availableSections = sectionTypes.filter(
		(type) =>
			!config.layout?.sections?.some((section) => section.type === type)
	);

	const addSection = () => {
		if (!selectedSection) return;

		// Personal info is always full-width with order 0
		if (selectedSection === "personal-info") {
			const newSection = {
				type: selectedSection,
				position: "full-width",
				order: 0,
				visibility: true,
				required: true, // Personal info is always required
			};

			updateConfig("layout", {
				...config.layout,
				sections: [newSection, ...(config.layout?.sections || [])],
			});
			setSelectedSection("");
			return;
		}

		// Auto-set position based on layout type for other sections
		let defaultPosition = "full-width";
		if (config.layout?.type?.startsWith("two-column")) {
			defaultPosition = "left";
		} else if (config.layout?.type === "three-column") {
			defaultPosition = "center";
		}

		// Calculate next order (skip 0 as it's reserved for personal-info)
		const maxOrder = Math.max(
			0,
			...(config.layout?.sections?.map((s) => s.order) || [])
		);
		const newOrder = maxOrder + 1;

		const newSection = {
			type: selectedSection,
			position: defaultPosition,
			order: newOrder,
			visibility: true,
			required: false,
		};

		updateConfig("layout", {
			...config.layout,
			sections: [...(config.layout?.sections || []), newSection],
		});
		setSelectedSection("");
	};

	const removeSection = (index: number) => {
		const newSections =
			config.layout?.sections?.filter((_, i) => i !== index) || [];
		updateConfig("layout", { ...config.layout, sections: newSections });
		setSelectedSection("");
	};

	const updateSection = (index: number, field: string, value: any) => {
		const newSections = [...(config.layout?.sections || [])];
		const section = newSections[index];

		// Prevent changing personal-info's position and order
		if (section.type === "personal-info") {
			if (field === "position") {
				// Personal info must always be full-width
				return;
			}
			if (field === "order") {
				// Personal info must always have order 0
				return;
			}
		}

		newSections[index] = { ...newSections[index], [field]: value };
		updateConfig("layout", { ...config.layout, sections: newSections });
	};

	// Render section-specific display config
	const renderSectionDisplayConfig = (sectionType: SectionType) => {
		const sectionMeta = SECTION_CONFIGS[sectionType];
		const sectionConfig = config[
			sectionMeta.configKey as keyof typeof config
		] as Record<string, any> | undefined;

		return (
			<div className="space-y-3 mt-4 pt-4 border-t">
				<h5 className="text-sm font-semibold mb-3">Display Settings</h5>

				{/* Special Format Options (e.g., Skills display format) */}
				{sectionMeta.displayFormat && (
					<BadgeButtonGroup
						label="Display Format"
						options={sectionMeta.displayFormat.options}
						selected={
							(sectionConfig?.[
								sectionMeta.displayFormat.key
							] as string) || sectionMeta.displayFormat.options[0]
						}
						onSelect={(v) =>
							updateConfig(sectionMeta.configKey, {
								...sectionConfig,
								[sectionMeta.displayFormat!.key]: v,
							})
						}
					/>
				)}

				{/* Toggle Switches */}
				{sectionMeta.toggles.map((toggle) => (
					<ToggleSwitch
						key={toggle.key}
						label={toggle.label}
						checked={sectionConfig?.[toggle.key] ?? true}
						onCheckedChange={(v) =>
							updateConfig(sectionMeta.configKey, {
								...sectionConfig,
								[toggle.key]: v,
							})
						}
					/>
				))}

				{/* Date Format (for Experience & Education) */}
				{sectionMeta.hasDateFormat && (
					<BadgeButtonGroup
						label="Date Format"
						options={dateFormats}
						selected={
							(sectionConfig?.dateFormat as string) || "short"
						}
						onSelect={(v) =>
							updateConfig(sectionMeta.configKey, {
								...sectionConfig,
								dateFormat: v,
							})
						}
					/>
				)}
			</div>
		);
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold mb-4">
					Section Configuration
				</h3>
				<p className="text-sm text-muted-foreground mb-6">
					Add sections and customize their display settings
				</p>
			</div>

			{/* Add Section */}
			<Card className="p-4">
				<Label className="mb-3 block">Add Section</Label>
				{config.layout?.type === "single-column" && (
					<p className="text-xs text-muted-foreground mb-3">
						💡 Single-column layout: sections will be positioned in
						center by default
					</p>
				)}
				{availableSections.length > 0 ? (
					<div className="flex gap-2">
						<Select
							value={selectedSection}
							onValueChange={(v) =>
								setSelectedSection(v as SectionType)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a section..." />
							</SelectTrigger>
							<SelectContent>
								{availableSections.map((type) => (
									<SelectItem key={type} value={type}>
										{toTitleCase(type)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							onClick={addSection}
							disabled={!selectedSection}
							className="gap-2"
						>
							<Plus className="h-4 w-4" />
							Add
						</Button>
					</div>
				) : (
					<p className="text-sm text-muted-foreground">
						All available sections have been added. Remove a section
						to add a different one.
					</p>
				)}
			</Card>

			{/* Sections List */}
			<div className="space-y-4">
				<Label>
					Configured Sections ({config.layout?.sections?.length || 0})
				</Label>

				{config.layout?.sections &&
				config.layout.sections.length > 0 ? (
					config.layout.sections.map((section, index) => (
						<Card key={index} className="p-4">
							<div className="flex items-start justify-between mb-4">
								<h4 className="font-medium">
									{toTitleCase(section.type)}
									{section.type === "personal-info" && (
										<span className="text-xs text-muted-foreground ml-2">
											(Required)
										</span>
									)}
								</h4>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => removeSection(index)}
									className="text-destructive hover:text-destructive"
									disabled={section.type === "personal-info"}
									title={
										section.type === "personal-info"
											? "Personal info cannot be removed"
											: "Remove section"
									}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>

							<div className="grid grid-cols-2 gap-4">
								{/* Position */}
								<div className="space-y-2">
									<Label className="text-sm">Position</Label>
									<Select
										value={section.position}
										onValueChange={(v) =>
											updateSection(index, "position", v)
										}
										disabled={section.type === "personal-info"}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{availablePositions.map((pos) => (
												<SelectItem
													key={pos}
													value={pos}
												>
													{toTitleCase(pos)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<p className="text-xs text-muted-foreground">
										{section.type === "personal-info"
											? "Always Full-Width"
											: config.layout?.type ===
											  "single-column"
											? "Only full-width"
											: config.layout?.type?.startsWith(
													"two-column"
											  )
											? "Left, Right, or Full-Width"
											: config.layout?.type ===
											  "three-column"
											? "Left, Center, Right, or Full-Width"
											: ""}
									</p>
								</div>

								{/* Order */}
								<div className="space-y-2">
									<Label className="text-sm">Order</Label>
									<Input
										type="number"
										min={section.type === "personal-info" ? "0" : "1"}
										value={section.order}
										onChange={(e) =>
											updateSection(
												index,
												"order",
												parseInt(e.target.value)
											)
										}
										disabled={section.type === "personal-info"}
									/>
									{section.type === "personal-info" && (
										<p className="text-xs text-muted-foreground">
											Always Order 0
										</p>
									)}
								</div>

								{/* Custom Label */}
								<div className="space-y-2 col-span-2">
									<Label className="text-sm">
										Custom Label (Optional)
									</Label>
									<Input
										placeholder="e.g., Work Experience, Education Background"
										value={section.customLabel || ""}
										onChange={(e) =>
											updateSection(
												index,
												"customLabel",
												e.target.value
											)
										}
									/>
								</div>

								{/* Visibility */}
								<div className="flex items-center justify-between col-span-2">
									<div>
										<Label className="text-sm">
											Visible
										</Label>
										<p className="text-xs text-muted-foreground">
											Show this section
										</p>
									</div>
									<Switch
										checked={section.visibility}
										onCheckedChange={(v) =>
											updateSection(
												index,
												"visibility",
												v
											)
										}
									/>
								</div>

								{/* Required */}
								<div className="flex items-center justify-between col-span-2">
									<div>
										<Label className="text-sm">
											Required
										</Label>
										<p className="text-xs text-muted-foreground">
											Section must have content
										</p>
									</div>
									<Switch
										checked={section.required}
										onCheckedChange={(v) =>
											updateSection(index, "required", v)
										}
									/>
								</div>
							</div>

							{/* Inline Section-Specific Display Config */}
							{renderSectionDisplayConfig(section.type)}
						</Card>
					))
				) : (
					<Card className="p-8 text-center text-muted-foreground">
						<p>
							No sections added yet. Add sections to configure
							your template.
						</p>
					</Card>
				)}
			</div>
		</div>
	);
}
