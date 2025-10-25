import { createClient } from '@/integrations/supabase/client';
import type { Database } from '@/types/db';

type AvailabilitySlot = Database['public']['Tables']['availability_calendar']['Row'];
type AvailabilityInsert = Database['public']['Tables']['availability_calendar']['Insert'];
type AvailabilityUpdate = Database['public']['Tables']['availability_calendar']['Update'];

export class CalendarService {
  private supabase = createClient();

  // Get availability for a date range
  async getAvailability(params: {
    venueId?: string;
    vendorId?: string;
    listingId?: string;
    startDate: string;
    endDate: string;
  }): Promise<AvailabilitySlot[]> {
    try {
      let query = this.supabase
        .from('availability_calendar')
        .select('*')
        .gte('date', params.startDate)
        .lte('date', params.endDate);

      if (params.venueId) query = query.eq('venue_id', params.venueId);
      if (params.vendorId) query = query.eq('vendor_id', params.vendorId);
      if (params.listingId) query = query.eq('listing_id', params.listingId);

      const { data, error } = await query.order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching availability:', error);
      return [];
    }
  }

  // Check if a specific date is available
  async isDateAvailable(params: {
    date: string;
    venueId?: string;
    vendorId?: string;
    listingId?: string;
    timeSlot?: string;
  }): Promise<boolean> {
    try {
      let query = this.supabase
        .from('availability_calendar')
        .select('status')
        .eq('date', params.date);

      if (params.venueId) query = query.eq('venue_id', params.venueId);
      if (params.vendorId) query = query.eq('vendor_id', params.vendorId);
      if (params.listingId) query = query.eq('listing_id', params.listingId);
      if (params.timeSlot) query = query.eq('time_slot', params.timeSlot);

      const { data } = await query.single();

      return data?.status === 'available';
    } catch {
      return false;
    }
  }

  // Block dates (for booking or manual blocking)
  async blockDate(params: {
    date: string;
    venueId?: string;
    vendorId?: string;
    listingId?: string;
    timeSlot?: string;
    bookingId?: string;
    notes?: string;
  }): Promise<AvailabilitySlot | null> {
    try {
      const { data, error } = await this.supabase
        .from('availability_calendar')
        .upsert({
          date: params.date,
          venue_id: params.venueId || null,
          vendor_id: params.vendorId || null,
          listing_id: params.listingId || null,
          time_slot: params.timeSlot || null,
          status: params.bookingId ? 'booked' : 'blocked',
          booking_id: params.bookingId || null,
          notes: params.notes || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error blocking date:', error);
      return null;
    }
  }

  // Release date (make available again)
  async releaseDate(params: {
    date: string;
    venueId?: string;
    vendorId?: string;
    listingId?: string;
    timeSlot?: string;
  }): Promise<boolean> {
    try {
      let query = this.supabase
        .from('availability_calendar')
        .update({ status: 'available', booking_id: null })
        .eq('date', params.date);

      if (params.venueId) query = query.eq('venue_id', params.venueId);
      if (params.vendorId) query = query.eq('vendor_id', params.vendorId);
      if (params.listingId) query = query.eq('listing_id', params.listingId);
      if (params.timeSlot) query = query.eq('time_slot', params.timeSlot);

      const { error } = await query;

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error releasing date:', error);
      return false;
    }
  }

  // Get available dates in a month
  async getAvailableDates(params: {
    year: number;
    month: number;
    venueId?: string;
    vendorId?: string;
    listingId?: string;
  }): Promise<string[]> {
    try {
      const startDate = `${params.year}-${String(params.month).padStart(2, '0')}-01`;
      const endDate = `${params.year}-${String(params.month).padStart(2, '0')}-31`;

      const slots = await this.getAvailability({
        ...params,
        startDate,
        endDate
      });

      return slots
        .filter(slot => slot.status === 'available')
        .map(slot => slot.date);
    } catch (error) {
      console.error('Error getting available dates:', error);
      return [];
    }
  }

  // Bulk create availability (for initial setup)
  async createBulkAvailability(params: {
    venueId?: string;
    vendorId?: string;
    listingId?: string;
    startDate: string;
    endDate: string;
    blockedDates?: string[];
  }): Promise<boolean> {
    try {
      const dates: AvailabilityInsert[] = [];
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const isBlocked = params.blockedDates?.includes(dateStr);

        dates.push({
          date: dateStr,
          venue_id: params.venueId || null,
          vendor_id: params.vendorId || null,
          listing_id: params.listingId || null,
          status: isBlocked ? 'blocked' : 'available'
        });
      }

      const { error } = await this.supabase
        .from('availability_calendar')
        .upsert(dates);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating bulk availability:', error);
      return false;
    }
  }

  // Get urgency info (how many slots left in peak season)
  async getUrgencyInfo(params: {
    venueId?: string;
    vendorId?: string;
    listingId?: string;
    startDate: string;
    endDate: string;
  }): Promise<{
    availableCount: number;
    totalCount: number;
    bookedCount: number;
    urgencyLevel: 'low' | 'medium' | 'high';
    message: string;
  }> {
    try {
      const slots = await this.getAvailability(params);

      const availableCount = slots.filter(s => s.status === 'available').length;
      const bookedCount = slots.filter(s => s.status === 'booked').length;
      const totalCount = slots.length;

      const availabilityPercent = (availableCount / totalCount) * 100;

      let urgencyLevel: 'low' | 'medium' | 'high';
      let message: string;

      if (availabilityPercent > 50) {
        urgencyLevel = 'low';
        message = 'Good availability';
      } else if (availabilityPercent > 20) {
        urgencyLevel = 'medium';
        message = `Only ${availableCount} dates left!`;
      } else {
        urgencyLevel = 'high';
        message = `Limited availability - Only ${availableCount} slots remaining!`;
      }

      return {
        availableCount,
        totalCount,
        bookedCount,
        urgencyLevel,
        message
      };
    } catch (error) {
      console.error('Error getting urgency info:', error);
      return {
        availableCount: 0,
        totalCount: 0,
        bookedCount: 0,
        urgencyLevel: 'low',
        message: 'Unable to fetch availability'
      };
    }
  }

  // Subscribe to availability changes
  subscribeToAvailability(
    params: {
      venueId?: string;
      vendorId?: string;
      listingId?: string;
    },
    callback: (slot: AvailabilitySlot) => void
  ) {
    let filter = '';
    if (params.venueId) filter = `venue_id=eq.${params.venueId}`;
    if (params.vendorId) filter = `vendor_id=eq.${params.vendorId}`;
    if (params.listingId) filter = `listing_id=eq.${params.listingId}`;

    return this.supabase
      .channel('availability-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'availability_calendar',
          filter
        },
        (payload) => callback(payload.new as AvailabilitySlot)
      )
      .subscribe();
  }
}

export const calendarService = new CalendarService();
