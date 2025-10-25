import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { cn } from '@/lib/utils';

/**
 * Main Layout Component for WedSpace
 * 
 * This component provides the consistent layout structure for all pages,
 * including the Navbar and Footer with theme support.
 */
interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  hideNavbar = false,
  hideFooter = false,
}) => {
  return (
    <div className={cn(
      "flex min-h-screen flex-col bg-background text-foreground antialiased transition-colors duration-300",
      className
    )}>
      {!hideNavbar && <Navbar />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
