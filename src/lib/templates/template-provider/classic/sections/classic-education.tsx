import React from "react";
import { Education } from "@/interfaces/resume";
import { TemplateConfig } from "@/interfaces/templates";

interface ClassicEducationProps {
	education: Education[];
	config: TemplateConfig;
}

const ClassicEducation: React.FC<ClassicEducationProps> = ({
	education,
	config,
}) => {
	// Helper function to format dates
	const formatDate = (date: Date | undefined): string => {
		if (!date) return "Present";
		if (typeof date === "string") return date;
		return date.toLocaleDateString("en-US", {
			month: "short",
			year: "numeric",
		});
	};

	if (!education || education.length === 0) {
		return null;
	}

	return (
		<div style={{ marginBottom: "16px" }}>
			<h2
				style={{
					fontSize: "14px",
					fontWeight: "bold",
					color: config.style.primaryColor,
					margin: "0 0 8px 0",
					borderBottom: "1px solid #000",
					paddingBottom: "2px",
					fontFamily: config.style.headingFont,
				}}
			>
				Education
			</h2>
			{education.map((edu, index) => (
				<div key={index} style={{ marginBottom: "8px" }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-start",
							marginBottom: "4px",
						}}
					>
						<div style={{ flex: 1 }}>
							<strong style={{ fontSize: "11px" }}>
								{edu.degree}
							</strong>
							<span style={{ fontSize: "11px" }}>
								, {edu.institution}
							</span>
							<span
								style={{
									fontSize: "11px",
									color: config.style.secondaryColor,
								}}
							>
								{" "}
								-- {edu.location}
							</span>
						</div>
						<div
							style={{
								fontSize: "11px",
								color: config.style.secondaryColor,
								textAlign: "right",
								minWidth: "120px",
							}}
						>
							{formatDate(edu.startDate)} –{" "}
							{formatDate(edu.endDate)}
						</div>
					</div>
					{edu.gradeValue && (
						<div
							style={{
								fontSize: "11px",
								marginBottom: "4px",
							}}
						>
							GPA: {edu.gradeValue}/{edu.gradeType}
						</div>
					)}
					{edu.achievements && edu.achievements.length > 0 && (
						<ul
							style={{
								margin: "4px 0 0 0",
								paddingLeft: "15px",
								fontSize: "11px",
								listStyle: "disc",
							}}
						>
							{edu.achievements.map((achievement, achIndex) => (
								<li
									key={achIndex}
									style={{
										marginBottom: "2px",
										lineHeight: "1.3",
									}}
								>
									{achievement}
								</li>
							))}
						</ul>
					)}
				</div>
			))}
		</div>
	);
};

export default ClassicEducation;