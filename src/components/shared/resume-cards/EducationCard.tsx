"use client";

import { Badge } from "@/components/ui/badge";
import { Education } from "@/interfaces/resume";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, Calendar, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EducationCardProps {
	education: Education;
	onEdit?: (education: Education) => void;
	onDelete?: (id: string) => void;
	compact?: boolean;
}

export function EducationCard({
	education,
	onEdit,
	onDelete,
	compact = false,
}: EducationCardProps) {
	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			year: "numeric",
		}).format(date);
	};

	const formatGrade = (type: string, value: string) => {
		if (!value) return "";
		switch (type) {
			case "gpa":
				return `${value} GPA`;
			case "cgpa":
				return `${value} CGPA`;
			case "percentage":
				return `${value}%`;
			case "grade":
				return value;
			default:
				return value;
		}
	};

	if (compact) {
		// Compact view for Review page
		return (
			<div className="space-y-2 pb-4 last:pb-0">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 space-y-2">
						<div className="font-semibold text-base">
							{education.degree}
						</div>
						<div className="text-sm font-medium text-muted-foreground">
							{education.institution}
						</div>
						<div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
							<span className="flex items-center gap-1">
								<MapPin className="h-3 w-3" />
								{education.location}
							</span>
							<span className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								{formatDate(education.startDate)} -{" "}
								{education.currentlyStudying
									? "Present"
									: education.endDate
									? formatDate(education.endDate)
									: "N/A"}
							</span>
							{education.gradeType !== "none" &&
								education.gradeValue && (
									<Badge
										variant="secondary"
										className="text-xs"
									>
										{formatGrade(
											education.gradeType,
											education.gradeValue
										)}
									</Badge>
								)}
						</div>
						{education.coursework.length > 0 && (
							<p className="text-xs text-muted-foreground">
								• {education.coursework.length} course
								{education.coursework.length !== 1
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
									onClick={() => onEdit(education)}
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
									onClick={() => onDelete(education.id)}
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
							<GraduationCap className="h-4 w-4" />
							{education.degree}
						</CardTitle>
						<div className="flex flex-col gap-1 text-sm text-muted-foreground">
							<span className="font-medium">
								{education.institution}
							</span>
							<div className="flex items-center gap-3">
								<span className="flex items-center gap-1">
									<MapPin className="h-3 w-3" />
									{education.location}
								</span>
								<span className="flex items-center gap-1">
									<Calendar className="h-3 w-3" />
									{formatDate(education.startDate)} -{" "}
									{education.currentlyStudying
										? "Present"
										: education.endDate
										? formatDate(education.endDate)
										: "N/A"}
								</span>
								{education.gradeType !== "none" &&
									education.gradeValue && (
										<span className="font-medium">
											{formatGrade(
												education.gradeType,
												education.gradeValue
											)}
										</span>
									)}
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
									onClick={() => onEdit(education)}
								>
									<Edit2 className="h-3 w-3" />
								</Button>
							)}
							{onDelete && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => onDelete(education.id)}
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							)}
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				{education.achievements.length > 0 && (
					<div>
						<p className="text-sm font-medium mb-2">
							Achievements:
						</p>
						<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
							{education.achievements.map((achievement, idx) => (
								<li key={idx}>{achievement}</li>
							))}
						</ul>
					</div>
				)}
				{education.coursework.length > 0 && (
					<div>
						<p className="text-sm font-medium mb-2">
							Relevant Coursework:
						</p>
						<div className="flex flex-wrap gap-2">
							{education.coursework.map((course, idx) => (
								<Badge key={idx} variant="secondary">
									{course}
								</Badge>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
