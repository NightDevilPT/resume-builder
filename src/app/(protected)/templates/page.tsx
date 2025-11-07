import { Metadata } from "next";
import TemplatesPage from "@/components/pages/templates-page";

export const metadata: Metadata = {
	title: "Templates | ResumeCraft",
	description: "Choose from professional resume templates",
};

/**
 * Templates Page (For Users and Admins)
 * Displays template gallery for creating resumes
 */
export default function Page() {
	return <TemplatesPage />;
}