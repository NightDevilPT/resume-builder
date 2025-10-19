// components/pages/resume-page/components/StepIndicator.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { RESUME_STEPS } from "../steps/config";

interface StepIndicatorProps {
	currentStep: number;
	onStepClick?: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
	return (
		<div className="w-full">
			{/* Desktop: Show all steps */}
			<div className="hidden lg:flex items-center justify-between">
				{RESUME_STEPS.map((step, index) => {
					const Icon = step.icon;
					const isActive = currentStep === index;
					const isCompleted = currentStep > index;
					const isClickable = onStepClick !== undefined;

					return (
						<div key={step.id} className="flex items-center flex-1">
							<button
								type="button"
								onClick={() => isClickable && onStepClick(index)}
								disabled={!isClickable}
								className={cn(
									"relative flex flex-col items-center group",
									isClickable && "cursor-pointer hover:opacity-80"
								)}
							>
								{/* Step Circle */}
								<div
									className={cn(
										"w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
										"border-2",
										isActive &&
											"border-primary bg-primary text-primary-foreground shadow-lg scale-110",
										isCompleted &&
											"border-primary bg-primary text-primary-foreground",
										!isActive &&
											!isCompleted &&
											"border-muted-foreground/30 bg-background text-muted-foreground"
									)}
								>
								{isCompleted ? (
									<Check className="w-4 h-4" />
								) : (
									<Icon className="w-4 h-4" />
								)}
								</div>

								{/* Step Label */}
								<div className="flex flex-col items-center mt-2 min-w-[80px]">
									<span
										className={cn(
											"text-xs font-medium text-center",
											isActive && "text-primary",
											!isActive && "text-muted-foreground"
										)}
									>
										{step.title}
									</span>
								</div>
							</button>

							{/* Connector Line */}
							{index < RESUME_STEPS.length - 1 && (
								<div
									className={cn(
										"flex-1 h-0.5 mx-1 transition-colors duration-200",
										isCompleted ? "bg-primary" : "bg-muted-foreground/30"
									)}
								/>
							)}
						</div>
					);
				})}
			</div>

			{/* Tablet: Compact version */}
			<div className="hidden md:flex lg:hidden items-center justify-between">
				{RESUME_STEPS.map((step, index) => {
					const Icon = step.icon;
					const isActive = currentStep === index;
					const isCompleted = currentStep > index;

					return (
						<div key={step.id} className="flex items-center flex-1">
							<div className="relative flex flex-col items-center">
								{/* Step Circle - Smaller */}
								<div
									className={cn(
										"w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
										"border-2",
										isActive &&
											"border-primary bg-primary text-primary-foreground shadow-lg scale-110",
										isCompleted &&
											"border-primary bg-primary text-primary-foreground",
										!isActive &&
											!isCompleted &&
											"border-muted-foreground/30 bg-background text-muted-foreground"
									)}
								>
									{isCompleted ? (
										<Check className="w-3.5 h-3.5" />
									) : (
										<Icon className="w-3.5 h-3.5" />
									)}
								</div>
							</div>

							{/* Connector Line */}
							{index < RESUME_STEPS.length - 1 && (
								<div
									className={cn(
										"flex-1 h-0.5 mx-0.5 transition-colors duration-200",
										isCompleted ? "bg-primary" : "bg-muted-foreground/30"
									)}
								/>
							)}
						</div>
					);
				})}
			</div>

			{/* Mobile: Progress bar with current step info */}
			<div className="md:hidden space-y-3">
				{/* Progress Bar */}
				<div className="relative">
					<div className="flex items-center justify-between mb-2">
						<span className="text-xs text-muted-foreground">
							Step {currentStep + 1} of {RESUME_STEPS.length}
						</span>
						<span className="text-xs font-medium text-primary">
							{Math.round(((currentStep + 1) / RESUME_STEPS.length) * 100)}%
						</span>
					</div>
					<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
						<div
							className="h-full bg-primary transition-all duration-300"
							style={{
								width: `${((currentStep + 1) / RESUME_STEPS.length) * 100}%`,
							}}
						/>
					</div>
				</div>

				{/* Current Step Info */}
				<div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
					<div
						className={cn(
							"w-10 h-10 rounded-full flex items-center justify-center shrink-0",
							"border-2 border-primary bg-primary text-primary-foreground"
						)}
					>
						{React.createElement(RESUME_STEPS[currentStep].icon, {
							className: "w-5 h-5",
						})}
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium truncate">
							{RESUME_STEPS[currentStep].title}
						</p>
						<p className="text-xs text-muted-foreground truncate">
							{RESUME_STEPS[currentStep].description}
						</p>
					</div>
				</div>

				{/* Mini Step Dots */}
				<div className="flex items-center justify-center gap-1.5">
					{RESUME_STEPS.map((step, index) => (
						<div
							key={step.id}
							className={cn(
								"transition-all duration-200",
								index === currentStep
									? "w-6 h-1.5 rounded-full bg-primary"
									: index < currentStep
									? "w-1.5 h-1.5 rounded-full bg-primary"
									: "w-1.5 h-1.5 rounded-full bg-muted-foreground/30"
							)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

