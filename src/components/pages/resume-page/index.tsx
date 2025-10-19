"use client";

import { toast } from "sonner";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RESUME_STEPS } from "./steps/config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActionButtons } from "./components/ActionButtons";
import { StepIndicator } from "./components/StepIndicator";
import { useResume } from "@/components/providers/resume-form-provider";

export function ResumeStepper() {
	const {
		currentStep,
		prevStep,
		nextStep,
		goToStep,
		isFirstStep,
		isLastStep,
		resumeData,
	} = useResume();

	const CurrentStepComponent = RESUME_STEPS[currentStep].component;

	const handleNext = () => {
		// Trigger form submission by clicking the hidden submit button in the current step
		const submitButton = document.querySelector(
			'form button[type="submit"]'
		);
		if (submitButton instanceof HTMLElement) {
			submitButton.click();

			// Check if form has errors after a short delay
			setTimeout(() => {
				const formErrors = document.querySelector('[role="alert"]');
				if (formErrors) {
					toast.error("Please fix the errors before continuing", {
						description:
							"Make sure all required fields are filled correctly.",
					});
				}
			}, 100);
		}
	};

	const handleSave = () => {
		toast.success("Draft saved successfully!", {
			description: "Your progress has been saved.",
		});
		// TODO: Implement actual save to localStorage or backend
		console.log("Saving resume data:", resumeData);
	};

	return (
		<div className="w-full h-full flex flex-col gap-3 md:gap-6 p-3 md:p-6 max-w-[1600px] mx-auto">
			{/* Header Section */}
			<div className="space-y-3 md:space-y-4">
				<div className="flex items-center gap-2 md:gap-3">
					<div className="h-10 w-10 md:h-14 md:w-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
						<FileText className="h-5 w-5 md:h-7 md:w-7 text-primary" />
					</div>
					<div className="min-w-0 flex-1">
						<h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight truncate">
							Professional Resume Builder
						</h1>
						<p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
							Create a stunning resume in minutes with our
							step-by-step builder
						</p>
					</div>
				</div>

				{/* Step Indicator */}
				<StepIndicator
					currentStep={currentStep}
					onStepClick={goToStep}
				/>
			</div>

			{/* Main Content */}
			<div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 min-h-0">
				{/* Form Section */}
				<Card className="flex flex-col overflow-hidden">
					{/* Form Content - Scrollable */}
					<ScrollArea className="flex-1 overflow-y-auto">
						<CurrentStepComponent />
					</ScrollArea>

					{/* Action Buttons - Fixed at bottom */}
					<ActionButtons
						onBack={prevStep}
						onNext={handleNext}
						onSave={handleSave}
						isFirstStep={isFirstStep}
						isLastStep={isLastStep}
					/>
				</Card>

				{/* Preview Section */}
				<Card className="hidden lg:flex flex-col items-center justify-center bg-muted/30">
					<div className="text-center space-y-3 p-8">
						<div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
							<FileText className="w-8 h-8 text-primary" />
						</div>
						<h3 className="text-xl font-semibold">
							Resume Preview
						</h3>
						<p className="text-muted-foreground max-w-md">
							Your resume preview will appear here as you fill in
							the information. This feature is coming soon!
						</p>
					</div>
				</Card>
			</div>
		</div>
	);
}
