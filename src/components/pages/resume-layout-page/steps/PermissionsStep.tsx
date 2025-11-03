"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Lock, Unlock, Info, Palette, Type, Maximize2, Frame, LayoutGrid, List, Settings } from "lucide-react";
import { TemplateConfig } from "@/interfaces/templates";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PermissionsStepProps {
	config: Partial<TemplateConfig>;
	updateConfig: (section: string, data: any) => void;
}

interface PermissionToggleProps {
	icon: React.ReactNode;
	label: string;
	description: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}

const PermissionToggle: React.FC<PermissionToggleProps> = ({
	icon,
	label,
	description,
	checked,
	onCheckedChange,
}) => (
	<div className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
		<div className="flex gap-3 flex-1">
			<div className="mt-0.5 text-primary">{icon}</div>
			<div className="flex-1">
				<div className="flex items-center gap-2">
					<Label className="cursor-pointer font-medium">{label}</Label>
					{checked ? (
						<Unlock className="h-3.5 w-3.5 text-green-500" />
					) : (
						<Lock className="h-3.5 w-3.5 text-muted-foreground" />
					)}
				</div>
				<p className="text-xs text-muted-foreground mt-1">{description}</p>
			</div>
		</div>
		<Switch checked={checked} onCheckedChange={onCheckedChange} />
	</div>
);

export function PermissionsStep({ config, updateConfig }: PermissionsStepProps) {
	const updatePermission = (key: string, value: boolean) => {
		updateConfig("permissions", {
			...config.permissions,
			[key]: value,
		});
	};

	const permissions = config.permissions || {
		canChangeColors: true,
		canChangeFonts: true,
		canChangeLayout: true,
		canChangeSections: true,
		canChangeSectionConfig: true,
		canChangeSpacing: true,
		canChangeBorders: true,
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
					<Shield className="h-5 w-5 text-primary" />
					Template Permissions
				</h3>
				<p className="text-sm text-muted-foreground mb-6">
					Control what users can customize when using this template. Locked features will use your template defaults.
				</p>
			</div>

			{/* Info Alert */}
			<Alert>
				<Info className="h-4 w-4" />
				<AlertDescription className="text-sm">
					<strong>Note:</strong> These permissions only apply to user copies. Your original template remains fully customizable as the creator.
				</AlertDescription>
			</Alert>

			{/* Styling Permissions */}
			<Card className="p-5">
				<div className="flex items-center gap-2 mb-4">
					<Shield className="h-4 w-4 text-primary" />
					<h4 className="font-semibold">Styling & Design</h4>
				</div>
				
				<div className="space-y-3">
					<PermissionToggle
						icon={<Palette className="h-4 w-4" />}
						label="Color Scheme"
						description="Allow users to change template colors (primary, secondary, text, background, etc.)"
						checked={permissions.canChangeColors}
						onCheckedChange={(v) => updatePermission("canChangeColors", v)}
					/>

					<PermissionToggle
						icon={<Type className="h-4 w-4" />}
						label="Typography & Fonts"
						description="Allow users to change fonts, sizes, weights, and text styling"
						checked={permissions.canChangeFonts}
						onCheckedChange={(v) => updatePermission("canChangeFonts", v)}
					/>

					<PermissionToggle
						icon={<Maximize2 className="h-4 w-4" />}
						label="Spacing & Margins"
						description="Allow users to adjust padding, margins, gaps, and spacing"
						checked={permissions.canChangeSpacing}
						onCheckedChange={(v) => updatePermission("canChangeSpacing", v)}
					/>

					<PermissionToggle
						icon={<Frame className="h-4 w-4" />}
						label="Borders & Dividers"
						description="Allow users to change border styles, colors, and widths"
						checked={permissions.canChangeBorders}
						onCheckedChange={(v) => updatePermission("canChangeBorders", v)}
					/>
				</div>
			</Card>

			{/* Layout Permissions */}
			<Card className="p-5">
				<div className="flex items-center gap-2 mb-4">
					<Shield className="h-4 w-4 text-primary" />
					<h4 className="font-semibold">Layout & Structure</h4>
				</div>
				
				<div className="space-y-3">
					<PermissionToggle
						icon={<LayoutGrid className="h-4 w-4" />}
						label="Layout Type"
						description="Allow users to change between single, two-column, or three-column layouts"
						checked={permissions.canChangeLayout}
						onCheckedChange={(v) => updatePermission("canChangeLayout", v)}
					/>

					<PermissionToggle
						icon={<List className="h-4 w-4" />}
						label="Section Management"
						description="Allow users to add, remove, reorder sections, and change their positions"
						checked={permissions.canChangeSections}
						onCheckedChange={(v) => updatePermission("canChangeSections", v)}
					/>

					<PermissionToggle
						icon={<Settings className="h-4 w-4" />}
						label="Section Configuration"
						description="Allow users to configure section-specific settings (show/hide fields, date formats, etc.)"
						checked={permissions.canChangeSectionConfig}
						onCheckedChange={(v) => updatePermission("canChangeSectionConfig", v)}
					/>
				</div>
			</Card>

			{/* Permission Summary */}
			<Card className="p-4 bg-muted/30">
				<h5 className="font-medium mb-2 text-sm">Permission Summary</h5>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
					{Object.entries(permissions).map(([key, value]) => (
						<div key={key} className="flex items-center gap-1.5">
							{value ? (
								<Unlock className="h-3 w-3 text-green-500" />
							) : (
								<Lock className="h-3 w-3 text-muted-foreground" />
							)}
							<span className={value ? "text-foreground" : "text-muted-foreground"}>
								{key.replace("can", "").replace(/([A-Z])/g, " $1").trim()}
							</span>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
}

