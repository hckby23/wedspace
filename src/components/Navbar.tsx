
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { Menu, X, ChevronDown, Heart } from 'lucide-react';
import { NAV_LINKS } from '@/data/navigation';

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
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link, index) => (
              <div key={index} className="relative group">
                {link.children ? (
                  <div className="flex items-center cursor-pointer"
                    onClick={() => toggleDropdown(`desktop-${link.label}`)}>
                    <span className="text-gray-700 hover:text-wed transition-colors">
                      {link.label}
                    </span>
                    <ChevronDown size={16} className="ml-1" />
                  </div>
                ) : (
                  <Link 
                    to={link.href} 
                    className={`text-gray-700 hover:text-wed transition-colors flex items-center`}
                  >
                    {link.label === 'Favorites' && <Heart size={16} className="mr-1 text-gray-700" />}
                    {link.label}
                  </Link>
                )}
                
                {link.children && dropdownOpen === `desktop-${link.label}` && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-lg p-2 z-10 min-w-[160px]">
                    {link.children.map((childLink, childIndex) => (
                      <Link 
                        key={childIndex} 
                        to={childLink.href} 
                        className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
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
          
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline"
              className="bg-[#F59E0B] text-gray-800 hover:bg-[#F59E0B]/90 border-[#F59E0B]"
              asChild
            >
              <Link to="/login">Log In</Link>
            </Button>
            <Button className="bg-wed hover:bg-wed/90" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-wed"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {NAV_LINKS.map((link, index) => (
                <div key={index} className="py-2">
                  {link.children ? (
                    <>
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleDropdown(`mobile-${link.label}`)}
                      >
                        <span className="text-gray-700">{link.label}</span>
                        <ChevronDown size={16} className={`transition-transform ${dropdownOpen === `mobile-${link.label}` ? 'transform rotate-180' : ''}`} />
                      </div>
                      
                      {dropdownOpen === `mobile-${link.label}` && (
                        <div className="mt-2 pl-4 border-l-2 border-gray-200 space-y-2 animate-fade-in">
                          {link.children.map((childLink, childIndex) => (
                            <Link 
                              key={childIndex} 
                              to={childLink.href} 
                              className="block py-2 text-gray-600 hover:text-wed"
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
                      to={link.href} 
                      className="block text-gray-700 hover:text-wed flex items-center" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label === 'Favorites' && <Heart size={16} className="mr-1 text-gray-700" />}
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 flex flex-col space-y-3">
                <Button asChild className="bg-[#F59E0B] text-gray-800 hover:bg-[#F59E0B]/90 border-[#F59E0B] w-full justify-center">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                </Button>
                <Button className="bg-wed hover:bg-wed/90 w-full justify-center" asChild>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
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
