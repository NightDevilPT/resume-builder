"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

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

// Context and Validation
import { useAuth } from "@/components/context/auth-context";
import { 
	verifyEmailSchema, 
	VerifyEmailFormValues,
	resendOtpSchema,
} from "@/lib/validations/auth.validations";

export function VerifyEmailForm() {
	const [isVerifying, setIsVerifying] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const [resendSuccess, setResendSuccess] = useState(false);
	const [countdown, setCountdown] = useState(0);

	const router = useRouter();
	const searchParams = useSearchParams();
	const { verifyEmail, resendOtp } = useAuth();

	// Get email from URL query params
	const emailFromUrl = searchParams.get("email") || "";

	// Initialize form
	const form = useForm<VerifyEmailFormValues>({
		resolver: zodResolver(verifyEmailSchema),
		defaultValues: {
			email: emailFromUrl,
			otp: "",
		},
	});

	const { watch } = form;
	const watchedEmail = watch("email");

	// Handle countdown timer for resend
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (countdown > 0) {
			timer = setTimeout(() => setCountdown(countdown - 1), 1000);
		}
		return () => clearTimeout(timer);
	}, [countdown]);

	const onSubmit = async (data: VerifyEmailFormValues) => {
		try {
			setIsVerifying(true);
			await verifyEmail(data.email, data.otp);
			// On success, redirect happens in auth context
		} catch (error) {
			// Error handled in auth context with toast
			console.error("Verification error:", error);
		} finally {
			setIsVerifying(false);
		}
	};

	const handleResendOtp = async () => {
		try {
			setIsResending(true);
			setResendSuccess(false);
			
			const email = form.getValues("email");
			
			// Validate email before sending
			const validationResult = resendOtpSchema.safeParse({ email });
			if (!validationResult.success) {
				form.setError("email", { 
					message: validationResult.error.issues[0]?.message 
				});
				return;
			}

			await resendOtp(email);
			
			// Show success message and start cooldown
			setResendSuccess(true);
			setCountdown(60); // 60 second cooldown
			
			// Reset success message after 3 seconds
			setTimeout(() => setResendSuccess(false), 3000);
		} catch (error) {
			// Error handled in auth context with toast
			console.error("Resend OTP error:", error);
		} finally {
			setIsResending(false);
		}
	};

	const isEmailDisabled = !!emailFromUrl;

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="space-y-1">
				<div className="flex justify-center mb-4">
					<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
						<Mail className="h-6 w-6 text-primary" />
					</div>
				</div>
				<CardTitle className="text-2xl font-bold text-center">
					Verify your email
				</CardTitle>
				<CardDescription className="text-center">
					We've sent a 6-digit verification code to your email
				</CardDescription>
			</CardHeader>
			<CardContent>
				{/* Success Alert for Resend */}
				{resendSuccess && (
					<Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950/20">
						<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
						<AlertTitle className="text-green-600 dark:text-green-400">
							Code Sent!
						</AlertTitle>
						<AlertDescription className="text-green-600 dark:text-green-400">
							A new verification code has been sent to your email.
						</AlertDescription>
					</Alert>
				)}

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Email Field */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email Address</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="john.doe@example.com"
											{...field}
											disabled={isEmailDisabled || isVerifying}
											className={isEmailDisabled ? "bg-muted" : ""}
										/>
									</FormControl>
									{isEmailDisabled && (
										<FormDescription>
											This email was pre-filled from signup
										</FormDescription>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* OTP Field - Fixed Version */}
						<FormField
							control={form.control}
							name="otp"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Verification Code</FormLabel>
									<FormControl>
										<InputOTP
											maxLength={6}
											value={field.value}
											onChange={field.onChange}
											disabled={isVerifying}
										>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
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

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full"
							disabled={isVerifying || !form.formState.isValid}
						>
							{isVerifying ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Verifying...
								</>
							) : (
								"Verify Email"
							)}
						</Button>
					</form>
				</Form>

				{/* Resend Section */}
				<div className="mt-6 text-center">
					<p className="text-sm text-muted-foreground mb-2">
						Didn't receive the code?
					</p>
					<div className="flex items-center justify-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleResendOtp}
							disabled={isResending || countdown > 0 || !watchedEmail}
							className="min-w-[120px]"
						>
							{isResending ? (
								<>
									<Loader2 className="mr-2 h-3 w-3 animate-spin" />
									Sending...
								</>
							) : countdown > 0 ? (
								`Resend in ${countdown}s`
							) : (
								"Resend Code"
							)}
						</Button>
					</div>
				</div>

				{/* Help Text */}
				<Alert className="mt-6 bg-muted/50">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Having trouble?</AlertTitle>
					<AlertDescription className="text-sm">
						Check your spam folder or make sure you entered the correct email address.
						The code expires in 10 minutes.
					</AlertDescription>
				</Alert>
			</CardContent>
			<CardFooter className="flex flex-col space-y-4">
				<div className="text-sm text-center text-muted-foreground">
					<Link 
						href="/auth/login" 
						className="text-primary hover:underline"
					>
						Back to Login
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}

export default VerifyEmailForm;