"use client";

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, MapPin, Users, Calendar, Star, ArrowRight, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Venue interface
 * Defines the properties for a venue in the WedSpace platform
 */
export interface Venue {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  priceRange: string;
  capacity?: string;
  tags: string[];
  verified?: boolean;
  featured?: boolean;
  availability?: string;
  responseTime?: string;
  bookings?: number;
  availabilityStatus?: 'available' | 'limited' | 'booked';
  isFavorite?: boolean;
}

/**
 * VenueProps interface
 * Defines the properties for a venue in the WedSpace platform
 */
export interface VenueProps {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  priceRange: string;
  capacity?: string;
  tags: string[];
  verified?: boolean;
  featured?: boolean;
  availability?: string;
  responseTime?: string;
  bookings?: number;
  availabilityStatus?: 'available' | 'limited' | 'booked';
  isFavorite?: boolean;
  availableDates?: string[];
}

/**
 * VenueCardProps interface
 * Props for the VenueCard component
 */
interface VenueCardProps {
  venue: VenueProps;
  className?: string;
  onFavoriteToggle?: (id: string) => void;
}

/**
 * VenueCard Component
 * 
 * A card component for displaying venue information with modern UI styling,
 * hover effects, and dark mode compatibility.
 */
const VenueCard: React.FC<VenueCardProps> = ({ venue, className, onFavoriteToggle }) => {
  // Handle favorite toggle without navigating to venue details
  const handleFavoriteClick = (e: React.MouseEvent) => {
    if (onFavoriteToggle) {
      e.preventDefault();
      e.stopPropagation();
      onFavoriteToggle(venue.id);
    }
  };

  // Get availability status color
  const getAvailabilityColor = () => {
    switch (venue.availabilityStatus) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'limited':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'booked':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <Card className={cn(
      "group overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50 text-card-foreground",
      className
    )}>
        <div className="relative">
          {/* Venue Image with Overlay */}
          <div className="relative h-56 overflow-hidden">
            <Link href={`/venues/${venue.id}`}>
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            {/* Favorite Button */}
            <button 
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white dark:bg-black/60 dark:hover:bg-black/80 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
              aria-label={venue.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={cn(
                  "h-5 w-5 transition-all duration-300", 
                  venue.isFavorite 
                    ? "fill-red-500 text-red-500 scale-110" 
                    : "text-gray-600 dark:text-gray-300 hover:text-red-500"
                )}
              />
            </button>
            
            {/* Availability Badge */}
            {venue.availabilityStatus && (
              <div className={cn(
                "absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border",
                getAvailabilityColor()
              )}>
                {venue.availabilityStatus === 'available' && '✓ Available'}
                {venue.availabilityStatus === 'limited' && '⚡ Limited Dates'}
                {venue.availabilityStatus === 'booked' && '✕ Fully Booked'}
              </div>
            )}
            
            {/* Quick Action Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                <Button size="sm" className="bg-white/90 text-black hover:bg-white backdrop-blur-sm">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline" className="bg-white/90 text-black hover:bg-white backdrop-blur-sm border-white/50">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-5">
            {/* Venue Name and Rating */}
            <div className="flex justify-between items-start mb-3">
              <Link href={`/venues/${venue.id}`} className="group-hover:text-primary transition-colors">
                <h3 className="font-playfair font-semibold text-xl leading-tight">{venue.name}</h3>
              </Link>
              <div className="flex items-center bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-sm px-2.5 py-1 rounded-full border border-yellow-200 dark:border-yellow-800">
                <Star className="w-3.5 h-3.5 mr-1 fill-current" />
                <span className="font-medium">{venue.rating}</span>
              </div>
            </div>
            
            {/* Location */}
            <div className="flex items-center text-muted-foreground text-sm mb-4">
              <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
              <span className="truncate">{venue.location}</span>
            </div>
            
            {/* Venue Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              {venue.capacity && (
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-1.5 text-primary flex-shrink-0" />
                  <span className="truncate">{venue.capacity}</span>
                </div>
              )}
              {venue.availableDates && venue.availableDates.length > 0 && (
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1.5 text-primary flex-shrink-0" />
                  <span className="truncate">{venue.availableDates[0]}</span>
                </div>
              )}
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {venue.tags.slice(0, 3).map((tag, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="text-xs bg-primary/5 hover:bg-primary/10 text-primary border-primary/20 transition-colors duration-200 px-2 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
              {venue.tags.length > 3 && (
                <Badge variant="outline" className="text-xs text-muted-foreground border-muted-foreground/20">
                  +{venue.tags.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="pt-0 px-5 pb-5">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-primary font-semibold text-lg">{venue.priceRange}</p>
                <p className="text-xs text-muted-foreground">Starting price</p>
              </div>
              <Link href={`/venues/${venue.id}`}>
                <Button size="sm" className="bg-primary hover:bg-primary/90 group-hover:shadow-lg transition-all duration-300">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardFooter>
        </div>
      </Card>
  );
};

export default VenueCard;
