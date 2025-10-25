"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { Menu, X, ChevronDown, Heart } from 'lucide-react';
import { NAV_LINKS } from '@/data/navigation';
import { ModeToggle } from './ui/mode-toggle';
import { cn } from '@/lib/utils';

/**
 * Navbar Component
 * 
 * Main navigation component for WedSpace with responsive design,
 * dropdown menus, and dark mode toggle integration.
 */
const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      setDropdownOpen(null);
    }
  };

  const toggleDropdown = (key: string) => {
    setDropdownOpen(dropdownOpen === key ? null : key);
  };

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full",
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "border-b border-border shadow-sm transition-all duration-200"
    )}>
      <div className="w-full px-0 py-3">
        <div className="flex items-center justify-between max-w-none">
          {/* Logo - Bigger, up and right */}
          <div className="flex-shrink-0 pl-8 pr-2 sm:pl-10 sm:pr-4">
            <div className="transform scale-150 origin-left -translate-y-1">
              <Logo style={{ cursor: 'pointer' }} />
            </div>
          </div>
          
          {/* Desktop Navigation - Moved slightly left */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 absolute left-1/2 transform -translate-x-1/2 -ml-8">
            {NAV_LINKS.map((link, index) => (
              <div key={index} className="relative group">
                {link.children ? (
                  <div className="flex items-center cursor-pointer group"
                    onClick={() => toggleDropdown(`desktop-${link.label}`)}>
                    <span className="text-gray-800 dark:text-gray-200 font-medium text-[15px] hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 group-hover:scale-105">
                      {link.label}
                    </span>
                    <ChevronDown size={16} className="ml-1 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-all duration-300" />
                  </div>
                ) : (
                  <Link 
                    href={link.href} 
                    className={`text-gray-800 dark:text-gray-200 font-medium text-[15px] hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 flex items-center group hover:scale-105 relative`}
                  >
                    {link.label === 'Favorites' && <Heart size={16} className="mr-2 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300" />}
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-amber-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                
                {link.children && dropdownOpen === `desktop-${link.label}` && (
                  <div className="absolute top-full left-0 mt-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-10 min-w-[180px] backdrop-blur-sm">
                    {link.children.map((childLink, childIndex) => (
                      <Link 
                        key={childIndex} 
                        href={childLink.href} 
                        className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-all duration-200 font-medium"
                        onClick={() => setDropdownOpen(null)}
                      >
                        {childLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Right-aligned controls - Compact layout */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0 pr-4 sm:pr-6">
            <div className="p-0.5 rounded-full border border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 transition-colors duration-200">
              <ModeToggle />
            </div>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-900 font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm px-4"
              asChild
            >
              <Link href="/auth/login">Log In</Link>
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm px-4" 
              asChild
            >
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2 flex-shrink-0 pr-4">
            <ModeToggle />
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 hover:scale-105 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation - Enhanced styling */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((link, index) => (
                <div key={index} className="py-1">
                  {link.children ? (
                    <>
                      <div 
                        className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                        onClick={() => toggleDropdown(`mobile-${link.label}`)}
                      >
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{link.label}</span>
                        <ChevronDown size={16} className={`text-gray-600 dark:text-gray-400 transition-all duration-300 ${dropdownOpen === `mobile-${link.label}` ? 'transform rotate-180 text-red-600 dark:text-red-400' : ''}`} />
                      </div>
                      
                      {dropdownOpen === `mobile-${link.label}` && (
                        <div className="mt-2 ml-4 pl-4 border-l-2 border-red-200 dark:border-red-800 space-y-1">
                          {link.children.map((childLink, childIndex) => (
                            <Link 
                              key={childIndex} 
                              href={childLink.href} 
                              className="block py-2 px-3 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200 font-medium"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {childLink.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link 
                      href={link.href} 
                      className="flex items-center p-3 text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label === 'Favorites' && <Heart size={16} className="mr-2 text-gray-600 dark:text-gray-400" />}
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-6 flex flex-col space-y-3 border-t border-gray-200 dark:border-gray-700 mt-4">
                <Button 
                  variant="ghost" 
                  className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium w-full justify-center transition-all duration-300" 
                  asChild
                >
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                </Button>
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium w-full justify-center shadow-lg transition-all duration-300" asChild>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
