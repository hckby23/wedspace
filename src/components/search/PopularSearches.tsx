"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PopularSearches: React.FC = () => {
  const router = useRouter();

  const popularCategories = [
    { name: 'Garden Venues', query: 'garden wedding venue', count: 2453 },
    { name: 'Beach Weddings', query: 'beach wedding venue', count: 1876 },
    { name: 'Rustic Barns', query: 'rustic barn wedding', count: 1542 },
    { name: 'City Views', query: 'city view wedding venue', count: 1321 },
    { name: 'Historic Mansions', query: 'historic mansion wedding', count: 1134 },
    { name: 'Modern Industrial', query: 'modern industrial wedding', count: 987 },
    { name: 'Mountain Retreats', query: 'mountain wedding venue', count: 854 },
    { name: 'Vineyards', query: 'vineyard wedding venue', count: 798 },
  ];

  const popularLocations = [
    { name: 'Los Angeles, CA', query: 'Los Angeles wedding', count: 3421 },
    { name: 'New York, NY', query: 'New York wedding', count: 3156 },
    { name: 'Miami, FL', query: 'Miami wedding', count: 2187 },
    { name: 'Chicago, IL', query: 'Chicago wedding', count: 1976 },
    { name: 'San Francisco, CA', query: 'San Francisco wedding', count: 1854 },
    { name: 'Austin, TX', query: 'Austin wedding', count: 1543 },
    { name: 'Seattle, WA', query: 'Seattle wedding', count: 1342 },
    { name: 'Denver, CO', query: 'Denver wedding', count: 1245 },
  ];

  const handleSearch = (query: string) => {
    // In a real app, this would use the search API
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Search className="text-wed" />
        <h2 className="font-playfair text-2xl font-semibold">Popular Searches</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Popular Categories */}
        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
          <h3 className="font-playfair text-xl font-medium mb-4">Popular Categories</h3>
          
          <div className="flex flex-wrap gap-2">
            {popularCategories.map((category, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm"
                className="rounded-full border-gray-200 hover:bg-wed/5 hover:text-wed hover:border-wed transition-colors"
                onClick={() => handleSearch(category.query)}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 bg-gray-100 hover:bg-gray-100">
                  {category.count.toLocaleString()}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Popular Locations */}
        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
          <h3 className="font-playfair text-xl font-medium mb-4">Popular Locations</h3>
          
          <div className="flex flex-wrap gap-2">
            {popularLocations.map((location, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm"
                className="rounded-full border-gray-200 hover:bg-space/5 hover:text-space hover:border-space transition-colors"
                onClick={() => handleSearch(location.query)}
              >
                {location.name}
                <Badge variant="secondary" className="ml-2 bg-gray-100 hover:bg-gray-100">
                  {location.count.toLocaleString()}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Featured Searches */}
      <div className="mt-8 p-6 bg-gradient-to-r from-wed/10 to-space/10 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-space" />
          <h3 className="font-playfair text-xl font-medium">Trending Searches This Month</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleSearch("affordable wedding venues under 5000")}>
            <p className="font-medium">Affordable venues under $5,000</p>
            <p className="text-sm text-gray-500">Budget-friendly options for your special day</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleSearch("all-inclusive wedding packages")}>
            <p className="font-medium">All-inclusive wedding packages</p>
            <p className="text-sm text-gray-500">Complete wedding planning solutions</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleSearch("micro wedding venues intimate ceremony")}>
            <p className="font-medium">Micro wedding venues</p>
            <p className="text-sm text-gray-500">Perfect spaces for intimate ceremonies</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularSearches;
