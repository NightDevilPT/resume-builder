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
import { getStepValidation } from "@/lib/utils/resume-helpers";
import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { dummyResumeBuilderRecord } from "@/constants/dummy-resume-builder-record";

// Initial state - Empty by default, can be prefilled with dummy data
const emptyResumeData: ResumeData = {
	name: "",
	description: "",
	personalInfo: {
		fullName: "",
		email: "",
		phone: "",
		location: "",
		website: "",
		links: [],
		summary: "",
	},
	experience: [],
	education: [],
	skills: {
		technical: [],
		soft: [],
		languages: [],
	},
	projects: [],
	certifications: [],
	achievements: [],
};

// Use dummy data if available, otherwise use empty data
const initialResumeData: ResumeData = dummyResumeBuilderRecord?.name
	? dummyResumeBuilderRecord
	: emptyResumeData;

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
	| {
			type: "REORDER_EXPERIENCE";
			payload: { id: string; direction: "up" | "down" };
	  }
	| { type: "ADD_EDUCATION"; payload: Education }
	| {
			type: "UPDATE_EDUCATION";
			payload: { id: string; data: Partial<Education> };
	  }
	| { type: "REMOVE_EDUCATION"; payload: string }
	| {
			type: "REORDER_EDUCATION";
			payload: { id: string; direction: "up" | "down" };
	  }
	| { type: "UPDATE_SKILLS"; payload: Skills }
	| { type: "ADD_PROJECT"; payload: Project }
	| {
			type: "UPDATE_PROJECT";
			payload: { id: string; data: Partial<Project> };
	  }
	| { type: "REMOVE_PROJECT"; payload: string }
	| {
			type: "REORDER_PROJECT";
			payload: { id: string; direction: "up" | "down" };
	  }
	| { type: "ADD_CERTIFICATION"; payload: Certification }
	| {
			type: "UPDATE_CERTIFICATION";
			payload: { id: string; data: Partial<Certification> };
	  }
	| { type: "REMOVE_CERTIFICATION"; payload: string }
	| {
			type: "REORDER_CERTIFICATION";
			payload: { id: string; direction: "up" | "down" };
	  }
	| { type: "ADD_ACHIEVEMENT"; payload: Achievement }
	| {
			type: "UPDATE_ACHIEVEMENT";
			payload: { id: string; data: Partial<Achievement> };
	  }
	| { type: "REMOVE_ACHIEVEMENT"; payload: string }
	| {
			type: "REORDER_ACHIEVEMENT";
			payload: { id: string; direction: "up" | "down" };
	  }
	| { type: "RESET_RESUME" };

// Helper function to reorder items
function reorderItems<T extends { id: string; order: number }>(
	items: T[],
	id: string,
	direction: "up" | "down"
): T[] {
	// Sort items by order first
	const sortedItems = [...items].sort((a, b) => a.order - b.order);
	const currentIndex = sortedItems.findIndex((item) => item.id === id);

	if (currentIndex === -1) return items;

	// Can't move up if already first
	if (direction === "up" && currentIndex === 0) return items;

	// Can't move down if already last
	if (direction === "down" && currentIndex === sortedItems.length - 1)
		return items;

	const targetIndex =
		direction === "up" ? currentIndex - 1 : currentIndex + 1;

	// Swap orders
	const newItems = [...sortedItems];
	const tempOrder = newItems[currentIndex].order;
	newItems[currentIndex] = {
		...newItems[currentIndex],
		order: newItems[targetIndex].order,
	};
	newItems[targetIndex] = { ...newItems[targetIndex], order: tempOrder };

	return newItems;
}

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

		case "REORDER_EXPERIENCE":
			return {
				...state,
				experience: reorderItems(
					state.experience,
					action.payload.id,
					action.payload.direction
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

		case "REORDER_EDUCATION":
			return {
				...state,
				education: reorderItems(
					state.education,
					action.payload.id,
					action.payload.direction
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

		case "REORDER_PROJECT":
			return {
				...state,
				projects: reorderItems(
					state.projects,
					action.payload.id,
					action.payload.direction
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

		case "REORDER_CERTIFICATION":
			return {
				...state,
				certifications: reorderItems(
					state.certifications,
					action.payload.id,
					action.payload.direction
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

		case "REORDER_ACHIEVEMENT":
			return {
				...state,
				achievements: reorderItems(
					state.achievements,
					action.payload.id,
					action.payload.direction
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
		// Validate current step before moving to next
		if (currentStep < totalSteps - 1) {
			const isValid = getStepValidation(currentStep, resumeData);
			if (isValid) {
				setCurrentStep((prev) => prev + 1);
			} else {
				// Step is not valid, don't allow progression
				console.warn(
					"Current step is not valid. Please complete all required fields."
				);
			}
		}
	};

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const goToStep = (step: number) => {
		if (step >= 0 && step < totalSteps) {
			// Can always go back
			if (step <= currentStep) {
				setCurrentStep(step);
				return;
			}

			// Going forward - check if all previous steps are valid
			let canProceed = true;
			for (let i = 0; i < step; i++) {
				if (!getStepValidation(i, resumeData)) {
					canProceed = false;
					console.warn(
						`Cannot skip to step ${step}. Step ${i} is incomplete.`
					);
					break;
				}
			}

			if (canProceed) {
				setCurrentStep(step);
			}
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
