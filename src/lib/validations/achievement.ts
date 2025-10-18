import { z } from "zod";

/**
 * Validation schema for Achievement form
 * Includes title, issuer, date, and description
 */
export const achievementSchema = z.object({
	title: z
		.string()
		.min(1, "Achievement title is required")
		.max(150, "Title must be less than 150 characters"),
	issuer: z
		.string()
		.min(1, "Issuer/Organization is required")
		.max(150, "Issuer must be less than 150 characters"),
	date: z
		.string()
		.min(1, "Date is required")
		.refine((date) => {
			const parsed = new Date(date);
			return !isNaN(parsed.getTime());
		}, "Please enter a valid date"),
	description: z
		.string()
		.min(10, "Description should be at least 10 characters")
		.max(500, "Description must be less than 500 characters"),
});

export type AchievementFormValues = z.infer<typeof achievementSchema>;

