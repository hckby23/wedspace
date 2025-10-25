import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

/**
 * Interface for availability data from the database
 */
export interface Availability {
  id: string;
  venue_id: string;
  date: string;
  is_available: boolean;
  remaining_slots: number;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for price slot data from the database
 */
export interface PriceSlot {
  id: string;
  venue_id: string;
  date: string;
  price_multiplier: number;
  reason: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for last minute deals data from the database
 */
export interface LastMinuteDeal {
  id: string;
  venue_id: string | null;
  vendor_id: string | null;
  start_date: string;
  end_date: string;
  discount_percentage: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Options for the useDynamicPricing hook
 */
export interface DynamicPricingOptions {
  venueId?: string;
  vendorId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Result from the useDynamicPricing hook
 */
export interface DynamicPricingResult {
  availability: Availability[];
  priceSlots: PriceSlot[];
  lastMinuteDeals: LastMinuteDeal[];
  loading: boolean;
  error: Error | null;
  calculateDynamicPrice: (basePrice: number, date: string) => number;
  getAvailabilityStatus: (date: string) => {
    available: boolean;
    remainingSlots: number;
    urgencyLevel: 'high' | 'medium' | 'low' | 'none';
  };
  hasLastMinuteDeal: (date: string) => LastMinuteDeal | null;
}

/**
 * Hook for managing dynamic pricing and urgency mechanics
 * 
 * This hook provides functionality for:
 * - Fetching availability data for venues
 * - Fetching price slot data for dynamic pricing
 * - Fetching last minute deals for urgency mechanics
 * - Calculating dynamic prices based on date and demand
 * - Determining availability status and urgency level
 * 
 * @param options Options for filtering the data
 * @returns DynamicPricingResult with data and utility functions
 */
export function useDynamicPricing(
  options: DynamicPricingOptions = {}
): DynamicPricingResult {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [priceSlots, setPriceSlots] = useState<PriceSlot[]>([]);
  const [lastMinuteDeals, setLastMinuteDeals] = useState<LastMinuteDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDynamicPricingData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch availability data
        let availabilityQuery = supabase.from('availability').select('*');
        if (options.venueId) {
          availabilityQuery = availabilityQuery.eq('venue_id', options.venueId);
        }
        if (options.startDate) {
          availabilityQuery = availabilityQuery.gte('date', options.startDate);
        }
        if (options.endDate) {
          availabilityQuery = availabilityQuery.lte('date', options.endDate);
        }
        const { data: availabilityData, error: availabilityError } = await availabilityQuery;

        if (availabilityError) throw availabilityError;
        setAvailability(availabilityData || []);

        // Fetch price slot data
        let priceSlotsQuery = supabase.from('price_slots').select('*');
        if (options.venueId) {
          priceSlotsQuery = priceSlotsQuery.eq('venue_id', options.venueId);
        }
        if (options.startDate) {
          priceSlotsQuery = priceSlotsQuery.gte('date', options.startDate);
        }
        if (options.endDate) {
          priceSlotsQuery = priceSlotsQuery.lte('date', options.endDate);
        }
        const { data: priceSlotsData, error: priceSlotsError } = await priceSlotsQuery;

        if (priceSlotsError) throw priceSlotsError;
        setPriceSlots(priceSlotsData || []);

        // Fetch last minute deals
        let lastMinuteDealsQuery = supabase.from('last_minute_deals').select('*').eq('is_active', true);
        if (options.venueId) {
          lastMinuteDealsQuery = lastMinuteDealsQuery.eq('venue_id', options.venueId);
        }
        if (options.vendorId) {
          lastMinuteDealsQuery = lastMinuteDealsQuery.eq('vendor_id', options.vendorId);
        }
        if (options.startDate) {
          lastMinuteDealsQuery = lastMinuteDealsQuery.lte('end_date', options.startDate);
        }
        if (options.endDate) {
          lastMinuteDealsQuery = lastMinuteDealsQuery.gte('start_date', options.endDate);
        }
        const { data: lastMinuteDealsData, error: lastMinuteDealsError } = await lastMinuteDealsQuery;

        if (lastMinuteDealsError) throw lastMinuteDealsError;
        setLastMinuteDeals(lastMinuteDealsData || []);
      } catch (err) {
        console.error('Error fetching dynamic pricing data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch dynamic pricing data'));
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicPricingData();
  }, [options.venueId, options.vendorId, options.startDate, options.endDate]);

  /**
   * Calculate the dynamic price for a given base price and date
   * 
   * @param basePrice The base price of the venue or service
   * @param date The date for which to calculate the price
   * @returns The calculated dynamic price
   */
  const calculateDynamicPrice = (basePrice: number, date: string): number => {
    // Find price multiplier for the date if it exists
    const priceSlot = priceSlots.find(slot => 
      slot.venue_id === options.venueId && 
      slot.date === date
    );
    
    // Find last minute deal if it exists
    const lastMinuteDeal = hasLastMinuteDeal(date);
    
    // Calculate price with multiplier
    let finalPrice = basePrice;
    if (priceSlot) {
      finalPrice = basePrice * priceSlot.price_multiplier;
    }
    
    // Apply discount if there's a last minute deal
    if (lastMinuteDeal) {
      finalPrice = finalPrice * (1 - (lastMinuteDeal.discount_percentage / 100));
    }
    
    return finalPrice;
  };

  /**
   * Get the availability status for a specific date
   * 
   * @param date The date to check availability for
   * @returns Object with availability status, remaining slots, and urgency level
   */
  const getAvailabilityStatus = (date: string) => {
    // Find availability for the date if it exists
    const availabilityEntry = availability.find(entry => 
      entry.venue_id === options.venueId && 
      entry.date === date
    );
    
    if (!availabilityEntry) {
      return {
        available: true, // Default to available if no entry
        remainingSlots: 1,
        urgencyLevel: 'none' as const
      };
    }
    
    // Determine urgency level based on remaining slots
    let urgencyLevel: 'high' | 'medium' | 'low' | 'none';
    if (!availabilityEntry.is_available || availabilityEntry.remaining_slots === 0) {
      urgencyLevel = 'none'; // Not available
    } else if (availabilityEntry.remaining_slots === 1) {
      urgencyLevel = 'high'; // Last slot available
    } else if (availabilityEntry.remaining_slots <= 3) {
      urgencyLevel = 'medium'; // Few slots left
    } else {
      urgencyLevel = 'low'; // Many slots available
    }
    
    return {
      available: availabilityEntry.is_available,
      remainingSlots: availabilityEntry.remaining_slots,
      urgencyLevel
    };
  };

  /**
   * Check if there's a last minute deal for a specific date
   * 
   * @param date The date to check for last minute deals
   * @returns The last minute deal if found, null otherwise
   */
  const hasLastMinuteDeal = (date: string): LastMinuteDeal | null => {
    // Find last minute deal that covers the date
    const deal = lastMinuteDeals.find(deal => {
      const dealStartDate = new Date(deal.start_date);
      const dealEndDate = new Date(deal.end_date);
      const checkDate = new Date(date);
      
      return (
        (deal.venue_id === options.venueId || deal.vendor_id === options.vendorId) &&
        checkDate >= dealStartDate &&
        checkDate <= dealEndDate &&
        deal.is_active
      );
    });
    
    return deal || null;
  };

  return {
    availability,
    priceSlots,
    lastMinuteDeals,
    loading,
    error,
    calculateDynamicPrice,
    getAvailabilityStatus,
    hasLastMinuteDeal
  };
}

export default useDynamicPricing;
