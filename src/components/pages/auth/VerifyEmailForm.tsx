"use client";

import {
	verifyEmailSchema,
	type VerifyEmailFormValues,
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
	FormDescription,
} from "@/components/ui/form";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_URLS } from "@/constants/api-urls";
import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2, MailCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient, ApiError } from "@/lib/services/api-client.service";

interface VerifyEmailResponse {
	user: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		emailVerified: boolean;
	};
	message: string;
}

interface ResendOtpResponse {
	message: string;
	email: string;
	expiresIn: string;
}

export function VerifyEmailForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const emailFromUrl = searchParams.get("email") || "";

	const [isVerifying, setIsVerifying] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const [canResend, setCanResend] = useState(true);

	const otpInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<VerifyEmailFormValues>({
		resolver: zodResolver(verifyEmailSchema),
		mode: "onBlur",
		defaultValues: {
			email: emailFromUrl,
			otp: "",
		},
	});

	// Countdown timer for resend button
	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => {
				setCountdown(countdown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else {
			setCanResend(true);
		}
	}, [countdown]);

	// Auto-focus OTP input on mount
	useEffect(() => {
		otpInputRef.current?.focus();
	}, []);

	const onSubmit = async (data: VerifyEmailFormValues) => {
		setIsVerifying(true);

		try {
			const response = await apiClient.post<VerifyEmailResponse>(
				API_URLS.AUTH.VERIFY_EMAIL,
				{
					email: data.email,
					otp: data.otp,
				}
			);

			// Show success message
			toast.success("Email verified successfully!", {
				description:
					response.data?.message ||
					"You can now log in to your account.",
			});

			// Reset form
			form.reset();

			// Redirect to login page after a short delay
			setTimeout(() => {
				router.push("/auth/login");
			}, 2000);
		} catch (error) {
			console.error("[VERIFY_EMAIL_ERROR]:", error);

			if (error instanceof ApiError) {
				// Handle specific API errors
				switch (error.code) {
					case "USER_NOT_FOUND":
						toast.error("Account not found", {
							description:
								"No account found with this email address. Please sign up first.",
						});
						break;

					case "ALREADY_VERIFIED":
						toast.success("Email already verified", {
							description: "You can log in to your account now.",
						});
						// Redirect to login
						setTimeout(() => {
							router.push("/auth/login");
						}, 2000);
						break;

					case "OTP_NOT_FOUND":
						toast.error("Verification code not found", {
							description:
								"No verification code found. Please request a new code.",
						});
						break;

					case "OTP_EXPIRED":
						toast.error("Code expired", {
							description:
								"Your verification code has expired. Please request a new code.",
						});
						// Clear OTP field
						form.setValue("otp", "");
						break;

					case "INVALID_OTP":
						toast.error("Invalid code", {
							description:
								"The verification code you entered is incorrect. Please try again.",
						});
						// Clear OTP field
						form.setValue("otp", "");
						// Focus on OTP input
						otpInputRef.current?.focus();
						break;

					case "VALIDATION_ERROR":
						toast.error("Invalid input", {
							description:
								error.message ||
								"Please check your input and try again.",
						});
						// Set form errors from API
						if (error.details && Array.isArray(error.details)) {
							error.details.forEach((err: any) => {
								if (err.path && err.path[0]) {
									form.setError(
										err.path[0] as keyof VerifyEmailFormValues,
										{
											type: "manual",
											message: err.message,
										}
									);
								}
							});
						}
						break;

					default:
						toast.error("Verification failed", {
							description:
								error.message ||
								"An error occurred during verification. Please try again.",
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
			setIsVerifying(false);
		}
	};

	const handleResendOtp = async () => {
		const email = form.getValues("email");

		if (!email) {
			toast.error("Email required", {
				description: "Please enter your email address first.",
			});
			return;
		}

		setIsResending(true);

		try {
			const response = await apiClient.post<ResendOtpResponse>(
				API_URLS.AUTH.RESEND_OTP,
				{
					email,
				}
			);

			// Show success message
			toast.success("Code resent!", {
				description:
					response.data?.message ||
					"A new verification code has been sent to your email.",
			});

			// Start countdown (60 seconds)
			setCountdown(60);
			setCanResend(false);

			// Clear OTP field
			form.setValue("otp", "");

			// Focus on OTP input
			otpInputRef.current?.focus();
		} catch (error) {
			console.error("[RESEND_OTP_ERROR]:", error);

			if (error instanceof ApiError) {
				// Handle specific API errors
				switch (error.code) {
					case "USER_NOT_FOUND":
						toast.error("Account not found", {
							description:
								"No account found with this email address.",
						});
						break;

					case "ALREADY_VERIFIED":
						toast.success("Email already verified", {
							description: "You can log in to your account now.",
						});
						// Redirect to login
						setTimeout(() => {
							router.push("/auth/login");
						}, 2000);
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

					case "TOO_MANY_REQUESTS": {
						const details = error.details as {
							remainingSeconds?: number;
						};
						const seconds = details.remainingSeconds || 60;
						toast.error("Please wait", {
							description: `Please wait ${seconds} seconds before requesting a new code.`,
						});
						// Set countdown to remaining seconds
						setCountdown(seconds);
						setCanResend(false);
						break;
					}

					default:
						toast.error("Failed to resend code", {
							description:
								error.message ||
								"An error occurred. Please try again.",
						});
				}
			} else {
				// Handle network or unexpected errors
				toast.error("Connection error", {
					description:
						"Unable to connect to the server. Please check your internet connection.",
				});
			}
		} finally {
			setIsResending(false);
		}
	};

	return (
		<Card className="w-full">
			<CardHeader className="space-y-1">
				<div className="flex items-center justify-center mb-2">
					<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
						<Mail className="h-6 w-6 text-primary" />
					</div>
				</div>
				<CardTitle className="text-2xl text-center">
					Verify Your Email
				</CardTitle>
				<CardDescription className="text-center">
					We&apos;ve sent a 6-digit verification code to your email
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

						{/* OTP */}
						<FormField
							control={form.control}
							name="otp"
							render={({ field: { ref, ...field } }) => (
								<FormItem>
									<FormLabel>
										Verification Code{" "}
										<span className="text-destructive">*</span>
									</FormLabel>
									<FormControl>
										<Input
											ref={(e) => {
												ref(e);
												otpInputRef.current = e;
											}}
											type="text"
											placeholder="000000"
											maxLength={6}
											className="text-center text-2xl tracking-widest font-mono"
											{...field}
											onChange={(e) => {
												// Only allow numbers
												const value = e.target.value.replace(
													/\D/g,
													""
												);
												field.onChange(value);
											}}
										/>
									</FormControl>
									<FormDescription>
										Enter the 6-digit code sent to your email
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Resend OTP Button */}
						<div className="flex items-center justify-center">
							<Button
								type="button"
								variant="link"
								onClick={handleResendOtp}
								disabled={!canResend || isResending || countdown > 0}
								className="text-sm"
							>
								{isResending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Resending...
									</>
								) : countdown > 0 ? (
									`Resend code in ${countdown}s`
								) : (
									"Resend verification code"
								)}
							</Button>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full"
							disabled={isVerifying}
						>
							{isVerifying ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Verifying...
								</>
							) : (
								<>
									<MailCheck className="mr-2 h-4 w-4" />
									Verify Email
								</>
							)}
						</Button>

						{/* Login Link */}
						<div className="text-center text-sm text-muted-foreground">
							Already verified?{" "}
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

