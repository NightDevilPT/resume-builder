import React from "react";

interface PageBreakWrapperProps {
	children: React.ReactNode;
	className?: string;
}

export const PageBreakWrapper: React.FC<PageBreakWrapperProps> = ({
	children,
	className = "",
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
			<div className="flex flex-col items-center gap-4">
				{/* Page 1 */}
				<div
					className="page bg-white shadow-lg"
					style={{
						height: "1123px", // A4 height in pixels
						width: "794px", // A4 width in pixels
						position: "relative",
						overflow: "hidden",
						pageBreakAfter: "always",
						breakAfter: "page",
					}}
				>
					{children}
				</div>
			</div>
		</div>
	);
};

export default PageBreakWrapper;
