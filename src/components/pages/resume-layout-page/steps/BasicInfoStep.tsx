"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { TemplateConfig } from "@/interfaces/templates";

interface BasicInfoStepProps {
	config: Partial<TemplateConfig>;
	updateConfig: (section: string, data: any) => void;
}

export function BasicInfoStep({ config, updateConfig }: BasicInfoStepProps) {
	const [categoryInput, setCategoryInput] = useState("");

	const addCategory = () => {
		if (categoryInput.trim() && !config.categories?.includes(categoryInput.trim())) {
			updateConfig("categories", [...(config.categories || []), categoryInput.trim()]);
			setCategoryInput("");
		}
	};

	const removeCategory = (category: string) => {
		updateConfig(
			"categories",
			config.categories?.filter((c) => c !== category) || []
		);
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold mb-4">Basic Information</h3>
				<p className="text-sm text-muted-foreground mb-6">
					Set the basic details for your resume template
				</p>
			</div>

			{/* Template Name */}
			<div className="space-y-2">
				<Label htmlFor="name">Template Name *</Label>
				<Input
					id="name"
					placeholder="e.g., Modern Professional"
					value={config.name || ""}
					onChange={(e) => updateConfig("name", e.target.value)}
				/>
			</div>

			{/* Description */}
			<div className="space-y-2">
				<Label htmlFor="description">Description *</Label>
				<Textarea
					id="description"
					placeholder="Describe this template's style and best use cases..."
					rows={4}
					value={config.description || ""}
					onChange={(e) => updateConfig("description", e.target.value)}
				/>
			</div>

			{/* Thumbnail URL */}
			<div className="space-y-2">
				<Label htmlFor="thumbnail">Thumbnail URL</Label>
				<Input
					id="thumbnail"
					placeholder="/templates/my-template.png"
					value={config.thumbnail || ""}
					onChange={(e) => updateConfig("thumbnail", e.target.value)}
				/>
				<p className="text-xs text-muted-foreground">
					Provide a URL to the template preview image
				</p>
			</div>

			{/* Categories */}
			<div className="space-y-2">
				<Label htmlFor="category">Categories</Label>
				<div className="flex gap-2">
					<Input
						id="category"
						placeholder="Add a category (e.g., Modern, Classic)"
						value={categoryInput}
						onChange={(e) => setCategoryInput(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && addCategory()}
					/>
					<button
						type="button"
						onClick={addCategory}
						className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
					>
						Add
					</button>
				</div>
				
				{/* Category Badges */}
				{config.categories && config.categories.length > 0 && (
					<div className="flex flex-wrap gap-2 mt-3">
						{config.categories.map((category) => (
							<Badge key={category} variant="secondary" className="gap-1">
								{category}
								<button
									onClick={() => removeCategory(category)}
									className="ml-1 hover:text-destructive"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

