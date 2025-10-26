import { Button } from "@/components/ui/button";
import { DragComponent } from "../drag-component";
import React, { useState, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { TemplateConfig } from "@/interfaces/templates";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	ZoomIn,
	ZoomOut,
	RotateCcw,
} from "lucide-react";
import { ColorTool } from "./color-tool";
import { DownloadTool } from "./download-tool";

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


	return (
		<div className={`flex-1 grid grid-rows-[50px_1fr] ${className}`}>
			{/* Tool Controls */}
			<div className="flex items-center justify-between gap-2 p-2 bg-background/90 backdrop-blur-sm border-b">
				{/* Left side - Template Controls */}
				<div className="flex items-center gap-2">
					<ColorTool config={config} onConfigChange={onConfigChange} />
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
					<DownloadTool config={config} />
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
