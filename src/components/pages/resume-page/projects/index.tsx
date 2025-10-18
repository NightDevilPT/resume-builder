"use client";

import { useState } from "react";
import { Plus, Eye, Info } from "lucide-react";
import { Project } from "@/interfaces/resume";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectDialog } from "@/components/shared/dialogs";
import { ProjectFormValues } from "@/lib/validations/project";
import { ProjectCard } from "@/components/shared/resume-cards";
import { areRequiredSectionsComplete } from "@/lib/utils/resume-helpers";
import { useResume } from "@/components/providers/resume-form-provider";

export function ProjectsForm() {
	const { resumeData, dispatch, nextStep, prevStep, goToStep } = useResume();
	const canReview = areRequiredSectionsComplete(resumeData);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingProject, setEditingProject] = useState<Project | undefined>(
		undefined
	);

	const handleAdd = () => {
		setEditingProject(undefined);
		setDialogOpen(true);
	};

	const handleEdit = (project: Project) => {
		setEditingProject(project);
		setDialogOpen(true);
	};

	const handleSave = (data: ProjectFormValues) => {
		const projectData: Project = {
			id: editingProject ? editingProject.id : `proj-${Date.now()}`,
			name: data.name,
			description: data.description,
			technologies: data.technologies,
			projectUrl: data.projectUrl || "",
			githubUrl: data.githubUrl || "",
			startDate: new Date(data.startDate),
			endDate: data.endDate ? new Date(data.endDate) : undefined,
			currentlyWorking: data.currentlyWorking,
			highlights: data.highlights,
		};

		if (editingProject) {
			dispatch({
				type: "UPDATE_PROJECT",
				payload: {
					id: projectData.id,
					data: projectData,
				},
			});
		} else {
			dispatch({
				type: "ADD_PROJECT",
				payload: projectData,
			});
		}
	};

	const handleDelete = (id: string) => {
		dispatch({
			type: "REMOVE_PROJECT",
			payload: id,
		});
	};

	const handleSkip = () => {
		nextStep();
	};

	return (
		<div className="space-y-6">
			<div className={`flex justify-center items-center gap-3`}>
				<div className="flex-1">
					<h3 className="text-xl font-semibold">Projects</h3>
					<p className="text-muted-foreground">
						Showcase your work, portfolio pieces, or significant
						initiatives.
					</p>
				</div>

				{/* Add Button */}
				<Button onClick={handleAdd} className="w-full md:w-auto">
					<Plus className="h-4 w-4 mr-2" />
					Add Project
				</Button>
			</div>

			{/* Info Banner */}
			<Card className="bg-accent/50 border-accent p-0 py-2">
				<CardContent className="px-4">
					<p className="text-sm text-muted-foreground flex items-start gap-2">
						<Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
						<span>
							<strong>Flexible for All Professions:</strong>{" "}
							&quot;Projects&quot; can mean different things -
							software apps, design portfolios, case studies,
							campaigns, research papers, etc.
						</span>
					</p>
				</CardContent>
			</Card>

			{/* List of existing projects */}
			{resumeData.projects.length > 0 && (
				<ScrollArea className="space-y-4 h-[calc(100vh-480px)] pr-5">
					<h4 className="text-sm font-medium text-muted-foreground">
						Added Projects ({resumeData.projects.length})
					</h4>
					<div className="space-y-4 mt-2">
						{resumeData.projects.map((project) => (
							<ProjectCard
								key={project.id}
								project={project}
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
						))}
					</div>
				</ScrollArea>
			)}

			{resumeData.projects.length === 0 && (
				<div className="text-center py-12 border-2 border-dashed rounded-lg">
					<p className="text-muted-foreground mb-4">
						No projects added yet
					</p>
					<Button onClick={handleAdd} variant="outline">
						<Plus className="h-4 w-4 mr-2" />
						Add Your First Project
					</Button>
				</div>
			)}

			{/* Project Dialog */}
			<ProjectDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				project={editingProject}
				onSave={handleSave}
			/>

			<div className="flex justify-between">
				<Button type="button" variant="outline" onClick={prevStep}>
					Back to Skills
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
					{resumeData.projects.length === 0 ? (
						<Button type="button" onClick={handleSkip}>
							Skip to Certifications
						</Button>
					) : (
						<Button type="button" onClick={nextStep}>
							Continue to Certifications
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
