"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface StatItem {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  change?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * Unified stats grid component for dashboards and overview pages
 */
export default function StatsGrid({ stats, columns = 4, className }: StatsGridProps) {
  const gridColsClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "lg:grid-cols-4"
  }[columns];

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2", gridColsClass, "gap-4 sm:gap-6", className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <p className={cn(
                      "text-xs mt-2 font-medium",
                      stat.trend === "up" && "text-green-600 dark:text-green-400",
                      stat.trend === "down" && "text-red-600 dark:text-red-400",
                      stat.trend === "neutral" && "text-muted-foreground"
                    )}>
                      {stat.change}
                    </p>
                  )}
                  {stat.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  )}
                </div>
                {Icon && (
                  <div className="ml-4 p-3 rounded-full bg-primary/10 dark:bg-primary/20">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
