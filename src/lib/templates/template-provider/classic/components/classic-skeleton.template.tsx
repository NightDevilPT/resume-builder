import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { TemplateConfig } from "@/interfaces/templates";

interface ClassicSkeletonProps {
	config: TemplateConfig;
	className?: string;
}

const ClassicSkeletonTemplate: React.FC<ClassicSkeletonProps> = ({
	config,
	className = "",
}) => {
	const SectionHeader = ({ title }: { title: string }) => (
		<>
			<h3 className="text-[10px] font-bold mb-1 text-gray-700">
				{title}
			</h3>
			<Separator className="mb-1" />
		</>
	);

	const SkillTags = () => (
		<div className="flex justify-start items-start gap-2 flex-wrap">
			{Array.from({ length: 9 }).map((_, i) => (
				<Skeleton
					key={i}
					className="w-[20px] h-[5px] border border-gray-300"
				/>
			))}
		</div>
	);

	return (
		<div
			className={`classic-skeleton-template ${className} w-full max-w-[210mm] min-h-[297mm] bg-white p-4 font-sans text-black mx-auto flex flex-col items-center`}
		>
			{/* Header Section */}
			<div className="text-center mb-1 w-full">
				<h1 className="text-[12px] font-bold mb-1 text-gray-800">
					John Smith
				</h1>
				<div className="flex justify-center items-center flex-wrap gap-1 mb-1 text-[8px] text-gray-500">
					<Skeleton className="w-[80px] h-[8px] border" />
					<span>|</span>
					<Skeleton className="w-[50px] h-[8px] border" />
					<span>|</span>
					<Skeleton className="w-[50px] h-[8px] border" />
				</div>
				<div className="text-left w-full">
					<SectionHeader title="Professional Summary" />
					<div className="space-y-1">
						<Skeleton className="w-full h-[5px] border" />
						<Skeleton className="w-full h-[5px] border" />
						<Skeleton className="w-1/4 h-[5px] border" />
					</div>
				</div>
			</div>

			{/* Main Content Sections */}
			<div className="w-full">
				<SectionHeader title="Experience" />
				<div className="space-y-1">
					<div className="flex justify-between items-center gap-5 w-full">
						<Skeleton className="w-1/2 h-[5px] border" />
						<Skeleton className="w-1/5 h-[5px] border" />
					</div>
					<Skeleton className="w-2/3 h-[5px] border" />
					<Skeleton className="w-2/3 h-[5px] border" />
				</div>
			</div>

			<div className="w-full">
				<SectionHeader title="Education" />
				<div className="space-y-1">
					<div className="flex justify-between items-center gap-5 w-full">
						<Skeleton className="w-1/2 h-[5px] border" />
						<Skeleton className="w-1/5 h-[5px] border" />
					</div>
					<Skeleton className="w-2/3 h-[5px] border" />
					<Skeleton className="w-2/3 h-[5px] border" />
				</div>
			</div>

			<div className="w-full">
				<SectionHeader title="Projects" />
				<div className="space-y-1">
					<div className="flex justify-between items-center gap-5 w-full">
						<Skeleton className="w-1/2 h-[5px] border" />
						<Skeleton className="w-1/5 h-[5px] border" />
					</div>
					<Skeleton className="w-2/3 h-[5px] border" />
					<Skeleton className="w-2/3 h-[5px] border" />
				</div>
				<div className="space-y-1 mt-1">
					<div className="flex justify-between items-center gap-5 w-full">
						<Skeleton className="w-1/2 h-[5px] border" />
						<Skeleton className="w-1/5 h-[5px] border" />
					</div>
					<Skeleton className="w-2/3 h-[5px] border" />
					<Skeleton className="w-2/3 h-[5px] border" />
				</div>
			</div>

			<div className="w-full">
				<SectionHeader title="Skills" />
				<SkillTags />
			</div>

			<div className="w-full mt-1">
				<SectionHeader title="Certifications" />
				<div className="space-y-1">
					<Skeleton className="w-full h-[5px] border" />
					<Skeleton className="w-full h-[5px] border" />
				</div>
			</div>

			<div className="w-full mt-1">
				<SectionHeader title="Achievements" />
				<div className="space-y-1">
					<Skeleton className="w-full h-[5px] border" />
					<Skeleton className="w-full h-[5px] border" />
				</div>
			</div>
		</div>
	);
};

export default ClassicSkeletonTemplate;
