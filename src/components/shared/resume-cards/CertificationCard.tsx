"use client";

import {
	Award,
	Calendar,
	Edit2,
	Trash2,
	ExternalLink,
	Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Certification } from "@/interfaces/resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CertificationCardProps {
	certification: Certification;
	onEdit?: (certification: Certification) => void;
	onDelete?: (id: string) => void;
	compact?: boolean;
}

export function CertificationCard({
	certification,
	onEdit,
	onDelete,
	compact = false,
}: CertificationCardProps) {
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
							{certification.name}
						</div>
						<div className="text-sm font-medium text-muted-foreground">
							{certification.issuingOrganization}
						</div>
						<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
							<span className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								{formatDate(certification.issueDate)}
							</span>
							{certification.doesNotExpire ? (
								<Badge variant="secondary" className="text-xs">
									No Expiration
								</Badge>
							) : certification.expirationDate ? (
								<span>
									• Expires:{" "}
									{formatDate(certification.expirationDate)}
								</span>
							) : null}
						</div>
					</div>
					{(onEdit || onDelete) && (
						<div className="flex gap-1 flex-shrink-0">
							{onEdit && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => onEdit(certification)}
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
									onClick={() => onDelete(certification.id)}
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
							<Award className="h-4 w-4" />
							{certification.name}
						</CardTitle>
						<div className="flex flex-col gap-1 text-sm text-muted-foreground">
							<span className="flex items-center gap-1">
								<Building2 className="h-3 w-3" />
								{certification.issuingOrganization}
							</span>
							<div className="flex items-center gap-3">
								<span className="flex items-center gap-1">
									<Calendar className="h-3 w-3" />
									Issued:{" "}
									{formatDate(certification.issueDate)}
								</span>
								{certification.doesNotExpire ? (
									<Badge variant="secondary">
										No Expiration
									</Badge>
								) : certification.expirationDate ? (
									<span className="text-xs">
										Expires:{" "}
										{formatDate(
											certification.expirationDate
										)}
									</span>
								) : null}
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
									onClick={() => onEdit(certification)}
								>
									<Edit2 className="h-3 w-3" />
								</Button>
							)}
							{onDelete && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => onDelete(certification.id)}
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							)}
						</div>
					)}
				</div>
			</CardHeader>
			{certification.credentialUrl && (
				<CardContent>
					<a
						href={certification.credentialUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-primary hover:underline flex items-center gap-1"
					>
						<ExternalLink className="h-3 w-3" />
						View Credential
					</a>
				</CardContent>
			)}
		</Card>
	);
}
