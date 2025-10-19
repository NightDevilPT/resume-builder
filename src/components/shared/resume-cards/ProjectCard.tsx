"use client";

import {
	Calendar,
	ChevronUp,
	ChevronDown,
	Pencil,
	Trash2,
	ExternalLink,
	MoreVertical,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/interfaces/resume";
import { formatDateRange } from "@/lib/utils/resume-helpers";

interface ProjectCardProps {
	project: Project;
	index: number;
	totalCount: number;
	onEdit: (project: Project) => void;
	onDelete: (id: string) => void;
	onReorder: (id: string, direction: "up" | "down") => void;
	hideActions?: boolean;
}

export function ProjectCard({
	project,
	index,
	totalCount,
	onEdit,
	onDelete,
	onReorder,
	hideActions = false,
}: ProjectCardProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<div className="flex items-start gap-3 flex-wrap">
							<CardTitle className="text-lg">
								{project.name}
							</CardTitle>
							{project.links && project.links.length > 0 && (
								<div className="flex items-center gap-2">
									{project.links.map((link, idx) => (
										<a
											key={idx}
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
											onClick={(e) => e.stopPropagation()}
											title={link.label}
										>
											<ExternalLink className="h-3 w-3" />
											<span>{link.label}</span>
										</a>
									))}
								</div>
							)}
						</div>
						{project.subtitle && (
							<p className="text-sm text-muted-foreground mt-1">
								{project.subtitle}
							</p>
						)}
						<CardDescription className="mt-1">
							<div className="flex items-center gap-1 text-xs">
								<Calendar className="h-3 w-3" />
								{formatDateRange(
									project.startDate,
									project.endDate,
									project.currentlyWorking
								)}
							</div>
						</CardDescription>
					</div>

					{!hideActions && (
						<>
							{/* Desktop Actions */}
							<div className="hidden xl:flex items-center gap-1">
								<div className="flex flex-col gap-0.5">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-6 w-6"
										onClick={() => onReorder(project.id, "up")}
										disabled={index === 0}
									>
										<ChevronUp className="h-3 w-3" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-6 w-6"
										onClick={() => onReorder(project.id, "down")}
										disabled={index === totalCount - 1}
									>
										<ChevronDown className="h-3 w-3" />
									</Button>
								</div>

								<Button
									variant="ghost"
									size="icon"
									onClick={() => onEdit(project)}
								>
									<Pencil className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onDelete(project.id)}
								>
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
							</div>

							{/* Mobile/Tablet Dropdown */}
							<div className="xl:hidden">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon">
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											onClick={() => onEdit(project)}
										>
											<Pencil className="h-4 w-4 mr-2" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onReorder(project.id, "up")}
											disabled={index === 0}
										>
											<ChevronUp className="h-4 w-4 mr-2" />
											Move Up
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onReorder(project.id, "down")}
											disabled={index === totalCount - 1}
										>
											<ChevronDown className="h-4 w-4 mr-2" />
											Move Down
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onDelete(project.id)}
											className="text-destructive"
										>
											<Trash2 className="h-4 w-4 mr-2" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{project.description && (
					<p className="text-sm text-muted-foreground">
						{project.description}
					</p>
				)}

				{project.technologies.length > 0 && (
					<div>
						<h4 className="text-sm font-semibold mb-2">
							Tools & Skills Used
						</h4>
						<div className="flex flex-wrap gap-2">
							{project.technologies.map((tech, idx) => (
								<Badge key={idx} variant="secondary">
									{tech}
								</Badge>
							))}
						</div>
					</div>
				)}

				{project.highlights.length > 0 && (
					<div>
						<h4 className="text-sm font-semibold mb-2">
							Key Highlights
						</h4>
						<ul className="list-disc list-inside space-y-1">
							{project.highlights.map((highlight, idx) => (
								<li
									key={idx}
									className="text-sm text-muted-foreground"
								>
									{highlight}
								</li>
							))}
						</ul>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

