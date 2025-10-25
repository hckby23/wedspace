import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  badge?: {
    icon?: LucideIcon;
    text: string;
    variant?: 'default' | 'outline' | 'gradient';
  };
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeader({
  badge,
  title,
  description,
  align = 'center',
  className = ''
}: SectionHeaderProps) {
  const BadgeIcon = badge?.icon;
  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`${alignClass} mb-12 ${className}`}>
      {badge && (
        <div className={`mb-4 ${align === 'center' ? 'flex justify-center' : ''}`}>
          <Badge 
            variant={badge.variant === 'outline' ? 'outline' : 'default'}
            className={badge.variant === 'gradient' ? 'bg-gradient-to-r from-primary to-secondary text-white border-0' : ''}
          >
            {BadgeIcon && <BadgeIcon className="w-3 h-3 mr-1" />}
            {badge.text}
          </Badge>
        </div>
      )}
      
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
        {title}
      </h2>
      
      {description && (
        <p className={`text-muted-foreground text-lg max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
}
