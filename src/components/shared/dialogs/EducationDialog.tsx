// components/shared/dialogs/EducationDialog.tsx
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	educationSchema,
	type EducationFormValues,
} from "@/lib/validations/education";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Education } from "@/interfaces/resume";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "@/components/shared/date-picker";

interface EducationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: Education) => void;
	initialData?: Education;
	mode?: "add" | "edit";
}

export function EducationDialog({
	open,
	onOpenChange,
	onSubmit,
	initialData,
	mode = "add",
}: EducationDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [courseworkInput, setCourseworkInput] = useState("");
	const [achievementInput, setAchievementInput] = useState("");

	const form = useForm<EducationFormValues>({
		resolver: zodResolver(educationSchema),
		mode: "onBlur",
		defaultValues: {
			degree: "",
			institution: "",
			location: "",
			startDate: "",
			endDate: "",
			currentlyStudying: false,
			gradeType: "none",
			gradeValue: "",
			achievements: [],
			coursework: [],
		},
	});

	// Update form when initialData changes
	React.useEffect(() => {
		if (initialData) {
			form.reset({
				degree: initialData.degree,
				institution: initialData.institution,
				location: initialData.location,
				startDate:
					initialData.startDate?.toISOString().split("T")[0] || "",
				endDate: initialData.endDate?.toISOString().split("T")[0] || "",
				currentlyStudying: initialData.currentlyStudying,
				gradeType: initialData.gradeType,
				gradeValue: initialData.gradeValue || "",
				achievements:
					initialData.achievements.length > 0
						? initialData.achievements
						: [],
				coursework:
					initialData.coursework.length > 0
						? initialData.coursework
						: [],
			});
		} else {
			form.reset({
				degree: "",
				institution: "",
				location: "",
				startDate: "",
				endDate: "",
				currentlyStudying: false,
				gradeType: "none",
				gradeValue: "",
				achievements: [],
				coursework: [],
			});
		}
		setCourseworkInput("");
		setAchievementInput("");
	}, [initialData, form]);

	const currentlyStudying = form.watch("currentlyStudying");
	const gradeType = form.watch("gradeType");
	const coursework = form.watch("coursework");
	const achievements = form.watch("achievements");

	// Clear endDate validation when currently studying is checked
	React.useEffect(() => {
		if (currentlyStudying) {
			form.setValue("endDate", "");
			form.clearErrors("endDate");
		}
	}, [currentlyStudying, form]);

	// Clear grade value when grade type changes to none
	React.useEffect(() => {
		if (gradeType === "none") {
			form.setValue("gradeValue", "");
			form.clearErrors("gradeValue");
		}
	}, [gradeType, form]);

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

	// Handle adding a coursework
	const handleAddCoursework = () => {
		const trimmedCoursework = courseworkInput.trim();
		if (trimmedCoursework && !coursework.includes(trimmedCoursework)) {
			const currentCoursework = form.getValues("coursework");
			if (currentCoursework.length < 20) {
				form.setValue("coursework", [
					...currentCoursework,
					trimmedCoursework,
				]);
				setCourseworkInput("");
			}
		}
	};

	// Handle removing a coursework
	const handleRemoveCoursework = (courseworkToRemove: string) => {
		const currentCoursework = form.getValues("coursework");
		form.setValue(
			"coursework",
			currentCoursework.filter((course) => course !== courseworkToRemove)
		);
	};

	// Handle Enter key press for coursework
	const handleCourseworkInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddCoursework();
		}
	};

	// Get grade type label
	const getGradeLabel = () => {
		switch (gradeType) {
			case "gpa":
				return "GPA (0.0 - 5.0)";
			case "cgpa":
				return "CGPA (0.0 - 10.0)";
			case "percentage":
				return "Percentage (0 - 100)";
			case "grade":
				return "Grade (e.g., A+, First Class)";
			case "none":
				return "Not Applicable";
			default:
				return "Grade Value";
		}
	};

	const handleSubmit = async (data: EducationFormValues) => {
		setIsSubmitting(true);
		try {
			const educationData: Education = {
				id: initialData?.id || crypto.randomUUID(),
				order: initialData?.order || 0,
				degree: data.degree,
				institution: data.institution,
				location: data.location,
				startDate: new Date(data.startDate),
				endDate: data.endDate ? new Date(data.endDate) : undefined,
				currentlyStudying: data.currentlyStudying,
				gradeType: data.gradeType,
				gradeValue: data.gradeValue || "",
				achievements: data.achievements.filter((a) => a.trim() !== ""),
				coursework: data.coursework.filter((c) => c.trim() !== ""),
			};
			onSubmit(educationData);
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
								? "Add Education"
								: "Edit Education"}
						</DialogTitle>
						<DialogDescription>
							Add your educational background, achievements, and
							relevant coursework.
						</DialogDescription>
					</DialogHeader>
				</div>

				<Form {...form}>
					<form
						id="education-form"
						onSubmit={form.handleSubmit(handleSubmit)}
						className="flex flex-col"
					>
						<ScrollArea className="flex-1 overflow-auto px-6 py-6 max-h-[calc(90vh-180px)]">
							<div className="space-y-6 pr-2">
								{/* Education Details */}
								<div className="space-y-4">
									<h3 className="text-sm font-semibold">
										Education Details
									</h3>

									<FormField
										control={form.control}
										name="degree"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Degree{" "}
													<span className="text-destructive">
														*
													</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., Bachelor of Science in Computer Science"
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
											name="institution"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Institution{" "}
														<span className="text-destructive">
															*
														</span>
													</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., Stanford University"
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
															placeholder="e.g., Stanford, CA"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
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
														{!currentlyStudying && (
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
																currentlyStudying
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
										name="currentlyStudying"
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
														I currently study here
													</FormLabel>
												</div>
											</FormItem>
										)}
									/>
								</div>

								{/* Grade Information */}
								<div className="space-y-4">
									<h3 className="text-sm font-semibold">
										Grade Information
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="gradeType"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Grade Type
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														value={field.value}
													>
														<FormControl className="w-full">
															<SelectTrigger>
																<SelectValue placeholder="Select grade type" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="none">
																None
															</SelectItem>
															<SelectItem value="gpa">
																GPA (0.0 - 5.0)
															</SelectItem>
															<SelectItem value="cgpa">
																CGPA (0.0 -
																10.0)
															</SelectItem>
															<SelectItem value="percentage">
																Percentage (0 -
																100)
															</SelectItem>
															<SelectItem value="grade">
																Letter Grade
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="gradeValue"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{getGradeLabel()}
														{gradeType !== "none" &&
															!currentlyStudying && (
																<span className="text-destructive">
																	{" "}
																	*
																</span>
															)}
													</FormLabel>
													<FormControl>
														<Input
															placeholder={
																gradeType ===
																"gpa"
																	? "e.g., 3.8"
																	: gradeType ===
																	  "cgpa"
																	? "e.g., 8.5"
																	: gradeType ===
																	  "percentage"
																	? "e.g., 85"
																	: gradeType ===
																	  "grade"
																	? "e.g., A+ or First Class"
																	: "Not applicable"
															}
															{...field}
															disabled={
																gradeType ===
																"none"
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								{/* Achievements */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-sm font-semibold">
											Achievements & Honors (Optional)
										</h3>
										<span className="text-xs text-muted-foreground">
											{achievements.length}/10
										</span>
									</div>

									{/* Input for adding achievements */}
									<div className="flex gap-2">
										<Input
											placeholder="e.g., Dean's List, Academic Excellence Award..."
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
									{achievements.length > 0 ? (
										<div className="space-y-2">
											{achievements.map(
												(achievement, index) => (
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
												)
											)}
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

								{/* Coursework */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-sm font-semibold">
											Relevant Coursework (Optional)
										</h3>
										<span className="text-xs text-muted-foreground">
											{coursework.length}/20
										</span>
									</div>

									{/* Input for adding coursework */}
									<div className="flex gap-2">
										<Input
											placeholder="e.g., Data Structures, Machine Learning..."
											value={courseworkInput}
											onChange={(e) =>
												setCourseworkInput(
													e.target.value
												)
											}
											onKeyDown={
												handleCourseworkInputKeyDown
											}
											disabled={coursework.length >= 20}
										/>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleAddCoursework}
											disabled={
												!courseworkInput.trim() ||
												coursework.length >= 20
											}
										>
											<Plus className="h-4 w-4 mr-2" />
											Add
										</Button>
									</div>

									{/* Display coursework as badges */}
									{coursework.length > 0 ? (
										<div className="flex flex-wrap gap-2 rounded-md bg-muted/30">
											{coursework.map((course, index) => (
												<Badge
													key={index}
													className="pl-3 pr-1 py-1 text-sm gap-1"
												>
													<span>{course}</span>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="h-4 w-4 p-0 hover:bg-transparent hover:text-destructive"
														onClick={() =>
															handleRemoveCoursework(
																course
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
											No coursework added yet. Type a
											course name and press Enter or click
											Add.
										</div>
									)}

									<FormField
										control={form.control}
										name="coursework"
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
									form="education-form"
									disabled={isSubmitting}
								>
									{isSubmitting
										? "Saving..."
										: mode === "add"
										? "Add Education"
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
