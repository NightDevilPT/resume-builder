// components/resume/forms/PersonalInfoForm.tsx - Fix the form values handling
"use client";

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
	PersonalInfoFormValues,
	personalInfoSchema,
} from "@/lib/validations/personal-info";
import { useState } from "react";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { Plus, X, Eye } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { areRequiredSectionsComplete } from "@/lib/utils/resume-helpers";
import { useResume } from "@/components/providers/resume-form-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PersonalInfoForm() {
	const { resumeData, dispatch, nextStep, prevStep, goToStep } = useResume();
	const [linkLabel, setLinkLabel] = useState("");
	const [linkUrl, setLinkUrl] = useState("");

	const canReview = areRequiredSectionsComplete(resumeData);

	const form = useForm<PersonalInfoFormValues>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: {
			fullName: resumeData.personalInfo.fullName,
			email: resumeData.personalInfo.email,
			phone: resumeData.personalInfo.phone,
			location: resumeData.personalInfo.location,
			website: resumeData.personalInfo.website || "",
			links: resumeData.personalInfo.links || [],
			summary: resumeData.personalInfo.summary,
		},
		mode: "onChange",
	});

	const links = form.watch("links");

	// Handle adding a link
	const addLink = () => {
		if (linkLabel.trim() && linkUrl.trim()) {
			const currentLinks = form.getValues("links");
			form.setValue(
				"links",
				[
					...currentLinks,
					{
						label: linkLabel.trim(),
						url: linkUrl.trim(),
					},
				],
				{ shouldValidate: true }
			);
			setLinkLabel("");
			setLinkUrl("");
		}
	};

	// Handle removing a link
	const removeLink = (index: number) => {
		const currentLinks = form.getValues("links");
		form.setValue(
			"links",
			currentLinks.filter((_, i) => i !== index),
			{ shouldValidate: true }
		);
	};

	const onSubmit = (data: PersonalInfoFormValues) => {
		// Ensure all fields are properly formatted
		const payload = {
			fullName: data.fullName,
			email: data.email,
			phone: data.phone,
			location: data.location,
			website: data.website || "",
			links: data.links || [],
			summary: data.summary || "",
		};

		dispatch({
			type: "UPDATE_PERSONAL_INFO",
			payload: payload,
		});
		nextStep();
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-xl font-semibold">Personal Information</h3>
				<p className="text-muted-foreground">
					Tell us about yourself - this information will appear at the
					top of your resume.
				</p>
			</div>

			<ScrollArea className=" h-[calc(100vh-340px)] pr-5">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Full Name */}
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name *</FormLabel>
										<FormControl>
											<Input
												placeholder="John Doe"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Email */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email *</FormLabel>
										<FormControl>
											<Input
												placeholder="john.doe@example.com"
												type="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Phone */}
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone *</FormLabel>
										<FormControl>
											<Input
												placeholder="+1 (555) 123-4567"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Location */}
							<FormField
								control={form.control}
								name="location"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Location *</FormLabel>
										<FormControl>
											<Input
												placeholder="New York, NY"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Website/Portfolio URL */}
						<FormField
							control={form.control}
							name="website"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Website/Portfolio (Optional)
									</FormLabel>
									<FormControl>
										<Input
											placeholder="https://yourwebsite.com"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Your personal website, portfolio, or
										online presence
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Additional Professional Links */}
						<Card className="bg-accent/50 border-accent">
							<CardHeader>
								<CardTitle className="text-base flex items-center gap-2">
									<Info className="h-4 w-4" />
									Additional Professional Links (Optional)
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-sm text-muted-foreground">
									Add any other professional links (LinkedIn,
									GitHub, Behance, Medium, etc.) - up to 5
									links
								</p>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
									<Input
										placeholder="Label (e.g., LinkedIn)"
										value={linkLabel}
										onChange={(e) =>
											setLinkLabel(e.target.value)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												addLink();
											}
										}}
									/>
									<Input
										placeholder="URL (https://...)"
										value={linkUrl}
										onChange={(e) =>
											setLinkUrl(e.target.value)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												addLink();
											}
										}}
									/>
									<Button
										type="button"
										onClick={addLink}
										disabled={
											!linkLabel.trim() ||
											!linkUrl.trim() ||
											links.length >= 5
										}
									>
										<Plus className="h-4 w-4 mr-1" />
										Add Link
									</Button>
								</div>
								{links.length > 0 && (
									<div className="space-y-2">
										{links.map((link, index) => (
											<div
												key={index}
												className="flex items-center justify-between p-3 bg-background rounded-md border"
											>
												<div className="flex flex-col">
													<Label className="text-sm font-medium">
														{link.label}
													</Label>
													<span className="text-xs text-muted-foreground truncate max-w-[300px]">
														{link.url}
													</span>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() =>
														removeLink(index)
													}
												>
													<X className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
								)}
								{form.formState.errors.links && (
									<p className="text-sm font-medium text-destructive">
										{form.formState.errors.links.message}
									</p>
								)}
							</CardContent>
						</Card>

						{/* Professional Summary */}
						<FormField
							control={form.control}
							name="summary"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Professional Summary *
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Experienced professional with expertise in... [Describe your background, key strengths, and what makes you unique]"
											className="resize-none min-h-[120px]"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										{field.value.length}/500 characters.
										Write a brief overview of your
										professional background and key
										strengths (minimum 50 characters).
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Navigation Buttons */}
						<div className="flex justify-between pt-6 border-t sticky bottom-0 bg-background">
							<Button
								type="button"
								variant="outline"
								onClick={prevStep}
							>
								Back
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
									Continue to Experience
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</ScrollArea>
		</div>
	);
}
