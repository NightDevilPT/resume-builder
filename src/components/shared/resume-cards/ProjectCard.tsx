"use client";

import {
	FolderKanban,
	Calendar,
	Edit2,
	Trash2,
	ExternalLink,
	Github,
} from "lucide-react";
import { Project } from "@/interfaces/resume";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectCardProps {
	project: Project;
	onEdit?: (project: Project) => void;
	onDelete?: (id: string) => void;
	compact?: boolean;
}

export function ProjectCard({
	project,
	onEdit,
	onDelete,
	compact = false,
}: ProjectCardProps) {
	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			year: "numeric",
		}).format(date);
	};

	if (compact) {
		// Compact view for Review page
		return (
			<div className="space-y-2 pb-4 last:pb-0">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 space-y-2">
						<div className="font-semibold text-base">
							{project.name}
						</div>
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<Calendar className="h-3 w-3" />
							{formatDate(project.startDate)} -{" "}
							{project.currentlyWorking
								? "Present"
								: project.endDate
								? formatDate(project.endDate)
								: "Present"}
						</div>
						{project.description && (
							<p className="text-sm text-muted-foreground leading-relaxed">
								{project.description}
							</p>
						)}
						<div className="flex flex-wrap gap-1 pt-1">
							{project.technologies
								.slice(0, 8)
								.map((tech, idx) => (
									<Badge
										key={idx}
										variant="secondary"
										className="text-xs"
									>
										{tech}
									</Badge>
								))}
							{project.technologies.length > 8 && (
								<Badge variant="outline" className="text-xs">
									+{project.technologies.length - 8}
								</Badge>
							)}
						</div>
						{project.highlights.length > 0 && (
							<p className="text-xs text-muted-foreground">
								• {project.highlights.length} highlight
								{project.highlights.length !== 1
									? "s"
									: ""}{" "}
								listed
							</p>
						)}
					</div>
					{(onEdit || onDelete) && (
						<div className="flex gap-1 flex-shrink-0">
							{onEdit && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => onEdit(project)}
									className="h-8 w-8 p-0"
								>
									<Edit2 className="h-3 w-3" />
								</Button>
							)}
							{onDelete && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => onDelete(project.id)}
									className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}

	// Full view for Form page
	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="space-y-1 flex-1">
						<CardTitle className="text-lg flex items-center gap-2">
							<FolderKanban className="h-4 w-4" />
							{project.name}
						</CardTitle>
						<div className="flex items-center gap-3 text-sm text-muted-foreground">
							<span className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								{formatDate(project.startDate)} -{" "}
								{project.currentlyWorking
									? "Present"
									: project.endDate
									? formatDate(project.endDate)
									: "Present"}
							</span>
						</div>
					</div>
					{(onEdit || onDelete) && (
						<div className="flex gap-2">
							{onEdit && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => onEdit(project)}
								>
									<Edit2 className="h-3 w-3" />
								</Button>
							)}
							{onDelete && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => onDelete(project.id)}
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							)}
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				{project.description && (
					<p className="text-sm text-muted-foreground">
						{project.description}
					</p>
				)}
				{project.technologies.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{project.technologies.map((tech, idx) => (
							<Badge key={idx} variant="secondary">
								{tech}
							</Badge>
						))}
					</div>
				)}
				{project.highlights.length > 0 && (
					<div>
						<p className="text-sm font-medium mb-2">
							Key Highlights:
						</p>
						<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
							{project.highlights.map((highlight, idx) => (
								<li key={idx}>{highlight}</li>
							))}
						</ul>
					</div>
				)}
				<div className="flex gap-3">
					{project.projectUrl && (
						<a
							href={project.projectUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-primary hover:underline flex items-center gap-1"
						>
							<ExternalLink className="h-3 w-3" />
							View Project
						</a>
					)}
					{project.githubUrl && (
						<a
							href={project.githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-primary hover:underline flex items-center gap-1"
						>
							<Github className="h-3 w-3" />
							GitHub
						</a>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
