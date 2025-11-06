"use client";

import {
	signupSchema,
	type SignupFormValues,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

interface SignupFormProps {
	onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset,
		setError,
	} = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		mode: "onBlur",
		defaultValues: {
			firstName: "",
			lastName: "",
			userName: "",
			email: "",
			password: "",
			confirmPassword: "",
			acceptTerms: true, // Auto-accept since terms are shown below
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
			reset();

			// Call onSuccess callback if provided
			if (onSuccess) {
				onSuccess();
			}

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
									setError(err.path[0] as keyof SignupFormValues, {
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
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldGroup>
				<div className="flex flex-col gap-3 text-center">
					<h1 className="text-3xl font-bold tracking-tight">
						Create your account
					</h1>
					<p className="text-muted-foreground text-base text-balance">
						Enter your information below to create your account
					</p>
				</div>

				{/* Name Fields */}
				<Field className="grid grid-cols-2 gap-4">
					<Field>
						<FieldLabel htmlFor="firstName">First Name</FieldLabel>
						<Input
							id="firstName"
							placeholder="John"
							{...register("firstName")}

						/>
						{errors.firstName && (
							<FieldError>{errors.firstName.message}</FieldError>
						)}
					</Field>
					<Field>
						<FieldLabel htmlFor="lastName">Last Name</FieldLabel>
						<Input
							id="lastName"
							placeholder="Doe"
							{...register("lastName")}

						/>
						{errors.lastName && (
							<FieldError>{errors.lastName.message}</FieldError>
						)}
					</Field>
				</Field>

				{/* Username */}
				<Field>
					<FieldLabel htmlFor="userName">Username</FieldLabel>
					<Input
						id="userName"
						placeholder="johndoe"
						{...register("userName")}

					/>
					<FieldDescription>
						This will be your unique identifier
					</FieldDescription>
					{errors.userName && (
						<FieldError>{errors.userName.message}</FieldError>
					)}
				</Field>

				{/* Email */}
				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						{...register("email")}

					/>
					<FieldDescription>
						We&apos;ll use this to contact you. We will not share
						your email with anyone else.
					</FieldDescription>
					{errors.email && (
						<FieldError>{errors.email.message}</FieldError>
					)}
				</Field>

				{/* Password Fields */}
				<Field>
					<Field className="grid grid-cols-2 gap-4">
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
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
						<Field>
							<FieldLabel htmlFor="confirmPassword">
								Confirm Password
							</FieldLabel>
							<div className="relative">
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									{...register("confirmPassword")}
									className="h-11 pr-10"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
									onClick={() =>
										setShowConfirmPassword(!showConfirmPassword)
									}
								>
									{showConfirmPassword ? (
										<EyeOff className="h-4 w-4 text-muted-foreground" />
									) : (
										<Eye className="h-4 w-4 text-muted-foreground" />
									)}
								</Button>
							</div>
							{errors.confirmPassword && (
								<FieldError>
									{errors.confirmPassword.message}
								</FieldError>
							)}
						</Field>
					</Field>
					<FieldDescription>
						Must be at least 8 characters with uppercase, lowercase
						& number.
					</FieldDescription>
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
								Creating Account...
							</>
						) : (
							"Create Account"
						)}
					</Button>
				</Field>

				<FieldDescription className="text-center">
					Already have an account?{" "}
					<Link
						href="/auth/login"
						className="font-medium text-primary hover:underline"
					>
						Sign in
					</Link>
				</FieldDescription>
			</FieldGroup>
		</form>
	);
}

