"use client";

import { API_URLS } from "@/constants/api-urls";
import { useState, useEffect, useCallback } from "react";
import type { User, MeResponse } from "@/interfaces/user";
import { apiClient, ApiError } from "@/lib/services/api-client.service";

/**
 * useAuth Hook
 * Custom hook for managing authentication state and user data
 *
 * @example
 * const { user, isLoading, isAuthenticated, error, refetch, logout } = useAuth();
 */
export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Fetch current user data from /api/auth/me
	 */
	const fetchUser = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await apiClient.get<MeResponse>(API_URLS.AUTH.ME);

			if (response.data?.user) {
				setUser(response.data.user);
			} else {
				setUser(null);
			}
		} catch (err) {
			console.error("[USE_AUTH_ERROR]:", err);

			if (err instanceof ApiError) {
				// Handle specific error cases
				if (
					err.code === "UNAUTHORIZED" ||
					err.code === "TOKEN_INVALID"
				) {
					// User is not authenticated or token expired
					setUser(null);
					setError(null); // Don't show error for unauthenticated state
				} else if (err.code === "ACCOUNT_BANNED") {
					setError("Your account has been banned.");
					setUser(null);
				} else if (err.code === "ACCOUNT_INACTIVE") {
					setError("Your account is inactive.");
					setUser(null);
				} else {
					setError(err.message || "Failed to fetch user data");
					setUser(null);
				}
			} else {
				setError("An unexpected error occurred");
				setUser(null);
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	/**
	 * Refetch user data manually
	 */
	const refetch = useCallback(() => {
		return fetchUser();
	}, [fetchUser]);

	/**
	 * Logout user (clear cookies and local state)
	 */
	const logout = useCallback(async () => {
		try {
			// Call logout API to clear server-side cookies
			await apiClient.post(API_URLS.AUTH.LOGOUT, {});
		} catch (error) {
			console.error("[LOGOUT_API_ERROR]:", error);
			// Continue with local logout even if API call fails
		} finally {
			// Always clear local state
			setUser(null);
			setError(null);
		}
	}, []);

	/**
	 * Update user data locally (optimistic update)
	 */
	const updateUser = useCallback((updatedData: Partial<User>) => {
		setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
	}, []);

	// Fetch user on mount
	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	return {
		user,
		isLoading,
		isAuthenticated: !!user,
		error,
		refetch,
		logout,
		updateUser,
	};
}

