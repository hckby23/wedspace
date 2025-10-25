"use client";

import { supabase } from '@/integrations/supabase/client';

export interface AvailabilityCalendar {
  id: string;
  listing_id: string;
  date: string;
  status: string;
  base_price: number;
  special_price?: number;
  max_capacity?: number;
  current_bookings: number;
  notes?: string;
}

export interface TimeSlot {
  id: string;
  listing_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  price: number;
  reserved_until?: string;
}

export interface BlockedDate {
  id: string;
  listing_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  block_type: string;
}

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export class AvailabilityService {
  /**
   * Check if a date is available
   */
  static async checkAvailability(params: {
    listing_id: string;
    date: string;
    start_time?: string;
    end_time?: string;
  }): Promise<ServiceResponse<{
    is_available: boolean;
    status: string;
    reason: string;
    available_slots?: number;
  }>> {
    try {
      const { data, error } = await supabase.rpc('check_date_availability', {
        p_listing_id: params.listing_id,
        p_date: params.date,
        p_start_time: params.start_time || null,
        p_end_time: params.end_time || null
      });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: data[0], error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to check availability',
        success: false
      };
    }
  }

  /**
   * Get available dates in a range
   */
  static async getAvailableDates(params: {
    listing_id: string;
    start_date: string;
    end_date: string;
  }): Promise<ServiceResponse<Array<{
    date: string;
    status: string;
    price: number;
    available_slots?: number;
  }>>> {
    try {
      const { data, error } = await supabase.rpc('get_available_dates', {
        p_listing_id: params.listing_id,
        p_start_date: params.start_date,
        p_end_date: params.end_date
      });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch available dates',
        success: false
      };
    }
  }

  /**
   * Set availability for a date
   */
  static async setAvailability(params: {
    listing_id: string;
    owner_id: string;
    date: string;
    status: string;
    base_price?: number;
    special_price?: number;
    max_capacity?: number;
    notes?: string;
  }): Promise<ServiceResponse<AvailabilityCalendar>> {
    try {
      const { data, error } = await supabase
        .from('availability_calendar')
        .upsert({
          listing_id: params.listing_id,
          owner_id: params.owner_id,
          date: params.date,
          status: params.status,
          base_price: params.base_price,
          special_price: params.special_price,
          max_capacity: params.max_capacity,
          notes: params.notes,
          is_all_day: true
        }, {
          onConflict: 'listing_id,date,start_time'
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
        error: error instanceof Error ? error.message : 'Failed to set availability',
        success: false
      };
    }
  }

  /**
   * Block dates
   */
  static async blockDates(params: {
    listing_id: string;
    owner_id: string;
    start_date: string;
    end_date: string;
    reason: string;
    block_type?: string;
  }): Promise<ServiceResponse<string>> {
    try {
      const { data, error } = await supabase.rpc('block_dates', {
        p_listing_id: params.listing_id,
        p_owner_id: params.owner_id,
        p_start_date: params.start_date,
        p_end_date: params.end_date,
        p_reason: params.reason,
        p_block_type: params.block_type || 'other'
      });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to block dates',
        success: false
      };
    }
  }

  /**
   * Unblock dates
   */
  static async unblockDates(blocked_date_id: string): Promise<ServiceResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('blocked_dates')
        .update({ is_active: false })
        .eq('id', blocked_date_id);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: true, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to unblock dates',
        success: false
      };
    }
  }

  /**
   * Get blocked dates for a listing
   */
  static async getBlockedDates(listing_id: string): Promise<ServiceResponse<BlockedDate[]>> {
    try {
      const { data, error } = await supabase
        .from('blocked_dates')
        .select('*')
        .eq('listing_id', listing_id)
        .eq('is_active', true)
        .order('start_date');

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch blocked dates',
        success: false
      };
    }
  }

  /**
   * Create time slots for a date
   */
  static async createTimeSlots(params: {
    listing_id: string;
    date: string;
    start_time: string;
    end_time: string;
    slot_duration_minutes: number;
    price: number;
  }): Promise<ServiceResponse<TimeSlot[]>> {
    try {
      // Generate time slots
      const slots: any[] = [];
      const start = new Date(`${params.date}T${params.start_time}`);
      const end = new Date(`${params.date}T${params.end_time}`);
      
      let current = new Date(start);
      while (current < end) {
        const slotEnd = new Date(current.getTime() + params.slot_duration_minutes * 60000);
        if (slotEnd > end) break;
        
        slots.push({
          listing_id: params.listing_id,
          date: params.date,
          start_time: current.toTimeString().slice(0, 8),
          end_time: slotEnd.toTimeString().slice(0, 8),
          duration_minutes: params.slot_duration_minutes,
          price: params.price,
          status: 'available'
        });
        
        current = slotEnd;
      }

      const { data, error } = await supabase
        .from('time_slots')
        .insert(slots)
        .select();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create time slots',
        success: false
      };
    }
  }

  /**
   * Reserve a time slot
   */
  static async reserveTimeSlot(params: {
    slot_id: string;
    user_id: string;
    reservation_minutes?: number;
  }): Promise<ServiceResponse<boolean>> {
    try {
      const { data, error } = await supabase.rpc('reserve_time_slot', {
        p_slot_id: params.slot_id,
        p_user_id: params.user_id,
        p_reservation_minutes: params.reservation_minutes || 15
      });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: true, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to reserve time slot',
        success: false
      };
    }
  }

  /**
   * Get time slots for a date
   */
  static async getTimeSlots(params: {
    listing_id: string;
    date: string;
  }): Promise<ServiceResponse<TimeSlot[]>> {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('listing_id', params.listing_id)
        .eq('date', params.date)
        .order('start_time');

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch time slots',
        success: false
      };
    }
  }

  /**
   * Update booking count after booking
   */
  static async updateBookingCount(params: {
    listing_id: string;
    date: string;
    increment: boolean;
  }): Promise<ServiceResponse<boolean>> {
    try {
      const { error } = await supabase.rpc('update_booking_count', {
        p_listing_id: params.listing_id,
        p_date: params.date,
        p_increment: params.increment
      });

      if (error) {
        // If function doesn't exist, manually adjust count
        const { data: calendarRow, error: fetchError } = await supabase
          .from('availability_calendar')
          .select('current_bookings')
          .eq('listing_id', params.listing_id)
          .eq('date', params.date)
          .single();

        if (fetchError) {
          return { data: null, error: fetchError.message, success: false };
        }

        const currentCount = calendarRow?.current_bookings ?? 0;
        const newCount = params.increment
          ? currentCount + 1
          : Math.max(currentCount - 1, 0);

        const { error: updateError } = await supabase
          .from('availability_calendar')
          .update({ current_bookings: newCount })
          .eq('listing_id', params.listing_id)
          .eq('date', params.date);

        if (updateError) {
          return { data: null, error: updateError.message, success: false };
        }
      }

      return { data: true, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update booking count',
        success: false
      };
    }
  }

  /**
   * Get calendar sync settings
   */
  static async getCalendarSyncSettings(params: {
    user_id: string;
    listing_id?: string;
  }): Promise<ServiceResponse<any>> {
    try {
      let query = supabase
        .from('calendar_sync_settings')
        .select('*')
        .eq('user_id', params.user_id);

      if (params.listing_id) {
        query = query.eq('listing_id', params.listing_id);
      }

      const { data, error } = await query.single();

      if (error && error.code !== 'PGRST116') { // Not found is ok
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch sync settings',
        success: false
      };
    }
  }

  /**
   * Update calendar sync settings
   */
  static async updateCalendarSyncSettings(params: {
    user_id: string;
    listing_id?: string;
    google_calendar_enabled?: boolean;
    google_calendar_id?: string;
    sync_direction?: string;
    auto_sync_enabled?: boolean;
  }): Promise<ServiceResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('calendar_sync_settings')
        .upsert({
          user_id: params.user_id,
          listing_id: params.listing_id,
          google_calendar_enabled: params.google_calendar_enabled,
          google_calendar_id: params.google_calendar_id,
          sync_direction: params.sync_direction,
          auto_sync_enabled: params.auto_sync_enabled
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
        error: error instanceof Error ? error.message : 'Failed to update sync settings',
        success: false
      };
    }
  }
}
