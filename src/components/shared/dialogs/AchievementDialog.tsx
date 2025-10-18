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
	AchievementFormValues,
	achievementSchema,
} from "@/lib/validations/achievement";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Achievement } from "@/interfaces/resume";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/shared/date-picker";

interface AchievementDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	achievement?: Achievement;
	onSave: (data: AchievementFormValues) => void;
}

export function AchievementDialog({
	open,
	onOpenChange,
	achievement,
	onSave,
}: AchievementDialogProps) {
	const form = useForm<AchievementFormValues>({
		resolver: zodResolver(achievementSchema),
		defaultValues: achievement
			? {
					title: achievement.title,
					issuer: achievement.issuer,
					date: achievement.date.toISOString().split("T")[0],
					description: achievement.description,
			  }
			: {
					title: "",
					issuer: "",
					date: "",
					description: "",
			  },
		mode: "onChange",
	});

	// Update form when achievement prop changes
	useEffect(() => {
		if (achievement && open) {
			form.reset({
				title: achievement.title,
				issuer: achievement.issuer,
				date: achievement.date.toISOString().split("T")[0],
				description: achievement.description,
			});
		} else if (!achievement && open) {
			form.reset({
				title: "",
				issuer: "",
				date: "",
				description: "",
			});
		}
	}, [achievement, open, form]);

	const handleSubmit = (data: AchievementFormValues) => {
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
						{achievement ? "Edit Achievement" : "Add Achievement"}
					</DialogTitle>
					<DialogDescription>
						Highlight your awards, recognitions, and accomplishments
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Achievement Title *</FormLabel>
									<FormControl>
										<Input
											placeholder="Best Innovation Award 2023"
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
											Issuer/Organization *
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Tech Corp Inc."
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
										<FormLabel>Date *</FormLabel>
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
						</div>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description *</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe what you achieved and its impact..."
											className="resize-none"
											rows={3}
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
								{achievement ? "Update" : "Add"} Achievement
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
