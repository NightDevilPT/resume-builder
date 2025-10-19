// components/shared/dialogs/AchievementDialog.tsx
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
	achievementSchema,
	type AchievementFormValues,
} from "@/lib/validations/achievement";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Achievement } from "@/interfaces/resume";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "@/components/shared/date-picker";

interface AchievementDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: Achievement) => void;
	initialData?: Achievement;
	mode?: "add" | "edit";
}

export function AchievementDialog({
	open,
	onOpenChange,
	onSubmit,
	initialData,
	mode = "add",
}: AchievementDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<AchievementFormValues>({
		resolver: zodResolver(achievementSchema) as any,
		mode: "onBlur",
		defaultValues: {
			title: "",
			issuer: "",
			date: "",
			description: "",
		},
	});

	// Update form when initialData changes
	React.useEffect(() => {
		if (initialData) {
			form.reset({
				title: initialData.title,
				issuer: initialData.issuer,
				date: initialData.date?.toISOString().split("T")[0] || "",
				description: initialData.description,
			});
		} else {
			form.reset({
				title: "",
				issuer: "",
				date: "",
				description: "",
			});
		}
	}, [initialData, form]);

	const handleSubmit = async (data: AchievementFormValues) => {
		setIsSubmitting(true);
		try {
			const achievementData: Achievement = {
				id: initialData?.id || crypto.randomUUID(),
				order: initialData?.order || 0,
				title: data.title,
				issuer: data.issuer,
				date: new Date(data.date),
				description: data.description,
			};
			onSubmit(achievementData);
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
								? "Add Achievement"
								: "Edit Achievement"}
						</DialogTitle>
						<DialogDescription>
							Add notable achievements, awards, recognitions, or
							accomplishments.
						</DialogDescription>
					</DialogHeader>
				</div>

				<Form {...form}>
					<form
						id="achievement-form"
						onSubmit={form.handleSubmit(handleSubmit)}
						className="flex flex-col"
					>
						<ScrollArea className="flex-1 overflow-auto px-6 py-6 max-h-[calc(90vh-180px)]">
							<div className="space-y-6 pr-2">
								{/* Achievement Details */}
								<div className="space-y-4">
									<h3 className="text-sm font-semibold">
										Achievement Details
									</h3>

									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Achievement Title{" "}
													<span className="text-destructive">
														*
													</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., Employee of the Year, Best Innovation Award"
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
											name="issuer"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Issuer/Organization{" "}
														<span className="text-destructive">
															*
														</span>
													</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., Microsoft, Harvard University"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="date"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Date{" "}
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
															placeholder="Select date"
															disableFutureDates
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Description{" "}
													<span className="text-destructive">
														*
													</span>
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Describe what you achieved and why it's significant..."
														className="min-h-[100px] resize-none"
														{...field}
													/>
												</FormControl>
												<FormMessage />
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
									form="achievement-form"
									disabled={isSubmitting}
								>
									{isSubmitting
										? "Saving..."
										: mode === "add"
										? "Add Achievement"
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
