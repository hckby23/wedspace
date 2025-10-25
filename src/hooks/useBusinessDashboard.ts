"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface BusinessStats {
  totalBookings: number;
  totalRevenue: number;
  activeListings: number;
  averageRating: number;
  completedBookings: number;
  pendingBookings: number;
  totalReviews: number;
  responseRate: number;
}

export interface RecentBooking {
  id: string;
  customer_name: string;
  event_date: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface ListingPerformance {
  listing_id: string;
  title: string;
  views: number;
  inquiries: number;
  bookings: number;
  revenue: number;
  conversion_rate: number;
}

export function useBusinessDashboard(businessType: 'vendor' | 'venue') {
  const { user } = useAuth();
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [listingPerformance, setListingPerformance] = useState<ListingPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch business stats
  const fetchStats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/business/stats?type=${businessType}`);
      if (!response.ok) {
        throw new Error('Failed to fetch business stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [user, businessType]);

  // Fetch recent bookings
  const fetchRecentBookings = useCallback(async (limit = 5) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/business/bookings?type=${businessType}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setRecentBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  }, [user, businessType]);

  // Fetch listing performance
  const fetchListingPerformance = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/business/performance?type=${businessType}`);
      if (!response.ok) {
        throw new Error('Failed to fetch performance data');
      }
      const data = await response.json();
      setListingPerformance(data);
    } catch (err) {
      console.error('Error fetching performance:', err);
    }
  }, [user, businessType]);

  // Update listing availability
  const updateAvailability = useCallback(async (
    listingId: string,
    dates: { start_date: string; end_date: string; is_available: boolean }[]
  ) => {
    try {
      const response = await fetch('/api/business/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, dates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      return true;
    } catch (err) {
      console.error('Error updating availability:', err);
      return false;
    }
  }, []);

  // Update booking status
  const updateBookingStatus = useCallback(async (
    bookingId: string,
    status: string
  ) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      // Refresh bookings
      await fetchRecentBookings();
      await fetchStats();

      return true;
    } catch (err) {
      console.error('Error updating booking status:', err);
      return false;
    }
  }, [fetchRecentBookings, fetchStats]);

  // Upload media for listing
  const uploadMedia = useCallback(async (
    listingId: string,
    files: File[]
  ) => {
    try {
      const formData = new FormData();
      formData.append('listing_id', listingId);
      files.forEach(file => formData.append('files', file));

      const response = await fetch('/api/business/media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload media');
      }

      return true;
    } catch (err) {
      console.error('Error uploading media:', err);
      return false;
    }
  }, []);

  // Fetch all data on mount
  useEffect(() => {
    if (user) {
      fetchStats();
      fetchRecentBookings();
      fetchListingPerformance();
    }
  }, [user, fetchStats, fetchRecentBookings, fetchListingPerformance]);

  return {
    stats,
    recentBookings,
    listingPerformance,
    loading,
    error,
    refetch: fetchStats,
    updateAvailability,
    updateBookingStatus,
    uploadMedia,
  };
}
