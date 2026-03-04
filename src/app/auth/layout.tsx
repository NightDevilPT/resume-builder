import { AuthProvider } from "@/components/context/auth-context";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
	return <AuthProvider>{children}</AuthProvider>;
};

export default layout;
