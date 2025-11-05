"use client";

import {
	signupSchema,
	type SignupFormValues,
} from "@/lib/validations/auth.validations";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_URLS } from "@/constants/api-urls";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import { apiClient, ApiError } from "@/lib/services/api-client.service";

interface SignupResponse {
	user: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		userName: string;
	};
	message: string;
}

export function SignupForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		mode: "onBlur",
		defaultValues: {
			firstName: "",
			lastName: "",
			userName: "",
			email: "",
			password: "",
			confirmPassword: "",
			acceptTerms: false,
		},
	});

	const onSubmit = async (data: SignupFormValues) => {
		setIsLoading(true);

		try {
			const response = await apiClient.post<SignupResponse>(
				API_URLS.AUTH.SIGNUP,
				{
					firstName: data.firstName,
					lastName: data.lastName,
					userName: data.userName,
					email: data.email,
					password: data.password,
					confirmPassword: data.confirmPassword,
					acceptTerms: data.acceptTerms,
				}
			);

		// Show success message
		toast.success("Account created successfully!", {
			description:
				response.data?.message ||
				"Please check your email for the verification code.",
		});

		// Get email for redirect
		const email = response.data?.user.email || data.email;

		// Reset form
		form.reset();

		// Redirect to email verification page after a short delay
		setTimeout(() => {
			router.push(`/auth/verify-email?email=${email}`);
		}, 2000);
		} catch (error) {
			console.error("[SIGNUP_ERROR]:", error);

			if (error instanceof ApiError) {
				// Handle specific API errors
				switch (error.code) {
					case "USER_EXISTS":
						toast.error("Account already exists", {
							description:
								error.message ||
								"A user with this email or username already exists. Please try logging in.",
						});
						break;

					case "VALIDATION_ERROR":
						toast.error("Invalid form data", {
							description:
								error.message ||
								"Please check your input and try again.",
						});
						// Optionally set form errors from API
						if (error.details && Array.isArray(error.details)) {
							error.details.forEach((err: any) => {
								if (err.path && err.path[0]) {
									form.setError(err.path[0] as keyof SignupFormValues, {
										type: "manual",
										message: err.message,
									});
								}
							});
						}
						break;

					case "UNIQUE_CONSTRAINT_ERROR":
						toast.error("Duplicate entry", {
							description:
								error.message ||
								"This email or username is already taken.",
						});
						break;

					default:
						toast.error("Signup failed", {
							description:
								error.message ||
								"An error occurred during signup. Please try again.",
						});
				}
			} else {
				// Handle network or unexpected errors
				toast.error("Connection error", {
					description:
						"Unable to connect to the server. Please check your internet connection and try again.",
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full">
			<CardHeader className="space-y-1">
				<div className="flex items-center justify-center mb-2">
					<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
						<UserPlus className="h-6 w-6 text-primary" />
					</div>
				</div>
				<CardTitle className="text-2xl text-center">
					Create an account
				</CardTitle>
				<CardDescription className="text-center">
					Enter your information to create your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						{/* Name Fields */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											First Name{" "}
											<span className="text-destructive">*</span>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="John"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Last Name{" "}
											<span className="text-destructive">*</span>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Doe"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Username */}
						<FormField
							control={form.control}
							name="userName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Username{" "}
										<span className="text-destructive">*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder="johndoe"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This will be your unique identifier
									</FormDescription>
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
									<FormLabel>
										Email{" "}
										<span className="text-destructive">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="john.doe@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Password */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Password{" "}
										<span className="text-destructive">*</span>
									</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={showPassword ? "text" : "password"}
												placeholder="••••••••"
												{...field}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
												onClick={() =>
													setShowPassword(!showPassword)
												}
											>
												{showPassword ? (
													<EyeOff className="h-4 w-4 text-muted-foreground" />
												) : (
													<Eye className="h-4 w-4 text-muted-foreground" />
												)}
											</Button>
										</div>
									</FormControl>
									<FormDescription>
										Must be at least 8 characters with uppercase,
										lowercase, and number
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Confirm Password */}
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Confirm Password{" "}
										<span className="text-destructive">*</span>
									</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={
													showConfirmPassword
														? "text"
														: "password"
												}
												placeholder="••••••••"
												{...field}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
												onClick={() =>
													setShowConfirmPassword(
														!showConfirmPassword
													)
												}
											>
												{showConfirmPassword ? (
													<EyeOff className="h-4 w-4 text-muted-foreground" />
												) : (
													<Eye className="h-4 w-4 text-muted-foreground" />
												)}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Terms and Conditions */}
						<FormField
							control={form.control}
							name="acceptTerms"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>
											I accept the{" "}
											<Link
												href="/terms"
												className="text-primary hover:underline"
											>
												Terms and Conditions
											</Link>{" "}
											and{" "}
											<Link
												href="/privacy"
												className="text-primary hover:underline"
											>
												Privacy Policy
											</Link>
										</FormLabel>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>

					{/* Submit Button */}
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating Account...
							</>
						) : (
							<>
								<UserPlus className="mr-2 h-4 w-4" />
								Create Account
							</>
						)}
					</Button>

						{/* Login Link */}
						<div className="text-center text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link
								href="/auth/login"
								className="text-primary hover:underline font-medium"
							>
								Sign in
							</Link>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

