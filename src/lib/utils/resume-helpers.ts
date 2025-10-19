import { ResumeData } from "@/interfaces/resume";

/**
 * Validate if Resume Meta step is complete
 */
export const isResumeMetaValid = (resumeData: ResumeData): boolean => {
	return Boolean(resumeData.name?.trim() && resumeData.description?.trim());
};

/**
 * Validate if Personal Info step is complete
 */
export const isPersonalInfoValid = (resumeData: ResumeData): boolean => {
	return Boolean(
		resumeData.personalInfo.fullName?.trim() &&
		resumeData.personalInfo.email?.trim() &&
		resumeData.personalInfo.phone?.trim() &&
		resumeData.personalInfo.location?.trim() &&
		resumeData.personalInfo.summary?.trim() &&
		resumeData.personalInfo.summary.length >= 50
	);
};

/**
 * Validate if Experience step is complete (optional but recommended)
 */
export const isExperienceValid = (resumeData: ResumeData): boolean => {
	// Experience is optional, always return true to allow skipping
	return true;
};

/**
 * Validate if Education step is complete (optional but recommended)
 */
export const isEducationValid = (resumeData: ResumeData): boolean => {
	// Education is optional, always return true to allow skipping
	return true;
};

/**
 * Validate if Skills step is complete
 */
export const isSkillsValid = (resumeData: ResumeData): boolean => {
	return Boolean(
		resumeData.skills.technical.length > 0 &&
		resumeData.skills.soft.length > 0 &&
		resumeData.skills.languages.length > 0
	);
};

/**
 * Validate if Projects step is complete (optional)
 */
export const isProjectsValid = (resumeData: ResumeData): boolean => {
	// Projects is optional, always return true to allow skipping
	return true;
};

/**
 * Validate if Certifications step is complete (optional)
 */
export const isCertificationsValid = (resumeData: ResumeData): boolean => {
	// Certifications is optional, always return true to allow skipping
	return true;
};

/**
 * Validate if Achievements step is complete (optional)
 */
export const isAchievementsValid = (resumeData: ResumeData): boolean => {
	// Achievements is optional, always return true to allow skipping
	return true;
};

/**
 * Get validation function for a specific step
 */
export const getStepValidation = (stepId: number, resumeData: ResumeData): boolean => {
	switch (stepId) {
		case 0: // Resume Meta
			return isResumeMetaValid(resumeData);
		case 1: // Personal Info
			return isPersonalInfoValid(resumeData);
		case 2: // Experience
			return isExperienceValid(resumeData);
		case 3: // Education
			return isEducationValid(resumeData);
		case 4: // Skills
			return isSkillsValid(resumeData);
		case 5: // Projects
			return isProjectsValid(resumeData);
		case 6: // Certifications
			return isCertificationsValid(resumeData);
		case 7: // Achievements
			return isAchievementsValid(resumeData);
		case 8: // Review
			return true; // Review is always accessible once we reach it
		default:
			return false;
	}
};

/**
 * Check if a step is accessible based on previous steps completion
 */
export const isStepAccessible = (stepId: number, currentStep: number, resumeData: ResumeData): boolean => {
	// Can always go back to previous steps or stay on current
	if (stepId <= currentStep) {
		return true;
	}

	// For forward navigation, check if all steps up to (but not including) the target are valid
	for (let i = 0; i < stepId; i++) {
		if (!getStepValidation(i, resumeData)) {
			return false;
		}
	}

	// All previous steps are valid, step is accessible
	return true;
};

/**
 * Check if all required sections are completed
 */
export const areRequiredSectionsComplete = (resumeData: ResumeData): boolean => {
	return (
		isResumeMetaValid(resumeData) &&
		isPersonalInfoValid(resumeData) &&
		isSkillsValid(resumeData)
	);
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

