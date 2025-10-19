// components/pages/resume-page/steps/experience/index.tsx
"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Experience } from "@/interfaces/resume";
import { Separator } from "@/components/ui/separator";
import { useResume } from "@/components/providers/resume-form-provider";
import { ExperienceDialog } from "@/components/shared/dialogs/ExperienceDialog";
import { ExperienceCard } from "../../../../shared/resume-cards/ExperienceCard";

export function ExperiencePage() {
	const { resumeData, dispatch, nextStep } = useResume();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingExperience, setEditingExperience] = useState<
		Experience | undefined
	>(undefined);

	const experiences = resumeData.experience.sort((a, b) => a.order - b.order);

	// Reset editing experience when dialog closes
	useEffect(() => {
		if (!dialogOpen) {
			setEditingExperience(undefined);
		}
	}, [dialogOpen]);

	const handleAddExperience = (experience: Experience) => {
		const newExperience = {
			...experience,
			order: experiences.length,
		};
		dispatch({ type: "ADD_EXPERIENCE", payload: newExperience });
	};

	const handleEditExperience = (experience: Experience) => {
		dispatch({
			type: "UPDATE_EXPERIENCE",
			payload: { id: experience.id, data: experience },
		});
	};

	const handleDeleteExperience = (id: string) => {
		if (confirm("Are you sure you want to delete this experience?")) {
			dispatch({ type: "REMOVE_EXPERIENCE", payload: id });
		}
	};

	const handleReorder = (id: string, direction: "up" | "down") => {
		dispatch({ type: "REORDER_EXPERIENCE", payload: { id, direction } });
	};

	const openAddDialog = () => {
		setEditingExperience(undefined);
		setDialogOpen(true);
	};

	const openEditDialog = (experience: Experience) => {
		setEditingExperience(experience);
		setDialogOpen(true);
	};

	const handleDialogSubmit = (experience: Experience) => {
		if (editingExperience) {
			handleEditExperience(experience);
		} else {
			handleAddExperience(experience);
		}
	};

	const handleContinue = () => {
		if (experiences.length === 0) {
			if (
				!confirm(
					"You haven't added any experience yet. Continue anyway?"
				)
			) {
				return;
			}
		}
		nextStep();
	};

	return (
		<div className="w-full h-full flex flex-col">
			<div className="flex-1 px-4">
				<div className="max-w-3xl mx-auto">
					{/* Header Card */}
					<Card className="p-0 border-none shadow-none">
						<CardHeader className="px-0">
							<div className="flex items-start gap-4">
								<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
									<Briefcase className="h-6 w-6 text-primary" />
								</div>
								<div className="flex-1">
									<CardTitle className="text-xl">
										Work Experience
									</CardTitle>
									<CardDescription>
										Add your professional work history and
										achievements
									</CardDescription>
								</div>
								<Button onClick={openAddDialog} size="sm">
									<Plus className="h-4 w-4 mr-2" />
									Add Experience
								</Button>
							</div>
						</CardHeader>
					</Card>
					<Separator />

					{/* Experience List */}
					<div className="space-y-4 mt-6">
						{experiences.length === 0 ? (
							<Card>
								<CardContent className="flex flex-col items-center justify-center py-12">
									<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
										<Briefcase className="h-8 w-8 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-semibold mb-2">
										No work experience added yet
									</h3>
									<p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
										Click &quot;Add Experience&quot; to
										include your professional work history,
										achievements, and skills.
									</p>
									<Button onClick={openAddDialog}>
										<Plus className="h-4 w-4 mr-2" />
										Add Your First Experience
									</Button>
								</CardContent>
							</Card>
						) : (
							experiences.map((experience, index) => (
								<ExperienceCard
									key={experience.id}
									experience={experience}
									index={index}
									totalCount={experiences.length}
									onEdit={openEditDialog}
									onDelete={handleDeleteExperience}
									onReorder={handleReorder}
								/>
							))
						)}
					</div>

					{/* Continue Button */}
					{experiences.length > 0 && (
						<div className="mt-6 pb-6">
							<Button onClick={handleContinue} className="w-full">
								Continue to Next Step
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Experience Dialog */}
			<ExperienceDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSubmit={handleDialogSubmit}
				initialData={editingExperience}
				mode={editingExperience ? "edit" : "add"}
			/>
		</div>
	);
}
