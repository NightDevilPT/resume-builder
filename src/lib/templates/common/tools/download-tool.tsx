import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React, { useCallback } from "react";
import { TemplateConfig } from "@/interfaces/templates";

interface DownloadToolProps {
	config?: TemplateConfig;
}

export const DownloadTool: React.FC<DownloadToolProps> = ({ config }) => {
	const handleDownload = useCallback(() => {
		if (config?.pricing.isPaid) {
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
		<Button
			variant="default"
			size="icon"
			onClick={handleDownload}
			className="h-8 px-3 text-xs gap-1"
		>
			<Download className="h-3 w-3" />
		</Button>
	);
};

export default DownloadTool;

