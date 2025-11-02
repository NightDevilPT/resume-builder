"use client";

import { Eye } from "lucide-react";
import { ResumeToolbar } from "./ResumeToolbar";
import { useState, useRef, useEffect } from "react";
import { defaultTemplateConfig } from "@/constants/default-template";
import { useResume } from "@/components/providers/resume-form-provider";
import { TemplatePreview } from "@/components/pages/resume-layout-page/components/TemplatePreview";

/**
 * Resume Preview Component
 * Displays the user's resume data using the selected template with zoom and drag controls
 */
export function ResumePreview() {
	const { resumeData } = useResume();
	const [zoom, setZoom] = useState(100);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [isDraggingActive, setIsDraggingActive] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// TODO: Get selected template from TemplateProvider or URL params
	// For now, use the default template
	const selectedTemplate = defaultTemplateConfig;

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
		if (e.buttons !== 1) return; // Only when left mouse button is pressed
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
			// Ctrl/Cmd + Plus: Zoom in
			if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
				e.preventDefault();
				handleZoomIn();
			}
			// Ctrl/Cmd + Minus: Zoom out
			if ((e.ctrlKey || e.metaKey) && e.key === "-") {
				e.preventDefault();
				handleZoomOut();
			}
			// Ctrl/Cmd + 0: Reset zoom and position
			if ((e.ctrlKey || e.metaKey) && e.key === "0") {
				e.preventDefault();
				handleResetZoom();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<div className="h-full flex flex-col">
			{/* Header */}
			<div className="px-6 py-4 border-b bg-background/95 backdrop-blur flex justify-between items-center">
				<div className="flex items-center gap-2">
					<Eye className="h-5 w-5 text-primary" />
				</div>

				<ResumeToolbar
					fullName={resumeData.personalInfo.fullName}
					onZoomIn={handleZoomIn}
					onZoomOut={handleZoomOut}
					onResetZoom={handleResetZoom}
					currentZoom={zoom}
				/>
			</div>

			{/* Preview Content with Zoom and Drag (Always Enabled) */}
			<div
				ref={containerRef}
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
						transform: `translate(${position.x}px, ${
							position.y
						}px) scale(${zoom / 100})`,
						transformOrigin: "center center",
						transition: isDraggingActive
							? "none"
							: "transform 0.2s ease-out",
					}}
				>
					<div className="p-6">
						<TemplatePreview
							config={selectedTemplate}
							resumeData={resumeData}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
