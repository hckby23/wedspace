
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSearch from '@/components/home/HeroSearch';
import FeaturedVenues from '@/components/home/FeaturedVenues';
import FeaturedVendors from '@/components/home/FeaturedVendors';
import HowItWorks from '@/components/home/HowItWorks';
import PlanningTools from '@/components/home/PlanningTools';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 bg-gradient-to-r from-wed/10 to-space/10">
        <div className="container mx-auto text-center">
          <h1 className="font-playfair font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
            Have Your <span className="text-wed">Dream</span> Wedding
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Discover stunning locations, top vendors, and all the tools you need to plan your dream wedding.
          </p>
          
          <div>
            <HeroSearch />
          </div>
          
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto text-center">
            <div className="card-hover-effect">
              <p className="font-playfair font-bold text-2xl md:text-3xl text-wed">5,000+</p>
              <p className="text-gray-600">Venues</p>
            </div>
            <div className="card-hover-effect">
              <p className="font-playfair font-bold text-2xl md:text-3xl text-space">10,000+</p>
              <p className="text-gray-600">Vendors</p>
            </div>
            <div className="card-hover-effect">
              <p className="font-playfair font-bold text-2xl md:text-3xl text-wed">50,000+</p>
              <p className="text-gray-600">Happy Couples</p>
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
      
      <Footer />
    </div>
  );
};

export default Index;
