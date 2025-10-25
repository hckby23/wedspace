"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const HeroSearch: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("venues");
  
  // Venues search state
  const [venueLocation, setVenueLocation] = useState<string>("");
  const [venueDate, setVenueDate] = useState<string>("");
  const [venueGuests, setVenueGuests] = useState<string>("50-100");
  
  // Vendors search state
  const [vendorType, setVendorType] = useState<string>("photographer");
  const [vendorLocation, setVendorLocation] = useState<string>("");

  const handleVenuesSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (venueLocation) params.append('location', venueLocation);
    if (venueDate) params.append('date', venueDate);
    if (venueGuests) params.append('guests', venueGuests);
    
    router.push(`/venues?${params.toString()}`);
  };

  const handleVendorsSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (vendorType) params.append('type', vendorType);
    if (vendorLocation) params.append('location', vendorLocation);
    
    router.push(`/vendors?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-[var(--bg-card)] rounded-xl shadow-lg border-0 text-[var(--text)]">
      <CardContent className="p-1">
        <Tabs 
          defaultValue="venues" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="venues" className="data-[state=active]:bg-wed/10 data-[state=active]:text-wed">
              Find Venues
            </TabsTrigger>
            <TabsTrigger value="vendors" className="data-[state=active]:bg-space/10 data-[state=active]:text-space">
              Find Vendors
            </TabsTrigger>
          </TabsList>
          
          {/* Venues Search */}
          <TabsContent value="venues" className="mt-0 p-4">
            <form onSubmit={handleVenuesSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="City, state or zip code"
                    className="pl-10"
                    value={venueLocation}
                    onChange={(e) => setVenueLocation(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="date"
                    placeholder="Wedding Date"
                    className="pl-10"
                    value={venueDate}
                    onChange={(e) => setVenueDate(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Select value={venueGuests} onValueChange={setVenueGuests}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Guest Count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-50">1-50 guests</SelectItem>
                      <SelectItem value="50-100">50-100 guests</SelectItem>
                      <SelectItem value="100-200">100-200 guests</SelectItem>
                      <SelectItem value="200-300">200-300 guests</SelectItem>
                      <SelectItem value="300+">300+ guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  className="bg-wed hover:bg-wed/90 px-6 min-w-[150px]"
                >
                  <Search className="mr-2" size={18} />
                  Search Venues
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center text-sm">
                <span className="text-gray-500">Popular searches:</span>
                <button 
                  type="button" 
                  className="text-wed hover:underline"
                  onClick={() => {
                    setVenueLocation("Los Angeles");
                    router.push("/venues?location=Los+Angeles");
                  }}
                >
                  Los Angeles
                </button>
                <button 
                  type="button" 
                  className="text-wed hover:underline"
                  onClick={() => {
                    setVenueLocation("New York");
                    router.push("/venues?location=New+York");
                  }}
                >
                  New York
                </button>
                <button 
                  type="button" 
                  className="text-wed hover:underline"
                  onClick={() => router.push("/venues?type=garden")}
                >
                  Garden Venues
                </button>
                <button 
                  type="button" 
                  className="text-wed hover:underline"
                  onClick={() => router.push("/venues?type=beach")}
                >
                  Beach Venues
                </button>
              </div>
            </form>
          </TabsContent>
          
          {/* Vendors Search */}
          <TabsContent value="vendors" className="mt-0 p-4">
            <form onSubmit={handleVendorsSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select value={vendorType} onValueChange={setVendorType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vendor Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photographer">Photographer</SelectItem>
                    <SelectItem value="videographer">Videographer</SelectItem>
                    <SelectItem value="florist">Florist</SelectItem>
                    <SelectItem value="caterer">Caterer</SelectItem>
                    <SelectItem value="dj">DJ / Music</SelectItem>
                    <SelectItem value="planner">Wedding Planner</SelectItem>
                    <SelectItem value="cake">Cake & Desserts</SelectItem>
                    <SelectItem value="makeup">Hair & Makeup</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="City, state or zip code"
                    className="pl-10"
                    value={vendorLocation}
                    onChange={(e) => setVendorLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  className="bg-space hover:bg-space/90 px-6 min-w-[150px]"
                >
                  <Search className="mr-2" size={18} />
                  Search Vendors
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center text-sm">
                <span className="text-gray-500">Popular searches:</span>
                <button 
                  type="button" 
                  className="text-space hover:underline"
                  onClick={() => {
                    setVendorType("photographer");
                    router.push("/vendors?type=photographer");
                  }}
                >
                  Photographers
                </button>
                <button 
                  type="button" 
                  className="text-space hover:underline"
                  onClick={() => {
                    setVendorType("florist");
                    router.push("/vendors?type=florist");
                  }}
                >
                  Florists
                </button>
                <button 
                  type="button" 
                  className="text-space hover:underline"
                  onClick={() => {
                    setVendorType("caterer");
                    router.push("/vendors?type=caterer");
                  }}
                >
                  Caterers
                </button>
                <button 
                  type="button" 
                  className="text-space hover:underline"
                  onClick={() => {
                    setVendorType("dj");
                    router.push("/vendors?type=dj");
                  }}
                >
                  DJs & Musicians
                </button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HeroSearch;
