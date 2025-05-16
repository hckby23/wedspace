
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export interface VenueProps {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  priceRange: string;
  capacity?: string;
  tags: string[];
}

interface VenueCardProps {
  venue: VenueProps;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  return (
    <Link to={`/venues/${venue.id}`}>
      <Card className="overflow-hidden h-full card-hover">
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
          {venue.capacity && (
            <p className="text-gray-600 text-sm mb-3">Capacity: {venue.capacity}</p>
          )}
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
  );
};

export default VenueCard;
