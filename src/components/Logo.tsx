import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', animated = false, onClick, style }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <Link 
      href="/"
      onClick={onClick}
      style={style}
      className={cn(
        `font-playfair font-bold ${sizeClasses[size]} transition-all duration-300`,
        animated && "hover:scale-105",
        className
      )}
    >
      <span className="text-red-600">wed</span>
      <span className={cn(
        "text-amber-500 relative",
        animated && "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-red-600 after:to-amber-500 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
      )}>space</span>
    </Link>
  );
};

export default Logo;
