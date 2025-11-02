"use client";

import { ExperienceConfig } from "@/interfaces/templates";
import { formatDate, getFontSize } from "@/lib/utils/template-helpers";

interface ExperienceSectionProps {
	data: Array<{
		title: string;
		company: string;
		location: string;
		startDate: Date;
		endDate: Date | null;
		currentlyWorking?: boolean;
		achievements: string[];
	}>;
	config?: ExperienceConfig;
	typography?: {
		subheadingSize?: string;
		subheadingWeight?: string;
	};
}

export function ExperienceSection({
	data,
	config,
	typography,
}: ExperienceSectionProps) {
	const textColor = "var(--template-text)";
	const lightTextColor = "var(--template-text-light)";
	const dateFormat = config?.dateFormat || "short";

	const subheadingStyle = {
		fontSize: getFontSize(typography?.subheadingSize || "base"),
		fontWeight: typography?.subheadingWeight || "semibold",
		color: textColor,
	};

	return (
		<div className="space-y-3">
			{data.map((exp, idx) => {
				const startDateStr = formatDate(exp.startDate, dateFormat);
				const endDateStr = exp.currentlyWorking
					? "Present"
					: formatDate(exp.endDate, dateFormat);

				return (
					<div key={idx}>
						<div className="flex justify-between items-start mb-0.5">
							<h4 style={subheadingStyle}>{exp.title}</h4>
							<span
								className="text-[0.65rem]"
								style={{ color: lightTextColor }}
							>
								{startDateStr} - {endDateStr}
							</span>
						</div>
						<div
							className="text-[0.7rem] mb-1"
							style={{ color: lightTextColor }}
						>
							{exp.company}
							{config?.showLocation && ` • ${exp.location}`}
						</div>
						{config?.showAchievements &&
							exp.achievements.length > 0 && (
								<ul
									className="list-disc list-inside text-[0.7rem] space-y-0.5 leading-tight"
									style={{ color: textColor }}
								>
									{exp.achievements.map(
										(achievement: string, i: number) => (
											<li key={i}>{achievement}</li>
										)
									)}
								</ul>
							)}
					</div>
				);
			})}
		</div>
	);
}
