import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: {
    value: string;
    positive: boolean;
  };
  gradient?: boolean;
  className?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  gradient = true,
  className = ''
}: StatCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden group hover:shadow-xl transition-all duration-300",
      gradient && "bg-gradient-to-br from-background to-muted/20",
      className
    )}>
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:w-32 group-hover:h-32 transition-all duration-500" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 text-primary group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6" />
          </div>
          {change !== undefined && (
            <div className={cn(
              "text-sm font-semibold",
              change.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {change.positive ? '+' : ''}{change.value}
            </div>
          )}
        </div>
        
        <div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {value}
          </div>
          <div className="text-sm text-muted-foreground">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
