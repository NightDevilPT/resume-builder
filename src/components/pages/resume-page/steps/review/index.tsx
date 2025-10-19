// components/pages/resume-page/steps/review/index.tsx
"use client";

import {
	CheckCircle2,
	Lightbulb,
	User,
	Briefcase,
	GraduationCap,
	Code,
	FolderGit2,
	Award,
	Trophy,
	Download,
	Edit,
	Star,
} from "lucide-react";
import type {
	Experience,
	Education,
	Project,
	Certification,
	Achievement,
} from "@/interfaces/resume";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProjectDialog } from "@/components/shared/dialogs/ProjectDialog";
import { useResume } from "@/components/providers/resume-form-provider";
import { ProjectCard } from "@/components/shared/resume-cards/ProjectCard";
import { EducationDialog } from "@/components/shared/dialogs/EducationDialog";
import { ExperienceDialog } from "@/components/shared/dialogs/ExperienceDialog";
import { EducationCard } from "@/components/shared/resume-cards/EducationCard";
import { CertificationDialog } from "@/components/shared/dialogs/CertificationDialog";
import { AchievementDialog } from "@/components/shared/dialogs/AchievementDialog";
import { ExperienceCard } from "@/components/shared/resume-cards/ExperienceCard";
import { CertificationCard } from "@/components/shared/resume-cards/CertificationCard";
import { AchievementCard } from "@/components/shared/resume-cards/AchievementCard";

export function ReviewPage() {
	const { resumeData, goToStep, dispatch } = useResume();
	const [isExporting, setIsExporting] = useState(false);

	// Dialog states
	const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
	const [editingExperience, setEditingExperience] = useState<
		Experience | undefined
	>();

	const [educationDialogOpen, setEducationDialogOpen] = useState(false);
	const [editingEducation, setEditingEducation] = useState<
		Education | undefined
	>();

	const [projectDialogOpen, setProjectDialogOpen] = useState(false);
	const [editingProject, setEditingProject] = useState<Project | undefined>();

	const [certificationDialogOpen, setCertificationDialogOpen] =
		useState(false);
	const [editingCertification, setEditingCertification] = useState<
		Certification | undefined
	>();

	const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
	const [editingAchievement, setEditingAchievement] = useState<
		Achievement | undefined
	>();

	const handleExport = () => {
		setIsExporting(true);
		// TODO: Implement PDF export functionality
		setTimeout(() => {
			alert("Export functionality will be implemented soon!");
			setIsExporting(false);
		}, 1000);
	};

	// Experience handlers
	const handleEditExperience = (experience: Experience) => {
		setEditingExperience(experience);
		setExperienceDialogOpen(true);
	};

	const handleUpdateExperience = (experience: Experience) => {
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

	const handleReorderExperience = (id: string, direction: "up" | "down") => {
		dispatch({ type: "REORDER_EXPERIENCE", payload: { id, direction } });
	};

	// Education handlers
	const handleEditEducation = (education: Education) => {
		setEditingEducation(education);
		setEducationDialogOpen(true);
	};

	const handleUpdateEducation = (education: Education) => {
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

	const handleReorderEducation = (id: string, direction: "up" | "down") => {
		dispatch({ type: "REORDER_EDUCATION", payload: { id, direction } });
	};

	// Project handlers
	const handleEditProject = (project: Project) => {
		setEditingProject(project);
		setProjectDialogOpen(true);
	};

	const handleUpdateProject = (project: Project) => {
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

	const handleReorderProject = (id: string, direction: "up" | "down") => {
		dispatch({ type: "REORDER_PROJECT", payload: { id, direction } });
	};

	// Certification handlers
	const handleEditCertification = (certification: Certification) => {
		setEditingCertification(certification);
		setCertificationDialogOpen(true);
	};

	const handleUpdateCertification = (certification: Certification) => {
		dispatch({
			type: "UPDATE_CERTIFICATION",
			payload: { id: certification.id, data: certification },
		});
	};

	const handleDeleteCertification = (id: string) => {
		if (confirm("Are you sure you want to delete this certification?")) {
			dispatch({ type: "REMOVE_CERTIFICATION", payload: id });
		}
	};

	const handleReorderCertification = (
		id: string,
		direction: "up" | "down"
	) => {
		dispatch({ type: "REORDER_CERTIFICATION", payload: { id, direction } });
	};

	// Achievement handlers
	const handleEditAchievement = (achievement: Achievement) => {
		setEditingAchievement(achievement);
		setAchievementDialogOpen(true);
	};

	const handleUpdateAchievement = (achievement: Achievement) => {
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

	const handleReorderAchievement = (id: string, direction: "up" | "down") => {
		dispatch({ type: "REORDER_ACHIEVEMENT", payload: { id, direction } });
	};

	// Count total items
	const totalItems =
		resumeData.experience.length +
		resumeData.education.length +
		resumeData.projects.length +
		resumeData.certifications.length +
		resumeData.achievements.length +
		resumeData.skills.technical.length +
		resumeData.skills.soft.length +
		resumeData.skills.languages.length;

	return (
		<div className="w-full h-full flex flex-col">
			<div className="flex-1 px-4 pb-6">
				<div className="max-w-4xl mx-auto">
					{/* Header Card */}
					<Card className="p-0 border-none shadow-none">
						<CardHeader className="px-0">
							<div className="flex items-start gap-4">
								<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
									<Lightbulb className="h-6 w-6 text-primary" />
								</div>
								<div className="flex-1">
									<CardTitle className="text-xl">
										Review Your Resume
									</CardTitle>
									<CardDescription>
										Review all sections before exporting
										your resume
									</CardDescription>
								</div>
							</div>
						</CardHeader>
					</Card>
					<Separator />

					{/* Summary Stats */}
					<Card className="mt-6">
						<CardContent className="pt-6">
							<div className="flex items-center gap-2 mb-4">
								<CheckCircle2 className="h-5 w-5 text-green-500" />
								<h3 className="font-semibold">
									Resume Complete - {totalItems} Items Added
								</h3>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
								<div className="flex items-center gap-2">
									<Briefcase className="h-4 w-4 text-muted-foreground" />
									<span>
										{resumeData.experience.length}{" "}
										Experience
									</span>
								</div>
								<div className="flex items-center gap-2">
									<GraduationCap className="h-4 w-4 text-muted-foreground" />
									<span>
										{resumeData.education.length} Education
									</span>
								</div>
								<div className="flex items-center gap-2">
									<FolderGit2 className="h-4 w-4 text-muted-foreground" />
									<span>
										{resumeData.projects.length} Projects
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Award className="h-4 w-4 text-muted-foreground" />
									<span>
										{resumeData.certifications.length}{" "}
										Certifications
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Personal Information */}
					<div className="mt-8">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<User className="h-5 w-5 text-primary" />
								<h2 className="text-lg font-semibold">
									Personal Information
								</h2>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => goToStep(1)}
							>
								<Edit className="h-4 w-4 mr-2" />
								Edit
							</Button>
						</div>
						<Card>
							<CardContent className="pt-6 space-y-3">
								<div>
									<p className="text-sm font-semibold">
										{resumeData.personalInfo.fullName}
									</p>
									<p className="text-sm text-muted-foreground">
										{resumeData.personalInfo.email} •{" "}
										{resumeData.personalInfo.phone}
									</p>
									<p className="text-sm text-muted-foreground">
										{resumeData.personalInfo.location}
									</p>
								</div>
								{resumeData.personalInfo.summary && (
									<div>
										<p className="text-xs font-semibold text-muted-foreground mb-1">
											Summary
										</p>
										<p className="text-sm">
											{resumeData.personalInfo.summary}
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Experience Section */}
					{resumeData.experience.length > 0 && (
						<div className="mt-8">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<Briefcase className="h-5 w-5 text-primary" />
									<h2 className="text-lg font-semibold">
										Work Experience
									</h2>
									<Badge variant="secondary">
										{resumeData.experience.length}
									</Badge>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => goToStep(2)}
								>
									<Edit className="h-4 w-4 mr-2" />
									Edit
								</Button>
							</div>
							<div className="space-y-4">
								{resumeData.experience
									.sort((a, b) => a.order - b.order)
									.map((exp, index) => (
										<ExperienceCard
											key={exp.id}
											experience={exp}
											index={index}
											totalCount={
												resumeData.experience.length
											}
											onEdit={handleEditExperience}
											onDelete={handleDeleteExperience}
											onReorder={handleReorderExperience}
										/>
									))}
							</div>
						</div>
					)}

					{/* Education Section */}
					{resumeData.education.length > 0 && (
						<div className="mt-8">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<GraduationCap className="h-5 w-5 text-primary" />
									<h2 className="text-lg font-semibold">
										Education
									</h2>
									<Badge variant="secondary">
										{resumeData.education.length}
									</Badge>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => goToStep(3)}
								>
									<Edit className="h-4 w-4 mr-2" />
									Edit
								</Button>
							</div>
							<div className="space-y-4">
								{resumeData.education
									.sort((a, b) => a.order - b.order)
									.map((edu, index) => (
										<EducationCard
											key={edu.id}
											education={edu}
											index={index}
											totalCount={
												resumeData.education.length
											}
											onEdit={handleEditEducation}
											onDelete={handleDeleteEducation}
											onReorder={handleReorderEducation}
										/>
									))}
							</div>
						</div>
					)}

					{/* Skills Section */}
					<div className="mt-8">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<Code className="h-5 w-5 text-primary" />
								<h2 className="text-lg font-semibold">
									Skills & Languages
								</h2>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => goToStep(4)}
							>
								<Edit className="h-4 w-4 mr-2" />
								Edit
							</Button>
						</div>
						<Card>
							<CardContent className="pt-6 space-y-4">
								{resumeData.skills.technical.length > 0 && (
									<div>
										<h4 className="text-sm font-semibold mb-3">
											Technical Skills
										</h4>
										<div className="space-y-2">
											{resumeData.skills.technical.map(
												(skill, idx) => (
													<div
														key={idx}
														className="flex items-center gap-3 p-2 border rounded-md bg-background"
													>
														<span className="flex-1 text-sm font-medium">
															{skill.name}
														</span>
														<div className="flex items-center gap-2">
															<div className="flex gap-0.5">
																{Array.from({
																	length: 10,
																}).map(
																	(_, i) => (
																		<Star
																			key={
																				i
																			}
																			className={`h-3 w-3 ${
																				i <
																				skill.level
																					? "fill-primary text-primary"
																					: "text-muted-foreground/30"
																			}`}
																		/>
																	)
																)}
															</div>
															<span className="text-xs font-semibold text-muted-foreground min-w-[30px]">
																{skill.level}/10
															</span>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								)}

								{resumeData.skills.soft.length > 0 && (
									<div>
										<h4 className="text-sm font-semibold mb-3">
											Soft Skills
										</h4>
										<div className="space-y-2">
											{resumeData.skills.soft.map(
												(skill, idx) => (
													<div
														key={idx}
														className="flex items-center gap-3 p-2 border rounded-md bg-background"
													>
														<span className="flex-1 text-sm font-medium">
															{skill.name}
														</span>
														<div className="flex items-center gap-2">
															<div className="flex gap-0.5">
																{Array.from({
																	length: 10,
																}).map(
																	(_, i) => (
																		<Star
																			key={
																				i
																			}
																			className={`h-3 w-3 ${
																				i <
																				skill.level
																					? "fill-primary text-primary"
																					: "text-muted-foreground/30"
																			}`}
																		/>
																	)
																)}
															</div>
															<span className="text-xs font-semibold text-muted-foreground min-w-[30px]">
																{skill.level}/10
															</span>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								)}

								{resumeData.skills.languages.length > 0 && (
									<div>
										<h4 className="text-sm font-semibold mb-2">
											Languages
										</h4>
										<div className="space-y-2">
											{resumeData.skills.languages.map(
												(lang, idx) => (
													<div
														key={idx}
														className="flex items-center justify-between text-sm"
													>
														<span>
															{lang.language}
														</span>
														<Badge variant="outline">
															{lang.proficiency}
														</Badge>
													</div>
												)
											)}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Projects Section */}
					{resumeData.projects.length > 0 && (
						<div className="mt-8">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<FolderGit2 className="h-5 w-5 text-primary" />
									<h2 className="text-lg font-semibold">
										Projects & Initiatives
									</h2>
									<Badge variant="secondary">
										{resumeData.projects.length}
									</Badge>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => goToStep(5)}
								>
									<Edit className="h-4 w-4 mr-2" />
									Edit
								</Button>
							</div>
							<div className="space-y-4">
								{resumeData.projects
									.sort((a, b) => a.order - b.order)
									.map((project, index) => (
										<ProjectCard
											key={project.id}
											project={project}
											index={index}
											totalCount={
												resumeData.projects.length
											}
											onEdit={handleEditProject}
											onDelete={handleDeleteProject}
											onReorder={handleReorderProject}
										/>
									))}
							</div>
						</div>
					)}

					{/* Certifications Section */}
					{resumeData.certifications.length > 0 && (
						<div className="mt-8">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<Award className="h-5 w-5 text-primary" />
									<h2 className="text-lg font-semibold">
										Certifications & Licenses
									</h2>
									<Badge variant="secondary">
										{resumeData.certifications.length}
									</Badge>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => goToStep(6)}
								>
									<Edit className="h-4 w-4 mr-2" />
									Edit
								</Button>
							</div>
							<div className="space-y-4">
								{resumeData.certifications
									.sort((a, b) => a.order - b.order)
									.map((cert, index) => (
										<CertificationCard
											key={cert.id}
											certification={cert}
											index={index}
											totalCount={
												resumeData.certifications.length
											}
											onEdit={handleEditCertification}
											onDelete={handleDeleteCertification}
											onReorder={
												handleReorderCertification
											}
										/>
									))}
							</div>
						</div>
					)}

					{/* Achievements Section */}
					{resumeData.achievements.length > 0 && (
						<div className="mt-8">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<Trophy className="h-5 w-5 text-primary" />
									<h2 className="text-lg font-semibold">
										Achievements & Awards
									</h2>
									<Badge variant="secondary">
										{resumeData.achievements.length}
									</Badge>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => goToStep(7)}
								>
									<Edit className="h-4 w-4 mr-2" />
									Edit
								</Button>
							</div>
							<div className="space-y-4">
								{resumeData.achievements
									.sort((a, b) => a.order - b.order)
									.map((achievement, index) => (
										<AchievementCard
											key={achievement.id}
											achievement={achievement}
											index={index}
											totalCount={
												resumeData.achievements.length
											}
											onEdit={handleEditAchievement}
											onDelete={handleDeleteAchievement}
											onReorder={handleReorderAchievement}
										/>
									))}
							</div>
						</div>
					)}

					{/* Export Actions */}
					<div className="mt-8 space-y-4">
						<Card className="border-primary/50 bg-primary/5">
							<CardContent className="pt-6">
								<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
									<div>
										<h3 className="font-semibold mb-1">
											Ready to Export?
										</h3>
										<p className="text-sm text-muted-foreground">
											Your resume is complete and ready to
											download
										</p>
									</div>
									<Button
										size="lg"
										onClick={handleExport}
										disabled={isExporting}
										className="w-full md:w-auto"
									>
										<Download className="h-4 w-4 mr-2" />
										{isExporting
											? "Exporting..."
											: "Export as PDF"}
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Dialogs */}
			<ExperienceDialog
				open={experienceDialogOpen}
				onOpenChange={setExperienceDialogOpen}
				onSubmit={handleUpdateExperience}
				initialData={editingExperience}
				mode="edit"
			/>

			<EducationDialog
				open={educationDialogOpen}
				onOpenChange={setEducationDialogOpen}
				onSubmit={handleUpdateEducation}
				initialData={editingEducation}
				mode="edit"
			/>

			<ProjectDialog
				open={projectDialogOpen}
				onOpenChange={setProjectDialogOpen}
				onSubmit={handleUpdateProject}
				initialData={editingProject}
				mode="edit"
			/>

			<CertificationDialog
				open={certificationDialogOpen}
				onOpenChange={setCertificationDialogOpen}
				onSubmit={handleUpdateCertification}
				initialData={editingCertification}
				mode="edit"
			/>

			<AchievementDialog
				open={achievementDialogOpen}
				onOpenChange={setAchievementDialogOpen}
				onSubmit={handleUpdateAchievement}
				initialData={editingAchievement}
				mode="edit"
			/>
		</div>
	);
}
