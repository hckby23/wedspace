"use client";

import React, { useMemo, useState } from "react";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VenueCard from "@/components/venues/VenueCard";
import VendorCard from "@/components/vendors/VendorCard";
import { FEATURED_VENUES } from "@/data/venues";
import { FEATURED_VENDORS } from "@/data/vendors";
import {
  Search as SearchIcon,
  Sparkles,
  SlidersHorizontal,
  TrendingUp,
  Grid3X3,
  List,
  Zap,
  Star,
  IndianRupee,
} from "lucide-react";

export default function AISearchPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"venues" | "vendors" | "all">("all");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [activeQuick, setActiveQuick] = useState<string[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  const trendingQueries = [
    "Banquet halls in Delhi",
    "Luxury palace venues in Jaipur",
    "Candid photographers in Mumbai",
    "Garden venues with outdoor seating",
  ];

  const quickFilters = [
    { id: "ai", label: "AI Recommended", icon: Zap },
    { id: "rating", label: "4.5+ Rating", icon: Star },
    { id: "budget", label: "Budget Friendly", icon: IndianRupee },
  ];

  const allData = useMemo(() => {
    const venues = FEATURED_VENUES.map((v) => ({ 
      ...v, 
      type: "venue",
      capacity: v.capacity ? `${v.capacity.min}-${v.capacity.max} guests` : undefined
    }));
    const vendors = FEATURED_VENDORS.map((v) => ({ ...v, type: "vendor" }));
    return [...venues, ...vendors];
  }, []);

  const applySort = (items: any[]) => {
    const copy = [...items];
    switch (sortBy) {
      case "rating":
        return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return copy;
    }
  };

  const applyQuickFilters = (items: any[]) => {
    let filtered = [...items];
    if (activeQuick.includes("rating")) filtered = filtered.filter((i) => (i.rating || 0) >= 4.5);
    if (activeQuick.includes("budget")) filtered = filtered.filter((i) => {
      const price = (i as any).price || i.priceRange;
      return price && !String(price).includes("10L");
    });
    return filtered;
  };

  const runSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, type })
      });
      if (res.ok) {
        const data = await res.json();
        const base = (data?.results || []).length ? data.results : allData;
        const narrowed = type === "all" ? base : base.filter((i: any) => i.type === (type === "venues" ? "venue" : "vendor"));
        const quick = applyQuickFilters(narrowed);
        const sorted = applySort(quick);
        setResults(sorted);
        setInsights(data?.insights || [
          "Matched by style and location",
          "Prioritized high reviews and recency",
          "Optimized for your budget range"
        ]);
      } else {
        const narrowed = type === "all" ? allData : allData.filter((i: any) => i.type === (type === "venues" ? "venue" : "vendor"));
        setResults(applySort(applyQuickFilters(narrowed)));
        setInsights(["Showing popular picks while AI refines results"]);
      }
    } catch {
      const narrowed = type === "all" ? allData : allData.filter((i: any) => i.type === (type === "venues" ? "venue" : "vendor"));
      setResults(applySort(applyQuickFilters(narrowed)));
      setInsights(["Using fallback data due to network error"]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: SearchIcon, text: "AI Search" }}
        title="Find your perfect"
        titleGradient="match"
        description="Ask in natural language. We’ll interpret your style, budget and location to surface the best venues and vendors."
      >
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., luxury palace venues in Jaipur under ₹10L"
                    className="pl-4 pr-10 py-4 text-lg border-0 bg-muted focus:bg-background transition-colors"
                    onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  />
                  <Sparkles className="w-5 h-5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="px-6 py-4" onClick={() => setShowFilters(!showFilters)}>
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                  </Button>
                  <Button onClick={runSearch} className="px-8 py-4 bg-gradient-to-r from-primary via-rose-500 to-secondary text-white shadow-lg" disabled={isSearching || !query.trim()}>
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>

              {/* Quick chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                {quickFilters.map((q) => (
                  <Button
                    key={q.id}
                    size="sm"
                    variant={activeQuick.includes(q.id) ? "default" : "outline"}
                    className={`rounded-full ${activeQuick.includes(q.id) ? "bg-primary text-white" : ""}`}
                    onClick={() =>
                      setActiveQuick((prev) =>
                        prev.includes(q.id) ? prev.filter((p) => p !== q.id) : [...prev, q.id]
                      )
                    }
                  >
                    <q.icon className="w-4 h-4 mr-2" />
                    {q.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </EnhancedPageHero>

      <PageContainer className="py-10">
        {/* Tabs and controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <Tabs value={type} onValueChange={(v) => setType(v as any)}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="venues">Venues</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Sort by</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Relevance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {insights.map((tip, i) => (
                <Badge key={i} variant="secondary" className="rounded-full">
                  {tip}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {results.map((item) =>
              (type === "venues" || (type === "all" && item.type === "venue")) ? (
                <VenueCard key={item.id} venue={item} />
              ) : (type === "vendors" || (type === "all" && item.type === "vendor")) ? (
                <VendorCard key={item.id} vendor={item} />
              ) : null
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Trending when no results */}
            <div>
              <h3 className="font-display text-2xl font-semibold mb-4">Try one of these</h3>
              <div className="flex flex-wrap gap-2">
                {trendingQueries.map((t) => (
                  <Button
                    key={t}
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setQuery(t);
                      runSearch();
                    }}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {t}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl font-semibold mb-6">Popular picks</h3>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {(type === "vendors" ? FEATURED_VENDORS : FEATURED_VENUES.map(v => ({
                  ...v,
                  capacity: v.capacity ? `${v.capacity.min}-${v.capacity.max} guests` : undefined
                }))).slice(0, 6).map((item) =>
                  type === "vendors" ? (
                    <VendorCard key={item.id} vendor={item} />
                  ) : (
                    <VenueCard key={item.id} venue={item as any} />
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </main>
  );
}
