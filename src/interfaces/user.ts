/**
 * User Interfaces
 * Type definitions for user-related data structures
 */

/**
 * User Role Enum
 */
export type UserRole = "user" | "admin";

/**
 * Complete User Data Interface
 * Represents a user in the system
 */
export interface User {
	id: string;
	firstName: string;
	lastName: string;
	fullName?: string; // Computed field: firstName + lastName
	userName: string;
	email: string;
	emailVerified: boolean;
	avatar?: string | null;
	bio?: string | null;
	phone?: string | null;
	role: UserRole;
	isActive: boolean;
	lastLoginAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * User Profile Update Interface
 * Fields that can be updated by the user
 */
export interface UserProfileUpdate {
	firstName?: string;
	lastName?: string;
	userName?: string;
	avatar?: string | null;
	bio?: string | null;
	phone?: string | null;
}

/**
 * Me API Response Interface
 */
export interface MeResponse {
	user: User;
}

