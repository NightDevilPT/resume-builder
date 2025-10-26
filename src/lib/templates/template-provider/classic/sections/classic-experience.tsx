import React from "react";
import { Experience } from "@/interfaces/resume";
import { TemplateConfig } from "@/interfaces/templates";

interface ClassicExperienceProps {
	experience: Experience[];
	config: TemplateConfig;
}

const ClassicExperience: React.FC<ClassicExperienceProps> = ({
	experience,
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

	if (!experience || experience.length === 0) {
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
				Experience
			</h2>
			{experience.map((exp, index) => (
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
								{exp.jobTitle}
							</strong>
							<span style={{ fontSize: "11px" }}>
								, {exp.company}
							</span>
							<span
								style={{
									fontSize: "11px",
									color: config.style.secondaryColor,
								}}
							>
								{" "}
								-- {exp.location}
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
							{formatDate(exp.startDate)} –{" "}
							{formatDate(exp.endDate)}
						</div>
					</div>
					{exp.achievements && exp.achievements.length > 0 && (
						<ul
							style={{
								margin: "4px 0 0 0",
								paddingLeft: "15px",
								fontSize: "11px",
								listStyle: "disc",
							}}
						>
							{exp.achievements.map((achievement, achIndex) => (
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

export default ClassicExperience;