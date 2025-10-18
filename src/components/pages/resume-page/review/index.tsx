"use client";

import {
	User,
	Briefcase,
	GraduationCap,
	Code2,
	FolderKanban,
	Award,
	Trophy,
	MapPin,
	Mail,
	Phone,
	Globe,
	Edit,
	ExternalLink,
	Lightbulb,
	Languages,
	Download,
	Eye,
	FileText,
} from "lucide-react";
import {
	Experience,
	Education,
	Project,
	Certification,
	Achievement,
} from "@/interfaces/resume";
import {
	ExperienceDialog,
	EducationDialog,
	ProjectDialog,
	CertificationDialog,
	AchievementDialog,
} from "@/components/shared/dialogs";
import {
	ExperienceCard,
	EducationCard,
	ProjectCard,
	CertificationCard,
	AchievementCard,
} from "@/components/shared/resume-cards";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectFormValues } from "@/lib/validations/project";
import { EducationFormValues } from "@/lib/validations/education";
import { ExperienceFormValues } from "@/lib/validations/experience";
import { AchievementFormValues } from "@/lib/validations/achievement";
import { CertificationFormValues } from "@/lib/validations/certification";
import { useResume } from "@/components/providers/resume-form-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReviewStep() {
	const { resumeData, prevStep, goToStep, dispatch } = useResume();

	// Dialog states
	const [experienceDialog, setExperienceDialog] = useState(false);
	const [editingExperience, setEditingExperience] = useState<
		Experience | undefined
	>();
	const [educationDialog, setEducationDialog] = useState(false);
	const [editingEducation, setEditingEducation] = useState<
		Education | undefined
	>();
	const [projectDialog, setProjectDialog] = useState(false);
	const [editingProject, setEditingProject] = useState<Project | undefined>();
	const [certificationDialog, setCertificationDialog] = useState(false);
	const [editingCertification, setEditingCertification] = useState<
		Certification | undefined
	>();
	const [achievementDialog, setAchievementDialog] = useState(false);
	const [editingAchievement, setEditingAchievement] = useState<
		Achievement | undefined
	>();

	// Handle final submission
	const handleComplete = () => {
		// TODO: Implement resume generation/download logic
		console.log("Final Resume Data:", resumeData);
		alert(
			"Resume data is ready! (Download functionality to be implemented)"
		);
	};

	// Edit handlers for inline editing
	const handleEditExperience = (exp: Experience) => {
		setEditingExperience(exp);
		setExperienceDialog(true);
	};

	const handleEditEducation = (edu: Education) => {
		setEditingEducation(edu);
		setEducationDialog(true);
	};

	const handleEditProject = (project: Project) => {
		setEditingProject(project);
		setProjectDialog(true);
	};

	const handleEditCertification = (cert: Certification) => {
		setEditingCertification(cert);
		setCertificationDialog(true);
	};

	const handleEditAchievement = (achievement: Achievement) => {
		setEditingAchievement(achievement);
		setAchievementDialog(true);
	};

	// Save handlers
	const handleSaveExperience = (data: ExperienceFormValues) => {
		const experienceData: Experience = {
			id: editingExperience!.id,
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
		dispatch({
			type: "UPDATE_EXPERIENCE",
			payload: { id: experienceData.id, data: experienceData },
		});
	};

	const handleSaveEducation = (data: EducationFormValues) => {
		const educationData: Education = {
			id: editingEducation!.id,
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
		dispatch({
			type: "UPDATE_EDUCATION",
			payload: { id: educationData.id, data: educationData },
		});
	};

	const handleSaveProject = (data: ProjectFormValues) => {
		const projectData: Project = {
			id: editingProject!.id,
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
		dispatch({
			type: "UPDATE_PROJECT",
			payload: { id: projectData.id, data: projectData },
		});
	};

	const handleSaveCertification = (data: CertificationFormValues) => {
		const certificationData: Certification = {
			id: editingCertification!.id,
			name: data.name,
			issuingOrganization: data.issuingOrganization,
			issueDate: new Date(data.issueDate),
			expirationDate: data.expirationDate
				? new Date(data.expirationDate)
				: undefined,
			doesNotExpire: data.doesNotExpire,
			credentialUrl: data.credentialUrl || "",
		};
		dispatch({
			type: "UPDATE_CERTIFICATION",
			payload: { id: certificationData.id, data: certificationData },
		});
	};

	const handleSaveAchievement = (data: AchievementFormValues) => {
		const achievementData: Achievement = {
			id: editingAchievement!.id,
			title: data.title,
			issuer: data.issuer,
			date: new Date(data.date),
			description: data.description,
		};
		dispatch({
			type: "UPDATE_ACHIEVEMENT",
			payload: { id: achievementData.id, data: achievementData },
		});
	};

	// Delete handlers for each section
	const handleDeleteExperience = (id: string) => {
		dispatch({ type: "REMOVE_EXPERIENCE", payload: id });
	};

	const handleDeleteEducation = (id: string) => {
		dispatch({ type: "REMOVE_EDUCATION", payload: id });
	};

	const handleDeleteProject = (id: string) => {
		dispatch({ type: "REMOVE_PROJECT", payload: id });
	};

	const handleDeleteCertification = (id: string) => {
		dispatch({ type: "REMOVE_CERTIFICATION", payload: id });
	};

	const handleDeleteAchievement = (id: string) => {
		dispatch({ type: "REMOVE_ACHIEVEMENT", payload: id });
	};

	// Calculate completion percentage
	const totalSections = 9;
	const completedSections = [
		resumeData.name ? 1 : 0,
		resumeData.personalInfo.fullName ? 1 : 0,
		resumeData.experience.length > 0 ? 1 : 0,
		resumeData.education.length > 0 ? 1 : 0,
		resumeData.skills.technical.length > 0 ? 1 : 0,
		resumeData.projects.length > 0 ? 1 : 0,
		resumeData.certifications.length > 0 ? 1 : 0,
		resumeData.achievements.length > 0 ? 1 : 0,
		1, // Review itself
	].reduce((a, b) => a + b, 0);

	const completionPercentage = Math.round(
		(completedSections / totalSections) * 100
	);

	return (
		<div className="space-y-6">
			{/* Header with Stats */}
			<div className="space-y-4">
				<div className="flex items-start justify-between">
					<div>
						<h3 className="text-2xl font-bold flex items-center gap-2">
							<Eye className="h-6 w-6 text-primary" />
							Review Your Resume
						</h3>
						<p className="text-muted-foreground mt-1">
							Review all sections and make final edits before
							downloading
						</p>
					</div>
					<div className="text-right">
						<div className="text-3xl font-bold text-primary">
							{completionPercentage}%
						</div>
						<div className="text-xs text-muted-foreground">
							Complete
						</div>
					</div>
				</div>

				{/* Progress Bar */}
				<div className="w-full bg-secondary rounded-full h-2">
					<div
						className="bg-primary rounded-full h-2 transition-all duration-500"
						style={{ width: `${completionPercentage}%` }}
					/>
				</div>
			</div>

			{/* Scrollable Content */}
			<ScrollArea className="space-y-6 h-[calc(100vh-430px)] pr-5">
				{/* Resume Details Section */}
				<div className="space-y-3">
					<h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
						<FileText className="h-4 w-4" />
						Resume Details
					</h4>
					<Card className="hover:shadow-md transition-shadow">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm font-medium">
									Basic Information
								</CardTitle>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => goToStep(0)}
									className="h-8"
								>
									<Edit className="h-3 w-3 mr-1" />
									Edit
								</Button>
							</div>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="space-y-2">
								<div className="flex justify-between items-start">
									<span className="text-sm text-muted-foreground">
										Resume Name:
									</span>
									<span className="text-sm font-medium text-right max-w-[70%]">
										{resumeData.name || "N/A"}
									</span>
								</div>
								<div className="flex justify-between items-start">
									<span className="text-sm text-muted-foreground">
										Description:
									</span>
									<span className="text-sm font-medium text-right max-w-[70%]">
										{resumeData.description || "N/A"}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Personal Information Section */}
				<div className="space-y-3 mt-5">
					<h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
						<User className="h-4 w-4" />
						Personal Information
					</h4>
					<Card className="hover:shadow-md transition-shadow">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm font-medium">
									Contact & Summary
								</CardTitle>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => goToStep(1)}
									className="h-8"
								>
									<Edit className="h-3 w-3 mr-1" />
									Edit
								</Button>
							</div>
						</CardHeader>
						<CardContent className="pt-0 space-y-3">
							<div className="text-lg font-semibold">
								{resumeData.personalInfo.fullName}
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
								<div className="flex items-center gap-2">
									<Mail className="h-3 w-3" />
									{resumeData.personalInfo.email}
								</div>
								<div className="flex items-center gap-2">
									<Phone className="h-3 w-3" />
									{resumeData.personalInfo.phone}
								</div>
								<div className="flex items-center gap-2">
									<MapPin className="h-3 w-3" />
									{resumeData.personalInfo.location}
								</div>
							</div>
							{(resumeData.personalInfo.website ||
								resumeData.personalInfo.links.length > 0) && (
								<div className="flex flex-wrap gap-2 pt-1">
									{resumeData.personalInfo.website && (
										<Badge
											variant="outline"
											className="gap-1"
										>
											<Globe className="h-3 w-3" />
											Website
										</Badge>
									)}
									{resumeData.personalInfo.links.map(
										(link, idx) => (
											<Badge
												key={idx}
												variant="outline"
												className="gap-1"
											>
												<ExternalLink className="h-3 w-3" />
												{link.label}
											</Badge>
										)
									)}
								</div>
							)}
							<Separator className="my-3" />
							<div>
								<p className="text-xs font-medium text-muted-foreground mb-2">
									PROFESSIONAL SUMMARY
								</p>
								<p className="text-sm leading-relaxed">
									{resumeData.personalInfo.summary}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Work Experience Section */}
				<div className="space-y-3 mt-5">
					<h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
						<Briefcase className="h-4 w-4" />
						Work Experience
						<Badge variant="secondary" className="ml-2">
							{resumeData.experience.length}
						</Badge>
					</h4>
					<Card className="hover:shadow-md transition-shadow">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm font-medium">
									Professional History
								</CardTitle>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => goToStep(2)}
									className="h-8"
								>
									<Edit className="h-3 w-3 mr-1" />
									Edit
								</Button>
							</div>
						</CardHeader>
						<CardContent className="pt-0">
							{resumeData.experience.map((exp, index) => (
								<div key={exp.id}>
									{index > 0 && (
										<Separator className="my-4" />
									)}
									<ExperienceCard
										experience={exp}
										compact={true}
										onEdit={handleEditExperience}
										onDelete={handleDeleteExperience}
									/>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* Education Section */}
				{resumeData.education.length > 0 && (
					<div className="space-y-3">
						<h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
							<GraduationCap className="h-4 w-4" />
							Education
							<Badge variant="secondary" className="ml-2">
								{resumeData.education.length}
							</Badge>
						</h4>
						<Card className="hover:shadow-md transition-shadow">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="text-sm font-medium">
										Academic Background
									</CardTitle>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => goToStep(3)}
										className="h-8"
									>
										<Edit className="h-3 w-3 mr-1" />
										Edit
									</Button>
								</div>
							</CardHeader>
							<CardContent className="pt-0">
								{resumeData.education.map((edu, index) => (
									<div key={edu.id}>
										{index > 0 && (
											<Separator className="my-4" />
										)}
										<EducationCard
											education={edu}
											compact={true}
											onEdit={handleEditEducation}
											onDelete={handleDeleteEducation}
										/>
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				)}

				{/* Skills Section */}
				<div className="space-y-3 mt-5">
					<h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
						<Code2 className="h-4 w-4" />
						Skills & Expertise
					</h4>
					<Card className="hover:shadow-md transition-shadow">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm font-medium">
									Technical, Soft Skills & Languages
								</CardTitle>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => goToStep(4)}
									className="h-8"
								>
									<Edit className="h-3 w-3 mr-1" />
									Edit
								</Button>
							</div>
						</CardHeader>
						<CardContent className="pt-0 space-y-4">
							<div>
								<p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
									<Code2 className="h-3 w-3" />
									TECHNICAL SKILLS (
									{resumeData.skills.technical.length})
								</p>
								<div className="flex flex-wrap gap-1.5">
									{resumeData.skills.technical.map(
										(skill, idx) => (
											<Badge
												key={idx}
												variant="secondary"
												className="text-xs"
											>
												{skill}
											</Badge>
										)
									)}
								</div>
							</div>
							<Separator />
							<div>
								<p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
									<Lightbulb className="h-3 w-3" />
									SOFT SKILLS ({resumeData.skills.soft.length}
									)
								</p>
								<div className="flex flex-wrap gap-1.5">
									{resumeData.skills.soft.map(
										(skill, idx) => (
											<Badge
												key={idx}
												variant="outline"
												className="text-xs"
											>
												{skill}
											</Badge>
										)
									)}
								</div>
							</div>
							<Separator />
							<div>
								<p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
									<Languages className="h-3 w-3" />
									LANGUAGES (
									{resumeData.skills.languages.length})
								</p>
								<div className="space-y-1.5">
									{resumeData.skills.languages.map(
										(lang, idx) => (
											<div
												key={idx}
												className="flex items-center justify-between text-sm bg-muted/30 px-3 py-1.5 rounded"
											>
												<span className="font-medium">
													{lang.language}
												</span>
												<Badge
													variant="secondary"
													className="text-xs"
												>
													{lang.proficiency}
												</Badge>
											</div>
										)
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Projects Section */}
				{resumeData.projects.length > 0 && (
					<div className="space-y-3 mt-5">
						<h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
							<FolderKanban className="h-4 w-4" />
							Projects
							<Badge variant="secondary" className="ml-2">
								{resumeData.projects.length}
							</Badge>
						</h4>
						<Card className="hover:shadow-md transition-shadow">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="text-sm font-medium">
										Portfolio & Initiatives
									</CardTitle>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => goToStep(5)}
										className="h-8"
									>
										<Edit className="h-3 w-3 mr-1" />
										Edit
									</Button>
								</div>
							</CardHeader>
							<CardContent className="pt-0">
								{resumeData.projects.map((project, index) => (
									<div key={project.id}>
										{index > 0 && (
											<Separator className="my-4" />
										)}
										<ProjectCard
											project={project}
											compact={true}
											onEdit={handleEditProject}
											onDelete={handleDeleteProject}
										/>
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				)}

				{/* Certifications Section */}
				{resumeData.certifications.length > 0 && (
					<div className="space-y-3 mt-5">
						<h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
							<Award className="h-4 w-4" />
							Certifications
							<Badge variant="secondary" className="ml-2">
								{resumeData.certifications.length}
							</Badge>
						</h4>
						<Card className="hover:shadow-md transition-shadow">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="text-sm font-medium">
										Professional Certifications
									</CardTitle>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => goToStep(6)}
										className="h-8"
									>
										<Edit className="h-3 w-3 mr-1" />
										Edit
									</Button>
								</div>
							</CardHeader>
							<CardContent className="pt-0">
								{resumeData.certifications.map(
									(cert, index) => (
										<div key={cert.id}>
											{index > 0 && (
												<Separator className="my-4" />
											)}
											<CertificationCard
												certification={cert}
												compact={true}
												onEdit={handleEditCertification}
												onDelete={
													handleDeleteCertification
												}
											/>
										</div>
									)
								)}
							</CardContent>
						</Card>
					</div>
				)}

				{/* Achievements Section */}
				{resumeData.achievements.length > 0 && (
					<div className="space-y-3 mt-5">
						<h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
							<Trophy className="h-4 w-4" />
							Achievements & Awards
							<Badge variant="secondary" className="ml-2">
								{resumeData.achievements.length}
							</Badge>
						</h4>
						<Card className="hover:shadow-md transition-shadow">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="text-sm font-medium">
										Recognitions & Honors
									</CardTitle>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => goToStep(7)}
										className="h-8"
									>
										<Edit className="h-3 w-3 mr-1" />
										Edit
									</Button>
								</div>
							</CardHeader>
							<CardContent className="pt-0">
								{resumeData.achievements.map(
									(achievement, index) => (
										<div key={achievement.id}>
											{index > 0 && (
												<Separator className="my-4" />
											)}
											<AchievementCard
												achievement={achievement}
												compact={true}
												onEdit={handleEditAchievement}
												onDelete={
													handleDeleteAchievement
												}
											/>
										</div>
									)
								)}
							</CardContent>
						</Card>
					</div>
				)}
			</ScrollArea>

			{/* Dialogs for inline editing */}
			<ExperienceDialog
				open={experienceDialog}
				onOpenChange={setExperienceDialog}
				experience={editingExperience}
				onSave={handleSaveExperience}
			/>
			<EducationDialog
				open={educationDialog}
				onOpenChange={setEducationDialog}
				education={editingEducation}
				onSave={handleSaveEducation}
			/>
			<ProjectDialog
				open={projectDialog}
				onOpenChange={setProjectDialog}
				project={editingProject}
				onSave={handleSaveProject}
			/>
			<CertificationDialog
				open={certificationDialog}
				onOpenChange={setCertificationDialog}
				certification={editingCertification}
				onSave={handleSaveCertification}
			/>
			<AchievementDialog
				open={achievementDialog}
				onOpenChange={setAchievementDialog}
				achievement={editingAchievement}
				onSave={handleSaveAchievement}
			/>

			{/* Action Buttons */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Button
					type="button"
					variant="outline"
					size="lg"
					onClick={prevStep}
					className="w-full"
				>
					Back to Achievements
				</Button>

				<Button
					type="button"
					size="lg"
					onClick={handleComplete}
					className="w-full"
				>
					<Download className="h-4 w-4 mr-2" />
					Download Resume
				</Button>
			</div>
		</div>
	);
}
