"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}

/**
 * Unified container component with consistent width and padding
 */
export default function PageContainer({
  children,
  className,
  size = "default"
}: PageContainerProps) {
  const maxWidthClass = {
    narrow: "max-w-5xl",
    default: "max-w-7xl",
    wide: "max-w-[1400px]"
  }[size];

  return (
    <div className={cn(maxWidthClass, "mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
