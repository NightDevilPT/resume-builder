"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Context and Validation
import { useAuth } from "@/components/context/auth-context";
import { 
	loginSchema, 
	LoginFormValues 
} from "@/lib/validations/auth.validations";

export function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const router = useRouter();
	const { login } = useAuth();

	// Initialize form
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const onSubmit = async (data: LoginFormValues) => {
		try {
			setIsSubmitting(true);
			await login(data.email, data.password, data.rememberMe);
			// On success, redirect happens in auth context
		} catch (error) {
			// Error is already handled in auth context with toast
			console.error("Login error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const togglePasswordVisibility = () => setShowPassword(!showPassword);

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="space-y-1">
				<div className="flex justify-center mb-4">
					<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
						<LogIn className="h-6 w-6 text-primary" />
					</div>
				</div>
				<CardTitle className="text-2xl font-bold text-center">
					Welcome back
				</CardTitle>
				<CardDescription className="text-center">
					Enter your credentials to access your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* Email Field */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
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

						{/* Password Field */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={showPassword ? "text" : "password"}
												placeholder="••••••••"
												{...field}
												disabled={isSubmitting}
												className="pr-10"
												autoComplete="current-password"
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
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Remember Me & Forgot Password Row */}
						<div className="flex items-center justify-between">
							<FormField
								control={form.control}
								name="rememberMe"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center space-x-2 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={isSubmitting}
											/>
										</FormControl>
										<FormLabel className="text-sm font-normal cursor-pointer">
											Remember me
										</FormLabel>
									</FormItem>
								)}
							/>
							<Link
								href="/auth/forgot-password"
								className="text-sm text-primary hover:underline"
							>
								Forgot password?
							</Link>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Logging in...
								</>
							) : (
								"Login"
							)}
						</Button>
					</form>
				</Form>

				{/* Demo Credentials */}
				<div className="mt-6">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<Separator className="w-full" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-card px-2 text-muted-foreground">
								Demo credentials
							</span>
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col space-y-4">
				<div className="text-sm text-center text-muted-foreground">
					Don't have an account?{" "}
					<Link
						href="/auth/signup"
						className="text-primary hover:underline font-medium"
					>
						Sign up
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}

export default LoginForm;