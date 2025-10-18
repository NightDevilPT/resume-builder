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
import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Project } from "@/interfaces/resume";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/shared/date-picker";
import { ProjectFormValues, projectSchema } from "@/lib/validations/project";

interface ProjectDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	project?: Project;
	onSave: (data: ProjectFormValues) => void;
}

export function ProjectDialog({
	open,
	onOpenChange,
	project,
	onSave,
}: ProjectDialogProps) {
	const [highlightInput, setHighlightInput] = useState("");
	const [technologyInput, setTechnologyInput] = useState("");

	const form = useForm<ProjectFormValues>({
		resolver: zodResolver(projectSchema),
		defaultValues: project
			? {
					name: project.name,
					description: project.description,
					technologies: project.technologies,
					projectUrl: project.projectUrl || "",
					githubUrl: project.githubUrl || "",
					startDate: project.startDate.toISOString().split("T")[0],
					endDate: project.endDate
						? project.endDate.toISOString().split("T")[0]
						: "",
					currentlyWorking: project.currentlyWorking,
					highlights: project.highlights,
			  }
			: {
					name: "",
					description: "",
					technologies: [],
					projectUrl: "",
					githubUrl: "",
					startDate: "",
					endDate: "",
					currentlyWorking: false,
					highlights: [],
			  },
		mode: "onChange",
	});

	const highlights = form.watch("highlights");
	const technologies = form.watch("technologies");
	const currentlyWorking = form.watch("currentlyWorking");

	// Update form when project prop changes
	useEffect(() => {
		if (project && open) {
			form.reset({
				name: project.name,
				description: project.description,
				technologies: project.technologies,
				projectUrl: project.projectUrl || "",
				githubUrl: project.githubUrl || "",
				startDate: project.startDate.toISOString().split("T")[0],
				endDate: project.endDate
					? project.endDate.toISOString().split("T")[0]
					: "",
				currentlyWorking: project.currentlyWorking,
				highlights: project.highlights,
			});
		} else if (!project && open) {
			form.reset({
				name: "",
				description: "",
				technologies: [],
				projectUrl: "",
				githubUrl: "",
				startDate: "",
				endDate: "",
				currentlyWorking: false,
				highlights: [],
			});
		}
	}, [project, open, form]);

	const handleSubmit = (data: ProjectFormValues) => {
		onSave(data);
		onOpenChange(false);
		setHighlightInput("");
		setTechnologyInput("");
		form.reset();
	};

	// Reset form when dialog opens/closes
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			form.reset();
			setHighlightInput("");
			setTechnologyInput("");
		}
		onOpenChange(open);
	};

	const addHighlight = () => {
		if (highlightInput.trim()) {
			form.setValue(
				"highlights",
				[...highlights, highlightInput.trim()],
				{
					shouldValidate: true,
				}
			);
			setHighlightInput("");
		}
	};

	const removeHighlight = (index: number) => {
		form.setValue(
			"highlights",
			highlights.filter((_, i) => i !== index),
			{ shouldValidate: true }
		);
	};

	const addTechnology = () => {
		if (technologyInput.trim()) {
			form.setValue(
				"technologies",
				[...technologies, technologyInput.trim()],
				{
					shouldValidate: true,
				}
			);
			setTechnologyInput("");
		}
	};

	const removeTechnology = (index: number) => {
		form.setValue(
			"technologies",
			technologies.filter((_, i) => i !== index),
			{ shouldValidate: true }
		);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{project ? "Edit Project" : "Add Project"}
					</DialogTitle>
					<DialogDescription>
						Showcase your work, portfolio, or significant
						initiatives
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
									<FormLabel>Project Name *</FormLabel>
									<FormControl>
										<Input
											placeholder="E-commerce Platform"
											{...field}
										/>
									</FormControl>
									<FormMessage />
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
											placeholder="Brief description of the project..."
											className="resize-none"
											rows={3}
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
										I currently work on this project
									</FormLabel>
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="projectUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Project URL (Optional)
										</FormLabel>
										<FormControl>
											<Input
												placeholder="https://project.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="githubUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											GitHub URL (Optional)
										</FormLabel>
										<FormControl>
											<Input
												placeholder="https://github.com/..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div>
							<Label>Technologies/Tools Used *</Label>
							<div className="flex gap-2 mt-2">
								<Input
									placeholder="React, Node.js, AWS..."
									value={technologyInput}
									onChange={(e) =>
										setTechnologyInput(e.target.value)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addTechnology();
										}
									}}
								/>
								<Button
									type="button"
									onClick={addTechnology}
									disabled={!technologyInput.trim()}
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							{technologies.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-3">
									{technologies.map((tech, idx) => (
										<Badge key={idx} variant="secondary">
											{tech}
											<button
												type="button"
												onClick={() =>
													removeTechnology(idx)
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

						<div>
							<Label>Key Highlights *</Label>
							<div className="flex gap-2 mt-2">
								<Input
									placeholder="Add a highlight"
									value={highlightInput}
									onChange={(e) =>
										setHighlightInput(e.target.value)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addHighlight();
										}
									}}
								/>
								<Button
									type="button"
									onClick={addHighlight}
									disabled={!highlightInput.trim()}
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							{highlights.length > 0 && (
								<div className="space-y-2 mt-3">
									{highlights.map((highlight, idx) => (
										<div
											key={idx}
											className="flex items-center gap-2 text-sm bg-muted p-2 rounded"
										>
											<span className="flex-1">
												{highlight}
											</span>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() =>
													removeHighlight(idx)
												}
											>
												<X className="h-3 w-3" />
											</Button>
										</div>
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
								{project ? "Update" : "Add"} Project
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
