import React from "react";
import ClassicSkills from "../sections/classic-skills";
import { ResumeData } from "@/interfaces/resume";
import ClassicProjects from "../sections/classic-projects";
import { TemplateConfig } from "@/interfaces/templates";
import ClassicEducation from "../sections/classic-education";
import ClassicExperience from "../sections/classic-experience";
import ClassicAchievement from "../sections/classic-achievement";
import ClassicCertification from "../sections/classic-certification";
import ClassicPersonalInfo from "../sections/classic-personal-info";
import { PageBreakWrapper } from "@/lib/templates/common/page-break-wrapper";

interface ClassicMainTemplateProps {
	data: ResumeData;
	config: TemplateConfig;
}

const ClassicMainTemplate: React.FC<ClassicMainTemplateProps> = ({
	data,
	config,
}) => {
	const {
		personalInfo,
		experience,
		education,
		skills,
		projects,
		certifications,
		achievements,
	} = data;

	return (
		<PageBreakWrapper config={config}>
			{/* Personal Information Section */}
			<ClassicPersonalInfo personalInfo={personalInfo} config={config} />

			{/* Experience Section */}
			<ClassicExperience experience={experience} config={config} />

			{/* Education Section */}
			<ClassicEducation education={education} config={config} />

			{/* Projects Section */}
			<ClassicProjects projects={projects} config={config} />

			{/* Skills Section */}
			<ClassicSkills skills={skills} config={config} />

			{/* Certifications Section */}
			<ClassicCertification
				certifications={certifications}
				config={config}
			/>

			{/* Achievements Section */}
			<ClassicAchievement achievements={achievements} config={config} />
		</PageBreakWrapper>
	);
};

export default ClassicMainTemplate;
