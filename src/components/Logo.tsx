import React from 'react';
import { cn } from '@/lib/utils'; // For combining class names

interface LogoProps extends React.HTMLAttributes<HTMLElement> { // Changed to HTMLElement for broader compatibility
  as?: React.ElementType;
  // We can add specific props later if needed, e.g., for different heading levels
}

const Logo: React.FC<LogoProps> = ({ className, as: Component = 'h2', ...props }) => {
  return (
    <Component
      className={cn(
        'font-display font-bold lowercase tracking-tight', // Base styles
        className // Allows overriding/extending styles (e.g., for size)
      )}
      {...props}
    >
      <span className="text-primary">wed</span>
      <span className="text-secondary">space</span>
    </Component>
  );
};

export default Logo;
