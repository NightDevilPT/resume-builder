"use client";

import {
	DollarSign,
	Crown,
	Sparkles,
	Check,
	Gift,
	Star,
	Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TemplateConfig } from "@/interfaces/templates";
import { formatPrice, parsePriceToCents } from "@/lib/utils/template-helpers";

interface PricingStepProps {
	config: Partial<TemplateConfig>;
	updateConfig: (section: string, data: any) => void;
}

interface PricingPreset {
	label: string;
	price: number; // in cents
	tier: string;
	description: string;
	recommended?: boolean;
}

export function PricingStep({ config, updateConfig }: PricingStepProps) {
	const tiers = [
		{
			value: "free",
			label: "Free",
			icon: Gift,
			description: "Available to all users",
			color: "text-green-600",
		},
		{
			value: "basic",
			label: "Basic",
			icon: Star,
			description: "Entry-level paid tier",
			color: "text-blue-600",
		},
		{
			value: "premium",
			label: "Premium",
			icon: Crown,
			description: "High-quality templates",
			color: "text-purple-600",
		},
		{
			value: "custom",
			label: "Custom",
			icon: Zap,
			description: "Custom pricing setup",
			color: "text-orange-600",
		},
	];

	const presetPricing: PricingPreset[] = [
		{
			label: "Free",
			price: 0,
			tier: "free",
			description: "Maximize reach and usage",
		},
		{
			label: "Starter",
			price: 299, // $2.99
			tier: "basic",
			description: "Entry-level pricing",
		},
		{
			label: "Popular",
			price: 499, // $4.99
			tier: "basic",
			description: "Best value for users",
			recommended: true,
		},
		{
			label: "Professional",
			price: 999, // $9.99
			tier: "premium",
			description: "Premium quality",
			recommended: true,
		},
		{
			label: "Premium Plus",
			price: 1499, // $14.99
			tier: "premium",
			description: "High-end design",
		},
	];

	const updatePricing = (field: string, value: any) => {
		updateConfig("pricing", {
			...config.pricing,
			[field]: value,
		});
	};

	const handlePriceChange = (priceInDollars: string) => {
		const priceInCents = parsePriceToCents(priceInDollars);
		updatePricing("price", priceInCents);
	};

	const applyPreset = (preset: PricingPreset) => {
		updateConfig("pricing", {
			...config.pricing,
			isPaid: preset.price > 0,
			price: preset.price,
			tier: preset.tier,
		});
	};

	const isPresetActive = (preset: PricingPreset) => {
		return (
			config.pricing?.price === preset.price &&
			config.pricing?.tier === preset.tier &&
			config.pricing?.isPaid === preset.price > 0
		);
	};

	const priceInDollars = config.pricing?.price
		? formatPrice(config.pricing.price).replace("$", "")
		: "0.00";

	const currentTier = tiers.find((t) => t.value === config.pricing?.tier);

	// Check if current pricing matches any preset or is custom tier
	const isCustomPricing = () => {
		// If tier is explicitly set to "custom", it's custom
		if (config.pricing?.tier === "custom") return true;
		
		if (!config.pricing?.isPaid) return false; // Free is not custom

		const matchingPreset = presetPricing.find(
			(preset) =>
				preset.price === config.pricing?.price &&
				preset.tier === config.pricing?.tier
		);

		return !matchingPreset; // Custom if no matching preset found
	};

	const displayTier = isCustomPricing() ? "custom" : config.pricing?.tier;
	
	// Check if price input should be enabled (only for custom tier)
	const isPriceEditable = config.pricing?.tier === "custom";

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
					<DollarSign className="h-5 w-5" />
					Pricing Configuration
				</h3>
				<p className="text-sm text-muted-foreground mb-6">
					Choose a pricing tier or set custom pricing for your
					template
				</p>
			</div>

			{/* Current Configuration - Always Visible at Top */}
			<div className="bg-background/95 backdrop-blur-md border rounded-lg p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Sparkles className="h-4 w-4 text-primary" />
						<span className="font-semibold text-sm">
							Current Configuration:
						</span>
					</div>
					<div className="flex items-center gap-2 flex-wrap justify-end">
						{/* Status Badge */}
						{config.pricing?.isPaid ? (
							<Badge className="gap-1.5 px-3 py-1">
								<DollarSign className="h-3.5 w-3.5" />
								Paid
							</Badge>
						) : (
							<Badge
								variant="secondary"
								className="gap-1.5 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
							>
								<Gift className="h-3.5 w-3.5" />
								Free
							</Badge>
						)}

						{/* Price Badge */}
						<Badge
							variant="outline"
							className={`gap-1.5 px-3 py-1 font-bold ${
								config.pricing?.isPaid
									? "border-primary text-primary"
									: "border-green-600 text-green-600"
							}`}
						>
							{config.pricing?.isPaid
								? `$${priceInDollars}`
								: "$0.00"}
						</Badge>

						{/* Tier Badge */}
						{isCustomPricing() ? (
							<Badge
								variant="secondary"
								className="gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
							>
								<Zap className="h-3.5 w-3.5" />
								Custom
							</Badge>
						) : currentTier ? (
							<Badge
								variant="secondary"
								className={`gap-1.5 px-3 py-1 ${
									currentTier.value === "free"
										? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
										: currentTier.value === "basic"
										? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
										: currentTier.value === "premium"
										? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
										: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
								}`}
							>
								<currentTier.icon className="h-3.5 w-3.5" />
								{currentTier.label}
							</Badge>
						) : (
							<Badge
								variant="outline"
								className="gap-1.5 px-3 py-1"
							>
								Not set
							</Badge>
						)}
					</div>
				</div>
			</div>

			{/* Preset Pricing Options */}
			<Card className="p-5">
				<div className="flex items-center gap-2 mb-4">
					<Sparkles className="h-4 w-4 text-primary" />
					<h4 className="font-semibold">Preset Pricing</h4>
					<Badge variant="secondary" className="ml-auto text-xs">
						Quick Select
					</Badge>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
					{presetPricing.map((preset) => {
						const isActive = isPresetActive(preset);
						const tierInfo = tiers.find(
							(t) => t.value === preset.tier
						);
						const TierIcon = tierInfo?.icon || Gift;

						return (
							<Card
								key={preset.label}
								className={`p-4 cursor-pointer transition-all hover:shadow-md relative ${
									isActive
										? "border-primary bg-primary/5 shadow-sm"
										: "border-border hover:border-primary/30"
								}`}
								onClick={() => applyPreset(preset)}
							>
								{preset.recommended && (
									<Badge
										variant="default"
										className="absolute -top-2 -right-2 gap-1"
									>
										<Zap className="h-3 w-3" />
										Popular
									</Badge>
								)}
								<div className="space-y-3">
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-2">
											<TierIcon
												className={`h-5 w-5 ${
													tierInfo?.color || ""
												}`}
											/>
											<div>
												<p
													className={`font-semibold ${
														isActive
															? "text-primary"
															: ""
													}`}
												>
													{preset.label}
												</p>
												<p className="text-xs text-muted-foreground">
													{preset.description}
												</p>
											</div>
										</div>
										{isActive && (
											<Check className="h-4 w-4 text-primary flex-shrink-0" />
										)}
									</div>

									<div className="flex items-baseline justify-between pt-2 border-t">
										<span
											className={`text-2xl font-bold ${
												preset.price === 0
													? "text-green-600"
													: "text-primary"
											}`}
										>
											{preset.price === 0
												? "Free"
												: formatPrice(preset.price)}
										</span>
										<Badge
											variant="outline"
											className="text-xs"
										>
											{preset.tier}
										</Badge>
									</div>
								</div>
							</Card>
						);
					})}
					
					{/* Custom Pricing Option */}
					<Card
						className={`p-4 cursor-pointer transition-all hover:shadow-md relative ${
							config.pricing?.tier === "custom"
								? "border-primary bg-primary/5 shadow-sm"
								: "border-border hover:border-primary/30 border-dashed"
						}`}
						onClick={() => {
							updateConfig("pricing", {
								...config.pricing,
								isPaid: true,
								tier: "custom",
								price: config.pricing?.price || 999, // Default to $9.99 if not set
							});
						}}
					>
						<div className="space-y-3">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2">
									<Zap className="h-5 w-5 text-orange-600" />
									<div>
										<p
											className={`font-semibold ${
												config.pricing?.tier === "custom"
													? "text-primary"
													: ""
											}`}
										>
											Custom Pricing
										</p>
										<p className="text-xs text-muted-foreground">
											Set your own price
										</p>
									</div>
								</div>
								{config.pricing?.tier === "custom" && (
									<Check className="h-4 w-4 text-primary flex-shrink-0" />
								)}
							</div>

							<div className="flex items-baseline justify-between pt-2 border-t">
								<span className="text-lg font-semibold text-orange-600">
									Your Price
								</span>
								<Badge variant="outline" className="text-xs">
									custom
								</Badge>
							</div>
						</div>
					</Card>
				</div>
			</Card>

			{/* Price Editor - Only for Custom Tier */}
			{config.pricing?.tier === "custom" && (
				<Card className="p-5 bg-muted/30">
					<div className="flex items-center gap-2 mb-4">
						<DollarSign className="h-4 w-4 text-primary" />
						<h4 className="font-semibold">Enter Custom Price</h4>
					</div>

					<div className="space-y-3">
						<Label htmlFor="price" className="font-semibold text-sm">
							Price (USD)
						</Label>
						<div className="relative">
							<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
							<Input
								id="price"
								step="0.01"
								min="0.01"
								value={priceInDollars}
								onChange={(e) => handlePriceChange(e.target.value)}
								className="pl-10 text-base font-bold"
								placeholder="9.99"
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							Stored as: {config.pricing?.price || 0} cents
						</p>
					</div>
				</Card>
			)}

			{/* Pricing Tips */}
			<Card className="p-5 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
				<div className="flex items-start gap-3">
					<Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
					<div>
						<h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
							Pricing Strategy Tips
						</h4>
						<ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
							<li className="flex items-start gap-2">
								<Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
								<span>
									<strong>Free templates</strong> get maximum
									visibility and user engagement
								</span>
							</li>
							<li className="flex items-start gap-2">
								<Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
								<span>
									<strong>$2.99-$4.99</strong> ideal for
									basic, clean designs
								</span>
							</li>
							<li className="flex items-start gap-2">
								<Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
								<span>
									<strong>$9.99-$14.99</strong> for premium,
									unique templates
								</span>
							</li>
							<li className="flex items-start gap-2">
								<Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
								<span>
									<strong>Custom tier</strong> for unique pricing
									strategies and special designs
								</span>
							</li>
						</ul>
					</div>
				</div>
			</Card>
		</div>
	);
}
