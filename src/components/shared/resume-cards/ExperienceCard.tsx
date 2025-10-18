"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Experience } from "@/interfaces/resume";
import { Briefcase, MapPin, Calendar, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExperienceCardProps {
	experience: Experience;
	onEdit?: (experience: Experience) => void;
	onDelete?: (id: string) => void;
	compact?: boolean; // For review page
}

export function ExperienceCard({
	experience,
	onEdit,
	onDelete,
	compact = false,
}: ExperienceCardProps) {
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
							{experience.jobTitle}
						</div>
						<div className="text-sm font-medium text-muted-foreground">
							{experience.company}
						</div>
						<div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
							<span className="flex items-center gap-1">
								<MapPin className="h-3 w-3" />
								{experience.location}
							</span>
							<span className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								{formatDate(experience.startDate)} -{" "}
								{experience.currentlyWorking
									? "Present"
									: formatDate(experience.endDate!)}
							</span>
						</div>
						{experience.description && (
							<p className="text-sm text-muted-foreground leading-relaxed">
								{experience.description}
							</p>
						)}
						{experience.skillsUsed.length > 0 && (
							<div className="flex flex-wrap gap-1 pt-1">
								{experience.skillsUsed.slice(0, 6).map((skill, idx) => (
									<Badge
										key={idx}
										variant="secondary"
										className="text-xs"
									>
										{skill}
									</Badge>
								))}
								{experience.skillsUsed.length > 6 && (
									<Badge variant="outline" className="text-xs">
										+{experience.skillsUsed.length - 6} more
									</Badge>
								)}
							</div>
						)}
						{experience.achievements.length > 0 && (
							<p className="text-xs text-muted-foreground">
								• {experience.achievements.length} achievement
								{experience.achievements.length !== 1 ? "s" : ""} listed
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
									onClick={() => onEdit(experience)}
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
									onClick={() => onDelete(experience.id)}
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
					<div className="space-y-1">
						<CardTitle className="text-lg flex items-center gap-2">
							<Briefcase className="h-4 w-4" />
							{experience.jobTitle}
						</CardTitle>
						<div className="flex flex-col gap-1 text-sm text-muted-foreground">
							<span className="font-medium">
								{experience.company}
							</span>
							<div className="flex items-center gap-3">
								<span className="flex items-center gap-1">
									<MapPin className="h-3 w-3" />
									{experience.location}
								</span>
								<span className="flex items-center gap-1">
									<Calendar className="h-3 w-3" />
									{formatDate(experience.startDate)} -{" "}
									{experience.currentlyWorking
										? "Present"
										: formatDate(experience.endDate!)}
								</span>
							</div>
						</div>
					</div>
					{(onEdit || onDelete) && (
						<div className="flex gap-2">
							{onEdit && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => onEdit(experience)}
								>
									<Edit2 className="h-3 w-3" />
								</Button>
							)}
							{onDelete && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => onDelete(experience.id)}
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							)}
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				{experience.description && (
					<p className="text-sm text-muted-foreground">
						{experience.description}
					</p>
				)}
				{experience.achievements.length > 0 && (
					<div>
						<p className="text-sm font-medium mb-2">
							Key Achievements:
						</p>
						<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
							{experience.achievements.map(
								(achievement, idx) => (
									<li key={idx}>{achievement}</li>
								)
							)}
						</ul>
					</div>
				)}
				{experience.skillsUsed.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{experience.skillsUsed.map((skill, idx) => (
							<Badge key={idx} variant="secondary">
								{skill}
							</Badge>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

