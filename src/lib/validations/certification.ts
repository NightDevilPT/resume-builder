import { z } from "zod";

/**
 * Validation schema for Certification form
 * Includes certification name, issuing organization, dates, and credential URL
 */
export const certificationSchema = z
	.object({
		name: z
			.string()
			.min(1, "Certification name is required")
			.max(150, "Certification name must be less than 150 characters"),
		issuingOrganization: z
			.string()
			.min(1, "Issuing organization is required")
			.max(150, "Issuing organization must be less than 150 characters"),
		issueDate: z
			.string()
			.min(1, "Issue date is required")
			.refine((date) => {
				const parsed = new Date(date);
				return !isNaN(parsed.getTime());
			}, "Please enter a valid issue date"),
		expirationDate: z
			.string()
			.optional()
			.refine(
				(date) => {
					if (!date) return true;
					const parsed = new Date(date);
					return !isNaN(parsed.getTime());
				},
				"Please enter a valid expiration date"
			),
		doesNotExpire: z.boolean(),
		credentialUrl: z
			.string()
			.url("Please enter a valid URL")
			.or(z.literal(""))
			.optional(),
	})
	.refine(
		(data) => {
			// If does not expire, expirationDate should be empty
			if (data.doesNotExpire) {
				return !data.expirationDate || data.expirationDate === "";
			}
			// If expires, expirationDate is required
			return data.expirationDate && data.expirationDate !== "";
		},
		{
			message: "Expiration date is required for certifications that expire",
			path: ["expirationDate"],
		}
	)
	.refine(
		(data) => {
			// Validate that expiration date is after issue date
			if (data.issueDate && data.expirationDate && data.expirationDate !== "") {
				const issue = new Date(data.issueDate);
				const expiration = new Date(data.expirationDate);
				return expiration >= issue;
			}
			return true;
		},
		{
			message: "Expiration date must be after issue date",
			path: ["expirationDate"],
		}
	);

export type CertificationFormValues = z.infer<typeof certificationSchema>;

