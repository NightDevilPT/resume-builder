"use client";

import { Button } from "@/components/ui/button";
import { Achievement } from "@/interfaces/resume";
import { Trophy, Calendar, Edit2, Trash2, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AchievementCardProps {
	achievement: Achievement;
	onEdit?: (achievement: Achievement) => void;
	onDelete?: (id: string) => void;
	compact?: boolean;
}

export function AchievementCard({
	achievement,
	onEdit,
	onDelete,
	compact = false,
}: AchievementCardProps) {
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
							{achievement.title}
						</div>
						<div className="text-sm font-medium text-muted-foreground">
							{achievement.issuer}
						</div>
						<div className="flex items-center gap-1 text-xs text-muted-foreground">
							<Calendar className="h-3 w-3" />
							{formatDate(achievement.date)}
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							{achievement.description}
						</p>
					</div>
					{(onEdit || onDelete) && (
						<div className="flex gap-1 flex-shrink-0">
							{onEdit && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => onEdit(achievement)}
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
									onClick={() => onDelete(achievement.id)}
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
							<Trophy className="h-4 w-4" />
							{achievement.title}
						</CardTitle>
						<div className="flex flex-col gap-1 text-sm text-muted-foreground">
							<span className="flex items-center gap-1">
								<Building2 className="h-3 w-3" />
								{achievement.issuer}
							</span>
							<span className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								{formatDate(achievement.date)}
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
									onClick={() => onEdit(achievement)}
								>
									<Edit2 className="h-3 w-3" />
								</Button>
							)}
							{onDelete && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => onDelete(achievement.id)}
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							)}
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground">
					{achievement.description}
				</p>
			</CardContent>
		</Card>
	);
}
