"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TemplateConfig } from "@/interfaces/templates";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { A4_DIMENSIONS } from "@/lib/utils/template-helpers";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TemplatePreview } from "@/components/pages/resume-layout-page/components/TemplatePreview";

type TemplatePreviewPanelProps = {
	template: TemplateConfig;
	priceLabel: string;
	onUseTemplate: () => void;
};

const MIN_SCALE = 0.45;
const MM_TO_PX = 3.7795275591;
const A4_WIDTH_PX = parseFloat(A4_DIMENSIONS.width) * MM_TO_PX;

const TemplatePreviewPanelComponent = ({
	template,
	priceLabel,
	onUseTemplate,
}: TemplatePreviewPanelProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const previewWrapperRef = useRef<HTMLDivElement>(null);
	const [autoScale, setAutoScale] = useState(0.75);
	const [zoom, setZoom] = useState(100);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const dragOrigin = useRef<{
		x: number;
		y: number;
		offsetX: number;
		offsetY: number;
	} | null>(null);
	const lastPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

	const updateScale = useCallback(() => {
		const container = containerRef.current;
		if (!container) return;

		const availableWidth = container.clientWidth;
		if (!availableWidth) return;

		const baseWidth = A4_WIDTH_PX;
		const desiredScale = Math.min(
			1,
			Math.max(MIN_SCALE, (availableWidth - 24) / baseWidth)
		);

		setAutoScale(desiredScale);
	}, []);

	useEffect(() => {
		updateScale();

		const container = containerRef.current;
		if (!container) return;

		const resizeObserver = new ResizeObserver(() => updateScale());
		resizeObserver.observe(container);

		const handleWindowResize = () => updateScale();
		window.addEventListener("resize", handleWindowResize);

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", handleWindowResize);
		};
	}, [updateScale]);

	const handleZoomChange = useCallback((delta: number) => {
		setZoom((current) =>
			Math.round(Math.min(200, Math.max(50, current + delta)))
		);
	}, []);

	const handleZoomIn = useCallback(
		() => handleZoomChange(10),
		[handleZoomChange]
	);
	const handleZoomOut = useCallback(
		() => handleZoomChange(-10),
		[handleZoomChange]
	);
	const handleResetZoom = useCallback(() => {
		setZoom(100);
		setPosition({ x: 0, y: 0 });
		lastPosition.current = { x: 0, y: 0 };
	}, []);

	const previewStyle = useMemo(() => {
		const computedScale = autoScale * (zoom / 100);
		return {
			transform: `translate(${position.x}px, ${position.y}px) scale(${computedScale})`,
			transformOrigin: "center center",
			width: `${A4_DIMENSIONS.width}`,
		};
	}, [autoScale, zoom, position.x, position.y]);

	const handleMouseDown = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			event.preventDefault();
			const wrapper = previewWrapperRef.current;
			if (!wrapper) return;

			setIsDragging(true);
			lastPosition.current = position;
			const rect = wrapper.getBoundingClientRect();
			dragOrigin.current = {
				x: event.clientX,
				y: event.clientY,
				offsetX: event.clientX - rect.left - wrapper.clientWidth / 2,
				offsetY: event.clientY - rect.top - wrapper.clientHeight / 2,
			};
		},
		[position]
	);

	const handleMouseMove = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (!isDragging || !dragOrigin.current) return;

			const deltaX = event.clientX - dragOrigin.current.x;
			const deltaY = event.clientY - dragOrigin.current.y;

			setPosition({
				x: lastPosition.current.x + deltaX,
				y: lastPosition.current.y + deltaY,
			});
		},
		[isDragging]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
		lastPosition.current = position;
		dragOrigin.current = null;
	}, [position]);

	return (
		<Card className="overflow-hidden border-border/60 shadow-xl">
			<CardHeader className="border-b border-border/60 bg-muted/20">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<CardTitle className="flex items-center gap-2 text-base font-semibold">
							Template preview
						</CardTitle>
						<CardDescription className="text-sm">
							Live snapshot using best-practice sample data.
						</CardDescription>
					</div>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="items-center gap-2"
							>
								<span className="text-xs font-medium">
									{zoom}%
								</span>
								<ZoomIn className="h-4 w-4 opacity-70" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-56 space-y-4" align="end">
							<div className="flex items-center justify-between">
								<h4 className="text-sm font-semibold">
									Preview Zoom
								</h4>
								<Button
									variant="ghost"
									size="icon"
									onClick={handleResetZoom}
									title="Reset zoom"
									aria-label="Reset zoom"
								>
									<RotateCcw className="h-4 w-4" />
								</Button>
							</div>
							<div className="flex items-center justify-between gap-2">
								<Button
									variant="outline"
									size="icon"
									onClick={handleZoomOut}
									disabled={zoom <= 50}
									className="flex-1"
									aria-label="Zoom out"
								>
									<ZoomOut className="mr-2 h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									onClick={handleZoomIn}
									disabled={zoom >= 200}
									className="flex-1"
									aria-label="Zoom in"
								>
									<ZoomIn className="mr-2 h-4 w-4" />
								</Button>
							</div>
							<div className="rounded-lg border border-dashed px-3 py-2 text-center text-xs text-muted-foreground">
								Drag the preview to reposition.
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</CardHeader>

			<CardContent className="p-0">
				<div className="h-[520px] bg-gradient-to-b from-muted/40 to-background overflow-hidden rounded-b-xl">
					<div
						ref={containerRef}
						className="flex h-full w-full items-center justify-center px-4 py-6 select-none"
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseUp}
						style={{
							cursor: isDragging ? "grabbing" : "grab",
							userSelect: "none",
						}}
					>
						<div
							ref={previewWrapperRef}
							style={previewStyle}
							className="transition-transform duration-100 ease-out"
						>
							<TemplatePreview config={template} />
						</div>
					</div>
				</div>

				<Separator />

				<div className="space-y-4 p-6">
					<Button
						size="lg"
						className="w-full"
						onClick={onUseTemplate}
					>
						Start with this design
					</Button>
					<div className="space-y-3 text-sm text-muted-foreground">
						<InfoRow label="Pricing tier" value={priceLabel} />
						<InfoRow
							label="Includes preview image"
							value={
								template.metadata.previewImage ? "Yes" : "No"
							}
						/>
						<InfoRow
							label="Eligible for AI assist"
							value={
								template.permissions.canChangeSections
									? "Yes"
									: "Limited"
							}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

TemplatePreviewPanelComponent.displayName = "TemplatePreviewPanel";

export const TemplatePreviewPanel = memo(TemplatePreviewPanelComponent);

type InfoRowProps = {
	label: string;
	value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
	return (
		<div className="flex items-center justify-between">
			<span>{label}</span>
			<span className="font-medium text-foreground">{value}</span>
		</div>
	);
}
