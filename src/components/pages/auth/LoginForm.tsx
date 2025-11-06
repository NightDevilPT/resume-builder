"use client";

import {
	loginSchema,
	type LoginFormValues,
} from "@/lib/validations/auth.validations";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldError,
} from "@/components/ui/field";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

interface LoginFormProps {
	onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		mode: "onBlur",
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const rememberMe = watch("rememberMe");

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

			// Call onSuccess callback if provided
			if (onSuccess) {
				onSuccess();
			}

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
						setValue("password", "");
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
						// Optionally set form errors from API (handled by Zod)
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
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldGroup>
				<div className="flex flex-col gap-3 text-center">
					<h1 className="text-3xl font-bold tracking-tight">
						Welcome back
					</h1>
					<p className="text-muted-foreground text-base text-balance">
						Sign in to your account to continue
					</p>
				</div>

				{/* Email */}
				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						{...register("email")}
						className="h-11"
					/>
					{errors.email && (
						<FieldError>{errors.email.message}</FieldError>
					)}
				</Field>

				{/* Password */}
				<Field>
					<div className="flex items-center justify-between mb-2">
						<FieldLabel htmlFor="password">Password</FieldLabel>
						<Link
							href="/auth/forgot-password"
							className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
						>
							Forgot password?
						</Link>
					</div>
					<div className="relative">
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder="Enter your password"
							{...register("password")}
							className="h-11 pr-10"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<EyeOff className="h-4 w-4 text-muted-foreground" />
							) : (
								<Eye className="h-4 w-4 text-muted-foreground" />
							)}
						</Button>
					</div>
					{errors.password && (
						<FieldError>{errors.password.message}</FieldError>
					)}
				</Field>

				{/* Remember Me */}
				<Field className="flex flex-row items-center space-x-3 space-y-0">
					<Checkbox
						id="rememberMe"
						checked={rememberMe}
						onCheckedChange={(checked) =>
							setValue("rememberMe", checked as boolean)
						}
						className="h-5 w-5 border-2"
					/>
					<FieldLabel
						htmlFor="rememberMe"
						className="text-sm font-normal text-muted-foreground cursor-pointer"
					>
						Keep me signed in for 30 days
					</FieldLabel>
				</Field>

				{/* Submit Button */}
				<Field>
					<Button
						type="submit"
						className="w-full h-11"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Signing you in...
							</>
						) : (
							"Sign In"
						)}
					</Button>
				</Field>

				<FieldDescription className="text-center">
					Don&apos;t have an account?{" "}
					<Link
						href="/auth/signup"
						className="font-medium text-primary hover:underline"
					>
						Sign up
					</Link>
				</FieldDescription>
			</FieldGroup>
		</form>
	);
}

