import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Booking {
  id: string;
  listing_id: string;
  user_id: string;
  event_date: string;
  guest_count?: number;
  total_amount: number;
  advance_amount?: number;
  remaining_amount?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  advance_paid: boolean;
  fully_paid: boolean;
  created_at: string;
  listings: {
    id: string;
    title: string;
    listing_type: string;
    owner_id: string;
    venues?: { name: string; address: string };
    vendors?: { name: string; category: string };
  };
  payments?: Array<{
    id: string;
    amount: number;
    status: string;
    payment_method: string;
  }>;
}

export function useBookings(filters: { status?: string; listing_id?: string } = {}) {
  const queryParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    )
  );

  return useQuery<{ bookings: Booking[] }>({
    queryKey: ['bookings', filters],
    queryFn: async () => {
      const response = await fetch(`/api/bookings?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      return response.json();
    },
  });
}

export function useNegotiations(filters: { listing_id?: string; status?: string } = {}) {
  const queryParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    )
  );

  return useQuery({
    queryKey: ['negotiations', filters],
    queryFn: async () => {
      const response = await fetch(`/api/negotiations?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch negotiations');
      }
      return response.json();
    },
  });
}

export function useCreateNegotiation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      listing_id: string;
      event_date: string;
      guest_count?: number;
      initial_price: number;
      message?: string;
    }) => {
      const response = await fetch('/api/negotiations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create negotiation');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['negotiations'] });
    },
  });
}

export function useCounterOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      negotiationId, 
      price, 
      message 
    }: { 
      negotiationId: string; 
      price: number; 
      message?: string;
    }) => {
      const response = await fetch(`/api/negotiations/${negotiationId}/counter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, message }),
      });
      if (!response.ok) {
        throw new Error('Failed to send counter offer');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['negotiations'] });
    },
  });
}

export function useAcceptNegotiation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      negotiationId, 
      message 
    }: { 
      negotiationId: string; 
      message?: string;
    }) => {
      const response = await fetch(`/api/negotiations/${negotiationId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        throw new Error('Failed to accept negotiation');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['negotiations'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      listing_id: string;
      event_date: string;
      guest_count?: number;
      total_amount: number;
      advance_amount?: number;
      special_requests?: string;
    }) => {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create booking');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      bookingId, 
      data 
    }: { 
      bookingId: string; 
      data: Partial<Booking>;
    }) => {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update booking');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      bookingId, 
      reason 
    }: { 
      bookingId: string; 
      reason?: string;
    }) => {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
