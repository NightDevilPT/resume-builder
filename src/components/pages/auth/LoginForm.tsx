"use client";

import {
	loginSchema,
	type LoginFormValues,
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
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { apiClient, ApiError } from "@/lib/services/api-client.service";

interface LoginResponse {
	user: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		userName: string;
		role: string;
	};
	message: string;
	rememberMe?: boolean;
}

export function LoginForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		mode: "onBlur",
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const onSubmit = async (data: LoginFormValues) => {
		setIsLoading(true);

		try {
			const response = await apiClient.post<LoginResponse>(
				API_URLS.AUTH.LOGIN,
				{
					email: data.email,
					password: data.password,
					rememberMe: data.rememberMe,
				}
			);

			// Show success message
			toast.success("Login successful!", {
				description: `Welcome back, ${response.data?.user.firstName}!`,
			});

			// TODO: Store authentication token/session when implemented
			// For now, redirect to dashboard/home
			setTimeout(() => {
				router.push("/");
			}, 1000);
		} catch (error) {
			console.error("[LOGIN_ERROR]:", error);

			if (error instanceof ApiError) {
				// Handle specific API errors
				switch (error.code) {
				case "EMAIL_NOT_VERIFIED": {
					// Extract user details from error
					const details = error.details as {
						email?: string;
						userId?: string;
						otpRegenerated?: boolean;
					};

					// Show appropriate message based on whether OTP was regenerated
					if (details.otpRegenerated) {
						toast.error("Email not verified", {
							description:
								"Your email is not verified. A new verification code has been sent to your email.",
							duration: 5000,
						});
					} else {
						toast.error("Email not verified", {
							description:
								"Please check your email for the verification code to verify your account.",
							duration: 5000,
						});
					}

					// Redirect to email verification page
					setTimeout(() => {
						router.push(`/auth/verify-email?email=${details.email}`);
					}, 2000);
					break;
				}

					case "INVALID_CREDENTIALS":
						toast.error("Invalid credentials", {
							description:
								"The email or password you entered is incorrect. Please try again.",
						});
						// Clear password field on invalid credentials
						form.setValue("password", "");
						break;

					case "ACCOUNT_BANNED":
						toast.error("Account banned", {
							description:
								error.message ||
								"Your account has been banned. Please contact support.",
						});
						break;

					case "ACCOUNT_INACTIVE":
						toast.error("Account inactive", {
							description:
								error.message ||
								"Your account is inactive. Please contact support.",
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
									form.setError(err.path[0] as keyof LoginFormValues, {
										type: "manual",
										message: err.message,
									});
								}
							});
						}
						break;

					default:
						toast.error("Login failed", {
							description:
								error.message ||
								"An error occurred during login. Please try again.",
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
						<LogIn className="h-6 w-6 text-primary" />
					</div>
				</div>
				<CardTitle className="text-2xl text-center">
					Welcome back
				</CardTitle>
				<CardDescription className="text-center">
					Enter your credentials to sign in to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
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
									<div className="flex items-center justify-between">
										<FormLabel>
											Password{" "}
											<span className="text-destructive">*</span>
										</FormLabel>
										<Link
											href="/auth/forgot-password"
											className="text-sm text-primary hover:underline"
										>
											Forgot password?
										</Link>
									</div>
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
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Remember Me */}
						<FormField
							control={form.control}
							name="rememberMe"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel className="font-normal">
											Remember me for 30 days
										</FormLabel>
									</div>
								</FormItem>
							)}
						/>

					{/* Submit Button */}
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Signing In...
							</>
						) : (
							<>
								<LogIn className="mr-2 h-4 w-4" />
								Sign In
							</>
						)}
					</Button>

						{/* Signup Link */}
						<div className="text-center text-sm text-muted-foreground">
							Don&apos;t have an account?{" "}
							<Link
								href="/auth/signup"
								className="text-primary hover:underline font-medium"
							>
								Sign up
							</Link>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

