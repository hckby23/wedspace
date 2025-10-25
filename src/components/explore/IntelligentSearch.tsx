"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Search,
  Sparkles,
  TrendingUp,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Loader2,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchSuggestion {
  text: string;
  type: 'venue' | 'vendor' | 'location' | 'budget';
  icon?: React.ReactNode;
}

interface AIInsight {
  type: 'tip' | 'match' | 'trend';
  text: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function IntelligentSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Smart suggestions based on input
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setInsights([]);
      return;
    }

    // Simulate AI processing
    const timeout = setTimeout(() => {
      generateSmartSuggestions(query);
      generateAIInsights(query);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const generateSmartSuggestions = (input: string) => {
    const lowerInput = input.toLowerCase();
    const newSuggestions: SearchSuggestion[] = [];

    // Location-based suggestions
    if (lowerInput.includes('delhi') || lowerInput.includes('mumbai') || lowerInput.includes('jaipur')) {
      newSuggestions.push({
        text: `Luxury venues in ${lowerInput.split(' ').find(w => w.length > 3)}`,
        type: 'venue',
        icon: <MapPin className="w-4 h-4" />
      });
    }

    // Budget-based suggestions
    if (lowerInput.includes('budget') || lowerInput.includes('cheap') || lowerInput.includes('affordable')) {
      newSuggestions.push({
        text: 'Budget-friendly venues under ₹50,000',
        type: 'budget',
        icon: <DollarSign className="w-4 h-4" />
      });
    }

    // Vendor suggestions
    if (lowerInput.includes('photo') || lowerInput.includes('makeup') || lowerInput.includes('caterer')) {
      newSuggestions.push({
        text: 'Top rated photographers in your city',
        type: 'vendor',
        icon: <Users className="w-4 h-4" />
      });
    }

    // Default smart suggestions
    if (newSuggestions.length === 0) {
      newSuggestions.push(
        { text: `${input} in Delhi`, type: 'location', icon: <MapPin className="w-4 h-4" /> },
        { text: `Top rated ${input}`, type: 'vendor', icon: <Users className="w-4 h-4" /> },
        { text: `${input} packages`, type: 'budget', icon: <DollarSign className="w-4 h-4" /> }
      );
    }

    setSuggestions(newSuggestions.slice(0, 5));
  };

  const generateAIInsights = (input: string) => {
    const lowerInput = input.toLowerCase();
    const newInsights: AIInsight[] = [];

    if (lowerInput.includes('venue')) {
      newInsights.push({
        type: 'tip',
        text: 'Book 6-12 months in advance for best availability',
        action: { label: 'View Available Dates', href: '/venues' }
      });
      
      newInsights.push({
        type: 'match',
        text: '12 venues match your criteria',
        action: { label: 'View Matches', href: '/venues' }
      });
    }

    if (lowerInput.includes('budget') || lowerInput.includes('price')) {
      newInsights.push({
        type: 'tip',
        text: 'Off-season bookings can save you 20-30%',
        action: { label: 'Calculate Budget', href: '/tools/budget' }
      });
    }

    if (lowerInput.includes('photo')) {
      newInsights.push({
        type: 'trend',
        text: 'Candid photography is trending this season',
        action: { label: 'Browse Photographers', href: '/vendors?category=photography' }
      });
    }

    setInsights(newInsights.slice(0, 3));
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setShowResults(true);

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      // Route to search results
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }, 800);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Search Input */}
      <div className="relative">
        <div className={`relative flex items-center transition-all duration-300 ${
          isFocused ? 'scale-105' : 'scale-100'
        }`}>
          <div className="absolute left-4 pointer-events-none">
            {isSearching ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyPress={handleKeyPress}
            placeholder="Search venues, vendors, or ask questions..."
            className="w-full h-14 pl-12 pr-32 text-lg rounded-2xl border-2 border-border/50 bg-white dark:bg-gray-900 focus:border-primary shadow-lg focus:shadow-xl transition-all"
          />
          
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-24 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          
          <Button
            onClick={handleSearch}
            disabled={!query.trim() || isSearching}
            className="absolute right-2 h-10 px-6 rounded-xl"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* AI Badge */}
        {query && insights.length > 0 && (
          <div className="absolute -top-3 left-6">
            <Badge className="bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Insights
            </Badge>
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {(isFocused || showResults) && query && (suggestions.length > 0 || insights.length > 0) && (
        <Card className="absolute top-full mt-2 w-full p-4 shadow-2xl border-2 border-border/50 z-50 max-h-[500px] overflow-y-auto">
          {/* AI Insights */}
          {insights.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Smart Insights</h3>
              </div>
              <div className="space-y-2">
                {insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {insight.type === 'tip' && <Lightbulb className="w-3 h-3 text-amber-500" />}
                          {insight.type === 'match' && <CheckCircle className="w-3 h-3 text-green-500" />}
                          {insight.type === 'trend' && <TrendingUp className="w-3 h-3 text-blue-500" />}
                          <span className="text-xs font-medium text-muted-foreground capitalize">
                            {insight.type}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{insight.text}</p>
                      </div>
                      {insight.action && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => router.push(insight.action!.href)}
                        >
                          {insight.action.label}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Suggestions</h3>
              <div className="space-y-1">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left group"
                  >
                    <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {suggestion.icon || <Search className="w-4 h-4" />}
                    </div>
                    <span className="flex-1 text-sm text-foreground group-hover:text-primary transition-colors">
                      {suggestion.text}
                    </span>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {suggestion.type}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results hint */}
          {suggestions.length === 0 && insights.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Start typing to see suggestions...</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
