import React from 'react';
import Logo from './Logo'; // Assuming Logo.tsx is in the same components directory

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-background border-t border-border/50">
      <div className="container mx-auto px-4 text-center text-sm text-text-secondary">
        <p>
          © {currentYear} <Logo className="text-lg inline-block align-baseline" />. All rights reserved. Crafting your dream wedding experience.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
