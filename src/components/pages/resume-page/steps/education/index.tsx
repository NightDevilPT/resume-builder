// components/pages/resume-page/steps/education/index.tsx
"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus } from "lucide-react";
import type { Education } from "@/interfaces/resume";
import { Separator } from "@/components/ui/separator";
import { useResume } from "@/components/providers/resume-form-provider";
import { EducationDialog } from "@/components/shared/dialogs/EducationDialog";
import { EducationCard } from "../../../../shared/resume-cards/EducationCard";

export function EducationPage() {
	const { resumeData, dispatch, nextStep } = useResume();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingEducation, setEditingEducation] = useState<
		Education | undefined
	>(undefined);

	const educationList = resumeData.education.sort(
		(a, b) => a.order - b.order
	);

	// Reset editing education when dialog closes
	useEffect(() => {
		if (!dialogOpen) {
			setEditingEducation(undefined);
		}
	}, [dialogOpen]);

	const handleAddEducation = (education: Education) => {
		const newEducation = {
			...education,
			order: educationList.length,
		};
		dispatch({ type: "ADD_EDUCATION", payload: newEducation });
	};

	const handleEditEducation = (education: Education) => {
		dispatch({
			type: "UPDATE_EDUCATION",
			payload: { id: education.id, data: education },
		});
	};

	const handleDeleteEducation = (id: string) => {
		if (confirm("Are you sure you want to delete this education?")) {
			dispatch({ type: "REMOVE_EDUCATION", payload: id });
		}
	};

	const handleReorder = (id: string, direction: "up" | "down") => {
		dispatch({ type: "REORDER_EDUCATION", payload: { id, direction } });
	};

	const openAddDialog = () => {
		setEditingEducation(undefined);
		setDialogOpen(true);
	};

	const openEditDialog = (education: Education) => {
		setEditingEducation(education);
		setDialogOpen(true);
	};

	const handleDialogSubmit = (education: Education) => {
		if (editingEducation) {
			handleEditEducation(education);
		} else {
			handleAddEducation(education);
		}
	};

	const handleContinue = () => {
		if (educationList.length === 0) {
			if (
				!confirm(
					"You haven't added any education yet. Continue anyway?"
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
									<GraduationCap className="h-6 w-6 text-primary" />
								</div>
								<div className="flex-1">
									<CardTitle className="text-xl">
										Education
									</CardTitle>
									<CardDescription>
										Add your educational background and
										academic achievements
									</CardDescription>
								</div>
								<Button onClick={openAddDialog} size="sm">
									<Plus className="h-4 w-4 mr-2" />
									Add Education
								</Button>
							</div>
						</CardHeader>
					</Card>
					<Separator />

					{/* Education List */}
					<div className="space-y-4 mt-6">
						{educationList.length === 0 ? (
							<Card>
								<CardContent className="flex flex-col items-center justify-center py-12">
									<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
										<GraduationCap className="h-8 w-8 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-semibold mb-2">
										No education added yet
									</h3>
									<p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
										Click &quot;Add Education&quot; to
										include your educational background,
										degrees, and academic achievements.
									</p>
									<Button onClick={openAddDialog}>
										<Plus className="h-4 w-4 mr-2" />
										Add Your First Education
									</Button>
								</CardContent>
							</Card>
						) : (
							educationList.map((education, index) => (
								<EducationCard
									key={education.id}
									education={education}
									index={index}
									totalCount={educationList.length}
									onEdit={openEditDialog}
									onDelete={handleDeleteEducation}
									onReorder={handleReorder}
								/>
							))
						)}
					</div>

					{/* Continue Button */}
					{educationList.length > 0 && (
						<div className="mt-6 pb-6">
							<Button onClick={handleContinue} className="w-full">
								Continue to Next Step
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Education Dialog */}
			<EducationDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSubmit={handleDialogSubmit}
				initialData={editingEducation}
				mode={editingEducation ? "edit" : "add"}
			/>
		</div>
	);
}
