import React from "react";
import { ResumeData } from "@/interfaces/resume";
import { TemplateConfig } from "../../interfaces/templates";
import { TemplateWrapper } from "./common/template-wrapper";
import classicConfig from "./template-provider/classic/config/classi.config";
import ClassicMainTemplate from "./template-provider/classic/components/classic-main.template";
import ClassicSkeletonTemplate from "./template-provider/classic/components/classic-skeleton.template";

// Template Factory Interface
interface TemplateFactoryInterface {
	renderComponent(
		templateId: string,
		data: ResumeData,
		options?: {
			className?: string;
			style?: React.CSSProperties;
			config?: TemplateConfig;
			onConfigChange?: (config: Partial<TemplateConfig>) => void;
		}
	): React.ReactElement | null;
	renderSkeleton(
		templateId: string,
		className?: string,
		options?: {
			className?: string;
			style?: React.CSSProperties;
			config?: TemplateConfig;
			onConfigChange?: (config: Partial<TemplateConfig>) => void;
		}
	): React.ReactElement | null;
	templatePrice(templateId: string, currency?: string): string;
	getTemplate(templateId: string): TemplateConfig | undefined;
	getAllTemplates(): TemplateConfig[];
	getTemplatesByCategory(category: string): TemplateConfig[];
	getFreeTemplates(): TemplateConfig[];
	getPaidTemplates(): TemplateConfig[];
	searchTemplates(query: string): TemplateConfig[];
}

// Template Factory for creating and managing templates
export class TemplateFactory implements TemplateFactoryInterface {
	private static instance: TemplateFactory;
	private templates: Map<string, TemplateConfig> = new Map();
	private initialized = false;

	private constructor() {}

	static getInstance(): TemplateFactory {
		if (!TemplateFactory.instance) {
			TemplateFactory.instance = new TemplateFactory();
		}
		return TemplateFactory.instance;
	}

	// Initialize all templates
	initializeTemplates(): void {
		if (this.initialized) return;

		// Register all templates
		this.registerTemplate(classicConfig);

		// Add more templates here as you create them
		// this.registerTemplate(modernConfig);
		// this.registerTemplate(creativeConfig);

		this.initialized = true;
	}

	// Register a template
	private registerTemplate(template: TemplateConfig): void {
		this.templates.set(template.id, template);
	}

	// Render template component with data
	renderComponent(
		templateId: string,
		data: ResumeData,
		options?: {
			className?: string;
			style?: React.CSSProperties;
			config?: TemplateConfig;
			onConfigChange?: (config: Partial<TemplateConfig>) => void;
		}
	): React.ReactElement | null {
		const template = this.getTemplate(templateId);
		if (!template) {
			console.error(`Template with ID ${templateId} not found`);
			return null;
		}

		// Use provided config or fall back to template config
		const config = options?.config || template;

		try {
			// Render template based on template ID
			switch (templateId) {
				case "classic-template":
					return (
						<TemplateWrapper
							className={options?.className}
							style={options?.style}
							config={config}
							onConfigChange={options?.onConfigChange}
						>
							<ClassicMainTemplate data={data} config={config} />
						</TemplateWrapper>
					);
				default:
					console.error(
						`No render component found for template ID: ${templateId}`
					);
					return null;
			}
		} catch (error) {
			console.error(`Error rendering template ${templateId}:`, error);
			return null;
		}
	}

	// Render template skeleton for preview
	renderSkeleton(
		templateId: string,
		className?: string,
		options?: {
			className?: string;
			style?: React.CSSProperties;
			config?: TemplateConfig;
			onConfigChange?: (config: Partial<TemplateConfig>) => void;
		}
	): React.ReactElement | null {
		const template = this.getTemplate(templateId);
		if (!template) {
			console.error(`Template with ID ${templateId} not found`);
			return null;
		}

		// Use provided config or fall back to template config
		const config = options?.config || template;

		try {
			// Render skeleton based on template ID
			switch (templateId) {
				case "classic-template":
					return (
						<TemplateWrapper
							className={options?.className || className}
							style={options?.style}
							config={config}
							onConfigChange={options?.onConfigChange}
						>
							<ClassicSkeletonTemplate
								config={config}
								className={className}
							/>
						</TemplateWrapper>
					);
				default:
					console.error(
						`No skeleton component found for template ID: ${templateId}`
					);
					return null;
			}
		} catch (error) {
			console.error(
				`Error rendering skeleton for template ${templateId}:`,
				error
			);
			return null;
		}
	}

	// Get template price (free or currency with amount)
	templatePrice(templateId: string, currency: string = "USD"): string {
		const template = this.getTemplate(templateId);
		if (!template) {
			return "Template not found";
		}

		if (!template.pricing.isPaid) {
			return "Free";
		}

		const price =
			template.pricing.prices[
				currency as keyof typeof template.pricing.prices
			];
		if (price) {
			return `${price} ${currency}`;
		}

		// Fallback to first available currency
		const availableCurrencies = Object.keys(template.pricing.prices);
		if (availableCurrencies.length > 0) {
			const firstCurrency =
				availableCurrencies[0] as keyof typeof template.pricing.prices;
			const firstPrice = template.pricing.prices[firstCurrency];
			return `${firstPrice} ${firstCurrency}`;
		}

		return "Price not available";
	}

	// Get template by ID
	getTemplate(templateId: string): TemplateConfig | undefined {
		return this.templates.get(templateId);
	}

	// Get all templates
	getAllTemplates(): TemplateConfig[] {
		return Array.from(this.templates.values());
	}

	// Get templates by category
	getTemplatesByCategory(category: string): TemplateConfig[] {
		return this.getAllTemplates().filter(
			(template) =>
				template.category.toLowerCase() === category.toLowerCase()
		);
	}

	// Get free templates only
	getFreeTemplates(): TemplateConfig[] {
		return this.getAllTemplates().filter(
			(template) => !template.pricing.isPaid
		);
	}

	// Get paid templates only
	getPaidTemplates(): TemplateConfig[] {
		return this.getAllTemplates().filter(
			(template) => template.pricing.isPaid
		);
	}

	// Search templates
	searchTemplates(query: string): TemplateConfig[] {
		const lowercaseQuery = query.toLowerCase();
		return this.getAllTemplates().filter(
			(template) =>
				template.name.toLowerCase().includes(lowercaseQuery) ||
				template.description.toLowerCase().includes(lowercaseQuery) ||
				template.tags.some((tag) =>
					tag.toLowerCase().includes(lowercaseQuery)
				)
		);
	}

	// Validate template configuration
	validateTemplate(config: TemplateConfig): boolean {
		const requiredFields = [
			"id",
			"name",
			"description",
			"category",
			"pricing",
			"layout",
			"sections",
			"style",
		];

		return requiredFields.every(
			(field) =>
				config.hasOwnProperty(field) &&
				config[field as keyof TemplateConfig] !== undefined
		);
	}

	// Create template instance (for dynamic template creation)
	createTemplate(config: TemplateConfig): TemplateConfig {
		if (!this.validateTemplate(config)) {
			throw new Error("Invalid template configuration");
		}
		return { ...config };
	}
}

// Export singleton instance
export const templateFactory = TemplateFactory.getInstance();

// Initialize templates when module loads
templateFactory.initializeTemplates();
