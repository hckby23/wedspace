
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Filter, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FEATURED_VENUES } from '@/data/venues';
import { FEATURED_VENDORS } from '@/data/vendors';
import VenueCard from '@/components/venues/VenueCard';
import VendorCard from '@/components/vendors/VendorCard';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const Favorites: React.FC = () => {
  const [activeTab, setActiveTab] = useState('venues');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [venueTypes, setVenueTypes] = useState<string[]>([]);
  const [vendorCategories, setVendorCategories] = useState<string[]>([]);

  // In a real app, this would be fetched from an API/database
  // For now, we'll simulate favorites by taking the first few items from our data
  const [favoriteVenues, setFavoriteVenues] = useState(
    FEATURED_VENUES.slice(0, 4).map(venue => {
      // Format capacity based on its type
      let capacityString = '50-500 guests'; // Default
      
      if (typeof venue.capacity === 'object' && venue.capacity !== null) {
        capacityString = `${venue.capacity.min}-${venue.capacity.max} guests`;
      } else if (typeof venue.capacity === 'string') {
        capacityString = venue.capacity;
      }
      
      return {
        ...venue,
        capacity: capacityString
      };
    })
  );
  const [favoriteVendors, setFavoriteVendors] = useState(FEATURED_VENDORS.slice(0, 4));

  // Filter options
  const venueTypeOptions = ['Indoor', 'Outdoor', 'Beach', 'Garden', 'Ballroom', 'Rustic', 'Urban'];
  const vendorCategoryOptions = ['Photography', 'Catering', 'Florist', 'DJ', 'Music', 'Cake', 'Decor'];

  const toggleVenueType = (type: string) => {
    if (venueTypes.includes(type)) {
      setVenueTypes(venueTypes.filter(t => t !== type));
    } else {
      setVenueTypes([...venueTypes, type]);
    }
  };

  const toggleVendorCategory = (category: string) => {
    if (vendorCategories.includes(category)) {
      setVendorCategories(vendorCategories.filter(c => c !== category));
    } else {
      setVendorCategories([...vendorCategories, category]);
    }
  };

  const removeFromFavorites = (type: 'venue' | 'vendor', id: string) => {
    if (type === 'venue') {
      setFavoriteVenues(favoriteVenues.filter(venue => venue.id !== id));
      toast({
        description: "The venue has been removed from your favorites"
      });
    } else {
      setFavoriteVendors(favoriteVendors.filter(vendor => vendor.id !== id));
      toast({
        description: "The vendor has been removed from your favorites"
      });
    }
  };

  const bookItem = (type: 'venue' | 'vendor', id: string) => {
    // In a real app, this would call an API to book the venue/vendor
    // For now, just show a message
    console.log(`Booking ${type} with ID: ${id}`);
    toast({
      description: `You've booked this ${type}! Check your planning page for updates.`
    });
  };

  // Apply filters
  const applyDateFilter = (items: any[]) => {
    if (!selectedDate) return items;
    // This is a placeholder filter logic
    // In a real app, you would filter based on availability date
    return items;
  };

  // Get filtered venues
  const filteredVenues = applyDateFilter(favoriteVenues);
  const filteredVendors = applyDateFilter(favoriteVendors);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Your Favorites | wedspace</title>
        <meta name="description" content="View and manage your favorite wedding venues and vendors." />
      </Helmet>
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">Your Favorites</h1>
              <p className="text-gray-600">Manage your favorite venues and vendors all in one place.</p>
            </div>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                Filters
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {showFilters && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm animate-fade-in">
              <h3 className="font-medium mb-3">Filter by:</h3>
              
              {activeTab === 'venues' ? (
                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Venue Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {venueTypeOptions.map(type => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "border-gray-200",
                          venueTypes.includes(type) && "bg-wed/10 border-wed text-wed"
                        )}
                        onClick={() => toggleVenueType(type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Vendor Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {vendorCategoryOptions.map(category => (
                      <Button
                        key={category}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "border-gray-200",
                          vendorCategories.includes(category) && "bg-wed/10 border-wed text-wed"
                        )}
                        onClick={() => toggleVendorCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <Tabs defaultValue="venues" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 grid grid-cols-2 max-w-[400px]">
              <TabsTrigger value="venues" className="flex items-center gap-1">Venues</TabsTrigger>
              <TabsTrigger value="vendors" className="flex items-center gap-1">Vendors</TabsTrigger>
            </TabsList>
            
            <TabsContent value="venues" className="space-y-6 animate-fade-in">
              {filteredVenues.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No favorite venues yet</h3>
                  <p className="text-gray-500 mb-4">Start exploring and add venues you love to your favorites!</p>
                  <Button asChild>
                    <Link to="/venues">Browse Venues</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVenues.map(venue => (
                    <div key={venue.id} className="flex flex-col">
                      <div className="relative flex-grow">
                        <button 
                          className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full"
                          onClick={() => removeFromFavorites('venue', venue.id)}
                          aria-label="Remove from favorites"
                        >
                          <Heart className="h-5 w-5 text-wed fill-wed" />
                        </button>
                        <VenueCard venue={{
                          id: venue.id,
                          name: venue.name,
                          location: venue.location,
                          image: venue.image,
                          rating: venue.rating,
                          priceRange: venue.priceRange,
                          capacity: venue.capacity as string,
                          tags: venue.tags
                        }} />
                      </div>
                      <Button 
                        className="w-full mt-2 bg-wed hover:bg-wed/90"
                        onClick={() => bookItem('venue', venue.id)}
                      >
                        Book This Venue
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="vendors" className="space-y-6 animate-fade-in">
              {filteredVendors.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No favorite vendors yet</h3>
                  <p className="text-gray-500 mb-4">Start exploring and add vendors you love to your favorites!</p>
                  <Button asChild>
                    <Link to="/vendors">Browse Vendors</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVendors.map(vendor => (
                    <div key={vendor.id} className="flex flex-col">
                      <div className="relative flex-grow">
                        <button 
                          className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full"
                          onClick={() => removeFromFavorites('vendor', vendor.id)}
                          aria-label="Remove from favorites"
                        >
                          <Heart className="h-5 w-5 text-wed fill-wed" />
                        </button>
                        <VendorCard vendor={vendor} />
                      </div>
                      <Button 
                        className="w-full mt-2 bg-wed hover:bg-wed/90"
                        onClick={() => bookItem('vendor', vendor.id)}
                      >
                        Book This Vendor
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Favorites;
