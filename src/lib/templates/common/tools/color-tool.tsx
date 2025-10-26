import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Palette } from "lucide-react";
import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TemplateConfig } from "@/interfaces/templates";

interface ColorToolProps {
	config?: TemplateConfig;
	onConfigChange?: (config: Partial<TemplateConfig>) => void;
}

export const ColorTool: React.FC<ColorToolProps> = ({
	config,
	onConfigChange,
}) => {
	const handleColorChange = useCallback(
		(colorType: string, value: string) => {
			if (onConfigChange && config) {
				onConfigChange({
					style: {
						...config.style,
						[colorType]: value,
					},
				});
			}
		},
		[onConfigChange, config]
	);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="h-8 px-3 text-xs gap-1"
				>
					<Palette className="h-3 w-3" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80" align="start">
				{config && (
					<div className="space-y-4">
						<div className="space-y-2">
							<h4 className="font-medium text-sm">
								Color Settings
							</h4>
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-2">
									<Label
										htmlFor="primary-color"
										className="text-xs font-medium"
									>
										Primary Color
									</Label>
									<div className="grid grid-cols-[35px_1fr] gap-2">
										<input
											id="primary-color"
											type="color"
											value={config.style.primaryColor}
											onChange={(e) =>
												handleColorChange(
													"primaryColor",
													e.target.value
												)
											}
											className="w-full h-full rounded! cursor-pointer"
										/>
										<Input
											value={config.style.primaryColor}
											onChange={(e) =>
												handleColorChange(
													"primaryColor",
													e.target.value
												)
											}
											className="h-8 text-xs"
											placeholder="#000000"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="secondary-color"
										className="text-xs font-medium"
									>
										Secondary Color
									</Label>
									<div className="flex items-center gap-2">
										<input
											id="secondary-color"
											type="color"
											value={config.style.secondaryColor}
											onChange={(e) =>
												handleColorChange(
													"secondaryColor",
													e.target.value
												)
											}
											className="w-8 h-8 rounded border cursor-pointer"
										/>
										<Input
											value={config.style.secondaryColor}
											onChange={(e) =>
												handleColorChange(
													"secondaryColor",
													e.target.value
												)
											}
											className="h-8 text-xs"
											placeholder="#666666"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="text-color"
										className="text-xs font-medium"
									>
										Text Color
									</Label>
									<div className="flex items-center gap-2">
										<input
											id="text-color"
											type="color"
											value={config.style.textColor}
											onChange={(e) =>
												handleColorChange(
													"textColor",
													e.target.value
												)
											}
											className="w-8 h-8 rounded border cursor-pointer"
										/>
										<Input
											value={config.style.textColor}
											onChange={(e) =>
												handleColorChange(
													"textColor",
													e.target.value
												)
											}
											className="h-8 text-xs"
											placeholder="#333333"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="background-color"
										className="text-xs font-medium"
									>
										Background Color
									</Label>
									<div className="flex items-center gap-2">
										<input
											id="background-color"
											type="color"
											value={config.style.backgroundColor}
											onChange={(e) =>
												handleColorChange(
													"backgroundColor",
													e.target.value
												)
											}
											className="w-8 h-8 rounded border cursor-pointer"
										/>
										<Input
											value={config.style.backgroundColor}
											onChange={(e) =>
												handleColorChange(
													"backgroundColor",
													e.target.value
												)
											}
											className="h-8 text-xs"
											placeholder="#ffffff"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
};

export default ColorTool;
