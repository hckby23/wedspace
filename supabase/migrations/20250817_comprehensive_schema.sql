-- WedSpace Comprehensive Database Schema
-- Extends existing schema with full MVP requirements

-- User roles enum
CREATE TYPE user_role AS ENUM ('user', 'vendor', 'venue_owner', 'admin');

-- Listing status enum
CREATE TYPE listing_status AS ENUM ('draft', 'active', 'inactive', 'suspended');

-- Negotiation status enum
CREATE TYPE negotiation_status AS ENUM ('pending', 'countered', 'accepted', 'rejected', 'expired');

-- Booking status enum
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'paid', 'completed', 'cancelled');

-- Payment status enum
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');

-- Visit status enum
CREATE TYPE visit_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled');

-- Notification type enum
CREATE TYPE notification_type AS ENUM ('negotiation', 'booking', 'payment', 'visit', 'system', 'marketing');

-- Update profiles table with role and additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user',
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS wedding_date DATE,
ADD COLUMN IF NOT EXISTS budget_min DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS budget_max DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS response_time_hours INTEGER DEFAULT 24;

-- Update venues table with comprehensive fields
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS status listing_status DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS venue_type TEXT,
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS response_time_hours INTEGER DEFAULT 24,
ADD COLUMN IF NOT EXISTS cancellation_policy TEXT,
ADD COLUMN IF NOT EXISTS advance_booking_days INTEGER DEFAULT 30;

-- Update vendors table with comprehensive fields
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS status listing_status DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS response_time_hours INTEGER DEFAULT 24,
ADD COLUMN IF NOT EXISTS portfolio_images TEXT[],
ADD COLUMN IF NOT EXISTS services_offered TEXT[],
ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;

-- Create listings table (unified view of venues and vendors)
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('venue', 'vendor')),
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(12,2),
  price_currency TEXT DEFAULT 'INR',
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  status listing_status DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT listings_type_check CHECK (
    (listing_type = 'venue' AND venue_id IS NOT NULL AND vendor_id IS NULL) OR
    (listing_type = 'vendor' AND vendor_id IS NOT NULL AND venue_id IS NULL)
  )
);

-- Create media table
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  caption TEXT,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create inspiration_posts table
CREATE TABLE IF NOT EXISTS public.inspiration_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  tags TEXT[],
  category TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create reels table
CREATE TABLE IF NOT EXISTS public.reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[],
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create moodboards table
CREATE TABLE IF NOT EXISTS public.moodboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create moodboard_items table
CREATE TABLE IF NOT EXISTS public.moodboard_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moodboard_id UUID REFERENCES public.moodboards(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('listing', 'inspiration', 'reel', 'media')),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  inspiration_id UUID REFERENCES public.inspiration_posts(id) ON DELETE CASCADE,
  reel_id UUID REFERENCES public.reels(id) ON DELETE CASCADE,
  media_id UUID REFERENCES public.media(id) ON DELETE CASCADE,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  images TEXT[],
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(listing_id, user_id, booking_id)
);

-- Create scorecards table
CREATE TABLE IF NOT EXISTS public.scorecards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE UNIQUE,
  overall_rating DECIMAL(2,1) DEFAULT 0,
  quality_rating DECIMAL(2,1) DEFAULT 0,
  service_rating DECIMAL(2,1) DEFAULT 0,
  value_rating DECIMAL(2,1) DEFAULT 0,
  communication_rating DECIMAL(2,1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  verified_reviews INTEGER DEFAULT 0,
  response_rate DECIMAL(3,1) DEFAULT 0,
  avg_response_time_hours INTEGER DEFAULT 24,
  booking_success_rate DECIMAL(3,1) DEFAULT 0,
  repeat_customer_rate DECIMAL(3,1) DEFAULT 0,
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Update availability table
ALTER TABLE public.availability 
ADD COLUMN IF NOT EXISTS listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS price_override DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create negotiations table
CREATE TABLE IF NOT EXISTS public.negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  guest_count INTEGER,
  initial_price DECIMAL(12,2) NOT NULL,
  current_price DECIMAL(12,2) NOT NULL,
  final_price DECIMAL(12,2),
  status negotiation_status DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE,
  history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Update bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS negotiation_id UUID REFERENCES public.negotiations(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS final_price DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS advance_amount DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS balance_amount DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS booking_status booking_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS contract_url TEXT,
ADD COLUMN IF NOT EXISTS special_requests TEXT;

-- Create visits table
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status visit_status DEFAULT 'scheduled',
  notes TEXT,
  owner_notes TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status payment_status DEFAULT 'pending',
  payment_method TEXT,
  receipt_url TEXT,
  refund_amount DECIMAL(12,2) DEFAULT 0,
  refund_reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  collection_name TEXT DEFAULT 'default',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, listing_id, collection_name)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  push_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create admin_audit table
CREATE TABLE IF NOT EXISTS public.admin_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  reason TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create events table for analytics
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create comprehensive indexes
CREATE INDEX IF NOT EXISTS listings_owner_id_idx ON public.listings (owner_id);
CREATE INDEX IF NOT EXISTS listings_type_status_idx ON public.listings (listing_type, status);
CREATE INDEX IF NOT EXISTS listings_city_verified_idx ON public.listings (city, verified);
CREATE INDEX IF NOT EXISTS listings_featured_rating_idx ON public.listings (featured DESC, rating DESC);
CREATE INDEX IF NOT EXISTS media_listing_id_idx ON public.media (listing_id);
CREATE INDEX IF NOT EXISTS media_type_primary_idx ON public.media (type, is_primary);
CREATE INDEX IF NOT EXISTS reviews_listing_verified_idx ON public.reviews (listing_id, is_verified);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON public.reviews (user_id);
CREATE INDEX IF NOT EXISTS negotiations_listing_user_idx ON public.negotiations (listing_id, user_id);
CREATE INDEX IF NOT EXISTS negotiations_status_expires_idx ON public.negotiations (status, expires_at);
CREATE INDEX IF NOT EXISTS bookings_user_status_idx ON public.bookings (user_id, booking_status);
CREATE INDEX IF NOT EXISTS bookings_listing_date_idx ON public.bookings (listing_id, event_date);
CREATE INDEX IF NOT EXISTS visits_listing_date_idx ON public.visits (listing_id, scheduled_date);
CREATE INDEX IF NOT EXISTS visits_user_status_idx ON public.visits (user_id, status);
CREATE INDEX IF NOT EXISTS payments_booking_status_idx ON public.payments (booking_id, status);
CREATE INDEX IF NOT EXISTS payments_razorpay_order_idx ON public.payments (razorpay_order_id);
CREATE INDEX IF NOT EXISTS favorites_user_collection_idx ON public.favorites (user_id, collection_name);
CREATE INDEX IF NOT EXISTS notifications_user_read_idx ON public.notifications (user_id, read);
CREATE INDEX IF NOT EXISTS notifications_type_created_idx ON public.notifications (type, created_at);
CREATE INDEX IF NOT EXISTS events_user_type_idx ON public.events (user_id, event_type);
CREATE INDEX IF NOT EXISTS events_listing_type_idx ON public.events (listing_id, event_type);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON public.events (created_at);

-- Enable RLS on all new tables
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspiration_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moodboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moodboard_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
