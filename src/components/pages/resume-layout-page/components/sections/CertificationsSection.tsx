"use client";

import { CertificationsConfig, Typography } from "@/interfaces/templates";
import { getFontSize, getFontWeightValue } from "@/lib/utils/template-helpers";

interface CertificationsSectionProps {
	data: Array<{
		name: string;
		issuer: string;
		year: string;
	}>;
	config?: CertificationsConfig;
	typography?: Typography;
}

export function CertificationsSection({ data, config, typography }: CertificationsSectionProps) {
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
			{data.map((cert, idx) => (
				<div key={idx}>
					<h4 style={subheadingStyle}>
						{cert.name}
					</h4>
					<div className="text-[0.65rem]" style={{ color: lightTextColor }}>
						{cert.issuer}
						{config?.showIssueDate && ` • ${cert.year}`}
					</div>
					{config?.showCredentialUrl && (
						<div className="text-[0.6rem] text-primary">View Credential →</div>
					)}
				</div>
			))}
		</div>
	);
}

