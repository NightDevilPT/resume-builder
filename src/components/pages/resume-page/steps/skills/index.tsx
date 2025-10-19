// components/pages/resume-page/steps/skills/index.tsx
"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { useForm, useFieldArray } from "react-hook-form";
import { Code, Plus, Trash2, X, Languages } from "lucide-react";
import { useResume } from "@/components/providers/resume-form-provider";
import { skillsSchema, type SkillsFormValues } from "@/lib/validations/skills";

export function SkillsPage() {
	const { resumeData, dispatch, nextStep } = useResume();
	const [technicalInput, setTechnicalInput] = useState("");
	const [softInput, setSoftInput] = useState("");

	const form = useForm<SkillsFormValues>({
		resolver: zodResolver(skillsSchema),
		mode: "onBlur",
		defaultValues: {
			technical: resumeData.skills.technical || [],
			soft: resumeData.skills.soft || [],
			languages:
				resumeData.skills.languages.length > 0
					? resumeData.skills.languages
					: [{ language: "", proficiency: "Professional" }],
		},
	});

	const {
		fields: languageFields,
		append: appendLanguage,
		remove: removeLanguage,
	} = useFieldArray({
		control: form.control,
		name: "languages",
	});

	const technicalSkills = form.watch("technical");
	const softSkills = form.watch("soft");

	// Handle adding technical skill
	const handleAddTechnicalSkill = () => {
		const trimmedSkill = technicalInput.trim();
		if (trimmedSkill && !technicalSkills.includes(trimmedSkill)) {
			const currentSkills = form.getValues("technical");
			if (currentSkills.length < 30) {
				form.setValue("technical", [...currentSkills, trimmedSkill]);
				setTechnicalInput("");
			}
		}
	};

	// Handle removing technical skill
	const handleRemoveTechnicalSkill = (skillToRemove: string) => {
		const currentSkills = form.getValues("technical");
		form.setValue(
			"technical",
			currentSkills.filter((skill) => skill !== skillToRemove)
		);
	};

	// Handle Enter key for technical skills
	const handleTechnicalKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddTechnicalSkill();
		}
	};

	// Handle adding soft skill
	const handleAddSoftSkill = () => {
		const trimmedSkill = softInput.trim();
		if (trimmedSkill && !softSkills.includes(trimmedSkill)) {
			const currentSkills = form.getValues("soft");
			if (currentSkills.length < 20) {
				form.setValue("soft", [...currentSkills, trimmedSkill]);
				setSoftInput("");
			}
		}
	};

	// Handle removing soft skill
	const handleRemoveSoftSkill = (skillToRemove: string) => {
		const currentSkills = form.getValues("soft");
		form.setValue(
			"soft",
			currentSkills.filter((skill) => skill !== skillToRemove)
		);
	};

	// Handle Enter key for soft skills
	const handleSoftKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddSoftSkill();
		}
	};

	const onSubmit = (data: SkillsFormValues) => {
		// Filter out empty language entries
		const filteredLanguages = data.languages.filter(
			(lang) => lang.language.trim() !== ""
		);

		dispatch({
			type: "UPDATE_SKILLS",
			payload: {
				technical: data.technical.filter((s) => s.trim() !== ""),
				soft: data.soft.filter((s) => s.trim() !== ""),
				languages: filteredLanguages,
			},
		});
		nextStep();
	};

	const onError = () => {
		console.log("Form validation failed");
	};

	return (
		<div className="w-full h-full flex flex-col">
			<div className="flex-1 px-4">
				<div className="max-w-3xl mx-auto">
					{/* Header Card */}
					<Card className="p-0 border-none shadow-none">
						<CardHeader className="px-0">
							<div className="flex items-start gap-4">
								<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
									<Code className="h-6 w-6 text-primary" />
								</div>
								<div className="flex-1">
									<CardTitle className="text-xl">
										Skills & Languages
									</CardTitle>
									<CardDescription>
										Showcase your technical skills, soft
										skills, and language proficiencies
									</CardDescription>
								</div>
							</div>
						</CardHeader>
					</Card>
					<Separator />

					{/* Form Section */}
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit, onError)}
							className="space-y-6 mt-6"
						>
							{/* Technical Skills Card */}
							<Card className="p-0 pt-4">
								<CardHeader>
									<CardTitle>Technical Skills</CardTitle>
									<CardDescription>
										Programming languages, frameworks,
										tools, and technologies
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<FormLabel>
											Add Skills{" "}
											<span className="text-destructive">
												*
											</span>
										</FormLabel>
										<span className="text-xs text-muted-foreground">
											{technicalSkills.length}/30
										</span>
									</div>

									{/* Input for adding technical skills */}
									<div className="flex gap-2">
										<Input
											placeholder="e.g., React, Python, Docker..."
											value={technicalInput}
											onChange={(e) =>
												setTechnicalInput(
													e.target.value
												)
											}
											onKeyDown={handleTechnicalKeyDown}
											disabled={
												technicalSkills.length >= 30
											}
										/>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleAddTechnicalSkill}
											disabled={
												!technicalInput.trim() ||
												technicalSkills.length >= 30
											}
										>
											<Plus className="h-4 w-4 mr-2" />
											Add
										</Button>
									</div>

									{/* Display technical skills as badges */}
									{technicalSkills.length > 0 ? (
										<div className="flex flex-wrap gap-2 rounded-md bg-muted/30">
											{technicalSkills.map(
												(skill, index) => (
													<Badge
														key={index}
														variant="secondary"
														className="pl-3 pr-1 py-1 text-sm gap-1"
													>
														<span>{skill}</span>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															className="h-4 w-4 p-0 hover:bg-transparent hover:text-destructive"
															onClick={() =>
																handleRemoveTechnicalSkill(
																	skill
																)
															}
														>
															<X className="h-3 w-3" />
														</Button>
													</Badge>
												)
											)}
										</div>
									) : (
										<div className="p-4 border rounded-md bg-muted/20 text-center text-sm text-muted-foreground">
											No technical skills added yet. Type
											a skill and press Enter or click
											Add.
										</div>
									)}

									<FormField
										control={form.control}
										name="technical"
										render={() => (
											<FormItem>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Soft Skills Card */}
							<Card className="p-0 pt-4">
								<CardHeader>
									<CardTitle>Soft Skills</CardTitle>
									<CardDescription>
										Communication, leadership, teamwork, and
										interpersonal skills
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<FormLabel>
											Add Skills{" "}
											<span className="text-destructive">
												*
											</span>
										</FormLabel>
										<span className="text-xs text-muted-foreground">
											{softSkills.length}/20
										</span>
									</div>

									{/* Input for adding soft skills */}
									<div className="flex gap-2">
										<Input
											placeholder="e.g., Leadership, Communication, Problem Solving..."
											value={softInput}
											onChange={(e) =>
												setSoftInput(e.target.value)
											}
											onKeyDown={handleSoftKeyDown}
											disabled={softSkills.length >= 20}
										/>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleAddSoftSkill}
											disabled={
												!softInput.trim() ||
												softSkills.length >= 20
											}
										>
											<Plus className="h-4 w-4 mr-2" />
											Add
										</Button>
									</div>

									{/* Display soft skills as badges */}
									{softSkills.length > 0 ? (
										<div className="flex flex-wrap gap-2 rounded-md bg-muted/30">
											{softSkills.map((skill, index) => (
												<Badge
													key={index}
													variant="secondary"
													className="pl-3 pr-1 py-1 text-sm gap-1"
												>
													<span>{skill}</span>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="h-4 w-4 p-0 hover:bg-transparent hover:text-destructive"
														onClick={() =>
															handleRemoveSoftSkill(
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
											No soft skills added yet. Type a
											skill and press Enter or click Add.
										</div>
									)}

									<FormField
										control={form.control}
										name="soft"
										render={() => (
											<FormItem>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Languages Card */}
							<Card>
								<CardHeader>
									<div className="flex items-start justify-between gap-4">
										<div className="flex items-start gap-3">
											<Languages className="h-5 w-5 text-primary mt-0.5" />
											<div>
												<CardTitle>Languages</CardTitle>
												<CardDescription>
													Languages you speak and your
													proficiency level (max 10)
												</CardDescription>
											</div>
										</div>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												appendLanguage({
													language: "",
													proficiency: "Professional",
												})
											}
											disabled={
												languageFields.length >= 10
											}
										>
											<Plus className="h-4 w-4 mr-2" />
											Add
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									{languageFields.length === 0 ? (
										<div className="text-center py-6 text-sm text-muted-foreground">
											No languages added yet. Click
											&quot;Add&quot; to include language
											proficiencies.
										</div>
									) : (
										languageFields.map((field, index) => (
											<div
												key={field.id}
												className="flex gap-3"
											>
												<FormField
													control={form.control}
													name={`languages.${index}.language`}
													render={({ field }) => (
														<FormItem className="flex-[2]">
															{index === 0 && (
																<FormLabel>
																	Language{" "}
																	<span className="text-destructive">
																		*
																	</span>
																</FormLabel>
															)}
															<FormControl>
																<Input
																	placeholder="e.g., English"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name={`languages.${index}.proficiency`}
													render={({ field }) => (
														<FormItem className="flex-1">
															{index === 0 && (
																<FormLabel>
																	Proficiency{" "}
																	<span className="text-destructive">
																		*
																	</span>
																</FormLabel>
															)}
															<Select
																onValueChange={
																	field.onChange
																}
																value={
																	field.value
																}
															>
																<FormControl>
																	<SelectTrigger>
																		<SelectValue placeholder="Select level" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	<SelectItem value="Native">
																		Native
																	</SelectItem>
																	<SelectItem value="Fluent">
																		Fluent
																	</SelectItem>
																	<SelectItem value="Professional">
																		Professional
																	</SelectItem>
																	<SelectItem value="Basic">
																		Basic
																	</SelectItem>
																</SelectContent>
															</Select>
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
														removeLanguage(index)
													}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										))
									)}
								</CardContent>
							</Card>

							{/* Continue Button */}
							<div className="pb-6">
								<Button type="submit" className="w-full">
									Continue to Next Step
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
