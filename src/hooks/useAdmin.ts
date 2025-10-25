"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface PlatformStats {
  totalUsers: number;
  totalVenues: number;
  totalVendors: number;
  totalBookings: number;
  monthlyRevenue: number;
  commissionEarned: number;
  activeListings: number;
  pendingApprovals: number;
}

export interface Activity {
  id: string;
  type: 'booking' | 'venue' | 'vendor' | 'payment' | 'user';
  description: string;
  status: string;
  amount?: string;
  time: string;
}

export interface TopPerformer {
  type: 'venue' | 'vendor';
  name: string;
  bookings: number;
  revenue: string;
  rating: number;
}

export interface PendingApproval {
  id: string;
  type: 'venue' | 'vendor';
  name: string;
  location?: string;
  category?: string;
  submitted: string;
  status: string;
}

export function useAdmin() {
  const { user } = useAuth();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch platform stats
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch platform stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch recent activities
  const fetchActivities = useCallback(async (limit = 10) => {
    try {
      const response = await fetch(`/api/admin/activities?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const data = await response.json();
      setActivities(data);
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  }, []);

  // Fetch top performers
  const fetchTopPerformers = useCallback(async (limit = 5) => {
    try {
      const response = await fetch(`/api/admin/top-performers?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch top performers');
      }
      const data = await response.json();
      setTopPerformers(data);
    } catch (err) {
      console.error('Error fetching top performers:', err);
    }
  }, []);

  // Fetch pending approvals
  const fetchPendingApprovals = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/approvals');
      if (!response.ok) {
        throw new Error('Failed to fetch pending approvals');
      }
      const data = await response.json();
      setPendingApprovals(data);
    } catch (err) {
      console.error('Error fetching approvals:', err);
    }
  }, []);

  // Approve a listing
  const approveListing = useCallback(async (listingId: string) => {
    try {
      const response = await fetch(`/api/admin/listings/${listingId}/approve`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to approve listing');
      }
      await fetchPendingApprovals();
      return true;
    } catch (err) {
      console.error('Error approving listing:', err);
      return false;
    }
  }, [fetchPendingApprovals]);

  // Reject a listing
  const rejectListing = useCallback(async (listingId: string, reason?: string) => {
    try {
      const response = await fetch(`/api/admin/listings/${listingId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) {
        throw new Error('Failed to reject listing');
      }
      await fetchPendingApprovals();
      return true;
    } catch (err) {
      console.error('Error rejecting listing:', err);
      return false;
    }
  }, [fetchPendingApprovals]);

  // Fetch all data on mount
  useEffect(() => {
    if (user) {
      fetchStats();
      fetchActivities();
      fetchTopPerformers();
      fetchPendingApprovals();
    }
  }, [user, fetchStats, fetchActivities, fetchTopPerformers, fetchPendingApprovals]);

  return {
    stats,
    activities,
    topPerformers,
    pendingApprovals,
    loading,
    error,
    refetch: fetchStats,
    approveListing,
    rejectListing,
  };
}
