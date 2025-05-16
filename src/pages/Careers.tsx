
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Careers: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-space/10 to-wed/10 py-8">
          <div className="container-custom">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">Careers</h1>
            <p className="text-gray-600 max-w-2xl mb-6">
              Join our team and help couples create their perfect wedding day.
            </p>
            <Button 
              className="bg-[#F59E0B] text-gray-800 hover:bg-[#F59E0B]/90 border border-[#F59E0B]"
            >
              View Open Positions
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
