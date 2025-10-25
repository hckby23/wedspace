"use client";

import { supabase } from '@/integrations/supabase/client';

export interface BookingData {
  id: string;
  user_id: string;
  listing_id: string;
  booking_type: 'venue' | 'vendor';
  event_date: string;
  time_slot?: string;
  guest_count: number;
  event_type: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_requests?: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  listing?: {
    id: string;
    name: string;
    image: string;
    location: string;
    type: string;
  };
}

export interface BookingServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export class BookingService {
  // Create a new booking
  static async createBooking(bookingData: {
    listing_id: string;
    booking_type: 'venue' | 'vendor';
    event_date: string;
    time_slot?: string;
    guest_count: number;
    event_type: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    special_requests?: string;
    total_amount: number;
  }): Promise<BookingServiceResponse<BookingData>> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        return { data: null, error: 'User not authenticated', success: false };
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: user.user.id,
          status: 'pending'
        })
        .select(`
          *,
          listing:listings (
            id,
            name,
            image,
            city,
            venue_type
          )
        `)
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      // Send notification to venue/vendor
      await this.sendBookingNotification(data.id, 'created');

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Get user's bookings
  static async getUserBookings(
    userId?: string,
    status?: string,
    type?: 'venue' | 'vendor'
  ): Promise<BookingServiceResponse<BookingData[]>> {
    try {
      const { data: user } = await supabase.auth.getUser();
      const targetUserId = userId || user.user?.id;
      
      if (!targetUserId) {
        return { data: null, error: 'User not authenticated', success: false };
      }

      let query = supabase
        .from('bookings')
        .select(`
          *,
          listing:listings (
            id,
            name,
            image,
            city,
            venue_type
          )
        `)
        .eq('user_id', targetUserId);

      if (status) {
        query = query.eq('status', status);
      }

      if (type) {
        query = query.eq('booking_type', type);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

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

  // Get single booking
  static async getBooking(bookingId: string): Promise<BookingServiceResponse<BookingData>> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          listing:listings (
            id,
            name,
            image,
            city,
            venue_type,
            contact_phone,
            contact_email
          )
        `)
        .eq('id', bookingId)
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

  // Update booking status
  static async updateBookingStatus(
    bookingId: string,
    status: BookingData['status'],
    notes?: string
  ): Promise<BookingServiceResponse<BookingData>> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          status,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select(`
          *,
          listing:listings (
            id,
            name,
            image,
            city,
            venue_type
          )
        `)
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      // Send notification about status change
      await this.sendBookingNotification(bookingId, status);

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Cancel booking
  static async cancelBooking(
    bookingId: string,
    reason?: string
  ): Promise<BookingServiceResponse<BookingData>> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select(`
          *,
          listing:listings (
            id,
            name,
            image,
            city,
            venue_type
          )
        `)
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      // Send cancellation notification
      await this.sendBookingNotification(bookingId, 'cancelled');

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Get bookings for a venue/vendor (for business owners)
  static async getListingBookings(
    listingId: string,
    status?: string
  ): Promise<BookingServiceResponse<BookingData[]>> {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          user:profiles (
            id,
            full_name,
            email,
            phone
          )
        `)
        .eq('listing_id', listingId);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('event_date', { ascending: true });

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

  // Get booking analytics
  static async getBookingAnalytics(
    listingId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<BookingServiceResponse<{
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    averageBookingValue: number;
    bookingsByMonth: Array<{ month: string; count: number; revenue: number }>;
  }>> {
    try {
      let query = supabase
        .from('bookings')
        .select('status, total_amount, created_at');

      if (listingId) {
        query = query.eq('listing_id', listingId);
      }

      if (startDate) {
        query = query.gte('created_at', startDate);
      }

      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      const bookings = data || [];
      
      const analytics = {
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
        totalRevenue: bookings
          .filter(b => b.status === 'confirmed')
          .reduce((sum, b) => sum + (b.total_amount || 0), 0),
        averageBookingValue: 0,
        bookingsByMonth: []
      };

      analytics.averageBookingValue = analytics.confirmedBookings > 0 
        ? analytics.totalRevenue / analytics.confirmedBookings 
        : 0;

      // Group bookings by month
      const monthlyData = bookings.reduce((acc, booking) => {
        const month = new Date(booking.created_at).toISOString().slice(0, 7);
        if (!acc[month]) {
          acc[month] = { count: 0, revenue: 0 };
        }
        acc[month].count++;
        if (booking.status === 'confirmed') {
          acc[month].revenue += booking.total_amount || 0;
        }
        return acc;
      }, {} as Record<string, { count: number; revenue: number }>);

      analytics.bookingsByMonth = Object.entries(monthlyData).map(([month, data]) => ({
        month,
        count: (data as { count: number; revenue: number }).count,
        revenue: (data as { count: number; revenue: number }).revenue
      }));

      return { data: analytics, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Check booking conflicts
  static async checkBookingConflicts(
    listingId: string,
    eventDate: string,
    timeSlot?: string
  ): Promise<BookingServiceResponse<{ hasConflict: boolean; conflictingBookings: BookingData[] }>> {
    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .eq('listing_id', listingId)
        .eq('event_date', eventDate)
        .in('status', ['confirmed', 'pending']);

      if (timeSlot) {
        query = query.eq('time_slot', timeSlot);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      const conflictingBookings = data || [];
      
      return {
        data: {
          hasConflict: conflictingBookings.length > 0,
          conflictingBookings
        },
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

  // Send booking notification (placeholder for notification service)
  private static async sendBookingNotification(
    bookingId: string,
    type: 'created' | 'confirmed' | 'cancelled' | 'pending' | 'completed'
  ): Promise<void> {
    try {
      // This would integrate with your notification service
      // For now, we'll just log the notification
      console.log(`Booking notification: ${type} for booking ${bookingId}`);
      
      // In a real implementation, you might:
      // - Send email notifications
      // - Send SMS notifications
      // - Create in-app notifications
      // - Send push notifications
      
    } catch (error) {
      console.error('Failed to send booking notification:', error);
    }
  }

  // Get upcoming bookings
  static async getUpcomingBookings(
    userId?: string,
    days = 30
  ): Promise<BookingServiceResponse<BookingData[]>> {
    try {
      const { data: user } = await supabase.auth.getUser();
      const targetUserId = userId || user.user?.id;
      
      if (!targetUserId) {
        return { data: null, error: 'User not authenticated', success: false };
      }

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          listing:listings (
            id,
            name,
            image,
            city,
            venue_type
          )
        `)
        .eq('user_id', targetUserId)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .lte('event_date', futureDate.toISOString().split('T')[0])
        .in('status', ['confirmed', 'pending'])
        .order('event_date', { ascending: true });

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
