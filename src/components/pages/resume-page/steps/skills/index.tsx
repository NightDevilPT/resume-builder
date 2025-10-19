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
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { useForm, useFieldArray } from "react-hook-form";
import { Code, Plus, Trash2, X, Languages, Star } from "lucide-react";
import { useResume } from "@/components/providers/resume-form-provider";
import { skillsSchema, type SkillsFormValues } from "@/lib/validations/skills";

export function SkillsPage() {
	const { resumeData, dispatch, nextStep } = useResume();
	const [technicalInput, setTechnicalInput] = useState("");
	const [technicalLevel, setTechnicalLevel] = useState(5);
	const [softInput, setSoftInput] = useState("");
	const [softLevel, setSoftLevel] = useState(5);

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
		if (trimmedSkill) {
			const currentSkills = form.getValues("technical");
			const skillExists = currentSkills.some(
				(s) => s.name === trimmedSkill
			);
			if (!skillExists && currentSkills.length < 30) {
				form.setValue("technical", [
					...currentSkills,
					{ name: trimmedSkill, level: technicalLevel },
				]);
				setTechnicalInput("");
				setTechnicalLevel(5);
			}
		}
	};

	// Handle removing technical skill
	const handleRemoveTechnicalSkill = (skillName: string) => {
		const currentSkills = form.getValues("technical");
		form.setValue(
			"technical",
			currentSkills.filter((skill) => skill.name !== skillName)
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
		if (trimmedSkill) {
			const currentSkills = form.getValues("soft");
			const skillExists = currentSkills.some(
				(s) => s.name === trimmedSkill
			);
			if (!skillExists && currentSkills.length < 20) {
				form.setValue("soft", [
					...currentSkills,
					{ name: trimmedSkill, level: softLevel },
				]);
				setSoftInput("");
				setSoftLevel(5);
			}
		}
	};

	// Handle removing soft skill
	const handleRemoveSoftSkill = (skillName: string) => {
		const currentSkills = form.getValues("soft");
		form.setValue(
			"soft",
			currentSkills.filter((skill) => skill.name !== skillName)
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
				technical: data.technical.filter((s) => s.name.trim() !== ""),
				soft: data.soft.filter((s) => s.name.trim() !== ""),
				languages: filteredLanguages,
			},
		});
		nextStep();
	};

	const onError = () => {
		console.log("Form validation failed");
	};

	return (
		<div className="w-full">
			<div className="px-4">
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
							<Card>
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
									<div className="space-y-3">
										<div className="flex gap-2">
											<Input
												placeholder="e.g., React, Python, Docker..."
												value={technicalInput}
												onChange={(e) =>
													setTechnicalInput(
														e.target.value
													)
												}
												onKeyDown={
													handleTechnicalKeyDown
												}
												disabled={
													technicalSkills.length >= 30
												}
												className="flex-1"
											/>
											<div className="flex items-center gap-2 min-w-[120px]">
												<Input
													type="number"
													min="1"
													max="10"
													value={technicalLevel}
													onChange={(e) =>
														setTechnicalLevel(
															Number(
																e.target.value
															)
														)
													}
													className="w-16 text-center"
												/>
												<span className="text-xs text-muted-foreground">
													/10
												</span>
											</div>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={
													handleAddTechnicalSkill
												}
												disabled={
													!technicalInput.trim() ||
													technicalSkills.length >= 30
												}
											>
												<Plus className="h-4 w-4 mr-2" />
												Add
											</Button>
										</div>
										<p className="text-xs text-muted-foreground">
											Rate your proficiency level from 1
											(beginner) to 10 (expert)
										</p>
									</div>

									{/* Display technical skills with levels */}
									{technicalSkills.length > 0 ? (
										<div className="space-y-2">
											{technicalSkills.map(
												(skill, index) => (
													<div
														key={index}
														className="flex items-center gap-3 p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors group"
													>
														<span className="flex-1 text-sm font-medium">
															{skill.name}
														</span>
														<div className="flex items-center gap-2">
															<div className="flex gap-0.5">
																{Array.from({
																	length: 10,
																}).map(
																	(_, i) => (
																		<Star
																			key={
																				i
																			}
																			className={`h-3 w-3 ${
																				i <
																				skill.level
																					? "fill-primary text-primary"
																					: "text-muted-foreground/30"
																			}`}
																		/>
																	)
																)}
															</div>
															<span className="text-xs font-semibold text-muted-foreground min-w-[30px]">
																{skill.level}/10
															</span>
														</div>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
															onClick={() =>
																handleRemoveTechnicalSkill(
																	skill.name
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
											No technical skills added yet. Type
											a skill, set the level, and click
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
							<Card>
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
									<div className="space-y-3">
										<div className="flex gap-2">
											<Input
												placeholder="e.g., Leadership, Communication, Problem Solving..."
												value={softInput}
												onChange={(e) =>
													setSoftInput(e.target.value)
												}
												onKeyDown={handleSoftKeyDown}
												disabled={
													softSkills.length >= 20
												}
												className="flex-1"
											/>
											<div className="flex items-center gap-2 min-w-[120px]">
												<Input
													type="number"
													min="1"
													max="10"
													value={softLevel}
													onChange={(e) =>
														setSoftLevel(
															Number(
																e.target.value
															)
														)
													}
													className="w-16 text-center"
												/>
												<span className="text-xs text-muted-foreground">
													/10
												</span>
											</div>
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
										<p className="text-xs text-muted-foreground">
											Rate your proficiency level from 1
											(beginner) to 10 (expert)
										</p>
									</div>

									{/* Display soft skills with levels */}
									{softSkills.length > 0 ? (
										<div className="space-y-2">
											{softSkills.map((skill, index) => (
												<div
													key={index}
													className="flex items-center gap-3 p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors group"
												>
													<span className="flex-1 text-sm font-medium">
														{skill.name}
													</span>
													<div className="flex items-center gap-2">
														<div className="flex gap-0.5">
															{Array.from({
																length: 10,
															}).map((_, i) => (
																<Star
																	key={i}
																	className={`h-3 w-3 ${
																		i <
																		skill.level
																			? "fill-primary text-primary"
																			: "text-muted-foreground/30"
																	}`}
																/>
															))}
														</div>
														<span className="text-xs font-semibold text-muted-foreground min-w-[30px]">
															{skill.level}/10
														</span>
													</div>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
														onClick={() =>
															handleRemoveSoftSkill(
																skill.name
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
											No soft skills added yet. Type a
											skill, set the level, and click Add.
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

							{/* Hidden submit button */}
							<Button type="submit" className="hidden">
								Continue
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
