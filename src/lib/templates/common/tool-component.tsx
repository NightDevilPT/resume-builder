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
import { Palette, Settings, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

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

				{/* Right side - Zoom Controls */}
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
