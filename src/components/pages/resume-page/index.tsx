"use client";

import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { RESUME_STEPS } from "./steps/config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActionButtons } from "./components/ActionButtons";
import { StepIndicator } from "./components/StepIndicator";
import { FileText, Eye, Sparkles, FileSearch } from "lucide-react";
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
					resumeData={resumeData}
					onStepClick={goToStep}
				/>
			</div>

			{/* Main Content */}
			<div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 min-h-0">
				{/* Form Section */}
				<Card className="flex flex-col overflow-hidden">
					{/* Form Content - Scrollable */}
					<ScrollArea className="flex-1 overflow-hidden">
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
				<Card className="hidden lg:flex flex-col bg-muted/30 h-full p-0 overflow-hidden">
					{/* Coming Soon Preview */}
					<div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
						{/* Animated Icon Stack */}
						<div className="relative mb-8">
							<div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
							<div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-full border-2 border-primary/20">
								<Eye className="h-16 w-16 text-primary animate-pulse" />
							</div>
							<div className="absolute -top-2 -right-2 bg-background rounded-full p-2 border-2 border-primary/30 shadow-lg">
								<Sparkles className="h-5 w-5 text-primary" />
							</div>
							<div className="absolute -bottom-2 -left-2 bg-background rounded-full p-2 border-2 border-primary/30 shadow-lg">
								<FileSearch className="h-5 w-5 text-primary" />
							</div>
						</div>

						{/* Content */}
						<div className="space-y-4 max-w-md">
							<h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
								Resume Preview
							</h2>
							<div className="space-y-2">
								<p className="text-lg font-semibold text-foreground">
									Coming Soon
								</p>
								<p className="text-sm text-muted-foreground leading-relaxed">
									We&apos;re crafting an amazing live preview
									experience for your resume. You&apos;ll be
									able to see your changes in real-time as you
									build!
								</p>
							</div>

							{/* Feature List */}
							<div className="pt-4 space-y-3 text-left">
								<div className="flex items-start gap-3 text-sm">
									<div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
										<Eye className="h-3 w-3 text-primary" />
									</div>
									<span className="text-muted-foreground">
										Real-time preview of your resume
									</span>
								</div>
								<div className="flex items-start gap-3 text-sm">
									<div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
										<Sparkles className="h-3 w-3 text-primary" />
									</div>
									<span className="text-muted-foreground">
										Multiple professional templates
									</span>
								</div>
								<div className="flex items-start gap-3 text-sm">
									<div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
										<FileSearch className="h-3 w-3 text-primary" />
									</div>
									<span className="text-muted-foreground">
										Instant PDF export functionality
									</span>
								</div>
							</div>
						</div>

						{/* Decorative Elements */}
						<div className="absolute top-8 right-8 opacity-10">
							<FileText className="h-32 w-32 text-primary" />
						</div>
						<div className="absolute bottom-8 left-8 opacity-10">
							<FileText className="h-24 w-24 text-primary" />
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
