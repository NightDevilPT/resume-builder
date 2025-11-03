/**
 * PDF Export Utility
 * Uses browser's native print functionality to export resume as PDF
 * This approach supports all modern CSS including LAB colors (Tailwind 4)
 */

/**
 * Export resume to PDF
 * Opens browser's print dialog where user can save as PDF
 */
export async function exportResumeToPDF(fileName: string = "resume.pdf"): Promise<void> {
	try {
		// Find the resume preview element
		const resumeElement = document.querySelector("#resume-preview") as HTMLElement;
		if (!resumeElement) {
			throw new Error("Resume preview element not found");
		}

		// Create a new window for printing
		const printWindow = window.open("", "_blank");
		if (!printWindow) {
			throw new Error("Could not open print window. Please allow popups for this site.");
		}

		// Clone the resume content
		const clonedContent = resumeElement.cloneNode(true) as HTMLElement;
		
		// Remove shadows for clean print output
		clonedContent.style.boxShadow = "none";
		clonedContent.style.border = "none";

		// Get all link tags (for external stylesheets and fonts)
		const links = Array.from(document.querySelectorAll('link[rel="stylesheet"], link[rel="preconnect"], link[href*="fonts"]'))
			.map((link) => link.outerHTML)
			.join("\n");

		// Get all stylesheets from the current document including @font-face rules
		const styles = Array.from(document.styleSheets)
			.map((sheet) => {
				try {
					return `<style>${Array.from(sheet.cssRules)
						.map((rule) => rule.cssText)
						.join("\n")}</style>`;
				} catch {
					// Skip cross-origin stylesheets
					return "";
				}
			})
			.join("");

		// Also get inline style tags (which may contain Next.js font definitions)
		const inlineStyles = Array.from(document.querySelectorAll('style'))
			.map((style) => style.outerHTML)
			.join("\n");

		// Build the print HTML
		printWindow.document.write(`
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<title>Resume - ${fileName}</title>
				${links}
				${inlineStyles}
				<style>
					@page {
						size: A4 portrait;
						margin: 1.5rem;
					}
					
					body {
						margin: 0;
						padding: 0;
						width: 100%;
						min-height: auto;
					}
					
					#resume-preview {
						max-width: 210mm;
						margin: 0 auto;
						box-shadow: none !important;
						border: none !important;
					}
					
					/* Remove the inner padding since @page margin handles it */
					#resume-preview > div {
						padding: 0 !important;
					}
					
					* {
						print-color-adjust: exact !important;
						-webkit-print-color-adjust: exact !important;
						color-adjust: exact !important;
					}
					
					@media print {
						html, body {
							width: 210mm;
							height: 100%;
						}
						
						#resume-preview {
							box-shadow: none !important;
							border: none !important;
							page-break-after: auto;
						}
						
						/* Remove padding to avoid double margins */
						#resume-preview > div {
							padding: 0 !important;
						}
						
						/* Prevent breaks inside important elements */
						.resume-section {
							page-break-inside: avoid;
						}
						
						/* Handle section breaks */
						h1, h2, h3, h4, h5, h6 {
							page-break-after: avoid;
							page-break-inside: avoid;
						}
						
						/* Keep list items together when possible */
						li, p {
							page-break-inside: avoid;
						}
					}
				</style>
				${styles}
			</head>
			<body>
				${clonedContent.outerHTML}
			</body>
			</html>
		`);

		printWindow.document.close();
		
		// Wait for fonts and images to load before printing
		printWindow.addEventListener('load', () => {
			// Additional delay to ensure all fonts are fully loaded
			setTimeout(() => {
				printWindow.print();
				// Close after printing (user can cancel)
				setTimeout(() => {
					printWindow.close();
				}, 100);
			}, 800); // Increased delay for font loading
		});

		return Promise.resolve();
	} catch (error) {
		console.error("Error exporting PDF:", error);
		throw error;
	}
}

/**
 * Generate a filename based on user's name and current date
 * Format: name_YYYY-MM-DD.pdf
 */
export function generateResumeFileName(fullName?: string): string {
	const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
	const name = fullName
		? fullName.replace(/\s+/g, "_").toLowerCase()
		: "resume";
	return `${name}_${date}.pdf`;
}
