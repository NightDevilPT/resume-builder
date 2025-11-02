// lib/validations/resume.ts
import { z } from "zod";

export const resumeMetaSchema = z.object({
	name: z
		.string()
		.min(1, "Resume name is required")
		.max(100, "Resume name must be less than 100 characters"),
	description: z
		.string()
		.max(500, "Description must be less than 500 characters")
		.optional(),
});

export type ResumeMetaFormValues = z.infer<typeof resumeMetaSchema>;
