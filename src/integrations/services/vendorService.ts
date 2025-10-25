import { supabase } from '../supabase/client';

/**
 * Interface for vendor profile data
 */
export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_type: 'photographer' | 'caterer' | 'decorator' | 'makeup' | 'music' | 'transport' | 'other';
  description: string;
  contact_email: string;
  contact_phone: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  logo_url?: string;
  cover_image_url?: string;
  gallery_images?: string[];
  services: VendorService[];
  rating?: number;
  review_count?: number;
  is_verified: boolean;
  is_featured: boolean;
  social_media?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Interface for vendor service data
 */
export interface VendorService {
  id: string;
  vendor_id: string;
  name: string;
  description: string;
  price: number;
  price_type: 'fixed' | 'starting_from' | 'per_person' | 'per_hour' | 'per_day';
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for vendor booking data
 */
export interface VendorBooking {
  id: string;
  vendor_id: string;
  user_id: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  status: 'inquiry' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_amount: number;
  services: string[]; // IDs of booked services
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for vendor analytics data
 */
export interface VendorAnalytics {
  profile_views: number;
  contact_clicks: number;
  booking_conversion_rate: number;
  average_rating: number;
  total_bookings: number;
  total_revenue: number;
  popular_services: {
    service_id: string;
    service_name: string;
    booking_count: number;
  }[];
  monthly_stats: {
    month: string;
    bookings: number;
    revenue: number;
    views: number;
  }[];
}

/**
 * Interface for vendor subscription data
 */
export interface VendorSubscription {
  id: string;
  vendor_id: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  features: string[];
  price_paid: number;
  created_at: string;
  updated_at: string;
}

/**
 * VendorService class for managing vendor-related operations
 * 
 * This service provides methods for:
 * - Fetching and updating vendor profiles
 * - Managing vendor services and pricing
 * - Handling vendor bookings and availability
 * - Tracking vendor analytics
 * - Managing vendor subscriptions
 */
export class VendorService {
  /**
   * Get a vendor profile by ID
   * 
   * @param id Vendor ID
   * @returns Promise with vendor profile data
   */
  static async getVendorById(id: string): Promise<VendorProfile | null> {
    try {
      // Fetch vendor profile
      const { data: vendor, error } = await supabase
        .from('vendors')
        .select(`
          *,
          services:vendor_services(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return vendor;
    } catch (error) {
      console.error('Error fetching vendor:', error);
      return null;
    }
  }

  /**
   * Get a vendor profile by user ID
   * 
   * @param userId User ID
   * @returns Promise with vendor profile data
   */
  static async getVendorByUserId(userId: string): Promise<VendorProfile | null> {
    try {
      const { data: vendor, error } = await supabase
        .from('vendors')
        .select(`
          *,
          services:vendor_services(*)
        `)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return vendor;
    } catch (error) {
      console.error('Error fetching vendor by user ID:', error);
      return null;
    }
  }

  /**
   * Create or update a vendor profile
   * 
   * @param vendorData Vendor profile data
   * @returns Promise with the created/updated vendor profile
   */
  static async upsertVendor(vendorData: Partial<VendorProfile>): Promise<VendorProfile | null> {
    try {
      // Extract services to insert separately
      const { services, ...vendorProfile } = vendorData;
      
      // Insert or update vendor profile
      const { data: vendor, error } = await supabase
        .from('vendors')
        .upsert(vendorProfile)
        .select()
        .single();

      if (error) throw error;
      
      // If services are provided, update them
      if (services && vendor) {
        await this.updateVendorServices(vendor.id, services);
      }
      
      // Fetch the complete vendor profile with services
      return await this.getVendorById(vendor.id);
    } catch (error) {
      console.error('Error upserting vendor:', error);
      return null;
    }
  }

  /**
   * Update vendor services
   * 
   * @param vendorId Vendor ID
   * @param services Array of services to update
   * @returns Promise with success status
   */
  static async updateVendorServices(
    vendorId: string, 
    services: Partial<VendorService>[]
  ): Promise<boolean> {
    try {
      // Ensure vendor_id is set for each service
      const servicesWithVendorId = services.map(service => ({
        ...service,
        vendor_id: vendorId
      }));
      
      // Upsert services
      const { error } = await supabase
        .from('vendor_services')
        .upsert(servicesWithVendorId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating vendor services:', error);
      return false;
    }
  }

  /**
   * Get vendor bookings
   * 
   * @param vendorId Vendor ID
   * @param status Optional booking status filter
   * @returns Promise with array of bookings
   */
  static async getVendorBookings(
    vendorId: string,
    status?: VendorBooking['status']
  ): Promise<VendorBooking[]> {
    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .eq('vendor_id', vendorId);
        
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('event_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching vendor bookings:', error);
      return [];
    }
  }

  /**
   * Update booking status
   * 
   * @param bookingId Booking ID
   * @param status New booking status
   * @returns Promise with success status
   */
  static async updateBookingStatus(
    bookingId: string,
    status: VendorBooking['status']
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  }

  /**
   * Get vendor analytics
   * 
   * @param vendorId Vendor ID
   * @param startDate Optional start date for analytics period
   * @param endDate Optional end date for analytics period
   * @returns Promise with vendor analytics data
   */
  static async getVendorAnalytics(
    vendorId: string,
    startDate?: string,
    endDate?: string
  ): Promise<VendorAnalytics | null> {
    try {
      // This would be a complex query in a real implementation
      // For now, we'll return mock data
      
      // In a real implementation, this would:
      // 1. Query profile views from analytics table
      // 2. Calculate booking conversion rate
      // 3. Get average rating from reviews
      // 4. Calculate total bookings and revenue
      // 5. Identify popular services
      // 6. Aggregate monthly stats
      
      const mockAnalytics: VendorAnalytics = {
        profile_views: 342,
        contact_clicks: 58,
        booking_conversion_rate: 15.2,
        average_rating: 4.7,
        total_bookings: 24,
        total_revenue: 450000,
        popular_services: [
          {
            service_id: 'service-1',
            service_name: 'Premium Photography Package',
            booking_count: 12
          },
          {
            service_id: 'service-2',
            service_name: 'Standard Photography Package',
            booking_count: 8
          }
        ],
        monthly_stats: [
          {
            month: '2025-01',
            bookings: 3,
            revenue: 75000,
            views: 120
          },
          {
            month: '2025-02',
            bookings: 5,
            revenue: 125000,
            views: 180
          }
        ]
      };
      
      return mockAnalytics;
    } catch (error) {
      console.error('Error fetching vendor analytics:', error);
      return null;
    }
  }

  /**
   * Get vendor subscription
   * 
   * @param vendorId Vendor ID
   * @returns Promise with vendor subscription data
   */
  static async getVendorSubscription(vendorId: string): Promise<VendorSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching vendor subscription:', error);
      return null;
    }
  }

  /**
   * Update vendor subscription
   * 
   * @param subscriptionData Subscription data to update
   * @returns Promise with success status
   */
  static async updateSubscription(subscriptionData: Partial<VendorSubscription>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating vendor subscription:', error);
      return false;
    }
  }
}

export default VendorService;
