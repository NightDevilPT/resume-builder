"use client";

import { useState } from "react";
import { Plus, Eye, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Achievement } from "@/interfaces/resume";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { AchievementDialog } from "@/components/shared/dialogs";
import { AchievementFormValues } from "@/lib/validations/achievement";
import { AchievementCard } from "@/components/shared/resume-cards";
import { areRequiredSectionsComplete } from "@/lib/utils/resume-helpers";
import { useResume } from "@/components/providers/resume-form-provider";

export function AchievementsForm() {
	const { resumeData, dispatch, nextStep, prevStep, goToStep } = useResume();
	const canReview = areRequiredSectionsComplete(resumeData);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingAchievement, setEditingAchievement] = useState<
		Achievement | undefined
	>(undefined);

	const handleAdd = () => {
		setEditingAchievement(undefined);
		setDialogOpen(true);
	};

	const handleEdit = (achievement: Achievement) => {
		setEditingAchievement(achievement);
		setDialogOpen(true);
	};

	const handleSave = (data: AchievementFormValues) => {
		const achievementData: Achievement = {
			id: editingAchievement
				? editingAchievement.id
				: `ach-${Date.now()}`,
			title: data.title,
			issuer: data.issuer,
			date: new Date(data.date),
			description: data.description,
		};

		if (editingAchievement) {
			dispatch({
				type: "UPDATE_ACHIEVEMENT",
				payload: {
					id: achievementData.id,
					data: achievementData,
				},
			});
		} else {
			dispatch({
				type: "ADD_ACHIEVEMENT",
				payload: achievementData,
			});
		}
	};

	const handleDelete = (id: string) => {
		dispatch({
			type: "REMOVE_ACHIEVEMENT",
			payload: id,
		});
	};

	const handleSkip = () => {
		nextStep();
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-center items-center gap-3">
				<div className="flex-1">
					<h3 className="text-xl font-semibold">
						Achievements & Awards
					</h3>
					<p className="text-muted-foreground">
						Highlight your professional achievements, awards, and
						recognitions.
					</p>
				</div>

				<Button onClick={handleAdd} className="w-full md:w-auto">
					<Plus className="h-4 w-4 mr-2" />
					Add Achievement
				</Button>
			</div>

			{/* Info Banner */}
			<Card className="bg-accent/50 border-accent p-0 py-2">
				<CardContent className="px-4">
					<p className="text-sm text-muted-foreground flex items-start gap-2">
						<Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
						<span>
							<strong>Optional Section:</strong> Include awards,
							recognitions, honors, or significant accomplishments
							in your professional or academic career.
						</span>
					</p>
				</CardContent>
			</Card>

			{/* List of existing achievements */}
			{resumeData.achievements.length > 0 && (
				<ScrollArea className="space-y-4 h-[calc(100vh-520px)] pr-5">
					<h4 className="text-sm font-medium text-muted-foreground">
						Added Achievements ({resumeData.achievements.length})
					</h4>
					<div className="space-y-4 mt-2">
						{resumeData.achievements.map((achievement) => (
							<AchievementCard
								key={achievement.id}
								achievement={achievement}
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
						))}
					</div>
				</ScrollArea>
			)}

			{resumeData.achievements.length === 0 && (
				<div className="text-center py-12 border-2 border-dashed rounded-lg">
					<p className="text-muted-foreground mb-4">
						No achievements added yet
					</p>
					<Button onClick={handleAdd} variant="outline">
						<Plus className="h-4 w-4 mr-2" />
						Add Your First Achievement
					</Button>
				</div>
			)}

			{/* Achievement Dialog */}
			<AchievementDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				achievement={editingAchievement}
				onSave={handleSave}
			/>

			{/* Navigation Buttons */}
			<Separator />
			<div className="flex justify-between pt-6">
				<Button type="button" variant="outline" onClick={prevStep}>
					Back to Certifications
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
					{resumeData.achievements.length === 0 ? (
						<Button type="button" onClick={handleSkip}>
							Skip to Review
						</Button>
					) : (
						<Button type="button" onClick={nextStep}>
							Continue to Review
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
