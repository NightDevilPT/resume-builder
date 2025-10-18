"use client";

import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Experience } from "@/interfaces/resume";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExperienceDialog } from "@/components/shared/dialogs";
import { ExperienceFormValues } from "@/lib/validations/experience";
import { ExperienceCard } from "@/components/shared/resume-cards";
import { useResume } from "@/components/providers/resume-form-provider";
import { areRequiredSectionsComplete } from "@/lib/utils/resume-helpers";

export function ExperienceForm() {
	const { resumeData, dispatch, nextStep, prevStep, goToStep } = useResume();
	const canReview = areRequiredSectionsComplete(resumeData);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingExperience, setEditingExperience] = useState<
		Experience | undefined
	>(undefined);

	const handleAdd = () => {
		setEditingExperience(undefined);
		setDialogOpen(true);
	};

	const handleEdit = (exp: Experience) => {
		setEditingExperience(exp);
		setDialogOpen(true);
	};

	const handleSave = (data: ExperienceFormValues) => {
		const experienceData: Experience = {
			id: editingExperience ? editingExperience.id : `exp-${Date.now()}`,
			jobTitle: data.jobTitle,
			company: data.company,
			location: data.location,
			startDate: new Date(data.startDate),
			endDate: data.endDate ? new Date(data.endDate) : undefined,
			currentlyWorking: data.currentlyWorking,
			description: data.description,
			achievements: data.achievements,
			skillsUsed: data.skillsUsed,
		};

		if (editingExperience) {
			dispatch({
				type: "UPDATE_EXPERIENCE",
				payload: {
					id: experienceData.id,
					data: experienceData,
				},
			});
		} else {
			dispatch({
				type: "ADD_EXPERIENCE",
				payload: experienceData,
			});
		}
	};

	const handleDelete = (id: string) => {
		dispatch({
			type: "REMOVE_EXPERIENCE",
			payload: id,
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-center items-center gap-3">
				<div className=" flex-1">
					<h3 className="text-xl font-semibold">Work Experience</h3>
					<p className="text-muted-foreground">
						Add your professional work history. Include your key
						achievements and skills used.
					</p>
				</div>
				{/* Add Button */}
				<Button onClick={handleAdd} className="w-full md:w-auto">
					<Plus className="h-4 w-4 mr-2" />
					Add Experience
				</Button>
			</div>

			{/* List of existing experiences */}
			{resumeData.experience.length > 0 && (
				<ScrollArea className="space-y-4 h-[calc(100vh-420px)]">
					<h4 className="text-sm font-medium text-muted-foreground">
						Added Experiences ({resumeData.experience.length})
					</h4>
					<div className="space-y-4 mt-2 pr-5">
						{resumeData.experience.map((exp) => (
							<ExperienceCard
								key={exp.id}
								experience={exp}
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
						))}
					</div>
				</ScrollArea>
			)}

			{resumeData.experience.length === 0 && (
				<div className="text-center py-12 border-2 border-dashed rounded-lg">
					<p className="text-muted-foreground mb-4">
						No experience added yet
					</p>
					<Button onClick={handleAdd} variant="outline">
						<Plus className="h-4 w-4 mr-2" />
						Add Your First Experience
					</Button>
				</div>
			)}

			{/* Experience Dialog */}
			<ExperienceDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				experience={editingExperience}
				onSave={handleSave}
			/>

			{/* Navigation Buttons */}
			<Separator />
			<div className="flex justify-between">
				<Button type="button" variant="outline" onClick={prevStep}>
					Back to Personal Info
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
					<Button
						type="button"
						onClick={nextStep}
						disabled={resumeData.experience.length === 0}
					>
						Continue to Education
					</Button>
				</div>
			</div>
		</div>
	);
}
