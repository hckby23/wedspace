
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const WeddingIdeas: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-space/10 to-wed/10 py-8">
          <div className="container-custom">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">Wedding Ideas</h1>
            <p className="text-gray-600 max-w-2xl mb-6">
              Discover trending themes, decor ideas, and inspiration for your special day.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WeddingIdeas;
