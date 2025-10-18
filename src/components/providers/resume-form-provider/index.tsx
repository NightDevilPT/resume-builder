// contexts/ResumeContext.tsx
"use client";

import {
	Achievement,
	Certification,
	Education,
	Experience,
	PersonalInfo,
	Project,
	ResumeData,
	Skills,
} from "@/interfaces/resume";
import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Initial state - PREFILLED WITH SAMPLE DATA FOR TESTING
const initialResumeData: ResumeData = {
	name: "Senior Full Stack Developer Resume",
	description:
		"Professional resume showcasing full-stack development expertise",
	personalInfo: {
		fullName: "John Doe",
		email: "john.doe@example.com",
		phone: "+1 (555) 123-4567",
		location: "San Francisco, CA",
		website: "https://johndoe.dev",
		links: [
			{ label: "LinkedIn", url: "https://linkedin.com/in/johndoe" },
			{ label: "GitHub", url: "https://github.com/johndoe" },
		],
		summary:
			"Experienced full-stack developer with 5+ years of expertise in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading technical teams to deliver high-quality solutions.",
	},
	experience: [
		{
			id: "exp-1",
			jobTitle: "Senior Software Engineer",
			company: "Tech Corp Inc.",
			location: "San Francisco, CA",
			startDate: new Date("2021-06-01"),
			endDate: undefined,
			currentlyWorking: true,
			description:
				"Leading development of microservices architecture and mentoring junior developers",
			achievements: [
				"Increased application performance by 40% through optimization",
				"Led team of 5 developers to deliver critical features",
				"Reduced deployment time from 2 hours to 15 minutes",
			],
			skillsUsed: [
				"React",
				"Node.js",
				"TypeScript",
				"AWS",
				"Docker",
				"MongoDB",
			],
		},
		{
			id: "exp-2",
			jobTitle: "Full Stack Developer",
			company: "StartupXYZ",
			location: "Remote",
			startDate: new Date("2019-03-01"),
			endDate: new Date("2021-05-31"),
			currentlyWorking: false,
			description: "Developed and maintained multiple web applications",
			achievements: [
				"Built e-commerce platform handling 10k daily users",
				"Implemented CI/CD pipeline reducing bugs by 60%",
			],
			skillsUsed: ["React", "Express", "PostgreSQL", "Redis"],
		},
	],
	education: [
		{
			id: "edu-1",
			degree: "Bachelor of Science in Computer Science",
			institution: "University of California, Berkeley",
			location: "Berkeley, CA",
			startDate: new Date("2015-09-01"),
			endDate: new Date("2019-05-31"),
			currentlyStudying: false,
			gradeType: "gpa",
			gradeValue: "3.8",
			achievements: ["Dean's List", "Summa Cum Laude"],
			coursework: [
				"Data Structures",
				"Algorithms",
				"Database Systems",
				"Web Development",
			],
		},
		{
			id: "edu-2",
			degree: "Master of Science in Software Engineering",
			institution: "Stanford University",
			location: "Stanford, CA",
			startDate: new Date("2019-09-01"),
			endDate: new Date("2021-06-30"),
			currentlyStudying: false,
			gradeType: "cgpa",
			gradeValue: "9.2",
			achievements: ["Research Assistant", "Graduate Teaching Assistant"],
			coursework: [
				"Advanced Algorithms",
				"Machine Learning",
				"Distributed Systems",
				"Cloud Computing",
			],
		},
	],
	skills: {
		technical: [
			"React",
			"Node.js",
			"TypeScript",
			"Python",
			"AWS",
			"Docker",
			"MongoDB",
			"PostgreSQL",
		],
		soft: [
			"Leadership",
			"Communication",
			"Problem Solving",
			"Team Collaboration",
		],
		languages: [
			{ language: "English", proficiency: "Native" },
			{ language: "Spanish", proficiency: "Professional" },
		],
	},
	projects: [
		{
			id: "proj-1",
			name: "E-commerce Platform",
			description:
				"Full-featured e-commerce platform with real-time inventory management",
			technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
			projectUrl: "https://demo-ecommerce.com",
			githubUrl: "https://github.com/johndoe/ecommerce",
			startDate: new Date("2022-01-01"),
			endDate: new Date("2022-06-30"),
			currentlyWorking: false,
			highlights: [
				"Handled 10k concurrent users with 99.9% uptime",
				"Processed $500k in transactions",
				"Integrated payment gateway and shipping APIs",
			],
		},
		{
			id: "proj-2",
			name: "AI Task Management App",
			description:
				"Intelligent task manager with AI-powered prioritization and scheduling",
			technologies: [
				"Next.js",
				"TypeScript",
				"OpenAI",
				"PostgreSQL",
				"Prisma",
			],
			projectUrl: "https://taskmaster-ai.com",
			githubUrl: "https://github.com/johndoe/taskmaster",
			startDate: new Date("2023-03-01"),
			endDate: undefined,
			currentlyWorking: true,
			highlights: [
				"AI-powered task prioritization using GPT-4",
				"Real-time collaboration with 5k active users",
				"Integrated with Google Calendar and Slack",
			],
		},
	],
	certifications: [
		{
			id: "cert-1",
			name: "AWS Certified Solutions Architect",
			issuingOrganization: "Amazon Web Services",
			issueDate: new Date("2023-01-15"),
			expirationDate: new Date("2026-01-15"),
			doesNotExpire: false,
			credentialUrl: "https://aws.amazon.com/verification/xxxxx",
		},
		{
			id: "cert-2",
			name: "Professional Scrum Master (PSM I)",
			issuingOrganization: "Scrum.org",
			issueDate: new Date("2022-08-20"),
			expirationDate: undefined,
			doesNotExpire: true,
			credentialUrl: "https://scrum.org/verify/12345",
		},
	],
	achievements: [
		{
			id: "ach-1",
			title: "Best Innovation Award 2023",
			issuer: "Tech Corp Inc.",
			date: new Date("2023-12-15"),
			description:
				"Recognized for developing an AI-powered tool that reduced deployment time by 60% and saved the company $200K annually.",
		},
		{
			id: "ach-2",
			title: "Employee of the Quarter Q2 2023",
			issuer: "Tech Corp Inc.",
			date: new Date("2023-06-30"),
			description:
				"Awarded for exceptional performance and leadership in delivering critical features ahead of schedule.",
		},
	],
};

type ResumeAction =
	| {
			type: "UPDATE_RESUME_META";
			payload: { name: string; description: string };
	  } // Add this
	| { type: "UPDATE_PERSONAL_INFO"; payload: PersonalInfo }
	| { type: "ADD_EXPERIENCE"; payload: Experience }
	| {
			type: "UPDATE_EXPERIENCE";
			payload: { id: string; data: Partial<Experience> };
	  }
	| { type: "REMOVE_EXPERIENCE"; payload: string }
	| { type: "ADD_EDUCATION"; payload: Education }
	| {
			type: "UPDATE_EDUCATION";
			payload: { id: string; data: Partial<Education> };
	  }
	| { type: "REMOVE_EDUCATION"; payload: string }
	| { type: "UPDATE_SKILLS"; payload: Skills }
	| { type: "ADD_PROJECT"; payload: Project }
	| {
			type: "UPDATE_PROJECT";
			payload: { id: string; data: Partial<Project> };
	  }
	| { type: "REMOVE_PROJECT"; payload: string }
	| { type: "ADD_CERTIFICATION"; payload: Certification }
	| {
			type: "UPDATE_CERTIFICATION";
			payload: { id: string; data: Partial<Certification> };
	  }
	| { type: "REMOVE_CERTIFICATION"; payload: string }
	| { type: "ADD_ACHIEVEMENT"; payload: Achievement }
	| {
			type: "UPDATE_ACHIEVEMENT";
			payload: { id: string; data: Partial<Achievement> };
	  }
	| { type: "REMOVE_ACHIEVEMENT"; payload: string }
	| { type: "RESET_RESUME" };

// Reducer function
function resumeReducer(state: ResumeData, action: ResumeAction): ResumeData {
	switch (action.type) {
		case "UPDATE_RESUME_META": // Add this case
			return {
				...state,
				name: action.payload.name,
				description: action.payload.description,
			};
		case "UPDATE_PERSONAL_INFO":
			return {
				...state,
				personalInfo: { ...state.personalInfo, ...action.payload },
			};

		case "ADD_EXPERIENCE":
			return {
				...state,
				experience: [...state.experience, action.payload],
			};

		case "UPDATE_EXPERIENCE":
			return {
				...state,
				experience: state.experience.map((exp) =>
					exp.id === action.payload.id
						? { ...exp, ...action.payload.data }
						: exp
				),
			};

		case "REMOVE_EXPERIENCE":
			return {
				...state,
				experience: state.experience.filter(
					(exp) => exp.id !== action.payload
				),
			};

		case "ADD_EDUCATION":
			return {
				...state,
				education: [...state.education, action.payload],
			};

		case "UPDATE_EDUCATION":
			return {
				...state,
				education: state.education.map((edu) =>
					edu.id === action.payload.id
						? { ...edu, ...action.payload.data }
						: edu
				),
			};

		case "REMOVE_EDUCATION":
			return {
				...state,
				education: state.education.filter(
					(edu) => edu.id !== action.payload
				),
			};

		case "UPDATE_SKILLS":
			return {
				...state,
				skills: action.payload,
			};

		case "ADD_PROJECT":
			return {
				...state,
				projects: [...state.projects, action.payload],
			};

		case "UPDATE_PROJECT":
			return {
				...state,
				projects: state.projects.map((proj) =>
					proj.id === action.payload.id
						? { ...proj, ...action.payload.data }
						: proj
				),
			};

		case "REMOVE_PROJECT":
			return {
				...state,
				projects: state.projects.filter(
					(proj) => proj.id !== action.payload
				),
			};

		case "ADD_CERTIFICATION":
			return {
				...state,
				certifications: [...state.certifications, action.payload],
			};

		case "UPDATE_CERTIFICATION":
			return {
				...state,
				certifications: state.certifications.map((cert) =>
					cert.id === action.payload.id
						? { ...cert, ...action.payload.data }
						: cert
				),
			};

		case "REMOVE_CERTIFICATION":
			return {
				...state,
				certifications: state.certifications.filter(
					(cert) => cert.id !== action.payload
				),
			};

		case "ADD_ACHIEVEMENT":
			return {
				...state,
				achievements: [...state.achievements, action.payload],
			};

		case "UPDATE_ACHIEVEMENT":
			return {
				...state,
				achievements: state.achievements.map((ach) =>
					ach.id === action.payload.id
						? { ...ach, ...action.payload.data }
						: ach
				),
			};

		case "REMOVE_ACHIEVEMENT":
			return {
				...state,
				achievements: state.achievements.filter(
					(ach) => ach.id !== action.payload
				),
			};

		case "RESET_RESUME":
			return initialResumeData;

		default:
			return state;
	}
}

// Context interface
interface ResumeContextType {
	resumeData: ResumeData;
	currentStep: number;
	dispatch: React.Dispatch<ResumeAction>;
	nextStep: () => void;
	prevStep: () => void;
	goToStep: (step: number) => void;
	isLastStep: boolean;
	isFirstStep: boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Provider component
interface ResumeProviderProps {
	children: ReactNode;
	totalSteps?: number;
}

export function ResumeProvider({
	children,
	totalSteps = 9,
}: ResumeProviderProps) {
	const [resumeData, dispatch] = useReducer(resumeReducer, initialResumeData);
	const [currentStep, setCurrentStep] = React.useState(0);

	const nextStep = () => {
		if (currentStep < totalSteps - 1) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const goToStep = (step: number) => {
		if (step >= 0 && step < totalSteps) {
			setCurrentStep(step);
		}
	};

	const isLastStep = currentStep === totalSteps - 1;
	const isFirstStep = currentStep === 0;

	const value: ResumeContextType = {
		resumeData,
		currentStep,
		dispatch,
		nextStep,
		prevStep,
		goToStep,
		isLastStep,
		isFirstStep,
	};

	return (
		<ResumeContext.Provider value={value}>
			{children}
		</ResumeContext.Provider>
	);
}

// Hook to use the context
export function useResume() {
	const context = useContext(ResumeContext);
	if (context === undefined) {
		throw new Error("useResume must be used within a ResumeProvider");
	}
	return context;
}
