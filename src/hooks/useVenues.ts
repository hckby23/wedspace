"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useListings, ListingFilters } from './useListings';
import { Venue } from '@/components/venues/VenueCard';

// Extended venue-specific filters
export interface VenueFilters extends ListingFilters {
  venue_type?: string;
  amenities?: string[];
  availability_date?: string;
  time_slot?: string;
}

// Venue booking data
export interface VenueBooking {
  id: string;
  venue_id: string;
  user_id: string;
  event_date: string;
  time_slot?: string;
  guest_count: number;
  event_type: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  total_amount: number;
  created_at: string;
  updated_at: string;
}

// Use the existing useListings hook but with venue-specific defaults
export const useVenues = (filters?: VenueFilters, page = 1, limit = 12) => {
  const venueFilters: ListingFilters = {
    kind: 'venue',
    ...filters
  };

  return useListings(venueFilters, page, limit);
};

// Get single venue details
export const useVenue = (venueId: string) => {
  return useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      const response = await fetch(`/api/venues/${venueId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch venue details');
      }
      return response.json();
    },
    enabled: !!venueId
  });
};

// Get venue availability
export const useVenueAvailability = (venueId: string, month?: string) => {
  return useQuery({
    queryKey: ['venue-availability', venueId, month],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (month) params.append('month', month);
      
      const response = await fetch(`/api/venues/${venueId}/availability?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch venue availability');
      }
      return response.json();
    },
    enabled: !!venueId
  });
};

// Get venue reviews
export const useVenueReviews = (venueId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['venue-reviews', venueId, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      const response = await fetch(`/api/venues/${venueId}/reviews?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch venue reviews');
      }
      return response.json();
    },
    enabled: !!venueId
  });
};

// Create venue booking
export const useCreateVenueBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: Omit<VenueBooking, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['venue-availability', data.venue_id] });
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
    },
  });
};

// Toggle venue favorite
export const useToggleVenueFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ venueId, isFavorite }: { venueId: string; isFavorite: boolean }) => {
      const response = await fetch(`/api/venues/${venueId}/favorite`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      return { venueId, isFavorite: !isFavorite };
    },
    onSuccess: (data) => {
      // Update venue in cache
      queryClient.setQueryData(['venue', data.venueId], (old: any) => {
        if (old) {
          return { ...old, isFavorite: data.isFavorite };
        }
        return old;
      });

      // Invalidate venues list to update favorite status
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

// Get user's favorite venues
export const useFavoriteVenues = (page = 1, limit = 12) => {
  return useQuery({
    queryKey: ['favorites', 'venues', page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: 'venue',
        page: page.toString(),
        limit: limit.toString()
      });
      
      const response = await fetch(`/api/favorites?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch favorite venues');
      }
      return response.json();
    }
  });
};

// Get user's venue bookings
export const useUserVenueBookings = (status?: string) => {
  return useQuery({
    queryKey: ['user-bookings', 'venues', status],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: 'venue'
      });
      if (status) params.append('status', status);
      
      const response = await fetch(`/api/bookings?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch venue bookings');
      }
      return response.json();
    }
  });
};

// Search venues with advanced filters
export const useVenueSearch = (query: string, filters?: VenueFilters) => {
  const searchFilters: VenueFilters = {
    kind: 'venue',
    search: query,
    ...filters
  };

  return useQuery({
    queryKey: ['venue-search', query, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`/api/search/venues?${params}`);
      if (!response.ok) {
        throw new Error('Failed to search venues');
      }
      return response.json();
    },
    enabled: query.length > 0
  });
};

// Get venue recommendations
export const useVenueRecommendations = (userId?: string, limit = 6) => {
  return useQuery({
    queryKey: ['venue-recommendations', userId, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: 'venue',
        limit: limit.toString()
      });
      if (userId) params.append('user_id', userId);

      const response = await fetch(`/api/recommendations?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch venue recommendations');
      }
      return response.json();
    }
  });
};

// Get similar venues
export const useSimilarVenues = (venueId: string, limit = 4) => {
  return useQuery({
    queryKey: ['similar-venues', venueId, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString()
      });

      const response = await fetch(`/api/venues/${venueId}/similar?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch similar venues');
      }
      return response.json();
    },
    enabled: !!venueId
  });
};
