
"use client";

import React from 'react';
import Logo from './Logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

/**
 * Footer Component
 * 
 * Main footer component for WedSpace with responsive design,
 * navigation links, and dark mode compatibility.
 */
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
      title: 'Business Dashboards',
      links: [
        { name: 'Venue Dashboard', path: '/venue/dashboard' },
        { name: 'Vendor Dashboard', path: '/vendor/dashboard' },
        { name: 'Admin Dashboard', path: '/admin/dashboard' },
        { name: 'Analytics', path: '/analytics' },
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
    <footer className={cn(
      "pt-12 pb-6 border-t",
      "bg-muted/40 dark:bg-muted/20 text-foreground",
      "transition-colors duration-300"
    )}>
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-8">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-muted-foreground mb-6">
              Your perfect wedding planning platform for venues, vendors, and tools.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-medium text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.path} 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {currentYear} <span className="text-primary font-medium">wed</span><span className="text-secondary font-medium">space</span>. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-muted-foreground text-sm hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="text-muted-foreground text-sm hover:text-primary transition-colors">Privacy</Link>
            <Link href="/cookies" className="text-muted-foreground text-sm hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
