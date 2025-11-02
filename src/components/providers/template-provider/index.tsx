// components/providers/template-provider/index.tsx
"use client";

import { TemplateConfig } from "@/interfaces/templates";
import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { apiClient, ApiError } from "@/lib/services/api-client.service";
import { API_URLS } from "@/constants/api-urls";
import type { CreateTemplateInput } from "@/lib/validations/template.validations";

// Sync status for persistence
export type SyncStatus = "idle" | "syncing" | "synced" | "error";

// Track template changes for auto-save
export interface TemplateChangeTracker {
	templateId: string;
	hasUnsavedChanges: boolean;
	lastSavedAt: string | null;
	lastModifiedAt: string;
}

// Initial empty template state
const emptyTemplateState = {
	templates: [] as TemplateConfig[],
	currentTemplateId: null as string | null,
	selectedTemplate: null as TemplateConfig | null,
	isLoading: false,
	error: null as string | null,

	// Persistence & sync
	syncStatus: "idle" as SyncStatus,
	unsavedChanges: new Map<string, TemplateChangeTracker>(), // templateId -> changes
	isSaving: false,
	lastSyncedAt: null as string | null,

	// Admin/filter states
	filters: {
		category: null as string | null,
		priceRange: null as { min: number; max: number } | null,
		isPaid: null as boolean | null,
		isPublished: null as boolean | null,
		searchQuery: "",
	},

	// Preview/edit mode
	previewMode: false,
	editingTemplateId: null as string | null,

	// Pagination for large template lists
	pagination: {
		currentPage: 1,
		pageSize: 20,
		totalCount: 0,
	},
};

type TemplateState = typeof emptyTemplateState;

type TemplateAction =
	// Template CRUD
	| { type: "SET_TEMPLATES"; payload: TemplateConfig[] }
	| {
			type: "SET_TEMPLATES_WITH_COUNT";
			payload: { templates: TemplateConfig[]; totalCount: number };
	  }
	| { type: "ADD_TEMPLATE"; payload: TemplateConfig }
	| {
			type: "UPDATE_TEMPLATE";
			payload: { id: string; data: Partial<TemplateConfig> };
	  }
	| { type: "DELETE_TEMPLATE"; payload: string }

	// Current template selection
	| { type: "SELECT_TEMPLATE"; payload: string }
	| { type: "CLEAR_SELECTION" }
	| { type: "SET_SELECTED_TEMPLATE"; payload: TemplateConfig | null }

	// Publishing
	| { type: "PUBLISH_TEMPLATE"; payload: string }
	| { type: "UNPUBLISH_TEMPLATE"; payload: string }

	// Pricing
	| {
			type: "UPDATE_TEMPLATE_PRICING";
			payload: { id: string; pricing: TemplateConfig["pricing"] };
	  }

	// Persistence & Sync
	| { type: "MARK_TEMPLATE_CHANGED"; payload: string }
	| { type: "MARK_TEMPLATE_SAVED"; payload: string }
	| { type: "SET_SYNC_STATUS"; payload: SyncStatus }
	| { type: "START_SAVING" }
	| {
			type: "FINISH_SAVING";
			payload: { templateId: string; success: boolean };
	  }
	| { type: "SET_LAST_SYNCED" }
	| { type: "SYNC_FROM_SERVER"; payload: TemplateConfig[] }

	// Filters
	| { type: "SET_CATEGORY_FILTER"; payload: string | null }
	| { type: "SET_PRICE_FILTER"; payload: { min: number; max: number } | null }
	| { type: "SET_PAID_FILTER"; payload: boolean | null }
	| { type: "SET_PUBLISHED_FILTER"; payload: boolean | null }
	| { type: "SET_SEARCH_QUERY"; payload: string }
	| { type: "CLEAR_FILTERS" }

	// Pagination
	| { type: "SET_PAGE"; payload: number }
	| { type: "SET_PAGE_SIZE"; payload: number }
	| { type: "SET_TOTAL_COUNT"; payload: number }

	// Preview/Edit mode
	| { type: "TOGGLE_PREVIEW_MODE" }
	| { type: "SET_PREVIEW_MODE"; payload: boolean }
	| { type: "START_EDITING"; payload: string }
	| { type: "STOP_EDITING" }

	// Loading/Error
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null }

	// Reset
	| { type: "RESET_STATE" };

// Reducer function
function templateReducer(
	state: TemplateState,
	action: TemplateAction
): TemplateState {
	switch (action.type) {
		// Template CRUD
		case "SET_TEMPLATES":
			return {
				...state,
				templates: action.payload,
				isLoading: false,
				error: null,
			};

		case "SET_TEMPLATES_WITH_COUNT":
			return {
				...state,
				templates: action.payload.templates,
				pagination: {
					...state.pagination,
					totalCount: action.payload.totalCount,
				},
				isLoading: false,
				error: null,
			};

		case "ADD_TEMPLATE": {
			const newUnsavedChanges = new Map(state.unsavedChanges);
			newUnsavedChanges.set(action.payload.id, {
				templateId: action.payload.id,
				hasUnsavedChanges: true,
				lastSavedAt: null,
				lastModifiedAt: new Date().toISOString(),
			});

			return {
				...state,
				templates: [...state.templates, action.payload],
				unsavedChanges: newUnsavedChanges,
				pagination: {
					...state.pagination,
					totalCount: state.pagination.totalCount + 1,
				},
			};
		}

		case "UPDATE_TEMPLATE": {
			const newUnsavedChanges = new Map(state.unsavedChanges);
			newUnsavedChanges.set(action.payload.id, {
				templateId: action.payload.id,
				hasUnsavedChanges: true,
				lastSavedAt:
					newUnsavedChanges.get(action.payload.id)?.lastSavedAt ||
					null,
				lastModifiedAt: new Date().toISOString(),
			});

			return {
				...state,
				templates: state.templates.map((template) =>
					template.id === action.payload.id
						? { ...template, ...action.payload.data }
						: template
				),
				// Update selected template if it's the one being edited
				selectedTemplate:
					state.selectedTemplate?.id === action.payload.id
						? { ...state.selectedTemplate, ...action.payload.data }
						: state.selectedTemplate,
				unsavedChanges: newUnsavedChanges,
			};
		}

		case "DELETE_TEMPLATE":
			return {
				...state,
				templates: state.templates.filter(
					(t) => t.id !== action.payload
				),
				// Clear selection if deleted template was selected
				selectedTemplate:
					state.selectedTemplate?.id === action.payload
						? null
						: state.selectedTemplate,
				currentTemplateId:
					state.currentTemplateId === action.payload
						? null
						: state.currentTemplateId,
			};

		// Current template selection
		case "SELECT_TEMPLATE": {
			const template = state.templates.find(
				(t) => t.id === action.payload
			);
			return {
				...state,
				currentTemplateId: action.payload,
				selectedTemplate: template || null,
			};
		}

		case "CLEAR_SELECTION":
			return {
				...state,
				currentTemplateId: null,
				selectedTemplate: null,
			};

		case "SET_SELECTED_TEMPLATE":
			return {
				...state,
				selectedTemplate: action.payload,
				currentTemplateId: action.payload?.id || null,
			};

		// Publishing
		case "PUBLISH_TEMPLATE":
			return {
				...state,
				templates: state.templates.map((template) =>
					template.id === action.payload
						? {
								...template,
								metadata: {
									...template.metadata,
									isPublished: true,
									isActive: true,
									updatedAt: new Date().toISOString(),
								},
						  }
						: template
				),
			};

		case "UNPUBLISH_TEMPLATE":
			return {
				...state,
				templates: state.templates.map((template) =>
					template.id === action.payload
						? {
								...template,
								metadata: {
									...template.metadata,
									isPublished: false,
									updatedAt: new Date().toISOString(),
								},
						  }
						: template
				),
			};

		// Pricing
		case "UPDATE_TEMPLATE_PRICING":
			return {
				...state,
				templates: state.templates.map((template) =>
					template.id === action.payload.id
						? {
								...template,
								pricing: action.payload.pricing,
								metadata: {
									...template.metadata,
									updatedAt: new Date().toISOString(),
								},
						  }
						: template
				),
			};

		// Filters
		case "SET_CATEGORY_FILTER":
			return {
				...state,
				filters: { ...state.filters, category: action.payload },
			};

		case "SET_PRICE_FILTER":
			return {
				...state,
				filters: { ...state.filters, priceRange: action.payload },
			};

		case "SET_PAID_FILTER":
			return {
				...state,
				filters: { ...state.filters, isPaid: action.payload },
			};

		case "SET_PUBLISHED_FILTER":
			return {
				...state,
				filters: { ...state.filters, isPublished: action.payload },
			};

		case "SET_SEARCH_QUERY":
			return {
				...state,
				filters: { ...state.filters, searchQuery: action.payload },
			};

		case "CLEAR_FILTERS":
			return {
				...state,
				filters: {
					category: null,
					priceRange: null,
					isPaid: null,
					isPublished: null,
					searchQuery: "",
				},
			};

		// Preview/Edit mode
		case "TOGGLE_PREVIEW_MODE":
			return {
				...state,
				previewMode: !state.previewMode,
			};

		case "SET_PREVIEW_MODE":
			return {
				...state,
				previewMode: action.payload,
			};

		case "START_EDITING":
			return {
				...state,
				editingTemplateId: action.payload,
			};

		case "STOP_EDITING":
			return {
				...state,
				editingTemplateId: null,
			};

		// Persistence & Sync
		case "MARK_TEMPLATE_CHANGED": {
			const newUnsavedChanges = new Map(state.unsavedChanges);
			newUnsavedChanges.set(action.payload, {
				templateId: action.payload,
				hasUnsavedChanges: true,
				lastSavedAt:
					newUnsavedChanges.get(action.payload)?.lastSavedAt || null,
				lastModifiedAt: new Date().toISOString(),
			});
			return {
				...state,
				unsavedChanges: newUnsavedChanges,
			};
		}

		case "MARK_TEMPLATE_SAVED": {
			const newUnsavedChanges = new Map(state.unsavedChanges);
			const tracker = newUnsavedChanges.get(action.payload);
			if (tracker) {
				newUnsavedChanges.set(action.payload, {
					...tracker,
					hasUnsavedChanges: false,
					lastSavedAt: new Date().toISOString(),
				});
			}
			return {
				...state,
				unsavedChanges: newUnsavedChanges,
				isSaving: false,
			};
		}

		case "SET_SYNC_STATUS":
			return {
				...state,
				syncStatus: action.payload,
			};

		case "START_SAVING":
			return {
				...state,
				isSaving: true,
				syncStatus: "syncing",
			};

		case "FINISH_SAVING": {
			const newUnsavedChanges = new Map(state.unsavedChanges);
			if (action.payload.success) {
				const tracker = newUnsavedChanges.get(
					action.payload.templateId
				);
				if (tracker) {
					newUnsavedChanges.set(action.payload.templateId, {
						...tracker,
						hasUnsavedChanges: false,
						lastSavedAt: new Date().toISOString(),
					});
				}
			}
			return {
				...state,
				isSaving: false,
				syncStatus: action.payload.success ? "synced" : "error",
				unsavedChanges: newUnsavedChanges,
			};
		}

		case "SET_LAST_SYNCED":
			return {
				...state,
				lastSyncedAt: new Date().toISOString(),
			};

		case "SYNC_FROM_SERVER":
			return {
				...state,
				templates: action.payload,
				syncStatus: "synced",
				lastSyncedAt: new Date().toISOString(),
				unsavedChanges: new Map(), // Clear unsaved changes after sync
			};

		// Pagination
		case "SET_PAGE":
			return {
				...state,
				pagination: {
					...state.pagination,
					currentPage: action.payload,
				},
			};

		case "SET_PAGE_SIZE":
			return {
				...state,
				pagination: {
					...state.pagination,
					pageSize: action.payload,
					currentPage: 1, // Reset to first page
				},
			};

		case "SET_TOTAL_COUNT":
			return {
				...state,
				pagination: {
					...state.pagination,
					totalCount: action.payload,
				},
			};

		// Loading/Error
		case "SET_LOADING":
			return {
				...state,
				isLoading: action.payload,
			};

		case "SET_ERROR":
			return {
				...state,
				error: action.payload,
				isLoading: false,
			};

		// Reset
		case "RESET_STATE":
			return emptyTemplateState;

		default:
			return state;
	}
}

// Context interface
interface TemplateContextType {
	// State
	templates: TemplateConfig[];
	currentTemplateId: string | null;
	selectedTemplate: TemplateConfig | null;
	isLoading: boolean;
	error: string | null;
	filters: TemplateState["filters"];
	previewMode: boolean;
	editingTemplateId: string | null;

	// Persistence state
	syncStatus: SyncStatus;
	isSaving: boolean;
	lastSyncedAt: string | null;
	unsavedChanges: Map<string, TemplateChangeTracker>;

	// Pagination
	pagination: TemplateState["pagination"];

	// Dispatch
	dispatch: React.Dispatch<TemplateAction>;

	// Computed/Helper methods
	getFilteredTemplates: () => TemplateConfig[];
	getPublishedTemplates: () => TemplateConfig[];
	getFreeTemplates: () => TemplateConfig[];
	getPaidTemplates: () => TemplateConfig[];
	getPaginatedTemplates: () => TemplateConfig[];
	getTemplateById: (id: string) => TemplateConfig | undefined;
	getTemplatesByCategory: (category: string) => TemplateConfig[];

	// Admin helpers
	canUserAccessTemplate: (
		templateId: string,
		userHasPaid?: boolean
	) => boolean;
	isTemplatePublished: (templateId: string) => boolean;

	// Persistence helpers
	hasUnsavedChanges: (templateId: string) => boolean;
	hasAnyUnsavedChanges: () => boolean;
	getUnsavedTemplateIds: () => string[];

	// API actions
	saveTemplate: (data: CreateTemplateInput) => Promise<TemplateConfig | null>;
	fetchTemplates: (params?: {
		page?: number;
		pageSize?: number;
		category?: string;
		isPaid?: boolean;
		isPublished?: boolean;
		search?: string;
	}) => Promise<void>;
	fetchTemplateById: (id: string) => Promise<TemplateConfig | null>;
	updateTemplateById: (
		id: string,
		data: Partial<CreateTemplateInput>
	) => Promise<TemplateConfig | null>;
	deleteTemplateById: (id: string) => Promise<boolean>;
}

const TemplateContext = createContext<TemplateContextType | undefined>(
	undefined
);

// Provider component
interface TemplateProviderProps {
	children: ReactNode;
	initialTemplates?: TemplateConfig[];
	initialTemplateId?: string | null;
}

export function TemplateProvider({
	children,
	initialTemplates = [],
	initialTemplateId = null,
}: TemplateProviderProps) {
	const [state, dispatch] = useReducer(templateReducer, {
		...emptyTemplateState,
		templates: initialTemplates,
		currentTemplateId: initialTemplateId,
		selectedTemplate:
			initialTemplates.find((t) => t.id === initialTemplateId) || null,
	});

	// Helper: Get filtered templates based on current filters
	const getFilteredTemplates = React.useCallback(() => {
		let filtered = [...state.templates];

		// Filter by category
		if (state.filters.category) {
			filtered = filtered.filter((t) =>
				t.categories.includes(state.filters.category!)
			);
		}

		// Filter by price range
		if (state.filters.priceRange) {
			filtered = filtered.filter((t) => {
				if (!t.pricing.isPaid) return false;
				const price = t.pricing.price || 0;
				return (
					price >= state.filters.priceRange!.min &&
					price <= state.filters.priceRange!.max
				);
			});
		}

		// Filter by paid/free
		if (state.filters.isPaid !== null) {
			filtered = filtered.filter(
				(t) => t.pricing.isPaid === state.filters.isPaid
			);
		}

		// Filter by published status
		if (state.filters.isPublished !== null) {
			filtered = filtered.filter(
				(t) => t.metadata.isPublished === state.filters.isPublished
			);
		}

		// Filter by search query
		if (state.filters.searchQuery) {
			const query = state.filters.searchQuery.toLowerCase();
			filtered = filtered.filter(
				(t) =>
					t.name.toLowerCase().includes(query) ||
					t.description.toLowerCase().includes(query) ||
					t.categories.some((cat) =>
						cat.toLowerCase().includes(query)
					) ||
					t.metadata.tags.some((tag) =>
						tag.toLowerCase().includes(query)
					)
			);
		}

		return filtered;
	}, [state.templates, state.filters]);

	// Helper: Get only published templates
	const getPublishedTemplates = React.useCallback(() => {
		return state.templates.filter(
			(t) => t.metadata.isPublished && t.metadata.isActive
		);
	}, [state.templates]);

	// Helper: Get free templates
	const getFreeTemplates = React.useCallback(() => {
		return state.templates.filter((t) => !t.pricing.isPaid);
	}, [state.templates]);

	// Helper: Get paid templates
	const getPaidTemplates = React.useCallback(() => {
		return state.templates.filter((t) => t.pricing.isPaid);
	}, [state.templates]);

	// Helper: Get template by ID
	const getTemplateById = React.useCallback(
		(id: string) => {
			return state.templates.find((t) => t.id === id);
		},
		[state.templates]
	);

	// Helper: Get templates by category
	const getTemplatesByCategory = React.useCallback(
		(category: string) => {
			return state.templates.filter((t) =>
				t.categories.includes(category)
			);
		},
		[state.templates]
	);

	// Helper: Check if user can access template
	const canUserAccessTemplate = React.useCallback(
		(templateId: string, userHasPaid: boolean = false) => {
			const template = getTemplateById(templateId);
			if (!template) return false;

			// Template must be published
			if (!template.metadata.isPublished || !template.metadata.isActive) {
				return false;
			}

			// Free templates are always accessible
			if (!template.pricing.isPaid) {
				return true;
			}

			// Paid templates require payment
			return userHasPaid;
		},
		[getTemplateById]
	);

	// Helper: Check if template is published
	const isTemplatePublished = React.useCallback(
		(templateId: string): boolean => {
			const template = getTemplateById(templateId);
			return Boolean(
				template?.metadata.isPublished && template?.metadata.isActive
			);
		},
		[getTemplateById]
	);

	// Helper: Get paginated templates
	const getPaginatedTemplates = React.useCallback(() => {
		const filtered = getFilteredTemplates();
		const { currentPage, pageSize } = state.pagination;
		const startIndex = (currentPage - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		return filtered.slice(startIndex, endIndex);
	}, [getFilteredTemplates, state.pagination]);

	// Helper: Check if specific template has unsaved changes
	const hasUnsavedChanges = React.useCallback(
		(templateId: string): boolean => {
			const tracker = state.unsavedChanges.get(templateId);
			return tracker?.hasUnsavedChanges ?? false;
		},
		[state.unsavedChanges]
	);

	// Helper: Check if any template has unsaved changes
	const hasAnyUnsavedChanges = React.useCallback(() => {
		for (const tracker of state.unsavedChanges.values()) {
			if (tracker.hasUnsavedChanges) return true;
		}
		return false;
	}, [state.unsavedChanges]);

	// Helper: Get all template IDs with unsaved changes
	const getUnsavedTemplateIds = React.useCallback(() => {
		const ids: string[] = [];
		for (const [templateId, tracker] of state.unsavedChanges.entries()) {
			if (tracker.hasUnsavedChanges) {
				ids.push(templateId);
			}
		}
		return ids;
	}, [state.unsavedChanges]);

	// API Action: Save template to database
	const saveTemplate = React.useCallback(
		async (data: CreateTemplateInput): Promise<TemplateConfig | null> => {
			try {
				// Start saving
				dispatch({ type: "START_SAVING" });
				dispatch({ type: "SET_ERROR", payload: null });

				// Call API to create template
				const response = await apiClient.post<TemplateConfig>(
					API_URLS.TEMPLATE,
					data
				);

				if (response.success && response.data) {
					// Add template to state
					dispatch({ type: "ADD_TEMPLATE", payload: response.data });

					// Mark as saved
					dispatch({
						type: "FINISH_SAVING",
						payload: { templateId: response.data.id, success: true },
					});
					dispatch({ type: "SET_LAST_SYNCED" });

					return response.data;
				}

				throw new Error("Failed to save template");
			} catch (error) {
				// Handle error
				const errorMessage =
					error instanceof ApiError
						? error.message
						: "Failed to save template";

				dispatch({ type: "SET_ERROR", payload: errorMessage });
				dispatch({
					type: "FINISH_SAVING",
					payload: { templateId: "", success: false },
				});

				return null;
			}
		},
		[]
	);

	// API Action: Fetch all templates
	const fetchTemplates = React.useCallback(
		async (params?: {
			page?: number;
			pageSize?: number;
			category?: string;
			isPaid?: boolean;
			isPublished?: boolean;
			search?: string;
		}): Promise<void> => {
			try {
				dispatch({ type: "SET_LOADING", payload: true });
				dispatch({ type: "SET_ERROR", payload: null });

				const response = await apiClient.getAll<TemplateConfig>(
					API_URLS.TEMPLATE,
					params
				);

				if (response.success && response.data) {
					const totalCount = response.meta?.totalItems || 0;
					dispatch({
						type: "SET_TEMPLATES_WITH_COUNT",
						payload: { templates: response.data, totalCount },
					});
				}
			} catch (error) {
				const errorMessage =
					error instanceof ApiError
						? error.message
						: "Failed to fetch templates";
				dispatch({ type: "SET_ERROR", payload: errorMessage });
			} finally {
				dispatch({ type: "SET_LOADING", payload: false });
			}
		},
		[]
	);

	// API Action: Fetch template by ID
	const fetchTemplateById = React.useCallback(
		async (id: string): Promise<TemplateConfig | null> => {
			try {
				dispatch({ type: "SET_LOADING", payload: true });
				dispatch({ type: "SET_ERROR", payload: null });

				const response = await apiClient.get<TemplateConfig>(
					`${API_URLS.TEMPLATE}/${id}`
				);

				if (response.success && response.data) {
					dispatch({
						type: "SET_SELECTED_TEMPLATE",
						payload: response.data,
					});
					return response.data;
				}

				return null;
			} catch (error) {
				const errorMessage =
					error instanceof ApiError
						? error.message
						: "Failed to fetch template";
				dispatch({ type: "SET_ERROR", payload: errorMessage });
				return null;
			} finally {
				dispatch({ type: "SET_LOADING", payload: false });
			}
		},
		[]
	);

	// API Action: Update template
	const updateTemplateById = React.useCallback(
		async (
			id: string,
			data: Partial<CreateTemplateInput>
		): Promise<TemplateConfig | null> => {
			try {
				dispatch({ type: "START_SAVING" });
				dispatch({ type: "SET_ERROR", payload: null });

				const response = await apiClient.put<TemplateConfig>(
					`${API_URLS.TEMPLATE}/${id}`,
					data
				);

				if (response.success && response.data) {
					// Update template in state
					dispatch({
						type: "UPDATE_TEMPLATE",
						payload: { id, data: response.data },
					});

					// Mark as saved
					dispatch({
						type: "FINISH_SAVING",
						payload: { templateId: id, success: true },
					});
					dispatch({ type: "SET_LAST_SYNCED" });

					return response.data;
				}

				throw new Error("Failed to update template");
			} catch (error) {
				const errorMessage =
					error instanceof ApiError
						? error.message
						: "Failed to update template";
				dispatch({ type: "SET_ERROR", payload: errorMessage });
				dispatch({
					type: "FINISH_SAVING",
					payload: { templateId: id, success: false },
				});
				return null;
			}
		},
		[]
	);

	// API Action: Delete template
	const deleteTemplateById = React.useCallback(
		async (id: string): Promise<boolean> => {
			try {
				dispatch({ type: "SET_LOADING", payload: true });
				dispatch({ type: "SET_ERROR", payload: null });

				const response = await apiClient.delete<{ message: string }>(
					`${API_URLS.TEMPLATE}/${id}`
				);

				if (response.success) {
					// Remove template from state
					dispatch({ type: "DELETE_TEMPLATE", payload: id });
					return true;
				}

				return false;
			} catch (error) {
				const errorMessage =
					error instanceof ApiError
						? error.message
						: "Failed to delete template";
				dispatch({ type: "SET_ERROR", payload: errorMessage });
				return false;
			} finally {
				dispatch({ type: "SET_LOADING", payload: false });
			}
		},
		[]
	);

	const value: TemplateContextType = {
		// State
		templates: state.templates,
		currentTemplateId: state.currentTemplateId,
		selectedTemplate: state.selectedTemplate,
		isLoading: state.isLoading,
		error: state.error,
		filters: state.filters,
		previewMode: state.previewMode,
		editingTemplateId: state.editingTemplateId,

		// Persistence state
		syncStatus: state.syncStatus,
		isSaving: state.isSaving,
		lastSyncedAt: state.lastSyncedAt,
		unsavedChanges: state.unsavedChanges,

		// Pagination
		pagination: state.pagination,

		// Dispatch
		dispatch,

		// Helper methods
		getFilteredTemplates,
		getPublishedTemplates,
		getFreeTemplates,
		getPaidTemplates,
		getPaginatedTemplates,
		getTemplateById,
		getTemplatesByCategory,
		canUserAccessTemplate,
		isTemplatePublished,

		// Persistence helpers
		hasUnsavedChanges,
		hasAnyUnsavedChanges,
		getUnsavedTemplateIds,

		// API actions
		saveTemplate,
		fetchTemplates,
		fetchTemplateById,
		updateTemplateById,
		deleteTemplateById,
	};

	return (
		<TemplateContext.Provider value={value}>
			{children}
		</TemplateContext.Provider>
	);
}

// Hook to use the template context
export function useTemplate() {
	const context = useContext(TemplateContext);
	if (context === undefined) {
		throw new Error("useTemplate must be used within a TemplateProvider");
	}
	return context;
}

// Export action creators for better DX
export const templateActions = {
	// Template CRUD
	setTemplates: (templates: TemplateConfig[]) =>
		({ type: "SET_TEMPLATES", payload: templates } as const),

	setTemplatesWithCount: (templates: TemplateConfig[], totalCount: number) =>
		({
			type: "SET_TEMPLATES_WITH_COUNT",
			payload: { templates, totalCount },
		} as const),

	addTemplate: (template: TemplateConfig) =>
		({ type: "ADD_TEMPLATE", payload: template } as const),

	updateTemplate: (id: string, data: Partial<TemplateConfig>) =>
		({ type: "UPDATE_TEMPLATE", payload: { id, data } } as const),

	deleteTemplate: (id: string) =>
		({ type: "DELETE_TEMPLATE", payload: id } as const),

	// Selection
	selectTemplate: (id: string) =>
		({ type: "SELECT_TEMPLATE", payload: id } as const),

	clearSelection: () => ({ type: "CLEAR_SELECTION" } as const),

	setSelectedTemplate: (template: TemplateConfig | null) =>
		({ type: "SET_SELECTED_TEMPLATE", payload: template } as const),

	// Publishing
	publishTemplate: (id: string) =>
		({ type: "PUBLISH_TEMPLATE", payload: id } as const),

	unpublishTemplate: (id: string) =>
		({ type: "UNPUBLISH_TEMPLATE", payload: id } as const),

	// Pricing
	updatePricing: (id: string, pricing: TemplateConfig["pricing"]) =>
		({
			type: "UPDATE_TEMPLATE_PRICING",
			payload: { id, pricing },
		} as const),

	// Persistence & Sync
	markTemplateChanged: (templateId: string) =>
		({ type: "MARK_TEMPLATE_CHANGED", payload: templateId } as const),

	markTemplateSaved: (templateId: string) =>
		({ type: "MARK_TEMPLATE_SAVED", payload: templateId } as const),

	setSyncStatus: (status: SyncStatus) =>
		({ type: "SET_SYNC_STATUS", payload: status } as const),

	startSaving: () => ({ type: "START_SAVING" } as const),

	finishSaving: (templateId: string, success: boolean) =>
		({ type: "FINISH_SAVING", payload: { templateId, success } } as const),

	setLastSynced: () => ({ type: "SET_LAST_SYNCED" } as const),

	syncFromServer: (templates: TemplateConfig[]) =>
		({ type: "SYNC_FROM_SERVER", payload: templates } as const),

	// Filters
	setCategoryFilter: (category: string | null) =>
		({ type: "SET_CATEGORY_FILTER", payload: category } as const),

	setPriceFilter: (range: { min: number; max: number } | null) =>
		({ type: "SET_PRICE_FILTER", payload: range } as const),

	setPaidFilter: (isPaid: boolean | null) =>
		({ type: "SET_PAID_FILTER", payload: isPaid } as const),

	setPublishedFilter: (isPublished: boolean | null) =>
		({ type: "SET_PUBLISHED_FILTER", payload: isPublished } as const),

	setSearchQuery: (query: string) =>
		({ type: "SET_SEARCH_QUERY", payload: query } as const),

	clearFilters: () => ({ type: "CLEAR_FILTERS" } as const),

	// Pagination
	setPage: (page: number) => ({ type: "SET_PAGE", payload: page } as const),

	setPageSize: (pageSize: number) =>
		({ type: "SET_PAGE_SIZE", payload: pageSize } as const),

	setTotalCount: (count: number) =>
		({ type: "SET_TOTAL_COUNT", payload: count } as const),

	// Preview/Edit
	togglePreviewMode: () => ({ type: "TOGGLE_PREVIEW_MODE" } as const),

	setPreviewMode: (enabled: boolean) =>
		({ type: "SET_PREVIEW_MODE", payload: enabled } as const),

	startEditing: (id: string) =>
		({ type: "START_EDITING", payload: id } as const),

	stopEditing: () => ({ type: "STOP_EDITING" } as const),

	// Loading/Error
	setLoading: (isLoading: boolean) =>
		({ type: "SET_LOADING", payload: isLoading } as const),

	setError: (error: string | null) =>
		({ type: "SET_ERROR", payload: error } as const),

	// Reset
	resetState: () => ({ type: "RESET_STATE" } as const),
};
