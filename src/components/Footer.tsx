
import { Instagram, Facebook } from 'lucide-react';
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-rose-600 via-pink-600 to-amber-600 py-16 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Logo with enhanced visibility */}
        <div className="flex items-center justify-center mb-6 bg-white/10 backdrop-blur-sm rounded-2xl py-4 px-6 inline-flex">
          <Logo className="text-white drop-shadow-lg" size="lg" />
        </div>

        {/* Tagline */}
        <p className="font-inter text-base sm:text-lg text-white/90 mb-8 font-medium">
          Crafting your dream wedding experience
        </p>

        {/* Social Icons */}
        <div className="flex justify-center space-x-4 mb-8">
          <Link to="/contact">
          <div className="group w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer transform hover:scale-110 shadow-lg">
            <Instagram className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </Link>
          <Link to="/contact">
          <div className="group w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer transform hover:scale-110 shadow-lg">
            <Facebook className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </Link>
        </div>

        {/* Copyright */}
        <p className="font-inter text-xs sm:text-sm text-white/80">
          © 2025 WedSpace. All rights reserved. Crafting magical wedding experiences.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
