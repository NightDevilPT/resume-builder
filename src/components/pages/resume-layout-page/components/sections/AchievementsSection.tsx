"use client";

import { AchievementsConfig, Typography } from "@/interfaces/templates";
import { getFontSize, getFontWeightValue } from "@/lib/utils/template-helpers";

interface AchievementsSectionProps {
	data: Array<{
		title: string;
		issuer: string;
		year: string;
		description?: string;
	}>;
	config?: AchievementsConfig;
	typography?: Typography;
}

export function AchievementsSection({ data, config, typography }: AchievementsSectionProps) {
	const textColor = "var(--template-text)";
	const lightTextColor = "var(--template-text-light)";

	const subheadingStyle: React.CSSProperties = {
		fontSize: getFontSize(typography?.subheadingSize || "base"),
		fontWeight: getFontWeightValue(typography?.subheadingWeight),
		fontFamily: typography?.headingFont || typography?.bodyFont || "Geist",
		color: textColor,
	};
  
	return (
		<div className="space-y-1.5">
			{data.map((achievement, idx) => (
				<div key={idx} className="space-y-0.5">
					<h4 style={subheadingStyle}>
						{achievement.title}
					</h4>
					<div className="text-[0.65rem]" style={{ color: lightTextColor }}>
						{config?.showIssuer && achievement.issuer}
						{config?.showIssuer && config?.showDate && " • "}
						{config?.showDate && achievement.year}
					</div>
					{config?.showDescription && achievement.description && (
						<p className="text-[0.65rem]" style={{ color: textColor }}>
							{achievement.description}
						</p>
					)}
				</div>
			))}
		</div>
	);
}

