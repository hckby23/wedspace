
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, MapPin } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface LocationOption {
  value: string;
  label: string;
}

const LOCATIONS: LocationOption[] = [
  { value: 'all', label: 'All Locations' },
  { value: 'New York', label: 'New York' },
  { value: 'Los Angeles', label: 'Los Angeles' },
  { value: 'Chicago', label: 'Chicago' },
  { value: 'Miami', label: 'Miami' },
  { value: 'San Francisco', label: 'San Francisco' },
  { value: 'Seattle', label: 'Seattle' },
  { value: 'Austin', label: 'Austin' },
  { value: 'Boston', label: 'Boston' },
];

interface ExploreFilterProps {
  currentLocation: string;
  onLocationChange: (location: string) => void;
}

const ExploreFilter: React.FC<ExploreFilterProps> = ({ currentLocation, onLocationChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            {currentLocation === 'all' 
              ? 'All Locations' 
              : LOCATIONS.find(l => l.value === currentLocation)?.label || currentLocation}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuRadioGroup value={currentLocation} onValueChange={onLocationChange}>
            {LOCATIONS.map((location) => (
              <DropdownMenuRadioItem key={location.value} value={location.value}>
                {location.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ExploreFilter;
