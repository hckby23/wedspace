"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/hooks/useAI';
import type { AIRecommendation } from '@/services/AIService';
import { Sparkles, TrendingUp, MapPin, Star, Heart } from 'lucide-react';
import Link from 'next/link';

interface AIRecommendationsProps {
  type: 'venue' | 'vendor';
  filters?: {
    budget?: { min: number; max: number };
    location?: string;
    guestCount?: number;
    eventDate?: string;
  };
  preferences?: {
    style?: string[];
    amenities?: string[];
  };
}

export function AIRecommendations({ type, filters, preferences }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const { getVenueRecommendations, getVendorRecommendations, loading } = useAI();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const query = {
        query: `Find ${type}s ${filters?.location ? `in ${filters.location}` : ''}`,
        filters,
        preferences,
      };

      const result = type === 'venue'
        ? await getVenueRecommendations(query)
        : await getVendorRecommendations(query);

      if (result.success && result.data) {
        setRecommendations(result.data);
      }
    };

    fetchRecommendations();
  }, [type, filters, preferences]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          AI-Powered Recommendations
          <Badge variant="outline" className="ml-auto">
            <TrendingUp className="w-3 h-3 mr-1" />
            Personalized for you
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              {/* Match Score Badge */}
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-gradient-to-r from-red-600 to-amber-600 text-white">
                  {item.matchScore}% Match
                </Badge>
              </div>

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  {item.location}
                </div>

                <div className="flex items-center gap-2 text-sm mb-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{item.rating}</span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {item.description}
                </p>

                {/* Reasons */}
                <div className="space-y-1 mb-3">
                  {item.reasons.slice(0, 2).map((reason, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-green-600 dark:text-green-400">
                      <span className="mt-0.5">✓</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Starting at</p>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                      ₹{(item.price / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Link href={`/${type}s/${item.id}`}>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
