import { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasRole } from "@/lib/services/jwt.service";
import TemplateAdminPage from "@/components/pages/template-admin-page";

export const metadata: Metadata = {
	title: "Manage Templates | ResumeCraft Admin",
	description: "Manage resume templates - Admin panel",
};

/**
 * Admin Templates Management Page
 * CRUD operations for templates - Admin only
 */
export default async function AdminTemplatesPage() {
	// Check if user is admin
	const isAdmin = await hasRole("admin");

	// If not admin, redirect to regular templates page
	if (!isAdmin) {
		redirect("/templates");
	}

	return <TemplateAdminPage />;
}