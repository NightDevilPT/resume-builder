import React, { ReactNode } from "react";
import { HeaderComponent } from "./heade";

const RootLayoutProvider = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<HeaderComponent />
			{children}
		</div>
	);
};

export default RootLayoutProvider;
