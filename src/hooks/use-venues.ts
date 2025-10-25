import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface VenueFilters {
  location?: string;
  date?: string;
  guests?: number;
  priceMin?: number;
  priceMax?: number;
  amenities?: string[];
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  capacity_min: number;
  capacity_max: number;
  price_per_plate: number;
  base_price: number;
  images: string[];
  amenities: string[];
  created_at: string;
  updated_at: string;
}

export function useVenues(filters: VenueFilters = {}) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        setError(null);

        // Start building the query
        let query = supabase.from('venues').select('*', { count: 'exact' });

        // Apply filters
        if (filters.location) {
          query = query.ilike('city', `%${filters.location}%`);
        }

        if (filters.guests) {
          query = query.gte('capacity_max', filters.guests);
        }

        if (filters.priceMin) {
          query = query.gte('price_per_plate', filters.priceMin);
        }

        if (filters.priceMax) {
          query = query.lte('price_per_plate', filters.priceMax);
        }

        // If date is provided, check availability (in a real implementation)
        // This would be a more complex query with joins to the availability table
        
        // Execute the query
        const { data, error, count: totalCount } = await query;

        if (error) throw error;

        setVenues(data || []);
        setCount(totalCount || 0);
      } catch (err) {
        console.error('Error fetching venues:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch venues'));
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [filters]);

  return { venues, loading, error, count };
}

export async function getVenueById(id: string): Promise<Venue | null> {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error fetching venue by ID:', err);
    return null;
  }
}

export default useVenues;
