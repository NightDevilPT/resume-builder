"use client";

import { ProjectsConfig } from "@/interfaces/templates";
import { getFontSize } from "@/lib/utils/template-helpers";

interface ProjectsSectionProps {
	data: Array<{
		name: string;
		description?: string;
		technologies: string[];
	}>;
	config?: ProjectsConfig;
	typography?: {
		subheadingSize?: string;
		subheadingWeight?: string;
	};
}

export function ProjectsSection({
	data,
	config,
	typography,
}: ProjectsSectionProps) {
	const textColor = "var(--template-text)";
	const lightTextColor = "var(--template-text-light)";

	const subheadingStyle = {
		fontSize: getFontSize(typography?.subheadingSize || "base"),
		fontWeight: typography?.subheadingWeight || "semibold",
		color: textColor,
	};

	return (
		<div className="space-y-2">
			{data.map((project, idx) => (
				<div key={idx}>
					<h4 style={subheadingStyle}>{project.name}</h4>
					{config?.showDescription && project.description && (
						<p
							className="text-[0.7rem] mb-0.5 leading-tight"
							style={{ color: textColor }}
						>
							{project.description}
						</p>
					)}
					{config?.showTechnologies &&
						project.technologies.length > 0 && (
							<div
								className="flex flex-wrap gap-1 text-[0.65rem]"
								style={{ color: lightTextColor }}
							>
								{project.technologies.map((tech, i) => (
									<span key={i}>
										{tech}
										{i < project.technologies.length - 1
											? " •"
											: ""}
									</span>
								))}
							</div>
						)}
				</div>
			))}
		</div>
	);
}
