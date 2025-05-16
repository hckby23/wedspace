
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import VendorCard from '@/components/vendors/VendorCard';
import VendorFilters from '@/components/vendors/VendorFilters';

// Mock data for vendors
const MOCK_VENDORS = [
  {
    id: '1',
    name: 'Elegant Blooms',
    category: 'Florist',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200',
    rating: 4.9,
    startingPrice: 'From $800',
    description: 'Creating stunning floral arrangements for weddings and events with a focus on seasonal blooms and sustainable practices.',
    tags: ['Flowers', 'Decor', 'Sustainable']
  },
  {
    id: '2',
    name: 'Moments Captured',
    category: 'Photography',
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1552334978-5f1649aef15d',
    rating: 4.8,
    startingPrice: 'From $2,500',
    description: 'Award-winning photography that captures the beauty and emotion of your special day with a photojournalistic approach.',
    tags: ['Photography', 'Videography', 'Premium']
  },
  {
    id: '3',
    name: 'Divine Catering',
    category: 'Catering',
    location: 'Seattle, WA',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033',
    rating: 4.7,
    startingPrice: 'From $45/person',
    description: 'Culinary excellence delivered with impeccable service. Customized menus that delight your guests.',
    tags: ['Food', 'Service', 'Customized']
  },
  {
    id: '4',
    name: 'Melody Makers',
    category: 'Music & DJs',
    location: 'Chicago, IL',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    rating: 4.8,
    startingPrice: 'From $1,200',
    description: 'Setting the perfect mood for your celebration with professional DJs and live musicians who know how to read the room.',
    tags: ['Entertainment', 'Music', 'DJ']
  },
  {
    id: '5',
    name: 'Sweet Creations',
    category: 'Cakes & Desserts',
    location: 'Boston, MA',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636',
    rating: 4.9,
    startingPrice: 'From $500',
    description: 'Artisanal cakes and desserts made with premium ingredients. Custom designs that match your wedding theme.',
    tags: ['Cake', 'Desserts', 'Custom']
  },
  {
    id: '6',
    name: 'Event Architects',
    category: 'Wedding Planners',
    location: 'Miami, FL',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
    rating: 4.9,
    startingPrice: 'From $3,000',
    description: 'Full-service wedding planning to make your dream day a reality. Handling every detail so you can enjoy the celebration.',
    tags: ['Planning', 'Coordination', 'Design']
  },
];

const VendorsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredVendors, setFilteredVendors] = useState(MOCK_VENDORS);
  const [currentFilters, setCurrentFilters] = useState<any>({});

  const handleSearch = (term: string = searchTerm) => {
    if (!term) {
      applyFilters(currentFilters);
      return;
    }
    
    const searchTermLower = term.toLowerCase();
    const filtered = MOCK_VENDORS.filter(vendor => 
      vendor.name.toLowerCase().includes(searchTermLower) ||
      vendor.category.toLowerCase().includes(searchTermLower) ||
      vendor.location.toLowerCase().includes(searchTermLower) ||
      vendor.description.toLowerCase().includes(searchTermLower) ||
      vendor.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
    );
    
    setFilteredVendors(filtered);
  };
  
  const applyFilters = (filters: any) => {
    setCurrentFilters(filters);
    
    let filtered = [...MOCK_VENDORS];
    
    // Apply search term if exists
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(vendor => 
        vendor.name.toLowerCase().includes(searchTermLower) ||
        vendor.category.toLowerCase().includes(searchTermLower) ||
        vendor.location.toLowerCase().includes(searchTermLower) ||
        vendor.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }
    
    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(vendor => 
        filters.categories.includes(vendor.category)
      );
    }
    
    // Apply location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter(vendor => 
        vendor.location.toLowerCase().includes(locationLower)
      );
    }
    
    setFilteredVendors(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-wedding py-10">
          <div className="container-custom">
            <h1 className="font-playfair font-bold text-3xl md:text-4xl mb-4">
              Wedding Vendors
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Find top-rated wedding professionals to bring your vision to life.
              From photographers to caterers, discover the perfect team for your special day.
            </p>
          </div>
        </section>
        
        {/* Search and Results */}
        <section className="py-8">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Filters - Desktop */}
              <div className="w-full md:w-1/4 hidden md:block">
                <VendorFilters onFilterChange={applyFilters} />
              </div>
              
              {/* Results */}
              <div className="w-full md:w-3/4">
                {/* Search bar */}
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search vendors by name, category or location"
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button onClick={() => handleSearch()} className="bg-space hover:bg-space/90">
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
                      <VendorFilters onFilterChange={applyFilters} />
                    </SheetContent>
                  </Sheet>
                </div>
                
                {/* Results count */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    {filteredVendors.length} vendors found
                  </p>
                </div>
                
                {/* Vendors grid */}
                {filteredVendors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVendors.map((vendor) => (
                      <VendorCard key={vendor.id} vendor={vendor} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="font-playfair text-xl font-semibold mb-2">No vendors found</h3>
                    <p className="text-gray-600">
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

export default VendorsList;
