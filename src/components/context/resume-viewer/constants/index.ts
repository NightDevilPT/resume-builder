import { TemplateConfig } from "@/interfaces/templates/template.interface";

export const professionalResumeTemplate: TemplateConfig = {
	// Document metadata
	title: "Professional Resume - John Doe",
	author: "John Doe",
	subject: "Software Engineer Resume",
	keywords: "resume, software engineer, react, typescript",
	creator: "React-PDF Resume Builder",
	producer: "react-pdf",
	version: "1.7",
	language: "en-US",
	pageMode: "useNone",
	pageLayout: "oneColumn",

	// Column layout shortcut
	columnLayout: "two-column", // matches the layout below

	// Page settings
	pageSize: "A4",
	orientation: "portrait",
	pageStyle: {
		padding: 40,
		backgroundColor: "#ffffff",
		fontFamily: "Helvetica",
	},
	pageWrap: true,
	pageDebug: false,
	pageDpi: 72,

	// Global content settings
	margins: { top: 40, bottom: 40, left: 40, right: 40 },
	globalStyle: {
		fontSize: 10,
		color: "#333333",
		lineHeight: 1.4,
	},

	// Detailed layout definition (two columns with custom widths)
	layout: [
		{ width: 30, style: { paddingRight: 15 } },
		{ width: 70, style: { paddingLeft: 15 } },
	],

	sections: [
		{
			id: "profile",
			type: "profile",
			title: "Profile",
			order: 1,
			colMap: "full",
			style: {
				backgroundColor: "#f8fafc",
				padding: 20,
				borderRadius: 4,
				marginBottom: 20,
			},
			data: {
				name: "John Doe",
				title: "Senior Software Engineer",
				summary: [
					{
						type: "text",
						content:
							"Experienced software engineer with 8+ years in full-stack development, specializing in React, Node.js, and cloud architectures. Passionate about building scalable applications and mentoring teams.",
						style: { marginBottom: 10 },
					},
					{
						type: "list",
						items: [
							{ content: "Led development of 3 major products" },
							{ content: "5+ years of team leadership" },
						],
						style: { marginLeft: 15 },
					},
				],
				email: "john.doe@example.com",
				phone: "+1 (555) 123-4567",
				location: "San Francisco, CA",
				socialLinks: [
					{
						platform: "LinkedIn",
						url: "https://linkedin.com/in/johndoe",
						icon: "linkedin",
					},
					{
						platform: "GitHub",
						url: "https://github.com/johndoe",
						icon: "github",
					},
				],
			},
		},
		{
			id: "skills",
			type: "skills",
			title: "Technical Skills",
			order: 2,
			colMap: "left",
			style: {
				backgroundColor: "#f1f5f9",
				padding: 15,
				borderRadius: 4,
				marginBottom: 20,
			},
			items: [
				{
					type: "skill",
					name: "React",
					level: 95,
					displayFormat: "bar",
					showLevel: true,
					style: { marginBottom: 8 },
				},
				{
					type: "skill",
					name: "TypeScript",
					level: 90,
					displayFormat: "bar",
					showLevel: true,
					style: { marginBottom: 8 },
				},
				{
					type: "skill",
					name: "Node.js",
					level: 85,
					displayFormat: "bar",
					showLevel: true,
					style: { marginBottom: 8 },
				},
				{
					type: "skill",
					name: "Python",
					level: 70,
					displayFormat: "bar",
					showLevel: true,
					style: { marginBottom: 8 },
				},
			],
			columns: 1,
		},
		{
			id: "languages",
			type: "custom",
			title: "Languages",
			order: 3,
			colMap: "left",
			style: { marginBottom: 20 },
			content: [
				{
					type: "text",
					content: "English (Native)",
					style: { marginBottom: 5 },
				},
				{
					type: "text",
					content: "Spanish (Professional Working)",
					style: { marginBottom: 5 },
				},
				{
					type: "text",
					content: "French (Conversational)",
				},
			],
		},
		{
			id: "experience",
			type: "experience",
			title: "Work Experience",
			order: 4,
			colMap: "right",
			style: { marginBottom: 25 },
			items: [
				{
					id: "exp1",
					title: "Senior Software Engineer",
					subtitle: "TechCorp Inc.",
					location: "San Francisco, CA",
					startDate: "Jan 2020",
					endDate: "present",
					description: [
						{
							type: "list",
							items: [
								{
									content:
										"Led a team of 5 engineers to redesign the core platform, resulting in 30% performance improvement.",
								},
								{
									content:
										"Implemented CI/CD pipelines reducing deployment time by 50%.",
								},
								{
									content:
										"Mentored junior developers and conducted code reviews.",
								},
							],
						},
					],
					link: "https://techcorp.com",
				},
				{
					id: "exp2",
					title: "Software Engineer",
					subtitle: "StartupXYZ",
					location: "Remote",
					startDate: "Jun 2016",
					endDate: "Dec 2019",
					description: [
						{
							type: "list",
							items: [
								{
									content:
										"Developed and maintained microservices using Node.js and Express.",
								},
								{
									content:
										"Built responsive front-end applications with React and Redux.",
								},
							],
						},
					],
				},
			],
		},
		{
			id: "education",
			type: "education",
			title: "Education",
			order: 5,
			colMap: "right",
			style: { marginBottom: 25 },
			items: [
				{
					id: "edu1",
					title: "Bachelor of Science in Computer Science",
					subtitle: "University of Technology",
					location: "Boston, MA",
					startDate: "2012",
					endDate: "2016",
					degree: "B.Sc.",
					field: "Computer Science",
					description: [
						{
							type: "text",
							content:
								"Graduated with Honors. Relevant coursework: Algorithms, Data Structures, Web Development.",
						},
					],
				},
			],
		},
		{
			id: "achievements",
			type: "achievements",
			title: "Certifications & Awards",
			order: 6,
			colMap: "right",
			style: { marginBottom: 20 },
			items: [
				{
					id: "cert1",
					title: "AWS Certified Solutions Architect",
					issuer: "Amazon Web Services",
					date: "2022",
					link: "https://aws.amazon.com/certification/",
				},
				{
					id: "cert2",
					title: "Microsoft Certified: Azure Developer Associate",
					issuer: "Microsoft",
					date: "2021",
				},
				{
					id: "award1",
					title: "Employee of the Year",
					issuer: "TechCorp Inc.",
					date: "2023",
					description:
						"Recognized for outstanding contribution to the platform rewrite.",
				},
			],
		},
		{
			id: "custom-section",
			type: "custom",
			title: "Additional Information",
			order: 7,
			colMap: "full",
			style: { marginTop: 10 },
			content: [
				{
					type: "heading",
					level: 2,
					content: "Open Source Contributions",
					style: {
						fontSize: 12,
						fontWeight: "bold",
						marginBottom: 5,
					},
				},
				{
					type: "list",
					items: [
						{
							content:
								"Maintainer of react-pdf-schema (200+ stars)",
						},
						{ content: "Contributor to DefinitelyTyped" },
					],
					style: { marginBottom: 10 },
				},
				{
					type: "image",
					src: "https://example.com/opensource.png",
					alt: "Open source graph",
					style: { width: 200, height: 100, marginBottom: 10 },
				},
			],
		},
	],
};
