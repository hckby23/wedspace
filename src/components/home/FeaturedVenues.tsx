"use client";

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FEATURED_VENUES } from '@/data/venues';

const FeaturedVenues: React.FC = () => {
  // Use the first 4 venues from our data
  const displayVenues = FEATURED_VENUES.slice(0, 4);

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="mb-10 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
            Discover Dream <span className="text-wed">Venues</span> in Delhi NCR
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked selection of stunning venues in Delhi, Noida, and Greater Noida
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayVenues.map((venue) => (
            <Link href={`/venues/${venue.id}`} key={venue.id}>
              <Card className="overflow-hidden card-hover h-full">
                <div className="relative h-48">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-playfair font-semibold text-lg">{venue.name}</h3>
                    <div className="flex items-center bg-yellow-50 text-yellow-700 text-sm px-2 py-1 rounded">
                      ★ {venue.rating}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{venue.location}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {venue.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 px-4 pb-4">
                  <p className="text-space font-medium">{venue.priceRange}</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/venues">
            <Button variant="outline" className="border-wed text-wed hover:bg-wed/5">
              View All Venues in Delhi NCR
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedVenues;
