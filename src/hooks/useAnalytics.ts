"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { WeddingAnalytics, trackEvent, trackPageView, initGA } from '@/lib/analytics';

// Analytics data types
interface AnalyticsOverview {
  totalViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  avgSessionDuration: number;
  bounceRate: number;
  totalBookings: number;
}

interface TrafficData {
  sources: Array<{ name: string; visitors: number; percentage: number }>;
  devices: Array<{ name: string; visitors: number; percentage: number }>;
  locations: Array<{ city: string; visitors: number; percentage: number }>;
}

interface EngagementData {
  topPages: Array<{ path: string; views: number; avgTime: number }>;
  searchQueries: Array<{ query: string; count: number; resultClicks: number }>;
  popularVenues: Array<{ name: string; views: number; inquiries: number }>;
  popularVendors: Array<{ name: string; views: number; contacts: number }>;
}

interface ConversionData {
  funnelSteps: Array<{ step: string; users: number; dropoffRate: number }>;
  bookingsByCategory: Array<{ category: string; bookings: number; revenue: number }>;
  monthlyTrends: Array<{ month: string; bookings: number; revenue: number }>;
}

// Initialize Google Analytics
export function useAnalyticsInit() {
  useEffect(() => {
    initGA();
  }, []);
}

// Track page views
export function usePageTracking() {
  useEffect(() => {
    const handleRouteChange = () => {
      trackPageView(window.location.pathname + window.location.search);
    };

    // Track initial page load
    handleRouteChange();

    // Listen for route changes (for SPA navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
}

// Analytics data fetching hooks
export function useAnalyticsOverview(dateRange: string = '30d') {
  return useQuery({
    queryKey: ['analytics', 'overview', dateRange],
    queryFn: async (): Promise<AnalyticsOverview> => {
      const response = await fetch(`/api/analytics/overview?range=${dateRange}`);
      if (!response.ok) throw new Error('Failed to fetch analytics overview');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}

export function useTrafficData(dateRange: string = '30d') {
  return useQuery({
    queryKey: ['analytics', 'traffic', dateRange],
    queryFn: async (): Promise<TrafficData> => {
      const response = await fetch(`/api/analytics/traffic?range=${dateRange}`);
      if (!response.ok) throw new Error('Failed to fetch traffic data');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useEngagementData(dateRange: string = '30d') {
  return useQuery({
    queryKey: ['analytics', 'engagement', dateRange],
    queryFn: async (): Promise<EngagementData> => {
      const response = await fetch(`/api/analytics/engagement?range=${dateRange}`);
      if (!response.ok) throw new Error('Failed to fetch engagement data');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useConversionData(dateRange: string = '30d') {
  return useQuery({
    queryKey: ['analytics', 'conversion', dateRange],
    queryFn: async (): Promise<ConversionData> => {
      const response = await fetch(`/api/analytics/conversion?range=${dateRange}`);
      if (!response.ok) throw new Error('Failed to fetch conversion data');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Real-time analytics
export function useRealTimeAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'realtime'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/realtime');
      if (!response.ok) throw new Error('Failed to fetch real-time data');
      return response.json();
    },
    refetchInterval: 30 * 1000, // 30 seconds
    staleTime: 0,
  });
}

// Event tracking hooks
export function useEventTracking() {
  const queryClient = useQueryClient();

  const trackVenueView = useMutation({
    mutationFn: async ({ venueId, venueName, location }: {
      venueId: string;
      venueName: string;
      location: string;
    }) => {
      WeddingAnalytics.trackVenueView(venueId, venueName, location);
      
      // Also send to backend for storage
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'venue_view',
          properties: { venueId, venueName, location }
        })
      });
      
      if (!response.ok) throw new Error('Failed to track event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });

  const trackVendorView = useMutation({
    mutationFn: async ({ vendorId, vendorName, category }: {
      vendorId: string;
      vendorName: string;
      category: string;
    }) => {
      WeddingAnalytics.trackVendorView(vendorId, vendorName, category);
      
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'vendor_view',
          properties: { vendorId, vendorName, category }
        })
      });
      
      if (!response.ok) throw new Error('Failed to track event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });

  const trackSearch = useMutation({
    mutationFn: async ({ query, filters, resultCount }: {
      query: string;
      filters: Record<string, any>;
      resultCount: number;
    }) => {
      WeddingAnalytics.trackSearch(query, filters, resultCount);
      
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'search',
          properties: { query, filters, resultCount }
        })
      });
      
      if (!response.ok) throw new Error('Failed to track event');
      return response.json();
    }
  });

  const trackBooking = useMutation({
    mutationFn: async ({ venueId, venueName, price, eventDate }: {
      venueId: string;
      venueName: string;
      price: number;
      eventDate: string;
    }) => {
      WeddingAnalytics.trackVenueBooking(venueId, venueName, price, eventDate);
      
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'booking',
          properties: { venueId, venueName, price, eventDate }
        })
      });
      
      if (!response.ok) throw new Error('Failed to track event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });

  const trackPayment = useMutation({
    mutationFn: async ({ amount, paymentId, bookingId, status }: {
      amount: number;
      paymentId: string;
      bookingId: string;
      status: 'success' | 'failure';
    }) => {
      if (status === 'success') {
        WeddingAnalytics.trackPaymentSuccess(amount, paymentId, bookingId);
      } else {
        WeddingAnalytics.trackPaymentFailure(amount, 'Payment failed');
      }
      
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'payment',
          properties: { amount, paymentId, bookingId, status }
        })
      });
      
      if (!response.ok) throw new Error('Failed to track event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });

  const trackUserAction = useMutation({
    mutationFn: async ({ action, category, label, value }: {
      action: string;
      category: string;
      label?: string;
      value?: number;
    }) => {
      trackEvent(action, category, label, value);
      
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: action,
          properties: { category, label, value }
        })
      });
      
      if (!response.ok) throw new Error('Failed to track event');
      return response.json();
    }
  });

  return {
    trackVenueView,
    trackVendorView,
    trackSearch,
    trackBooking,
    trackPayment,
    trackUserAction
  };
}

// Custom hook for tracking user interactions
export function useInteractionTracking() {
  const { trackUserAction } = useEventTracking();

  const trackClick = (element: string, location: string) => {
    trackUserAction.mutate({
      action: 'click',
      category: 'interaction',
      label: `${element}_${location}`
    });
  };

  const trackFormSubmit = (formName: string, success: boolean) => {
    trackUserAction.mutate({
      action: 'form_submit',
      category: 'engagement',
      label: formName,
      value: success ? 1 : 0
    });
  };

  const trackDownload = (fileName: string, fileType: string) => {
    trackUserAction.mutate({
      action: 'download',
      category: 'engagement',
      label: `${fileName}.${fileType}`
    });
  };

  const trackShare = (platform: string, contentType: string) => {
    trackUserAction.mutate({
      action: 'share',
      category: 'engagement',
      label: `${platform}_${contentType}`
    });
  };

  const trackVideoPlay = (videoId: string, duration?: number) => {
    trackUserAction.mutate({
      action: 'video_play',
      category: 'engagement',
      label: videoId,
      value: duration
    });
  };

  return {
    trackClick,
    trackFormSubmit,
    trackDownload,
    trackShare,
    trackVideoPlay
  };
}

// Performance tracking hook
export function usePerformanceTracking() {
  const { trackUserAction } = useEventTracking();

  useEffect(() => {
    // Track page load performance
    const trackPagePerformance = () => {
      if (typeof window === 'undefined') return;

      // Core Web Vitals tracking
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          trackUserAction.mutate({
            action: 'lcp',
            category: 'performance',
            label: window.location.pathname,
            value: Math.round(lastEntry.startTime)
          });
        });
        
        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP observer not supported');
        }

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            trackUserAction.mutate({
              action: 'fid',
              category: 'performance',
              label: window.location.pathname,
              value: Math.round(entry.processingStart - entry.startTime)
            });
          });
        });
        
        try {
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID observer not supported');
        }

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          if (clsValue > 0) {
            trackUserAction.mutate({
              action: 'cls',
              category: 'performance',
              label: window.location.pathname,
              value: Math.round(clsValue * 1000) // Convert to milliseconds
            });
          }
        });
        
        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS observer not supported');
        }
      }

      // Basic page load time
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        trackUserAction.mutate({
          action: 'page_load_time',
          category: 'performance',
          label: window.location.pathname,
          value: Math.round(loadTime)
        });
      });
    };

    trackPagePerformance();
  }, [trackUserAction]);
}

// Error tracking hook
export function useErrorTracking() {
  const { trackUserAction } = useEventTracking();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackUserAction.mutate({
        action: 'javascript_error',
        category: 'error',
        label: `${event.filename}:${event.lineno} - ${event.message}`,
        value: 1
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackUserAction.mutate({
        action: 'promise_rejection',
        category: 'error',
        label: event.reason?.toString() || 'Unknown promise rejection',
        value: 1
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackUserAction]);

  const trackCustomError = (error: Error, context?: string) => {
    trackUserAction.mutate({
      action: 'custom_error',
      category: 'error',
      label: `${context || 'Unknown'}: ${error.message}`,
      value: 1
    });
  };

  return { trackCustomError };
}
