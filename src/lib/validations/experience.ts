import { z } from "zod";

/**
 * Validation schema for Experience form
 * Includes job title, company, dates, and achievements
 */
export const experienceSchema = z
	.object({
		jobTitle: z
			.string()
			.min(1, "Job title is required")
			.max(100, "Job title must be less than 100 characters"),
		company: z
			.string()
			.min(1, "Company name is required")
			.max(100, "Company name must be less than 100 characters"),
		location: z
			.string()
			.min(1, "Location is required")
			.max(100, "Location must be less than 100 characters"),
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
		description: z
			.string()
			.max(1000, "Description must be less than 1000 characters")
			.optional()
			.or(z.literal("")),
		achievements: z
			.array(z.string().min(1, "Achievement cannot be empty"))
			.min(1, "Add at least one achievement or responsibility")
			.max(10, "Maximum 10 achievements allowed"),
		skillsUsed: z
			.array(z.string().min(1, "Skill cannot be empty"))
			.min(1, "Add at least one skill used")
			.max(20, "Maximum 20 skills allowed"),
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
			message: "End date is required when not currently working",
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

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

