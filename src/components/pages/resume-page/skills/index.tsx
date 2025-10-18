"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X, Lightbulb, Code2, Languages } from "lucide-react";
import { SkillsFormValues, skillsSchema } from "@/lib/validations/skills";
import { areRequiredSectionsComplete } from "@/lib/utils/resume-helpers";
import { Form, FormDescription, FormLabel } from "@/components/ui/form";
import { useResume } from "@/components/providers/resume-form-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SkillsForm() {
	const { resumeData, dispatch, nextStep, prevStep, goToStep } = useResume();
	const canReview = areRequiredSectionsComplete(resumeData);
	const [technicalInput, setTechnicalInput] = useState("");
	const [softInput, setSoftInput] = useState("");
	const [languageInput, setLanguageInput] = useState("");
	const [proficiencyInput, setProficiencyInput] = useState<
		"Native" | "Fluent" | "Professional" | "Basic"
	>("Professional");

	const form = useForm<SkillsFormValues>({
		resolver: zodResolver(skillsSchema),
		defaultValues: {
			technical: resumeData.skills.technical || [],
			soft: resumeData.skills.soft || [],
			languages: resumeData.skills.languages || [],
		},
		mode: "onChange",
	});

	const technicalSkills = form.watch("technical");
	const softSkills = form.watch("soft");
	const languages = form.watch("languages");

	// Handle adding a technical skill
	const addTechnicalSkill = () => {
		if (technicalInput.trim()) {
			const currentSkills = form.getValues("technical");
			// Check for duplicates
			if (!currentSkills.includes(technicalInput.trim())) {
				form.setValue(
					"technical",
					[...currentSkills, technicalInput.trim()],
					{ shouldValidate: true }
				);
				setTechnicalInput("");
			}
		}
	};

	// Handle removing a technical skill
	const removeTechnicalSkill = (index: number) => {
		const currentSkills = form.getValues("technical");
		form.setValue(
			"technical",
			currentSkills.filter((_, i) => i !== index),
			{ shouldValidate: true }
		);
	};

	// Handle adding a soft skill
	const addSoftSkill = () => {
		if (softInput.trim()) {
			const currentSkills = form.getValues("soft");
			// Check for duplicates
			if (!currentSkills.includes(softInput.trim())) {
				form.setValue("soft", [...currentSkills, softInput.trim()], {
					shouldValidate: true,
				});
				setSoftInput("");
			}
		}
	};

	// Handle removing a soft skill
	const removeSoftSkill = (index: number) => {
		const currentSkills = form.getValues("soft");
		form.setValue(
			"soft",
			currentSkills.filter((_, i) => i !== index),
			{ shouldValidate: true }
		);
	};

	// Handle adding a language
	const addLanguage = () => {
		if (languageInput.trim()) {
			const currentLanguages = form.getValues("languages");
			// Check for duplicates
			const exists = currentLanguages.some(
				(lang) =>
					lang.language.toLowerCase() ===
					languageInput.trim().toLowerCase()
			);
			if (!exists) {
				form.setValue(
					"languages",
					[
						...currentLanguages,
						{
							language: languageInput.trim(),
							proficiency: proficiencyInput,
						},
					],
					{ shouldValidate: true }
				);
				setLanguageInput("");
				setProficiencyInput("Professional");
			}
		}
	};

	// Handle removing a language
	const removeLanguage = (index: number) => {
		const currentLanguages = form.getValues("languages");
		form.setValue(
			"languages",
			currentLanguages.filter((_, i) => i !== index),
			{ shouldValidate: true }
		);
	};

	// Handle form submission
	const onSubmit = (data: SkillsFormValues) => {
		dispatch({
			type: "UPDATE_SKILLS",
			payload: {
				technical: data.technical,
				soft: data.soft,
				languages: data.languages,
			},
		});
		console.log(resumeData);
		nextStep();
	};

	// Get proficiency badge variant
	const getProficiencyVariant = (
		proficiency: string
	): "default" | "secondary" | "outline" | "destructive" => {
		switch (proficiency) {
			case "Native":
			case "Fluent":
				return "default";
			case "Professional":
				return "secondary";
			case "Basic":
				return "outline";
			default:
				return "secondary";
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-xl font-semibold">Skills & Expertise</h3>
				<p className="text-muted-foreground">
					Showcase your technical skills, soft skills, and language
					proficiencies.
				</p>
			</div>

			<ScrollArea className="h-[calc(100vh-340px)] pr-5">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Technical Skills Section */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2">
									<Code2 className="h-5 w-5" />
									Technical Skills
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<FormLabel>
										Add Technical Skills *
									</FormLabel>
									<div className="flex gap-2">
										<Input
											placeholder="React, Node.js, Python, AWS, MongoDB..."
											value={technicalInput}
											onChange={(e) =>
												setTechnicalInput(
													e.target.value
												)
											}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addTechnicalSkill();
												}
											}}
										/>
										<Button
											type="button"
											onClick={addTechnicalSkill}
											disabled={!technicalInput.trim()}
										>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
									{technicalSkills.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{technicalSkills.map(
												(skill, index) => (
													<Badge
														key={index}
														variant="secondary"
														className="gap-1 px-3 py-1"
													>
														{skill}
														<button
															type="button"
															onClick={() =>
																removeTechnicalSkill(
																	index
																)
															}
															className="ml-1 hover:text-destructive"
														>
															<X className="h-3 w-3" />
														</button>
													</Badge>
												)
											)}
										</div>
									)}
									{form.formState.errors.technical && (
										<p className="text-sm font-medium text-destructive">
											{
												form.formState.errors.technical
													.message
											}
										</p>
									)}
									<FormDescription>
										Add your programming languages,
										frameworks, tools, and technologies
										(minimum 1, maximum 30)
									</FormDescription>
								</div>
							</CardContent>
						</Card>

						{/* Soft Skills Section */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2">
									<Lightbulb className="h-5 w-5" />
									Soft Skills
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<FormLabel>Add Soft Skills *</FormLabel>
									<div className="flex gap-2">
										<Input
											placeholder="Leadership, Communication, Problem Solving..."
											value={softInput}
											onChange={(e) =>
												setSoftInput(e.target.value)
											}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addSoftSkill();
												}
											}}
										/>
										<Button
											type="button"
											onClick={addSoftSkill}
											disabled={!softInput.trim()}
										>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
									{softSkills.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{softSkills.map((skill, index) => (
												<Badge
													key={index}
													variant="outline"
													className="gap-1 px-3 py-1"
												>
													{skill}
													<button
														type="button"
														onClick={() =>
															removeSoftSkill(
																index
															)
														}
														className="ml-1 hover:text-destructive"
													>
														<X className="h-3 w-3" />
													</button>
												</Badge>
											))}
										</div>
									)}
									{form.formState.errors.soft && (
										<p className="text-sm font-medium text-destructive">
											{form.formState.errors.soft.message}
										</p>
									)}
									<FormDescription>
										Add your interpersonal and professional
										skills (minimum 1, maximum 20)
									</FormDescription>
								</div>
							</CardContent>
						</Card>

						{/* Languages Section */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2">
									<Languages className="h-5 w-5" />
									Language Proficiencies
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<FormLabel>Add Languages *</FormLabel>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
										<Input
											placeholder="English, Spanish, Hindi..."
											value={languageInput}
											onChange={(e) =>
												setLanguageInput(e.target.value)
											}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addLanguage();
												}
											}}
											className="md:col-span-1"
										/>
										<Select
											value={proficiencyInput}
											onValueChange={(value) =>
												setProficiencyInput(
													value as
														| "Native"
														| "Fluent"
														| "Professional"
														| "Basic"
												)
											}
										>
											<SelectTrigger className="md:col-span-1">
												<SelectValue />
											</SelectTrigger>
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
										<Button
											type="button"
											onClick={addLanguage}
											disabled={!languageInput.trim()}
											className="md:col-span-1"
										>
											<Plus className="h-4 w-4 mr-2" />
											Add Language
										</Button>
									</div>
									{languages.length > 0 && (
										<div className="space-y-2">
											{languages.map((lang, index) => (
												<div
													key={index}
													className="flex items-center justify-between p-3 bg-muted rounded-md"
												>
													<div className="flex items-center gap-3">
														<Label className="text-sm font-medium">
															{lang.language}
														</Label>
														<Badge
															variant={getProficiencyVariant(
																lang.proficiency
															)}
														>
															{lang.proficiency}
														</Badge>
													</div>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() =>
															removeLanguage(
																index
															)
														}
													>
														<X className="h-4 w-4" />
													</Button>
												</div>
											))}
										</div>
									)}
									{form.formState.errors.languages && (
										<p className="text-sm font-medium text-destructive">
											{
												form.formState.errors.languages
													.message
											}
										</p>
									)}
									<FormDescription>
										Add languages you speak and your
										proficiency level (minimum 1, maximum
										10)
									</FormDescription>
								</div>
							</CardContent>
						</Card>

						<div className="flex justify-between sticky bottom-0 bg-background">
							<Button
								type="button"
								variant="outline"
								onClick={prevStep}
							>
								Back to Education
							</Button>

							<div className="flex gap-2">
								{canReview && (
									<Button
										type="button"
										variant="outline"
										onClick={() => goToStep(8)}
									>
										<Eye className="h-4 w-4 mr-2" />
										Quick Review
									</Button>
								)}
								<Button
									type="submit"
									disabled={!form.formState.isValid}
								>
									Continue to Projects
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</ScrollArea>
		</div>
	);
}
