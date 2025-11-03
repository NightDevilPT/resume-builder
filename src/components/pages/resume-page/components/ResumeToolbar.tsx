"use client";

import {
	exportResumeToPDF,
	generateResumeFileName,
} from "@/lib/utils/pdf-export";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ResumeToolbarProps {
	fullName?: string;
	onZoomIn: () => void;
	onZoomOut: () => void;
	onResetZoom: () => void;
	currentZoom: number;
}

export function ResumeToolbar({
	fullName,
	onZoomIn,
	onZoomOut,
	onResetZoom,
	currentZoom,
}: ResumeToolbarProps) {
	const [isExporting, setIsExporting] = useState(false);

	const handleDownloadPDF = async () => {
		try {
			setIsExporting(true);
			toast.loading("Generating PDF...", { id: "pdf-export" });

			// Generate filename from user's name
			const fileName = generateResumeFileName(fullName);

			// Small delay to ensure toast is visible
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Export to PDF
			await exportResumeToPDF(fileName);

			// Print dialog opened successfully
			toast.success("Print dialog opened!", {
				id: "pdf-export",
				description: "IMPORTANT: Click 'More settings' and uncheck 'Headers and footers' to remove date/title from PDF",
				duration: 10000,
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

	return (
		<div className="flex items-center gap-2">
			{/* Zoom Controls */}
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

			{/* Download Button */}
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
