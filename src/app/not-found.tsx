import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center px-4">
        <h1 className="font-playfair font-bold text-9xl mb-4 text-red-600 dark:text-red-400">404</h1>
        <h2 className="font-playfair text-3xl mb-6 text-gray-900 dark:text-white">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-8">
          Oops! Looks like you've ventured off the aisle. The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
