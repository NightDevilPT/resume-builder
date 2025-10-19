// components/pages/resume-page/steps/certifications/index.tsx
"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Award, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Certification } from "@/interfaces/resume";
import { useResume } from "@/components/providers/resume-form-provider";
import { CertificationDialog } from "@/components/shared/dialogs/CertificationDialog";
import { CertificationCard } from "../../../../shared/resume-cards/CertificationCard";

export function CertificationsPage() {
	const { resumeData, dispatch, nextStep } = useResume();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingCertification, setEditingCertification] = useState<
		Certification | undefined
	>(undefined);

	const certifications = resumeData.certifications.sort(
		(a, b) => a.order - b.order
	);

	// Reset editing certification when dialog closes
	useEffect(() => {
		if (!dialogOpen) {
			setEditingCertification(undefined);
		}
	}, [dialogOpen]);

	const handleAddCertification = (certification: Certification) => {
		const newCertification = {
			...certification,
			order: certifications.length,
		};
		dispatch({ type: "ADD_CERTIFICATION", payload: newCertification });
	};

	const handleEditCertification = (certification: Certification) => {
		dispatch({
			type: "UPDATE_CERTIFICATION",
			payload: { id: certification.id, data: certification },
		});
	};

	const handleDeleteCertification = (id: string) => {
		if (confirm("Are you sure you want to delete this certification?")) {
			dispatch({ type: "REMOVE_CERTIFICATION", payload: id });
		}
	};

	const handleReorder = (id: string, direction: "up" | "down") => {
		dispatch({ type: "REORDER_CERTIFICATION", payload: { id, direction } });
	};

	const openAddDialog = () => {
		setEditingCertification(undefined);
		setDialogOpen(true);
	};

	const openEditDialog = (certification: Certification) => {
		setEditingCertification(certification);
		setDialogOpen(true);
	};

	const handleDialogSubmit = (certification: Certification) => {
		if (editingCertification) {
			handleEditCertification(certification);
		} else {
			handleAddCertification(certification);
		}
	};

	const handleContinue = () => {
		if (certifications.length === 0) {
			if (
				!confirm(
					"You haven't added any certifications yet. Continue anyway?"
				)
			) {
				return;
			}
		}
		nextStep();
	};

	return (
		<div className="w-full h-full flex flex-col">
			<div className="flex-1 px-4">
				<div className="max-w-3xl mx-auto">
					{/* Header Card */}
					<Card className="p-0 border-none shadow-none">
						<CardHeader className="px-0">
							<div className="flex items-start gap-4">
								<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
									<Award className="h-6 w-6 text-primary" />
								</div>
								<div className="flex-1">
									<CardTitle className="text-xl">
										Certifications & Licenses
									</CardTitle>
									<CardDescription>
										Add your professional certifications,
										licenses, and credentials
									</CardDescription>
								</div>
								<Button onClick={openAddDialog} size="sm">
									<Plus className="h-4 w-4 mr-2" />
									Add Certification
								</Button>
							</div>
						</CardHeader>
					</Card>
					<Separator />

					{/* Certifications List */}
					<div className="space-y-4 mt-6">
						{certifications.length === 0 ? (
							<Card>
								<CardContent className="flex flex-col items-center justify-center py-12">
									<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
										<Award className="h-8 w-8 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-semibold mb-2">
										No certifications added yet
									</h3>
									<p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
										Click &quot;Add Certification&quot; to
										showcase your professional certifications
										and licenses.
									</p>
									<Button onClick={openAddDialog}>
										<Plus className="h-4 w-4 mr-2" />
										Add Your First Certification
									</Button>
								</CardContent>
							</Card>
						) : (
							certifications.map((certification, index) => (
								<CertificationCard
									key={certification.id}
									certification={certification}
									index={index}
									totalCount={certifications.length}
									onEdit={openEditDialog}
									onDelete={handleDeleteCertification}
									onReorder={handleReorder}
								/>
							))
						)}
					</div>

					{/* Continue Button */}
					{certifications.length > 0 && (
						<div className="mt-6 pb-6">
							<Button onClick={handleContinue} className="w-full">
								Continue to Next Step
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Certification Dialog */}
			<CertificationDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSubmit={handleDialogSubmit}
				initialData={editingCertification}
				mode={editingCertification ? "edit" : "add"}
			/>
		</div>
	);
}

