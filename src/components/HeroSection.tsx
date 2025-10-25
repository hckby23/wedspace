"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowRight, Sparkles, Heart, Star } from 'lucide-react';
import SearchBar from './search/SearchBar';
import Section from './layout/Section';

const HeroSection: React.FC = () => {
  const handleSearch = (query: string) => {
    // Navigate to search with query
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-primary/20 rounded-full" />
        <div className="absolute top-40 right-20 w-24 h-24 border border-secondary/20 rounded-full" />
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-primary/20 rounded-full" />
      </div>
      
      <Section className="py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                <Sparkles className="w-3 h-3 mr-1" />
                India's First AI-Powered Platform
              </Badge>
              
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Dream Wedding,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Made Simple
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Discover perfect venues, connect with trusted vendors, and plan every detail with AI-powered recommendations tailored for Indian weddings.
              </p>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="font-medium">4.9/5</span>
                <span className="ml-1">from 10K+ couples</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 text-red-400 mr-1" />
                <span>50K+ happy weddings</span>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="space-y-4">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Search venues, vendors, or wedding ideas..."
                placeholderSuggestions={[
                  'Wedding photographers in Mumbai',
                  'Banquet halls in Delhi',
                  'Beach wedding venues in Goa',
                  'Catering services under ₹1.5L'
                ]}
                className="max-w-lg"
              />
              <p className="text-sm text-muted-foreground">
                Popular: <span className="text-primary cursor-pointer hover:underline">Banquet Halls</span>, 
                <span className="text-primary cursor-pointer hover:underline ml-1">Photographers</span>, 
                <span className="text-primary cursor-pointer hover:underline ml-1">Destination Weddings</span>
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                <Link href="/venues">
                  Explore Venues
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 hover:bg-primary/5">
                <Link href="/planning">
                  Start Planning
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Main Image Container */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl shadow-2xl overflow-hidden border border-border/50">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-playfair text-2xl font-semibold text-foreground">
                      Beautiful Venues
                    </h3>
                    <p className="text-muted-foreground">
                      Curated collection of India's finest wedding venues
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Verified Vendors</div>
                    <div className="text-xs text-muted-foreground">5000+ trusted partners</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-sm font-medium">AI Recommendations</div>
                    <div className="text-xs text-muted-foreground">Personalized for you</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </section>
  );
};

export default HeroSection;
