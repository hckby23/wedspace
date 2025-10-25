import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VenueCard, { VenueProps } from '@/components/venues/VenueCard';
import VenueFilters from '@/components/venues/VenueFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FEATURED_VENUES } from '@/data/venues';

// Convert FEATURED_VENUES to VenueProps format
const VENUE_LIST: VenueProps[] = FEATURED_VENUES.map(venue => ({
  id: venue.id,
  name: venue.name,
  location: venue.location,
  image: venue.image,
  rating: venue.rating,
  priceRange: venue.priceRange,
  capacity: '50-500 guests', // Default capacity
  tags: venue.tags,
}));

const VenuesList: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredVenues, setFilteredVenues] = useState<VenueProps[]>(VENUE_LIST);
  const [currentFilters, setCurrentFilters] = useState<any>({});
  
  // Extract location query from URL if present
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const locationParam = queryParams.get('location');
    
    if (locationParam) {
      setSearchTerm(locationParam);
      handleSearch(locationParam);
    }
  }, [location]);
  
  const handleSearch = (term: string = searchTerm) => {
    if (!term) {
      applyFilters(currentFilters);
      return;
    }
    
    const searchTermLower = term.toLowerCase();
    const filtered = VENUE_LIST.filter(venue => 
      venue.location.toLowerCase().includes(searchTermLower) ||
      venue.name.toLowerCase().includes(searchTermLower)
    );
    
    setFilteredVenues(filtered);
  };
  
  const applyFilters = (filters: any) => {
    setCurrentFilters(filters);
    
    let filtered = [...VENUE_LIST];
    
    // Apply search term if exists
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(venue => 
        venue.location.toLowerCase().includes(searchTermLower) ||
        venue.name.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Apply other filters if they exist
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter(venue => 
        venue.location.toLowerCase().includes(locationLower)
      );
    }
    
    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(venue => 
        filters.types.some((type: string) => 
          venue.tags.includes(type)
        )
      );
    }
    
    // Apply price filter (simplified for mock data)
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      // In a real app, you would convert venue.priceRange to actual numbers
      // This is a simplified version for demonstration
      if (max < 20000) {
        filtered = filtered.filter(venue => {
          // For Indian venues with ₹ symbol
          if (venue.priceRange.includes('₹')) {
            // Extract the max price from range like "₹2,00,000 - ₹5,00,000"
            const maxPriceText = venue.priceRange.split('₹')[2]?.replace(/,/g, '');
            const maxPrice = maxPriceText ? parseInt(maxPriceText) : 1000000;
            // Convert to approximate USD for comparison (1 INR = ~0.012 USD)
            return maxPrice * 0.012 <= max;
          } else {
            // For USD prices
            const maxPrice = parseInt(venue.priceRange.split('$')[2]?.replace(',', ''));
            return maxPrice <= max;
          }
        });
      }
    }
    
    setFilteredVenues(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-wedding py-10">
          <div className="container-custom">
            <h1 className="font-playfair font-bold text-3xl md:text-4xl mb-4">
              Wedding Venues in Delhi NCR
            </h1>
            <p className="text-[var(--text-muted)] max-w-3xl">
              Discover and compare wedding venues across Delhi, Noida, and Greater Noida. 
              From luxury hotels to garden resorts, find the perfect setting for your special day.
            </p>
          </div>
        </section>
        
        {/* Search and Results */}
        <section className="py-8">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Filters - Desktop */}
              <div className="w-full md:w-1/4 hidden md:block">
                <VenueFilters onFilterChange={applyFilters} />
              </div>
              
              {/* Results */}
              <div className="w-full md:w-3/4">
                {/* Search bar */}
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search venues by name or location"
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button onClick={() => handleSearch()} className="bg-wed hover:bg-wed/90">
                    Search
                  </Button>
                  
                  {/* Filters - Mobile */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="md:hidden">
                        <SlidersHorizontal size={18} />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="overflow-y-auto">
                      <h3 className="font-playfair text-lg font-semibold mb-4">Filters</h3>
                      <VenueFilters onFilterChange={applyFilters} />
                    </SheetContent>
                  </Sheet>
                </div>
                
                {/* Results count */}
                <div className="mb-6">
                  <p className="text-[var(--text-muted)]">
                    {filteredVenues.length} venues found in Delhi NCR
                  </p>
                </div>
                
                {/* Venues grid */}
                {filteredVenues.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVenues.map((venue) => (
                      <VenueCard key={venue.id} venue={venue} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="font-playfair text-xl font-semibold mb-2">No venues found</h3>
                    <p className="text-[var(--text-muted)]">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default VenuesList;
