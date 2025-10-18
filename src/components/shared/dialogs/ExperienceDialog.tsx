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
	ExperienceFormValues,
	experienceSchema,
} from "@/lib/validations/experience";
import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Experience } from "@/interfaces/resume";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/shared/date-picker";

interface ExperienceDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	experience?: Experience;
	onSave: (data: ExperienceFormValues) => void;
}

export function ExperienceDialog({
	open,
	onOpenChange,
	experience,
	onSave,
}: ExperienceDialogProps) {
	const [achievementInput, setAchievementInput] = useState("");
	const [skillInput, setSkillInput] = useState("");

	const form = useForm<ExperienceFormValues>({
		resolver: zodResolver(experienceSchema),
		defaultValues: experience
			? {
					jobTitle: experience.jobTitle,
					company: experience.company,
					location: experience.location,
					startDate: experience.startDate.toISOString().split("T")[0],
					endDate: experience.endDate
						? experience.endDate.toISOString().split("T")[0]
						: "",
					currentlyWorking: experience.currentlyWorking,
					description: experience.description,
					achievements: experience.achievements,
					skillsUsed: experience.skillsUsed,
			  }
			: {
					jobTitle: "",
					company: "",
					location: "",
					startDate: "",
					endDate: "",
					currentlyWorking: false,
					description: "",
					achievements: [],
					skillsUsed: [],
			  },
		mode: "onChange",
	});

	const currentlyWorking = form.watch("currentlyWorking");
	const achievements = form.watch("achievements");
	const skillsUsed = form.watch("skillsUsed");

	// Update form when experience prop changes
	useEffect(() => {
		if (experience && open) {
			form.reset({
				jobTitle: experience.jobTitle,
				company: experience.company,
				location: experience.location,
				startDate: experience.startDate.toISOString().split("T")[0],
				endDate: experience.endDate
					? experience.endDate.toISOString().split("T")[0]
					: "",
				currentlyWorking: experience.currentlyWorking,
				description: experience.description,
				achievements: experience.achievements,
				skillsUsed: experience.skillsUsed,
			});
		} else if (!experience && open) {
			form.reset({
				jobTitle: "",
				company: "",
				location: "",
				startDate: "",
				endDate: "",
				currentlyWorking: false,
				description: "",
				achievements: [],
				skillsUsed: [],
			});
		}
	}, [experience, open, form]);

	const handleSubmit = (data: ExperienceFormValues) => {
		onSave(data);
		onOpenChange(false);
		setAchievementInput("");
		setSkillInput("");
		form.reset();
	};

	// Reset form when dialog opens/closes
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			form.reset();
			setAchievementInput("");
			setSkillInput("");
		}
		onOpenChange(open);
	};

	const addAchievement = () => {
		if (achievementInput.trim()) {
			form.setValue(
				"achievements",
				[...achievements, achievementInput.trim()],
				{
					shouldValidate: true,
				}
			);
			setAchievementInput("");
		}
	};

	const removeAchievement = (index: number) => {
		form.setValue(
			"achievements",
			achievements.filter((_, i) => i !== index),
			{ shouldValidate: true }
		);
	};

	const addSkill = () => {
		if (skillInput.trim()) {
			form.setValue("skillsUsed", [...skillsUsed, skillInput.trim()], {
				shouldValidate: true,
			});
			setSkillInput("");
		}
	};

	const removeSkill = (index: number) => {
		form.setValue(
			"skillsUsed",
			skillsUsed.filter((_, i) => i !== index),
			{ shouldValidate: true }
		);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{experience ? "Edit Experience" : "Add Experience"}
					</DialogTitle>
					<DialogDescription>
						Fill in the details about your work experience
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="jobTitle"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Job Title *</FormLabel>
										<FormControl>
											<Input
												placeholder="Software Engineer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="company"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Company *</FormLabel>
										<FormControl>
											<Input
												placeholder="Tech Corp"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location *</FormLabel>
									<FormControl>
										<Input
											placeholder="San Francisco, CA"
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
								name="startDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Start Date *</FormLabel>
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

							{!currentlyWorking && (
								<FormField
									control={form.control}
									name="endDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>End Date</FormLabel>
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
							name="currentlyWorking"
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
														"endDate",
														""
													);
												}
												// Trigger full form validation
												await form.trigger();
											}}
										/>
									</FormControl>
									<FormLabel className="!mt-0 cursor-pointer">
										I currently work here
									</FormLabel>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe your role and responsibilities..."
											className="resize-none"
											rows={3}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div>
							<Label>Key Achievements</Label>
							<div className="flex gap-2 mt-2">
								<Input
									placeholder="Add an achievement"
									value={achievementInput}
									onChange={(e) =>
										setAchievementInput(e.target.value)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addAchievement();
										}
									}}
								/>
								<Button
									type="button"
									onClick={addAchievement}
									disabled={!achievementInput.trim()}
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							{achievements.length > 0 && (
								<div className="space-y-2 mt-3">
									{achievements.map((achievement, idx) => (
										<div
											key={idx}
											className="flex items-center gap-2 text-sm bg-muted p-2 rounded"
										>
											<span className="flex-1">
												{achievement}
											</span>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() =>
													removeAchievement(idx)
												}
											>
												<X className="h-3 w-3" />
											</Button>
										</div>
									))}
								</div>
							)}
						</div>

						<div>
							<Label>Skills Used</Label>
							<div className="flex gap-2 mt-2">
								<Input
									placeholder="Add a skill"
									value={skillInput}
									onChange={(e) =>
										setSkillInput(e.target.value)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addSkill();
										}
									}}
								/>
								<Button
									type="button"
									onClick={addSkill}
									disabled={!skillInput.trim()}
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							{skillsUsed.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-3">
									{skillsUsed.map((skill, idx) => (
										<Badge key={idx} variant="secondary">
											{skill}
											<button
												type="button"
												onClick={() => removeSkill(idx)}
												className="ml-1"
											>
												<X className="h-3 w-3" />
											</button>
										</Badge>
									))}
								</div>
							)}
						</div>

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
								{experience ? "Update" : "Add"} Experience
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
