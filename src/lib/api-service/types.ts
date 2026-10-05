export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: {
		code: string;
		message: string;
		details?: unknown;
	};
	meta?: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		pageSize: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		nextPage: number;
		previousPage: number;
	};
}
