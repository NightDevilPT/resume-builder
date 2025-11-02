"use client";

import {
	RectangleVertical,
	Columns2,
	PanelLeft,
	PanelRight,
	Columns3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TemplateConfig } from "@/interfaces/templates";

interface LayoutConfigStepProps {
	config: Partial<TemplateConfig>;
	updateConfig: (section: string, data: any) => void;
}

export function LayoutConfigStep({
	config,
	updateConfig,
}: LayoutConfigStepProps) {
	const layoutTypes = [
		{
			value: "single-column",
			label: "Single Column",
			icon: RectangleVertical,
		},
		{
			value: "two-column-equal",
			label: "Two Column (Equal)",
			icon: Columns2,
		},
		{
			value: "two-column-left-heavy",
			label: "Two Column (Left Heavy)",
			icon: PanelLeft,
		},
		{
			value: "two-column-right-heavy",
			label: "Two Column (Right Heavy)",
			icon: PanelRight,
		},
		{ value: "three-column", label: "Three Column", icon: Columns3 },
	];

	const handleLayoutTypeChange = (type: string) => {
		const newLayout = { ...config.layout, type };

		// Set default ratios based on type
		if (type === "two-column-equal") {
			newLayout.columnRatio = { left: 50, right: 50 };
		} else if (type === "two-column-left-heavy") {
			newLayout.columnRatio = { left: 60, right: 40 };
		} else if (type === "two-column-right-heavy") {
			newLayout.columnRatio = { left: 40, right: 60 };
		} else if (type === "three-column") {
			newLayout.threeColumnRatio = [25, 50, 25];
		}

		// Auto-adjust section positions based on layout type
		if (newLayout.sections) {
			newLayout.sections = newLayout.sections.map((section) => {
				// Single column: only full-width allowed
				if (type === "single-column") {
					return { ...section, position: "full-width" };
				}

				// Two column: convert center to left/right, keep full-width
				if (type.startsWith("two-column")) {
					if (section.position === "center") {
						return { ...section, position: "left" };
					}
					if (
						section.position !== "left" &&
						section.position !== "right" &&
						section.position !== "full-width"
					) {
						return { ...section, position: "left" };
					}
				}

				// Three column: keep all positions valid
				if (type === "three-column") {
					// All positions are valid
					return section;
				}

				return section;
			});
		}

		updateConfig("layout", newLayout);
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold mb-4">
					Layout Configuration
				</h3>
				<p className="text-sm text-muted-foreground mb-6">
					Choose the column layout for your template
				</p>
			</div>

			{/* Layout Type */}
			<div className="space-y-3">
				<Label>Layout Type *</Label>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
					{layoutTypes.map((layout) => {
						const IconComponent = layout.icon;
						const isSelected =
							(config.layout?.type || "two-column-left-heavy") ===
							layout.value;

						return (
							<Card
								key={layout.value}
								className={`p-4 cursor-pointer transition-all hover:shadow-md ${
									isSelected
										? "border-primary bg-primary/5 shadow-sm"
										: "border-border hover:border-primary/50"
								}`}
								onClick={() =>
									handleLayoutTypeChange(layout.value)
								}
							>
								<div className="flex flex-col items-center gap-2 text-center">
									<IconComponent
										className={`h-8 w-8 ${
											isSelected
												? "text-primary"
												: "text-muted-foreground"
										}`}
									/>
									<span
										className={`text-sm font-medium ${
											isSelected ? "text-primary" : ""
										}`}
									>
										{layout.label}
									</span>
								</div>
							</Card>
						);
					})}
				</div>
			</div>

			{/* Column Ratio (for two-column layouts) */}
			{config.layout?.type?.startsWith("two-column") && (
				<Card className="p-4 bg-muted/30">
					<Label className="mb-3 block">Column Ratio</Label>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="left-ratio" className="text-sm">
								Left Column %
							</Label>
							<Input
								id="left-ratio"
								type="number"
								min="20"
								max="80"
								value={config.layout?.columnRatio?.left || 60}
								onChange={(e) => {
									const left = parseInt(e.target.value);
									const right = 100 - left;
									updateConfig("layout", {
										...config.layout,
										columnRatio: { left, right },
									});
								}}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="right-ratio" className="text-sm">
								Right Column %
							</Label>
							<Input
								id="right-ratio"
								type="number"
								min="20"
								max="80"
								value={config.layout?.columnRatio?.right || 40}
								onChange={(e) => {
									const right = parseInt(e.target.value);
									const left = 100 - right;
									updateConfig("layout", {
										...config.layout,
										columnRatio: { left, right },
									});
								}}
							/>
						</div>
					</div>
					<p className="text-xs text-muted-foreground mt-2">
						Total must equal 100%
					</p>
				</Card>
			)}

			{/* Gap Between Columns */}
			<div className="space-y-2">
				<Label htmlFor="gap">Gap Between Columns</Label>
				<Input
					id="gap"
					placeholder="e.g., 2rem, 32px"
					value={config.layout?.gap || "2rem"}
					onChange={(e) =>
						updateConfig("layout", {
							...config.layout,
							gap: e.target.value,
						})
					}
				/>
				<p className="text-xs text-muted-foreground">
					Use CSS units (rem, px, em)
				</p>
			</div>
		</div>
	);
}
