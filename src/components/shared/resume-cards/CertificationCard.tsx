"use client";

import {
	Calendar,
	ChevronUp,
	ChevronDown,
	Pencil,
	Trash2,
	ExternalLink,
	Building2,
	MoreVertical,
} from "lucide-react";
import {
	Card,
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
import type { Certification } from "@/interfaces/resume";

interface CertificationCardProps {
	certification: Certification;
	index: number;
	totalCount: number;
	onEdit: (certification: Certification) => void;
	onDelete: (id: string) => void;
	onReorder: (id: string, direction: "up" | "down") => void;
	hideActions?: boolean;
}

export function CertificationCard({
	certification,
	index,
	totalCount,
	onEdit,
	onDelete,
	onReorder,
	hideActions = false,
}: CertificationCardProps) {
	// Format expiration status
	const getExpirationStatus = () => {
		if (certification.doesNotExpire) {
			return "No Expiration";
		}
		if (certification.expirationDate) {
			const expDate = new Date(certification.expirationDate);
			const today = new Date();
			const isExpired = expDate < today;

			return {
				text: format(expDate, "MMM yyyy"),
				expired: isExpired,
			};
		}
		return null;
	};

	const expirationStatus = getExpirationStatus();

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<div className="flex items-start gap-3 flex-wrap">
							<CardTitle className="text-lg">
								{certification.name}
							</CardTitle>
							{certification.credentialUrl && (
								<a
									href={certification.credentialUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
									onClick={(e) => e.stopPropagation()}
									title="View Credential"
								>
									<ExternalLink className="h-3 w-3" />
									<span>View</span>
								</a>
							)}
						</div>
						<CardDescription className="mt-1">
							<div className="flex flex-col gap-1 text-sm">
								<span className="flex items-center gap-1">
									<Building2 className="h-3 w-3" />
									{certification.issuingOrganization}
								</span>
								<div className="flex items-center gap-3 text-xs flex-wrap">
									<span className="flex items-center gap-1">
										<Calendar className="h-3 w-3" />
										Issued:{" "}
										{format(
											certification.issueDate,
											"MMM yyyy"
										)}
									</span>
									{expirationStatus && (
										<>
											<span>•</span>
											<span
												className={
													typeof expirationStatus ===
														"object" &&
													expirationStatus.expired
														? "text-destructive"
														: ""
												}
											>
												{typeof expirationStatus ===
												"string"
													? expirationStatus
													: `Expires: ${expirationStatus.text}`}
											</span>
										</>
									)}
								</div>
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
										onClick={() =>
											onReorder(certification.id, "up")
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
											onReorder(certification.id, "down")
										}
										disabled={index === totalCount - 1}
									>
										<ChevronDown className="h-3 w-3" />
									</Button>
								</div>

								<Button
									variant="ghost"
									size="icon"
									onClick={() => onEdit(certification)}
								>
									<Pencil className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onDelete(certification.id)}
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
											onClick={() =>
												onEdit(certification)
											}
										>
											<Pencil className="h-4 w-4 mr-2" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												onReorder(
													certification.id,
													"up"
												)
											}
											disabled={index === 0}
										>
											<ChevronUp className="h-4 w-4 mr-2" />
											Move Up
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												onReorder(
													certification.id,
													"down"
												)
											}
											disabled={index === totalCount - 1}
										>
											<ChevronDown className="h-4 w-4 mr-2" />
											Move Down
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												onDelete(certification.id)
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
		</Card>
	);
}
