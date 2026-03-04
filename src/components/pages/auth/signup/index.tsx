"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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

// Context and Validation
import { useAuth } from "@/components/context/auth-context";
import { signupSchema, SignupFormValues } from "@/lib/validations/auth.validations";

export function SignupForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	
	const router = useRouter();
	const { signup } = useAuth();

	// Initialize form
	const form = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
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
		try {
			setIsSubmitting(true);
			await signup(data);
			// Signup success - redirect happens in auth context
		} catch (error) {
			// Error is already handled in auth context with toast
			console.error("Signup error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const togglePasswordVisibility = () => setShowPassword(!showPassword);
	const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold text-center">
					Create an account
				</CardTitle>
				<CardDescription className="text-center">
					Enter your information to get started
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* Name Fields - Row */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input 
												placeholder="John" 
												{...field} 
												disabled={isSubmitting}
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
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input 
												placeholder="Doe" 
												{...field} 
												disabled={isSubmitting}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Username Field */}
						<FormField
							control={form.control}
							name="userName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input 
											placeholder="johndoe123" 
											{...field} 
											disabled={isSubmitting}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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
										Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number
									</p>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Confirm Password Field */}
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={showConfirmPassword ? "text" : "password"}
												placeholder="••••••••"
												{...field}
												disabled={isSubmitting}
												className="pr-10"
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={toggleConfirmPasswordVisibility}
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

						{/* Terms and Conditions Checkbox */}
						<FormField
							control={form.control}
							name="acceptTerms"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={isSubmitting}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel className="text-sm font-normal">
											I accept the{" "}
											<Link 
												href="/terms" 
												className="text-primary hover:underline"
												target="_blank"
											>
												terms and conditions
											</Link>
										</FormLabel>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>

						{/* Submit Button */}
						<Button 
							type="submit" 
							className="w-full" 
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating account...
								</>
							) : (
								"Sign Up"
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex flex-col space-y-4">
				<div className="text-sm text-center text-muted-foreground">
					Already have an account?{" "}
					<Link 
						href="/auth/login" 
						className="text-primary hover:underline"
					>
						Login
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}

export default SignupForm;