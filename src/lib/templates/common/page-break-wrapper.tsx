import React from "react";
import { TemplateConfig } from "@/interfaces/templates";

interface PageBreakWrapperProps {
	children: React.ReactNode;
	className?: string;
	config?: TemplateConfig;
}

export const PageBreakWrapper: React.FC<PageBreakWrapperProps> = ({
	children,
	className = "",
	config,
}) => {
	return (
		<div
			className={`page-break-wrapper ${className}`}
			style={{
				position: "relative",
				width: "100%",
				minHeight: "100%",
			}}
		>
			<div className="flex flex-col items-center">
				{/* Single page only */}
				<div
					className="page bg-white shadow-lg"
					style={{
						width: "210mm", // A4 width
						minHeight: "297mm", // A4 height
						backgroundColor:
							config?.style?.backgroundColor || "#ffffff",
						padding: `${config?.style?.padding || 20}px`,
						fontFamily: config?.style?.fontFamily || "inherit",
						color: config?.style?.textColor || "#000000",
						fontSize: `${config?.style?.fontSize?.body || 14}px`,
						lineHeight: "1.4",
						margin: "0 auto",
						maxWidth: "100%",
						boxSizing: "border-box",
					}}
				>
					{children}
				</div>
			</div>
		</div>
	);
};

export default PageBreakWrapper;
