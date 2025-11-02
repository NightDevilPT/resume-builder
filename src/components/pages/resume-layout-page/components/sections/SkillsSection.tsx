"use client";

import { Badge } from "@/components/ui/badge";
import { SkillsConfig } from "@/interfaces/templates";

interface SkillsSectionProps {
	data: {
		technical: string[];
		soft: string[];
		languages: string[];
	};
	config?: SkillsConfig;
	skillsGridCols: string;
}

export function SkillsSection({ data, config, skillsGridCols }: SkillsSectionProps) {
	const textColor = "var(--template-text)";
	const lightTextColor = "var(--template-text-light)";
	const displayFormat = config?.displayFormat || "bars";

	// Generate consistent random levels for each skill (seeded by skill name)
	const getSkillLevel = (skill: string) => {
		let hash = 0;
		for (let i = 0; i < skill.length; i++) {
			hash = skill.charCodeAt(i) + ((hash << 5) - hash);
		}
		return Math.abs(hash % 26) + 75; // 75-100%
	};

	// Get level label based on percentage
	const getLevelLabel = (percentage: number): string => {
		if (percentage >= 95) return "Expert";
		if (percentage >= 85) return "Advanced";
		if (percentage >= 75) return "Intermediate";
		return "Beginner";
	};

	// Get chip color based on percentage
	const getChipColor = (percentage: number) => {
		if (percentage >= 95)
			return {
				bg: "var(--template-primary)",
				text: "white",
			};
		if (percentage >= 85)
			return {
				bg: "var(--template-secondary)",
				text: "white",
			};
		if (percentage >= 75)
			return {
				bg: "var(--template-accent)",
				text: "white",
			};
		return {
			bg: "var(--template-border)",
			text: "var(--template-text)",
		};
	};

	const renderSkillsByFormat = (skills: string[], category: string) => {
		switch (displayFormat) {
			case "bars":
				if (!config?.showLevel) {
					return (
						<div className="space-y-0.5">
							{skills.map((skill, idx) => (
								<span
									key={idx}
									className="text-[0.65rem] block"
									style={{ color: textColor }}
								>
									• {skill}
								</span>
							))}
						</div>
					);
				}
				return (
					<div className="space-y-1">
						{skills.map((skill, idx) => {
							const level = getSkillLevel(skill);
							return (
								<div key={idx}>
									<div className="flex items-center justify-between text-[0.6rem] mb-0.5">
										<span style={{ color: textColor }}>{skill}</span>
										<span
											className="text-[0.55rem] font-medium"
											style={{ color: lightTextColor }}
										>
											{level}%
										</span>
									</div>
									<div
										className="h-1 rounded-full overflow-hidden"
										style={{ backgroundColor: "var(--template-border)" }}
									>
										<div
											className="h-full rounded-full transition-all"
											style={{
												width: `${level}%`,
												backgroundColor: "var(--template-secondary)",
											}}
										/>
									</div>
								</div>
							);
						})}
					</div>
				);

			case "dots":
				if (!config?.showLevel) {
					return (
						<div className={`grid ${skillsGridCols} gap-x-2 gap-y-0.5`}>
							{skills.map((skill, idx) => (
								<div key={idx} className="flex items-center gap-1.5">
									<div
										className="w-1.5 h-1.5 rounded-full flex-shrink-0"
										style={{ backgroundColor: "var(--template-primary)" }}
									/>
									<span className="text-[0.65rem]" style={{ color: textColor }}>
										{skill}
									</span>
								</div>
							))}
						</div>
					);
				}
				return (
					<div className={`grid ${skillsGridCols} gap-x-2 gap-y-1`}>
						{skills.map((skill, idx) => {
							const percentage = getSkillLevel(skill);
							const dots = Math.ceil((percentage / 100) * 5);
							return (
								<div key={idx} className="flex items-center justify-between">
									<span className="text-[0.65rem]" style={{ color: textColor }}>
										{skill}
									</span>
									<div className="flex gap-0.5">
										{Array.from({ length: 5 }).map((_, i) => (
											<div
												key={i}
												className="w-1.5 h-1.5 rounded-full"
												style={{
													backgroundColor:
														i < dots
															? "var(--template-primary)"
															: "var(--template-border)",
												}}
											/>
										))}
									</div>
								</div>
							);
						})}
					</div>
				);

			case "circles":
				return (
					<div className={`grid ${skillsGridCols} gap-x-2 gap-y-1`}>
						{skills.map((skill, idx) => {
							const percentage = getSkillLevel(skill);
							return (
								<div key={idx} className="flex items-center justify-between gap-1.5">
									<span className="text-[0.65rem] truncate" style={{ color: textColor }}>
										{skill}
									</span>
									<div
										className="relative flex-shrink-0"
										style={{ width: "0.9rem", height: "0.9rem" }}
									>
										<svg
											className="w-full h-full transform -rotate-90"
											viewBox="0 0 20 20"
										>
											<circle
												cx="10"
												cy="10"
												r="8"
												fill="none"
												stroke="var(--template-border)"
												strokeWidth="2"
											/>
											{config?.showLevel && (
												<circle
													cx="10"
													cy="10"
													r="8"
													fill="none"
													stroke="var(--template-primary)"
													strokeWidth="2"
													strokeDasharray={`${(percentage / 100) * 50.27} 50.27`}
													strokeLinecap="round"
												/>
											)}
										</svg>
										{config?.showLevel && (
											<div className="absolute inset-0 flex items-center justify-center">
												<span
													className="text-[0.35rem] font-bold leading-none"
													style={{ color: textColor }}
												>
													{/* Percentage hidden for cleaner look */}
												</span>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				);

			case "percentage":
				if (!config?.showLevel) {
					return (
						<div className={`grid ${skillsGridCols} gap-x-2 gap-y-0.5`}>
							{skills.map((skill, idx) => (
								<span key={idx} className="text-[0.65rem]" style={{ color: textColor }}>
									• {skill}
								</span>
							))}
						</div>
					);
				}
				return (
					<div className={`grid ${skillsGridCols} gap-x-2 gap-y-1`}>
						{skills.map((skill, idx) => {
							const percentage = getSkillLevel(skill);
							return (
								<div key={idx} className="flex items-center justify-between">
									<span className="text-[0.65rem]" style={{ color: textColor }}>
										{skill}
									</span>
									<span
										className="text-[0.55rem] font-semibold px-1.5 py-0.5 rounded"
										style={{
											backgroundColor: "var(--template-primary)",
											color: "white",
										}}
									>
										{percentage}%
									</span>
								</div>
							);
						})}
					</div>
				);

			case "stars":
				if (!config?.showLevel) {
					return (
						<div className={`grid ${skillsGridCols} gap-x-2 gap-y-0.5`}>
							{skills.map((skill, idx) => (
								<div key={idx} className="flex items-center gap-1.5">
									<span style={{ color: "var(--template-primary)" }}>★</span>
									<span className="text-[0.65rem]" style={{ color: textColor }}>
										{skill}
									</span>
								</div>
							))}
						</div>
					);
				}
				return (
					<div className={`grid ${skillsGridCols} gap-x-2 gap-y-1`}>
						{skills.map((skill, idx) => {
							const percentage = getSkillLevel(skill);
							const stars = Math.ceil((percentage / 100) * 5);
							return (
								<div key={idx} className="flex items-center justify-between">
									<span className="text-[0.65rem]" style={{ color: textColor }}>
										{skill}
									</span>
									<div className="flex gap-0.5 text-[0.65rem]">
										{Array.from({ length: 5 }).map((_, i) => (
											<span
												key={i}
												style={{
													color:
														i < stars
															? "var(--template-primary)"
															: "var(--template-border)",
												}}
											>
												★
											</span>
										))}
									</div>
								</div>
							);
						})}
					</div>
				);

			case "badge-level":
				if (!config?.showLevel) {
					return (
						<div className={`grid ${skillsGridCols} gap-x-2 gap-y-0.5`}>
							{skills.map((skill, idx) => (
								<span key={idx} className="text-[0.65rem]" style={{ color: textColor }}>
									• {skill}
								</span>
							))}
						</div>
					);
				}
				return (
					<div className={`grid ${skillsGridCols} gap-x-2 gap-y-1`}>
						{skills.map((skill, idx) => {
							const percentage = getSkillLevel(skill);
							const level = getLevelLabel(percentage);
							return (
								<div key={idx} className="flex items-center justify-between">
									<span className="text-[0.65rem]" style={{ color: textColor }}>
										{skill}
									</span>
									<Badge
										variant="secondary"
										className="text-[0.52rem] px-1.5 py-0 h-4"
										style={{
											backgroundColor:
												level === "Expert"
													? "var(--template-primary)"
													: level === "Advanced"
													? "var(--template-secondary)"
													: "var(--template-accent)",
											color: "white",
										}}
									>
										{level}
									</Badge>
								</div>
							);
						})}
					</div>
				);

			case "list":
				return (
					<p className="text-[0.65rem] leading-snug" style={{ color: textColor }}>
						{skills.join(", ")}
					</p>
				);

			case "chips":
				return (
					<div className="flex flex-wrap gap-1">
						{skills.map((skill, idx) => {
							const percentage = getSkillLevel(skill);
							const colors = getChipColor(percentage);
							const level = getLevelLabel(percentage);
							return (
								<span
									key={idx}
									className="px-2 py-0.5 text-[0.6rem] rounded-full inline-flex items-center gap-1"
									style={{
										backgroundColor: colors.bg,
										color: colors.text,
									}}
								>
									{skill}
									{config?.showLevel && (
										<>
											<span className="opacity-50">•</span>
											<span className="text-[0.55rem] font-medium opacity-90">
												{level}
											</span>
										</>
									)}
								</span>
							);
						})}
					</div>
				);

			case "text":
			default:
				return (
					<div className="flex flex-wrap gap-1">
						{skills.map((skill, idx) => (
							<span
								key={idx}
								className="px-2 py-0.5 text-[0.6rem] rounded"
								style={{
									backgroundColor: "var(--template-primary)",
									color: "white",
								}}
							>
								{skill}
							</span>
						))}
					</div>
				);
		}
	};

	if (config?.groupByCategory) {
		return (
			<div className="space-y-2">
				{/* Technical Skills */}
				{data.technical.length > 0 && (
					<div>
						<h5
							className="text-[0.65rem] font-semibold mb-1 uppercase tracking-wide"
							style={{ color: "var(--template-primary)" }}
						>
							{config?.technicalSkillsLabel || "Technical Skills"}
						</h5>
						{renderSkillsByFormat(data.technical, "technical")}
					</div>
				)}

				{/* Soft Skills */}
				{data.soft.length > 0 && (
					<div>
						<h5
							className="text-[0.65rem] font-semibold mb-1 uppercase tracking-wide"
							style={{ color: "var(--template-primary)" }}
						>
							{config?.softSkillsLabel || "Soft Skills"}
						</h5>
						{renderSkillsByFormat(data.soft, "soft")}
					</div>
				)}

				{/* Languages */}
				{data.languages.length > 0 && (
					<div>
						<h5
							className="text-[0.65rem] font-semibold mb-1 uppercase tracking-wide"
							style={{ color: "var(--template-primary)" }}
						>
							{config?.languagesLabel || "Languages"}
						</h5>
						{renderSkillsByFormat(data.languages, "languages")}
					</div>
				)}
			</div>
		);
	} else {
		// Ungrouped skills - all together
		const allSkills = [...data.technical, ...data.soft, ...data.languages];
		return renderSkillsByFormat(allSkills, "all");
	}
}

