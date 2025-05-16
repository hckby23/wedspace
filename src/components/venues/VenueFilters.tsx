
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, X } from 'lucide-react';

interface VenueFiltersProps {
  onFilterChange: (filters: any) => void;
}

const VenueFilters: React.FC<VenueFiltersProps> = ({ onFilterChange }) => {
  const [locationInput, setLocationInput] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 500000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [capacity, setCapacity] = useState<number[]>([100]);
  
  const locationAreas = [
    'Delhi', 'New Delhi', 'South Delhi', 'Central Delhi',
    'Noida', 'Greater Noida', 'Gurugram', 'Ghaziabad', 'Faridabad'
  ];
  
  const venueTypes = [
    'Hotel', '5-Star', 'Resort', 'Banquet Hall', 
    'Garden', 'Palace', 'Heritage', 'Golf Course', 
    'Farmhouse', 'Beach', 'Poolside', 'Modern'
  ];
  
  const amenities = [
    'In-house Catering', 'Alcohol License', 'DJ Allowed', 'Parking',
    'Accommodation', 'Air Conditioning', 'Bridal Room', 'Outdoor Lawn',
    'Swimming Pool', 'Valet Service', 'Decor Included', 'Wifi'
  ];
  
  const handleTypeChange = (type: string) => {
    setSelectedTypes(current => 
      current.includes(type) 
        ? current.filter(t => t !== type)
        : [...current, type]
    );
  };
  
  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities(current => 
      current.includes(amenity) 
        ? current.filter(a => a !== amenity)
        : [...current, amenity]
    );
  };
  
  const applyFilters = () => {
    onFilterChange({
      location: locationInput,
      priceRange,
      types: selectedTypes,
      amenities: selectedAmenities,
      capacity: capacity[0]
    });
  };
  
  const resetFilters = () => {
    setLocationInput('');
    setPriceRange([0, 500000]);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setCapacity([100]);
    onFilterChange({});
  };

  // Helper function to format price in Indian format
  const formatIndianPrice = (price: number) => {
    return '₹' + price.toLocaleString('en-IN');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-6">
      <div className="space-y-2">
        <Label>Location in Delhi NCR</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Enter area or locality"
            className="pl-10"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {locationAreas.slice(0, 5).map((area) => (
            <button
              key={area}
              onClick={() => setLocationInput(area)}
              className={`text-xs px-2 py-1 rounded-full ${
                locationInput === area
                  ? 'bg-wed text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Price Range</Label>
          <span className="text-sm text-gray-500">
            {formatIndianPrice(priceRange[0])} - {formatIndianPrice(priceRange[1])}
          </span>
        </div>
        <Slider
          defaultValue={[0, 500000]}
          max={1000000}
          step={50000}
          value={priceRange}
          onValueChange={setPriceRange}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Guest Capacity</Label>
          <span className="text-sm text-gray-500">
            {capacity[0]}+ guests
          </span>
        </div>
        <Slider
          defaultValue={[100]}
          min={50}
          max={1500}
          step={50}
          value={capacity}
          onValueChange={setCapacity}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Venue Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {venueTypes.slice(0, 8).map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox 
                id={`type-${type}`} 
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => handleTypeChange(type)}
              />
              <label
                htmlFor={`type-${type}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 gap-2">
          {amenities.slice(0, 8).map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox 
                id={`amenity-${amenity}`} 
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => handleAmenityChange(amenity)}
              />
              <label
                htmlFor={`amenity-${amenity}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-1" 
          onClick={resetFilters}
        >
          <X size={14} />
          Reset
        </Button>
        <Button 
          className="flex-1 bg-wed hover:bg-wed/90"
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default VenueFilters;
