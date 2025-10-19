import { ResumeData } from "@/interfaces/resume";

/**
 * Check if all required sections are completed
 */
export const areRequiredSectionsComplete = (resumeData: ResumeData): boolean => {
	// Required sections:
	// 1. Resume Meta (name)
	// 2. Personal Info (fullName, email, phone, location, summary)
	// 3. Experience (at least 1)
	// 4. Skills (at least 1 technical, 1 soft, 1 language)
	
	const hasResumeMeta = Boolean(resumeData.name && resumeData.description);
	const hasPersonalInfo = Boolean(
		resumeData.personalInfo.fullName &&
		resumeData.personalInfo.email &&
		resumeData.personalInfo.phone &&
		resumeData.personalInfo.location &&
		resumeData.personalInfo.summary
	);
	const hasExperience = resumeData.experience.length > 0;
	const hasSkills = 
		resumeData.skills.technical.length > 0 &&
		resumeData.skills.soft.length > 0 &&
		resumeData.skills.languages.length > 0;

	return hasResumeMeta && hasPersonalInfo && hasExperience && hasSkills;
};

/**
 * Format date range for display
 */
export const formatDateRange = (
	startDate: Date,
	endDate?: Date,
	isCurrent: boolean = false
): string => {
	const formatDate = (date: Date): string => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
		}).format(date);
	};

	const start = formatDate(startDate);
	const end = isCurrent ? "Present" : endDate ? formatDate(endDate) : "";

	return `${start} - ${end}`;
};

