"use client";

import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/interfaces/user";
import React, { createContext, useContext, ReactNode } from "react";

/**
 * Auth Context Interface
 */
interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	logout: () => Promise<void>;
	updateUser: (updatedData: Partial<User>) => void;
}

/**
 * Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
	children: ReactNode;
}

/**
 * Auth Provider Component
 * Provides authentication state to the entire application
 *
 * @example
 * // In app layout
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }: AuthProviderProps) {
	const auth = useAuth();

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/**
 * useAuthContext Hook
 * Access authentication state from any component
 *
 * @throws Error if used outside of AuthProvider
 *
 * @example
 * const { user, isAuthenticated, logout } = useAuthContext();
 */
export function useAuthContext(): AuthContextType {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}

	return context;
}
