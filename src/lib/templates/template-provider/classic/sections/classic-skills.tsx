import React from "react";
import { Skills } from "@/interfaces/resume";
import { TemplateConfig } from "@/interfaces/templates";

interface ClassicSkillsProps {
	skills: Skills;
	config: TemplateConfig;
}

const ClassicSkills: React.FC<ClassicSkillsProps> = ({ skills, config }) => {
	if (!skills) {
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
				Technologies
			</h2>
			{skills.technical && skills.technical.length > 0 && (
				<div style={{ marginBottom: "8px" }}>
					<strong style={{ fontSize: "11px" }}>Languages:</strong>
					<span
						style={{
							fontSize: "11px",
							marginLeft: "4px",
						}}
					>
						{skills.technical.map((skill) => skill.name).join(", ")}
					</span>
				</div>
			)}
			{skills.soft && skills.soft.length > 0 && (
				<div style={{ marginBottom: "8px" }}>
					<strong style={{ fontSize: "11px" }}>Technologies:</strong>
					<span
						style={{
							fontSize: "11px",
							marginLeft: "4px",
						}}
					>
						{skills.soft.map((skill) => skill.name).join(", ")}
					</span>
				</div>
			)}
			{skills.languages && skills.languages.length > 0 && (
				<div style={{ marginBottom: "8px" }}>
					<strong style={{ fontSize: "11px" }}>Languages:</strong>
					<span
						style={{
							fontSize: "11px",
							marginLeft: "4px",
						}}
					>
						{skills.languages
							.map(
								(lang) =>
									`${lang.language} (${lang.proficiency})`
							)
							.join(", ")}
					</span>
				</div>
			)}
		</div>
	);
};

export default ClassicSkills;
