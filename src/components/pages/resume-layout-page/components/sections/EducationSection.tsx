"use client";

import { EducationConfig } from "@/interfaces/templates";
import { formatDate, getFontSize } from "@/lib/utils/template-helpers";

interface EducationSectionProps {
	data: Array<{
		degree: string;
		institution: string;
		location: string;
		startDate: Date;
		endDate?: Date;
		currentlyStudying?: boolean;
		gpa?: string;
	}>;
	config?: EducationConfig;
	typography?: {
		subheadingSize?: string;
		subheadingWeight?: string;
	};
}

export function EducationSection({ data, config, typography }: EducationSectionProps) {
	const textColor = "var(--template-text)";
	const lightTextColor = "var(--template-text-light)";
	const dateFormat = config?.dateFormat || "short";

	const subheadingStyle = {
		fontSize: getFontSize(typography?.subheadingSize || "base"),
		fontWeight: typography?.subheadingWeight || "semibold",
		color: textColor,
	};

	return (
		<div className="space-y-2">
			{data.map((edu, idx) => {
				const startDateStr = formatDate(edu.startDate, dateFormat);
				const endDateStr = edu.currentlyStudying
					? "Present"
					: edu.endDate
					? formatDate(edu.endDate, dateFormat)
					: "Present";

				return (
					<div key={idx}>
						<h4 style={subheadingStyle}>{edu.degree}</h4>
						<div className="text-[0.7rem]" style={{ color: lightTextColor }}>
							{edu.institution}
							{config?.showLocation && ` • ${edu.location}`}
						</div>
						<div
							className="text-[0.65rem] flex justify-between"
							style={{ color: lightTextColor }}
						>
							<span>
								{startDateStr} - {endDateStr}
							</span>
							{config?.showGrade && edu.gpa && (
								<span>{edu.gpa}</span>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}

