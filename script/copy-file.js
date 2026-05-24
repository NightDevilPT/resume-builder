const fs = require("fs");
const path = require("path");

// Hardcoded directory pah
const rootDir =
	"C:\\Users\\Pawan\\Desktop\\FullStackProject\\resume-builder\\src\\components\\context\\resume-viewer";
const outputFile = "frontend.txt";

// Function to traverse and process files
function processDirectory(dir) {
	// Read the contents of the directory
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	entries.forEach((entry) => {
		const entryPath = path.join(dir, entry.name);

		// Skip "_pycache_" and "env" directories
		if (
			entry.isDirectory() &&
			(entry.name === "_pycache_" || entry.name === "env")
		) {
			return; // Skip this directory
		}

		if (entry.isDirectory()) {
			// Recursive call for directories
			processDirectory(entryPath);
		} else if (entry.isFile()) {
			// Process each file
			try {
				// Read the file content
				const content = fs.readFileSync(entryPath, "utf-8");

				// Append the file path and content to output file
				fs.appendFileSync(outputFile, `File Path: ${entryPath}\n`);
				fs.appendFileSync(outputFile, "Contents:\n");
				fs.appendFileSync(outputFile, content);
				fs.appendFileSync(outputFile, "\n" + "-".repeat(50) + "\n\n");
			} catch (error) {
				// Log any errors encountered while reading files
				fs.appendFileSync(
					outputFile,
					`Could not read ${entryPath}: ${error}\n`,
				);
				fs.appendFileSync(outputFile, "-".repeat(50) + "\n\n");
			}
		}
	});
}

// Clear output file if it already exists
fs.writeFileSync(outputFile, "");

// Start processing from the root directory
processDirectory(rootDir);

console.log(`All file paths and contents have been stored in ${outputFile}.`);
