
import React from 'react';
import VenueCard from '@/components/venues/VenueCard';
import { TrendingUp } from 'lucide-react';
import { FEATURED_VENUES } from '@/data/venues';

const TrendingVenues: React.FC = () => {
  // In a real app, this would come from an API
  // For now, use the top 4 highest-rated venues
  const trendingVenues = [...FEATURED_VENUES]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)
    .map(venue => {
      // Format capacity based on its type
      let capacityString = '50-500 guests'; // Default
      
      if (typeof venue.capacity === 'object' && venue.capacity !== null) {
        capacityString = `${venue.capacity.min}-${venue.capacity.max} guests`;
      } else if (typeof venue.capacity === 'string') {
        capacityString = venue.capacity;
      }
      
      return {
        id: venue.id,
        name: venue.name,
        location: venue.location,
        image: venue.image,
        rating: venue.rating,
        priceRange: venue.priceRange,
        capacity: capacityString,
        tags: venue.tags,
      };
    });

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-wed" />
        <h2 className="font-playfair text-2xl font-semibold">Trending Venues in Delhi NCR</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </section>
  );
};

export default TrendingVenues;
