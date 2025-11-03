"use client";

import { getFontSize, getFontWeightValue } from "@/lib/utils/template-helpers";
import { PersonalInfoConfig, Typography } from "@/interfaces/templates";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface PersonalInfoSectionProps {
	data: {
		fullName: string;
		email: string;
		phone: string;
		location: string;
		website?: string;
		linkedin?: string;
		github?: string;
		summary: string;
	};
	config?: PersonalInfoConfig;
	typography?: Typography;
}

export function PersonalInfoSection({
	data,
	config,
	typography,
}: PersonalInfoSectionProps) {
	const textColor = "var(--template-text)";
	const lightTextColor = "var(--template-text-light)";

	return (
		<div className="space-y-2">
			<h1
				className="text-center mb-1"
				style={{
					fontSize: getFontSize(typography?.nameSize || "3xl"),
					fontWeight: getFontWeightValue(typography?.nameWeight),
					fontFamily: typography?.headingFont || "Geist",
					color: textColor,
					lineHeight: "1.2",
				}}
			>
				{data.fullName}
			</h1>
			<div
				className="flex flex-wrap justify-center gap-2 text-xs"
				style={{ color: lightTextColor }}
			>
				{config?.showIcons ? (
					<>
						<span className="flex items-center gap-1">
							<Mail className="h-2.5 w-2.5" />
							{data.email}
						</span>
						<span className="flex items-center gap-1">
							<Phone className="h-2.5 w-2.5" />
							{data.phone}
						</span>
						<span className="flex items-center gap-1">
							<MapPin className="h-2.5 w-2.5" />
							{data.location}
						</span>
					</>
				) : (
					<>
						<span>{data.email}</span>
						<span>•</span>
						<span>{data.phone}</span>
						<span>•</span>
						<span>{data.location}</span>
					</>
				)}
				{config?.showWebsite && data.website && (
					<>
						<span>•</span>
						<span className="flex items-center gap-1">
							<Globe className="h-2.5 w-2.5" />
							{data.website}
						</span>
					</>
				)}
			</div>
			{config?.showLinks && (data.linkedin || data.github) && (
				<div
					className="flex flex-wrap justify-center gap-2 text-xs"
					style={{ color: lightTextColor }}
				>
					{data.linkedin && (
						<>
							<span className="flex items-center gap-1">
								<Linkedin className="h-2.5 w-2.5" />
								{data.linkedin}
							</span>
						</>
					)}
					{data.linkedin && data.github && <span>•</span>}
					{data.github && (
						<span className="flex items-center gap-1">
							<Github className="h-2.5 w-2.5" />
							{data.github}
						</span>
					)}
				</div>
			)}
			{config?.showSummary && data.summary && (
				<p
					className="text-xs text-center leading-tight"
					style={{ color: textColor }}
				>
					{data.summary}
				</p>
			)}
		</div>
	);
}
