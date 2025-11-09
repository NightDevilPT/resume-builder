// components/pages/resume-page/steps/personal-info/index.tsx
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
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	personalInfoSchema,
	type PersonalInfoFormValues,
} from "@/lib/validations/personal-info.validations";
import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { User, Plus, Trash2, Link2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { useResume } from "@/components/providers/resume-form-provider";

export function PersonalInfoPage() {
	const { resumeData, dispatch, nextStep } = useResume();

	const form = useForm<PersonalInfoFormValues>({
		resolver: zodResolver(personalInfoSchema),
		mode: "onBlur", // Validate on blur for better UX
		defaultValues: {
			fullName: resumeData.personalInfo.fullName || "",
			email: resumeData.personalInfo.email || "",
			phone: resumeData.personalInfo.phone || "",
			location: resumeData.personalInfo.location || "",
			website: resumeData.personalInfo.website || "",
			links: resumeData.personalInfo.links || [],
			summary: resumeData.personalInfo.summary || "",
		},
	});

	const lastSerializedValuesRef = useRef<string>(
		JSON.stringify(resumeData.personalInfo)
	);

	useEffect(() => {
		const subscription = form.watch((value) => {
			const normalized = {
				fullName: value?.fullName || "",
				email: value?.email || "",
				phone: value?.phone || "",
				location: value?.location || "",
				website: value?.website || "",
				links: (value?.links || []).map((link) => ({
					label: link?.label || "",
					url: link?.url || "",
				})),
				summary: value?.summary || "",
			};

			const serialized = JSON.stringify(normalized);

			if (serialized !== lastSerializedValuesRef.current) {
				lastSerializedValuesRef.current = serialized;
				dispatch({
					type: "UPDATE_PERSONAL_INFO",
					payload: normalized,
				});
			}
		});

		return () => subscription.unsubscribe();
	}, [dispatch, form]);

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "links",
	});

	const onSubmit = (data: PersonalInfoFormValues) => {
		dispatch({
			type: "UPDATE_PERSONAL_INFO",
			payload: {
				...data,
				links: data.links?.map((link) => ({
					label: link.label,
					url: link.url,
				})) || [],
			},
		});
		nextStep();
	};

	// This will be called if validation fails
	const onError = () => {
		// Form validation will automatically show error messages
		// NOTE: No action needed - FormMessage components handle display
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
									<User className="h-6 w-6 text-primary" />
								</div>
								<div className="flex-1">
									<CardTitle className="text-xl">
										Personal Information
									</CardTitle>
									<CardDescription>
										Tell us about yourself and how to reach
										you
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
							{/* Basic Info Card */}
							<Card>
								<CardHeader>
									<CardTitle>Basic Information</CardTitle>
									<CardDescription>
										Your contact details and location
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="fullName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Full Name{" "}
													<span className="text-destructive">
														*
													</span>
												</FormLabel>
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

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Email{" "}
														<span className="text-destructive">
															*
														</span>
													</FormLabel>
													<FormControl>
														<Input
															type="email"
															placeholder="john@example.com"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Phone{" "}
														<span className="text-destructive">
															*
														</span>
													</FormLabel>
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
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
															placeholder="New York, NY"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="website"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Website/Portfolio
													</FormLabel>
													<FormControl>
														<Input
															placeholder="https://yourportfolio.com"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Additional Links Card */}
							<Card>
								<CardHeader>
									<div className="flex items-start justify-between gap-4">
										<div className="flex items-start gap-3">
											<Link2 className="h-5 w-5 text-primary mt-0.5" />
											<div>
												<CardTitle>
													Additional Links
												</CardTitle>
												<CardDescription>
													LinkedIn, GitHub, etc. (max
													5)
												</CardDescription>
											</div>
										</div>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												append({ label: "", url: "" })
											}
											disabled={fields.length >= 5}
										>
											<Plus className="h-4 w-4 mr-2" />
											Add
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									{fields.length === 0 ? (
										<div className="text-center py-6 text-sm text-muted-foreground">
											No links added yet. Click
											&quot;Add&quot; to include
											professional links.
										</div>
									) : (
										fields.map((field, index) => (
											<div
												key={field.id}
												className="flex gap-3"
											>
												<FormField
													control={form.control}
													name={`links.${index}.label`}
													render={({ field }) => (
														<FormItem className="flex-1">
															{index === 0 && (
																<FormLabel>
																	Label
																</FormLabel>
															)}
															<FormControl>
																<Input
																	placeholder="LinkedIn"
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
															{index === 0 && (
																<FormLabel>
																	URL
																</FormLabel>
															)}
															<FormControl>
																<Input
																	placeholder="https://linkedin.com/in/johndoe"
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
														remove(index)
													}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										))
									)}
								</CardContent>
							</Card>

							{/* Summary Card */}
							<Card>
								<CardHeader>
									<CardTitle>Professional Summary</CardTitle>
									<CardDescription>
										A brief overview of your professional
										background and goals
									</CardDescription>
								</CardHeader>
								<CardContent>
									<FormField
										control={form.control}
										name="summary"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Summary{" "}
													<span className="text-destructive">
														*
													</span>
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Write a compelling professional summary that highlights your expertise, achievements, and career goals..."
														className="min-h-[150px] resize-none"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Write at least 50 characters
													(max 500)
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

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
