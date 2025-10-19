"use client";

import {
	MapPin,
	Calendar,
	ChevronUp,
	ChevronDown,
	Pencil,
	Trash2,
	Award,
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
import type { Education } from "@/interfaces/resume";
import { formatDateRange } from "@/lib/utils/resume-helpers";

interface EducationCardProps {
	education: Education;
	index: number;
	totalCount: number;
	onEdit: (education: Education) => void;
	onDelete: (id: string) => void;
	onReorder: (id: string, direction: "up" | "down") => void;
	hideActions?: boolean;
}

export function EducationCard({
	education,
	index,
	totalCount,
	onEdit,
	onDelete,
	onReorder,
	hideActions = false,
}: EducationCardProps) {
	// Format grade display
	const getGradeDisplay = () => {
		if (
			education.gradeType === "none" ||
			!education.gradeValue ||
			education.currentlyStudying
		) {
			return null;
		}

		const gradeTypeLabels = {
			gpa: "GPA",
			cgpa: "CGPA",
			percentage: "",
			grade: "",
		};

		const label = gradeTypeLabels[education.gradeType] || "";
		const value = education.gradeValue;
		const suffix = education.gradeType === "percentage" ? "%" : "";

		return `${label} ${value}${suffix}`.trim();
	};

	const gradeDisplay = getGradeDisplay();

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<CardTitle className="text-lg">
							{education.degree}
						</CardTitle>
						<CardDescription className="mt-1">
							<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
								<span className="font-medium">
									{education.institution}
								</span>
								<span className="hidden sm:inline">•</span>
								<span className="flex items-center gap-1">
									<MapPin className="h-3 w-3" />
									{education.location}
								</span>
							</div>
							<div className="flex items-center gap-3 mt-1 text-xs flex-wrap">
								<span className="flex items-center gap-1">
									<Calendar className="h-3 w-3" />
									{formatDateRange(
										education.startDate,
										education.endDate,
										education.currentlyStudying
									)}
								</span>
								{gradeDisplay && (
									<>
										<span>•</span>
										<span className="flex items-center gap-1">
											<Award className="h-3 w-3" />
											{gradeDisplay}
										</span>
									</>
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
										onClick={() => onReorder(education.id, "up")}
										disabled={index === 0}
									>
										<ChevronUp className="h-3 w-3" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-6 w-6"
										onClick={() => onReorder(education.id, "down")}
										disabled={index === totalCount - 1}
									>
										<ChevronDown className="h-3 w-3" />
									</Button>
								</div>

								<Button
									variant="ghost"
									size="icon"
									onClick={() => onEdit(education)}
								>
									<Pencil className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onDelete(education.id)}
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
											onClick={() => onEdit(education)}
										>
											<Pencil className="h-4 w-4 mr-2" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onReorder(education.id, "up")}
											disabled={index === 0}
										>
											<ChevronUp className="h-4 w-4 mr-2" />
											Move Up
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onReorder(education.id, "down")}
											disabled={index === totalCount - 1}
										>
											<ChevronDown className="h-4 w-4 mr-2" />
											Move Down
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onDelete(education.id)}
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
				{education.achievements.length > 0 && (
					<div>
						<h4 className="text-sm font-semibold mb-2">
							Achievements & Honors
						</h4>
						<ul className="list-disc list-inside space-y-1">
							{education.achievements.map((achievement, idx) => (
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

				{education.coursework.length > 0 && (
					<div>
						<h4 className="text-sm font-semibold mb-2">
							Relevant Coursework
						</h4>
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


