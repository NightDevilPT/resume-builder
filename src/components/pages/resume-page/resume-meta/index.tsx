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
	resumeMetaSchema,
	type ResumeMetaFormValues,
} from "@/lib/validations/resume";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResume } from "@/components/providers/resume-form-provider";

export function ResumeMetaForm() {
	const { resumeData, dispatch, nextStep } = useResume();

	const form = useForm<ResumeMetaFormValues>({
		resolver: zodResolver(resumeMetaSchema),
		defaultValues: {
			name: resumeData.name || "",
			description: resumeData.description || "",
		},
		mode: "onChange",
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

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-xl font-semibold">Resume Details</h3>
				<p className="text-muted-foreground">
					Give your resume a name and description to help you organize
					multiple resumes.
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Resume Name</FormLabel>
								<FormControl>
									<Input
										placeholder="e.g., Software Engineer Resume, Marketing Manager CV"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									This name is for your reference and won&apos;t
									appear on the final resume.
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
								<FormLabel>Description (Optional)</FormLabel>
								<FormControl>
									<Textarea
										placeholder="e.g., Tailored for tech startups, Includes recent project experience"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Add a description to remember what makes
									this resume unique.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end pt-4">
						<Button
							type="submit"
							disabled={
								!form.formState.isValid ||
								form.formState.isSubmitting
							}
						>
							Save & Continue
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
