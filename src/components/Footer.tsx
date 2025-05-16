
import React from 'react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Discover',
      links: [
        { name: 'Venues', path: '/venues' },
        { name: 'Vendors', path: '/vendors' },
        { name: 'Real Weddings', path: '/real-weddings' },
        { name: 'Wedding Ideas', path: '/ideas' },
      ],
    },
    {
      title: 'For Venues',
      links: [
        { name: 'Join as Venue', path: '/venue/signup' },
        { name: 'Venue Login', path: '/venue/login' },
        { name: 'Success Stories', path: '/venue/success-stories' },
        { name: 'Advertise', path: '/venue/advertise' },
      ],
    },
    {
      title: 'For Vendors',
      links: [
        { name: 'Join as Vendor', path: '/vendor/signup' },
        { name: 'Vendor Login', path: '/vendor/login' },
        { name: 'Success Stories', path: '/vendor/success-stories' },
        { name: 'Advertise', path: '/vendor/advertise' },
      ],
    },
    {
      title: 'Planning Tools',
      links: [
        { name: 'Checklist', path: '/tools/checklist' },
        { name: 'Budget Tracker', path: '/tools/budget' },
        { name: 'Guest List', path: '/tools/guests' },
        { name: 'Timeline', path: '/tools/timeline' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Careers', path: '/careers' },
        { name: 'Press', path: '/press' },
      ],
    },
  ];

  return (
    <footer className="bg-[#0A1128] text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-8">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="font-playfair font-bold text-2xl">
                <span className="text-wed">wed</span>
                <span className="text-space">space</span>
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              Your perfect wedding planning platform for venues, vendors, and tools.
            </p>
          </div>
          
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-playfair font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} <span className="text-wed">wed</span><span className="text-space">space</span>. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-gray-400 text-sm hover:text-white">Terms</Link>
            <Link to="/privacy" className="text-gray-400 text-sm hover:text-white">Privacy</Link>
            <Link to="/cookies" className="text-gray-400 text-sm hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
