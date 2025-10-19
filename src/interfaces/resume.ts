// types/resume.ts
export interface PersonalInfo {
	fullName: string;
	email: string;
	phone: string;
	location: string;
	website?: string; // Generic website/portfolio
	links: Array<{
		label: string;
		url: string;
	}>;
	summary: string;
}

export interface Experience {
	id: string;
	order: number;
	jobTitle: string;
	company: string;
	location: string;
	startDate: Date;
	endDate?: Date;
	currentlyWorking: boolean;
	description?: string;
	achievements: string[];
	skillsUsed: string[];
}

export interface Education {
	id: string;
	order: number;
	degree: string;
	institution: string;
	location: string;
	startDate: Date;
	endDate?: Date;
	currentlyStudying: boolean;
	gradeType: "gpa" | "cgpa" | "percentage" | "grade" | "none";
	gradeValue: string;
	achievements: string[];
	coursework: string[];
}

export interface Skills {
	technical: Array<{
		name: string;
		level: number; // 1-10
	}>;
	soft: Array<{
		name: string;
		level: number; // 1-10
	}>;
	languages: Array<{
		language: string;
		proficiency: "Native" | "Fluent" | "Professional" | "Basic";
	}>;
}

export interface Project {
	id: string;
	order: number;
	name: string;
	subtitle?: string;
	description?: string;
	technologies: string[];
	links: Array<{
		label: string;
		url: string;
	}>;
	startDate: Date;
	endDate?: Date;
	currentlyWorking: boolean;
	highlights: string[];
}

export interface Certification {
	id: string;
	order: number;
	name: string;
	issuingOrganization: string;
	issueDate: Date;
	expirationDate?: Date;
	credentialUrl: string;
	doesNotExpire: boolean;
}

export interface Achievement {
	id: string;
	order: number;
	title: string;
	issuer: string;
	date: Date;
	description: string;
}

export interface ResumeData {
	name: string; // Add this
	description: string; // Add this
	personalInfo: PersonalInfo;
	experience: Experience[];
	education: Education[];
	skills: Skills;
	projects: Project[];
	certifications: Certification[];
	achievements: Achievement[];
}

export type Step = {
	id: number;
	title: string;
	description: string;
	component: React.ComponentType;
};
