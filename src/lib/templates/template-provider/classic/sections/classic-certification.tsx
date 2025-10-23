import React from "react";
import { Certification } from "@/interfaces/resume";
import { TemplateConfig } from "@/interfaces/templates";

interface ClassicCertificationProps {
	certifications: Certification[];
	config: TemplateConfig;
}

const ClassicCertification: React.FC<ClassicCertificationProps> = ({
	certifications,
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

	if (!certifications || certifications.length === 0) {
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
				Certifications
			</h2>
			{certifications.map((cert, index) => (
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
								{cert.name}
							</strong>
							<span style={{ fontSize: "11px" }}>
								, {cert.issuingOrganization}
							</span>
						</div>
						<div
							style={{
								fontSize: "11px",
								color: config.style.secondaryColor,
							}}
						>
							{formatDate(cert.issueDate)} –{" "}
							{cert.doesNotExpire
								? "No Expiration"
								: formatDate(cert.expirationDate)}
						</div>
					</div>
					{cert.credentialUrl && (
						<div style={{ fontSize: "11px" }}>
							<a
								href={cert.credentialUrl}
								style={{
									color: config.style.primaryColor,
									textDecoration: "none",
								}}
							>
								{cert.credentialUrl}
							</a>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default ClassicCertification;
