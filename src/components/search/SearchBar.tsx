"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Map, Calendar, X } from 'lucide-react';
import { 
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
// Removed toast import - using window.alert for consistency

interface SearchBarProps {
  variant?: 'default' | 'hero';
  initialQuery?: string;
  className?: string;
  placeholder?: string;
  placeholderSuggestions?: string[];
  onSearch?: (query: string) => void | Promise<void>;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  variant = 'default',
  initialQuery = '',
  className = '',
  placeholder = 'Search venues, vendors, or resources...',
  placeholderSuggestions,
  onSearch
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'venues' | 'vendors'>('all');
  const marqueeSuggestions = placeholderSuggestions?.filter(Boolean) ?? [];
  const marqueeText = marqueeSuggestions.length > 0
    ? `${marqueeSuggestions.join('   •   ')}   •   ${marqueeSuggestions.join('   •   ')}`
    : '';
  const marqueeDuration = Math.max(12, marqueeSuggestions.length * 6);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      if (typeof window !== 'undefined') window.alert("Please enter a search term");
      return;
    }
    
    // Track search analytics
    console.log('Search submitted:', { query: searchQuery, type: searchType });
    
    // Call the onSearch prop if provided
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Otherwise use the default behavior
      if (typeof window !== 'undefined') window.alert(`Searching for ${searchQuery}`);
      if (typeof window !== 'undefined') window.alert(`Searching for venues: ${searchQuery}`);
      router.push(`/venues?search=${encodeURIComponent(searchQuery)}`);
      setIsModalOpen(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsModalOpen(false);
      handleSearch(e as unknown as React.FormEvent);
    }
    
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <>
      <form 
        onSubmit={handleSearch}
        className={`relative flex items-center ${variant === 'hero' ? 'w-full max-w-3xl mx-auto' : 'w-full md:w-auto'} ${className}`}
      >
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder={marqueeSuggestions.length ? ' ' : placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsModalOpen(true)}
            className={`pl-9 pr-9 py-2 ${variant === 'hero' ? 'h-12 text-base rounded-l-lg rounded-r-none border-r-0' : 'rounded-l-md rounded-r-none border-r-0'}`}
          />
          {!searchQuery && marqueeSuggestions.length > 0 && (
            <div className="pointer-events-none absolute inset-0 flex items-center pl-9 pr-3 overflow-hidden">
              <div className="marquee-track whitespace-nowrap text-gray-400 dark:text-gray-500" aria-hidden="true">
                {marqueeText}
              </div>
            </div>
          )}
          {searchQuery && (
            <button 
              type="button" 
              onClick={clearSearch}
              className="absolute right-3 top-2.5"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        
        <Button 
          type="submit"
          className={`rounded-l-none rounded-r-md ${variant === 'hero' ? 'h-12 px-6' : 'px-4'} bg-wed text-white hover:bg-wed/90`}
        >
          Search
        </Button>
      </form>

      <CommandDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <CommandInput 
          placeholder="Search venues, vendors, or resources..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => {
              setSearchQuery("wedding venues");
              setIsModalOpen(false);
              router.push("/search?q=wedding+venues&type=venues");
              if (typeof window !== 'undefined') window.alert("Searching for wedding venues");
            }}>
              <Map className="mr-2 h-4 w-4" />
              <span>Wedding Venues</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              setSearchQuery("wedding photographers");
              setIsModalOpen(false);
              router.push("/search?q=wedding+photographers&type=vendors");
              if (typeof window !== 'undefined') window.alert("Searching for wedding photographers");
            }}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Wedding Photographers</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Search Options">
            <CommandItem onSelect={() => {
              setSearchType('venues');
              if (typeof window !== 'undefined') window.alert("Now searching venues only");
            }}>
              <Map className="mr-2 h-4 w-4" />
              <span>Search Venues Only</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              setSearchType('vendors');
              if (typeof window !== 'undefined') window.alert("Now searching vendors only");
            }}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Search Vendors Only</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              setSearchType('all');
              if (typeof window !== 'undefined') window.alert("Now searching everything");
            }}>
              <Search className="mr-2 h-4 w-4" />
              <span>Search Everything</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {marqueeSuggestions.length > 0 && (
        <style jsx>{`
          @keyframes searchbar-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .marquee-track {
            display: inline-block;
            padding-left: 0.75rem;
            animation: searchbar-marquee ${marqueeDuration}s linear infinite;
            will-change: transform;
          }
        `}</style>
      )}
    </>
  );
};

export default SearchBar;
