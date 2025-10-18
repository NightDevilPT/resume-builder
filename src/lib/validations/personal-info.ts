// lib/validations/resume.ts - Add to existing file
import { z } from "zod";

// lib/validations/resume.ts - Update personalInfoSchema
export const personalInfoSchema = z.object({
	fullName: z
		.string()
		.min(1, "Full name is required")
		.max(100, "Name must be less than 100 characters"),
	email: z.string().email("Please enter a valid email address"),
	phone: z
		.string()
		.min(1, "Phone number is required")
		.max(20, "Phone number too long"),
	location: z
		.string()
		.min(1, "Location is required")
		.max(100, "Location must be less than 100 characters"),
	website: z
		.string()
		.url("Please enter a valid URL")
		.or(z.literal(""))
		.optional(),
	links: z
		.array(
			z.object({
				label: z
					.string()
					.min(1, "Label is required")
					.max(50, "Label must be less than 50 characters"),
				url: z.string().url("Please enter a valid URL"),
			})
		)
		.max(5, "Maximum 5 additional links allowed"),
	summary: z
		.string()
		.min(50, "Summary should be at least 50 characters")
		.max(500, "Summary must be less than 500 characters"),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
