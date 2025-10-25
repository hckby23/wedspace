"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import {
  Search,
  Heart,
  Share2,
  Bookmark,
  Eye,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Camera,
  Play,
  Grid3X3,
  List,
  Filter,
  Star,
  Award,
  Crown,
  Sparkles,
  Clock,
  ChevronRight,
  ExternalLink,
  Download,
  Quote,
  TrendingUp,
  Flower2,
  Music,
  Utensils,
  Car,
  Palette
} from "lucide-react";

export default function RealWeddingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const filters = [
    { id: 'all', name: 'All Weddings', count: 24 },
    { id: 'traditional', name: 'Traditional', count: 8 },
    { id: 'modern', name: 'Modern', count: 6 },
    { id: 'destination', name: 'Destination', count: 5 },
    { id: 'budget', name: 'Budget-Friendly', count: 5 }
  ];

  const realWeddings = [
    {
      id: 1,
      title: "Priya & Arjun's Royal Rajasthani Wedding",
      subtitle: "A Majestic Palace Celebration in Udaipur",
      couple: "Priya & Arjun",
      location: "City Palace, Udaipur",
      date: "December 2023",
      budget: "₹25 Lakhs",
      guests: 350,
      category: "traditional",
      featured: true,
      trending: true,
      images: ["/api/placeholder/600/400", "/api/placeholder/400/300", "/api/placeholder/400/300"],
      description: "A breathtaking three-day celebration that perfectly blended royal Rajasthani traditions with modern elegance. From the grand baraat to the intimate sangeet, every moment was magical.",
      highlights: ["Palace venue", "Traditional ceremonies", "Royal decor", "Destination wedding"],
      vendors: {
        photographer: "Royal Frames Photography",
        decorator: "Marigold Decor Studio",
        caterer: "Rajasthani Flavors",
        makeup: "Bridal Glow Studio"
      },
      views: 15420,
      likes: 892,
      shares: 156
    },
    {
      id: 2,
      title: "Sneha & Vikram's Garden Paradise Wedding",
      subtitle: "An Intimate Celebration in Nature's Embrace",
      couple: "Sneha & Vikram",
      location: "The Garden Resort, Bangalore",
      date: "February 2024",
      budget: "₹12 Lakhs",
      guests: 180,
      category: "modern",
      trending: true,
      images: ["/api/placeholder/600/400", "/api/placeholder/400/300", "/api/placeholder/400/300"],
      description: "A beautiful garden wedding that showcased sustainable practices and eco-friendly choices. The couple's love for nature was evident in every detail.",
      highlights: ["Eco-friendly", "Garden setting", "Sustainable decor", "Intimate ceremony"],
      vendors: {
        photographer: "Green Lens Photography",
        decorator: "Eco Bloom Decor",
        caterer: "Farm to Table Catering",
        makeup: "Natural Beauty Studio"
      },
      views: 12350,
      likes: 654,
      shares: 98
    },
    {
      id: 3,
      title: "Kavya & Rohit's Beach Sunset Wedding",
      subtitle: "Romance by the Arabian Sea",
      couple: "Kavya & Rohit",
      location: "Taj Fort Aguada, Goa",
      date: "January 2024",
      budget: "₹18 Lakhs",
      guests: 120,
      category: "destination",
      featured: true,
      images: ["/api/placeholder/600/400", "/api/placeholder/400/300", "/api/placeholder/400/300"],
      description: "A dreamy beachside celebration with golden sunsets, flowing fabrics, and the sound of waves. Perfect for couples who love the ocean.",
      highlights: ["Beach ceremony", "Sunset timing", "Coastal decor", "Intimate gathering"],
      vendors: {
        photographer: "Coastal Captures",
        decorator: "Seaside Celebrations",
        caterer: "Goan Delights",
        makeup: "Tropical Beauty"
      },
      views: 11234,
      likes: 678,
      shares: 124
    },
    {
      id: 4,
      title: "Anita & Suresh's Budget-Smart Wedding",
      subtitle: "Big Dreams, Smart Spending",
      couple: "Anita & Suresh",
      location: "Community Hall, Pune",
      date: "March 2024",
      budget: "₹8 Lakhs",
      guests: 200,
      category: "budget",
      images: ["/api/placeholder/600/400", "/api/placeholder/400/300", "/api/placeholder/400/300"],
      description: "Proof that beautiful weddings don't require huge budgets. Creative DIY elements and smart vendor choices created a memorable celebration.",
      highlights: ["DIY elements", "Budget-friendly", "Creative decor", "Family involvement"],
      vendors: {
        photographer: "Affordable Memories",
        decorator: "DIY Decor Solutions",
        caterer: "Home Style Catering",
        makeup: "Budget Beauty Studio"
      },
      views: 9876,
      likes: 543,
      shares: 87
    },
    {
      id: 5,
      title: "Meera & Karthik's South Indian Heritage Wedding",
      subtitle: "Celebrating Traditions with Grandeur",
      couple: "Meera & Karthik",
      location: "Kalyana Mandapam, Chennai",
      date: "November 2023",
      budget: "₹20 Lakhs",
      guests: 400,
      category: "traditional",
      images: ["/api/placeholder/600/400", "/api/placeholder/400/300", "/api/placeholder/400/300"],
      description: "A grand South Indian wedding that honored family traditions while incorporating contemporary elements. The temple-style mandap was breathtaking.",
      highlights: ["Temple decor", "Traditional rituals", "Grand mandap", "Cultural elements"],
      vendors: {
        photographer: "Heritage Moments",
        decorator: "Temple Art Decor",
        caterer: "South Indian Feast",
        makeup: "Classical Beauty"
      },
      views: 8765,
      likes: 432,
      shares: 76
    },
    {
      id: 6,
      title: "Riya & Amit's Bollywood Glam Wedding",
      subtitle: "Lights, Camera, Wedding!",
      couple: "Riya & Amit",
      location: "Film City, Mumbai",
      date: "October 2023",
      budget: "₹30 Lakhs",
      guests: 250,
      category: "modern",
      featured: true,
      images: ["/api/placeholder/600/400", "/api/placeholder/400/300", "/api/placeholder/400/300"],
      description: "A glamorous Bollywood-themed wedding with dramatic lighting, vintage props, and show-stopping performances. Every moment felt like a movie scene.",
      highlights: ["Bollywood theme", "Dramatic lighting", "Vintage props", "Entertainment focus"],
      vendors: {
        photographer: "Cinematic Weddings",
        decorator: "Bollywood Backdrops",
        caterer: "Star Catering",
        makeup: "Glamour Studio"
      },
      views: 13456,
      likes: 756,
      shares: 189
    }
  ];

  const filteredWeddings = realWeddings.filter(wedding => {
    const matchesFilter = activeFilter === 'all' || wedding.category === activeFilter;
    const matchesSearch = wedding.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wedding.couple.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wedding.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wedding.highlights.some(highlight => highlight.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const toggleBookmark = (id: number) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(bookmark => bookmark !== id) : [...prev, id]
    );
  };

  return (
    <main className="flex-grow bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-white to-amber-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              Real Wedding
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">
                Stories
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Get inspired by real couples who celebrated their love in unique ways. 
              Discover venues, vendors, budgets, and beautiful moments from actual Indian weddings.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by couple names, locations, or wedding style..."
                className="pl-12 pr-4 py-4 text-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg focus:shadow-xl transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? 'default' : 'outline'}
                className={`rounded-full px-6 py-3 transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-red-600 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container-custom">
          {/* Results Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h2 className="font-playfair text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {filteredWeddings.length} Wedding Stories
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {activeFilter !== 'all' && `Showing ${filters.find(f => f.id === activeFilter)?.name || 'weddings'}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-white shadow-sm' : ''}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-white shadow-sm' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Wedding Stories Grid */}
          {filteredWeddings.length > 0 ? (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 lg:grid-cols-2'
            }`}>
              {filteredWeddings.map((wedding) => (
                <Card key={wedding.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 bg-white">
                  {/* Image Gallery */}
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] bg-gradient-to-br from-red-100 to-amber-100 relative">
                      {/* Main Image Placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="w-16 h-16 text-gray-400" />
                      </div>
                      
                      {/* Overlay Badges */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        {wedding.trending && (
                          <Badge className="bg-red-600 text-white border-0">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        {wedding.featured && (
                          <Badge className="bg-amber-600 text-white border-0">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
                          onClick={() => toggleFavorite(wedding.id)}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(wedding.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
                          onClick={() => toggleBookmark(wedding.id)}
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarks.includes(wedding.id) ? 'fill-amber-500 text-amber-500' : 'text-gray-600'}`} />
                        </Button>
                      </div>
                      
                      {/* Image Count */}
                      <div className="absolute bottom-4 right-4">
                        <Badge className="bg-black/60 text-white border-0">
                          <Camera className="w-3 h-3 mr-1" />
                          {wedding.images.length} photos
                        </Badge>
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <Button 
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                          size="lg"
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          View Story
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <CardContent className="p-6">
                    {/* Couple & Location */}
                    <div className="mb-4">
                      <h3 className="font-playfair text-xl font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                        {wedding.couple}
                      </h3>
                      <p className="text-gray-600 font-medium">{wedding.subtitle}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {wedding.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {wedding.date}
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {wedding.description}
                    </p>
                    
                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {wedding.highlights.slice(0, 3).map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                      {wedding.highlights.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{wedding.highlights.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    {/* Wedding Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {wedding.guests} guests
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4" />
                        {wedding.budget}
                      </div>
                    </div>
                    
                    {/* Engagement Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {wedding.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {wedding.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        {wedding.shares}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        Read Full Story
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-gray-900 mb-4">
                No Wedding Stories Found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any wedding stories matching your criteria. Try adjusting your search or browse different categories.
              </p>
              <Button onClick={() => { setSearchQuery(''); setActiveFilter('all'); }} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Vendors Section */}
      {activeFilter === 'all' && !searchQuery && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Wedding Vendors
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Top-rated professionals who made these beautiful weddings possible
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { name: 'Photography', icon: Camera, color: 'from-blue-500 to-purple-500' },
                { name: 'Decoration', icon: Palette, color: 'from-pink-500 to-red-500' },
                { name: 'Catering', icon: Utensils, color: 'from-green-500 to-teal-500' },
                { name: 'Music & DJ', icon: Music, color: 'from-yellow-500 to-orange-500' },
                { name: 'Transportation', icon: Car, color: 'from-indigo-500 to-blue-500' },
                { name: 'Floral', icon: Flower2, color: 'from-rose-500 to-pink-500' }
              ].map((vendor, index) => {
                const IconComponent = vendor.icon;
                return (
                  <Card key={index} className="group cursor-pointer border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-center">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${vendor.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                        {vendor.name}
                      </h3>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
