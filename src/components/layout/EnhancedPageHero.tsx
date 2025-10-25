import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import PageContainer from './PageContainer';

interface EnhancedPageHeroProps {
  badge?: {
    icon?: LucideIcon;
    text: string;
  };
  title: string;
  titleGradient?: string;
  description: string;
  pattern?: boolean;
  gradientOrbs?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function EnhancedPageHero({
  badge,
  title,
  titleGradient,
  description,
  pattern = true,
  gradientOrbs = true,
  children,
  className = ''
}: EnhancedPageHeroProps) {
  const BadgeIcon = badge?.icon;

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 dark:from-rose-950/20 dark:via-amber-950/20 dark:to-orange-950/20" />
        
        {/* Pattern Overlay */}
        {pattern && (
          <div className="absolute inset-0 opacity-30 dark:opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }} />
        )}
        
        {/* Gradient Orbs */}
        {gradientOrbs && (
          <>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
          </>
        )}
      </div>
      
      <PageContainer className="relative z-10 py-16 sm:py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          {badge && (
            <div className="animate-fade-in mb-6">
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0 px-4 py-2 text-sm shadow-lg">
                {BadgeIcon && <BadgeIcon className="w-4 h-4 mr-2" />}
                {badge.text}
              </Badge>
            </div>
          )}
          
          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
            {title}
            {titleGradient && (
              <span className="block bg-gradient-to-r from-primary via-rose-500 to-secondary bg-clip-text text-transparent mt-2">
                {titleGradient}
              </span>
            )}
          </h1>
          
          {/* Description */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in">
            {description}
          </p>
          
          {/* Children (CTAs, Search, etc.) */}
          {children && (
            <div className="animate-fade-in">
              {children}
            </div>
          )}
        </div>
      </PageContainer>
    </section>
  );
}
