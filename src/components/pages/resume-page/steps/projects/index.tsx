// components/pages/resume-page/steps/projects/index.tsx
"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { FolderGit2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/interfaces/resume";
import { Separator } from "@/components/ui/separator";
import { useResume } from "@/components/providers/resume-form-provider";
import { ProjectDialog } from "@/components/shared/dialogs/ProjectDialog";
import { ProjectCard } from "../../../../shared/resume-cards/ProjectCard";

export function ProjectsPage() {
	const { resumeData, dispatch, nextStep } = useResume();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingProject, setEditingProject] = useState<Project | undefined>(
		undefined
	);

	const projects = resumeData.projects.sort((a, b) => a.order - b.order);

	// Reset editing project when dialog closes
	useEffect(() => {
		if (!dialogOpen) {
			setEditingProject(undefined);
		}
	}, [dialogOpen]);

	const handleAddProject = (project: Project) => {
		const newProject = {
			...project,
			order: projects.length,
		};
		dispatch({ type: "ADD_PROJECT", payload: newProject });
	};

	const handleEditProject = (project: Project) => {
		dispatch({
			type: "UPDATE_PROJECT",
			payload: { id: project.id, data: project },
		});
	};

	const handleDeleteProject = (id: string) => {
		if (confirm("Are you sure you want to delete this project?")) {
			dispatch({ type: "REMOVE_PROJECT", payload: id });
		}
	};

	const handleReorder = (id: string, direction: "up" | "down") => {
		dispatch({ type: "REORDER_PROJECT", payload: { id, direction } });
	};

	const openAddDialog = () => {
		setEditingProject(undefined);
		setDialogOpen(true);
	};

	const openEditDialog = (project: Project) => {
		setEditingProject(project);
		setDialogOpen(true);
	};

	const handleDialogSubmit = (project: Project) => {
		if (editingProject) {
			handleEditProject(project);
		} else {
			handleAddProject(project);
		}
	};

	const handleContinue = () => {
		if (projects.length === 0) {
			if (
				!confirm("You haven't added any projects yet. Continue anyway?")
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
									<FolderGit2 className="h-6 w-6 text-primary" />
								</div>
								<div className="flex-1">
									<CardTitle className="text-xl">
										Projects & Initiatives
									</CardTitle>
									<CardDescription>
										Showcase your projects, campaigns, case studies, and
										key initiatives
									</CardDescription>
								</div>
								<Button onClick={openAddDialog} size="sm">
									<Plus className="h-4 w-4 mr-2" />
									Add Project
								</Button>
							</div>
						</CardHeader>
					</Card>
					<Separator />

					{/* Projects List */}
					<div className="space-y-4 mt-6">
						{projects.length === 0 ? (
							<Card>
								<CardContent className="flex flex-col items-center justify-center py-12">
									<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
										<FolderGit2 className="h-8 w-8 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-semibold mb-2">
										No projects added yet
									</h3>
									<p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
										Click &quot;Add Project&quot; to showcase your
										projects, campaigns, initiatives, or case studies.
									</p>
									<Button onClick={openAddDialog}>
										<Plus className="h-4 w-4 mr-2" />
										Add Your First Project
									</Button>
								</CardContent>
							</Card>
						) : (
							projects.map((project, index) => (
								<ProjectCard
									key={project.id}
									project={project}
									index={index}
									totalCount={projects.length}
									onEdit={openEditDialog}
									onDelete={handleDeleteProject}
									onReorder={handleReorder}
								/>
							))
						)}
					</div>

					{/* Continue Button */}
					{projects.length > 0 && (
						<div className="mt-6 pb-6">
							<Button onClick={handleContinue} className="w-full">
								Continue to Next Step
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Project Dialog */}
			<ProjectDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSubmit={handleDialogSubmit}
				initialData={editingProject}
				mode={editingProject ? "edit" : "add"}
			/>
		</div>
	);
}

