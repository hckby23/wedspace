"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Star, MapPin, Users, Calendar } from 'lucide-react';
import { ListingFilters } from '@/hooks/useListings';

interface VenueFiltersProps {
  onFilterChange: (filters: Partial<ListingFilters>) => void;
  initialFilters?: Partial<ListingFilters>;
}

const VenueFilters: React.FC<VenueFiltersProps> = ({ onFilterChange, initialFilters }) => {
  const [city, setCity] = useState<string>(initialFilters?.city || '');
  const [minPrice, setMinPrice] = useState<number>(initialFilters?.min_price || 0);
  const [maxPrice, setMaxPrice] = useState<number>(initialFilters?.max_price || 500000);
  const [minRating, setMinRating] = useState<number>(initialFilters?.min_rating || 0);
  const [guestCount, setGuestCount] = useState<number>(initialFilters?.guest_count || 100);
  const [selectedDate, setSelectedDate] = useState<string>(initialFilters?.date || '');
  
  const locationAreas = [
    'Delhi', 'New Delhi', 'South Delhi', 'Central Delhi',
    'Noida', 'Greater Noida', 'Gurugram', 'Ghaziabad', 'Faridabad'
  ];
  
  const ratingOptions = [
    { value: 0, label: 'Any Rating' },
    { value: 3, label: '3+ Stars' },
    { value: 4, label: '4+ Stars' },
    { value: 4.5, label: '4.5+ Stars' },
    { value: 5, label: '5 Stars Only' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'ai', label: 'AI Recommended' }
  ];
  
  const applyFilters = () => {
    const filters: Partial<ListingFilters> = {
      kind: 'venue'
    };
    
    if (city) filters.city = city;
    if (minPrice > 0) filters.min_price = minPrice;
    if (maxPrice < 500000) filters.max_price = maxPrice;
    if (minRating > 0) filters.min_rating = minRating;
    if (guestCount > 100) filters.guest_count = guestCount;
    if (selectedDate) filters.date = selectedDate;
    
    onFilterChange(filters);
  };
  
  const resetFilters = () => {
    setCity('');
    setMinPrice(0);
    setMaxPrice(500000);
    setMinRating(0);
    setGuestCount(100);
    setSelectedDate('');
    onFilterChange({ kind: 'venue' });
  };

  // Helper function to format price in Indian format
  const formatIndianPrice = (price: number) => {
    return '₹' + price.toLocaleString('en-IN');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      {/* Location Filter */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <MapPin className="w-4 h-4 text-red-600" />
          Location in Delhi NCR
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Enter city or area"
            className="pl-10"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {locationAreas.slice(0, 6).map((area) => (
            <button
              key={area}
              onClick={() => setCity(area)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                city === area
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-background text-muted-foreground border-border hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-semibold">Price Range</Label>
          <span className="text-sm text-muted-foreground">
            {formatIndianPrice(minPrice)} - {formatIndianPrice(maxPrice)}
          </span>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Min Price</Label>
              <Input
                type="number"
                placeholder="0"
                value={minPrice || ''}
                onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Max Price</Label>
              <Input
                type="number"
                placeholder="500000"
                value={maxPrice || ''}
                onChange={(e) => setMaxPrice(Number(e.target.value) || 500000)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Guest Count Filter */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Users className="w-4 h-4 text-red-600" />
            Guest Capacity
          </Label>
          <span className="text-sm text-muted-foreground">
            {guestCount}+ guests
          </span>
        </div>
        <Slider
          value={[guestCount]}
          onValueChange={(value) => setGuestCount(value[0])}
          min={50}
          max={1500}
          step={50}
          className="w-full"
        />
      </div>
      
      {/* Rating Filter */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Star className="w-4 h-4 text-red-600" />
          Minimum Rating
        </Label>
        <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            {ratingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Date Filter */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Calendar className="w-4 h-4 text-red-600" />
          Event Date
        </Label>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2" 
          onClick={resetFilters}
        >
          <X size={16} />
          Reset Filters
        </Button>
        <Button 
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default VenueFilters;
