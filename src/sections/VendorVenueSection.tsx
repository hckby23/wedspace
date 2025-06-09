import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; // Added Link import
import { Briefcase, Building2 } from 'lucide-react';
import Logo from '@/components/Logo';

const VendorVenueSection: React.FC = () => {

  

  

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">
            Partner With <Logo as="span" className="text-3xl md:text-4xl" /> & Grow Your Business
          </h2>
          <p className="text-text-secondary md:text-lg max-w-3xl mx-auto">
            Showcase your services to thousands of couples planning their dream Indian wedding. Join our network of trusted vendors and premium venues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Vendor Card */}
          <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full mb-6">
              <Briefcase className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-display font-semibold text-text-primary mb-3">
              Wedding Professionals
            </h3>
            <p className="text-text-secondary mb-6 flex-grow">
              Are you a photographer, decorator, caterer, makeup artist, or other wedding service provider? Reach your target audience effectively.
            </p>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/contact">
              Enquire About Vendor Partnership
              </Link>
            </Button>
          </div>

          {/* Venue Card */}
          <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
            <div className="bg-secondary/10 p-4 rounded-full mb-6">
              <Building2 className="h-10 w-10 text-secondary" />
            </div>
            <h3 className="text-2xl font-display font-semibold text-text-primary mb-3">
              Venue Owners
            </h3>
            <p className="text-text-secondary mb-6 flex-grow">
              Own a beautiful banquet hall, resort, garden, or unique wedding space? List your venue and connect with couples looking for the perfect setting.
            </p>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link to="/contact">
              List Your Venue With Us
              </Link>
            </Button>
          </div>
        </div>

        <div className="text-center mt-12 md:mt-16">
          <p className="text-text-secondary md:text-lg">
            For partnerships or to list your venue, please{' '}
            <Link to="/contact" className="text-primary hover:underline">
              contact us here
            </Link>.
          </p>
        </div>
        
        <p className="text-center text-text-secondary mt-8">
          Our dedicated partner portal is launching soon! Register your interest now to be among the first to join.
        </p>
      </div>
    </section>
  );
};

export default VendorVenueSection;
