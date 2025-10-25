"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowRight, 
  Heart, 
  MapPin, 
  Users, 
  Calendar, 
  Sparkles, 
  Star, 
  CheckCircle,
  Search,
  Clock,
  Shield,
  Zap,
  Camera,
  Music,
  Utensils,
  Flower2,
  Palette,
  IndianRupee,
  MessageCircle,
  TrendingUp
} from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [popularSearches] = useState([
    'Banquet Halls in Delhi',
    'Wedding Photographers',
    'Garden Venues',
    'Catering Services'
  ]);
  
  const searchSuggestions = [
    'Banquet halls under 5 lakhs in Delhi',
    'Garden venues in Noida with 500 capacity',
    'Wedding photographers in Mumbai',
    'Luxury hotels for destination weddings',
    'Beach resorts in Goa for weddings',
    'Heritage venues in Jaipur',
    'Caterers for 300 guests in Bangalore',
    'Makeup artists for South Indian wedding'
  ];
  
  // Auto-rotate placeholder suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % searchSuggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [searchSuggestions.length]);

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Discover Venues",
      description: "Explore handpicked wedding venues with detailed information and transparent pricing.",
      link: "/venues",
      badge: "Verified"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Find Vendors",
      description: "Connect with professional photographers, decorators, caterers, and more.",
      link: "/vendors",
      badge: "Professional"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Plan Smarter",
      description: "Use AI-powered tools to manage your budget, guest list, and timeline.",
      link: "/planning",
      badge: "AI-Powered"
    }
  ];

  const planningTools = [
    {
      title: "Budget Tracker",
      description: "Track expenses and manage your wedding budget effectively",
      icon: <IndianRupee className="w-8 h-8" />,
      link: "/tools/budget",
      badge: "Essential"
    },
    {
      title: "Guest List",
      description: "Manage your guest list, RSVPs, and seating arrangements",
      icon: <Users className="w-8 h-8" />,
      link: "/tools/guests",
      badge: "Popular"
    },
    {
      title: "Checklist",
      description: "Stay organized with task tracking and timeline management",
      icon: <CheckCircle className="w-8 h-8" />,
      link: "/tools/checklist",
      badge: "Essential"
    },
    {
      title: "Timeline",
      description: "Plan your wedding day schedule minute-by-minute",
      icon: <Calendar className="w-8 h-8" />,
      link: "/tools/timeline",
      badge: "New"
    }
  ];

  const vendorCategories = [
    { name: "Photography", icon: <Camera className="w-6 h-6" /> },
    { name: "Catering", icon: <Utensils className="w-6 h-6" /> },
    { name: "Decoration", icon: <Flower2 className="w-6 h-6" /> },
    { name: "Makeup", icon: <Palette className="w-6 h-6" /> },
    { name: "Music & DJ", icon: <Music className="w-6 h-6" /> }
  ];

  const trustSignals = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Listings",
      description: "All venues and vendors are verified for authenticity"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered",
      description: "Smart recommendations tailored to your preferences"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save Time",
      description: "Find everything you need in one place"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Made in India",
      description: "Built for Indian weddings and celebrations"
    }
  ];


  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/explore');
    }
  };

  const handlePopularSearch = (search: string) => {
    router.push(`/explore?q=${encodeURIComponent(search)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Warm & Inviting */}
      <section className="relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 dark:from-rose-950/20 dark:via-amber-950/20 dark:to-orange-950/20" />
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-30 dark:opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }} />
          {/* Gradient Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
        </div>
        
        <PageContainer className="relative z-10 py-20 sm:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge with animation */}
            <div className="animate-fade-in mb-6">
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0 px-4 py-2 text-sm shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Wedding Planning Platform
              </Badge>
            </div>
            
            {/* Main Heading - Modern Font */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
              Your Dream Wedding
              <span className="block bg-gradient-to-r from-primary via-rose-500 to-secondary bg-clip-text text-transparent mt-2">
                Starts Here
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in">
              Discover beautiful venues, connect with trusted vendors, and plan every detail with AI-powered tools.
              <span className="block mt-2 text-base">Built for Indian weddings. 🇮🇳</span>
            </p>
            
            {/* Enhanced Search Bar - Awesome & Intuitive */}
            <div className="max-w-3xl mx-auto mb-8 animate-fade-in">
              <div className="relative group">
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-rose-500/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative flex items-center gap-3 p-3">
                    {/* Search Icon */}
                    <div className="pl-2">
                      <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    
                    {/* Input with animated placeholder */}
                    <div className="flex-1 relative">
                      <Input
                        placeholder={searchSuggestions[currentPlaceholder]}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="border-0 bg-transparent focus-visible:ring-0 text-base h-12 placeholder:text-muted-foreground/60 placeholder:transition-all"
                      />
                    </div>
                    
                    {/* AI-powered button integrated in search bar */}
                    <Button 
                      onClick={handleSearch}
                      size="lg" 
                      className="h-12 px-6 bg-gradient-to-r from-primary via-rose-500 to-secondary hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Popular Searches - Enhanced */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center items-center">
                <span className="text-sm font-medium text-muted-foreground flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Trending:
                </span>
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(search)}
                    className="text-sm px-4 py-2 bg-white dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary/20 text-foreground rounded-full transition-all border border-border hover:border-primary/50 shadow-sm hover:shadow-md"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quick Action Buttons - Enhanced */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="h-12 px-6 shadow-lg hover:shadow-xl transition-all">
                <Link href="/venues">
                  <MapPin className="w-5 h-5 mr-2" />
                  Browse Venues
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 border-2 hover:bg-accent shadow-lg hover:shadow-xl transition-all">
                <Link href="/vendors">
                  <Users className="w-5 h-5 mr-2" />
                  Find Vendors
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Verified listings</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-secondary" />
                <span>AI-powered</span>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Features Section - Enhanced Cards */}
      <section className="py-20 bg-gradient-to-b from-background via-muted/30 to-background">
        <PageContainer>
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Heart className="w-3 h-3 mr-1" />
              Core Features
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From discovering venues to managing every detail with AI assistance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link key={index} href={feature.link}>
                <Card className="h-full p-8 hover:shadow-2xl transition-all duration-500 group cursor-pointer border-border bg-gradient-to-br from-background to-muted/20 hover:scale-105 relative overflow-hidden">
                  {/* Decorative gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:w-40 group-hover:h-40 transition-all duration-500" />
                  
                  <CardContent className="p-0 relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                        {feature.icon}
                      </div>
                      <Badge className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 text-foreground border-0 text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-base mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                      <span className="mr-2">Explore</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Vendor Categories Section - Colorful */}
      <section className="py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:to-secondary/10" />
        
        <PageContainer className="relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Users className="w-3 h-3 mr-1" />
              Vendor Network
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Trusted Wedding Vendors
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect with verified professionals for every aspect of your celebration
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
            {vendorCategories.map((category, index) => (
              <Link key={index} href={`/vendors?category=${category.name.toLowerCase()}`}>
                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 group cursor-pointer border-border bg-white dark:bg-gray-800 hover:scale-110 relative overflow-hidden">
                  {/* Gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 dark:group-hover:from-primary/20 dark:group-hover:to-secondary/20 transition-all duration-300" />
                  
                  <CardContent className="p-0 relative z-10">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 text-primary group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                        {category.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Planning Tools Section - Glass Cards */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
        <PageContainer>
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0 mb-4 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Tools
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Plan Smarter, Not Harder
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Let AI handle the complexity while you focus on the joy
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {planningTools.map((tool, index) => (
              <Link key={index} href={tool.link}>
                <Card className="h-full p-6 hover:shadow-2xl transition-all duration-500 group cursor-pointer border-border backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 hover:scale-105 relative overflow-hidden">
                  {/* Animated gradient orb */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
                  
                  <CardContent className="p-0 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 text-primary group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-md">
                        {tool.icon}
                      </div>
                      <Badge className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 text-foreground border-0 text-xs shadow-sm">
                        {tool.badge}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-2 transition-transform">
                      <span className="mr-2">Try Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Trust Signals Section - Modern Grid */}
      <section className="py-20 relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:to-secondary/10" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-l from-secondary/10 to-transparent rounded-full blur-3xl" />
        
        <PageContainer className="relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Shield className="w-3 h-3 mr-1" />
              Our Commitment
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Choose WedSpace
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Designed specifically for Indian weddings and celebrations
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustSignals.map((signal, index) => (
              <Card key={index} className="p-8 text-center border-border hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-muted/30 dark:from-gray-800 dark:to-gray-900 group hover:scale-105 relative overflow-hidden">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <CardContent className="p-0 relative z-10">
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 text-primary shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      {signal.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-foreground group-hover:text-primary transition-colors">
                    {signal.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {signal.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Success Stories - Coming Soon - Beautiful */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/40 to-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-rose-200/20 to-transparent dark:from-rose-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-amber-200/20 to-transparent dark:from-amber-900/20 rounded-full blur-3xl" />
        
        <PageContainer className="relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-8 inline-flex p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-rose-500/10 to-secondary/10 dark:from-primary/20 dark:via-rose-500/20 dark:to-secondary/20 shadow-xl animate-pulse">
              <Star className="w-12 h-12 text-primary" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Love Stories & Celebrations
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Real couples, real weddings, real happiness. We're collecting beautiful stories from our community to inspire your special day.
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-gray-800 border-2 border-dashed border-primary/30 shadow-lg">
              <Clock className="w-5 h-5 text-primary animate-pulse" />
              <span className="font-semibold text-foreground">Coming Soon</span>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Final CTA Section - Grand & Inviting */}
      <section className="relative py-24 overflow-hidden">
        {/* Vibrant gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-rose-500 to-secondary" />
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }} />
        {/* Decorative orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <PageContainer className="relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="mb-6">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2 text-sm shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Your Journey
              </Badge>
            </div>
            
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to Plan Your
              <span className="block mt-2">Dream Wedding?</span>
            </h2>
            
            <p className="text-xl sm:text-2xl mb-12 opacity-95 leading-relaxed max-w-2xl mx-auto">
              Join couples across India who are planning smarter with AI-powered tools and verified vendors
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="h-14 px-10 bg-white text-primary hover:bg-white/90 shadow-2xl hover:shadow-white/50 transition-all text-lg font-semibold">
                <Link href="/auth/signup">
                  <Heart className="w-5 h-5 mr-2" />
                  Start Planning Free
                </Link>
              </Button>
              <Button asChild size="lg" className="h-14 px-10 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white hover:text-primary shadow-2xl transition-all text-lg font-semibold">
                <Link href="/explore">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Explore with AI
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-base opacity-95">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="font-medium">Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="font-medium">No hidden fees</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="font-medium">Verified vendors</span>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
