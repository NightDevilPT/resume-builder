import { ResumeData } from "@/interfaces/resume";

export const getDummyResumeData = (): ResumeData => {
	return {
		name: "Sample Resume",
		description: "A sample resume for preview purposes",
		personalInfo: {
			fullName: "John Doe",
			email: "john.doe@email.com",
			phone: "+1 (555) 123-4567",
			location: "San Francisco, CA",
			website: "johndoe.com",
			links: [
				{ label: "LinkedIn", url: "linkedin.com/in/johndoe" },
				{ label: "GitHub", url: "github.com/johndoe" },
			],
			summary:
				"Passionate software engineer with 5+ years of experience building scalable web applications.",
		},
		experience: [
			{
				id: "1",
				order: 1,
				jobTitle: "Senior Software Engineer",
				company: "Tech Corp",
				location: "San Francisco, CA",
				startDate: new Date("2022-01-01"),
				endDate: undefined,
				currentlyWorking: true,
				description: "Leading development of cloud-based solutions",
				achievements: [
					"Improved application performance by 40%",
					"Led team of 5 engineers",
					"Implemented CI/CD pipeline",
				],
				skillsUsed: ["React", "Node.js", "TypeScript", "AWS"],
			},
			{
				id: "2",
				order: 2,
				jobTitle: "Software Engineer",
				company: "StartupXYZ",
				location: "Remote",
				startDate: new Date("2019-06-01"),
				endDate: new Date("2021-12-31"),
				currentlyWorking: false,
				description: "Developed full-stack web applications",
				achievements: [
					"Built core product features",
					"Mentored junior developers",
					"Reduced bug count by 50%",
				],
				skillsUsed: ["JavaScript", "Python", "PostgreSQL"],
			},
		],
		education: [
			{
				id: "1",
				order: 1,
				degree: "Bachelor of Science in Computer Science",
				institution: "University of California",
				location: "Berkeley, CA",
				startDate: new Date("2015-09-01"),
				endDate: new Date("2019-05-31"),
				currentlyStudying: false,
				gradeType: "gpa",
				gradeValue: "3.8",
				achievements: [
					"Dean's List all semesters",
					"President of Computer Science Club",
				],
				coursework: [
					"Data Structures",
					"Algorithms",
					"Database Systems",
					"Web Development",
				],
			},
		],
		skills: {
			technical: [
				{ name: "JavaScript", level: 9 },
				{ name: "TypeScript", level: 9 },
				{ name: "React", level: 9 },
				{ name: "Node.js", level: 8 },
				{ name: "Python", level: 7 },
				{ name: "AWS", level: 7 },
			],
			soft: [
				{ name: "Leadership", level: 8 },
				{ name: "Communication", level: 9 },
				{ name: "Problem Solving", level: 9 },
			],
			languages: [
				{ language: "English", proficiency: "Native" },
				{ language: "Spanish", proficiency: "Professional" },
			],
		},
		projects: [
			{
				id: "1",
				order: 1,
				name: "E-Commerce Platform",
				subtitle: "Personal Project",
				description:
					"A full-stack e-commerce platform with payment integration",
				technologies: ["React", "Node.js", "MongoDB", "Stripe"],
				links: [
					{ label: "Live Demo", url: "demo.example.com" },
					{ label: "GitHub", url: "github.com/johndoe/ecommerce" },
				],
				startDate: new Date("2023-01-01"),
				endDate: new Date("2023-06-30"),
				currentlyWorking: false,
				highlights: [
					"Processed over 1000 transactions",
					"Implemented secure payment gateway",
					"Built responsive admin dashboard",
				],
			},
		],
		certifications: [
			{
				id: "1",
				order: 1,
				name: "AWS Certified Solutions Architect",
				issuingOrganization: "Amazon Web Services",
				issueDate: new Date("2023-03-15"),
				expirationDate: new Date("2026-03-15"),
				credentialUrl: "aws.amazon.com/verification",
				doesNotExpire: false,
			},
		],
		achievements: [
			{
				id: "1",
				order: 1,
				title: "Best Innovation Award",
				issuer: "Tech Corp",
				date: new Date("2023-12-01"),
				description:
					"Awarded for developing innovative solution that increased efficiency by 60%",
			},
		],
	};
};

