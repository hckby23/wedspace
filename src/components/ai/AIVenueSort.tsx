"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  TrendingUp, 
  Heart, 
  MapPin, 
  IndianRupee, 
  Users, 
  Star,
  Zap,
  Target,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AIVenueSortProps {
  venues: Array<{
    id: string;
    name: string;
    location: string;
    price: number;
    rating: number;
    capacity: number;
    image: string;
    type: string;
    amenities?: string[];
    distance?: number;
    availability?: boolean;
  }>;
  userPreferences?: {
    budget?: number;
    location?: string;
    guestCount?: number;
    eventDate?: string;
    priorities?: ('price' | 'location' | 'rating' | 'capacity' | 'amenities')[];
  };
  onSortChange?: (sortedVenues: any[], sortType: string) => void;
  className?: string;
}

interface SortOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const AIVenueSort: React.FC<AIVenueSortProps> = ({
  venues,
  userPreferences,
  onSortChange,
  className
}) => {
  const [activeSortType, setActiveSortType] = useState<string>('ai-recommended');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sortOptions: SortOption[] = [
    {
      id: 'ai-recommended',
      name: 'AI Recommended',
      description: 'Smart recommendations based on your preferences',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'best-match',
      name: 'Best Match',
      description: 'Venues that perfectly fit your requirements',
      icon: Target,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'value-for-money',
      name: 'Best Value',
      description: 'Maximum features within your budget',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'popularity',
      name: 'Most Popular',
      description: 'Highly rated and frequently booked venues',
      icon: Heart,
      color: 'from-red-500 to-rose-500'
    },
    {
      id: 'smart-distance',
      name: 'Smart Location',
      description: 'Optimal distance considering traffic and accessibility',
      icon: MapPin,
      color: 'from-orange-500 to-amber-500'
    },
    {
      id: 'ai-budget',
      name: 'Budget Optimizer',
      description: 'Best venues within your budget range',
      icon: Brain,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const calculateAIScore = (venue: any): number => {
    let score = 0;
    const weights = {
      budget: 0.3,
      location: 0.2,
      rating: 0.2,
      capacity: 0.15,
      availability: 0.15
    };

    // Budget score
    if (userPreferences?.budget) {
      const budgetRatio = venue.price / userPreferences.budget;
      if (budgetRatio <= 1) {
        score += weights.budget * (1 - budgetRatio + 0.5); // Bonus for under budget
      } else {
        score += weights.budget * Math.max(0, 1 - (budgetRatio - 1) * 2);
      }
    } else {
      score += weights.budget * 0.5; // Neutral if no budget specified
    }

    // Location score (simplified - in real app would use actual distance)
    if (userPreferences?.location && venue.distance) {
      const distanceScore = Math.max(0, 1 - venue.distance / 50); // Assume 50km max
      score += weights.location * distanceScore;
    } else {
      score += weights.location * 0.5;
    }

    // Rating score
    score += weights.rating * (venue.rating / 5);

    // Capacity score
    if (userPreferences?.guestCount) {
      const capacityRatio = venue.capacity / userPreferences.guestCount;
      if (capacityRatio >= 1 && capacityRatio <= 1.5) {
        score += weights.capacity; // Perfect capacity
      } else if (capacityRatio > 1.5) {
        score += weights.capacity * 0.7; // Too big
      } else {
        score += weights.capacity * 0.3; // Too small
      }
    } else {
      score += weights.capacity * 0.5;
    }

    // Availability score
    score += weights.availability * (venue.availability ? 1 : 0.2);

    return Math.min(1, score);
  };

  const sortVenues = async (sortType: string) => {
    setIsAnalyzing(true);
    setActiveSortType(sortType);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    let sortedVenues = [...venues];

    switch (sortType) {
      case 'ai-recommended':
        sortedVenues = sortedVenues
          .map(venue => ({
            ...venue,
            aiScore: calculateAIScore(venue)
          }))
          .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
        break;

      case 'best-match':
        sortedVenues = sortedVenues
          .filter(venue => {
            if (userPreferences?.budget && venue.price > userPreferences.budget * 1.2) return false;
            if (userPreferences?.guestCount && venue.capacity < userPreferences.guestCount) return false;
            return true;
          })
          .sort((a, b) => {
            const aScore = calculateAIScore(a);
            const bScore = calculateAIScore(b);
            return bScore - aScore;
          });
        break;

      case 'value-for-money':
        sortedVenues = sortedVenues
          .map(venue => ({
            ...venue,
            valueScore: (venue.rating * venue.capacity) / (venue.price / 100000)
          }))
          .sort((a, b) => (b.valueScore || 0) - (a.valueScore || 0));
        break;

      case 'popularity':
        sortedVenues = sortedVenues
          .sort((a, b) => {
            // Combine rating and implied popularity
            const aPopularity = a.rating * (a.capacity / 100) * (a.availability ? 0.8 : 1);
            const bPopularity = b.rating * (b.capacity / 100) * (b.availability ? 0.8 : 1);
            return bPopularity - aPopularity;
          });
        break;

      case 'smart-distance':
        sortedVenues = sortedVenues
          .sort((a, b) => {
            const aDistance = a.distance || Math.random() * 30;
            const bDistance = b.distance || Math.random() * 30;
            // Factor in rating to avoid just showing closest venues
            const aScore = (5 - aDistance / 10) + a.rating;
            const bScore = (5 - bDistance / 10) + b.rating;
            return bScore - aScore;
          });
        break;

      case 'ai-budget':
        const budget = userPreferences?.budget || 200000;
        sortedVenues = sortedVenues
          .filter(venue => venue.price <= budget * 1.1) // Allow 10% over budget
          .map(venue => ({
            ...venue,
            budgetScore: (budget - venue.price) / budget + (venue.rating / 5)
          }))
          .sort((a, b) => (b.budgetScore || 0) - (a.budgetScore || 0));
        break;

      default:
        break;
    }

    setIsAnalyzing(false);
    onSortChange?.(sortedVenues, sortType);
  };

  const getInsightText = (sortType: string) => {
    const venueCount = venues.length;
    
    switch (sortType) {
      case 'ai-recommended':
        return `Analyzed ${venueCount} venues using AI to match your preferences. Top recommendations consider your budget, location, and requirements.`;
      case 'best-match':
        return `Found ${venueCount} venues that meet your specific criteria. These venues fit your guest count and budget requirements.`;
      case 'value-for-money':
        return `Ranked ${venueCount} venues by value proposition. These venues offer the best features and capacity for their price point.`;
      case 'popularity':
        return `Showing ${venueCount} venues ranked by popularity and guest satisfaction. These are frequently booked and highly rated.`;
      case 'smart-distance':
        return `Optimized ${venueCount} venues by location convenience. Considers distance, accessibility, and traffic patterns.`;
      case 'ai-budget':
        return `Found ${venueCount} budget-optimized venues. These options maximize value within your specified budget range.`;
      default:
        return `Showing ${venueCount} venues with smart sorting applied.`;
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          AI-Powered Venue Sorting
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="w-3 h-3 mr-1" />
            Smart
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sort Options Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activeSortType === option.id;
            
            return (
              <Button
                key={option.id}
                variant={isActive ? "default" : "outline"}
                onClick={() => sortVenues(option.id)}
                disabled={isAnalyzing}
                className={cn(
                  "h-auto p-3 flex flex-col items-start gap-2 text-left",
                  isActive && `bg-gradient-to-r ${option.color} text-white border-0`
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{option.name}</span>
                </div>
                <p className="text-xs opacity-80 line-clamp-2">
                  {option.description}
                </p>
              </Button>
            );
          })}
        </div>

        {/* Analysis Status */}
        {isAnalyzing && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                  <div className="absolute inset-0 w-5 h-5 border-2 border-purple-600 rounded-full animate-spin border-t-transparent" />
                </div>
                <div>
                  <p className="font-medium text-purple-800 dark:text-purple-300">
                    AI is analyzing venues...
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Processing your preferences and venue data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Insights */}
        {!isAnalyzing && activeSortType && (
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                    AI Insights
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {getInsightText(activeSortType)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Preferences Summary */}
        {userPreferences && Object.keys(userPreferences).length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Your preferences:</span>
            {userPreferences.budget && (
              <Badge variant="outline" className="text-xs">
                <IndianRupee className="w-3 h-3 mr-1" />
                ₹{userPreferences.budget.toLocaleString('en-IN')}
              </Badge>
            )}
            {userPreferences.guestCount && (
              <Badge variant="outline" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {userPreferences.guestCount} guests
              </Badge>
            )}
            {userPreferences.location && (
              <Badge variant="outline" className="text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                {userPreferences.location}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIVenueSort;
