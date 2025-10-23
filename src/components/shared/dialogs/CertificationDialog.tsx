// components/shared/dialogs/CertificationDialog.tsx
"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	certificationSchema,
	type CertificationFormValues,
} from "@/lib/validations/certification";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Certification } from "@/interfaces/resume";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "@/components/shared/date-picker";

interface CertificationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: Certification) => void;
	initialData?: Certification;
	mode?: "add" | "edit";
}

export function CertificationDialog({
	open,
	onOpenChange,
	onSubmit,
	initialData,
	mode = "add",
}: CertificationDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<CertificationFormValues>({
		resolver: zodResolver(certificationSchema),
		mode: "onBlur",
		defaultValues: {
			name: "",
			issuingOrganization: "",
			issueDate: "",
			expirationDate: "",
			doesNotExpire: false,
			credentialUrl: "",
		},
	});

	// Update form when initialData changes
	React.useEffect(() => {
		if (initialData) {
			form.reset({
				name: initialData.name,
				issuingOrganization: initialData.issuingOrganization,
				issueDate:
					initialData.issueDate?.toISOString().split("T")[0] || "",
				expirationDate:
					initialData.expirationDate?.toISOString().split("T")[0] ||
					"",
				doesNotExpire: initialData.doesNotExpire,
				credentialUrl: initialData.credentialUrl || "",
			});
		} else {
			form.reset({
				name: "",
				issuingOrganization: "",
				issueDate: "",
				expirationDate: "",
				doesNotExpire: false,
				credentialUrl: "",
			});
		}
	}, [initialData, form]);

	const doesNotExpire = form.watch("doesNotExpire");

	// Clear expirationDate validation when doesNotExpire is checked
	React.useEffect(() => {
		if (doesNotExpire) {
			form.setValue("expirationDate", "");
			form.clearErrors("expirationDate");
		}
	}, [doesNotExpire, form]);

	const handleSubmit = async (data: CertificationFormValues) => {
		setIsSubmitting(true);
		try {
			const certificationData: Certification = {
				id: initialData?.id || crypto.randomUUID(),
				order: initialData?.order || 0,
				name: data.name,
				issuingOrganization: data.issuingOrganization,
				issueDate: new Date(data.issueDate),
				expirationDate: data.expirationDate
					? new Date(data.expirationDate)
					: undefined,
				doesNotExpire: data.doesNotExpire,
				credentialUrl: data.credentialUrl || "",
			};
			onSubmit(certificationData);
			onOpenChange(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0">
				<div className="px-6 pt-6 pb-4 border-b">
					<DialogHeader>
						<DialogTitle>
							{mode === "add"
								? "Add Certification"
								: "Edit Certification"}
						</DialogTitle>
						<DialogDescription>
							Add professional certifications, licenses, and
							credentials.
						</DialogDescription>
					</DialogHeader>
				</div>

				<Form {...form}>
					<form
						id="certification-form"
						onSubmit={form.handleSubmit(handleSubmit)}
						className="flex flex-col"
					>
						<ScrollArea className="flex-1 overflow-auto px-6 py-6 max-h-[calc(90vh-180px)]">
							<div className="space-y-6 pr-2">
								{/* Certification Details */}
								<div className="space-y-4">
									<h3 className="text-sm font-semibold">
										Certification Details
									</h3>

									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Certification Name{" "}
													<span className="text-destructive">
														*
													</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., AWS Certified Solutions Architect, PMP, CPA"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="issuingOrganization"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Issuing Organization{" "}
													<span className="text-destructive">
														*
													</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., Amazon Web Services, PMI, AICPA"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="credentialUrl"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Credential URL (Optional)
												</FormLabel>
												<FormControl>
													<Input
														placeholder="https://credential-url.com"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Dates */}
								<div className="space-y-4">
									<h3 className="text-sm font-semibold">
										Dates
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="issueDate"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Issue Date{" "}
														<span className="text-destructive">
															*
														</span>
													</FormLabel>
													<FormControl>
														<DatePicker
															value={field.value}
															onChange={
																field.onChange
															}
															placeholder="Select issue date"
															disableFutureDates
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="expirationDate"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Expiration Date{" "}
														{!doesNotExpire && (
															<span className="text-destructive">
																*
															</span>
														)}
													</FormLabel>
													<FormControl>
														<DatePicker
															value={
																field.value ||
																""
															}
															onChange={
																field.onChange
															}
															placeholder="Select expiration date"
															disabled={
																doesNotExpire
															}
															disableFutureDates={
																false
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="doesNotExpire"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={
															field.onChange
														}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>
														This certification does not
														expire
													</FormLabel>
												</div>
											</FormItem>
										)}
									/>
								</div>
							</div>
						</ScrollArea>

						<div className="px-6 py-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => onOpenChange(false)}
									disabled={isSubmitting}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									form="certification-form"
									disabled={isSubmitting}
								>
									{isSubmitting
										? "Saving..."
										: mode === "add"
										? "Add Certification"
										: "Save Changes"}
								</Button>
							</DialogFooter>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

