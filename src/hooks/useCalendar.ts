import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarService } from '@/services/CalendarService';
import type { Database } from '@/types/db';

type AvailabilitySlot = Database['public']['Tables']['availability_calendar']['Row'];

export function useCalendar(params: {
  venueId?: string;
  vendorId?: string;
  listingId?: string;
  startDate: string;
  endDate: string;
}) {
  const queryClient = useQueryClient();

  const { data: availability = [], isLoading } = useQuery({
    queryKey: ['calendar', params],
    queryFn: () => calendarService.getAvailability(params),
    enabled: !!(params.venueId || params.vendorId || params.listingId)
  });

  const { data: urgencyInfo } = useQuery({
    queryKey: ['calendar-urgency', params],
    queryFn: () => calendarService.getUrgencyInfo(params),
    enabled: !!(params.venueId || params.vendorId || params.listingId)
  });

  const blockDateMutation = useMutation({
    mutationFn: (blockParams: {
      date: string;
      timeSlot?: string;
      bookingId?: string;
      notes?: string;
    }) => calendarService.blockDate({
      ...params,
      ...blockParams
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    }
  });

  const releaseDateMutation = useMutation({
    mutationFn: (releaseParams: {
      date: string;
      timeSlot?: string;
    }) => calendarService.releaseDate({
      ...params,
      ...releaseParams
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    }
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!params.venueId && !params.vendorId && !params.listingId) return;

    const channel = calendarService.subscribeToAvailability(params, () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [params.venueId, params.vendorId, params.listingId, queryClient]);

  return {
    availability,
    isLoading,
    urgencyInfo,
    blockDate: blockDateMutation.mutateAsync,
    releaseDate: releaseDateMutation.mutateAsync,
    isBlocking: blockDateMutation.isPending,
    isReleasing: releaseDateMutation.isPending
  };
}

export function useMonthlyAvailability(params: {
  year: number;
  month: number;
  venueId?: string;
  vendorId?: string;
  listingId?: string;
}) {
  const { data: availableDates = [], isLoading } = useQuery({
    queryKey: ['monthly-availability', params],
    queryFn: () => calendarService.getAvailableDates(params),
    enabled: !!(params.venueId || params.vendorId || params.listingId)
  });

  return {
    availableDates,
    isLoading,
    isDateAvailable: (date: string) => availableDates.includes(date)
  };
}
