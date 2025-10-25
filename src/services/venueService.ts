"use client";

import { createClient } from '@supabase/supabase-js';
import { VenueFilters } from '@/hooks/useVenues';
import { AvailabilitySlot } from '@/components/calendar/AvailabilityCalendar';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface VenueServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export class VenueService {
  // Get venues with filters and pagination
  static async getVenues(
    filters: VenueFilters = {},
    page = 1,
    limit = 12
  ): Promise<VenueServiceResponse<{ venues: any[]; pagination: any }>> {
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          listing_images (
            id,
            image_url,
            alt_text,
            display_order
          ),
          listing_amenities (
            id,
            amenity_name,
            amenity_type
          ),
          reviews (
            id,
            rating
          )
        `)
        .eq('kind', 'venue')
        .eq('status', 'active');

      // Apply filters
      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }

      if (filters.min_price) {
        query = query.gte('price', filters.min_price);
      }

      if (filters.max_price) {
        query = query.lte('price', filters.max_price);
      }

      if (filters.min_rating) {
        query = query.gte('rating', filters.min_rating);
      }

      if (filters.guest_count) {
        query = query.gte('capacity', filters.guest_count);
      }

      if (filters.venue_type) {
        query = query.eq('venue_type', filters.venue_type);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
      }

      // Apply sorting
      switch (filters.sort) {
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('featured', { ascending: false }).order('rating', { ascending: false });
      }

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      const pagination = {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      };

      return {
        data: { venues: data || [], pagination },
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Get single venue by ID
  static async getVenue(venueId: string): Promise<VenueServiceResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          listing_images (
            id,
            image_url,
            alt_text,
            display_order
          ),
          listing_amenities (
            id,
            amenity_name,
            amenity_type,
            is_available
          ),
          reviews (
            id,
            rating,
            comment,
            reviewer_name,
            created_at
          )
        `)
        .eq('id', venueId)
        .eq('kind', 'venue')
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Get venue availability
  static async getVenueAvailability(
    venueId: string,
    startDate?: string,
    endDate?: string
  ): Promise<VenueServiceResponse<AvailabilitySlot[]>> {
    try {
      let query = supabase
        .from('venue_availability')
        .select('*')
        .eq('venue_id', venueId);

      if (startDate) {
        query = query.gte('date', startDate);
      }

      if (endDate) {
        query = query.lte('date', endDate);
      }

      query = query.order('date', { ascending: true });

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      // Transform data to match AvailabilitySlot interface
      const availability: AvailabilitySlot[] = (data || []).map(slot => ({
        date: slot.date,
        status: slot.status,
        price: slot.price,
        maxGuests: slot.max_guests,
        timeSlots: slot.time_slots ? JSON.parse(slot.time_slots) : undefined,
        notes: slot.notes
      }));

      return { data: availability, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Create venue booking
  static async createBooking(bookingData: {
    venue_id: string;
    event_date: string;
    time_slot?: string;
    guest_count: number;
    event_type: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    special_requests?: string;
    total_amount: number;
  }): Promise<VenueServiceResponse<any>> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: user.user?.id,
          status: 'pending',
          booking_type: 'venue'
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Toggle venue favorite
  static async toggleFavorite(
    venueId: string,
    isFavorite: boolean
  ): Promise<VenueServiceResponse<{ isFavorite: boolean }>> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        return { data: null, error: 'User not authenticated', success: false };
      }

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.user.id)
          .eq('listing_id', venueId);

        if (error) {
          return { data: null, error: error.message, success: false };
        }
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.user.id,
            listing_id: venueId,
            listing_type: 'venue'
          });

        if (error) {
          return { data: null, error: error.message, success: false };
        }
      }

      return { data: { isFavorite: !isFavorite }, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Get venue reviews
  static async getVenueReviews(
    venueId: string,
    page = 1,
    limit = 10
  ): Promise<VenueServiceResponse<{ reviews: any[]; pagination: any }>> {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact' })
        .eq('listing_id', venueId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      const pagination = {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      };

      return {
        data: { reviews: data || [], pagination },
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Get similar venues
  static async getSimilarVenues(
    venueId: string,
    limit = 4
  ): Promise<VenueServiceResponse<any[]>> {
    try {
      // First get the current venue details
      const { data: currentVenue } = await supabase
        .from('listings')
        .select('city, venue_type, price')
        .eq('id', venueId)
        .single();

      if (!currentVenue) {
        return { data: [], error: null, success: true };
      }

      // Find similar venues based on location, type, and price range
      const priceRange = currentVenue.price * 0.3; // 30% price range
      
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          listing_images (
            id,
            image_url,
            alt_text,
            display_order
          )
        `)
        .eq('kind', 'venue')
        .eq('status', 'active')
        .neq('id', venueId)
        .or(`city.eq.${currentVenue.city},venue_type.eq.${currentVenue.venue_type}`)
        .gte('price', currentVenue.price - priceRange)
        .lte('price', currentVenue.price + priceRange)
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: data || [], error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Search venues with AI-powered ranking
  static async searchVenues(
    query: string,
    filters: VenueFilters = {},
    limit = 20
  ): Promise<VenueServiceResponse<any[]>> {
    try {
      // Use full-text search with ranking
      let searchQuery = supabase
        .from('listings')
        .select(`
          *,
          listing_images (
            id,
            image_url,
            alt_text,
            display_order
          )
        `)
        .eq('kind', 'venue')
        .eq('status', 'active')
        .textSearch('search_vector', query, {
          type: 'websearch',
          config: 'english'
        });

      // Apply additional filters
      if (filters.city) {
        searchQuery = searchQuery.eq('city', filters.city);
      }

      if (filters.min_price) {
        searchQuery = searchQuery.gte('price', filters.min_price);
      }

      if (filters.max_price) {
        searchQuery = searchQuery.lte('price', filters.max_price);
      }

      if (filters.guest_count) {
        searchQuery = searchQuery.gte('capacity', filters.guest_count);
      }

      const { data, error } = await searchQuery
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: data || [], error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Get venue recommendations for user
  static async getRecommendations(
    userId?: string,
    limit = 6
  ): Promise<VenueServiceResponse<any[]>> {
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          listing_images (
            id,
            image_url,
            alt_text,
            display_order
          )
        `)
        .eq('kind', 'venue')
        .eq('status', 'active');

      if (userId) {
        // Get user preferences and behavior for personalized recommendations
        // For now, just return featured and highly rated venues
        query = query.order('featured', { ascending: false })
                    .order('rating', { ascending: false });
      } else {
        // For anonymous users, show popular venues
        query = query.order('rating', { ascending: false })
                    .order('review_count', { ascending: false });
      }

      const { data, error } = await query.limit(limit);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: data || [], error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }
}
