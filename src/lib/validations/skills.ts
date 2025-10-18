import { z } from "zod";

/**
 * Validation schema for Skills form
 * Includes technical skills, soft skills, and language proficiencies
 */
export const skillsSchema = z.object({
	technical: z
		.array(z.string().min(1, "Skill cannot be empty"))
		.min(1, "Add at least one technical skill")
		.max(30, "Maximum 30 technical skills allowed"),
	soft: z
		.array(z.string().min(1, "Skill cannot be empty"))
		.min(1, "Add at least one soft skill")
		.max(20, "Maximum 20 soft skills allowed"),
	languages: z
		.array(
			z.object({
				language: z
					.string()
					.min(1, "Language name is required")
					.max(50, "Language name must be less than 50 characters"),
				proficiency: z.enum(["Native", "Fluent", "Professional", "Basic"]),
			})
		)
		.min(1, "Add at least one language")
		.max(10, "Maximum 10 languages allowed"),
});

export type SkillsFormValues = z.infer<typeof skillsSchema>;

