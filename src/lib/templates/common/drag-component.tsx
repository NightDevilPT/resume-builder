import React, { useState, useCallback } from "react";

interface DragComponentProps {
	children: React.ReactNode;
	className?: string;
}

export const DragComponent: React.FC<DragComponentProps> = ({
	children,
	className = "",
}) => {
	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			// Don't start dragging if clicking on zoom controls or buttons
			if (
				(e.target as HTMLElement).closest(
					'.zoom-controls, button, [role="button"]'
				)
			) {
				return;
			}
			setIsDragging(true);
			setLastPosition({
				x: e.clientX - position.x,
				y: e.clientY - position.y,
			});
		},
		[position.x, position.y]
	);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging) return;

			const newPosition = {
				x: e.clientX - lastPosition.x,
				y: e.clientY - lastPosition.y,
			};

			setPosition(newPosition);
		},
		[isDragging, lastPosition]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	React.useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, handleMouseMove, handleMouseUp]);

	return (
		<div
			className={`drag-component ${className}`}
			style={{
				cursor: isDragging ? "grabbing" : "grab",
				transform: `translate(${position.x}px, ${position.y}px)`,
				transition: isDragging ? "none" : "transform 0.2s ease-out",
				position: "relative",
				userSelect: "none",
			}}
			onMouseDown={handleMouseDown}
		>
			{children}
		</div>
	);
};

export default DragComponent;
