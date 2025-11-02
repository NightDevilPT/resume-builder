"use client";

import { 
	Palette, 
	Sparkles, 
	Check,
	RotateCcw
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TemplateConfig } from "@/interfaces/templates";

interface ColorSchemeStepProps {
	config: Partial<TemplateConfig>;
	updateConfig: (section: string, data: any) => void;
}

interface ColorPreset {
	name: string;
	category: string;
	colors: {
		primary: string;
		secondary: string;
		accent: string;
		text: string;
		textLight: string;
		background: string;
		border: string;
		link: string;
	};
}

export function ColorSchemeStep({ config, updateConfig }: ColorSchemeStepProps) {
	const colorFields = [
		{ key: "primary", label: "Primary Color", description: "Main brand color", icon: "🎨" },
		{ key: "secondary", label: "Secondary Color", description: "Secondary accent", icon: "🎯" },
		{ key: "accent", label: "Accent Color", description: "Tertiary accent", icon: "✨" },
		{ key: "text", label: "Text Color", description: "Main text color", icon: "📝" },
		{ key: "textLight", label: "Light Text", description: "Muted text color", icon: "💬" },
		{ key: "background", label: "Background", description: "Page background", icon: "📄" },
		{ key: "border", label: "Border Color", description: "Border and divider color", icon: "➖" },
		{ key: "link", label: "Link Color", description: "Hyperlink color", icon: "🔗" },
	];

	const presetPalettes: ColorPreset[] = [
		{
			name: "Professional Blue",
			category: "Classic",
			colors: {
				primary: "#2563eb",
				secondary: "#3b82f6",
				accent: "#60a5fa",
				text: "#1e293b",
				textLight: "#64748b",
				background: "#ffffff",
				border: "#e2e8f0",
				link: "#2563eb",
			},
		},
		{
			name: "Modern Slate",
			category: "Modern",
			colors: {
				primary: "#0f172a",
				secondary: "#334155",
				accent: "#64748b",
				text: "#0f172a",
				textLight: "#64748b",
				background: "#ffffff",
				border: "#cbd5e1",
				link: "#3b82f6",
			},
		},
		{
			name: "Creative Purple",
			category: "Creative",
			colors: {
				primary: "#7c3aed",
				secondary: "#8b5cf6",
				accent: "#a78bfa",
				text: "#1e1b4b",
				textLight: "#6366f1",
				background: "#ffffff",
				border: "#e0e7ff",
				link: "#7c3aed",
			},
		},
		{
			name: "Elegant Green",
			category: "Modern",
			colors: {
				primary: "#059669",
				secondary: "#10b981",
				accent: "#34d399",
				text: "#064e3b",
				textLight: "#6b7280",
				background: "#ffffff",
				border: "#d1fae5",
				link: "#059669",
			},
		},
		{
			name: "Bold Red",
			category: "Creative",
			colors: {
				primary: "#dc2626",
				secondary: "#ef4444",
				accent: "#f87171",
				text: "#1f2937",
				textLight: "#6b7280",
				background: "#ffffff",
				border: "#fecaca",
				link: "#dc2626",
			},
		},
		{
			name: "Minimalist",
			category: "Classic",
			colors: {
				primary: "#000000",
				secondary: "#374151",
				accent: "#6b7280",
				text: "#111827",
				textLight: "#9ca3af",
				background: "#ffffff",
				border: "#e5e7eb",
				link: "#000000",
			},
		},
	];

	const updateColor = (key: string, value: string) => {
		updateConfig("colors", {
			...config.colors,
			[key]: value,
		});
	};

	const applyPreset = (preset: ColorPreset) => {
		updateConfig("colors", preset.colors);
	};

	const isPresetActive = (preset: ColorPreset) => {
		if (!config.colors) return false;
		return Object.keys(preset.colors).every(
			(key) => config.colors?.[key as keyof typeof config.colors] === preset.colors[key as keyof typeof preset.colors]
		);
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
					<Palette className="h-5 w-5" />
					Color Scheme
				</h3>
				<p className="text-sm text-muted-foreground mb-6">
					Choose a preset palette or customize individual colors for your template
				</p>
			</div>

			{/* Two-Column Layout: Editor on Left, Preview on Right */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Left Column: Color Editor */}
				<div className="space-y-6">
					{/* Preset Palettes */}
					<Card className="p-5">
						<div className="flex items-center gap-2 mb-4">
							<Sparkles className="h-4 w-4 text-primary" />
							<h4 className="font-semibold">Preset Palettes</h4>
							<Badge variant="secondary" className="ml-auto text-xs">
								Quick Start
							</Badge>
						</div>
						
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
							{presetPalettes.map((preset) => {
								const isActive = isPresetActive(preset);
								return (
									<Card
										key={preset.name}
										className={`p-3 cursor-pointer transition-all hover:shadow-md ${
											isActive
												? "border-primary bg-primary/5 shadow-sm"
												: "border-border hover:border-primary/30"
										}`}
										onClick={() => applyPreset(preset)}
									>
										<div className="space-y-2">
											<div className="flex items-start justify-between">
												<div>
													<p className={`font-semibold text-sm ${isActive ? "text-primary" : ""}`}>
														{preset.name}
													</p>
													<Badge variant="outline" className="text-xs mt-1">
														{preset.category}
													</Badge>
												</div>
												{isActive && (
													<Check className="h-4 w-4 text-primary flex-shrink-0" />
												)}
											</div>
											
											<div className="flex gap-1">
												{Object.values(preset.colors).slice(0, 5).map((color, idx) => (
													<div
														key={idx}
														className="flex-1 h-6 rounded"
														style={{ backgroundColor: color }}
													/>
												))}
											</div>
										</div>
									</Card>
								);
							})}
						</div>
					</Card>

					{/* Custom Colors */}
					<Card className="p-5">
						<div className="flex items-center gap-2">
							<Palette className="h-4 w-4 text-primary" />
							<h4 className="font-semibold">Custom Colors</h4>
							<Button
								variant="ghost"
								size="sm"
								className="ml-auto gap-2"
								onClick={() => applyPreset(presetPalettes[0])}
							>
								<RotateCcw className="h-3 w-3" />
								Reset
							</Button>
						</div>

						<div className="space-y-3">
							{colorFields.map((field) => (
								<div key={field.key} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
									{/* Color Picker */}
									<div className="flex-shrink-0">
										<div className="relative">
											<Input
												type="color"
												value={config.colors?.[field.key as keyof typeof config.colors] || "#000000"}
												onChange={(e) => updateColor(field.key, e.target.value)}
												className="w-12 h-12 p-1 cursor-pointer rounded-lg"
											/>
										</div>
									</div>

									{/* Label and Hex Input */}
									<div className="flex-1 min-w-0">
										<Label className="text-xs font-semibold">{field.label}</Label>
										<Input
											value={config.colors?.[field.key as keyof typeof config.colors] || "#000000"}
											onChange={(e) => updateColor(field.key, e.target.value)}
											placeholder="#000000"
											className="font-mono text-xs uppercase mt-1 h-8"
											maxLength={7}
										/>
									</div>
								</div>
							))}
						</div>
					</Card>
				</div>

				{/* Right Column: Live Preview (Sticky) */}
				<div className="lg:sticky lg:top-6 lg:self-start">
					<Card className="p-5">
						<div className="flex items-center gap-2 mb-4">
							<Sparkles className="h-4 w-4 text-primary" />
							<h4 className="font-semibold">Live Preview</h4>
						</div>
						
						<div className="space-y-4">
							{/* Color Swatches */}
							<div className="grid grid-cols-4 gap-2">
								{colorFields.map((field) => (
									<div key={field.key} className="text-center">
										<div
											className="w-full aspect-square rounded-lg border-2 mb-1 shadow-sm transition-transform hover:scale-105"
											style={{
												backgroundColor: config.colors?.[field.key as keyof typeof config.colors] || "#000000",
												borderColor: config.colors?.[field.key as keyof typeof config.colors] || "#000000",
											}}
										/>
										<p className="text-[10px] font-medium truncate">{field.label}</p>
										<p className="text-[9px] text-muted-foreground font-mono">
											{(config.colors?.[field.key as keyof typeof config.colors] || "#000000").toUpperCase()}
										</p>
									</div>
								))}
							</div>

							{/* Sample Resume Section */}
							<div 
								className="p-5 rounded-lg border-2 transition-all"
								style={{
									backgroundColor: config.colors?.background || "#ffffff",
									borderColor: config.colors?.border || "#e2e8f0",
								}}
							>
								<h3 
									className="text-base font-bold mb-2 pb-2 border-b-2 transition-all"
									style={{
										color: config.colors?.primary || "#2563eb",
										borderColor: config.colors?.primary || "#2563eb",
									}}
								>
									WORK EXPERIENCE
								</h3>
								<div className="mt-3 space-y-2">
									<p 
										className="font-semibold text-sm transition-colors"
										style={{ color: config.colors?.text || "#1e293b" }}
									>
										Senior Software Engineer
									</p>
									<p 
										className="text-xs transition-colors"
										style={{ color: config.colors?.textLight || "#64748b" }}
									>
										Tech Company • 2020 - Present
									</p>
									<p 
										className="text-xs transition-colors"
										style={{ color: config.colors?.text || "#1e293b" }}
									>
										Developed scalable applications using modern technologies.{" "}
										<a 
											href="#" 
											className="underline transition-colors"
											style={{ color: config.colors?.link || "#2563eb" }}
											onClick={(e) => e.preventDefault()}
										>
											View Project
										</a>
									</p>
								</div>
							</div>

							{/* Additional Preview - Skills Section */}
							<div 
								className="p-5 rounded-lg border-2 transition-all"
								style={{
									backgroundColor: config.colors?.background || "#ffffff",
									borderColor: config.colors?.border || "#e2e8f0",
								}}
							>
								<h3 
									className="text-base font-bold mb-3 pb-2 border-b-2 transition-all"
									style={{
										color: config.colors?.primary || "#2563eb",
										borderColor: config.colors?.primary || "#2563eb",
									}}
								>
									SKILLS
								</h3>
								<div className="space-y-2">
									<div>
										<div 
											className="flex items-center justify-between text-xs mb-1"
											style={{ color: config.colors?.text || "#1e293b" }}
										>
											<span className="font-medium">JavaScript</span>
											<span className="text-[10px]" style={{ color: config.colors?.textLight || "#64748b" }}>Expert</span>
										</div>
										<div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: config.colors?.border || "#e2e8f0" }}>
											<div 
												className="h-full rounded-full transition-all"
												style={{ 
													width: "90%",
													backgroundColor: config.colors?.secondary || "#3b82f6"
												}}
											/>
										</div>
									</div>
									<div>
										<div 
											className="flex items-center justify-between text-xs mb-1"
											style={{ color: config.colors?.text || "#1e293b" }}
										>
											<span className="font-medium">React</span>
											<span className="text-[10px]" style={{ color: config.colors?.textLight || "#64748b" }}>Advanced</span>
										</div>
										<div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: config.colors?.border || "#e2e8f0" }}>
											<div 
												className="h-full rounded-full transition-all"
												style={{ 
													width: "85%",
													backgroundColor: config.colors?.accent || "#60a5fa"
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}

