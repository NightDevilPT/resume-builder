import { z } from "zod";

/**
 * Validation schema for Projects form
 * Flexible for all professionals - developers, accountants, managers, etc.
 * Projects can include: software projects, initiatives, assignments, case studies, etc.
 */
export const projectSchema = z
	.object({
		name: z
			.string()
			.min(1, "Project name is required")
			.max(150, "Project name must be less than 150 characters"),
		description: z
			.string()
			.max(500, "Description must be less than 500 characters")
			.optional()
			.or(z.literal("")),
		technologies: z
			.array(z.string().min(1, "Technology/Tool cannot be empty"))
			.min(1, "Add at least one technology, tool, or skill used")
			.max(20, "Maximum 20 technologies/tools allowed"),
		projectUrl: z
			.string()
			.url("Please enter a valid URL")
			.or(z.literal(""))
			.optional(),
		githubUrl: z
			.string()
			.url("Please enter a valid GitHub URL")
			.or(z.literal(""))
			.optional(),
		startDate: z
			.string()
			.min(1, "Start date is required")
			.refine((date) => {
				const parsed = new Date(date);
				return !isNaN(parsed.getTime());
			}, "Please enter a valid start date"),
		endDate: z
			.string()
			.optional()
			.refine(
				(date) => {
					if (!date) return true;
					const parsed = new Date(date);
					return !isNaN(parsed.getTime());
				},
				"Please enter a valid end date"
			),
		currentlyWorking: z.boolean(),
		highlights: z
			.array(z.string().min(1, "Highlight cannot be empty"))
			.min(1, "Add at least one key highlight or achievement")
			.max(10, "Maximum 10 highlights allowed"),
	})
	.refine(
		(data) => {
			// If currently working, endDate should be empty
			if (data.currentlyWorking) {
				return !data.endDate || data.endDate === "";
			}
			// If not currently working, endDate is required
			return data.endDate && data.endDate !== "";
		},
		{
			message: "End date is required when not currently working on this project",
			path: ["endDate"],
		}
	)
	.refine(
		(data) => {
			// Validate that end date is after start date
			if (data.startDate && data.endDate && data.endDate !== "") {
				const start = new Date(data.startDate);
				const end = new Date(data.endDate);
				return end >= start;
			}
			return true;
		},
		{
			message: "End date must be after start date",
			path: ["endDate"],
		}
	);

export type ProjectFormValues = z.infer<typeof projectSchema>;

