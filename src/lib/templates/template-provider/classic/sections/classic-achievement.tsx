import React from "react";
import { Achievement } from "@/interfaces/resume";
import { TemplateConfig } from "@/interfaces/templates";

interface ClassicAchievementProps {
	achievements: Achievement[];
	config: TemplateConfig;
}

const ClassicAchievement: React.FC<ClassicAchievementProps> = ({
	achievements,
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

	if (!achievements || achievements.length === 0) {
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
				Achievements
			</h2>
			{achievements.map((achievement, index) => (
				<div key={index} style={{ marginBottom: "8px" }}>
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
								{achievement.title}
							</strong>
							{achievement.issuer && (
								<span style={{ fontSize: "11px" }}>
									, {achievement.issuer}
								</span>
							)}
						</div>
						<div
							style={{
								fontSize: "11px",
								color: config.style.secondaryColor,
							}}
						>
							{formatDate(achievement.date)}
						</div>
					</div>
					{achievement.description && (
						<p
							style={{
								fontSize: "11px",
								margin: "4px 0",
								lineHeight: "1.3",
							}}
						>
							{achievement.description}
						</p>
					)}
				</div>
			))}
		</div>
	);
};

export default ClassicAchievement;
