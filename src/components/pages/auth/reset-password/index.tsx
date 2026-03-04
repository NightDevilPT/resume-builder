"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
	Mail,
	Loader2,
	CheckCircle2,
	KeyRound,
	ArrowLeft,
	Edit,
	Eye,
	EyeOff,
	ShieldCheck,
} from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";

// Context and Validation
import { useAuth } from "@/components/context/auth-context";
import {
	forgotPasswordSchema,
	ForgotPasswordFormValues,
} from "@/lib/validations/auth.validations";
import { z } from "zod";

// Create a new schema for reset password with OTP
const resetPasswordWithOtpSchema = z
	.object({
		otp: z
			.string()
			.min(6, "OTP must be 6 digits")
			.max(6, "OTP must be 6 digits")
			.regex(/^\d{6}$/, "OTP must contain only numbers"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(100, "Password must be less than 100 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number",
			),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type ResetPasswordStepValues = z.infer<typeof resetPasswordWithOtpSchema>;

// Steps for the reset password flow
enum ResetStep {
	EMAIL = "email",
	RESET = "reset",
}

export function ResetPasswordForm() {
	const [currentStep, setCurrentStep] = useState<ResetStep>(ResetStep.EMAIL);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const [resendSuccess, setResendSuccess] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const [storedEmail, setStoredEmail] = useState("");

	const router = useRouter();
	const searchParams = useSearchParams();
	const { forgotPassword, resetPassword } = useAuth();

	// Get email from URL query params (if coming from forgot password)
	const emailFromUrl = searchParams.get("email") || "";

	// Initialize email form
	const emailForm = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: emailFromUrl,
		},
	});

	// Initialize reset form
	const resetForm = useForm<ResetPasswordStepValues>({
		resolver: zodResolver(resetPasswordWithOtpSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
			otp: "",
		},
		mode: "onChange", // Add this to validate on change
	});

	const { watch: watchEmail } = emailForm;
	const watchedEmail = watchEmail("email");

	// Watch form state for debugging
	const formState = resetForm.formState;
	const formValues = resetForm.watch();

	// Debug log
	useEffect(() => {
		if (process.env.NODE_ENV === "development") {
			console.log("Form State:", {
				isValid: formState.isValid,
				errors: formState.errors,
				values: formValues,
				isDirty: formState.isDirty,
				isSubmitting: formState.isSubmitting,
			});
		}
	}, [formState, formValues]);

	// Set email from URL if present
	useEffect(() => {
		if (emailFromUrl) {
			emailForm.setValue("email", emailFromUrl);
			setStoredEmail(emailFromUrl);
			setCurrentStep(ResetStep.RESET);
			setCountdown(60);
		}
	}, [emailFromUrl, emailForm]);

	// Handle countdown timer for resend
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (countdown > 0) {
			timer = setTimeout(() => setCountdown(countdown - 1), 1000);
		}
		return () => clearTimeout(timer);
	}, [countdown]);

	// Handle forgot password submission
	const onEmailSubmit = async (data: ForgotPasswordFormValues) => {
		try {
			setIsSubmitting(true);
			await forgotPassword(data.email);

			setStoredEmail(data.email);
			setCurrentStep(ResetStep.RESET);
			setCountdown(60);
			resetForm.reset();
		} catch (error) {
			console.error("Forgot password error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle reset password submission
	// Handle reset password submission
	const onResetSubmit = async (data: ResetPasswordStepValues) => {
		try {
			setIsSubmitting(true);
			// Make sure we're sending all required fields
			await resetPassword(
				storedEmail,
				data.otp,
				data.password,
				data.confirmPassword, // Add confirmPassword to the call
			);
		} catch (error) {
			console.error("Reset password error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle resend OTP
	const handleResendOtp = async () => {
		try {
			setIsResending(true);
			setResendSuccess(false);

			await forgotPassword(storedEmail);

			setResendSuccess(true);
			setCountdown(60);

			setTimeout(() => setResendSuccess(false), 3000);
		} catch (error) {
			console.error("Resend OTP error:", error);
		} finally {
			setIsResending(false);
		}
	};

	// Handle edit email
	const handleEditEmail = () => {
		setCurrentStep(ResetStep.EMAIL);
		setStoredEmail("");
		resetForm.reset();
	};

	// Toggle password visibility
	const togglePasswordVisibility = () => setShowPassword(!showPassword);
	const toggleConfirmPasswordVisibility = () =>
		setShowConfirmPassword(!showConfirmPassword);

	// Render email step
	const renderEmailStep = () => (
		<Form {...emailForm}>
			<form
				onSubmit={emailForm.handleSubmit(onEmailSubmit)}
				className="space-y-4"
			>
				<div className="space-y-2 text-center mb-4">
					<div className="flex justify-center mb-2">
						<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
							<KeyRound className="h-6 w-6 text-primary" />
						</div>
					</div>
					<h3 className="text-lg font-semibold">
						Forgot your password?
					</h3>
					<p className="text-sm text-muted-foreground">
						Enter your email address and we'll send you a code to
						reset your password.
					</p>
				</div>

				<FormField
					control={emailForm.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email Address</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder="john.doe@example.com"
									{...field}
									disabled={isSubmitting}
									autoComplete="email"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full"
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Sending code...
						</>
					) : (
						"Send Reset Code"
					)}
				</Button>
			</form>
		</Form>
	);

	// Render reset step
	const renderResetStep = () => (
		<div className="space-y-6">
			{/* Header with email display and edit button */}
			<div className="space-y-2">
				<div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
					<div className="flex items-center space-x-2">
						<Mail className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">
							{storedEmail}
						</span>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleEditEmail}
						className="h-8 px-2"
						disabled={isSubmitting}
					>
						<Edit className="h-3 w-3 mr-1" />
						Edit
					</Button>
				</div>
				<p className="text-xs text-muted-foreground text-center">
					We've sent a 6-digit verification code to this email
				</p>
			</div>

			{/* Success Alert for Resend */}
			{resendSuccess && (
				<Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
					<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
					<AlertTitle className="text-green-600 dark:text-green-400">
						Code Sent!
					</AlertTitle>
					<AlertDescription className="text-green-600 dark:text-green-400">
						A new verification code has been sent to your email.
					</AlertDescription>
				</Alert>
			)}

			<Form {...resetForm}>
				<form
					onSubmit={resetForm.handleSubmit(onResetSubmit)}
					className="space-y-4"
				>
					{/* OTP Field */}
					<FormField
						control={resetForm.control}
						name="otp"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Verification Code</FormLabel>
								<FormControl>
									<InputOTP
										maxLength={6}
										value={field.value}
										onChange={field.onChange}
										disabled={isSubmitting}
									>
										<InputOTPGroup>
											<InputOTPSlot
												index={0}
												className="h-12 w-12 text-lg border-2"
											/>
											<InputOTPSlot
												index={1}
												className="h-12 w-12 text-lg border-2"
											/>
											<InputOTPSlot
												index={2}
												className="h-12 w-12 text-lg border-2"
											/>
											<InputOTPSlot
												index={3}
												className="h-12 w-12 text-lg border-2"
											/>
											<InputOTPSlot
												index={4}
												className="h-12 w-12 text-lg border-2"
											/>
											<InputOTPSlot
												index={5}
												className="h-12 w-12 text-lg border-2"
											/>
										</InputOTPGroup>
									</InputOTP>
								</FormControl>
								<FormDescription className="text-center">
									Enter the 6-digit code sent to your email
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* New Password Field */}
					<FormField
						control={resetForm.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											type={
												showPassword
													? "text"
													: "password"
											}
											placeholder="••••••••"
											{...field}
											disabled={isSubmitting}
											className="pr-10"
											autoComplete="new-password"
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={togglePasswordVisibility}
											disabled={isSubmitting}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4 text-gray-500" />
											) : (
												<Eye className="h-4 w-4 text-gray-500" />
											)}
										</Button>
									</div>
								</FormControl>
								<p className="text-xs text-muted-foreground mt-1">
									Must be at least 8 characters with 1
									uppercase, 1 lowercase, and 1 number
								</p>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Confirm Password Field */}
					<FormField
						control={resetForm.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm New Password</FormLabel>
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
											disabled={isSubmitting}
											className="pr-10"
											autoComplete="new-password"
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={
												toggleConfirmPasswordVisibility
											}
											disabled={isSubmitting}
										>
											{showConfirmPassword ? (
												<EyeOff className="h-4 w-4 text-gray-500" />
											) : (
												<Eye className="h-4 w-4 text-gray-500" />
											)}
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Resend Section */}
					<div className="flex items-center justify-between">
						<Button
							type="button"
							variant="link"
							size="sm"
							onClick={handleResendOtp}
							disabled={isResending || countdown > 0}
							className="px-0 h-auto"
						>
							{isResending ? (
								<>
									<Loader2 className="mr-2 h-3 w-3 animate-spin" />
									Sending...
								</>
							) : countdown > 0 ? (
								`Resend code in ${countdown}s`
							) : (
								"Didn't receive code? Resend"
							)}
						</Button>
					</div>

					<Separator />

					{/* Submit Button */}
					<Button
						type="submit"
						className="w-full"
						disabled={isSubmitting || !formState.isValid}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Resetting password...
							</>
						) : (
							<>
								<ShieldCheck className="mr-2 h-4 w-4" />
								Reset Password
							</>
						)}
					</Button>
				</form>
			</Form>
		</div>
	);

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold text-center">
					{currentStep === ResetStep.EMAIL
						? "Reset Password"
						: "Create New Password"}
				</CardTitle>
				<CardDescription className="text-center">
					{currentStep === ResetStep.EMAIL
						? "Enter your email to receive a verification code"
						: "Enter the code and your new password"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{currentStep === ResetStep.EMAIL
					? renderEmailStep()
					: renderResetStep()}
			</CardContent>
			<CardFooter className="flex flex-col space-y-4">
				<div className="text-sm text-center text-muted-foreground">
					<Link
						href="/auth/login"
						className="text-primary hover:underline inline-flex items-center"
					>
						<ArrowLeft className="mr-1 h-3 w-3" />
						Back to Login
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}

export default ResetPasswordForm;
