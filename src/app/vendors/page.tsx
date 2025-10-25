"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  MapPin,
  Star,
  Award,
  Users,
  Filter,
  X,
  TrendingUp,
  Camera,
  Music,
  Palette,
  ChefHat,
  Flower2,
  Car,
  Sparkles,
  Clock,
  Shield,
  CheckCircle,
  Loader2
} from "lucide-react";
import VendorCard from "@/components/vendors/VendorCard";
import { useListings, useFavoriteToggle, type ListingFilters } from "@/hooks/useListings";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentFilters, setCurrentFilters] = useState<ListingFilters>({ kind: 'vendor' });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Use live data from API
  const { data: listingsData, isLoading, error } = useListings({
    ...currentFilters,
    search: searchTerm,
    sort: sortBy as any,
  }, currentPage);

  const favoriteToggle = useFavoriteToggle();

  // Handle search
  const handleSearch = (term: string = searchTerm) => {
    setSearchTerm(term);
    setCurrentFilters(prev => ({ ...prev, search: term }));
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...currentFilters };
    
    switch (key) {
      case 'location':
        newFilters.city = value;
        break;
      case 'rating':
        newFilters.min_rating = parseFloat(value);
        break;
      case 'priceRange':
        if (value === 'budget') {
          newFilters.min_price = 10000;
          newFilters.max_price = 50000;
        } else if (value === 'mid') {
          newFilters.min_price = 50000;
          newFilters.max_price = 100000;
        } else if (value === 'premium') {
          newFilters.min_price = 100000;
          newFilters.max_price = 300000;
        } else if (value === 'luxury') {
          newFilters.min_price = 300000;
        }
        break;
    }
    
    setCurrentFilters(newFilters);
    setCurrentPage(1);
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const newFilters = { ...currentFilters };
    
    // For now, we'll use search to filter by category since the API doesn't have a category field
    if (category === 'all') {
      delete newFilters.search;
    } else {
      newFilters.search = category;
    }
    
    setCurrentFilters(newFilters);
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (listingId: string) => {
    favoriteToggle.mutate(listingId);
  };

  // Clear all filters
  const clearFilters = () => {
    setCurrentFilters({ kind: 'vendor' });
    setActiveCategory('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Get vendors from API data
  const vendors = listingsData?.listings || [];
  const totalCount = listingsData?.pagination?.total || 0;
  const hasNextPage = (listingsData?.pagination?.page || 1) < (listingsData?.pagination?.pages || 1);

  const vendorCategories = [
    { id: 'all', name: 'All Vendors', icon: Users, count: totalCount },
    { id: 'photographer', name: 'Photographers', icon: Camera, count: '150+' },
    { id: 'caterer', name: 'Caterers', icon: ChefHat, count: '200+' },
    { id: 'decorator', name: 'Decorators', icon: Palette, count: '120+' },
    { id: 'makeup', name: 'Makeup Artists', icon: Sparkles, count: '80+' },
    { id: 'music', name: 'DJ/Music', icon: Music, count: '60+' },
    { id: 'transport', name: 'Transportation', icon: Car, count: '40+' }
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Enhanced Hero Section */}
      <EnhancedPageHero
        badge={{ icon: Award, text: "Trusted Wedding Professionals" }}
        title="Find Your Perfect"
        titleGradient="Wedding Vendors"
        description="Connect with verified, trusted professionals who will make your special day unforgettable. From photographers to caterers, find the perfect team for your wedding."
      >
        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-border">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-semibold">500+ Verified</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-border">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-semibold">Background Checked</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-border">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <span className="font-semibold">Top Rated</span>
          </div>
        </div>

        {/* Integrated Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="relative group">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-rose-500/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex items-center gap-3 p-3">
                <div className="pl-2">
                  <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search vendors by name, category, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                    className="border-0 bg-transparent focus-visible:ring-0 text-base h-12"
                  />
                </div>
                
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
        <div>
          {/* Filter Toggle */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-2 hover:bg-accent"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
              {showFilters && <X className="w-4 h-4 ml-2" />}
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {vendorCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'outline'}
                  className={`rounded-full px-6 py-3 transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-2xl font-bold">Advanced Filters</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={clearFilters}>
                      Clear All
                    </Button>
                    <Button variant="ghost" onClick={() => setShowFilters(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Location</Label>
                <Select value={currentFilters.city || ''} onValueChange={(value) => handleFilterChange('location', value)}>
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
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Price Range</Label>
                <Select value="" onValueChange={(value) => handleFilterChange('priceRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget (₹10K - ₹50K)</SelectItem>
                    <SelectItem value="mid">Mid-range (₹50K - ₹1L)</SelectItem>
                    <SelectItem value="premium">Premium (₹1L - ₹3L)</SelectItem>
                    <SelectItem value="luxury">Luxury (₹3L+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Minimum Rating</Label>
                <Select value={currentFilters.min_rating?.toString() || ''} onValueChange={(value) => handleFilterChange('rating', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    <SelectItem value="3.0">3.0+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Experience</Label>
                <Select value="" onValueChange={(value) => handleFilterChange('experience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10+">10+ Years</SelectItem>
                    <SelectItem value="5+">5+ Years</SelectItem>
                    <SelectItem value="3+">3+ Years</SelectItem>
                    <SelectItem value="1+">1+ Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
              </CardContent>
            </Card>
          )}

      {/* Results Section */}
      <section className="py-12">
        <div className="container-custom">
          {/* Results Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h2 className="font-playfair text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {totalCount} Vendors Found
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {activeCategory !== 'all' && `Showing ${vendorCategories.find(c => c.id === activeCategory)?.name || 'vendors'}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</Label>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Vendor Grid */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          ) : vendors.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {vendors.map((vendor) => (
                <VendorCard 
                  key={vendor.id} 
                  vendor={{
                    id: vendor.id,
                    name: vendor.title,
                    category: vendor.vendors?.category || 'Wedding Vendor',
                    location: `${vendor.city}, ${vendor.state}`,
                    image: vendor.media?.[0]?.url || '/img/vendor-placeholder.jpg',
                    rating: vendor.rating,
                    reviewCount: vendor.review_count,
                    startingPrice: vendor.base_price ? `₹${vendor.base_price.toLocaleString()}+` : 'Price on request',
                    isVerified: vendor.verified,
                    responseTime: '< 2 hours',
                    completedProjects: vendor.review_count || 0,
                    tags: vendor.tags || [],
                    description: vendor.description || ''
                  }}
                  onFavoriteToggle={() => handleFavoriteToggle(vendor.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No Vendors Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                We couldn't find any vendors matching your criteria. Try adjusting your filters or search terms.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Categories */}
      {vendors.length > 0 && activeCategory === 'all' && !searchTerm && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Popular Vendor Categories
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explore our most sought-after wedding professionals
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {vendorCategories.slice(1).map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card 
                    key={category.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105"
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{category.count} vendors</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}
        </div>
      </PageContainer>
    </main>
  );
}
