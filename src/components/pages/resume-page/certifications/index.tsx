"use client";

import { useState } from "react";
import { Plus, Eye, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Certification } from "@/interfaces/resume";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { CertificationDialog } from "@/components/shared/dialogs";
import { CertificationCard } from "@/components/shared/resume-cards";
import { CertificationFormValues } from "@/lib/validations/certification";
import { areRequiredSectionsComplete } from "@/lib/utils/resume-helpers";
import { useResume } from "@/components/providers/resume-form-provider";

export function CertificationsForm() {
	const { resumeData, dispatch, nextStep, prevStep, goToStep } = useResume();
	const canReview = areRequiredSectionsComplete(resumeData);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingCertification, setEditingCertification] = useState<
		Certification | undefined
	>(undefined);

	const handleAdd = () => {
		setEditingCertification(undefined);
		setDialogOpen(true);
	};

	const handleEdit = (cert: Certification) => {
		setEditingCertification(cert);
		setDialogOpen(true);
	};

	const handleSave = (data: CertificationFormValues) => {
		const certificationData: Certification = {
			id: editingCertification
				? editingCertification.id
				: `cert-${Date.now()}`,
			name: data.name,
			issuingOrganization: data.issuingOrganization,
			issueDate: new Date(data.issueDate),
			expirationDate: data.expirationDate
				? new Date(data.expirationDate)
				: undefined,
			doesNotExpire: data.doesNotExpire,
			credentialUrl: data.credentialUrl || "",
		};

		if (editingCertification) {
			dispatch({
				type: "UPDATE_CERTIFICATION",
				payload: {
					id: certificationData.id,
					data: certificationData,
				},
			});
		} else {
			dispatch({
				type: "ADD_CERTIFICATION",
				payload: certificationData,
			});
		}
	};

	const handleDelete = (id: string) => {
		dispatch({
			type: "REMOVE_CERTIFICATION",
			payload: id,
		});
	};

	const handleSkip = () => {
		nextStep();
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-center items-center gap-3">
				<div className="flex-1">
					<h3 className="text-xl font-semibold">Certifications</h3>
					<p className="text-muted-foreground">
						Add your professional certifications and credentials.
					</p>
				</div>
				<Button onClick={handleAdd} className="w-full md:w-auto">
					<Plus className="h-4 w-4 mr-2" />
					Add Certification
				</Button>
			</div>

			{/* Info Banner */}
			<Card className="bg-accent/50 border-accent p-0 py-2">
				<CardContent className="px-4">
					<p className="text-sm text-muted-foreground flex items-start gap-2">
						<Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
						<span>
							<strong>Optional Section:</strong> Include industry
							certifications, licenses, or professional
							credentials relevant to your field.
						</span>
					</p>
				</CardContent>
			</Card>

			{/* List of existing certifications */}
			{resumeData.certifications.length > 0 && (
				<ScrollArea className="space-y-4 h-[calc(100vh-480px)] pr-5">
					<h4 className="text-sm font-medium text-muted-foreground">
						Added Certifications ({resumeData.certifications.length}
						)
					</h4>
					<div className="space-y-4">
						{resumeData.certifications.map((cert) => (
							<CertificationCard
								key={cert.id}
								certification={cert}
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
						))}
					</div>
				</ScrollArea>
			)}

			{resumeData.certifications.length === 0 && (
				<div className="text-center py-12 border-2 border-dashed rounded-lg">
					<p className="text-muted-foreground mb-4">
						No certifications added yet
					</p>
					<Button onClick={handleAdd} variant="outline">
						<Plus className="h-4 w-4 mr-2" />
						Add Your First Certification
					</Button>
				</div>
			)}

			{/* Certification Dialog */}
			<CertificationDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				certification={editingCertification}
				onSave={handleSave}
			/>

			<div className="flex justify-between pt-6">
				<Button type="button" variant="outline" onClick={prevStep}>
					Back to Projects
				</Button>

				<div className="flex gap-2">
					{canReview && (
						<Button
							type="button"
							variant="outline"
							onClick={() => goToStep(8)}
						>
							<Eye className="h-4 w-4 mr-2" />
							Quick Review
						</Button>
					)}
					{resumeData.certifications.length === 0 ? (
						<Button type="button" onClick={handleSkip}>
							Skip to Achievements
						</Button>
					) : (
						<Button type="button" onClick={nextStep}>
							Continue to Achievements
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
