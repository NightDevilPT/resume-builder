"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Type, AlignLeft, Sparkles } from "lucide-react";
import { TemplateConfig } from "@/interfaces/templates";

interface TypographyStepProps {
	config: Partial<TemplateConfig>;
	updateConfig: (section: string, data: any) => void;
}

// Reusable Components
interface FontSelectorProps {
	label: string;
	selectedFont: string;
	fonts: Array<{ value: string; label: string; category: string }>;
	onSelect: (font: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ label, selectedFont, fonts, onSelect }) => (
	<div className="space-y-3">
		<Label className="text-sm font-medium">{label}</Label>
		<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
			{fonts.map((font) => {
				const isSelected = selectedFont === font.value;
				return (
					<Card
						key={font.value}
						className={`p-3 cursor-pointer transition-all hover:shadow-sm ${
							isSelected
								? "border-primary bg-primary/5"
								: "border-border hover:border-primary/30"
						}`}
						onClick={() => onSelect(font.value)}
					>
						<div className="space-y-1">
							<p
								className={`font-medium text-sm ${
									isSelected ? "text-primary" : ""
								}`}
								style={{ fontFamily: font.value }}
							>
								{font.label}
							</p>
							<Badge variant="outline" className="text-xs">
								{font.category}
							</Badge>
						</div>
					</Card>
				);
			})}
		</div>
	</div>
);

interface BadgeSelectGroupProps {
	label: string;
	options: Array<{ value: string; label: string; metadata?: string }>;
	selected: string;
	onSelect: (value: string) => void;
}

const BadgeSelectGroup: React.FC<BadgeSelectGroupProps> = ({ label, options, selected, onSelect }) => (
	<div className="space-y-3">
		<Label className="text-sm font-medium">{label}</Label>
		<div className="flex flex-wrap gap-2">
			{options.map((option) => {
				const isSelected = selected === option.value;
				return (
					<Badge
						key={option.value}
						variant={isSelected ? "default" : "outline"}
						className={`cursor-pointer px-4 py-2 transition-all ${
							isSelected ? "" : "hover:border-primary/50"
						}`}
						onClick={() => onSelect(option.value)}
					>
						<span className="flex flex-col items-center gap-0.5">
							<span className="font-semibold">{option.label}</span>
							{option.metadata && (
								<span className="text-[10px] opacity-70">{option.metadata}</span>
							)}
						</span>
					</Badge>
				);
			})}
		</div>
	</div>
);

interface ToggleOptionProps {
	label: string;
	description: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ label, description, checked, onCheckedChange }) => (
	<div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
		<div>
			<Label className="cursor-pointer">{label}</Label>
			<p className="text-xs text-muted-foreground">{description}</p>
		</div>
		<Switch checked={checked} onCheckedChange={onCheckedChange} />
	</div>
);

export function TypographyStep({ config, updateConfig }: TypographyStepProps) {
	// Only use fonts loaded in Next.js project + system fonts
	const fonts = [
		{ value: "Geist", label: "Geist (Sans)", category: "Modern" },
		{ value: "Geist Mono", label: "Geist Mono", category: "Monospace" },
		{ value: "system-ui", label: "System UI", category: "System" },
		{ value: "Georgia", label: "Georgia", category: "Serif" },
		{ value: "Times New Roman", label: "Times New Roman", category: "Serif" },
	];
	
	const fontWeights = [
		{ value: "light", label: "Light", weight: "300" },
		{ value: "normal", label: "Regular", weight: "400" },
		{ value: "medium", label: "Medium", weight: "500" },
		{ value: "semibold", label: "Semi Bold", weight: "600" },
		{ value: "bold", label: "Bold", weight: "700" },
	];
	
	const fontSizes = [
		{ value: "xs", label: "XS", px: "12px" },
		{ value: "sm", label: "SM", px: "14px" },
		{ value: "base", label: "Base", px: "16px" },
		{ value: "lg", label: "LG", px: "18px" },
		{ value: "xl", label: "XL", px: "20px" },
		{ value: "2xl", label: "2XL", px: "24px" },
		{ value: "3xl", label: "3XL", px: "30px" },
		{ value: "4xl", label: "4XL", px: "36px" },
	];
	
	const lineHeights = [
		{ value: "tight", label: "Tight", height: "1.25" },
		{ value: "normal", label: "Normal", height: "1.5" },
		{ value: "relaxed", label: "Relaxed", height: "1.75" },
	];

	const updateTypography = (key: string, value: any) => {
		updateConfig("typography", {
			...config.typography,
			[key]: value,
		});
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
					<Type className="h-5 w-5" />
					Typography Settings
				</h3>
				<p className="text-sm text-muted-foreground mb-6">
					Customize fonts, sizes, and text styling for your resume template
				</p>
			</div>

			{/* Font Families */}
			<Card className="p-5">
				<div className="flex items-center gap-2 mb-4">
					<Sparkles className="h-4 w-4 text-primary" />
					<h4 className="font-semibold">Font Families</h4>
				</div>
				
				<div className="space-y-6">
					<FontSelector
						label="Heading Font"
						selectedFont={config.typography?.headingFont || "Geist"}
						fonts={fonts}
						onSelect={(v) => updateTypography("headingFont", v)}
					/>
					<FontSelector
						label="Body Font"
						selectedFont={config.typography?.bodyFont || "Geist"}
						fonts={fonts}
						onSelect={(v) => updateTypography("bodyFont", v)}
					/>
				</div>
			</Card>

			{/* Name Styling */}
			<Card className="p-5">
				<div className="flex items-center gap-2 mb-4">
					<AlignLeft className="h-4 w-4 text-primary" />
					<h4 className="font-semibold">Name Styling</h4>
				</div>
				
				<div className="space-y-5">
					<BadgeSelectGroup
						label="Font Size"
						options={fontSizes.map(s => ({ value: s.value, label: s.label, metadata: s.px }))}
						selected={config.typography?.nameSize || "3xl"}
						onSelect={(v) => updateTypography("nameSize", v)}
					/>
					<BadgeSelectGroup
						label="Font Weight"
						options={fontWeights.map(w => ({ value: w.value, label: w.label, metadata: w.weight }))}
						selected={config.typography?.nameWeight || "bold"}
						onSelect={(v) => updateTypography("nameWeight", v)}
					/>
				</div>
			</Card>

			{/* Heading Styling */}
			<Card className="p-5">
				<div className="flex items-center gap-2 mb-4">
					<Type className="h-4 w-4 text-primary" />
					<h4 className="font-semibold">Section Heading Styling</h4>
				</div>
				
				<div className="space-y-5">
					<BadgeSelectGroup
						label="Font Size"
						options={fontSizes
							.filter(s => ["sm", "base", "lg", "xl", "2xl"].includes(s.value))
							.map(s => ({ value: s.value, label: s.label, metadata: s.px }))}
						selected={config.typography?.headingSize || "xl"}
						onSelect={(v) => updateTypography("headingSize", v)}
					/>
					<BadgeSelectGroup
						label="Font Weight"
						options={fontWeights.map(w => ({ value: w.value, label: w.label, metadata: w.weight }))}
						selected={config.typography?.headingWeight || "semibold"}
						onSelect={(v) => updateTypography("headingWeight", v)}
					/>

					{/* Style Options */}
					<div className="space-y-3 pt-2 border-t">
						<Label className="text-sm font-medium">Style Options</Label>
						<div className="space-y-2">
							<ToggleOption
								label="Uppercase Headings"
								description="Transform headings to UPPERCASE"
								checked={config.typography?.headingUppercase || false}
								onCheckedChange={(v) => updateTypography("headingUppercase", v)}
							/>
							<ToggleOption
								label="Underline Headings"
								description="Add underline to section headings"
								checked={config.typography?.headingUnderline || false}
								onCheckedChange={(v) => updateTypography("headingUnderline", v)}
							/>
						</div>
					</div>
				</div>
			</Card>

			{/* Subheading Styling */}
			<Card className="p-5">
				<div className="flex items-center gap-2 mb-4">
					<Type className="h-4 w-4 text-primary" />
					<h4 className="font-semibold">Subheading Styling</h4>
					<Badge variant="secondary" className="ml-auto text-xs">
						Job Titles, Degrees, etc.
					</Badge>
				</div>
				
				<div className="space-y-5">
					<BadgeSelectGroup
						label="Font Size"
						options={fontSizes
							.filter(s => ["xs", "sm", "base", "lg"].includes(s.value))
							.map(s => ({ value: s.value, label: s.label, metadata: s.px }))}
						selected={config.typography?.subheadingSize || "base"}
						onSelect={(v) => updateTypography("subheadingSize", v)}
					/>
					<BadgeSelectGroup
						label="Font Weight"
						options={fontWeights.map(w => ({ value: w.value, label: w.label, metadata: w.weight }))}
						selected={config.typography?.subheadingWeight || "semibold"}
						onSelect={(v) => updateTypography("subheadingWeight", v)}
					/>
				</div>
			</Card>

			{/* Additional Settings */}
			<Card className="p-5">
				<div className="flex items-center gap-2 mb-4">
					<Sparkles className="h-4 w-4 text-primary" />
					<h4 className="font-semibold">Additional Settings</h4>
				</div>
				
				<div className="space-y-4">
					{/* Line Height */}
					<div className="space-y-3">
						<Label className="text-sm font-medium">Line Height</Label>
						<p className="text-xs text-muted-foreground mb-2">Spacing between lines of text</p>
						<div className="flex gap-2">
							{lineHeights.map((height) => {
								const isSelected = (config.typography?.lineHeight || "relaxed") === height.value;
								return (
									<Badge
										key={height.value}
										variant={isSelected ? "default" : "outline"}
										className={`cursor-pointer px-4 py-2 transition-all flex-1 justify-center ${
											isSelected ? "" : "hover:border-primary/50"
										}`}
										onClick={() => updateTypography("lineHeight", height.value)}
									>
										<span className="flex flex-col items-center gap-0.5">
											<span className="font-semibold">{height.label}</span>
											<span className="text-[10px] opacity-70">{height.height}</span>
										</span>
									</Badge>
								);
							})}
						</div>
					</div>

					{/* Visual Options */}
					<div className="space-y-3 pt-2 border-t">
						<Label className="text-sm font-medium">Visual Elements</Label>
						<div className="space-y-2">
							<ToggleOption
								label="Show Section Icons"
								description="Display icons next to section headings"
								checked={config.typography?.showIcons || false}
								onCheckedChange={(v) => updateTypography("showIcons", v)}
							/>
							<ToggleOption
								label="Show Section Dividers"
								description="Add visual separators between sections"
								checked={config.typography?.showDividers || false}
								onCheckedChange={(v) => updateTypography("showDividers", v)}
							/>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}

