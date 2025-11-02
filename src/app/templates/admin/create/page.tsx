import AdminTemplateCreator from "@/components/pages/resume-layout-page";
import { TemplateProvider } from "@/components/providers/template-provider";
import React from "react";

const page = () => {
	return (
		<TemplateProvider>
			<AdminTemplateCreator />
		</TemplateProvider>
	);
};

export default page;
