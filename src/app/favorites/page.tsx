"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Heart,
  Search,
  Share2,
  Phone,
  MapPin,
  Star,
  Users,
  IndianRupee,
  Grid3X3,
  List,
  SortAsc,
  Plus,
  Trash2,
  X,
  Sparkles,
  Filter,
  BookmarkPlus,
  Calendar,
  Clock,
  Mail,
  MessageCircle,
  Download,
  Upload,
  Edit3,
  Eye,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Zap,
  Shield,
  Award,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FEATURED_VENUES } from "@/data/venues";
import { FEATURED_VENDORS } from "@/data/vendors";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import Link from "next/link";

// Custom lists for organization
const customLists = [
  { id: 'shortlist', name: 'Final Shortlist', count: 8, color: 'bg-red-500', icon: Star },
  { id: 'backup', name: 'Backup Options', count: 12, color: 'bg-amber-500', icon: Shield },
  { id: 'wishlist', name: 'Dream Venues', count: 5, color: 'bg-purple-500', icon: Sparkles },
  { id: 'contacted', name: 'Already Contacted', count: 6, color: 'bg-green-500', icon: CheckCircle },
  { id: 'budget', name: 'Budget Friendly', count: 10, color: 'bg-blue-500', icon: IndianRupee }
];

const sortOptions = [
  { value: 'dateAdded', label: 'Recently Added' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price', label: 'Price Range' },
  { value: 'location', label: 'Location' },
  { value: 'status', label: 'Availability' }
];

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState("venues");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedList, setSelectedList] = useState("all");
  const [showCreateList, setShowCreateList] = useState(false);

  const favoriteVenues = FEATURED_VENUES.slice(0, 6).map((venue) => ({
    ...venue,
    dateAdded: "2 days ago",
    notes: "Perfect for our spring wedding",
    status: "Available" as const,
    list: "shortlist"
  }));
  
  const favoriteVendors = FEATURED_VENDORS.slice(0, 6).map((vendor) => ({
    ...vendor,
    dateAdded: "1 week ago",
    notes: "Great portfolio, within budget",
    status: "Contacted" as const,
    list: "backup"
  }));

  const filteredVenues = favoriteVenues.filter((venue) =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVendors = favoriteVendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const bookItem = (type: string, id: string) => {
    window.alert(`Booking ${type} with ID: ${id}`);
  };

  const shareItem = (type: string, name: string) => {
    window.alert(`Sharing ${type}: ${name}`);
  };

  const removeFromFavorites = (id: string) => {
    window.alert(`Removed ${id} from favorites`);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <EnhancedPageHero
        badge={{ icon: Heart, text: "My Collection" }}
        title="My Favorites"
        titleGradient="Wedding Collection"
        description="Keep track of your favorite venues and vendors in organized lists"
      >
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-0">
            <Heart className="w-3 h-3" />
            {filteredVenues.length + filteredVendors.length} Total Favorites
          </Badge>
          <Badge variant="secondary" className="gap-1 bg-secondary/10 text-secondary border-0">
            <BookmarkPlus className="w-3 h-3" />
            {customLists.length} Custom Lists
          </Badge>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share List
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary via-rose-500 to-secondary text-white">
            <Plus className="w-4 h-4" />
            Create New List
          </Button>
        </div>
      </EnhancedPageHero>

      {/* Main Content */}
      <PageContainer className="py-12">
        {/* Custom Lists */}
        <div className="mb-12">
          <h3 className="font-display text-2xl font-semibold text-foreground mb-6">My Lists</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {customLists.map((list) => {
                const IconComponent = list.icon;
                return (
                  <Card 
                    key={list.id} 
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedList === list.id && "ring-2 ring-red-500"
                    )}
                    onClick={() => setSelectedList(list.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", list.color)}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{list.name}</p>
                          <p className="text-sm text-muted-foreground">{list.count} items</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <TabsList className="grid w-full lg:w-auto grid-cols-2">
              <TabsTrigger value="venues" className="gap-2">
                <MapPin className="w-4 h-4" />
                Venues ({filteredVenues.length})
              </TabsTrigger>
              <TabsTrigger value="vendors" className="gap-2">
                <Users className="w-4 h-4" />
                Vendors ({filteredVendors.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Venues Tab */}
          <TabsContent value="venues" className="space-y-6">
            {filteredVenues.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">No favorite venues yet</h3>
                <p className="text-muted-foreground mb-6">Start exploring venues and add them to your favorites</p>
                <Link href="/venues">
                  <Button className="gap-2">
                    <Search className="w-4 h-4" />
                    Browse Venues
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {filteredVenues.map((venue) => (
                  <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={venue.image} 
                        alt={venue.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={() => removeFromFavorites(venue.id)}
                        >
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={() => shareItem("venue", venue.name)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Badge className="absolute bottom-3 left-3">
                        {venue.status}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{venue.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {venue.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{venue.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Capacity:</span>
                          <span className="font-medium">
                            {typeof venue.capacity === 'object' 
                              ? `${venue.capacity.min}-${venue.capacity.max} guests`
                              : `${venue.capacity} guests`
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Price Range:</span>
                          <span className="font-medium flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" />
                            {venue.priceRange}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Added:</span>
                          <span className="text-muted-foreground/80">{venue.dateAdded}</span>
                        </div>
                      </div>

                      {venue.notes && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <Edit3 className="w-3 h-3 inline mr-1" />
                            {venue.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Link href={`/venues/${venue.id}`} className="flex-1">
                          <Button variant="outline" className="w-full gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                        </Link>
                        <Button className="flex-1 gap-2" onClick={() => bookItem("venue", venue.id)}>
                          <Calendar className="w-4 h-4" />
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-6">
            {filteredVendors.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">No favorite vendors yet</h3>
                <p className="text-muted-foreground mb-6">Start exploring vendors and add them to your favorites</p>
                <Link href="/vendors">
                  <Button className="gap-2">
                    <Search className="w-4 h-4" />
                    Browse Vendors
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {filteredVendors.map((vendor) => (
                  <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={vendor.image} 
                        alt={vendor.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={() => removeFromFavorites(vendor.id)}
                        >
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={() => shareItem("vendor", vendor.name)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Badge className="absolute bottom-3 left-3">
                        {vendor.status}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{vendor.name}</h3>
                          <p className="text-sm text-muted-foreground">{vendor.category}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{vendor.rating}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Reviews:</span>
                          <span className="font-medium">{(vendor as any).reviewCount || 0} reviews</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Price Range:</span>
                          <span className="font-medium flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" />
                            {vendor.priceRange}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Added:</span>
                          <span className="text-muted-foreground/80">{vendor.dateAdded}</span>
                        </div>
                      </div>

                      {vendor.notes && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <Edit3 className="w-3 h-3 inline mr-1" />
                            {vendor.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Link href={`/vendors/${vendor.id}`} className="flex-1">
                          <Button variant="outline" className="w-full gap-2">
                            <Eye className="w-4 h-4" />
                            View Portfolio
                          </Button>
                        </Link>
                        <Button className="flex-1 gap-2" onClick={() => bookItem("vendor", vendor.id)}>
                          <MessageCircle className="w-4 h-4" />
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </PageContainer>
    </main>
  );
}
