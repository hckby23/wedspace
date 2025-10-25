"use client";

// Google Analytics 4 configuration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID) return;

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (!GA_TRACKING_ID || !window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_title: title || document.title,
    page_location: url,
  });
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (!GA_TRACKING_ID || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Wedding-specific event tracking
export const WeddingAnalytics = {
  // Venue tracking
  trackVenueView: (venueId: string, venueName: string, location: string) => {
    trackEvent('view_venue', 'venues', `${venueName} - ${location}`, 1);
    
    // Enhanced ecommerce tracking
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'INR',
        value: 0,
        items: [{
          item_id: venueId,
          item_name: venueName,
          item_category: 'venue',
          item_variant: location,
          quantity: 1
        }]
      });
    }
  },

  trackVenueInquiry: (venueId: string, venueName: string, price: number) => {
    trackEvent('venue_inquiry', 'engagement', venueName, price);
    
    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'INR',
        value: price,
        items: [{
          item_id: venueId,
          item_name: venueName,
          item_category: 'venue',
          price: price,
          quantity: 1
        }]
      });
    }
  },

  trackVenueBooking: (venueId: string, venueName: string, price: number, eventDate: string) => {
    trackEvent('venue_booking', 'conversion', venueName, price);
    
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: `booking_${Date.now()}`,
        currency: 'INR',
        value: price,
        items: [{
          item_id: venueId,
          item_name: venueName,
          item_category: 'venue',
          price: price,
          quantity: 1
        }],
        custom_parameters: {
          event_date: eventDate
        }
      });
    }
  },

  // Vendor tracking
  trackVendorView: (vendorId: string, vendorName: string, category: string) => {
    trackEvent('view_vendor', 'vendors', `${vendorName} - ${category}`, 1);
    
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'INR',
        value: 0,
        items: [{
          item_id: vendorId,
          item_name: vendorName,
          item_category: 'vendor',
          item_variant: category,
          quantity: 1
        }]
      });
    }
  },

  trackVendorContact: (vendorId: string, vendorName: string, contactMethod: 'phone' | 'email' | 'whatsapp') => {
    trackEvent('vendor_contact', 'engagement', `${vendorName} - ${contactMethod}`, 1);
  },

  // Search tracking
  trackSearch: (query: string, filters: Record<string, any>, resultCount: number) => {
    trackEvent('search', 'engagement', query, resultCount);
    
    if (window.gtag) {
      window.gtag('event', 'search', {
        search_term: query,
        custom_parameters: {
          filters: JSON.stringify(filters),
          result_count: resultCount
        }
      });
    }
  },

  // User engagement
  trackFavorite: (itemId: string, itemName: string, itemType: 'venue' | 'vendor') => {
    trackEvent('add_to_favorites', 'engagement', `${itemName} - ${itemType}`, 1);
    
    if (window.gtag) {
      window.gtag('event', 'add_to_wishlist', {
        currency: 'INR',
        value: 0,
        items: [{
          item_id: itemId,
          item_name: itemName,
          item_category: itemType,
          quantity: 1
        }]
      });
    }
  },

  trackShare: (itemId: string, itemName: string, platform: string) => {
    trackEvent('share', 'engagement', `${itemName} - ${platform}`, 1);
    
    if (window.gtag) {
      window.gtag('event', 'share', {
        method: platform,
        content_type: 'venue_vendor',
        item_id: itemId
      });
    }
  },

  // Planning tools
  trackToolUsage: (toolName: string, action: string) => {
    trackEvent('tool_usage', 'planning', `${toolName} - ${action}`, 1);
  },

  trackBudgetUpdate: (totalBudget: number, category: string) => {
    trackEvent('budget_update', 'planning', category, totalBudget);
  },

  trackChecklistComplete: (taskCount: number) => {
    trackEvent('checklist_complete', 'planning', 'tasks_completed', taskCount);
  },

  // AI features
  trackAIInteraction: (feature: string, query: string, resultCount?: number) => {
    trackEvent('ai_interaction', 'ai', `${feature} - ${query}`, resultCount);
  },

  trackAIRecommendation: (recommendationType: string, itemId: string, accepted: boolean) => {
    trackEvent('ai_recommendation', 'ai', `${recommendationType} - ${accepted ? 'accepted' : 'rejected'}`, 1);
  },

  // Payment tracking
  trackPaymentStart: (amount: number, paymentType: 'advance' | 'full') => {
    trackEvent('payment_start', 'payment', paymentType, amount);
    
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'INR',
        value: amount,
        custom_parameters: {
          payment_type: paymentType
        }
      });
    }
  },

  trackPaymentSuccess: (amount: number, paymentId: string, bookingId: string) => {
    trackEvent('payment_success', 'payment', 'completed', amount);
    
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: paymentId,
        currency: 'INR',
        value: amount,
        custom_parameters: {
          booking_id: bookingId
        }
      });
    }
  },

  trackPaymentFailure: (amount: number, reason: string) => {
    trackEvent('payment_failure', 'payment', reason, amount);
  },

  // User journey
  trackSignup: (method: 'email' | 'google' | 'facebook') => {
    trackEvent('sign_up', 'user', method, 1);
    
    if (window.gtag) {
      window.gtag('event', 'sign_up', {
        method: method
      });
    }
  },

  trackLogin: (method: 'email' | 'google' | 'facebook') => {
    trackEvent('login', 'user', method, 1);
    
    if (window.gtag) {
      window.gtag('event', 'login', {
        method: method
      });
    }
  },

  // Performance tracking
  trackPageLoadTime: (pageName: string, loadTime: number) => {
    trackEvent('page_load_time', 'performance', pageName, Math.round(loadTime));
    
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: 'page_load',
        value: Math.round(loadTime),
        event_category: 'performance',
        event_label: pageName
      });
    }
  },

  trackError: (errorType: string, errorMessage: string, page: string) => {
    trackEvent('error', 'technical', `${errorType} - ${page}`, 1);
    
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: errorMessage,
        fatal: false,
        custom_parameters: {
          error_type: errorType,
          page: page
        }
      });
    }
  }
};

// Custom dimensions and metrics
export const setUserProperties = (properties: Record<string, any>) => {
  if (!GA_TRACKING_ID || !window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    custom_map: properties
  });
};

// Set user ID for cross-device tracking
export const setUserId = (userId: string) => {
  if (!GA_TRACKING_ID || !window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    user_id: userId
  });
};

// Enhanced ecommerce tracking for wedding industry
export const trackWeddingFunnel = {
  // Step 1: Browse venues/vendors
  viewCategory: (category: 'venues' | 'vendors', location?: string) => {
    if (window.gtag) {
      window.gtag('event', 'view_item_list', {
        item_list_id: category,
        item_list_name: `${category} in ${location || 'India'}`,
        custom_parameters: {
          funnel_step: 'browse',
          location: location
        }
      });
    }
  },

  // Step 2: View specific item
  viewItem: (item: { id: string; name: string; category: string; price: number; location: string }) => {
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'INR',
        value: item.price,
        items: [{
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          item_variant: item.location,
          price: item.price,
          quantity: 1
        }],
        custom_parameters: {
          funnel_step: 'view_details'
        }
      });
    }
  },

  // Step 3: Show interest (inquiry/contact)
  showInterest: (item: { id: string; name: string; category: string; price: number }) => {
    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'INR',
        value: item.price,
        items: [{
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
          quantity: 1
        }],
        custom_parameters: {
          funnel_step: 'inquiry'
        }
      });
    }
  },

  // Step 4: Begin booking process
  beginBooking: (item: { id: string; name: string; category: string; price: number }) => {
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'INR',
        value: item.price,
        items: [{
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
          quantity: 1
        }],
        custom_parameters: {
          funnel_step: 'booking_start'
        }
      });
    }
  },

  // Step 5: Complete booking
  completeBooking: (booking: { 
    id: string; 
    item: { id: string; name: string; category: string; price: number };
    eventDate: string;
    guestCount: number;
  }) => {
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: booking.id,
        currency: 'INR',
        value: booking.item.price,
        items: [{
          item_id: booking.item.id,
          item_name: booking.item.name,
          item_category: booking.item.category,
          price: booking.item.price,
          quantity: 1
        }],
        custom_parameters: {
          funnel_step: 'booking_complete',
          event_date: booking.eventDate,
          guest_count: booking.guestCount
        }
      });
    }
  }
};

// Utility function to track page performance
export const trackPagePerformance = (pageName: string) => {
  if (typeof window === 'undefined') return;

  // Track page load time
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    WeddingAnalytics.trackPageLoadTime(pageName, loadTime);
  });

  // Track largest contentful paint
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      trackEvent('lcp', 'performance', pageName, Math.round(lastEntry.startTime));
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }
};
