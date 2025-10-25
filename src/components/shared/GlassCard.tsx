import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function GlassCard({ 
  children, 
  className = '',
  hover = true,
  glow = false
}: GlassCardProps) {
  return (
    <Card 
      className={cn(
        "backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-border relative overflow-hidden",
        hover && "hover:shadow-2xl transition-all duration-500 hover:scale-105",
        className
      )}
    >
      {/* Animated gradient orb */}
      {glow && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
      )}
      
      <CardContent className="relative z-10 p-6">
        {children}
      </CardContent>
    </Card>
  );
}
