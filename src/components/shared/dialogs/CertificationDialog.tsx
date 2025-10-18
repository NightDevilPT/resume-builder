"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
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
	CertificationFormValues,
	certificationSchema,
} from "@/lib/validations/certification";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Certification } from "@/interfaces/resume";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/shared/date-picker";

interface CertificationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	certification?: Certification;
	onSave: (data: CertificationFormValues) => void;
}

export function CertificationDialog({
	open,
	onOpenChange,
	certification,
	onSave,
}: CertificationDialogProps) {
	const form = useForm<CertificationFormValues>({
		resolver: zodResolver(certificationSchema),
		defaultValues: certification
			? {
					name: certification.name,
					issuingOrganization: certification.issuingOrganization,
					issueDate: certification.issueDate
						.toISOString()
						.split("T")[0],
					expirationDate: certification.expirationDate
						? certification.expirationDate
								.toISOString()
								.split("T")[0]
						: "",
					doesNotExpire: certification.doesNotExpire,
					credentialUrl: certification.credentialUrl || "",
			  }
			: {
					name: "",
					issuingOrganization: "",
					issueDate: "",
					expirationDate: "",
					doesNotExpire: false,
					credentialUrl: "",
			  },
		mode: "onChange",
	});

	const doesNotExpire = form.watch("doesNotExpire");

	// Update form when certification prop changes
	useEffect(() => {
		if (certification && open) {
			form.reset({
				name: certification.name,
				issuingOrganization: certification.issuingOrganization,
				issueDate: certification.issueDate.toISOString().split("T")[0],
				expirationDate: certification.expirationDate
					? certification.expirationDate.toISOString().split("T")[0]
					: "",
				doesNotExpire: certification.doesNotExpire,
				credentialUrl: certification.credentialUrl || "",
			});
		} else if (!certification && open) {
			form.reset({
				name: "",
				issuingOrganization: "",
				issueDate: "",
				expirationDate: "",
				doesNotExpire: false,
				credentialUrl: "",
			});
		}
	}, [certification, open, form]);

	const handleSubmit = (data: CertificationFormValues) => {
		onSave(data);
		onOpenChange(false);
		form.reset();
	};

	// Reset form when dialog opens/closes
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			form.reset();
		}
		onOpenChange(open);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{certification
							? "Edit Certification"
							: "Add Certification"}
					</DialogTitle>
					<DialogDescription>
						Add your professional certifications and credentials
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Certification Name *</FormLabel>
									<FormControl>
										<Input
											placeholder="AWS Certified Solutions Architect"
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
										Issuing Organization *
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Amazon Web Services"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="issueDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Issue Date *</FormLabel>
										<FormControl>
											<DatePicker
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{!doesNotExpire && (
								<FormField
									control={form.control}
									name="expirationDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Expiration Date
											</FormLabel>
											<FormControl>
												<DatePicker
													value={field.value || ""}
													onChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>

						<FormField
							control={form.control}
							name="doesNotExpire"
							render={({ field }) => (
								<FormItem className="flex items-center gap-2 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={async (
												checked
											) => {
												field.onChange(checked);
												if (checked) {
													form.setValue(
														"expirationDate",
														""
													);
												}
												// Trigger full form validation
												await form.trigger();
											}}
										/>
									</FormControl>
									<FormLabel className="!mt-0 cursor-pointer">
										This certification does not expire
									</FormLabel>
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
											placeholder="https://credentials.com/verify/..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={!form.formState.isValid}
							>
								{certification ? "Update" : "Add"} Certification
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
