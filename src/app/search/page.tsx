"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Filter,
  Grid3X3,
  List,
  Map,
  Star,
  Heart,
  Share2,
  Sliders,
  X,
  ChevronDown,
  TrendingUp,
  Clock,
  Award,
  Shield,
  Sparkles,
  SlidersHorizontal,
  Zap,
  CheckCircle,
  ArrowRight,
  Eye,
  MessageCircle,
  IndianRupee
} from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import VenueCard from '@/components/venues/VenueCard';
import VendorCard from '@/components/vendors/VendorCard';
import { FEATURED_VENUES } from '@/data/venues';
import { FEATURED_VENDORS } from '@/data/vendors';
import EnhancedPageHero from '@/components/layout/EnhancedPageHero';
import PageContainer from '@/components/layout/PageContainer';
import Link from 'next/link';

// Search suggestions and trending searches
const trendingSearches = [
  { term: 'Banquet halls in Delhi', category: 'venues', count: '2.5K' },
  { term: 'Wedding photographers', category: 'vendors', count: '1.8K' },
  { term: 'Garden venues Mumbai', category: 'venues', count: '1.2K' },
  { term: 'Bridal makeup artists', category: 'vendors', count: '950' },
  { term: 'Destination wedding venues', category: 'venues', count: '800' },
  { term: 'Wedding caterers', category: 'vendors', count: '750' }
];

const quickFilters = [
  { id: 'verified', label: 'Verified Only', icon: CheckCircle },
  { id: 'available', label: 'Available Soon', icon: Calendar },
  { id: 'budget-friendly', label: 'Budget Friendly', icon: IndianRupee },
  { id: 'luxury', label: 'Premium', icon: Star },
  { id: 'ai-recommended', label: 'AI Recommended', icon: Zap }
];

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'venues' | 'vendors'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    capacity: '',
    category: '',
    rating: '',
    availability: '',
    amenities: [] as string[]
  });
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Combined data for search
  const allData = useMemo(() => {
    const venues = FEATURED_VENUES.map(v => ({ 
      ...v, 
      type: 'venue',
      capacity: v.capacity ? `${v.capacity.min}-${v.capacity.max} guests` : undefined
    }));
    const vendors = FEATURED_VENDORS.map(v => ({ ...v, type: 'vendor' }));
    return [...venues, ...vendors];
  }, []);

  // Perform search
  const performSearch = (query: string = searchQuery) => {
    if (!query.trim()) {
      setSearchResults([]);
      setTotalResults(0);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    setTimeout(() => {
      let results = allData.filter(item => {
        const searchLower = query.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.location.toLowerCase().includes(searchLower) ||
          ((item as any).category && (item as any).category.toLowerCase().includes(searchLower)) ||
          (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)))
        );
      });

      // Apply search type filter
      if (searchType !== 'all') {
        results = results.filter(item => item.type === searchType.slice(0, -1)); // 'venues' -> 'venue'
      }

      // Apply quick filters
      activeQuickFilters.forEach(filter => {
        switch (filter) {
          case 'verified':
            results = results.filter(item => item.rating >= 4.5);
            break;
          case 'budget-friendly':
            results = results.filter(item => 
              item.priceRange && !item.priceRange.includes('5L') && !item.priceRange.includes('10L')
            );
            break;
          case 'luxury':
            results = results.filter(item => item.rating >= 4.7);
            break;
        }
      });

      // Apply sorting
      results.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'price-low':
            return a.priceRange.localeCompare(b.priceRange);
          case 'price-high':
            return b.priceRange.localeCompare(a.priceRange);
          default:
            return 0;
        }
      });

      setSearchResults(results);
      setTotalResults(results.length);
      setIsSearching(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const toggleQuickFilter = (filterId: string) => {
    setActiveQuickFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => {
    setActiveQuickFilters([]);
    setSearchType('all');
    setSortBy('relevance');
    setFilters({
      location: '',
      priceRange: '',
      capacity: '',
      category: '',
      rating: '',
      availability: '',
      amenities: []
    });
  };

  useEffect(() => {
    if (hasSearched) {
      performSearch();
    }
  }, [searchType, activeQuickFilters, sortBy]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    
    const dataSource = searchType === 'venues' ? FEATURED_VENUES : FEATURED_VENDORS;
    let results = dataSource.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))) ||
      item.location.toLowerCase().includes(query.toLowerCase())
    );
    
    // Apply filters
    if (filters.location) {
      results = results.filter(item => 
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.priceRange) {
      results = results.filter(item => {
        const price = (item as any).price || item.priceRange;
        return price && price.includes(filters.priceRange);
      });
    }
    
    if (filters.category) {
      results = results.filter(item => 
        (item as any).category && (item as any).category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      results = results.filter(item => 
        item.rating && item.rating >= minRating
      );
    }
    
    // Sort results
    results = sortResults(results, sortBy);
    
    setSearchResults(results);
    setIsSearching(false);
  };
  
  const sortResults = (results: any[], sortBy: string) => {
    switch (sortBy) {
      case 'rating':
        return results.sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'));
      case 'price-low':
        return results.sort((a, b) => {
          const aPrice = extractPrice(a.price || a.priceRange);
          const bPrice = extractPrice(b.price || b.priceRange);
          return aPrice - bPrice;
        });
      case 'price-high':
        return results.sort((a, b) => {
          const aPrice = extractPrice(a.price || a.priceRange);
          const bPrice = extractPrice(b.price || b.priceRange);
          return bPrice - aPrice;
        });
      case 'popular':
        return results.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      default:
        return results;
    }
  };
  
  const extractPrice = (priceString: string): number => {
    if (!priceString) return 0;
    const match = priceString.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const clearFilters = () => {
    setFilters({
      location: '',
      priceRange: '',
      capacity: '',
      category: '',
      rating: '',
      availability: '',
      amenities: []
    });
  };
  
  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };
  
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [filters, sortBy, searchType]);

  const popularSearches = [
    'Banquet Halls in Delhi',
    'Beach Wedding Venues',
    'Palace Wedding Venues',
    'Garden Wedding Venues',
    'Destination Wedding',
    'Budget Wedding Venues',
    'Luxury Wedding Venues',
    'Outdoor Wedding Venues'
  ];
  
  const trendingVenues = FEATURED_VENUES.slice(0, 6);
  const trendingVendors = FEATURED_VENDORS.slice(0, 6);
  
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <EnhancedPageHero
        badge={{ icon: Sparkles, text: "Smart Search" }}
        title="Find Your Perfect"
        titleGradient="Wedding Partners"
        description="Discover the best venues and vendors for your special day. Search, compare, and book with confidence."
      >
        {/* Search Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg border border-border">
            <Button
              variant={searchType === 'venues' ? 'default' : 'ghost'}
              className={`rounded-full px-8 py-3 transition-all duration-300 ${
                searchType === 'venues' 
                  ? 'bg-gradient-to-r from-primary to-rose-600 text-white shadow-md' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setSearchType('venues')}
            >
              Venues
            </Button>
            <Button
              variant={searchType === 'vendors' ? 'default' : 'ghost'}
              className={`rounded-full px-8 py-3 transition-all duration-300 ${
                searchType === 'vendors' 
                  ? 'bg-gradient-to-r from-primary to-rose-600 text-white shadow-md' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setSearchType('vendors')}
            >
              Vendors
            </Button>
          </div>
        </div>
        
        {/* Enhanced Search Bar */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder={`Search ${searchType}...`}
                    className="pl-12 pr-4 py-4 text-lg border-0 bg-muted focus:bg-background transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-6 py-4"
                  >
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                  </Button>
                  <Button
                    onClick={() => handleSearch(searchQuery)}
                    className="px-8 py-4 bg-gradient-to-r from-primary via-rose-500 to-secondary text-white shadow-lg"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </EnhancedPageHero>
      
      {/* Advanced Filters Panel */}
      {showFilters && (
        <section className="bg-card border-b border-border shadow-sm">
          <PageContainer className="py-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl font-semibold text-foreground">Advanced Filters</h3>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button variant="ghost" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Location</Label>
                <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">Delhi NCR</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Price Range</Label>
                <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget (₹50K - ₹2L)</SelectItem>
                    <SelectItem value="mid">Mid-range (₹2L - ₹5L)</SelectItem>
                    <SelectItem value="premium">Premium (₹5L - ₹10L)</SelectItem>
                    <SelectItem value="luxury">Luxury (₹10L+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {searchType === 'venues' && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Capacity</Label>
                  <Select value={filters.capacity} onValueChange={(value) => handleFilterChange('capacity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Guest capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">50-100 guests</SelectItem>
                      <SelectItem value="medium">100-300 guests</SelectItem>
                      <SelectItem value="large">300-500 guests</SelectItem>
                      <SelectItem value="xlarge">500+ guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Category</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {searchType === 'venues' ? (
                      <>
                        <SelectItem value="banquet">Banquet Hall</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="resort">Resort</SelectItem>
                        <SelectItem value="palace">Palace</SelectItem>
                        <SelectItem value="garden">Garden</SelectItem>
                        <SelectItem value="beach">Beach</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="photographer">Photographer</SelectItem>
                        <SelectItem value="caterer">Caterer</SelectItem>
                        <SelectItem value="decorator">Decorator</SelectItem>
                        <SelectItem value="makeup">Makeup Artist</SelectItem>
                        <SelectItem value="dj">DJ/Music</SelectItem>
                        <SelectItem value="planner">Wedding Planner</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Results Section */}
      <PageContainer className="py-12">
          {searchResults.length > 0 || isSearching ? (
            <div>
              {/* Results Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                  <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                    {isSearching ? 'Searching...' : `${searchResults.length} ${searchType} found`}
                  </h2>
                  {searchQuery && (
                    <p className="text-muted-foreground">
                      Results for "<span className="font-medium">{searchQuery}</span>"
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mt-4 lg:mt-0">
                  {/* Sort Options */}
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">Sort by:</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* View Mode Toggle */}
                  <div className="flex bg-muted rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={viewMode === 'grid' ? 'bg-background dark:bg-card shadow-sm' : ''}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={viewMode === 'list' ? 'bg-background dark:bg-card shadow-sm' : ''}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Search Results */}
              {isSearching ? (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {Array(6).fill(null).map((_, i) => (
                    <div key={i} className="h-72 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {searchResults.map((item) => (
                    searchType === 'venues' ? (
                      <VenueCard key={item.id} venue={item} />
                    ) : (
                      <VendorCard key={item.id} vendor={item} />
                    )
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* No Search Results - Show Trending */
            <div className="space-y-16">
              {/* Trending Section */}
              <div>
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Trending {searchType === 'venues' ? 'Venues' : 'Vendors'}
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Discover the most popular {searchType} chosen by couples like you
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {popularSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="rounded-full hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
                        onClick={() => {
                          setSearchQuery(search);
                          handleSearch(search);
                        }}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {search}
                      </Button>
                    ))}
                  </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {(searchType === 'venues' ? trendingVenues : trendingVendors).map((item) => (
                    searchType === 'venues' ? (
                      <VenueCard key={item.id} venue={item} />
                    ) : (
                      <VendorCard key={item.id} vendor={item} />
                    )
                  ))}
                </div>
                
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => {
                      setSearchQuery('');
                      handleSearch('');
                    }}
                    className="px-8"
                  >
                    View All {searchType}
                  </Button>
                </div>
              </div>
              
              {/* Popular Searches */}
              <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
                <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {popularSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="rounded-full hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
                      onClick={() => {
                        setSearchQuery(search);
                        handleSearch(search);
                      }}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          )}
      </PageContainer>
    </main>
  );
}
