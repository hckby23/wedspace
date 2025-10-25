"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string;
  rating: number;
  startingPrice: string;
}

const FEATURED_VENDORS: Vendor[] = [
  {
    id: '1',
    name: 'Elegant Blooms',
    category: 'Florist',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200',
    rating: 4.9,
    startingPrice: 'From $800'
  },
  {
    id: '2',
    name: 'Moments Captured',
    category: 'Photography',
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1552334978-5f1649aef15d',
    rating: 4.8,
    startingPrice: 'From $2,500'
  },
  {
    id: '3',
    name: 'Divine Catering',
    category: 'Catering',
    location: 'Seattle, WA',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033',
    rating: 4.7,
    startingPrice: 'From $45/person'
  },
  {
    id: '4',
    name: 'Melody Makers',
    category: 'Music & DJs',
    location: 'Chicago, IL',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    rating: 4.8,
    startingPrice: 'From $1,200'
  }
];

const FeaturedVendors: React.FC = () => {
  return (
    <div className="py-16 bg-gradient-wedding">
      <div className="container-custom">
        <div className="mb-10 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
            Top Wedding <span className="text-space">Vendors</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet our trusted network of talented wedding professionals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_VENDORS.map((vendor) => (
            <Link href={`/vendors/${vendor.id}`} key={vendor.id}>
              <Card className="overflow-hidden card-hover h-full">
                <div className="relative h-48">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-space/90 hover:bg-space">
                    {vendor.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-playfair font-semibold text-lg">{vendor.name}</h3>
                    <div className="flex items-center bg-yellow-50 text-yellow-700 text-sm px-2 py-1 rounded">
                      ★ {vendor.rating}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">{vendor.location}</p>
                  <p className="text-wed font-medium mt-3">{vendor.startingPrice}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/vendors">
            <Button variant="outline" className="border-space text-space hover:bg-space/5">
              View All Vendors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedVendors;
