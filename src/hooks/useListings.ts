import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FEATURED_VENUES } from '@/data/venues';
import { MOCK_VENDORS } from '@/data/mockVendors';

export interface ListingFilters {
  kind?: 'venue' | 'vendor';
  city?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  guest_count?: number;
  date?: string;
  sort?: 'rating' | 'price_low' | 'price_high' | 'newest' | 'ai';
  search?: string;
}

export interface Listing {
  id: string;
  title: string;
  description?: string;
  listing_type: 'venue' | 'vendor';
  base_price?: number;
  city: string;
  state: string;
  rating: number;
  review_count: number;
  verified: boolean;
  status: string;
  tags?: string[];
  venues?: any;
  vendors?: any;
  media?: any[];
  scorecards?: any;
}

export interface ListingsResponse {
  listings: Listing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const PAGE_SIZE = 20;

const normalizeString = (value: string | undefined) => value?.toLowerCase().trim() ?? '';

const matchesSearch = (haystack: string | undefined, needle: string | undefined) => {
  if (!needle) return true;
  if (!haystack) return false;
  return haystack.toLowerCase().includes(needle.toLowerCase());
};

const buildMockVenueListings = (filters: ListingFilters) => {
  const searchTerm = normalizeString(filters.search as string | undefined);
  const cityFilter = normalizeString(filters.city);
  const minRating = filters.min_rating ?? 0;

  const filtered = FEATURED_VENUES.filter((venue) => {
    const venueCity = normalizeString(venue.city ?? venue.location?.split(',').pop()?.trim());
    const matchesCity = cityFilter ? venueCity.includes(cityFilter) : true;
    const matchesRating = (venue.rating ?? 0) >= minRating;
    const matchesTerm = searchTerm
      ? [venue.name, venue.description, venue.location, ...(venue.tags ?? [])]
          .filter(Boolean)
          .some((value) => matchesSearch(String(value), searchTerm))
      : true;
    return matchesCity && matchesRating && matchesTerm;
  });

  return filtered.map<Listing>((venue) => ({
    id: venue.id,
    title: venue.name,
    description: venue.description,
    listing_type: 'venue',
    base_price: undefined,
    city: venue.city ?? venue.location?.split(',')[0]?.trim() ?? 'Unknown',
    state: venue.state ?? 'Unknown',
    rating: venue.rating ?? 0,
    review_count: venue.reviews?.length ?? 0,
    verified: venue.verified ?? true,
    status: venue.status ?? 'active',
    tags: venue.tags,
    venues: venue,
    media: venue.image ? [{ url: venue.image }] : [],
  }));
};

const buildMockVendorListings = (filters: ListingFilters) => {
  const searchTerm = normalizeString(filters.search as string | undefined);
  const cityFilter = normalizeString(filters.city);
  const minRating = filters.min_rating ?? 0;

  const filtered = MOCK_VENDORS.filter((vendor) => {
    const matchesCity = cityFilter ? normalizeString(vendor.city).includes(cityFilter) : true;
    const matchesRating = (vendor.rating ?? 0) >= minRating;
    const matchesTerm = searchTerm
      ? [vendor.name, vendor.description, vendor.category, vendor.city, ...(vendor.services_offered ?? [])]
          .filter(Boolean)
          .some((value) => matchesSearch(String(value), searchTerm))
      : true;
    return matchesCity && matchesRating && matchesTerm;
  });

  return filtered.map<Listing>((vendor) => ({
    id: vendor.id,
    title: vendor.name,
    description: vendor.description,
    listing_type: 'vendor',
    base_price: undefined,
    city: vendor.city,
    state: vendor.state,
    rating: vendor.rating ?? 0,
    review_count: vendor.review_count ?? 0,
    verified: vendor.verified ?? true,
    status: vendor.status ?? 'active',
    tags: vendor.services_offered,
    vendors: vendor,
    media: vendor.images?.length ? vendor.images.map((image) => ({ url: image })) : [],
  }));
};

const buildMockListingsResponse = (filters: ListingFilters, page: number): ListingsResponse => {
  const kind = filters.kind ?? 'venue';
  const allListings = kind === 'vendor' ? buildMockVendorListings(filters) : buildMockVenueListings(filters);

  const start = (page - 1) * PAGE_SIZE;
  const paginated = allListings.slice(start, start + PAGE_SIZE);

  return {
    listings: paginated,
    pagination: {
      page,
      limit: PAGE_SIZE,
      total: allListings.length,
      pages: Math.max(1, Math.ceil(allListings.length / PAGE_SIZE)),
    },
  };
};

const findMockListing = (id: string) => {
  const venue = FEATURED_VENUES.find((item) => item.id === id);
  if (venue) {
    return {
      id: venue.id,
      title: venue.name,
      description: venue.description,
      listing_type: 'venue' as const,
      base_price: undefined,
      city: venue.city ?? venue.location?.split(',')[0]?.trim() ?? 'Unknown',
      state: venue.state ?? 'Unknown',
      rating: venue.rating ?? 0,
      review_count: venue.reviews?.length ?? 0,
      verified: venue.verified ?? true,
      status: venue.status ?? 'active',
      tags: venue.tags,
      venues: venue,
      media: venue.image ? [{ url: venue.image }] : [],
    } satisfies Listing;
  }

  const vendor = MOCK_VENDORS.find((item) => item.id === id);
  if (vendor) {
    return {
      id: vendor.id,
      title: vendor.name,
      description: vendor.description,
      listing_type: 'vendor' as const,
      base_price: undefined,
      city: vendor.city,
      state: vendor.state,
      rating: vendor.rating ?? 0,
      review_count: vendor.review_count ?? 0,
      verified: vendor.verified ?? true,
      status: vendor.status ?? 'active',
      tags: vendor.services_offered,
      vendors: vendor,
      media: vendor.images?.length ? vendor.images.map((image) => ({ url: image })) : [],
    } satisfies Listing;
  }

  return null;
};

export function useListings(filters: ListingFilters = {}, page: number = 1) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: PAGE_SIZE.toString(),
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
    ),
  });

  return useQuery<ListingsResponse>({
    queryKey: ['listings', filters, page],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/listings?${queryParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        return response.json();
      } catch (error) {
        console.warn('[useListings] Falling back to mock data due to fetch error:', error);
        return buildMockListingsResponse(filters, page);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/listings/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listing');
        }
        return response.json();
      } catch (error) {
        console.warn('[useListing] Falling back to mock data due to fetch error:', error);
        const mock = findMockListing(id);
        if (!mock) {
          throw error;
        }
        return mock;
      }
    },
    enabled: !!id,
  });
}

export function useFavoriteToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await fetch('/api/favorites');
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      return response.json();
    },
  });
}

export function useSearch(query: string, type: string = 'all') {
  return useQuery({
    queryKey: ['search', query, type],
    queryFn: async () => {
      const params = new URLSearchParams({ q: query, type });
      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) {
        throw new Error('Failed to search');
      }
      return response.json();
    },
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
