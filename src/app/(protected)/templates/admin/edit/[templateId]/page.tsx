import { notFound } from "next/navigation";
import { getTemplateById } from "@/lib/services/template.service";
import AdminTemplateCreator from "@/components/pages/resume-layout-page";
import { TemplateProvider } from "@/components/providers/template-provider";

interface EditTemplatePageProps {
	params: {
		templateId: string;
	};
}

export default async function EditTemplatePage({
	params,
}: EditTemplatePageProps) {
	const template = await getTemplateById(params.templateId);

	if (!template) {
		notFound();
	}

	return (
		<TemplateProvider
			initialTemplates={[template]}
			initialTemplateId={template.id}
		>
			<AdminTemplateCreator initialTemplate={template} />
		</TemplateProvider>
	);
}
