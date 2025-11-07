import React, { ReactNode } from "react";
import { HeaderComponent } from "./header";
import { Toaster } from "@/components/ui/sonner";

const RootLayoutProvider = ({ children }: { children: ReactNode }) => {
	return (
		<div className="h-full grid grid-rows-[64px_1fr]">
			<HeaderComponent />
			<main className="h-full overflow-y-auto">{children}</main>
			<Toaster />
		</div>
	);
};

export default RootLayoutProvider;
