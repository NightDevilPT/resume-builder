export interface ApiResponse<T> {
	success: boolean;
	data: T;
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
