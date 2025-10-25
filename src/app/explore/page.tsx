"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import IntelligentSearch from "@/components/explore/IntelligentSearch";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import { 
  Search, 
  MapPin, 
  Users, 
  Calendar, 
  Camera, 
  Music, 
  Utensils, 
  Car, 
  Palette, 
  Heart, 
  TrendingUp, 
  Star, 
  ArrowRight,
  Filter,
  Grid3X3,
  List,
  Sparkles,
  Clock,
  DollarSign,
  Award,
  Eye,
  BookOpen,
  Zap,
  Globe,
  Shield,
  CheckCircle,
  ChevronRight,
  Play,
  Image as ImageIcon,
  MessageCircle,
  ThumbsUp
} from "lucide-react";

const categories = [
  {
    id: 'venues',
    title: 'Wedding Venues',
    description: 'Discover perfect venues for your special day',
    icon: MapPin,
    href: '/venues',
    count: '2,500+',
    trending: true,
    featured: true,
    verified: true,
    subcategories: ['Banquet Halls', 'Garden Venues', 'Hotels', 'Resorts', 'Heritage Properties'],
    color: 'from-red-500 to-pink-500',
    stats: { avgRating: 4.8, bookings: '12K+' }
  },
  {
    id: 'vendors',
    title: 'Wedding Vendors',
    description: 'Browse curated vendors for every need',
    icon: Users,
    href: '/vendors',
    count: '5,000+',
    trending: true,
    featured: true,
    verified: true,
    subcategories: ['Photographers', 'Decorators', 'Caterers', 'Makeup Artists', 'Musicians'],
    color: 'from-amber-500 to-orange-500',
    stats: { avgRating: 4.7, bookings: '25K+' }
  },
  {
    id: 'photography',
    title: 'Photography',
    description: 'Capture your moments with top photographers',
    icon: Camera,
    href: '/vendors?category=photography',
    count: '800+',
    trending: false,
    featured: true,
    verified: true,
    subcategories: ['Pre-wedding', 'Wedding Day', 'Candid', 'Traditional', 'Cinematography'],
    color: 'from-purple-500 to-indigo-500',
    stats: { avgRating: 4.9, bookings: '8K+' }
  },
  {
    id: 'catering',
    title: 'Catering',
    description: 'Delicious cuisine for your celebration',
    icon: Utensils,
    href: '/vendors?category=catering',
    count: '600+',
    trending: false,
    featured: false,
    verified: true,
    subcategories: ['North Indian', 'South Indian', 'Continental', 'Chinese', 'Live Counters'],
    color: 'from-green-500 to-teal-500',
    stats: { avgRating: 4.6, bookings: '5K+' }
  },
  {
    id: 'decoration',
    title: 'Decoration',
    description: 'Transform your venue with stunning decor',
    icon: Palette,
    href: '/vendors?category=decoration',
    count: '400+',
    trending: true,
    featured: false,
    verified: true,
    subcategories: ['Floral', 'Lighting', 'Stage Decor', 'Mandap', 'Theme Decoration'],
    color: 'from-pink-500 to-rose-500',
    stats: { avgRating: 4.5, bookings: '3K+' }
  },
  {
    id: 'music',
    title: 'Music & Entertainment',
    description: 'Keep your guests entertained all night',
    icon: Music,
    href: '/vendors?category=music',
    count: '300+',
    trending: false,
    featured: false,
    verified: true,
    subcategories: ['DJ', 'Live Band', 'Classical Music', 'Dhol Players', 'Dancers'],
    color: 'from-blue-500 to-cyan-500',
    stats: { avgRating: 4.4, bookings: '2K+' }
  },
  {
    id: 'transportation',
    title: 'Transportation',
    description: 'Arrive in style with luxury transport',
    icon: Car,
    href: '/vendors?category=transportation',
    count: '200+',
    trending: false,
    featured: false,
    verified: false,
    subcategories: ['Luxury Cars', 'Vintage Cars', 'Horse Carriage', 'Decorated Cars', 'Buses'],
    color: 'from-gray-500 to-slate-500',
    stats: { avgRating: 4.3, bookings: '1K+' }
  },
  {
    id: 'planning',
    title: 'Planning Tools',
    description: 'AI-powered tools to organize your wedding',
    icon: Calendar,
    href: '/planning',
    count: '10+',
    trending: true,
    featured: true,
    verified: false,
    subcategories: ['AI Checklist', 'Smart Budget', 'Guest Manager', 'Timeline', 'Vendor CRM'],
    color: 'from-violet-500 to-purple-500',
    stats: { avgRating: 4.9, bookings: 'New!' }
  }
];

const trendingSearches = [
  { term: 'Banquet Halls in Delhi', count: '2.5K searches', trending: true },
  { term: 'Wedding Photographers', count: '1.8K searches', trending: true },
  { term: 'Destination Wedding', count: '1.2K searches', trending: false },
  { term: 'Mehendi Decoration', count: '950 searches', trending: true },
  { term: 'Bridal Makeup', count: '800 searches', trending: false },
  { term: 'Wedding Catering', count: '750 searches', trending: false },
  { term: 'Pre-wedding Shoot', count: '600 searches', trending: true },
  { term: 'AI Wedding Planning', count: '450 searches', trending: true }
];

const featuredCollections = [
  {
    id: 1,
    title: 'Luxury Wedding Venues',
    description: 'Premium venues for grand celebrations',
    image: '/api/placeholder/400/300',
    count: 150,
    href: '/venues?type=luxury',
    badge: 'Premium',
    rating: 4.9,
    priceRange: '₹2L - ₹10L',
    features: ['5-Star Service', 'Valet Parking', 'Bridal Suite']
  },
  {
    id: 2,
    title: 'Budget-Friendly Options',
    description: 'Beautiful venues under ₹50,000',
    image: '/api/placeholder/400/300',
    count: 300,
    href: '/venues?budget=under-50k',
    badge: 'Best Value',
    rating: 4.6,
    priceRange: '₹15K - ₹50K',
    features: ['Great Food', 'Flexible Packages', 'Free Decoration']
  },
  {
    id: 3,
    title: 'Garden Wedding Venues',
    description: 'Outdoor venues with natural beauty',
    image: '/api/placeholder/400/300',
    count: 200,
    href: '/venues?type=garden',
    badge: 'Nature Lover',
    rating: 4.7,
    priceRange: '₹30K - ₹1.5L',
    features: ['Open Air', 'Natural Beauty', 'Photo Perfect']
  },
  {
    id: 4,
    title: 'Heritage Properties',
    description: 'Royal venues with rich history',
    image: '/api/placeholder/400/300',
    count: 80,
    href: '/venues?type=heritage',
    badge: 'Royal',
    rating: 4.8,
    priceRange: '₹1L - ₹5L',
    features: ['Historic Charm', 'Unique Architecture', 'Royal Experience']
  },
  {
    id: 5,
    title: 'AI-Curated Matches',
    description: 'Personalized venue recommendations',
    image: '/api/placeholder/400/300',
    count: 500,
    href: '/venues?ai=true',
    badge: 'AI Powered',
    rating: 4.9,
    priceRange: 'All Budgets',
    features: ['Smart Matching', 'Personalized', 'Time Saving']
  },
  {
    id: 6,
    title: 'Destination Weddings',
    description: 'Exotic locations for dream weddings',
    image: '/api/placeholder/400/300',
    count: 120,
    href: '/venues?type=destination',
    badge: 'Trending',
    rating: 4.8,
    priceRange: '₹3L - ₹15L',
    features: ['Exotic Locations', 'Full Planning', 'Memorable']
  }
];

const quickStats = [
  { label: 'Happy Couples', value: '50,000+', icon: Heart },
  { label: 'Verified Vendors', value: '5,000+', icon: Award },
  { label: 'Wedding Venues', value: '2,500+', icon: MapPin },
  { label: 'Cities Covered', value: '25+', icon: MapPin }
];

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = selectedCategory 
    ? categories.filter(cat => cat.id === selectedCategory)
    : categories;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Clean AI-First Design */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 dark:from-rose-950/20 dark:via-amber-950/20 dark:to-orange-950/20" />
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-30 dark:opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
          {/* Gradient Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 text-foreground border-0">
              <Sparkles className="w-3 h-3 mr-2" />
              AI-Powered Discovery
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
              Find Everything for Your
              <span className="block bg-gradient-to-r from-primary via-rose-500 to-secondary bg-clip-text text-transparent">
                Perfect Wedding
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Ask anything about venues, vendors, or planning. Our AI assistant understands natural language.
            </p>
          </div>

          {/* Intelligent Search - Clean */}
          <div className="max-w-4xl mx-auto mb-8">
            <IntelligentSearch />
          </div>

          {/* Trending Searches - Minimal */}
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            <span className="text-sm text-muted-foreground">Try:</span>
            {trendingSearches.slice(0, 3).map((search) => (
              <button
                key={search.term}
                className="text-sm px-4 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-border/50 rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                title={search.count}
              >
                {search.term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <PageContainer className="py-16">
        {/* Categories Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Browse by Category
            </h2>
            <p className="text-muted-foreground text-lg">
              Find exactly what you need for your perfect wedding
            </p>
          </div>
          
          {/* Category Grid - Show Top 6 */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.slice(0, 6).map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.id} href={category.href}>
                  <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                        <div className={`h-32 bg-gradient-to-br ${category.color} relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute top-4 left-4">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute top-4 right-4">
                            {category.trending && (
                              <Badge className="bg-white/20 text-white border-white/30">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <span className="text-white/90 text-sm font-medium">
                              {category.count}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                            {category.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            {category.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {category.subcategories.slice(0, 3).map((sub) => (
                              <Badge key={sub} variant="secondary" className="text-xs">
                                {sub}
                              </Badge>
                            ))}
                            {category.subcategories.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{category.subcategories.length - 3}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                            Explore <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* View All Button */}
          {categories.length > 6 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" className="gap-2">
                View All Categories
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Featured Collections - Simplified */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Curated Collections
            </h2>
            <p className="text-muted-foreground text-lg">
              Handpicked selections to inspire your planning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCollections.slice(0, 6).map((collection) => (
              <Link key={collection.id} href={collection.href}>
                <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-900/20 dark:to-amber-900/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-white/90 text-gray-900 mb-2">
                        {collection.count} venues
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 group-hover:text-red-600 transition-colors">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {collection.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        
        {/* CTA Section - Clean */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-rose-500 to-secondary rounded-3xl p-12 md:p-16 text-center text-white">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-90" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Planning?
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of couples planning their perfect wedding
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-12 px-8">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
