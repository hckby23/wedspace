
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTA: React.FC = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-wed/10 to-space/10">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            Start Planning Your Dream Wedding Today
          </h2>
          <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of couples who have found their perfect venues, vendors, and planning tools on <span className="text-wed font-medium">wed</span><span className="text-space font-medium">space</span>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="btn-primary" size="lg" asChild>
              <Link to="/signup">Create Free Account</Link>
            </Button>
            <Button variant="outline" className="border-wed text-wed hover:bg-wed/5" size="lg" asChild>
              <Link to="/venues">Browse Venues</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
