import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { toast } from 'sonner';

interface SearchBarProps {
  variant?: 'default' | 'hero';
  initialQuery?: string;
  className?: string;
  onSearch?: (query: string) => void | Promise<void>;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  variant = 'default',
  initialQuery = '',
  className = '',
  onSearch
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'venues' | 'vendors'>('all');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    // Track search analytics
    console.log('Search submitted:', { query: searchQuery, type: searchType });
    
    // Call the onSearch prop if provided
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Otherwise use the default behavior
      toast.success(`Searching for ${searchQuery}`);
      
      // Redirect to search results page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
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
            placeholder="Search venues, vendors, or resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsModalOpen(true)}
            className={`pl-9 pr-9 py-2 ${variant === 'hero' ? 'h-12 text-base rounded-l-lg rounded-r-none border-r-0' : 'rounded-l-md rounded-r-none border-r-0'}`}
          />
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
              navigate("/search?q=wedding+venues&type=venues");
              toast.success("Searching for wedding venues");
            }}>
              <Map className="mr-2 h-4 w-4" />
              <span>Wedding Venues</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              setSearchQuery("wedding photographers");
              setIsModalOpen(false);
              navigate("/search?q=wedding+photographers&type=vendors");
              toast.success("Searching for wedding photographers");
            }}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Wedding Photographers</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Search Options">
            <CommandItem onSelect={() => {
              setSearchType('venues');
              toast.success("Now searching venues only");
            }}>
              <Map className="mr-2 h-4 w-4" />
              <span>Search Venues Only</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              setSearchType('vendors');
              toast.success("Now searching vendors only");
            }}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Search Vendors Only</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              setSearchType('all');
              toast.success("Now searching everything");
            }}>
              <Search className="mr-2 h-4 w-4" />
              <span>Search Everything</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;
