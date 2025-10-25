// @ts-nocheck

import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSearch from '@/components/home/HeroSearch';
import FeaturedVenues from '@/components/home/FeaturedVenues';
import FeaturedVendors from '@/components/home/FeaturedVendors';
import HowItWorks from '@/components/home/HowItWorks';
import PlanningTools from '@/components/home/PlanningTools';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';

/**
 * Index/Home Page
 * 
 * Main landing page for WedSpace with hero search, featured venues/vendors,
 * and other key sections using the Layout component for consistent theming.
 */
const Index: React.FC = () => {
  return (
    <Layout className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 bg-gradient-to-r from-primary/10 to-secondary/10 transition-colors duration-300">
        <div className="container mx-auto text-center">
          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
            Have Your <span className="text-primary">Dream</span> Wedding
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Discover stunning locations, top vendors, and all the tools you need to plan your dream wedding.
          </p>
          
          <div>
            <HeroSearch />
          </div>
          
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto text-center">
            <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md p-4 rounded-lg">
              <p className="font-bold text-2xl md:text-3xl text-primary">5,000+</p>
              <p className="text-muted-foreground">Venues</p>
            </div>
            <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md p-4 rounded-lg">
              <p className="font-bold text-2xl md:text-3xl text-secondary">10,000+</p>
              <p className="text-muted-foreground">Vendors</p>
            </div>
            <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md p-4 rounded-lg">
              <p className="font-bold text-2xl md:text-3xl text-primary">50,000+</p>
              <p className="text-muted-foreground">Happy Couples</p>
            </div>
          </div>
        </div>
      </section>
      
      <FeaturedVenues />
      <HowItWorks />
      <FeaturedVendors />
      <PlanningTools />
      <Testimonials />
      <CTA />
    </Layout>
  );
};

export default Index;
