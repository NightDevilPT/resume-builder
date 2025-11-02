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

		// Get all stylesheets from the current document
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

		// Build the print HTML
		printWindow.document.write(`
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<title>Resume - ${fileName}</title>
				<style>
					@page {
						size: A4 portrait;
						margin: 0;
					}
					
					body {
						margin: 0;
						padding: 0;
						width: 210mm;
						height: 297mm;
					}
					
					* {
						print-color-adjust: exact !important;
						-webkit-print-color-adjust: exact !important;
						color-adjust: exact !important;
						box-shadow: none !important;
					}
					
					@media print {
						* {
							box-shadow: none !important;
							border: none !important;
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
		
		// Auto-trigger print dialog
		setTimeout(() => {
			printWindow.print();
			// Close after printing (user can cancel)
			setTimeout(() => {
				printWindow.close();
			}, 100);
		}, 500);

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
