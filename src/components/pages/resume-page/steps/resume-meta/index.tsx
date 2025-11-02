// components/pages/resume-page/steps/resume-meta/index.tsx
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
	resumeMetaSchema,
	type ResumeMetaFormValues,
} from "@/lib/validations/resume.validations";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResume } from "@/components/providers/resume-form-provider";

export function ResumeMetaPage() {
	const { resumeData, dispatch, nextStep } = useResume();

	const form = useForm<ResumeMetaFormValues>({
		resolver: zodResolver(resumeMetaSchema),
		mode: "onBlur", // Validate on blur for better UX
		defaultValues: {
			name: resumeData.name || "",
			description: resumeData.description || "",
		},
	});

	const onSubmit = (data: ResumeMetaFormValues) => {
		dispatch({
			type: "UPDATE_RESUME_META",
			payload: {
				name: data.name,
				description: data.description || "",
			},
		});
		nextStep();
	};

	// This will be called if validation fails
	const onError = () => {
		// Form validation will automatically show error messages
		// The form won't proceed to next step
		console.log("Form validation failed");
	};

	return (
		<div className="w-full h-full flex flex-col">
			<div className="flex-1 px-4">
				<div className="max-w-3xl mx-auto space-y-6">
					{/* Header Card */}
					<Card className="border-none shadow-none p-0">
						<CardHeader className="p-0">
							<div className="flex items-start gap-4">
								<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
									<FileText className="h-6 w-6 text-primary" />
								</div>
								<div className="flex-1">
									<CardTitle className="text-xl md:text-2xl">
										Create Your Resume
									</CardTitle>
									<CardDescription className="mt-1.5">
										Let&apos;s start by giving your resume a
										name and description
									</CardDescription>
								</div>
							</div>
						</CardHeader>
					</Card>

					{/* Pro Tip Card */}
					<Card className="bg-primary/5 border-primary/20">
						<CardContent>
							<div className="flex gap-3">
								<Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
								<div className="space-y-1">
									<p className="text-sm font-semibold text-primary">
										Pro Tip
									</p>
									<p className="text-sm text-muted-foreground">
										Choose a descriptive name like
										&quot;Software Engineer Resume -
										2025&quot; or &quot;Marketing
										Manager&quot; - &quot;Tech
										Industry&quot; to easily identify this
										resume later.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Form Card */}
					<Card>
						<CardHeader>
							<CardTitle>Resume Information</CardTitle>
							<CardDescription>
								Add basic details about your resume
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(
										onSubmit,
										onError
									)}
									className="space-y-6"
								>
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-base">
													Resume Name{" "}
													<span className="text-destructive">
														*
													</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., Software Engineer Resume 2025"
														className="h-11"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Give your resume a memorable
													name for easy identification
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-base">
													Description (Optional)
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="e.g., Resume tailored for senior software engineering positions at FAANG companies..."
														className="min-h-[120px] resize-none"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Add notes about this
													resume&apos;s purpose or
													target roles (max 500
													characters)
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Submit button is hidden here as it's handled by the action buttons */}
									<Button type="submit" className="hidden">
										Continue
									</Button>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
