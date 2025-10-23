import React from "react";
import { Project } from "@/interfaces/resume";
import { TemplateConfig } from "@/interfaces/templates";

interface ClassicProjectsProps {
	projects: Project[];
	config: TemplateConfig;
}

const ClassicProjects: React.FC<ClassicProjectsProps> = ({
	projects,
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

	if (!projects || projects.length === 0) {
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
				Projects
			</h2>
			{projects.map((project, index) => (
				<div key={index} style={{ marginBottom: "12px" }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-start",
							marginBottom: "4px",
						}}
					>
						<div>
							<strong style={{ fontSize: "11px" }}>
								{project.name}
							</strong>
							{project.subtitle && (
								<span style={{ fontSize: "11px" }}>
									{" "}
									- {project.subtitle}
								</span>
							)}
						</div>
						<div
							style={{
								fontSize: "11px",
								color: config.style.secondaryColor,
							}}
						>
							{formatDate(project.startDate)} –{" "}
							{formatDate(project.endDate)}
						</div>
					</div>
					{project.description && (
						<p
							style={{
								fontSize: "11px",
								margin: "4px 0",
								lineHeight: "1.3",
							}}
						>
							{project.description}
						</p>
					)}
					{project.highlights && project.highlights.length > 0 && (
						<ul
							style={{
								margin: "4px 0 0 0",
								paddingLeft: "15px",
								fontSize: "11px",
							}}
						>
							{project.highlights.map((highlight, hlIndex) => (
								<li
									key={hlIndex}
									style={{
										marginBottom: "2px",
										lineHeight: "1.3",
									}}
								>
									{highlight}
								</li>
							))}
						</ul>
					)}
					{project.technologies && project.technologies.length > 0 && (
						<div
							style={{
								fontSize: "11px",
								marginTop: "4px",
							}}
						>
							<strong>Tools Used:</strong>{" "}
							{project.technologies.join(", ")}
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default ClassicProjects;
