/**
 * API Client
 * Centralized HTTP client for making API requests
 */

import { ApiResponse } from "@/interfaces/api-response.interface";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * API Error Class
 */
export class ApiError extends Error {
	constructor(
		public status: number,
		public code: string,
		message: string,
		public details?: unknown
	) {
		super(message);
		this.name = "ApiError";
	}
}

/**
 * HTTP Methods
 */
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Request Options
 */
interface RequestOptions {
	headers?: Record<string, string>;
	params?: Record<string, string | number | boolean | undefined>;
	body?: unknown;
}

/**
 * API Client Class
 */
class ApiClient {
	private baseURL: string;

	constructor(baseURL: string = BASE_URL) {
		this.baseURL = baseURL;
	}

	/**
	 * Build URL with query parameters
	 */
	private buildUrl(
		endpoint: string,
		params?: Record<string, string | number | boolean | undefined>
	): string {
		const url = new URL(`${this.baseURL}${endpoint}`);

		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					url.searchParams.append(key, String(value));
				}
			});
		}

		return url.toString();
	}

	/**
	 * Make HTTP request
	 */
	private async request<T>(
		method: HttpMethod,
		endpoint: string,
		options: RequestOptions = {}
	): Promise<ApiResponse<T>> {
		const { headers = {}, params, body } = options;

		const url = this.buildUrl(endpoint, params);

		const config: RequestInit = {
			method,
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
		};

		if (body && method !== "GET") {
			config.body = JSON.stringify(body);
		}

		try {
			const response = await fetch(url, config);
			const data = await response.json();

			if (!response.ok) {
				throw new ApiError(
					response.status,
					data.error?.code || "UNKNOWN_ERROR",
					data.error?.message || "An error occurred",
					data.error?.details
				);
			}

			return data;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			// Network or other errors
			throw new ApiError(
				0,
				"NETWORK_ERROR",
				error instanceof Error
					? error.message
					: "Network error occurred"
			);
		}
	}

	/**
	 * GET request
	 */
	async get<T>(
		endpoint: string,
		params?: Record<string, string | number | boolean | undefined>
	): Promise<ApiResponse<T>> {
		return this.request<T>("GET", endpoint, { params });
	}

	/**
	 * GET request for listing with pagination
	 */
	async getAll<T>(
		endpoint: string,
		params?: {
			page?: number;
			pageSize?: number;
			[key: string]: string | number | boolean | undefined;
		}
	): Promise<ApiResponse<T[]>> {
		return this.request<T[]>("GET", endpoint, { params });
	}

	/**
	 * POST request
	 */
	async post<T>(
		endpoint: string,
		body: unknown,
		headers?: Record<string, string>
	): Promise<ApiResponse<T>> {
		return this.request<T>("POST", endpoint, { body, headers });
	}

	/**
	 * PUT request
	 */
	async put<T>(
		endpoint: string,
		body: unknown,
		headers?: Record<string, string>
	): Promise<ApiResponse<T>> {
		return this.request<T>("PUT", endpoint, { body, headers });
	}

	/**
	 * PATCH request
	 */
	async patch<T>(
		endpoint: string,
		body: unknown,
		headers?: Record<string, string>
	): Promise<ApiResponse<T>> {
		return this.request<T>("PATCH", endpoint, { body, headers });
	}

	/**
	 * DELETE request
	 */
	async delete<T>(
		endpoint: string,
		params?: Record<string, string | number | boolean | undefined>
	): Promise<ApiResponse<T>> {
		return this.request<T>("DELETE", endpoint, { params });
	}
}

/**
 * Export singleton instance
 */
export const apiClient = new ApiClient();

/**
 * Export class for custom instances
 */
export { ApiClient };
