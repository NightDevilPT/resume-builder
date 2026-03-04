"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, MeResponse } from "@/interfaces/user";
import { apiClient, ApiError } from "@/lib/services/api-client.service";
import { API_URLS } from "@/constants/api-urls";

// Response types for API calls
interface LoginResponse {
	user: User;
	message: string;
	accessToken?: string;
}

interface SignupResponse {
	user: User;
	message: string;
}

interface VerifyEmailResponse {
	user: User;
	message: string;
}

interface ResendOtpResponse {
	message: string;
	email: string;
	expiresIn: string;
}

interface ForgotPasswordResponse {
	message: string;
	email: string;
	expiresIn: string;
}

interface ResetPasswordResponse {
	message: string;
}

interface LogoutResponse {
	message: string;
}

// Types
interface AuthState {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
	// Auth actions
	login: (
		email: string,
		password: string,
		rememberMe?: boolean,
	) => Promise<void>;
	signup: (userData: SignupData) => Promise<void>;
	logout: () => Promise<void>;
	verifyEmail: (email: string, otp: string) => Promise<void>;
	resendOtp: (email: string) => Promise<void>;
	forgotPassword: (email: string) => Promise<void>;
	resetPassword: (
		email: string,
		otp: string,
		password: string,
		confirmPassword: string,
	) => Promise<void>;

	// User actions
	refreshUser: () => Promise<void>;
	updateProfile: (data: Partial<User>) => Promise<void>;

	// Utility
	clearAuthState: () => void;
}

interface SignupData {
	firstName: string;
	lastName: string;
	userName: string;
	email: string;
	password: string;
	confirmPassword: string;
	acceptTerms: boolean;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [state, setState] = useState<AuthState>({
		user: null,
		isLoading: true,
		isAuthenticated: false,
	});

	const router = useRouter();

	// Check authentication status on mount
	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			const response = await apiClient.get<MeResponse>(API_URLS.AUTH.ME);

			if (response.success && response.data) {
				setState({
					user: response.data.user,
					isLoading: false,
					isAuthenticated: true,
				});
			}
		} catch (error) {
			// User is not authenticated
			setState({
				user: null,
				isLoading: false,
				isAuthenticated: false,
			});
		}
	};

	// Login function
	const login = async (
		email: string,
		password: string,
		rememberMe = false,
	) => {
		try {
			setState((prev) => ({ ...prev, isLoading: true }));

			const response = await apiClient.post<LoginResponse>(
				API_URLS.AUTH.LOGIN,
				{ email, password, rememberMe },
			);

			if (response.success && response.data) {
				setState({
					user: response.data.user,
					isLoading: false,
					isAuthenticated: true,
				});

				toast.success(response.data.message || "Login successful!");
				router.push("/dashboard");
			}
		} catch (error: any) {
			setState((prev) => ({ ...prev, isLoading: false }));

			// Handle specific error cases
			if (error.message.includes("EMAIL_NOT_VERIFIED")) {
				toast.error(
					"Please verify your email first. Check your inbox for the verification code.",
				);
				router.push(
					`/auth/verify-email?email=${encodeURIComponent(email)}`,
				);
			} else if (error.message.includes("ACCOUNT_BANNED")) {
				toast.error(
					"Your account has been banned. Please contact support.",
				);
			} else if (error.message.includes("ACCOUNT_INACTIVE")) {
				toast.error(
					"Your account is inactive. Please contact support.",
				);
			} else {
				toast.error(error.message || "Login failed");
			}

			throw error;
		}
	};

	// Signup function
	const signup = async (userData: SignupData) => {
		try {
			setState((prev) => ({ ...prev, isLoading: true }));

			const response = await apiClient.post<SignupResponse>(
				API_URLS.AUTH.SIGNUP,
				userData,
			);

			if (response.success && response.data) {
				setState((prev) => ({ ...prev, isLoading: false }));
				toast.success(
					response.data.message || "Account created successfully!",
				);

				// Redirect to email verification page
				router.push(
					`/auth/verify-email?email=${encodeURIComponent(userData.email)}`,
				);
			}
		} catch (error: any) {
			setState((prev) => ({ ...prev, isLoading: false }));

			if (
				error.message.includes("USER_EXISTS") ||
				error.message.includes("already exists")
			) {
				toast.error("Account already exists. Please try logging in.");
			} else {
				toast.error(error.message || "Signup failed");
			}

			throw error;
		}
	};

	// Logout function
	const logout = async () => {
		try {
			await apiClient.post(API_URLS.AUTH.LOGOUT, {});
		} catch (error) {
			// Even if logout API fails, clear local state
			console.error("Logout API error:", error);
		} finally {
			// Clear auth state
			setState({
				user: null,
				isLoading: false,
				isAuthenticated: false,
			});

			toast.success("Logged out successfully");
			router.push("/auth/login");
		}
	};

	// Verify email function
	const verifyEmail = async (email: string, otp: string) => {
		try {
			setState((prev) => ({ ...prev, isLoading: true }));

			const response = await apiClient.post<VerifyEmailResponse>(
				API_URLS.AUTH.VERIFY_EMAIL,
				{ email, otp },
			);

			if (response.success && response.data) {
				setState((prev) => ({ ...prev, isLoading: false }));
				toast.success(
					response.data.message || "Email verified successfully!",
				);

				// Redirect to login page
				router.push("/auth/login");
			}
		} catch (error: any) {
			setState((prev) => ({ ...prev, isLoading: false }));

			if (error.message.includes("OTP_EXPIRED")) {
				toast.error(
					"Verification code expired. Please request a new one.",
				);
			} else if (error.message.includes("INVALID_OTP")) {
				toast.error("Invalid verification code. Please try again.");
			} else {
				toast.error(error.message || "Email verification failed");
			}

			throw error;
		}
	};

	// Resend OTP function
	const resendOtp = async (email: string) => {
		try {
			setState((prev) => ({ ...prev, isLoading: true }));

			const response = await apiClient.post<ResendOtpResponse>(
				API_URLS.AUTH.RESEND_OTP,
				{ email },
			);

			if (response.success && response.data) {
				setState((prev) => ({ ...prev, isLoading: false }));
				toast.success(
					response.data.message ||
						"Verification code sent successfully!",
				);
			}
		} catch (error: any) {
			setState((prev) => ({ ...prev, isLoading: false }));

			if (error.message.includes("TOO_MANY_REQUESTS")) {
				toast.error(error.message);
			} else if (error.message.includes("ALREADY_VERIFIED")) {
				toast.success(
					"Your email is already verified. You can log in.",
				);
				router.push("/auth/login");
			} else {
				toast.error(
					error.message || "Failed to resend verification code",
				);
			}

			throw error;
		}
	};

	// Forgot Password function
	const forgotPassword = async (email: string) => {
		try {
			setState((prev) => ({ ...prev, isLoading: true }));

			const response = await apiClient.post<ForgotPasswordResponse>(
				API_URLS.AUTH.FORGOT_PASSWORD,
				{ email },
			);

			if (response.success && response.data) {
				setState((prev) => ({ ...prev, isLoading: false }));
				toast.success(
					response.data.message ||
						"If an account exists with this email, you will receive a password reset code.",
				);

				// Redirect to reset password page with email
				router.push(
					`/auth/reset-password?email=${encodeURIComponent(email)}`,
				);
			}
		} catch (error: any) {
			setState((prev) => ({ ...prev, isLoading: false }));

			if (error.message.includes("EMAIL_NOT_VERIFIED")) {
				toast.error(
					"Please verify your email first before resetting password.",
				);
				router.push(
					`/auth/verify-email?email=${encodeURIComponent(email)}`,
				);
			} else if (error.message.includes("ACCOUNT_BANNED")) {
				toast.error(
					"Your account has been banned. Please contact support.",
				);
			} else if (error.message.includes("ACCOUNT_INACTIVE")) {
				toast.error(
					"Your account is inactive. Please contact support.",
				);
			} else if (error.message.includes("TOO_MANY_REQUESTS")) {
				toast.error(error.message);
			} else if (!error.message.includes("USER_NOT_FOUND")) {
				// Don't show error for non-existent users (security)
				toast.error(error.message || "Failed to process request");
			}

			throw error;
		}
	};

	// Reset Password function
	// Reset Password function
	const resetPassword = async (
		email: string,
		otp: string,
		password: string,
		confirmPassword: string, // Add this parameter
	) => {
		try {
			setState((prev) => ({ ...prev, isLoading: true }));

			const response = await apiClient.post<ResetPasswordResponse>(
				API_URLS.AUTH.RESET_PASSWORD,
				{ email, otp, password, confirmPassword }, // Include confirmPassword
			);

			if (response.success && response.data) {
				setState((prev) => ({ ...prev, isLoading: false }));
				toast.success(
					response.data.message ||
						"Password reset successful! You can now login with your new password.",
				);

				// Redirect to login page
				router.push("/auth/login");
			}
		} catch (error: any) {
			setState((prev) => ({ ...prev, isLoading: false }));

			if (error.message.includes("USER_NOT_FOUND")) {
				toast.error("No account found with this email address.");
			} else if (error.message.includes("NO_OTP_REQUESTED")) {
				toast.error(
					"No password reset code has been requested. Please request a new code.",
				);
				router.push("/auth/forgot-password");
			} else if (error.message.includes("OTP_EXPIRED")) {
				toast.error(
					"Password reset code has expired. Please request a new one.",
				);
				router.push("/auth/forgot-password");
			} else if (error.message.includes("INVALID_OTP")) {
				toast.error("Invalid password reset code. Please try again.");
			} else if (error.message.includes("ACCOUNT_BANNED")) {
				toast.error(
					"Your account has been banned. Please contact support.",
				);
			} else if (error.message.includes("ACCOUNT_INACTIVE")) {
				toast.error(
					"Your account is inactive. Please contact support.",
				);
			} else if (error.message.includes("EMAIL_NOT_VERIFIED")) {
				toast.error("Please verify your email first.");
				router.push(
					`/auth/verify-email?email=${encodeURIComponent(email)}`,
				);
			} else {
				toast.error(error.message || "Failed to reset password");
			}

			throw error;
		}
	};

	// Refresh user data
	const refreshUser = async () => {
		try {
			const response = await apiClient.get<MeResponse>(API_URLS.AUTH.ME);

			if (response.success && response.data?.user) {
				setState((prev) => ({
					...prev,
					user: response.data?.user || null,
					isAuthenticated: true,
				}));
			}
		} catch (error) {
			// If refresh fails, user might be logged out
			setState({
				user: null,
				isLoading: false,
				isAuthenticated: false,
			});
		}
	};

	// Update profile (placeholder for future implementation)
	const updateProfile = async (data: Partial<User>) => {
		try {
			setState((prev) => ({ ...prev, isLoading: true }));

			// This would be implemented when profile update API is available
			// const response = await apiClient.put('/auth/profile', data);

			// For now, just update local state
			setState((prev) => ({
				...prev,
				user: prev.user ? { ...prev.user, ...data } : null,
				isLoading: false,
			}));

			toast.success("Profile updated successfully!");
		} catch (error: any) {
			setState((prev) => ({ ...prev, isLoading: false }));
			toast.error(error.message || "Failed to update profile");
			throw error;
		}
	};

	// Clear auth state utility
	const clearAuthState = () => {
		setState({
			user: null,
			isLoading: false,
			isAuthenticated: false,
		});
	};

	const value: AuthContextType = {
		...state,
		login,
		signup,
		logout,
		verifyEmail,
		resendOtp,
		forgotPassword,
		resetPassword,
		refreshUser,
		updateProfile,
		clearAuthState,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

// Hook to use auth context
export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

// Export types for use in components
export type { AuthContextType, SignupData };
