
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VendorProps {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string;
  rating: number;
  startingPrice: string;
  description?: string;
  tags: string[];
}

interface VendorCardProps {
  vendor: VendorProps;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link to={`/vendors/${vendor.id}`}>
      <Card 
        className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-48">
          <img
            src={vendor.image}
            alt={vendor.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isHovered && "scale-110"
            )}
          />
          <Badge className="absolute top-3 left-3 bg-space/90 hover:bg-space">
            {vendor.category}
          </Badge>
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
          >
            <Heart 
              size={18} 
              className={cn(
                "transition-colors duration-200",
                isFavorite ? "fill-wed text-wed" : "text-gray-600"
              )} 
            />
          </button>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-playfair font-semibold text-lg">{vendor.name}</h3>
            <div className="flex items-center bg-yellow-50 text-yellow-700 text-sm px-2 py-1 rounded">
              <Star size={16} className="mr-1 fill-yellow-500" />
              <span>{vendor.rating}</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-3">{vendor.location}</p>
          {vendor.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{vendor.description}</p>
          )}
          <div className="flex flex-wrap gap-1 mb-4">
            {vendor.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
          <p className="text-space font-medium">{vendor.startingPrice}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VendorCard;
