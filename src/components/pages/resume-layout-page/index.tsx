"use client";

import {
	Palette,
	Layout,
	Type,
	Settings,
	Eye,
	Save,
	Loader2,
	ZoomIn,
	ZoomOut,
	RotateCcw,
	Download,
} from "lucide-react";
import {
	useTemplate,
	templateActions,
} from "@/components/providers/template-provider";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { PricingStep } from "./steps/PricingStep";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useMemo } from "react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { TemplateConfig } from "@/interfaces/templates";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypographyStep } from "./steps/TypographyStep";
import { ColorSchemeStep } from "./steps/ColorSchemeStep";
import { LayoutConfigStep } from "./steps/LayoutConfigStep";
import { SectionConfigStep } from "./steps/SectionConfigStep";
import { PermissionsStep } from "./steps/PermissionsStep";
import { TemplatePreview } from "./components/TemplatePreview";
import { defaultTemplateConfig } from "@/constants/default-template";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportResumeToPDF } from "@/lib/utils/pdf-export";

export default function AdminTemplateCreator() {
	const { dispatch, isSaving, saveTemplate, updateTemplateById } = useTemplate();
	const [activeTab, setActiveTab] = useState("basic");
	const [previewMode, setPreviewMode] = useState(false);

	// Zoom and drag state for preview
	const [zoom, setZoom] = useState(100);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [isDraggingActive, setIsDraggingActive] = useState(false);
	const previewContainerRef = useRef<HTMLDivElement>(null);

	// Track current template ID (null if creating new)
	const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null);

	// Local template state (will be saved to provider on submit)
	const [templateConfig, setTemplateConfig] = useState<
		Partial<TemplateConfig>
	>(defaultTemplateConfig);

	const updateConfig = (section: string, data: any) => {
		setTemplateConfig((prev) => {
			const currentSection = prev[section as keyof typeof prev];
			return {
				...prev,
				[section]:
					typeof currentSection === "object" &&
						currentSection !== null
						? { ...currentSection, ...data }
						: data,
			};
		});
	};

	// Zoom handlers
	const handleZoomIn = () => {
		setZoom((prev) => Math.min(prev + 25, 200));
	};

	const handleZoomOut = () => {
		setZoom((prev) => Math.max(prev - 25, 25));
	};

	const handleResetZoom = () => {
		setZoom(100);
		setPosition({ x: 0, y: 0 });
	};

	// Drag handlers - always enabled
	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsDraggingActive(true);
		setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDraggingActive) return;
		if (e.buttons !== 1) return;
		e.preventDefault();
		setPosition({
			x: e.clientX - dragStart.x,
			y: e.clientY - dragStart.y,
		});
	};

	const handleMouseUp = () => {
		setIsDraggingActive(false);
	};

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
				e.preventDefault();
				handleZoomIn();
			}
			if ((e.ctrlKey || e.metaKey) && e.key === "-") {
				e.preventDefault();
				handleZoomOut();
			}
			if ((e.ctrlKey || e.metaKey) && e.key === "0") {
				e.preventDefault();
				handleResetZoom();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const handleSaveDraft = async () => {
		if (!templateConfig.name) {
			toast.error("Please enter a template name");
			return;
		}

		if (!templateConfig.description) {
			toast.error("Please enter a template description");
			return;
		}

		try {
			if (currentTemplateId) {
				// Update existing draft
				const updated = await updateTemplateById(currentTemplateId, {
					...templateConfig,
					isPublished: false,
					isActive: false,
				} as any);

				if (updated) {
					toast.success("Template draft updated successfully!");
				} else {
					toast.error("Failed to update template draft");
				}
			} else {
				// Create new draft
				const created = await saveTemplate({
					...templateConfig,
					createdBy: "admin",
					tags: templateConfig.metadata?.tags || [],
					isPublished: false,
					isActive: false,
				} as any);

				if (created) {
					setCurrentTemplateId(created.id);
					toast.success("Template saved as draft!");
				} else {
					toast.error("Failed to save template draft");
				}
			}
		} catch (error) {
			toast.error("An error occurred while saving the template");
		}
	};

	const handlePublish = async () => {
		if (!templateConfig.name) {
			toast.error("Please enter a template name");
			return;
		}

		if (!templateConfig.description) {
			toast.error("Please enter a template description");
			return;
		}

		try {
			if (currentTemplateId) {
				// Update existing template and publish it
				const updated = await updateTemplateById(currentTemplateId, {
					...templateConfig,
					isPublished: true,
					isActive: true,
				} as any);

				if (updated) {
					toast.success("Template published successfully!");
				} else {
					toast.error("Failed to publish template");
				}
			} else {
				// Create new template and publish it
				const created = await saveTemplate({
					...templateConfig,
					createdBy: "admin",
					tags: templateConfig.metadata?.tags || [],
					isPublished: true,
					isActive: true,
				} as any);

				if (created) {
					setCurrentTemplateId(created.id);
					toast.success("Template published successfully!");
				} else {
					toast.error("Failed to publish template");
				}
			}
		} catch (error) {
			toast.error("An error occurred while publishing the template");
		}
	};

	const tabs = [
		{ id: "basic", label: "Basic Info", icon: Settings },
		{ id: "permissions", label: "Permissions", icon: Eye },
		{ id: "layout", label: "Layout", icon: Layout },
		{ id: "sections", label: "Sections", icon: Settings },
		{ id: "colors", label: "Colors", icon: Palette },
		{ id: "typography", label: "Typography", icon: Type },
		{ id: "pricing", label: "Pricing", icon: Settings },
	];

	// Memoize the config with deep dependencies to ensure re-render on any change
	const memoizedConfig = useMemo(() => {
		return { ...templateConfig } as TemplateConfig;
	}, [
		templateConfig.typography,
		templateConfig.colors,
		templateConfig.layout,
		templateConfig.permissions,
		templateConfig.name,
		templateConfig.description,
		templateConfig.personalInfoConfig,
		templateConfig.experienceConfig,
		templateConfig.educationConfig,
		templateConfig.skillsConfig,
		templateConfig.projectsConfig,
		templateConfig.certificationsConfig,
		templateConfig.achievementsConfig,
	]);

	return (
		<div className="w-full h-full flex flex-col gap-3 md:gap-6 p-3 md:p-6 max-w-[1600px] mx-auto">
			{/* Header Section */}
			<div className="space-y-3 md:space-y-4">
				<div className="flex items-center gap-2 md:gap-3">
					<div className="h-10 w-10 md:h-14 md:w-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
						<Settings className="h-5 w-5 md:h-7 md:w-7 text-primary" />
					</div>
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2">
							<h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight truncate">
								{currentTemplateId ? "Edit" : "Create"} Resume Template
							</h1>
							{currentTemplateId && (
								<span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
									Editing
								</span>
							)}
						</div>
						<p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
							{currentTemplateId
								? "Update your template and republish changes"
								: "Design a custom resume template with full control over layout, colors, and typography"}
						</p>
					</div>
				</div>

				{/* Tab Navigation */}
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full"
				>
					<TabsList className="grid grid-cols-3 md:grid-cols-7 gap-2 w-full h-auto bg-muted">
						{tabs.map((tab) => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className="flex items-center gap-2"
							>
								<tab.icon className="h-4 w-4" />
								<span className="hidden sm:inline">
									{tab.label}
								</span>
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>

			{/* Main Content */}
			<div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 min-h-0">
				{/* Configuration Section */}
				<Card className="flex flex-col overflow-hidden">
					{/* Form Content - Scrollable */}
					<ScrollArea className="flex-1 overflow-hidden">
						<Tabs value={activeTab} onValueChange={setActiveTab}>
							<div className="px-6">
							<TabsContent value="basic" className="mt-0">
								<BasicInfoStep
									config={templateConfig}
									updateConfig={updateConfig}
								/>
							</TabsContent>

							<TabsContent value="permissions" className="mt-0">
								<PermissionsStep
									config={templateConfig}
									updateConfig={updateConfig}
								/>
							</TabsContent>

							<TabsContent value="layout" className="mt-0">
								<LayoutConfigStep
									config={templateConfig}
									updateConfig={updateConfig}
								/>
							</TabsContent>

								<TabsContent value="colors" className="mt-0">
									<ColorSchemeStep
										config={templateConfig}
										updateConfig={updateConfig}
									/>
								</TabsContent>

								<TabsContent
									value="typography"
									className="mt-0"
								>
									<TypographyStep
										config={templateConfig}
										updateConfig={updateConfig}
									/>
								</TabsContent>

								<TabsContent value="sections" className="mt-0">
									<SectionConfigStep
										config={templateConfig}
										updateConfig={updateConfig}
									/>
								</TabsContent>

								<TabsContent value="pricing" className="mt-0">
									<PricingStep
										config={templateConfig}
										updateConfig={updateConfig}
									/>
								</TabsContent>
							</div>
						</Tabs>
					</ScrollArea>

					{/* Action Buttons - Fixed at bottom */}
					<div className="border-t bg-muted/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
						<Button
							variant="outline"
							onClick={() => setPreviewMode(!previewMode)}
							className="gap-2 w-full sm:w-auto"
						>
							<Eye className="h-4 w-4" />
							{previewMode ? "Hide Preview" : "Show Preview"}
						</Button>

						<div className="flex gap-2 w-full sm:w-auto">
							<Button
								variant="outline"
								onClick={handleSaveDraft}
								disabled={isSaving}
								className="gap-2 flex-1 sm:flex-none"
							>
								{isSaving ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Save className="h-4 w-4" />
								)}
								{currentTemplateId ? "Update Draft" : "Save Draft"}
							</Button>

							<Button
								onClick={handlePublish}
								disabled={isSaving}
								className="gap-2 flex-1 sm:flex-none"
							>
								{isSaving ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Save className="h-4 w-4" />
								)}
								{currentTemplateId ? "Update & Publish" : "Publish"}
							</Button>
						</div>
					</div>
				</Card>

				{/* Preview Section */}
				<Card className="hidden lg:flex flex-col bg-muted/30 h-full p-0 overflow-hidden">
					<div className="border-b bg-muted/50 px-4 py-3 space-y-3 flex justify-between items-center">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold text-sm flex items-center gap-2">
								<Eye className="h-4 w-4" />
								Live Preview - A4 Format
							</h3>
						</div>

						{/* Zoom Controls */}
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="sm"
									onClick={handleZoomOut}
									disabled={zoom <= 25}
									title="Zoom Out (Ctrl + -)"
									className="h-8 w-8 p-0"
								>
									<ZoomOut className="h-4 w-4" />
								</Button>

								<span className="text-xs font-medium min-w-[3.5rem] text-center">
									{zoom}%
								</span>

								<Button
									variant="ghost"
									size="sm"
									onClick={handleZoomIn}
									disabled={zoom >= 200}
									title="Zoom In (Ctrl + +)"
									className="h-8 w-8 p-0"
								>
									<ZoomIn className="h-4 w-4" />
								</Button>

								<Button
									variant="ghost"
									size="sm"
									onClick={handleResetZoom}
									title="Reset Zoom (Ctrl + 0)"
									className="h-8 w-8 p-0"
								>
									<RotateCcw className="h-3.5 w-3.5" />
								</Button>

								<Button
									size="sm"
									onClick={() => {
										exportResumeToPDF(templateConfig.name || "resume.pdf");
										toast.success("Print dialog opened!", {
											description: "IMPORTANT: Click 'More settings' and uncheck 'Headers and footers' to remove date/title from PDF",
											duration: 10000,
										});
									}}
									title="Download PDF"
									className="h-8 w-8 p-0"
								>
									<Download className="h-3.5 w-3.5" />
								</Button>
							</div>
						</div>
					</div>

					{/* Preview with Zoom and Drag */}
					<div
						ref={previewContainerRef}
						className="flex-1 overflow-hidden relative bg-muted/20"
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseUp}
						style={{
							cursor: isDraggingActive ? "grabbing" : "grab",
						}}
					>
						<div
							className="absolute inset-0 flex items-center justify-center"
							style={{
								transform: `translate(${position.x}px, ${position.y
									}px) scale(${zoom / 100})`,
								transformOrigin: "center center",
								transition: isDraggingActive
									? "none"
									: "transform 0.2s ease-out",
							}}
						>
						<div className="p-6">
							<TemplatePreview
								config={memoizedConfig}
							/>
						</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
