"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Section from '@/components/layout/Section';
import PageContainer from '@/components/layout/PageContainer';
import { FEATURED_VENUES, searchVenues, filterVenuesByCity, getVenueCities } from '@/data/venues';
import { MOCK_VENDORS, searchVendors, filterVendorsByCategory, getVendorCategories } from '@/data/mockVendors';
import { getMockAvailability, getUrgencyInfo } from '@/data/mockAvailability';
import { 
  Calendar as CalendarIcon, 
  Search, 
  MapPin, 
  Star, 
  Users,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function CalendarDemoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Filter venues and vendors
  const filteredVenues = searchQuery 
    ? searchVenues(searchQuery)
    : selectedCity !== 'all' 
      ? filterVenuesByCity(selectedCity)
      : FEATURED_VENUES;

  const filteredVendors = searchQuery
    ? searchVendors(searchQuery)
    : selectedCategory !== 'all'
      ? filterVendorsByCategory(selectedCategory)
      : MOCK_VENDORS;

  const cities = getVenueCities();
  const categories = getVendorCategories();

  // Get availability for selected venue/vendor
  const selectedEntityId = selectedVenue || selectedVendor;
  const availability = selectedEntityId ? getMockAvailability(selectedEntityId) : [];
  const urgencyInfo = selectedEntityId ? getUrgencyInfo(selectedEntityId) : null;

  // Get next 30 days for calendar display
  const getNext30Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const next30Days = getNext30Days();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'booked':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'blocked':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
      default:
        return 'bg-gray-50 dark:bg-gray-900 text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-3 h-3" />;
      case 'booked':
        return <XCircle className="w-3 h-3" />;
      case 'blocked':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <Section className="bg-gradient-to-br from-red-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Calendar & Availability Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Explore real-time availability for venues and vendors
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search venues or vendors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="all">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="venues" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="venues">Venues ({filteredVenues.length})</TabsTrigger>
              <TabsTrigger value="vendors">Vendors ({filteredVendors.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="venues" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVenues.slice(0, 6).map((venue) => {
                  const venueUrgency = getUrgencyInfo(venue.id);
                  return (
                    <Card 
                      key={venue.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedVenue === venue.id ? 'ring-2 ring-red-600' : ''
                      }`}
                      onClick={() => {
                        setSelectedVenue(venue.id);
                        setSelectedVendor(null);
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{venue.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{venue.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{venue.rating}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                            <span className="font-medium">{venue.capacity.min} - {venue.capacity.max}</span>
                          </div>
                          {venueUrgency && (
                            <Badge 
                              variant={venueUrgency.urgencyLevel === 'high' ? 'destructive' : 'outline'}
                              className="w-full justify-center"
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {venueUrgency.message}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="vendors" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVendors.map((vendor) => {
                  const vendorUrgency = getUrgencyInfo(vendor.id);
                  return (
                    <Card 
                      key={vendor.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedVendor === vendor.id ? 'ring-2 ring-red-600' : ''
                      }`}
                      onClick={() => {
                        setSelectedVendor(vendor.id);
                        setSelectedVenue(null);
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{vendor.name}</CardTitle>
                            <Badge variant="outline" className="mt-2">
                              {vendor.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{vendor.rating}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>{vendor.city}</span>
                          </div>
                          {vendorUrgency && (
                            <Badge 
                              variant={vendorUrgency.urgencyLevel === 'high' ? 'destructive' : 'outline'}
                              className="w-full justify-center"
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {vendorUrgency.message}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* Calendar Display */}
          {selectedEntityId && (
            <Card className="mt-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Availability Calendar
                  </CardTitle>
                  {urgencyInfo && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{urgencyInfo.availableCount}</span> of{' '}
                      <span className="font-medium">{urgencyInfo.totalCount}</span> dates available
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {next30Days.map((date) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const slot = availability.find(a => a.date === dateStr);
                    const isSelected = selectedDate === dateStr;
                    
                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`
                          p-3 rounded-lg border transition-all text-center
                          ${isSelected ? 'ring-2 ring-red-600' : ''}
                          ${slot ? getStatusColor(slot.status) : 'border-gray-200 dark:border-gray-700'}
                          hover:shadow-md
                        `}
                      >
                        <div className="text-sm font-medium">{date.getDate()}</div>
                        {slot && (
                          <div className="flex items-center justify-center mt-1">
                            {getStatusIcon(slot.status)}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Blocked</span>
                  </div>
                </div>

                {/* Selected Date Info */}
                {selectedDate && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Selected Date: {new Date(selectedDate).toLocaleDateString()}</h4>
                    {availability.find(a => a.date === selectedDate) ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>
                          <Badge className={getStatusColor(availability.find(a => a.date === selectedDate)!.status)}>
                            {availability.find(a => a.date === selectedDate)!.status}
                          </Badge>
                        </div>
                        {availability.find(a => a.date === selectedDate)!.price_override && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Price:</span>
                            <span className="font-medium">
                              ₹{availability.find(a => a.date === selectedDate)!.price_override?.toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">No availability data for this date</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!selectedEntityId && (
            <Card className="mt-8">
              <CardContent className="py-12 text-center">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Select a venue or vendor to view availability calendar
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </Section>
    </PageContainer>
  );
}
