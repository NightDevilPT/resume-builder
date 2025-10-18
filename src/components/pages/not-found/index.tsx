"use client";
import React from "react";
import FuzzyText from "@/components/ui/FuzzyText";

const NotFoundPage = () => {
	return (
		<>
			<FuzzyText
				baseIntensity={0.2}
				hoverIntensity={0.5}
				enableHover
				color="black"
				fontSize={"150px"}
			>
				404
			</FuzzyText>
			<FuzzyText
				baseIntensity={0.2}
				hoverIntensity={0.5}
				enableHover
				color="black"
				fontSize={"40px"}
			>
				Page not Found
			</FuzzyText>
		</>
	);
};

export default NotFoundPage;
