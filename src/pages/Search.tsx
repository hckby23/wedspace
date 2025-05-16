
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import TrendingVenues from '@/components/search/TrendingVenues';
import PopularSearches from '@/components/search/PopularSearches';
import { FEATURED_VENUES } from '@/data/venues';

const Search: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    // In a real app, this would call an API
    setSearchResults(FEATURED_VENUES.filter(venue => 
      venue.name.toLowerCase().includes(query.toLowerCase()) ||
      venue.description.toLowerCase().includes(query.toLowerCase()) ||
      venue.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    ));
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-8 md:py-12">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-6 text-center">
            Find Your Perfect <span className="text-wed">Wedding Venue</span>
          </h1>
          
          <SearchBar onSearch={handleSearch} className="mb-12" />
          
          {searchResults.length > 0 ? (
            <SearchResults results={searchResults} isLoading={isSearching} />
          ) : (
            <div className="space-y-16">
              <TrendingVenues />
              <PopularSearches />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Search;
