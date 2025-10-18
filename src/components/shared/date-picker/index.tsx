"use client";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	placeholder?: string;
	disableFutureDates?: boolean;
	disableBefore?: Date;
	className?: string;
}

/**
 * Professional DatePicker Component
 * Features:
 * - Year and month dropdown selection
 * - Date restriction options
 * - Formatted date display
 * - Accessible and keyboard navigable
 */
export const DatePicker = ({
	value,
	onChange,
	disabled = false,
	placeholder = "Select date",
	disableFutureDates = false,
	disableBefore,
	className,
}: DatePickerProps) => {
	const [open, setOpen] = useState(false);

	/**
	 * Formats Date object to YYYY-MM-DD string format
	 */
	const formatDateForInput = (date: Date | undefined): string => {
		if (!date) return "";
		return date.toISOString().split("T")[0];
	};

	/**
	 * Parses YYYY-MM-DD string to Date object
	 */
	const parseDateFromInput = (dateString: string): Date | undefined => {
		if (!dateString) return undefined;
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? undefined : date;
	};

	/**
	 * Formats date for display in a user-friendly format
	 */
	const formattedDisplayDate = useMemo(() => {
		if (!value) return placeholder;
		const date = parseDateFromInput(value);
		if (!date) return placeholder;

		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);
	}, [value, placeholder]);

	/**
	 * Handles date selection from calendar
	 */
	const handleDateSelect = (date: Date | undefined) => {
		if (date) {
			const formattedDate = formatDateForInput(date);
			onChange(formattedDate);
			setOpen(false);
		}
	};

	/**
	 * Determines which dates should be disabled based on props
	 */
	const isDateDisabled = (date: Date): boolean => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Disable future dates if required
		if (disableFutureDates && date > today) {
			return true;
		}

		// Disable dates before the specified date
		if (disableBefore) {
			const disableBeforeDate = new Date(disableBefore);
			disableBeforeDate.setHours(0, 0, 0, 0);
			return date < disableBeforeDate;
		}

		return false;
	};

	/**
	 * Calculate year range for dropdown
	 */
	const currentYear = new Date().getFullYear();
	const fromYear = 1950;
	const toYear = disableFutureDates ? currentYear : currentYear + 10;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					disabled={disabled}
					className={cn(
						"w-full justify-between font-normal text-left",
						!value && "text-muted-foreground",
						className
					)}
					aria-label={
						value
							? `Selected date: ${formattedDisplayDate}`
							: placeholder
					}
				>
					<span className="truncate">{formattedDisplayDate}</span>
					<CalendarIcon className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={parseDateFromInput(value)}
					onSelect={handleDateSelect}
					disabled={isDateDisabled}
					initialFocus
					captionLayout="dropdown"
					fromYear={fromYear}
					toYear={toYear}
					className="rounded-md border shadow-sm"
				/>
			</PopoverContent>
		</Popover>
	);
};
