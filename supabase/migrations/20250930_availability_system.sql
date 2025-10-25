-- Live Availability & Calendar Management System
-- Real-time availability tracking with Google Calendar integration

-- Availability status enum
CREATE TYPE availability_status AS ENUM (
  'available',
  'booked',
  'blocked',
  'tentative',
  'maintenance'
);

-- Time slot status enum
CREATE TYPE time_slot_status AS ENUM (
  'available',
  'booked',
  'blocked',
  'pending'
);

-- Availability calendar table
CREATE TABLE IF NOT EXISTS public.availability_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Owner (venue or vendor)
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Date and time
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_all_day BOOLEAN DEFAULT true,
  
  -- Status
  status availability_status DEFAULT 'available' NOT NULL,
  
  -- Booking reference
  booking_id UUID REFERENCES public.bookings(id),
  
  -- Capacity management
  max_capacity INTEGER,
  current_bookings INTEGER DEFAULT 0,
  
  -- Pricing (can vary by date/season)
  base_price DECIMAL(12,2),
  special_price DECIMAL(12,2),
  price_multiplier DECIMAL(5,2) DEFAULT 1.00,
  
  -- Notes
  notes TEXT,
  blocked_reason TEXT,
  
  -- Google Calendar integration
  google_calendar_event_id TEXT,
  google_calendar_sync_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  UNIQUE(listing_id, date, start_time),
  CONSTRAINT valid_time_range CHECK (end_time > start_time OR is_all_day = true)
);

-- Time slots for detailed scheduling
CREATE TABLE IF NOT EXISTS public.time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  availability_calendar_id UUID REFERENCES public.availability_calendar(id) ON DELETE CASCADE,
  
  -- Time slot details
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  
  -- Status
  status time_slot_status DEFAULT 'available' NOT NULL,
  
  -- Booking
  booking_id UUID REFERENCES public.bookings(id),
  reserved_by UUID REFERENCES auth.users(id),
  reserved_until TIMESTAMP WITH TIME ZONE,
  
  -- Pricing
  price DECIMAL(12,2),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  CONSTRAINT valid_slot_time CHECK (end_time > start_time),
  CONSTRAINT valid_duration CHECK (duration_minutes > 0)
);

-- Blocked dates (holidays, maintenance, etc.)
CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Owner
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Date range
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Reason
  reason TEXT NOT NULL,
  block_type TEXT NOT NULL, -- 'holiday', 'maintenance', 'personal', 'other'
  
  -- Recurrence
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT, -- 'weekly', 'monthly', 'yearly'
  recurrence_end_date DATE,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Calendar sync settings
CREATE TABLE IF NOT EXISTS public.calendar_sync_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  
  -- Google Calendar
  google_calendar_enabled BOOLEAN DEFAULT false,
  google_calendar_id TEXT,
  google_access_token TEXT,
  google_refresh_token TEXT,
  google_token_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Sync settings
  sync_direction TEXT DEFAULT 'both', -- 'import', 'export', 'both'
  auto_sync_enabled BOOLEAN DEFAULT true,
  sync_frequency_minutes INTEGER DEFAULT 15,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_sync_status TEXT,
  
  -- Conflict resolution
  conflict_resolution_strategy TEXT DEFAULT 'manual', -- 'manual', 'calendar_wins', 'platform_wins'
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  UNIQUE(user_id, listing_id)
);

-- Availability rules (recurring patterns)
CREATE TABLE IF NOT EXISTS public.availability_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Owner
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Rule details
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL, -- 'weekly', 'monthly', 'seasonal', 'custom'
  
  -- Weekly pattern
  day_of_week INTEGER, -- 0=Sunday, 6=Saturday
  start_time TIME,
  end_time TIME,
  
  -- Date range
  effective_from DATE,
  effective_until DATE,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Pricing
  price_adjustment DECIMAL(12,2),
  price_multiplier DECIMAL(5,2),
  
  -- Priority (higher priority rules override lower)
  priority INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_availability_calendar_listing ON public.availability_calendar(listing_id);
CREATE INDEX idx_availability_calendar_date ON public.availability_calendar(date);
CREATE INDEX idx_availability_calendar_status ON public.availability_calendar(status);
CREATE INDEX idx_availability_calendar_owner ON public.availability_calendar(owner_id);

CREATE INDEX idx_time_slots_listing ON public.time_slots(listing_id);
CREATE INDEX idx_time_slots_date ON public.time_slots(date);
CREATE INDEX idx_time_slots_status ON public.time_slots(status);

CREATE INDEX idx_blocked_dates_listing ON public.blocked_dates(listing_id);
CREATE INDEX idx_blocked_dates_range ON public.blocked_dates(start_date, end_date);
CREATE INDEX idx_blocked_dates_active ON public.blocked_dates(is_active);

CREATE INDEX idx_calendar_sync_user ON public.calendar_sync_settings(user_id);
CREATE INDEX idx_calendar_sync_listing ON public.calendar_sync_settings(listing_id);

CREATE INDEX idx_availability_rules_listing ON public.availability_rules(listing_id);
CREATE INDEX idx_availability_rules_active ON public.availability_rules(is_active);

-- Triggers
CREATE TRIGGER availability_calendar_updated_at
  BEFORE UPDATE ON public.availability_calendar
  FOR EACH ROW
  EXECUTE FUNCTION update_escrow_updated_at();

CREATE TRIGGER time_slots_updated_at
  BEFORE UPDATE ON public.time_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_escrow_updated_at();

CREATE TRIGGER blocked_dates_updated_at
  BEFORE UPDATE ON public.blocked_dates
  FOR EACH ROW
  EXECUTE FUNCTION update_escrow_updated_at();

-- Function to check availability for a date
CREATE OR REPLACE FUNCTION check_date_availability(
  p_listing_id UUID,
  p_date DATE,
  p_start_time TIME DEFAULT NULL,
  p_end_time TIME DEFAULT NULL
)
RETURNS TABLE (
  is_available BOOLEAN,
  status availability_status,
  reason TEXT,
  available_slots INTEGER
) AS $$
DECLARE
  v_blocked BOOLEAN;
  v_calendar_status availability_status;
  v_booking_count INTEGER;
  v_max_capacity INTEGER;
BEGIN
  -- Check if date is blocked
  SELECT EXISTS (
    SELECT 1 FROM public.blocked_dates
    WHERE listing_id = p_listing_id
    AND p_date BETWEEN start_date AND end_date
    AND is_active = true
  ) INTO v_blocked;
  
  IF v_blocked THEN
    RETURN QUERY SELECT false, 'blocked'::availability_status, 'Date is blocked', 0;
    RETURN;
  END IF;
  
  -- Check availability calendar
  SELECT 
    ac.status,
    ac.max_capacity,
    ac.current_bookings
  INTO v_calendar_status, v_max_capacity, v_booking_count
  FROM public.availability_calendar ac
  WHERE ac.listing_id = p_listing_id
  AND ac.date = p_date
  AND (p_start_time IS NULL OR ac.start_time <= p_start_time)
  AND (p_end_time IS NULL OR ac.end_time >= p_end_time);
  
  IF v_calendar_status IS NULL THEN
    -- No calendar entry, assume available
    RETURN QUERY SELECT true, 'available'::availability_status, 'No restrictions', NULL::INTEGER;
    RETURN;
  END IF;
  
  IF v_calendar_status = 'available' THEN
    IF v_max_capacity IS NOT NULL THEN
      IF v_booking_count < v_max_capacity THEN
        RETURN QUERY SELECT true, v_calendar_status, 'Available', (v_max_capacity - v_booking_count);
      ELSE
        RETURN QUERY SELECT false, 'booked'::availability_status, 'Fully booked', 0;
      END IF;
    ELSE
      RETURN QUERY SELECT true, v_calendar_status, 'Available', NULL::INTEGER;
    END IF;
  ELSE
    RETURN QUERY SELECT false, v_calendar_status, 'Not available', 0;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get available dates in a range
CREATE OR REPLACE FUNCTION get_available_dates(
  p_listing_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  date DATE,
  status availability_status,
  price DECIMAL,
  available_slots INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(p_start_date, p_end_date, '1 day'::interval)::DATE as check_date
  ),
  blocked AS (
    SELECT DISTINCT bd.start_date, bd.end_date
    FROM public.blocked_dates bd
    WHERE bd.listing_id = p_listing_id
    AND bd.is_active = true
    AND bd.start_date <= p_end_date
    AND bd.end_date >= p_start_date
  )
  SELECT 
    ds.check_date,
    COALESCE(ac.status, 'available'::availability_status) as status,
    COALESCE(ac.special_price, ac.base_price) as price,
    CASE 
      WHEN ac.max_capacity IS NOT NULL THEN ac.max_capacity - ac.current_bookings
      ELSE NULL
    END as available_slots
  FROM date_series ds
  LEFT JOIN public.availability_calendar ac 
    ON ac.listing_id = p_listing_id 
    AND ac.date = ds.check_date
  LEFT JOIN blocked b 
    ON ds.check_date BETWEEN b.start_date AND b.end_date
  WHERE b.start_date IS NULL -- Not blocked
  ORDER BY ds.check_date;
END;
$$ LANGUAGE plpgsql;

-- Function to block dates
CREATE OR REPLACE FUNCTION block_dates(
  p_listing_id UUID,
  p_owner_id UUID,
  p_start_date DATE,
  p_end_date DATE,
  p_reason TEXT,
  p_block_type TEXT DEFAULT 'other'
)
RETURNS UUID AS $$
DECLARE
  v_blocked_id UUID;
BEGIN
  -- Insert blocked date
  INSERT INTO public.blocked_dates (
    listing_id,
    owner_id,
    start_date,
    end_date,
    reason,
    block_type,
    is_active
  ) VALUES (
    p_listing_id,
    p_owner_id,
    p_start_date,
    p_end_date,
    p_reason,
    p_block_type,
    true
  )
  RETURNING id INTO v_blocked_id;
  
  -- Update availability calendar
  UPDATE public.availability_calendar
  SET 
    status = 'blocked',
    blocked_reason = p_reason
  WHERE listing_id = p_listing_id
  AND date BETWEEN p_start_date AND p_end_date;
  
  RETURN v_blocked_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reserve time slot
CREATE OR REPLACE FUNCTION reserve_time_slot(
  p_slot_id UUID,
  p_user_id UUID,
  p_reservation_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN AS $$
DECLARE
  v_slot RECORD;
BEGIN
  -- Get slot details
  SELECT * INTO v_slot
  FROM public.time_slots
  WHERE id = p_slot_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Time slot not found';
  END IF;
  
  IF v_slot.status != 'available' THEN
    RAISE EXCEPTION 'Time slot not available';
  END IF;
  
  -- Reserve the slot
  UPDATE public.time_slots
  SET 
    status = 'pending',
    reserved_by = p_user_id,
    reserved_until = now() + (p_reservation_minutes || ' minutes')::interval
  WHERE id = p_slot_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE public.availability_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_sync_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;

-- Availability calendar policies
CREATE POLICY "Anyone can view availability"
  ON public.availability_calendar FOR SELECT
  USING (true);

CREATE POLICY "Owners can manage their availability"
  ON public.availability_calendar FOR ALL
  USING (auth.uid() = owner_id);

-- Time slots policies
CREATE POLICY "Anyone can view available time slots"
  ON public.time_slots FOR SELECT
  USING (true);

CREATE POLICY "Users can reserve time slots"
  ON public.time_slots FOR UPDATE
  USING (status = 'available');

-- Blocked dates policies
CREATE POLICY "Anyone can view blocked dates"
  ON public.blocked_dates FOR SELECT
  USING (true);

CREATE POLICY "Owners can manage blocked dates"
  ON public.blocked_dates FOR ALL
  USING (auth.uid() = owner_id);

-- Calendar sync policies
CREATE POLICY "Users can manage their calendar sync"
  ON public.calendar_sync_settings FOR ALL
  USING (auth.uid() = user_id);

-- Availability rules policies
CREATE POLICY "Anyone can view availability rules"
  ON public.availability_rules FOR SELECT
  USING (true);

CREATE POLICY "Owners can manage their rules"
  ON public.availability_rules FOR ALL
  USING (auth.uid() = owner_id);

-- Comments
COMMENT ON TABLE public.availability_calendar IS 'Real-time availability tracking for venues and vendors';
COMMENT ON TABLE public.time_slots IS 'Detailed time slot management for bookings';
COMMENT ON TABLE public.blocked_dates IS 'Blocked dates for holidays, maintenance, etc.';
COMMENT ON TABLE public.calendar_sync_settings IS 'Google Calendar integration settings';
COMMENT ON FUNCTION check_date_availability IS 'Check if a date is available for booking';
COMMENT ON FUNCTION get_available_dates IS 'Get all available dates in a date range';
COMMENT ON FUNCTION block_dates IS 'Block dates for a listing';
COMMENT ON FUNCTION reserve_time_slot IS 'Temporarily reserve a time slot for booking';
