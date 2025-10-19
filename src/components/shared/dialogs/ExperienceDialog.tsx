// components/shared/dialogs/ExperienceDialog.tsx
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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	experienceSchema,
	type ExperienceFormValues,
} from "@/lib/validations/experience";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Experience } from "@/interfaces/resume";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "@/components/shared/date-picker";

interface ExperienceDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: Experience) => void;
	initialData?: Experience;
	mode?: "add" | "edit";
}

export function ExperienceDialog({
	open,
	onOpenChange,
	onSubmit,
	initialData,
	mode = "add",
}: ExperienceDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [skillInput, setSkillInput] = useState("");
	const [achievementInput, setAchievementInput] = useState("");

	const form = useForm<ExperienceFormValues>({
		resolver: zodResolver(experienceSchema),
		mode: "onBlur",
		defaultValues: {
			jobTitle: "",
			company: "",
			location: "",
			startDate: "",
			endDate: "",
			currentlyWorking: false,
			description: "",
			achievements: [""],
			skillsUsed: [""],
		},
	});

	// Update form when initialData changes
	React.useEffect(() => {
		if (initialData) {
			form.reset({
				jobTitle: initialData.jobTitle,
				company: initialData.company,
				location: initialData.location,
				startDate:
					initialData.startDate?.toISOString().split("T")[0] || "",
				endDate: initialData.endDate?.toISOString().split("T")[0] || "",
				currentlyWorking: initialData.currentlyWorking,
				description: initialData.description || "",
				achievements:
					initialData.achievements.length > 0
						? initialData.achievements
						: [""],
				skillsUsed:
					initialData.skillsUsed.length > 0
						? initialData.skillsUsed
						: [""],
			});
		} else {
			form.reset({
				jobTitle: "",
				company: "",
				location: "",
				startDate: "",
				endDate: "",
				currentlyWorking: false,
				description: "",
				achievements: [""],
				skillsUsed: [""],
			});
		}
		setSkillInput(""); // Clear skill input when data changes
		setAchievementInput(""); // Clear achievement input when data changes
	}, [initialData, form]);

	const currentlyWorking = form.watch("currentlyWorking");
	const skills = form.watch("skillsUsed");
	const achievements = form.watch("achievements");

	// Clear endDate validation when currently working is checked
	React.useEffect(() => {
		if (currentlyWorking) {
			form.setValue("endDate", "");
			form.clearErrors("endDate");
		}
	}, [currentlyWorking, form]);

	// Handle adding an achievement
	const handleAddAchievement = () => {
		const trimmedAchievement = achievementInput.trim();
		if (trimmedAchievement) {
			const currentAchievements = form.getValues("achievements");
			if (currentAchievements.length < 10) {
				form.setValue("achievements", [
					...currentAchievements,
					trimmedAchievement,
				]);
				setAchievementInput("");
			}
		}
	};

	// Handle removing an achievement
	const handleRemoveAchievement = (achievementToRemove: string) => {
		const currentAchievements = form.getValues("achievements");
		form.setValue(
			"achievements",
			currentAchievements.filter(
				(achievement) => achievement !== achievementToRemove
			)
		);
	};

	// Handle Enter key press for achievements
	const handleAchievementInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddAchievement();
		}
	};

	// Handle adding a skill
	const handleAddSkill = () => {
		const trimmedSkill = skillInput.trim();
		if (trimmedSkill && !skills.includes(trimmedSkill)) {
			const currentSkills = form.getValues("skillsUsed");
			if (currentSkills.length < 20) {
				form.setValue("skillsUsed", [...currentSkills, trimmedSkill]);
				setSkillInput("");
			}
		}
	};

	// Handle removing a skill
	const handleRemoveSkill = (skillToRemove: string) => {
		const currentSkills = form.getValues("skillsUsed");
		form.setValue(
			"skillsUsed",
			currentSkills.filter((skill) => skill !== skillToRemove)
		);
	};

	// Handle Enter key press for skills
	const handleSkillInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddSkill();
		}
	};

	const handleSubmit = async (data: ExperienceFormValues) => {
		setIsSubmitting(true);
		try {
			const experienceData: Experience = {
				id: initialData?.id || crypto.randomUUID(),
				order: initialData?.order || 0,
				jobTitle: data.jobTitle,
				company: data.company,
				location: data.location,
				startDate: new Date(data.startDate),
				endDate: data.endDate ? new Date(data.endDate) : undefined,
				currentlyWorking: data.currentlyWorking,
				description: data.description || "",
				achievements: data.achievements.filter((a) => a.trim() !== ""),
				skillsUsed: data.skillsUsed.filter((s) => s.trim() !== ""),
			};
			onSubmit(experienceData);
			onOpenChange(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0">
				<div className="px-6 pt-6 pb-4 border-b">
					<DialogHeader>
						<DialogTitle>
							{mode === "add"
								? "Add Work Experience"
								: "Edit Work Experience"}
						</DialogTitle>
						<DialogDescription>
							Add your professional work experience, achievements,
							and skills used.
						</DialogDescription>
					</DialogHeader>
				</div>

				<Form {...form}>
					<form
						id="experience-form"
						onSubmit={form.handleSubmit(handleSubmit)}
						className="flex flex-col"
					>
						<ScrollArea className="flex-1 overflow-auto px-6 py-6 max-h-[calc(90vh-180px)]">
							<div className="space-y-6 pr-2">
								{/* Job Details */}
								<div className="space-y-4">
									<h3 className="text-sm font-semibold">
										Job Details
									</h3>

									<FormField
										control={form.control}
										name="jobTitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Job Title{" "}
													<span className="text-destructive">
														*
													</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., Senior Software Engineer"
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
											name="company"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Company{" "}
														<span className="text-destructive">
															*
														</span>
													</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., Google"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="location"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Location{" "}
														<span className="text-destructive">
															*
														</span>
													</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., San Francisco, CA"
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
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Description (Optional)
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Brief description of your role..."
														className="min-h-[80px] resize-none"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Duration */}
								<div className="space-y-4">
									<h3 className="text-sm font-semibold">
										Duration
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="startDate"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Start Date{" "}
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
															placeholder="Select start date"
															disableFutureDates
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="endDate"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														End Date{" "}
														{!currentlyWorking && (
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
															placeholder="Select end date"
															disabled={
																currentlyWorking
															}
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
										name="currentlyWorking"
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
														I currently work here
													</FormLabel>
												</div>
											</FormItem>
										)}
									/>
								</div>

								{/* Achievements */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-sm font-semibold">
											Achievements & Responsibilities{" "}
											<span className="text-destructive">
												*
											</span>
										</h3>
										<span className="text-xs text-muted-foreground">
											{
												achievements.filter((a) =>
													a.trim()
												).length
											}
											/10
										</span>
									</div>

									{/* Input for adding achievements */}
									<div className="flex gap-2">
										<Input
											placeholder="e.g., Led a team of 5 engineers, Increased performance by 40%..."
											value={achievementInput}
											onChange={(e) =>
												setAchievementInput(
													e.target.value
												)
											}
											onKeyDown={
												handleAchievementInputKeyDown
											}
											disabled={achievements.length >= 10}
										/>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleAddAchievement}
											disabled={
												!achievementInput.trim() ||
												achievements.length >= 10
											}
										>
											<Plus className="h-4 w-4 mr-2" />
											Add
										</Button>
									</div>

									{/* Display achievements as list */}
									{achievements.filter((a) => a.trim())
										.length > 0 ? (
										<div className="space-y-2">
											{achievements
												.filter((a) => a.trim())
												.map((achievement, index) => (
													<div
														key={index}
														className="flex items-start gap-3 px-3 py-1 border rounded-md bg-card hover:bg-accent/50 transition-colors group"
													>
														<div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
														<p className="flex-1 text-sm leading-relaxed">
															{achievement}
														</p>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
															onClick={() =>
																handleRemoveAchievement(
																	achievement
																)
															}
														>
															<X className="h-4 w-4 text-destructive" />
														</Button>
													</div>
												))}
										</div>
									) : (
										<div className="p-4 border rounded-md bg-muted/20 text-center text-sm text-muted-foreground">
											No achievements added yet. Type an
											achievement and press Enter or click
											Add.
										</div>
									)}

									<FormField
										control={form.control}
										name="achievements"
										render={() => (
											<FormItem>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Skills */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-sm font-semibold">
											Skills Used{" "}
											<span className="text-destructive">
												*
											</span>
										</h3>
										<span className="text-xs text-muted-foreground">
											{
												skills.filter((s) => s.trim())
													.length
											}
											/20
										</span>
									</div>

									{/* Input for adding skills */}
									<div className="flex gap-2">
										<Input
											placeholder="e.g., React, TypeScript, Node.js..."
											value={skillInput}
											onChange={(e) =>
												setSkillInput(e.target.value)
											}
											onKeyDown={handleSkillInputKeyDown}
											disabled={skills.length >= 20}
										/>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleAddSkill}
											disabled={
												!skillInput.trim() ||
												skills.length >= 20
											}
										>
											<Plus className="h-4 w-4 mr-2" />
											Add
										</Button>
									</div>

									{/* Display skills as badges */}
									{skills.filter((s) => s.trim()).length >
									0 ? (
										<div className="flex flex-wrap gap-2 rounded-md bg-muted/30">
											{skills
												.filter((s) => s.trim())
												.map((skill, index) => (
													<Badge
														key={index}
														className="pl-3 pr-1 py-1 text-sm gap-1"
													>
														<span>{skill}</span>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															className="h-4 w-4 p-0 hover:bg-transparent hover:text-destructive"
															onClick={() =>
																handleRemoveSkill(
																	skill
																)
															}
														>
															<X className="h-3 w-3" />
														</Button>
													</Badge>
												))}
										</div>
									) : (
										<div className="p-4 border rounded-md bg-muted/20 text-center text-sm text-muted-foreground">
											No skills added yet. Type a skill
											and press Enter or click Add.
										</div>
									)}

									<FormField
										control={form.control}
										name="skillsUsed"
										render={() => (
											<FormItem>
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
									form="experience-form"
									disabled={isSubmitting}
								>
									{isSubmitting
										? "Saving..."
										: mode === "add"
										? "Add Experience"
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
