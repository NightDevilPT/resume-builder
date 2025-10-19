// components/pages/resume-page/components/ActionButtons.tsx
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

interface ActionButtonsProps {
	onBack?: () => void;
	onNext?: () => void;
	onSave?: () => void;
	isFirstStep: boolean;
	isLastStep: boolean;
	nextLabel?: string;
	backLabel?: string;
}

export function ActionButtons({
	onBack,
	onNext,
	onSave,
	isFirstStep,
	isLastStep,
	nextLabel = "Next",
	backLabel = "Back",
}: ActionButtonsProps) {
	return (
		<div className="flex items-center justify-between gap-2 md:gap-4 px-3 md:px-6 py-3 md:py-4 border-t bg-background">
			<Button
				type="button"
				variant="outline"
				onClick={onBack}
				disabled={isFirstStep}
				size="sm"
				className={cn(
					"gap-1 md:gap-2 md:h-10",
					isFirstStep && "invisible"
				)}
			>
				<ChevronLeft className="w-4 h-4" />
				<span className="hidden sm:inline">{backLabel}</span>
			</Button>

			<div className="flex gap-1.5 md:gap-2">
				{onSave && (
					<Button
						type="button"
						variant="outline"
						onClick={onSave}
						size="sm"
						className="gap-1 md:gap-2 md:h-10"
					>
						<Save className="w-4 h-4" />
						<span className="hidden md:inline">Save Draft</span>
						<span className="md:hidden">Save</span>
					</Button>
				)}

				<Button
					type="button"
					onClick={onNext}
					size="sm"
					className="gap-1 md:gap-2 md:h-10"
				>
					{isLastStep ? "Finish" : nextLabel}
					{!isLastStep && <ChevronRight className="w-4 h-4" />}
				</Button>
			</div>
		</div>
	);
}
