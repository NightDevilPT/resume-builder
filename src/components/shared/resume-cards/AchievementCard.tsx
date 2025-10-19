"use client";

import {
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
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import type { Achievement } from "@/interfaces/resume";

interface AchievementCardProps {
	achievement: Achievement;
	index: number;
	totalCount: number;
	onEdit: (achievement: Achievement) => void;
	onDelete: (id: string) => void;
	onReorder: (id: string, direction: "up" | "down") => void;
	hideActions?: boolean;
}

export function AchievementCard({
	achievement,
	index,
	totalCount,
	onEdit,
	onDelete,
	onReorder,
	hideActions = false,
}: AchievementCardProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<div className="flex items-start gap-2">
							<Award className="h-5 w-5 text-primary mt-0.5 shrink-0" />
							<div className="flex-1">
								<CardTitle className="text-lg">
									{achievement.title}
								</CardTitle>
								<CardDescription className="mt-1">
									<div className="flex flex-col gap-1 text-sm">
										<span className="font-medium">
											{achievement.issuer}
										</span>
										<span className="flex items-center gap-1 text-xs">
											<Calendar className="h-3 w-3" />
											{format(achievement.date, "MMMM yyyy")}
										</span>
									</div>
								</CardDescription>
							</div>
						</div>
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
										onClick={() =>
											onReorder(achievement.id, "up")
										}
										disabled={index === 0}
									>
										<ChevronUp className="h-3 w-3" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-6 w-6"
										onClick={() =>
											onReorder(achievement.id, "down")
										}
										disabled={index === totalCount - 1}
									>
										<ChevronDown className="h-3 w-3" />
									</Button>
								</div>

								<Button
									variant="ghost"
									size="icon"
									onClick={() => onEdit(achievement)}
								>
									<Pencil className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onDelete(achievement.id)}
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
											onClick={() => onEdit(achievement)}
										>
											<Pencil className="h-4 w-4 mr-2" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												onReorder(achievement.id, "up")
											}
											disabled={index === 0}
										>
											<ChevronUp className="h-4 w-4 mr-2" />
											Move Up
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												onReorder(achievement.id, "down")
											}
											disabled={index === totalCount - 1}
										>
											<ChevronDown className="h-4 w-4 mr-2" />
											Move Down
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												onDelete(achievement.id)
											}
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
			<CardContent>
				<p className="text-sm text-muted-foreground leading-relaxed">
					{achievement.description}
				</p>
			</CardContent>
		</Card>
	);
}

