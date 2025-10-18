// components/ui/custom-breadcrumb.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  id: string;
  label: string;
  onClick?: () => void;
  href?: string;
  isCurrent?: boolean;
  disabled?: boolean;
}

interface CustomBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  maxVisible?: number; // Maximum items to show before adding ellipsis
}

export function CustomBreadcrumb({ 
  items, 
  className,
  separator,
  maxVisible = 3
}: CustomBreadcrumbProps) {
  const validItems = items.filter(item => !item.disabled);
  
  // Function to get visible items with ellipsis logic
  const getVisibleItems = () => {
    if (validItems.length <= maxVisible) {
      return validItems;
    }

    const currentIndex = validItems.findIndex(item => item.isCurrent);
    const totalItems = validItems.length;
    
    // Always show first item, current item, and last item
    const visibleItems = [validItems[0]]; // First item
    
    // Add ellipsis if needed before current item
    if (currentIndex > 1) {
      visibleItems.push({
        id: "ellipsis-before",
        label: "...",
        disabled: true
      });
    }
    
    // Add current item and one before if possible
    if (currentIndex > 0 && currentIndex !== 1) {
      visibleItems.push(validItems[currentIndex - 1]);
    }
    visibleItems.push(validItems[currentIndex]); // Current item
    
    // Add ellipsis if needed after current item
    if (currentIndex < totalItems - 2) {
      visibleItems.push({
        id: "ellipsis-after",
        label: "...",
        disabled: true
      });
    }
    
    // Add last item if not already included
    if (currentIndex < totalItems - 1) {
      visibleItems.push(validItems[totalItems - 1]);
    }
    
    return visibleItems;
  };

  const visibleItems = getVisibleItems();

  return (
    <Breadcrumb className={cn("mb-6", className)}>
      <BreadcrumbList>
        {visibleItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <BreadcrumbItem>
              {item.isCurrent ? (
                <span className="font-medium text-foreground">
                  {item.label}
                </span>
              ) : item.onClick && !item.disabled ? (
                <button
                  onClick={item.onClick}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                  disabled={item.disabled}
                >
                  {item.label}
                </button>
              ) : item.href && !item.disabled ? (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn(
                  "text-muted-foreground",
                  item.disabled && "cursor-default"
                )}>
                  {item.label}
                </span>
              )}
            </BreadcrumbItem>
            {index < visibleItems.length - 1 && (
              <BreadcrumbSeparator>
                {separator || "/"}
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}