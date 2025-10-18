"use client";

import {
	EducationFormValues,
	educationSchema,
} from "@/lib/validations/education";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Education } from "@/interfaces/resume";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/shared/date-picker";

interface EducationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	education?: Education;
	onSave: (data: EducationFormValues) => void;
}

export function EducationDialog({
	open,
	onOpenChange,
	education,
	onSave,
}: EducationDialogProps) {
	const [achievementInput, setAchievementInput] = useState("");
	const [courseInput, setCourseInput] = useState("");

	const form = useForm<EducationFormValues>({
		resolver: zodResolver(educationSchema),
		defaultValues: education
			? {
					degree: education.degree,
					institution: education.institution,
					location: education.location,
					startDate: education.startDate.toISOString().split("T")[0],
					endDate: education.endDate
						? education.endDate.toISOString().split("T")[0]
						: "",
					currentlyStudying: education.currentlyStudying,
					gradeType: education.gradeType,
					gradeValue: education.gradeValue || "",
					achievements: education.achievements,
					coursework: education.coursework,
			  }
			: {
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
		mode: "onChange",
	});

	const currentlyStudying = form.watch("currentlyStudying");
	const gradeType = form.watch("gradeType");
	const achievements = form.watch("achievements");
	const coursework = form.watch("coursework");

	// Update form when education prop changes
	useEffect(() => {
		if (education && open) {
			form.reset({
				degree: education.degree,
				institution: education.institution,
				location: education.location,
				startDate: education.startDate.toISOString().split("T")[0],
				endDate: education.endDate
					? education.endDate.toISOString().split("T")[0]
					: "",
				currentlyStudying: education.currentlyStudying,
				gradeType: education.gradeType,
				gradeValue: education.gradeValue || "",
				achievements: education.achievements,
				coursework: education.coursework,
			});
		} else if (!education && open) {
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
	}, [education, open, form]);

	const handleSubmit = (data: EducationFormValues) => {
		onSave(data);
		onOpenChange(false);
		setAchievementInput("");
		setCourseInput("");
		form.reset();
	};

	// Reset form when dialog opens/closes
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			form.reset();
			setAchievementInput("");
			setCourseInput("");
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

	const addCourse = () => {
		if (courseInput.trim()) {
			form.setValue("coursework", [...coursework, courseInput.trim()], {
				shouldValidate: true,
			});
			setCourseInput("");
		}
	};

	const removeCourse = (index: number) => {
		form.setValue(
			"coursework",
			coursework.filter((_, i) => i !== index),
			{ shouldValidate: true }
		);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{education ? "Edit Education" : "Add Education"}
					</DialogTitle>
					<DialogDescription>
						Fill in the details about your educational background
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="degree"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Degree *</FormLabel>
									<FormControl>
										<Input
											placeholder="Bachelor of Science in Computer Science"
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
										<FormLabel>Institution *</FormLabel>
										<FormControl>
											<Input
												placeholder="University of..."
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
										<FormLabel>Location *</FormLabel>
										<FormControl>
											<Input
												placeholder="Berkeley, CA"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

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

							{!currentlyStudying && (
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
							name="currentlyStudying"
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
													form.setValue(
														"gradeValue",
														""
													);
												}
												// Trigger full form validation
												await form.trigger();
											}}
										/>
									</FormControl>
									<FormLabel className="!mt-0 cursor-pointer">
										I currently study here
									</FormLabel>
								</FormItem>
							)}
						/>

						{!currentlyStudying && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="gradeType"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Grade Type</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select grade type" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="none">
														None
													</SelectItem>
													<SelectItem value="gpa">
														GPA (out of 4.0/5.0)
													</SelectItem>
													<SelectItem value="cgpa">
														CGPA (out of 10.0)
													</SelectItem>
													<SelectItem value="percentage">
														Percentage
													</SelectItem>
													<SelectItem value="grade">
														Grade/Class
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								{gradeType !== "none" && (
									<FormField
										control={form.control}
										name="gradeValue"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Grade Value
												</FormLabel>
												<FormControl>
													<Input
														placeholder={
															gradeType === "gpa"
																? "3.8"
																: gradeType ===
																  "cgpa"
																? "8.5"
																: gradeType ===
																  "percentage"
																? "85"
																: "First Class"
														}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
							</div>
						)}

						<div>
							<Label>Achievements (Optional)</Label>
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
							<Label>Relevant Coursework (Optional)</Label>
							<div className="flex gap-2 mt-2">
								<Input
									placeholder="Add a course"
									value={courseInput}
									onChange={(e) =>
										setCourseInput(e.target.value)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addCourse();
										}
									}}
								/>
								<Button
									type="button"
									onClick={addCourse}
									disabled={!courseInput.trim()}
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							{coursework.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-3">
									{coursework.map((course, idx) => (
										<Badge key={idx} variant="secondary">
											{course}
											<button
												type="button"
												onClick={() =>
													removeCourse(idx)
												}
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
								{education ? "Update" : "Add"} Education
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
