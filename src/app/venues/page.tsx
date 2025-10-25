"use client";

import React, { useState, useMemo, useEffect } from "react";
import VenueCard, { VenueProps } from "@/components/venues/VenueCard";
import VenueFilters from "@/components/venues/VenueFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Star, 
  Users, 
  Calendar, 
  Filter,
  Grid3X3,
  List,
  Map,
  TrendingUp,
  Award,
  Shield,
  CheckCircle,
  Heart,
  Share2,
  Eye,
  Clock,
  IndianRupee,
  Sparkles,
  Zap,
  ChevronDown,
  X,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useListings, useFavoriteToggle, type ListingFilters } from "@/hooks/useListings";
import Link from "next/link";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";

// Venue categories for filtering
const venueCategories = [
  { id: 'all', name: 'All Venues', icon: MapPin, count: '2,500+' },
  { id: 'banquet-halls', name: 'Banquet Halls', icon: Users, count: '800+' },
  { id: 'hotels', name: 'Hotels', icon: Shield, count: '600+' },
  { id: 'resorts', name: 'Resorts', icon: Star, count: '400+' },
  { id: 'gardens', name: 'Garden Venues', icon: Sparkles, count: '300+' },
  { id: 'heritage', name: 'Heritage Properties', icon: Award, count: '200+' },
  { id: 'destination', name: 'Destination', icon: MapPin, count: '150+' }
];

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'availability', label: 'Available Soon' }
];

const quickFilters = [
  { id: 'verified', label: 'Verified Only', icon: CheckCircle },
  { id: 'available', label: 'Available This Month', icon: Calendar },
  { id: 'budget-friendly', label: 'Budget Friendly', icon: IndianRupee },
  { id: 'luxury', label: 'Luxury', icon: Star },
  { id: 'ai-recommended', label: 'AI Recommended', icon: Zap }
];

// Next.js app router passes searchParams to the Page component
export default function VenuesPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined> }) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentFilters, setCurrentFilters] = useState<ListingFilters>({ kind: 'venue' });
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Use live data from API
  const { data: listingsData, isLoading, error } = useListings({
    ...currentFilters,
    search: searchTerm,
    sort: sortBy as any,
  }, currentPage);

  const favoriteToggle = useFavoriteToggle();

  // Initialize from URL query
  useEffect(() => {
    const initializeFromSearchParams = async () => {
      try {
        const params = searchParams instanceof Promise ? await searchParams : searchParams;
        const locationParam = (params?.location as string) || "";
        if (locationParam) {
          setSearchTerm(locationParam);
          setCurrentFilters(prev => ({ ...prev, city: locationParam }));
        }
      } catch (error) {
        console.error('Error processing search params:', error);
      }
    };
    
    initializeFromSearchParams();
  }, [searchParams]);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentFilters(prev => ({ ...prev, search: term }));
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    setCurrentFilters(prev => ({ ...prev, ...filters }));
    setCurrentPage(1);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (listingId: string) => {
    favoriteToggle.mutate(listingId);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      setCurrentFilters(prev => ({ ...prev, category: undefined }));
    } else {
      setCurrentFilters(prev => ({ ...prev, category: categoryId }));
    }
    setCurrentPage(1);
  };

  // Handle quick filter toggle
  const handleQuickFilterToggle = (filterId: string) => {
    const newFilters = activeQuickFilters.includes(filterId)
      ? activeQuickFilters.filter(f => f !== filterId)
      : [...activeQuickFilters, filterId];
    
    setActiveQuickFilters(newFilters);
    
    // Apply quick filters to current filters
    const updatedFilters = { ...currentFilters };
    
    if (newFilters.includes('verified')) {
      updatedFilters.min_rating = 4.5;
    } else if (currentFilters.min_rating === 4.5) {
      delete updatedFilters.min_rating;
    }
    
    if (newFilters.includes('budget-friendly')) {
      updatedFilters.max_price = 50000;
    } else if (currentFilters.max_price === 50000) {
      delete updatedFilters.max_price;
    }
    
    if (newFilters.includes('luxury')) {
      updatedFilters.min_price = 200000;
    } else if (currentFilters.min_price === 200000) {
      delete updatedFilters.min_price;
    }
    
    setCurrentFilters(updatedFilters);
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  // Get venues from API data
  const venues = listingsData?.listings || [];
  const totalCount = listingsData?.pagination?.total || 0;
  const hasNextPage = (listingsData?.pagination?.page || 1) < (listingsData?.pagination?.pages || 1);

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section */}
      <EnhancedPageHero
        badge={{ icon: MapPin, text: "Discover Venues" }}
        title="Wedding Venues in"
        titleGradient="Delhi NCR"
        description="Discover and compare wedding venues across Delhi, Noida, and Greater Noida. From luxury hotels to garden resorts, find the perfect setting for your special day."
      >
        {/* Integrated Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="relative group">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-rose-500/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex items-center gap-3 p-3">
                {/* Search Icon */}
                <div className="pl-2">
                  <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                
                {/* Input */}
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search venues by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch((e.target as HTMLInputElement).value)}
                    className="border-0 bg-transparent focus-visible:ring-0 text-base h-12"
                  />
                </div>
                
                {/* Search button integrated */}
                <Button 
                  onClick={() => handleSearch(searchTerm)}
                  size="lg" 
                  className="h-12 px-6 bg-gradient-to-r from-primary via-rose-500 to-secondary hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </EnhancedPageHero>

      {/* Main Content */}
      <PageContainer className="py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full justify-center gap-2">
                      <SlidersHorizontal size={18} />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="overflow-y-auto">
                    <h3 className="font-playfair text-lg font-semibold mb-4">Filters</h3>
                    <VenueFilters onFilterChange={handleFilterChange} />
                  </SheetContent>
                </Sheet>
              </div>
              
              {/* Desktop Filters */}
              <div className="hidden lg:block">
                <VenueFilters onFilterChange={handleFilterChange} />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {/* Results Header - Enhanced */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 text-foreground border-0">
                  {totalCount} Results
                </Badge>
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                {totalCount} Venues Found
              </h2>
              <p className="text-muted-foreground">
                {searchTerm ? `Results for "${searchTerm}"` : 'All venues in Delhi NCR'}
              </p>
            </div>

            {/* Venues Grid */}
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
              </div>
            ) : venues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {venues.map((venue) => (
                  <VenueCard 
                    key={venue.id} 
                    venue={{
                      id: venue.id,
                      name: venue.title,
                      location: `${venue.city}, ${venue.state}`,
                      image: venue.media?.[0]?.url || '/img/venue-placeholder.jpg',
                      rating: venue.rating,
                      priceRange: venue.base_price ? `₹${venue.base_price.toLocaleString()}+` : 'Price on request',
                      capacity: venue.venues?.max_guests ? `Up to ${venue.venues.max_guests} guests` : '50-500 guests',
                      tags: venue.tags || [],
                      verified: venue.verified,
                      featured: venue.status === 'featured',
                      availability: 'Available',
                      responseTime: '< 2 hours',
                      bookings: venue.review_count || 0
                    }} 
                    onFavoriteToggle={() => handleFavoriteToggle(venue.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3 text-foreground">No venues found</h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    We couldn't find any venues matching your criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-primary to-rose-600 hover:from-primary/90 hover:to-rose-600/90"
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentFilters({ kind: 'venue' });
                      setCurrentPage(1);
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {venues.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {listingsData?.pagination?.pages || 1}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!hasNextPage}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
