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
  TrendingUp,
  Filter,
  Grid3X3,
  List,
  Eye,
  Clock,
  Palette,
  Camera,
  Flower2,
  Sparkles,
  Crown,
  Music,
  Utensils,
  Gift,
  MapPin,
  Calendar,
  Users,
  Star,
  ChevronRight,
  Play,
  Download,
  ExternalLink
} from "lucide-react";

export default function IdeasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const categories = [
    { id: 'all', name: 'All Ideas', icon: Sparkles, count: 24 },
    { id: 'decor', name: 'Decor & Styling', icon: Palette, count: 8 },
    { id: 'photography', name: 'Photography', icon: Camera, count: 6 },
    { id: 'floral', name: 'Floral Arrangements', icon: Flower2, count: 5 },
    { id: 'themes', name: 'Wedding Themes', icon: Crown, count: 5 }
  ];

  const ideas = [
    {
      id: 1,
      title: "Royal Rajasthani Palace Wedding",
      description: "Majestic palace setting with traditional Rajasthani decor, vibrant colors, and royal elegance.",
      category: "themes",
      image: "/api/placeholder/400/300",
      tags: ["Traditional", "Luxury", "Palace", "Rajasthani"],
      views: 15420,
      likes: 892,
      difficulty: "Premium",
      duration: "3-4 days",
      budget: "₹15L - ₹25L",
      trending: true,
      featured: true
    },
    {
      id: 2,
      title: "Minimalist Garden Wedding",
      description: "Clean, elegant outdoor ceremony with natural elements, soft pastels, and modern touches.",
      category: "decor",
      image: "/api/placeholder/400/300",
      tags: ["Modern", "Outdoor", "Minimalist", "Garden"],
      views: 12350,
      likes: 654,
      difficulty: "Moderate",
      duration: "1-2 days",
      budget: "₹5L - ₹10L",
      trending: true
    },
    {
      id: 3,
      title: "Vintage Bollywood Glamour",
      description: "Old-world charm meets Bollywood glitz with art deco elements and golden accents.",
      category: "themes",
      image: "/api/placeholder/400/300",
      tags: ["Vintage", "Bollywood", "Glamour", "Art Deco"],
      views: 9876,
      likes: 543,
      difficulty: "Advanced",
      duration: "2-3 days",
      budget: "₹10L - ₹18L"
    },
    {
      id: 4,
      title: "Rustic Farmhouse Celebration",
      description: "Charming countryside wedding with wooden elements, mason jars, and wildflower arrangements.",
      category: "decor",
      image: "/api/placeholder/400/300",
      tags: ["Rustic", "Farmhouse", "Countryside", "Natural"],
      views: 8765,
      likes: 432,
      difficulty: "Easy",
      duration: "1-2 days",
      budget: "₹3L - ₹7L"
    },
    {
      id: 5,
      title: "Beach Sunset Ceremony",
      description: "Romantic beachside wedding with flowing fabrics, seashell decor, and ocean views.",
      category: "themes",
      image: "/api/placeholder/400/300",
      tags: ["Beach", "Sunset", "Romantic", "Coastal"],
      views: 11234,
      likes: 678,
      difficulty: "Moderate",
      duration: "2 days",
      budget: "₹8L - ₹15L",
      trending: true
    },
    {
      id: 6,
      title: "Traditional South Indian Temple Style",
      description: "Sacred temple-inspired decor with brass elements, jasmine flowers, and classical motifs.",
      category: "themes",
      image: "/api/placeholder/400/300",
      tags: ["Traditional", "South Indian", "Temple", "Sacred"],
      views: 7654,
      likes: 398,
      difficulty: "Advanced",
      duration: "3 days",
      budget: "₹12L - ₹20L"
    },
    {
      id: 7,
      title: "Floral Mandap Masterpiece",
      description: "Stunning mandap design with cascading flowers, intricate patterns, and vibrant colors.",
      category: "floral",
      image: "/api/placeholder/400/300",
      tags: ["Floral", "Mandap", "Colorful", "Intricate"],
      views: 13456,
      likes: 756,
      difficulty: "Advanced",
      duration: "2 days",
      budget: "₹6L - ₹12L",
      featured: true
    },
    {
      id: 8,
      title: "Modern Industrial Chic",
      description: "Contemporary urban wedding with exposed brick, metal accents, and Edison bulb lighting.",
      category: "decor",
      image: "/api/placeholder/400/300",
      tags: ["Modern", "Industrial", "Urban", "Contemporary"],
      views: 6543,
      likes: 321,
      difficulty: "Moderate",
      duration: "1-2 days",
      budget: "₹4L - ₹9L"
    }
  ];

  const filteredIdeas = ideas.filter(idea => {
    const matchesCategory = activeCategory === 'all' || idea.category === activeCategory;
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      case 'Premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Sparkles, text: "Wedding Inspiration" }}
        title="Wedding Ideas &"
        titleGradient="Inspiration"
        description="Discover stunning themes and decor inspiration for your perfect day"
      >
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search ideas by theme, style, or color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'outline'}
                className={`rounded-full ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : ''
                }`}
                onClick={() => setActiveCategory(category.id)}
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
      </EnhancedPageHero>

      <PageContainer className="py-12">
          {/* Results Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-2">
                {filteredIdeas.length} Ideas Found
              </h2>
              <p className="text-gray-600">
                {activeCategory !== 'all' && `Showing ${categories.find(c => c.id === activeCategory)?.name || 'ideas'}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
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

          {/* Ideas Grid */}
          {filteredIdeas.length > 0 ? (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredIdeas.map((idea) => (
                <Card key={idea.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 bg-white">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] bg-gradient-to-br from-red-100 to-amber-100 relative">
                      {/* Placeholder for image */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="w-16 h-16 text-gray-400" />
                      </div>
                      
                      {/* Overlay Actions */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        {idea.trending && (
                          <Badge className="bg-red-600 text-white border-0">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        {idea.featured && (
                          <Badge className="bg-amber-600 text-white border-0">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
                          onClick={() => toggleFavorite(idea.id)}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(idea.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
                          onClick={() => toggleBookmark(idea.id)}
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarks.includes(idea.id) ? 'fill-amber-500 text-amber-500' : 'text-gray-600'}`} />
                        </Button>
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <Button 
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                          size="lg"
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`${getDifficultyColor(idea.difficulty)} border`}>
                        {idea.difficulty}
                      </Badge>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {idea.views.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {idea.likes}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="font-playfair text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                      {idea.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {idea.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {idea.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {idea.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{idea.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {idea.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {idea.budget}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        View Details
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
                No Ideas Found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any ideas matching your criteria. Try adjusting your search or browse different categories.
              </p>
              <Button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}

          {/* Featured Collections */}
          {activeCategory === 'all' && !searchQuery && (
            <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Collections
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Handpicked themes and styles for different wedding preferences
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Traditional Indian', desc: 'Classic ceremonies with rich cultural elements', icon: Crown, color: 'from-red-500 to-orange-500' },
                { title: 'Modern Minimalist', desc: 'Clean, contemporary designs with elegant simplicity', icon: Sparkles, color: 'from-blue-500 to-purple-500' },
                { title: 'Destination Dreams', desc: 'Exotic locations with breathtaking backdrops', icon: MapPin, color: 'from-green-500 to-teal-500' }
              ].map((collection, index) => {
                const IconComponent = collection.icon;
                return (
                  <Card key={index} className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                    <div className={`h-32 bg-gradient-to-br ${collection.color} relative`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute bottom-4 left-4">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        {collection.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{collection.desc}</p>
                      <Button variant="outline" className="w-full">
                        Explore Collection
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            </div>
          )}
      </PageContainer>
    </main>
  );
}
