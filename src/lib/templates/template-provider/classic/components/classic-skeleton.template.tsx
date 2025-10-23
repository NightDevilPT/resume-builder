import React from "react";
import { TemplateConfig } from "@/interfaces/templates";

interface ClassicSkeletonProps {
	config: TemplateConfig;
	className?: string;
}

const ClassicSkeletonTemplate: React.FC<ClassicSkeletonProps> = ({
	config,
	className = "",
}) => {
	return (
		<div
			className={`classic-skeleton-template ${className}`}
			style={{
				width: "210mm", // A4 width
				minHeight: "297mm", // A4 height
				backgroundColor: config.style.backgroundColor,
				padding: `${config.style.padding}px`,
				fontFamily: config.style.fontFamily,
				color: config.style.textColor,
				boxShadow: config.style.showShadow
					? "0 4px 6px rgba(0, 0, 0, 0.1)"
					: "none",
				borderRadius: `${config.style.borderRadius}px`,
			}}
		>
			{/* Header Section */}
			<div style={{ marginBottom: `${config.style.sectionSpacing}px` }}>
				<div
					style={{
						height: "20px",
						backgroundColor: config.style.primaryColor,
						borderRadius: "4px",
						marginBottom: "8px",
						width: "60%",
					}}
				/>
				<div
					style={{
						height: "14px",
						backgroundColor: config.style.secondaryColor,
						borderRadius: "4px",
						width: "40%",
					}}
				/>
			</div>

			{/* Summary Section */}
			<div style={{ marginBottom: `${config.style.sectionSpacing}px` }}>
				<div
					style={{
						height: "16px",
						backgroundColor: config.style.primaryColor,
						borderRadius: "4px",
						marginBottom: "8px",
						width: "30%",
					}}
				/>
				<div
					style={{
						height: "12px",
						backgroundColor: config.style.secondaryColor,
						borderRadius: "4px",
						marginBottom: "4px",
						width: "100%",
					}}
				/>
				<div
					style={{
						height: "12px",
						backgroundColor: config.style.secondaryColor,
						borderRadius: "4px",
						width: "80%",
					}}
				/>
			</div>

			{/* Experience Section */}
			<div style={{ marginBottom: `${config.style.sectionSpacing}px` }}>
				<div
					style={{
						height: "16px",
						backgroundColor: config.style.primaryColor,
						borderRadius: "4px",
						marginBottom: "12px",
						width: "35%",
					}}
				/>
				{[1, 2].map((item) => (
					<div key={item} style={{ marginBottom: "16px" }}>
						<div
							style={{
								height: "14px",
								backgroundColor: config.style.textColor,
								borderRadius: "4px",
								marginBottom: "4px",
								width: "50%",
							}}
						/>
						<div
							style={{
								height: "12px",
								backgroundColor: config.style.secondaryColor,
								borderRadius: "4px",
								marginBottom: "8px",
								width: "30%",
							}}
						/>
						<div
							style={{
								height: "10px",
								backgroundColor: config.style.secondaryColor,
								borderRadius: "4px",
								marginBottom: "4px",
								width: "90%",
							}}
						/>
						<div
							style={{
								height: "10px",
								backgroundColor: config.style.secondaryColor,
								borderRadius: "4px",
								width: "70%",
							}}
						/>
					</div>
				))}
			</div>

			{/* Education Section */}
			<div style={{ marginBottom: `${config.style.sectionSpacing}px` }}>
				<div
					style={{
						height: "16px",
						backgroundColor: config.style.primaryColor,
						borderRadius: "4px",
						marginBottom: "12px",
						width: "25%",
					}}
				/>
				<div
					style={{
						height: "14px",
						backgroundColor: config.style.textColor,
						borderRadius: "4px",
						marginBottom: "4px",
						width: "45%",
					}}
				/>
				<div
					style={{
						height: "12px",
						backgroundColor: config.style.secondaryColor,
						borderRadius: "4px",
						width: "35%",
					}}
				/>
			</div>

			{/* Skills Section */}
			<div>
				<div
					style={{
						height: "16px",
						backgroundColor: config.style.primaryColor,
						borderRadius: "4px",
						marginBottom: "12px",
						width: "20%",
					}}
				/>
				<div
					style={{
						height: "12px",
						backgroundColor: config.style.secondaryColor,
						borderRadius: "4px",
						marginBottom: "4px",
						width: "85%",
					}}
				/>
				<div
					style={{
						height: "12px",
						backgroundColor: config.style.secondaryColor,
						borderRadius: "4px",
						width: "75%",
					}}
				/>
			</div>
		</div>
	);
};

export default ClassicSkeletonTemplate;
