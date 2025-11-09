"use client";

import {
	exportResumeToPDF,
	generateResumeFileName,
} from "@/lib/utils/pdf-export";
import {
	Download,
	Loader2,
	ZoomIn,
	ZoomOut,
	RotateCcw,
	SlidersHorizontal,
	CheckCircle2,
	Sparkles,
	Palette,
	Type,
	Ruler,
	ShieldCheck,
	Settings2,
} from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TemplateConfig, TemplatePermissions } from "@/interfaces/templates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResumeToolbarProps {
	fullName?: string;
	onZoomIn: () => void;
	onZoomOut: () => void;
	onResetZoom: () => void;
	currentZoom: number;
	permissions?: TemplatePermissions;
	currentConfig: TemplateConfig;
	onUpdateConfig: (updates: Partial<TemplateConfig>) => void;
}

const COLOR_FIELDS: Array<{
	key: keyof TemplateConfig["colors"];
	label: string;
	description: string;
}> = [
	{
		key: "primary",
		label: "Primary",
		description: "Headings, highlights, and primary CTAs.",
	},
	{
		key: "accent",
		label: "Accent",
		description: "Secondary accents and badges.",
	},
	{
		key: "secondary",
		label: "Secondary",
		description: "Supporting color for cards and chips.",
	},
	{
		key: "text",
		label: "Body text",
		description: "Main paragraph and detail text.",
	},
	{
		key: "textLight",
		label: "Muted text",
		description: "Sub-headings, helper text, captions.",
	},
	{
		key: "background",
		label: "Background",
		description: "Canvas color for the resume body.",
	},
	{
		key: "border",
		label: "Borders",
		description: "Lines, separators, boxes, and outlines.",
	},
	{
		key: "link",
		label: "Links",
		description: "Hyperlinks and interactive text.",
	},
];

const BORDER_STYLES: TemplateConfig["borders"]["style"][] = [
	"none",
	"solid",
	"dashed",
	"dotted",
	"double",
];

type PalettePreset = {
	id: string;
	label: string;
	category: string;
	description: string;
	colors: TemplateConfig["colors"];
};

type TypographyPreset = {
	id: string;
	label: string;
	headingFont: string;
	bodyFont: string;
	description: string;
};

type SpacingPreset = {
	id: string;
	label: string;
	description: string;
	value: TemplateConfig["spacing"];
};

type BorderPreset = {
	id: string;
	label: string;
	description: string;
	value: Pick<TemplateConfig["borders"], "width" | "style" | "radius">;
};

const PALETTE_PRESETS: PalettePreset[] = [
	{
		id: "modern-blue",
		label: "Modern Blue",
		category: "Professional",
		description: "Corporate-friendly palette with confident blues.",
		colors: {
			primary: "#2563eb",
			accent: "#1d4ed8",
			secondary: "#3b82f6",
			text: "#0f172a",
			textLight: "#475569",
			background: "#ffffff",
			border: "#e2e8f0",
			link: "#2563eb",
		},
	},
	{
		id: "warm-sunset",
		label: "Warm Sunset",
		category: "Creative",
		description: "Friendly oranges with soft supporting tones.",
		colors: {
			primary: "#f97316",
			accent: "#ea580c",
			secondary: "#fb923c",
			text: "#431407",
			textLight: "#9a3412",
			background: "#fff7ed",
			border: "#fed7aa",
			link: "#c2410c",
		},
	},
	{
		id: "neutral-slate",
		label: "Neutral Slate",
		category: "Minimal",
		description: "Calm neutrals for conservative industries.",
		colors: {
			primary: "#0f172a",
			accent: "#1e293b",
			secondary: "#475569",
			text: "#0f172a",
			textLight: "#64748b",
			background: "#f8fafc",
			border: "#cbd5e1",
			link: "#2563eb",
		},
	},
	{
		id: "elegant-emerald",
		label: "Elegant Emerald",
		category: "Premium",
		description: "Luxury-inspired greens with crisp contrast.",
		colors: {
			primary: "#047857",
			accent: "#0f766e",
			secondary: "#10b981",
			text: "#022c22",
			textLight: "#4b5563",
			background: "#f0fdf4",
			border: "#bbf7d0",
			link: "#0f766e",
		},
	},
	{
		id: "creative-purple",
		label: "Creative Purple",
		category: "Agency",
		description: "Expressive violets for standout portfolios.",
		colors: {
			primary: "#7c3aed",
			accent: "#8b5cf6",
			secondary: "#a855f7",
			text: "#2e1065",
			textLight: "#6d28d9",
			background: "#f5f3ff",
			border: "#ddd6fe",
			link: "#6d28d9",
		},
	},
	{
		id: "bold-ruby",
		label: "Bold Ruby",
		category: "Creative",
		description: "High-energy reds for marketing roles.",
		colors: {
			primary: "#dc2626",
			accent: "#ef4444",
			secondary: "#f87171",
			text: "#1f2937",
			textLight: "#6b7280",
			background: "#fef2f2",
			border: "#fecaca",
			link: "#dc2626",
		},
	},
];

const TYPOGRAPHY_PRESETS: TypographyPreset[] = [
	{
		id: "geist",
		label: "Geist / Geist",
		headingFont: "Geist",
		bodyFont: "Geist",
		description: "Swiss-inspired sans with excellent readability.",
	},
	{
		id: "inter",
		label: "Inter / Inter",
		headingFont: "Inter",
		bodyFont: "Inter",
		description: "Modern sans-serif for digital roles.",
	},
	{
		id: "playfair-inter",
		label: "Playfair / Inter",
		headingFont: "Playfair Display",
		bodyFont: "Inter",
		description: "Editorial flair for creative storytelling.",
	},
	{
		id: "roboto",
		label: "Roboto / Roboto",
		headingFont: "Roboto",
		bodyFont: "Roboto",
		description: "Reliable system-friendly pairing.",
	},
];

const SPACING_PRESETS: SpacingPreset[] = [
	{
		id: "compact",
		label: "Compact",
		description: "Max content density for early-career resumes.",
		value: {
			section: "1rem",
			item: "0.75rem",
			margin: "1rem",
			padding: "1rem",
		},
	},
	{
		id: "balanced",
		label: "Balanced",
		description: "Comfortable breathing room across sections.",
		value: {
			section: "1.5rem",
			item: "1rem",
			margin: "1.5rem",
			padding: "1.5rem",
		},
	},
	{
		id: "spacious",
		label: "Spacious",
		description: "Premium spacing for senior leadership roles.",
		value: {
			section: "2rem",
			item: "1.25rem",
			margin: "2rem",
			padding: "2rem",
		},
	},
];

const SPACING_FIELDS: Array<{
	key: keyof TemplateConfig["spacing"];
	label: string;
	description: string;
}> = [
	{
		key: "section",
		label: "Section gap",
		description: "Distance between major resume sections.",
	},
	{
		key: "item",
		label: "Item gap",
		description: "Spacing between entries inside a section.",
	},
	{
		key: "margin",
		label: "Page margin",
		description: "Outermost white space around the canvas.",
	},
	{
		key: "padding",
		label: "Section padding",
		description: "Internal padding inside card-like layouts.",
	},
];

const BORDER_PRESETS: BorderPreset[] = [
	{
		id: "minimal",
		label: "Minimal",
		description: "Clean edges, no outlines.",
		value: {
			width: "0px",
			style: "none",
			radius: "0.4rem",
		},
	},
	{
		id: "standard",
		label: "Standard",
		description: "Subtle dividers with soft corners.",
		value: {
			width: "1px",
			style: "solid",
			radius: "0.6rem",
		},
	},
	{
		id: "statement",
		label: "Statement",
		description: "Bold outlines and generous rounding.",
		value: {
			width: "2px",
			style: "solid",
			radius: "1rem",
		},
	},
];

const BORDER_WIDTH_PRESETS = ["0px", "1px", "2px", "3px"] as const;
const BORDER_RADIUS_PRESETS = ["0rem", "0.4rem", "0.6rem", "1rem"] as const;

const DEFAULT_PALETTE_ID = PALETTE_PRESETS[0].id;

interface ColorsTabProps {
	canEdit: boolean;
	currentConfig: TemplateConfig;
	onUpdateConfig: (updates: Partial<TemplateConfig>) => void;
	onApplyPreset: (id: string) => void;
	isPresetActive: (preset: PalettePreset) => boolean;
}

function ColorsTab({
	canEdit,
	currentConfig,
	onUpdateConfig,
	onApplyPreset,
	isPresetActive,
}: ColorsTabProps) {
	const handleColorChange = (
		key: keyof TemplateConfig["colors"],
		value: string
	) => {
		const normalized = value.startsWith("#")
			? value.slice(0, 7).toUpperCase()
			: `#${value.slice(0, 6).toUpperCase()}`;

		if (!/^#[0-9A-F]{3,6}$/i.test(normalized)) {
			onUpdateConfig({
				colors: {
					...currentConfig.colors,
					[key]: normalized,
				},
			});
			return;
		}

		onUpdateConfig({
			colors: {
				...currentConfig.colors,
				[key]: normalized,
			},
		});
	};

	return (
		<div>
			<Card className="border-none p-0">
				<div className="flex items-center gap-2">
					<Palette className="h-4 w-4 text-primary" />
					<h4 className="text-sm font-semibold">Custom colors</h4>
					<Button
						variant="ghost"
						size="sm"
						disabled={!canEdit}
						className="ml-auto h-7 gap-1 text-xs"
						onClick={() =>
							canEdit && onApplyPreset(DEFAULT_PALETTE_ID)
						}
					>
						<RotateCcw className="h-3 w-3" />
						Reset palette
					</Button>
				</div>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{COLOR_FIELDS.map((field) => {
						const value =
							currentConfig.colors[field.key] ?? "#000000";
						return (
							<div
								key={field.key}
								className="space-y-2 rounded-lg border border-border/40 bg-muted/20 p-3"
							>
								<div className="flex items-center gap-2">
									<input
										type="color"
										disabled={!canEdit}
										value={value}
										onChange={(event) =>
											handleColorChange(
												field.key,
												event.target.value
											)
										}
										className="h-8 outline-none ring-0 cursor-pointer w-8 rounded-md border-border"
										style={{ backgroundColor: value }}
									/>
									<div className="flex-1">
										<Label className="text-xs font-semibold uppercase">
											{field.label}
										</Label>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Input
										value={value}
										disabled={!canEdit}
										onChange={(event) =>
											handleColorChange(
												field.key,
												event.target.value
											)
										}
										maxLength={7}
										className="h-9 font-mono text-xs uppercase"
										placeholder="#000000"
									/>
								</div>
							</div>
						);
					})}
				</div>
			</Card>
		</div>
	);
}

interface TypographyTabProps {
	canEdit: boolean;
	onApplyPreset: (id: string) => void;
	isPresetActive: (preset: TypographyPreset) => boolean;
}

function TypographyTab({
	canEdit,
	onApplyPreset,
	isPresetActive,
}: TypographyTabProps) {
	return (
		<Card className="border-none p-0">
			<div className="flex items-center gap-2">
				<Type className="h-4 w-4 text-primary" />
				<h4 className="text-sm font-semibold">Font pairings</h4>
				<Badge
					variant={canEdit ? "outline" : "secondary"}
					className="ml-auto text-[10px]"
				>
					{canEdit ? "Editable" : "Locked"}
				</Badge>
			</div>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{TYPOGRAPHY_PRESETS.map((preset) => {
					const isActive = isPresetActive(preset);
					return (
						<Card
							key={preset.id}
							role="button"
							tabIndex={canEdit ? 0 : -1}
							onClick={() => canEdit && onApplyPreset(preset.id)}
							onKeyDown={(event) => {
								if (event.key === "Enter" && canEdit) {
									onApplyPreset(preset.id);
								}
							}}
							className={cn(
								"p-3 cursor-pointer border rounded-xl transition-all hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
								isActive
									? "border-primary bg-primary/5 shadow-sm"
									: "border-border hover:border-primary/30",
								!canEdit &&
									"cursor-not-allowed opacity-60 hover:border-border"
							)}
							aria-pressed={isActive}
						>
							<div className="flex items-start justify-between gap-3">
								<div className="space-y-1">
									<Label
										className={cn(
											"text-sm font-semibold truncate",
											isActive && "text-primary"
										)}
										style={{
											fontFamily: preset.headingFont,
										}}
									>
										{preset.label}
									</Label>
								</div>
								{isActive ? (
									<CheckCircle2 className="h-4 w-4 text-primary" />
								) : null}
							</div>
							<div className="space-y-1 text-xs text-muted-foreground">
								<p
									style={{ fontFamily: preset.headingFont }}
									className="text-sm"
								>
									Jane Doe — Product Designer
								</p>
								<p style={{ fontFamily: preset.bodyFont }}>
									Transforming ideas into delightful customer
									experiences.
								</p>
							</div>
						</Card>
					);
				})}
			</div>
		</Card>
	);
}

interface SpacingTabProps {
	canEdit: boolean;
	currentConfig: TemplateConfig;
	onApplyPreset: (id: string) => void;
	isPresetActive: (preset: SpacingPreset) => boolean;
	onUpdateConfig: (updates: Partial<TemplateConfig>) => void;
}

function SpacingTab({
	canEdit,
	currentConfig,
	onApplyPreset,
	isPresetActive,
	onUpdateConfig,
}: SpacingTabProps) {
	const handleSpacingChange = (
		key: keyof TemplateConfig["spacing"],
		value: string
	) => {
		onUpdateConfig({
			spacing: {
				...currentConfig.spacing,
				[key]: value,
			},
		});
	};

	return (
		<div className="space-y-4">
			<Card className="border-none p-0">
				<h4 className="text-sm font-semibold ">
					Fine tune spacing
				</h4>
				<div className="grid gap-3 md:grid-cols-2">
					{SPACING_FIELDS.map((field) => (
						<div
							key={field.key}
							className="space-y-2 rounded-lg border border-border/40 bg-muted/20 p-3"
						>
							<div className="flex items-center justify-between gap-2">
								<Label className="text-xs font-semibold uppercase">
									{field.label}
								</Label>
								<span className="text-[10px] text-muted-foreground">
									{currentConfig.spacing[field.key]}
								</span>
							</div>
							<Input
								disabled={!canEdit}
								value={currentConfig.spacing[field.key]}
								onChange={(event) =>
									handleSpacingChange(
										field.key,
										event.target.value
									)
								}
								placeholder="1.5rem"
								className="h-9 text-xs"
							/>
							<p className="text-[11px] text-muted-foreground">
								{field.description}
							</p>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
}

interface BordersTabProps {
	canEdit: boolean;
	currentConfig: TemplateConfig;
	onApplyPreset: (id: string) => void;
	isPresetActive: (preset: BorderPreset) => boolean;
	onUpdateConfig: (updates: Partial<TemplateConfig>) => void;
}

function BordersTab({
	canEdit,
	currentConfig,
	onApplyPreset,
	isPresetActive,
	onUpdateConfig,
}: BordersTabProps) {
	const handleBorderUpdate = (
		field: keyof TemplateConfig["borders"],
		value: string
	) => {
		onUpdateConfig({
			borders: {
				...currentConfig.borders,
				[field]: value,
			},
		});
	};

	return (
		<div className="space-y-4">
			<Card className="border-none p-0">
				<div className="flex items-center gap-2 ">
					<Settings2 className="h-4 w-4 text-primary" />
					<h4 className="text-sm font-semibold">Fine tune borders</h4>
				</div>
				<div className="space-y-3 text-xs text-muted-foreground">
					<label className="flex items-center justify-between gap-3">
						<span className="font-medium text-foreground">
							Style
						</span>
						<Select
							value={currentConfig.borders.style}
							disabled={!canEdit}
							onValueChange={(value) =>
								handleBorderUpdate(
									"style",
									value as TemplateConfig["borders"]["style"],
								)
							}
						>
							<SelectTrigger className="w-36">
								<SelectValue placeholder="Border style" />
							</SelectTrigger>
							<SelectContent>
								{BORDER_STYLES.map((style) => (
									<SelectItem key={style} value={style}>
										{style}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</label>
					<Label className="flex items-center justify-between gap-3 shadow-none border-none">
						<span className="font-medium text-foreground">
							Border color
						</span>
						<div className="flex items-center gap-2">
							<input
								type="color"
								disabled={!canEdit}
								value={
									currentConfig.borders.color ||
									currentConfig.colors.border
								}
								onChange={(event) =>
									handleBorderUpdate(
										"color",
										event.target.value
									)
								}
								className="h-8 w-10 cursor-pointer rounded border border-border"
							/>
							<Input
								disabled={true}
								value={
									currentConfig.borders.color ||
									currentConfig.colors.border
								}
								onChange={(event) =>
									handleBorderUpdate(
										"color",
										event.target.value
									)
								}
								maxLength={7}
								className="h-8 w-28 text-[11px] uppercase"
							/>
						</div>
					</Label>
					<div className="space-y-2 rounded-lg border border-border/60 bg-background/60 p-3">
						<div className="flex items-center justify-between gap-2">
							<Label className="text-xs font-semibold uppercase">
								Border width
							</Label>
							<Badge variant="outline" className="text-[10px]">
								{currentConfig.borders.width}
							</Badge>
						</div>
						<p className="text-[11px] text-muted-foreground">
							Choose a preset thickness for outlines and dividers.
						</p>
						<div className="flex flex-wrap gap-2">
							{BORDER_WIDTH_PRESETS.map((preset) => {
								const isActive = currentConfig.borders.width === preset;
								return (
									<Badge
										key={preset}
										role="button"
										onClick={() =>
											canEdit && handleBorderUpdate("width", preset)
										}
										className={cn(
											"cursor-pointer px-2 py-1 text-[11px] transition",
											isActive
												? "bg-primary text-primary-foreground shadow"
												: "bg-muted text-muted-foreground",
											!canEdit && "pointer-events-none opacity-60",
										)}
									>
										{preset}
									</Badge>
								);
							})}
						</div>
					</div>
					<div className="space-y-2 rounded-lg border border-border/60 bg-background/60 p-3">
						<div className="flex items-center justify-between gap-2">
							<Label className="text-xs font-semibold uppercase">
								Corner radius
							</Label>
							<Badge variant="outline" className="text-[10px]">
								{currentConfig.borders.radius}
							</Badge>
						</div>
						<p className="text-[11px] text-muted-foreground">
							Pick the rounding style applied to cards and sections.
						</p>
						<div className="flex flex-wrap gap-2">
							{BORDER_RADIUS_PRESETS.map((preset) => {
								const isActive = currentConfig.borders.radius === preset;
								return (
									<Badge
										key={preset}
										role="button"
										onClick={() =>
											canEdit && handleBorderUpdate("radius", preset)
										}
										className={cn(
											"cursor-pointer px-2 py-1 text-[11px] transition",
											isActive
												? "bg-primary text-primary-foreground shadow"
												: "bg-muted text-muted-foreground",
											!canEdit && "pointer-events-none opacity-60",
										)}
									>
										{preset}
									</Badge>
								);
							})}
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}

export function ResumeToolbar({
	fullName,
	onZoomIn,
	onZoomOut,
	onResetZoom,
	currentZoom,
	permissions,
	currentConfig,
	onUpdateConfig,
}: ResumeToolbarProps) {
	const [isExporting, setIsExporting] = useState(false);

	const handleDownloadPDF = async () => {
		try {
			setIsExporting(true);
			toast.loading("Generating PDF...", { id: "pdf-export" });

			const fileName = generateResumeFileName(fullName);
			await new Promise((resolve) => setTimeout(resolve, 500));
			await exportResumeToPDF(fileName);

			toast.success("Print dialog opened!", {
				id: "pdf-export",
				description:
					"IMPORTANT: Click 'More settings' and uncheck 'Headers and footers' to remove date/title from PDF",
				duration: 3000,
			});
		} catch (error) {
			console.error("PDF export error:", error);
			toast.error("Failed to download resume", {
				id: "pdf-export",
				description: "Please try again or contact support.",
			});
		} finally {
			setIsExporting(false);
		}
	};

	const canChangeColors = permissions?.canChangeColors ?? true;
	const canChangeFonts = permissions?.canChangeFonts ?? true;
	const canChangeSpacing = permissions?.canChangeSpacing ?? true;
	const canChangeBorders = permissions?.canChangeBorders ?? true;

	const applyPalette = (id: string) => {
		const preset = PALETTE_PRESETS.find((item) => item.id === id);
		if (!preset) return;

		onUpdateConfig({
			colors: {
				...currentConfig.colors,
				...preset.colors,
			},
		});
	};

	const applyTypography = (id: string) => {
		const preset = TYPOGRAPHY_PRESETS.find((item) => item.id === id);
		if (!preset) return;

		onUpdateConfig({
			typography: {
				...currentConfig.typography,
				headingFont: preset.headingFont,
				bodyFont: preset.bodyFont,
			},
		});
	};

	const applySpacing = (id: string) => {
		const preset = SPACING_PRESETS.find((item) => item.id === id);
		if (!preset) return;

		onUpdateConfig({
			spacing: {
				...currentConfig.spacing,
				...preset.value,
			},
		});
	};

	const applyBorders = (id: string) => {
		const preset = BORDER_PRESETS.find((item) => item.id === id);
		if (!preset) return;

		onUpdateConfig({
			borders: {
				...currentConfig.borders,
				...preset.value,
			},
		});
	};

	const isPaletteActive = (preset: PalettePreset) => {
		const colors = currentConfig.colors;
		return Object.entries(preset.colors).every(
			([key, value]) =>
				colors[key as keyof TemplateConfig["colors"]] === value
		);
	};

	const isTypographyPresetActive = (preset: TypographyPreset) => {
		const typography = currentConfig.typography;
		return (
			typography.headingFont === preset.headingFont &&
			typography.bodyFont === preset.bodyFont
		);
	};

	const isSpacingPresetActive = (preset: SpacingPreset) => {
		const spacing = currentConfig.spacing;
		return Object.entries(preset.value).every(
			([key, value]) =>
				spacing[key as keyof TemplateConfig["spacing"]] === value
		);
	};

	const isBorderPresetActive = (preset: BorderPreset) => {
		const borders = currentConfig.borders;
		return (
			borders.width === preset.value.width &&
			borders.style === preset.value.style &&
			borders.radius === preset.value.radius
		);
	};

	const tabDefinitions = [
		{
			id: "colors",
			label: "Colors",
			icon: Palette,
			isVisible: canChangeColors,
			render: () => (
				<ColorsTab
					canEdit={canChangeColors}
					currentConfig={currentConfig}
					onUpdateConfig={onUpdateConfig}
					onApplyPreset={applyPalette}
					isPresetActive={isPaletteActive}
				/>
			),
		},
		{
			id: "type",
			label: "Typography",
			icon: Type,
			isVisible: canChangeFonts,
			render: () => (
				<TypographyTab
					canEdit={canChangeFonts}
					onApplyPreset={applyTypography}
					isPresetActive={isTypographyPresetActive}
				/>
			),
		},
		{
			id: "spacing",
			label: "Spacing",
			icon: Ruler,
			isVisible: canChangeSpacing,
			render: () => (
				<SpacingTab
					canEdit={canChangeSpacing}
					currentConfig={currentConfig}
					onApplyPreset={applySpacing}
					isPresetActive={isSpacingPresetActive}
					onUpdateConfig={onUpdateConfig}
				/>
			),
		},
		{
			id: "borders",
			label: "Borders",
			icon: ShieldCheck,
			isVisible: canChangeBorders,
			render: () => (
				<BordersTab
					canEdit={canChangeBorders}
					currentConfig={currentConfig}
					onApplyPreset={applyBorders}
					isPresetActive={isBorderPresetActive}
					onUpdateConfig={onUpdateConfig}
				/>
			),
		},
	] as const;

	const visibleTabs = tabDefinitions.filter((tab) => tab.isVisible);

	const tabsGridClass = cn(
		"grid gap-1 bg-muted/40 p-1",
		visibleTabs.length === 1
			? "grid-cols-1"
			: visibleTabs.length === 2
			? "grid-cols-2"
			: visibleTabs.length === 3
			? "grid-cols-3"
			: "grid-cols-4"
	);

	return (
		<div className="flex items-center gap-2">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="h-8 gap-2"
						title="Style controls"
					>
						<SlidersHorizontal className="h-4 w-4" />
						<span className="hidden lg:inline text-xs font-medium">
							Style controls
						</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[380px] h-[420px] space-y-4">
					<ScrollArea className="h-full pr-4">
						<div className="space-y-1">
							<h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
								Template design controls
								{permissions ? (
									<Badge
										variant="secondary"
										className="text-[10px] uppercase"
									>
										Live
									</Badge>
								) : null}
							</h4>
							<p className="text-xs text-muted-foreground">
								Adjust these options to match your personal
								brand. Locked items are controlled by the
								template owner.
							</p>
						</div>
						{visibleTabs.length ? (
							<Tabs
								defaultValue={visibleTabs[0].id}
								className="space-y-2 mt-2"
							>
								<TabsList className={tabsGridClass+" w-full"}>
									{visibleTabs.map((tab) => {
										const Icon = tab.icon;
										return (
											<TabsTrigger
												key={tab.id}
												value={tab.id}
												className="flex w-full items-center justify-center"
											>
												<Icon className="h-3.5 w-3.5" />
											</TabsTrigger>
										);
									})}
								</TabsList>

								{visibleTabs.map((tab) => (
									<TabsContent
										key={tab.id}
										value={tab.id}
										className="space-y-4"
									>
										{tab.render()}
									</TabsContent>
								))}
							</Tabs>
						) : (
							<Card className="border-none p-0text-sm text-muted-foreground bg-muted/20">
								All styling controls are locked for this
								template.
							</Card>
						)}
					</ScrollArea>
				</PopoverContent>
			</Popover>

			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="sm"
					onClick={onZoomOut}
					disabled={currentZoom <= 25}
					title="Zoom Out (Ctrl + -)"
					className="h-8 w-8 p-0"
				>
					<ZoomOut className="h-4 w-4" />
				</Button>

				<span className="text-xs font-medium min-w-[3.5rem] text-center">
					{currentZoom}%
				</span>

				<Button
					variant="ghost"
					size="sm"
					onClick={onZoomIn}
					disabled={currentZoom >= 200}
					title="Zoom In (Ctrl + +)"
					className="h-8 w-8 p-0"
				>
					<ZoomIn className="h-4 w-4" />
				</Button>

				<Button
					variant="ghost"
					size="sm"
					onClick={onResetZoom}
					title="Reset Zoom (Ctrl + 0)"
					className="h-8 w-8 p-0"
				>
					<RotateCcw className="h-3.5 w-3.5" />
				</Button>
			</div>

			<Separator orientation="vertical" className="h-6" />

			<Button
				onClick={handleDownloadPDF}
				disabled={isExporting}
				size="sm"
				className="h-8 gap-2"
			>
				{isExporting ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						<span className="hidden sm:inline">Generating...</span>
					</>
				) : (
					<>
						<Download className="h-4 w-4" />
						<span className="hidden sm:inline">Download PDF</span>
					</>
				)}
			</Button>
		</div>
	);
}
