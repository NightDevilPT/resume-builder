import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DragComponent } from "./drag-component";
import React, { useState, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { TemplateConfig } from "@/interfaces/templates";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Palette,
	ZoomIn,
	ZoomOut,
	RotateCcw,
	Download,
} from "lucide-react";

interface ToolComponentProps {
	children: React.ReactNode;
	className?: string;
	config?: TemplateConfig;
	onConfigChange?: (config: Partial<TemplateConfig>) => void;
}

export const ToolComponent: React.FC<ToolComponentProps> = ({
	children,
	className = "",
	config,
	onConfigChange,
}) => {
	const [zoom, setZoom] = useState(0.8);
	const minZoom = 0.5;
	const maxZoom = 2;

	const handleZoomIn = useCallback(() => {
		setZoom((prev) => Math.min(prev + 0.1, maxZoom));
	}, [maxZoom]);

	const handleZoomOut = useCallback(() => {
		setZoom((prev) => Math.max(prev - 0.1, minZoom));
	}, [minZoom]);

	const handleZoomReset = useCallback(() => {
		setZoom(0.8);
	}, []);

	const handleColorChange = useCallback(
		(colorType: string, value: string) => {
			if (onConfigChange && config) {
				onConfigChange({
					style: {
						...config.style,
						[colorType]: value,
					},
				});
			}
		},
		[onConfigChange, config]
	);

	const handleMarginChange = useCallback(
		(marginType: string, value: number) => {
			if (onConfigChange && config) {
				onConfigChange({
					style: {
						...config.style,
						[marginType]: value,
					},
				});
			}
		},
		[onConfigChange, config]
	);

	const handleDownload = useCallback(() => {
		if(config?.pricing.isPaid) {
			alert("This template is paid. Please purchase it to download the PDF.");
			return;
		}
		// Get margin from config or use default
		const margin = config?.style?.margin || 20;

		// Find the resume content element
		const resumeElement = document.querySelector(".resume-preview");
		if (!resumeElement) {
			alert(
				"Resume content not found. Please make sure you are on the resume builder page."
			);
			return;
		}

		// Get the HTML content of the resume
		const resumeHTML = resumeElement.innerHTML;

		// Create a new window for printing
		const printWindow = window.open("", "_blank", "width=800,height=600");
		if (!printWindow) {
			alert("Please allow popups for this site to download PDF");
			return;
		}

		// Write the print document
		printWindow.document.write(`
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<title>Resume</title>
				<style>
					* {
						margin: 0;
						padding: 0;
						box-sizing: border-box;
					}
					
					body {
						font-family: Arial, sans-serif;
						background: #f3f3f3;
						padding: 0;
						margin: 0;
						min-height: 100vh;
					}
					
					@media print {
						@page {
							margin: ${margin}mm;
							size: A4;
							/* Remove all headers and footers */
							@top-left { content: ""; }
							@top-center { content: ""; }
							@top-right { content: ""; }
							@bottom-left { content: ""; }
							@bottom-center { content: ""; }
							@bottom-right { content: ""; }
						}
						
						body {
							padding: 0;
							margin: 0;
							background-color: #f3f3f3;
						}
						
						/* Hide any browser-generated content */
						body::before,
						body::after,
						html::before,
						html::after {
							display: none !important;
							content: "" !important;
							
							background-color: #f3f3f3;
						}
					}
					
					/* Resume content styles */
					.resume-content {
						background: white;
						padding: 20px;
						max-width: 800px;
						margin: 20px auto;
						box-shadow: 0 0 10px rgba(0,0,0,0.1);
						border-radius: 8px;
					}
					
					@media print {
						body {
							background: white !important;
							padding: 0 !important;
							margin: 0 !important;
						}
						
						.resume-content {
							padding: 0 !important;
							max-width: none !important;
							margin: 0 !important;
							background: white !important;
							box-shadow: none !important;
							border-radius: 0 !important;
							width: 100% !important;
						}
					}
				</style>
			</head>
			<body>
				<div class="resume-content">
					${resumeHTML}
				</div>
			</body>
			</html>
		`);

		printWindow.document.close();

		// Wait for content to load, then print
		printWindow.onload = () => {
			// Small delay to ensure content is rendered
			setTimeout(() => {
				printWindow.focus();
				printWindow.print();

				// Close window after printing
				printWindow.onafterprint = () => {
					printWindow.close();
				};
			}, 500);
		};
	}, [config]);

	return (
		<div className={`flex-1 grid grid-rows-[50px_1fr] ${className}`}>
			{/* Tool Controls */}
			<div className="flex items-center justify-between gap-2 p-2 bg-background/90 backdrop-blur-sm border-b">
				{/* Left side - Template Controls */}
				<div className="flex items-center gap-2">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="h-8 px-3 text-xs gap-1"
							>
								<Palette className="h-3 w-3" />
								Colors
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-80" align="start">
							{config && (
								<div className="space-y-4">
									<div className="space-y-2">
										<h4 className="font-medium text-sm">
											Color Settings
										</h4>
										<div className="grid grid-cols-2 gap-3">
											<div className="space-y-2">
												<Label
													htmlFor="primary-color"
													className="text-xs font-medium"
												>
													Primary Color
												</Label>
												<div className="flex items-center gap-2">
													<input
														id="primary-color"
														type="color"
														value={
															config.style
																.primaryColor
														}
														onChange={(e) =>
															handleColorChange(
																"primaryColor",
																e.target.value
															)
														}
														className="w-8 h-8 rounded border cursor-pointer"
													/>
													<Input
														value={
															config.style
																.primaryColor
														}
														onChange={(e) =>
															handleColorChange(
																"primaryColor",
																e.target.value
															)
														}
														className="h-8 text-xs"
														placeholder="#000000"
													/>
												</div>
											</div>
											<div className="space-y-2">
												<Label
													htmlFor="secondary-color"
													className="text-xs font-medium"
												>
													Secondary Color
												</Label>
												<div className="flex items-center gap-2">
													<input
														id="secondary-color"
														type="color"
														value={
															config.style
																.secondaryColor
														}
														onChange={(e) =>
															handleColorChange(
																"secondaryColor",
																e.target.value
															)
														}
														className="w-8 h-8 rounded border cursor-pointer"
													/>
													<Input
														value={
															config.style
																.secondaryColor
														}
														onChange={(e) =>
															handleColorChange(
																"secondaryColor",
																e.target.value
															)
														}
														className="h-8 text-xs"
														placeholder="#666666"
													/>
												</div>
											</div>
											<div className="space-y-2">
												<Label
													htmlFor="text-color"
													className="text-xs font-medium"
												>
													Text Color
												</Label>
												<div className="flex items-center gap-2">
													<input
														id="text-color"
														type="color"
														value={
															config.style
																.textColor
														}
														onChange={(e) =>
															handleColorChange(
																"textColor",
																e.target.value
															)
														}
														className="w-8 h-8 rounded border cursor-pointer"
													/>
													<Input
														value={
															config.style
																.textColor
														}
														onChange={(e) =>
															handleColorChange(
																"textColor",
																e.target.value
															)
														}
														className="h-8 text-xs"
														placeholder="#333333"
													/>
												</div>
											</div>
											<div className="space-y-2">
												<Label
													htmlFor="background-color"
													className="text-xs font-medium"
												>
													Background Color
												</Label>
												<div className="flex items-center gap-2">
													<input
														id="background-color"
														type="color"
														value={
															config.style
																.backgroundColor
														}
														onChange={(e) =>
															handleColorChange(
																"backgroundColor",
																e.target.value
															)
														}
														className="w-8 h-8 rounded border cursor-pointer"
													/>
													<Input
														value={
															config.style
																.backgroundColor
														}
														onChange={(e) =>
															handleColorChange(
																"backgroundColor",
																e.target.value
															)
														}
														className="h-8 text-xs"
														placeholder="#ffffff"
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</PopoverContent>
					</Popover>
				</div>

				{/* Right side - Zoom Controls and Download */}
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleZoomOut}
						disabled={zoom <= minZoom}
						className="h-8 w-8 p-0"
					>
						<ZoomOut className="h-3 w-3" />
					</Button>
					<Separator orientation="vertical" className="h-4" />
					<span className="text-sm font-medium min-w-[40px] text-center">
						{Math.round(zoom * 100)}%
					</span>
					<Separator orientation="vertical" className="h-4" />
					<Button
						variant="outline"
						size="sm"
						onClick={handleZoomIn}
						disabled={zoom >= maxZoom}
						className="h-8 w-8 p-0"
					>
						<ZoomIn className="h-3 w-3" />
					</Button>
					<Separator orientation="vertical" className="h-4" />
					<Button
						variant="outline"
						size="sm"
						onClick={handleZoomReset}
						className="h-8 px-2 text-xs gap-1"
					>
						<RotateCcw className="h-3 w-3" />
						Reset
					</Button>
					<Separator orientation="vertical" className="h-4" />
					<Button
						variant="default"
						size="icon"
						onClick={handleDownload}
						className="h-8 px-3 text-xs gap-1"
					>
						<Download className="h-3 w-3" />
					</Button>
				</div>
			</div>

			<ScrollArea className="flex-1 overflow-auto">
				<div
					className="relative"
					style={{
						transform: `scale(${zoom})`,
						transformOrigin: "0 0",
						transition: "transform 0.15s ease-out",
						minWidth: "100%",
						minHeight: "100%",
					}}
				>
					<DragComponent>{children}</DragComponent>
				</div>
			</ScrollArea>
		</div>
	);
};

export default ToolComponent;
