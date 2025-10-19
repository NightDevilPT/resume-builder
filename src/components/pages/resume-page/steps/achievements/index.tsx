// components/pages/resume-page/steps/achievements/index.tsx
"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Trophy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Achievement } from "@/interfaces/resume";
import { Separator } from "@/components/ui/separator";
import { useResume } from "@/components/providers/resume-form-provider";
import { AchievementDialog } from "@/components/shared/dialogs/AchievementDialog";
import { AchievementCard } from "../../../../shared/resume-cards/AchievementCard";

export function AchievementsPage() {
	const { resumeData, dispatch, nextStep } = useResume();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingAchievement, setEditingAchievement] = useState<
		Achievement | undefined
	>(undefined);

	const achievements = resumeData.achievements.sort(
		(a, b) => a.order - b.order
	);

	// Reset editing achievement when dialog closes
	useEffect(() => {
		if (!dialogOpen) {
			setEditingAchievement(undefined);
		}
	}, [dialogOpen]);

	const handleAddAchievement = (achievement: Achievement) => {
		const newAchievement = {
			...achievement,
			order: achievements.length,
		};
		dispatch({ type: "ADD_ACHIEVEMENT", payload: newAchievement });
	};

	const handleEditAchievement = (achievement: Achievement) => {
		dispatch({
			type: "UPDATE_ACHIEVEMENT",
			payload: { id: achievement.id, data: achievement },
		});
	};

	const handleDeleteAchievement = (id: string) => {
		if (confirm("Are you sure you want to delete this achievement?")) {
			dispatch({ type: "REMOVE_ACHIEVEMENT", payload: id });
		}
	};

	const handleReorder = (id: string, direction: "up" | "down") => {
		dispatch({ type: "REORDER_ACHIEVEMENT", payload: { id, direction } });
	};

	const openAddDialog = () => {
		setEditingAchievement(undefined);
		setDialogOpen(true);
	};

	const openEditDialog = (achievement: Achievement) => {
		setEditingAchievement(achievement);
		setDialogOpen(true);
	};

	const handleDialogSubmit = (achievement: Achievement) => {
		if (editingAchievement) {
			handleEditAchievement(achievement);
		} else {
			handleAddAchievement(achievement);
		}
	};

	const handleContinue = () => {
		if (achievements.length === 0) {
			if (
				!confirm(
					"You haven't added any achievements yet. Continue anyway?"
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
									<Trophy className="h-6 w-6 text-primary" />
								</div>
								<div className="flex-1">
									<CardTitle className="text-xl">
										Achievements & Awards
									</CardTitle>
									<CardDescription>
										Showcase your notable achievements, awards,
										and recognitions
									</CardDescription>
								</div>
								<Button onClick={openAddDialog} size="sm">
									<Plus className="h-4 w-4 mr-2" />
									Add Achievement
								</Button>
							</div>
						</CardHeader>
					</Card>
					<Separator />

					{/* Achievements List */}
					<div className="space-y-4 mt-6">
						{achievements.length === 0 ? (
							<Card>
								<CardContent className="flex flex-col items-center justify-center py-12">
									<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
										<Trophy className="h-8 w-8 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-semibold mb-2">
										No achievements added yet
									</h3>
									<p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
										Click &quot;Add Achievement&quot; to
										showcase your awards, recognitions, and
										accomplishments.
									</p>
									<Button onClick={openAddDialog}>
										<Plus className="h-4 w-4 mr-2" />
										Add Your First Achievement
									</Button>
								</CardContent>
							</Card>
						) : (
							achievements.map((achievement, index) => (
								<AchievementCard
									key={achievement.id}
									achievement={achievement}
									index={index}
									totalCount={achievements.length}
									onEdit={openEditDialog}
									onDelete={handleDeleteAchievement}
									onReorder={handleReorder}
								/>
							))
						)}
					</div>

					{/* Continue Button */}
					{achievements.length > 0 && (
						<div className="mt-6 pb-6">
							<Button onClick={handleContinue} className="w-full">
								Continue to Next Step
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Achievement Dialog */}
			<AchievementDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSubmit={handleDialogSubmit}
				initialData={editingAchievement}
				mode={editingAchievement ? "edit" : "add"}
			/>
		</div>
	);
}

