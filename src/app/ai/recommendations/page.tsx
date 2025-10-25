"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import EnhancedPageHero from '@/components/layout/EnhancedPageHero';
import PageContainer from '@/components/layout/PageContainer';
import { 
  Target, 
  Sparkles, 
  Heart, 
  MapPin, 
  Users, 
  DollarSign, 
  Star,
  Filter,
  RefreshCw,
  TrendingUp,
  Zap,
  Award
} from 'lucide-react';
import VenueCard from '@/components/venues/VenueCard';
import VendorCard from '@/components/vendors/VendorCard';

interface RecommendationFilters {
  budget: number[];
  guest_count: number;
  location: string;
  style: string[];
  priority: 'budget' | 'quality' | 'convenience' | 'popularity';
}

export default function AIRecommendationsPage() {
  const [activeTab, setActiveTab] = useState<'venues' | 'vendors'>('venues');
  const [filters, setFilters] = useState<RecommendationFilters>({
    budget: [100000, 1000000],
    guest_count: 200,
    location: '',
    style: [],
    priority: 'quality'
  });
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [personalizedScore, setPersonalizedScore] = useState(85);

  const styleOptions = [
    'Traditional', 'Modern', 'Rustic', 'Luxury', 'Minimalist', 
    'Vintage', 'Bohemian', 'Classic', 'Contemporary', 'Ethnic'
  ];

  const priorityOptions = [
    { value: 'budget', label: 'Best Value', icon: DollarSign },
    { value: 'quality', label: 'Highest Quality', icon: Award },
    { value: 'convenience', label: 'Most Convenient', icon: Zap },
    { value: 'popularity', label: 'Most Popular', icon: TrendingUp }
  ];

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          filters,
          algorithm: 'hybrid'
        })
      });
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [activeTab, filters]);

  const mockVenues: any[] = [];
  const mockVendors: any[] = [];

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Target, text: 'AI' }}
        title="Smart"
        titleGradient="Recommendations"
        description="Personalized venue and vendor suggestions powered by AI."
      />

      <PageContainer className="py-12">
        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{personalizedScore}%</div>
              <div className="text-xs text-muted-foreground">Match Score</div>
            </div>
            <Button onClick={fetchRecommendations} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  AI Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Budget Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Budget Range
                  </label>
                  <Slider
                    value={filters.budget}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, budget: value }))}
                    max={2000000}
                    min={50000}
                    step={50000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>₹{(filters.budget[0] / 100000).toFixed(1)}L</span>
                    <span>₹{(filters.budget[1] / 100000).toFixed(1)}L</span>
                  </div>
                </div>

                {/* Guest Count */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Guest Count
                  </label>
                  <Input
                    type="number"
                    value={filters.guest_count}
                    onChange={(e) => setFilters(prev => ({ ...prev, guest_count: Number(e.target.value) }))}
                    placeholder="200"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Preferred Location
                  </label>
                  <Input
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Mumbai, Delhi, Goa..."
                  />
                </div>

                {/* Style Preferences */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Style Preferences
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {styleOptions.map((style) => (
                      <Badge
                        key={style}
                        variant={filters.style.includes(style) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            style: prev.style.includes(style)
                              ? prev.style.filter(s => s !== style)
                              : [...prev.style, style]
                          }));
                        }}
                      >
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Priority
                  </label>
                  <div className="space-y-2">
                    {priorityOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => setFilters(prev => ({ ...prev, priority: option.value as any }))}
                          className={`w-full flex items-center p-3 rounded-lg border transition-colors ${
                            filters.priority === option.value
                              ? 'border-red-500 bg-red-50 dark:bg-red-950'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <IconComponent className="h-4 w-4 mr-2" />
                          <span className="text-sm">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
              <button
                onClick={() => setActiveTab('venues')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'venues'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Venues
              </button>
              <button
                onClick={() => setActiveTab('vendors')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'vendors'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Vendors
              </button>
            </div>

            {/* AI Insights */}
            <Card className="mb-6 bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950 dark:to-amber-950 border-red-200 dark:border-red-800">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">AI Insights</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Based on your preferences, I recommend focusing on <strong>traditional luxury venues</strong> in 
                      Rajasthan or Delhi. Your budget of ₹{(filters.budget[1] / 100000).toFixed(1)}L is perfect for 
                      premium heritage properties with {filters.guest_count} guests.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {activeTab === 'venues' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockVenues.map((venue) => (
                      <div key={venue.id} className="relative">
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {venue.aiScore}% Match
                          </Badge>
                        </div>
                        <VenueCard
                          venue={{
                            id: venue.id,
                            name: venue.name,
                            location: venue.location,
                            image: venue.image,
                            rating: venue.rating,
                            priceRange: venue.priceRange,
                            capacity: venue.capacity,
                            tags: venue.tags,
                            verified: venue.verified
                          }}
                        />
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Why this matches:</strong> {venue.matchReason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockVendors.map((vendor) => (
                      <div key={vendor.id} className="relative">
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {vendor.aiScore}% Match
                          </Badge>
                        </div>
                        <VendorCard
                          vendor={{
                            id: vendor.id,
                            name: vendor.name,
                            category: vendor.category,
                            location: vendor.location,
                            image: vendor.image,
                            rating: vendor.rating,
                            startingPrice: vendor.priceRange,
                            tags: vendor.tags,
                            isVerified: vendor.verified,
                            responseTime: vendor.responseTime,
                            completedProjects: vendor.completedProjects
                          }}
                        />
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Why this matches:</strong> {vendor.matchReason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
