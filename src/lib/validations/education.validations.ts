import { z } from "zod";

/**
 * Validation schema for Education form
 * Includes degree, institution, dates, GPA, and coursework
 */
export const educationSchema = z
	.object({
		degree: z
			.string()
			.min(1, "Degree is required")
			.max(100, "Degree must be less than 100 characters"),
		institution: z
			.string()
			.min(1, "Institution name is required")
			.max(150, "Institution name must be less than 150 characters"),
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
		currentlyStudying: z.boolean(),
		gradeType: z.enum(["gpa", "cgpa", "percentage", "grade", "none"]),
		gradeValue: z
			.string()
			.max(20, "Grade value must be less than 20 characters")
			.optional()
			.or(z.literal("")),
		achievements: z
			.array(z.string().min(1, "Achievement cannot be empty"))
			.min(0, "Achievements are optional")
			.max(10, "Maximum 10 achievements allowed"),
		coursework: z
			.array(z.string().min(1, "Course cannot be empty"))
			.min(0, "Coursework is optional")
			.max(20, "Maximum 20 courses allowed"),
	})
	.refine(
		(data) => {
			// If currently studying, endDate should be empty
			if (data.currentlyStudying) {
				return !data.endDate || data.endDate === "";
			}
			// If not currently studying, endDate is required
			return data.endDate && data.endDate !== "";
		},
		{
			message: "End date is required when not currently studying",
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
	)
	.refine(
		(data) => {
			// If gradeType is not "none" and not currently studying, gradeValue is required
			if (!data.currentlyStudying && data.gradeType !== "none" && (!data.gradeValue || data.gradeValue.trim() === "")) {
				return false;
			}
			return true;
		},
		{
			message: "Grade value is required when grade type is selected",
			path: ["gradeValue"],
		}
	)
	.refine(
		(data) => {
			// Validate GPA format (0.0 to 4.0 or 5.0)
			if (data.gradeType === "gpa" && data.gradeValue) {
				const gpaValue = parseFloat(data.gradeValue);
				return !isNaN(gpaValue) && gpaValue >= 0 && gpaValue <= 5.0;
			}
			return true;
		},
		{
			message: "GPA must be a number between 0.0 and 5.0",
			path: ["gradeValue"],
		}
	)
	.refine(
		(data) => {
			// Validate CGPA format (0.0 to 10.0)
			if (data.gradeType === "cgpa" && data.gradeValue) {
				const cgpaValue = parseFloat(data.gradeValue);
				return !isNaN(cgpaValue) && cgpaValue >= 0 && cgpaValue <= 10.0;
			}
			return true;
		},
		{
			message: "CGPA must be a number between 0.0 and 10.0",
			path: ["gradeValue"],
		}
	)
	.refine(
		(data) => {
			// Validate Percentage format (0 to 100)
			if (data.gradeType === "percentage" && data.gradeValue) {
				const percentValue = parseFloat(data.gradeValue);
				return !isNaN(percentValue) && percentValue >= 0 && percentValue <= 100;
			}
			return true;
		},
		{
			message: "Percentage must be a number between 0 and 100",
			path: ["gradeValue"],
		}
	);

export type EducationFormValues = z.infer<typeof educationSchema>;

