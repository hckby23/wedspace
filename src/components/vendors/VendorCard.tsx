"use client";

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Star, Heart, MapPin, ArrowRight, Phone, Mail, Award } from 'lucide-react';
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
  isVerified?: boolean;
  reviewCount?: number;
  responseTime?: string;
  completedProjects?: number;
}

interface VendorCardProps {
  vendor: VendorProps;
  showFavoriteButton?: boolean;
  onFavoriteToggle?: (id: string) => void;
  className?: string;
}

const VendorCard: React.FC<VendorCardProps> = ({ 
  vendor, 
  showFavoriteButton = true, 
  onFavoriteToggle,
  className 
}) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onFavoriteToggle) {
      onFavoriteToggle(vendor.id);
    }
  };

  return (
    <Card className={cn(
      "group overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50",
      className
    )}>
        <div className="relative h-56 overflow-hidden">
          <Link href={`/vendors/${vendor.id}`}>
            <img
              src={vendor.image}
              alt={vendor.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          
          {/* Category Badge */}
          <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground hover:bg-primary backdrop-blur-sm border border-primary/20">
            {vendor.category}
          </Badge>
          
          {/* Verified Badge */}
          {vendor.isVerified && (
            <Badge className="absolute top-3 left-3 mt-8 bg-green-500/90 text-white hover:bg-green-500 backdrop-blur-sm border border-green-400/20">
              <Award className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          
          {/* Favorite Button */}
          {showFavoriteButton && (
            <button 
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white dark:bg-black/60 dark:hover:bg-black/80 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-gray-600 dark:text-gray-300 hover:text-red-500"
                )} 
              />
            </button>
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
          {/* Vendor Name and Rating */}
          <div className="flex justify-between items-start mb-3">
            <Link href={`/vendors/${vendor.id}`} className="group-hover:text-primary transition-colors">
              <h3 className="font-playfair font-semibold text-xl leading-tight">{vendor.name}</h3>
            </Link>
            <div className="flex items-center bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-sm px-2.5 py-1 rounded-full border border-yellow-200 dark:border-yellow-800">
              <Star className="w-3.5 h-3.5 mr-1 fill-current" />
              <span className="font-medium">{vendor.rating}</span>
              {vendor.reviewCount && (
                <span className="text-xs ml-1">({vendor.reviewCount})</span>
              )}
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
            <span className="truncate">{vendor.location}</span>
          </div>
          
          {/* Description */}
          {vendor.description && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">{vendor.description}</p>
          )}
          
          {/* Vendor Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            {vendor.responseTime && (
              <div className="text-muted-foreground">
                <span className="font-medium text-foreground">Response:</span> {vendor.responseTime}
              </div>
            )}
            {vendor.completedProjects && (
              <div className="text-muted-foreground">
                <span className="font-medium text-foreground">Projects:</span> {vendor.completedProjects}+
              </div>
            )}
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {vendor.tags.slice(0, 3).map((tag, i) => (
              <Badge 
                key={i} 
                variant="outline" 
                className="text-xs bg-secondary/5 hover:bg-secondary/10 text-secondary border-secondary/20 transition-colors duration-200 px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
            {vendor.tags.length > 3 && (
              <Badge variant="outline" className="text-xs text-muted-foreground border-muted-foreground/20">
                +{vendor.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 px-5 pb-5">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-primary font-semibold text-lg">{vendor.startingPrice}</p>
              <p className="text-xs text-muted-foreground">Starting from</p>
            </div>
            <Link href={`/vendors/${vendor.id}`}>
              <Button size="sm" className="bg-primary hover:bg-primary/90 group-hover:shadow-lg transition-all duration-300">
                View Profile
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardFooter>
    </Card>
  );
};

export default VendorCard;
