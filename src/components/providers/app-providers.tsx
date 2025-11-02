// components/providers/app-providers.tsx
"use client";

import { ReactNode } from "react";
import { TemplateProvider } from "./template-provider";
import { ResumeProvider } from "./resume-form-provider";

interface AppProvidersProps {
	children: ReactNode;
}

/**
 * Combined app providers wrapper
 * Wraps the entire app with all necessary context providers
 */
export function AppProviders({ children }: AppProvidersProps) {
	return (
		<TemplateProvider>
			<ResumeProvider>{children}</ResumeProvider>
		</TemplateProvider>
	);
}

