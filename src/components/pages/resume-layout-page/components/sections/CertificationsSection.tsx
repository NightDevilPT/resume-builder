"use client";

import { CertificationsConfig } from "@/interfaces/templates";

interface CertificationsSectionProps {
	data: Array<{
		name: string;
		issuer: string;
		year: string;
	}>;
	config?: CertificationsConfig;
}

export function CertificationsSection({ data, config }: CertificationsSectionProps) {
	const textColor = "var(--template-text)";
	const lightTextColor = "var(--template-text-light)";

	return (
		<div className="space-y-1.5">
			{data.map((cert, idx) => (
				<div key={idx}>
					<h4 className="text-[0.75rem] font-medium" style={{ color: textColor }}>
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

