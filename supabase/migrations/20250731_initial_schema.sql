-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  wedding_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create users table with premium flag
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create venues table
CREATE TABLE IF NOT EXISTS public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  capacity_min INTEGER,
  capacity_max INTEGER,
  price_per_plate DECIMAL(10, 2),
  base_price DECIMAL(12, 2),
  images TEXT[],
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- photographer, caterer, decorator, etc.
  description TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  price_range TEXT, -- Budget, Mid-range, Premium, Luxury
  rating DECIMAL(2, 1),
  images TEXT[],
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create bookings table (for commission model)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  event_date DATE NOT NULL,
  guest_count INTEGER,
  total_amount DECIMAL(12, 2) NOT NULL,
  commission_amount DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  payment_status TEXT NOT NULL DEFAULT 'unpaid', -- unpaid, partial, paid
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create subscriptions table (for vendor subscriptions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL, -- basic, premium, enterprise
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create availability table (for dynamic pricing)
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  remaining_slots INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(venue_id, date)
);

-- Create price_slots table (for dynamic pricing)
CREATE TABLE IF NOT EXISTS public.price_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  price_multiplier DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
  reason TEXT, -- weekend, holiday, peak season, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(venue_id, date)
);

-- Create last_minute_deals table (for urgency mechanics)
CREATE TABLE IF NOT EXISTS public.last_minute_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  discount_percentage INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.last_minute_deals ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (to be refined based on specific requirements)
CREATE POLICY "Allow public read access to venues" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Allow public read access to vendors" ON public.vendors FOR SELECT USING (true);
CREATE POLICY "Allow users to view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS venues_city_idx ON public.venues (city);
CREATE INDEX IF NOT EXISTS vendors_category_idx ON public.vendors (category);
CREATE INDEX IF NOT EXISTS vendors_city_idx ON public.vendors (city);
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON public.bookings (user_id);
CREATE INDEX IF NOT EXISTS bookings_venue_id_idx ON public.bookings (venue_id);
CREATE INDEX IF NOT EXISTS bookings_vendor_id_idx ON public.bookings (vendor_id);
CREATE INDEX IF NOT EXISTS availability_venue_id_date_idx ON public.availability (venue_id, date);
CREATE INDEX IF NOT EXISTS price_slots_venue_id_date_idx ON public.price_slots (venue_id, date);

-- Create functions for search
CREATE OR REPLACE FUNCTION public.search_venues(
  search_query TEXT,
  city_filter TEXT DEFAULT NULL,
  min_capacity INTEGER DEFAULT NULL,
  max_price DECIMAL DEFAULT NULL,
  date_filter DATE DEFAULT NULL
) RETURNS SETOF public.venues AS $$
BEGIN
  RETURN QUERY
  SELECT v.*
  FROM public.venues v
  WHERE 
    (search_query IS NULL OR v.name ILIKE '%' || search_query || '%' OR v.description ILIKE '%' || search_query || '%')
    AND (city_filter IS NULL OR v.city ILIKE city_filter)
    AND (min_capacity IS NULL OR v.capacity_max >= min_capacity)
    AND (max_price IS NULL OR v.price_per_plate <= max_price)
    AND (date_filter IS NULL OR 
         EXISTS (
           SELECT 1 FROM public.availability a 
           WHERE a.venue_id = v.id AND a.date = date_filter AND a.is_available = true
         )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
