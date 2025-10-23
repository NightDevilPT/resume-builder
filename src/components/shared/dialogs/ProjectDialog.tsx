// components/shared/dialogs/ProjectDialog.tsx
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
	projectSchema,
	type ProjectFormValues,
} from "@/lib/validations/project";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/interfaces/resume";
import { Plus, X, Link2, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm, useFieldArray } from "react-hook-form";
import { DatePicker } from "@/components/shared/date-picker";

interface ProjectDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: Project) => void;
	initialData?: Project;
	mode?: "add" | "edit";
}

export function ProjectDialog({
	open,
	onOpenChange,
	onSubmit,
	initialData,
	mode = "add",
}: ProjectDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [technologyInput, setTechnologyInput] = useState("");
	const [highlightInput, setHighlightInput] = useState("");

	const form = useForm<ProjectFormValues>({
		resolver: zodResolver(projectSchema) as any,
		mode: "onBlur",
		defaultValues: {
			name: "",
			subtitle: "",
			description: "",
			technologies: [],
			links: [],
			startDate: "",
			endDate: "",
			currentlyWorking: false,
			highlights: [],
		},
	});

	const {
		fields: linkFields,
		append: appendLink,
		remove: removeLink,
	} = useFieldArray({
		control: form.control,
		name: "links",
	});

	// Update form when initialData changes
	React.useEffect(() => {
		if (initialData) {
			form.reset({
				name: initialData.name,
				subtitle: initialData.subtitle || "",
				description: initialData.description || "",
				technologies:
					initialData.technologies.length > 0
						? initialData.technologies
						: [],
				links: initialData.links || [],
				startDate:
					initialData.startDate?.toISOString().split("T")[0] || "",
				endDate: initialData.endDate?.toISOString().split("T")[0] || "",
				currentlyWorking: initialData.currentlyWorking,
				highlights:
					initialData.highlights.length > 0
						? initialData.highlights
						: [],
			});
		} else {
			form.reset({
				name: "",
				subtitle: "",
				description: "",
				technologies: [],
				links: [],
				startDate: "",
				endDate: "",
				currentlyWorking: false,
				highlights: [],
			});
		}
		setTechnologyInput("");
		setHighlightInput("");
	}, [initialData, form]);

	const currentlyWorking = form.watch("currentlyWorking");
	const technologies = form.watch("technologies");
	const highlights = form.watch("highlights");

	// Clear endDate validation when currently working is checked
	React.useEffect(() => {
		if (currentlyWorking) {
			form.setValue("endDate", "");
			form.clearErrors("endDate");
		}
	}, [currentlyWorking, form]);

	// Handle adding a highlight
	const handleAddHighlight = () => {
		const trimmedHighlight = highlightInput.trim();
		if (trimmedHighlight) {
			const currentHighlights = form.getValues("highlights");
			if (currentHighlights.length < 10) {
				form.setValue("highlights", [
					...currentHighlights,
					trimmedHighlight,
				]);
				setHighlightInput("");
			}
		}
	};

	// Handle removing a highlight
	const handleRemoveHighlight = (highlightToRemove: string) => {
		const currentHighlights = form.getValues("highlights");
		form.setValue(
			"highlights",
			currentHighlights.filter(
				(highlight) => highlight !== highlightToRemove
			)
		);
	};

	// Handle Enter key press for highlights
	const handleHighlightInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddHighlight();
		}
	};

	// Handle adding a technology
	const handleAddTechnology = () => {
		const trimmedTechnology = technologyInput.trim();
		if (trimmedTechnology && !technologies.includes(trimmedTechnology)) {
			const currentTechnologies = form.getValues("technologies");
			if (currentTechnologies.length < 20) {
				form.setValue("technologies", [
					...currentTechnologies,
					trimmedTechnology,
				]);
				setTechnologyInput("");
			}
		}
	};

	// Handle removing a technology
	const handleRemoveTechnology = (technologyToRemove: string) => {
		const currentTechnologies = form.getValues("technologies");
		form.setValue(
			"technologies",
			currentTechnologies.filter((tech) => tech !== technologyToRemove)
		);
	};

	// Handle Enter key press for technologies
	const handleTechnologyInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddTechnology();
		}
	};

	const handleSubmit = async (data: ProjectFormValues) => {
		setIsSubmitting(true);
		try {
			const projectData: Project = {
				id: initialData?.id || crypto.randomUUID(),
				order: initialData?.order || 0,
				name: data.name,
				subtitle: data.subtitle || "",
				description: data.description || "",
				technologies: data.technologies.filter((t) => t.trim() !== ""),
				links: data.links || [],
				startDate: new Date(data.startDate),
				endDate: data.endDate ? new Date(data.endDate) : undefined,
				currentlyWorking: data.currentlyWorking,
				highlights: data.highlights.filter((h) => h.trim() !== ""),
			};
			onSubmit(projectData);
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
							{mode === "add" ? "Add Project" : "Edit Project"}
						</DialogTitle>
						<DialogDescription>
							Add projects, initiatives, campaigns, case studies,
							or any significant work you&apos;ve completed.
						</DialogDescription>
					</DialogHeader>
				</div>

				<Form {...form}>
					<form
						id="project-form"
						onSubmit={form.handleSubmit(handleSubmit)}
						className="flex flex-col"
					>
						<ScrollArea className="flex-1 overflow-auto px-6 py-6 max-h-[calc(90vh-180px)]">
							<div className="space-y-6 pr-2">
								{/* Project Details */}
								<div className="space-y-4">
									<h3 className="text-sm font-semibold">
										Project Details
									</h3>

									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Project/Initiative Name{" "}
													<span className="text-destructive">
														*
													</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., Annual Budget Analysis, Product Launch Campaign, ERP Implementation"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Subtitle/Tagline (Optional)
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., Cost Reduction Initiative, Brand Awareness Campaign"
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
												<FormLabel>
													Description (Optional)
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Brief description of the project, campaign, or initiative..."
														className="min-h-[80px] resize-none"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Project Links */}
								<div className="space-y-4">
									<div className="flex items-start justify-between gap-4">
										<div className="flex items-start gap-2">
											<Link2 className="h-4 w-4 text-primary mt-1" />
											<div>
												<h3 className="text-sm font-semibold">
													Project Links (Optional)
												</h3>
												<p className="text-xs text-muted-foreground">
													Add links to live project,
													GitHub, demo, etc. (max 5)
												</p>
											</div>
										</div>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												appendLink({
													label: "",
													url: "",
												})
											}
											disabled={linkFields.length >= 5}
										>
											<Plus className="h-4 w-4 mr-2" />
											Add
										</Button>
									</div>

									{linkFields.length === 0 ? (
										<div className="text-center py-4 text-sm text-muted-foreground border rounded-md bg-muted/20">
											No links added yet. Click
											&quot;Add&quot; to include project
											links.
										</div>
									) : (
										<div className="space-y-3">
											{linkFields.map((field, index) => (
												<div
													key={field.id}
													className="flex gap-3"
												>
													<FormField
														control={form.control}
														name={`links.${index}.label`}
														render={({ field }) => (
															<FormItem className="flex-1">
																{index ===
																	0 && (
																	<FormLabel>
																		Label{" "}
																		<span className="text-destructive">
																			*
																		</span>
																	</FormLabel>
																)}
																<FormControl>
																	<Input
																		placeholder="e.g., Live Site, GitHub, Demo"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name={`links.${index}.url`}
														render={({ field }) => (
															<FormItem className="flex-[2]">
																{index ===
																	0 && (
																	<FormLabel>
																		URL{" "}
																		<span className="text-destructive">
																			*
																		</span>
																	</FormLabel>
																)}
																<FormControl>
																	<Input
																		placeholder="https://example.com"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<Button
														type="button"
														variant="ghost"
														size="icon"
														className={
															index === 0
																? "mt-8"
																: ""
														}
														onClick={() =>
															removeLink(index)
														}
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											))}
										</div>
									)}
								</div>

								{/* Timeline */}
								<div className="space-y-4">
									<h3 className="text-sm font-semibold">
										Timeline
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
														Currently working on
														this project
													</FormLabel>
												</div>
											</FormItem>
										)}
									/>
								</div>

								{/* Technologies/Tools */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-sm font-semibold">
											Tools & Skills Used{" "}
											<span className="text-destructive">
												*
											</span>
										</h3>
										<span className="text-xs text-muted-foreground">
											{
												technologies.filter((t) =>
													t.trim()
												).length
											}
											/20
										</span>
									</div>

									{/* Input for adding technologies */}
									<div className="flex gap-2">
										<Input
											placeholder="e.g., Excel, SAP, Google Analytics, Salesforce, React, Python..."
											value={technologyInput}
											onChange={(e) =>
												setTechnologyInput(
													e.target.value
												)
											}
											onKeyDown={
												handleTechnologyInputKeyDown
											}
											disabled={technologies.length >= 20}
										/>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleAddTechnology}
											disabled={
												!technologyInput.trim() ||
												technologies.length >= 20
											}
										>
											<Plus className="h-4 w-4 mr-2" />
											Add
										</Button>
									</div>

									{/* Display technologies as badges */}
									{technologies.filter((t) => t.trim())
										.length > 0 ? (
										<div className="flex flex-wrap gap-2 rounded-md bg-muted/30">
											{technologies
												.filter((t) => t.trim())
												.map((tech, index) => (
													<Badge
														key={index}
														className="pl-3 pr-1 py-1 text-sm gap-1"
													>
														<span>{tech}</span>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															className="h-4 w-4 p-0 hover:bg-transparent hover:text-destructive"
															onClick={() =>
																handleRemoveTechnology(
																	tech
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
											No tools/skills added yet. Add the
											software, tools, or skills you used
											for this project.
										</div>
									)}

									<FormField
										control={form.control}
										name="technologies"
										render={() => (
											<FormItem>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Highlights */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-sm font-semibold">
											Key Highlights & Achievements{" "}
											<span className="text-destructive">
												*
											</span>
										</h3>
										<span className="text-xs text-muted-foreground">
											{
												highlights.filter((h) =>
													h.trim()
												).length
											}
											/10
										</span>
									</div>

									{/* Input for adding highlights */}
									<div className="flex gap-2">
										<Input
											placeholder="e.g., Increased sales by 40%, Reduced costs by $50K, Improved customer satisfaction by 25%..."
											value={highlightInput}
											onChange={(e) =>
												setHighlightInput(
													e.target.value
												)
											}
											onKeyDown={
												handleHighlightInputKeyDown
											}
											disabled={highlights.length >= 10}
										/>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleAddHighlight}
											disabled={
												!highlightInput.trim() ||
												highlights.length >= 10
											}
										>
											<Plus className="h-4 w-4 mr-2" />
											Add
										</Button>
									</div>

									{/* Display highlights as list */}
									{highlights.filter((h) => h.trim()).length >
									0 ? (
										<div className="space-y-2">
											{highlights
												.filter((h) => h.trim())
												.map((highlight, index) => (
													<div
														key={index}
														className="flex items-start gap-3 px-3 py-1 border rounded-md bg-card hover:bg-accent/50 transition-colors group"
													>
														<div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
														<p className="flex-1 text-sm leading-relaxed">
															{highlight}
														</p>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
															onClick={() =>
																handleRemoveHighlight(
																	highlight
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
											No highlights added yet. Type a
											highlight and press Enter or click
											Add.
										</div>
									)}

									<FormField
										control={form.control}
										name="highlights"
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
									form="project-form"
									disabled={isSubmitting}
								>
									{isSubmitting
										? "Saving..."
										: mode === "add"
										? "Add Project"
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
