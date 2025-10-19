"use client";

import {
	MapPin,
	Calendar,
	ChevronUp,
	ChevronDown,
	Pencil,
	Trash2,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Experience } from "@/interfaces/resume";
import { formatDateRange } from "@/lib/utils/resume-helpers";

interface ExperienceCardProps {
	experience: Experience;
	index: number;
	totalCount: number;
	onEdit: (experience: Experience) => void;
	onDelete: (id: string) => void;
	onReorder: (id: string, direction: "up" | "down") => void;
}

export function ExperienceCard({
	experience,
	index,
	totalCount,
	onEdit,
	onDelete,
	onReorder,
}: ExperienceCardProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<CardTitle className="text-lg">
							{experience.jobTitle}
						</CardTitle>
						<CardDescription className="mt-1">
							<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
								<span className="font-medium">
									{experience.company}
								</span>
								<span className="hidden sm:inline">•</span>
								<span className="flex items-center gap-1">
									<MapPin className="h-3 w-3" />
									{experience.location}
								</span>
							</div>
							<div className="flex items-center gap-1 mt-1 text-xs">
								<Calendar className="h-3 w-3" />
								{formatDateRange(
									experience.startDate,
									experience.endDate,
									experience.currentlyWorking
								)}
							</div>
						</CardDescription>
					</div>

					<div className="flex items-center gap-1">
						{/* Reorder buttons */}
						<div className="flex flex-col gap-0.5">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-6 w-6"
								onClick={() => onReorder(experience.id, "up")}
								disabled={index === 0}
							>
								<ChevronUp className="h-3 w-3" />
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-6 w-6"
								onClick={() => onReorder(experience.id, "down")}
								disabled={index === totalCount - 1}
							>
								<ChevronDown className="h-3 w-3" />
							</Button>
						</div>

						<Button
							variant="ghost"
							size="icon"
							onClick={() => onEdit(experience)}
						>
							<Pencil className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => onDelete(experience.id)}
						>
							<Trash2 className="h-4 w-4 text-destructive" />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{experience.description && (
					<p className="text-sm text-muted-foreground">
						{experience.description}
					</p>
				)}

				{experience.achievements.length > 0 && (
					<div>
						<h4 className="text-sm font-semibold mb-2">
							Key Achievements & Responsibilities
						</h4>
						<ul className="list-disc list-inside space-y-1">
							{experience.achievements.map((achievement, idx) => (
								<li
									key={idx}
									className="text-sm text-muted-foreground"
								>
									{achievement}
								</li>
							))}
						</ul>
					</div>
				)}

				{experience.skillsUsed.length > 0 && (
					<div>
						<h4 className="text-sm font-semibold mb-2">
							Skills Used
						</h4>
						<div className="flex flex-wrap gap-2">
							{experience.skillsUsed.map((skill, idx) => (
								<Badge key={idx} variant="secondary">
									{skill}
								</Badge>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
