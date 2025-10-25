"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PageHeroProps {
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
  minimal?: boolean; // For simple hero sections
}

/**
 * Unified hero section component for all pages
 * Ensures consistent styling and dark mode support
 */
export default function PageHero({
  title,
  description,
  badge,
  actions,
  className,
  minimal = false
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border",
        minimal ? "py-12" : "py-16 sm:py-20",
        className
      )}
    >
      {/* Gradient Background - Subtle in both modes */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn("text-center", minimal ? "max-w-3xl mx-auto" : "max-w-4xl mx-auto")}>
          {badge && (
            <Badge variant="outline" className="mb-4">
              {badge}
            </Badge>
          )}
          
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            {title}
          </h1>
          
          {description && (
            <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">
              {description}
            </p>
          )}
          
          {actions && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              {actions}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
