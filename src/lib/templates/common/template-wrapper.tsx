import React from "react";
import { ToolComponent } from "./tools";
import { TemplateConfig } from "@/interfaces/templates";

interface TemplateWrapperProps {
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	config?: TemplateConfig;
	onConfigChange?: (config: Partial<TemplateConfig>) => void;
}

export const TemplateWrapper: React.FC<TemplateWrapperProps> = ({
	children,
	className = "",
	style = {},
	config,
	onConfigChange,
}) => {
	return (
		<ToolComponent
			className={className}
			config={config}
			onConfigChange={onConfigChange}
		>
			{children}
		</ToolComponent>
	);
};

export default TemplateWrapper;
