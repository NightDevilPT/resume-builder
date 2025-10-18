"use client";

import { useState } from "react";
import { Plus, Eye, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Education } from "@/interfaces/resume";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { EducationDialog } from "@/components/shared/dialogs";
import { EducationFormValues } from "@/lib/validations/education";
import { EducationCard } from "@/components/shared/resume-cards";
import { areRequiredSectionsComplete } from "@/lib/utils/resume-helpers";
import { useResume } from "@/components/providers/resume-form-provider";

export function EducationForm() {
	const { resumeData, dispatch, nextStep, prevStep, goToStep } = useResume();
	const canReview = areRequiredSectionsComplete(resumeData);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingEducation, setEditingEducation] = useState<
		Education | undefined
	>(undefined);

	const handleAdd = () => {
		setEditingEducation(undefined);
		setDialogOpen(true);
	};

	const handleEdit = (edu: Education) => {
		setEditingEducation(edu);
		setDialogOpen(true);
	};

	const handleSave = (data: EducationFormValues) => {
		const educationData: Education = {
			id: editingEducation ? editingEducation.id : `edu-${Date.now()}`,
			degree: data.degree,
			institution: data.institution,
			location: data.location,
			startDate: new Date(data.startDate),
			endDate: data.endDate ? new Date(data.endDate) : undefined,
			currentlyStudying: data.currentlyStudying,
			gradeType: data.gradeType,
			gradeValue: data.gradeValue || "",
			achievements: data.achievements,
			coursework: data.coursework,
		};

		if (editingEducation) {
			dispatch({
				type: "UPDATE_EDUCATION",
				payload: {
					id: educationData.id,
					data: educationData,
				},
			});
		} else {
			dispatch({
				type: "ADD_EDUCATION",
				payload: educationData,
			});
		}
	};

	const handleDelete = (id: string) => {
		dispatch({
			type: "REMOVE_EDUCATION",
			payload: id,
		});
	};

	return (
		<div className="space-y-5">
			<div className="flex justify-center items-center gap-3">
				<div className=" flex-1">
					<h3 className="text-xl font-semibold">Education</h3>
					<p className="text-muted-foreground">
						Add your educational background and academic
						achievements.
					</p>
				</div>
				{/* Add Button */}
				<Button onClick={handleAdd} className="w-full md:w-auto">
					<Plus className="h-4 w-4 mr-2" />
					Add Education
				</Button>
			</div>

			{/* Info Banner */}
			<Card className="bg-accent/50 p-3 border-accent">
				<CardContent className="px-3">
					<p className="text-sm text-muted-foreground flex items-start gap-2">
						<Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
						<span>
							<strong>Optional Section:</strong> Education is
							optional. If you prefer to skip it, you can continue
							to the next section.
						</span>
					</p>
				</CardContent>
			</Card>

			{/* List of existing education */}
			{resumeData.education.length > 0 && (
				<ScrollArea className="space-y-4 h-[calc(100vh-450px)]">
					<h4 className="text-sm font-medium text-muted-foreground">
						Added Education ({resumeData.education.length})
					</h4>
					<div className="space-y-4 mt-4 pr-5">
						{resumeData.education.map((edu) => (
							<EducationCard
								key={edu.id}
								education={edu}
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
						))}
					</div>
				</ScrollArea>
			)}

			{resumeData.education.length === 0 && (
				<div className="text-center py-12 border-2 border-dashed rounded-lg">
					<p className="text-muted-foreground mb-4">
						No education added yet
					</p>
					<Button onClick={handleAdd} variant="outline">
						<Plus className="h-4 w-4 mr-2" />
						Add Your Education
					</Button>
				</div>
			)}

			{/* Education Dialog */}
			<EducationDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				education={editingEducation}
				onSave={handleSave}
			/>

			<div className="flex justify-between">
				<Button type="button" variant="outline" onClick={prevStep}>
					Back to Experience
				</Button>

				<div className="flex gap-2">
					{canReview && (
						<Button
							type="button"
							variant="outline"
							onClick={() => goToStep(8)}
						>
							<Eye className="h-4 w-4 mr-2" />
							Quick Review
						</Button>
					)}
					{resumeData.education.length === 0 ? (
						<Button type="button" onClick={nextStep}>
							Skip to Skills
						</Button>
					) : (
						<Button type="button" onClick={nextStep}>
							Continue to Skills
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
