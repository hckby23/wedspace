
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="container-custom text-center">
          <h1 className="font-playfair font-bold text-9xl mb-4 text-wed">404</h1>
          <h2 className="font-playfair text-3xl mb-6">Page Not Found</h2>
          <p className="text-gray-600 max-w-lg mx-auto mb-8">
            Oops! Looks like you've ventured off the aisle. The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button className="bg-wed hover:bg-wed/90">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
