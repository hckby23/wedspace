-- WedSpace Escrow Payment System
-- Comprehensive escrow management for secure transactions between couples and vendors/venues

-- Escrow status enum
CREATE TYPE escrow_status AS ENUM (
  'pending',           -- Escrow created, awaiting payment
  'funded',            -- Payment received, held in escrow
  'partial_released',  -- Partial amount released
  'released',          -- Full amount released to vendor
  'refunded',          -- Refunded to customer
  'disputed',          -- Under dispute resolution
  'cancelled'          -- Escrow cancelled
);

-- Escrow transaction type enum
CREATE TYPE escrow_transaction_type AS ENUM (
  'deposit',           -- Initial deposit/advance
  'release',           -- Release to vendor
  'refund',            -- Refund to customer
  'commission',        -- Platform commission deduction
  'adjustment'         -- Manual adjustment
);

-- Dispute status enum
CREATE TYPE dispute_status AS ENUM (
  'open',
  'under_review',
  'resolved',
  'closed'
);

-- Main escrow accounts table
CREATE TABLE IF NOT EXISTS public.escrow_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  vendor_id UUID REFERENCES auth.users(id),
  
  -- Financial details
  total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount > 0),
  advance_amount DECIMAL(12,2) NOT NULL CHECK (advance_amount > 0),
  balance_amount DECIMAL(12,2) NOT NULL CHECK (balance_amount >= 0),
  released_amount DECIMAL(12,2) DEFAULT 0 CHECK (released_amount >= 0),
  refunded_amount DECIMAL(12,2) DEFAULT 0 CHECK (refunded_amount >= 0),
  commission_amount DECIMAL(12,2) DEFAULT 0 CHECK (commission_amount >= 0),
  commission_percentage DECIMAL(5,2) DEFAULT 10.00,
  
  -- Status and tracking
  status escrow_status DEFAULT 'pending' NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  
  -- Payment gateway details
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_transfer_id TEXT,
  
  -- Release conditions
  auto_release_date TIMESTAMP WITH TIME ZONE,
  manual_release_required BOOLEAN DEFAULT false,
  release_approved_by UUID REFERENCES auth.users(id),
  release_approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  funded_at TIMESTAMP WITH TIME ZONE,
  released_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT escrow_amounts_valid CHECK (
    released_amount + refunded_amount <= total_amount
  ),
  CONSTRAINT advance_not_exceeds_total CHECK (
    advance_amount <= total_amount
  )
);

-- Escrow transactions ledger
CREATE TABLE IF NOT EXISTS public.escrow_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_account_id UUID NOT NULL REFERENCES public.escrow_accounts(id) ON DELETE CASCADE,
  
  -- Transaction details
  transaction_type escrow_transaction_type NOT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'INR' NOT NULL,
  
  -- Parties involved
  from_user_id UUID REFERENCES auth.users(id),
  to_user_id UUID REFERENCES auth.users(id),
  
  -- Payment gateway details
  razorpay_payment_id TEXT,
  razorpay_transfer_id TEXT,
  razorpay_refund_id TEXT,
  gateway_response JSONB,
  
  -- Status
  status TEXT DEFAULT 'pending' NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT,
  
  -- Metadata
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Audit
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Escrow release schedules (for milestone-based releases)
CREATE TABLE IF NOT EXISTS public.escrow_release_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_account_id UUID NOT NULL REFERENCES public.escrow_accounts(id) ON DELETE CASCADE,
  
  -- Milestone details
  milestone_name TEXT NOT NULL,
  milestone_description TEXT,
  milestone_order INTEGER NOT NULL,
  
  -- Release amount
  release_amount DECIMAL(12,2) NOT NULL CHECK (release_amount > 0),
  release_percentage DECIMAL(5,2),
  
  -- Conditions
  condition_type TEXT, -- 'date', 'manual_approval', 'auto', 'event_completion'
  condition_date TIMESTAMP WITH TIME ZONE,
  condition_met BOOLEAN DEFAULT false,
  
  -- Status
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, approved, released, cancelled
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  released_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  UNIQUE(escrow_account_id, milestone_order)
);

-- Dispute management
CREATE TABLE IF NOT EXISTS public.escrow_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_account_id UUID NOT NULL REFERENCES public.escrow_accounts(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id),
  
  -- Dispute details
  raised_by UUID NOT NULL REFERENCES auth.users(id),
  dispute_type TEXT NOT NULL, -- 'service_not_delivered', 'quality_issue', 'cancellation', 'other'
  dispute_reason TEXT NOT NULL,
  dispute_amount DECIMAL(12,2),
  
  -- Evidence
  evidence_documents TEXT[],
  evidence_description TEXT,
  
  -- Status
  status dispute_status DEFAULT 'open' NOT NULL,
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  
  -- Resolution
  assigned_to UUID REFERENCES auth.users(id), -- admin handling the dispute
  resolution_notes TEXT,
  resolution_action TEXT, -- 'full_refund', 'partial_refund', 'release_to_vendor', 'split'
  resolution_amount DECIMAL(12,2),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  
  -- Communication
  last_response_at TIMESTAMP WITH TIME ZONE,
  response_count INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Dispute messages/communication
CREATE TABLE IF NOT EXISTS public.escrow_dispute_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES public.escrow_disputes(id) ON DELETE CASCADE,
  
  -- Message details
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  message TEXT NOT NULL,
  attachments TEXT[],
  
  -- Visibility
  is_internal BOOLEAN DEFAULT false, -- internal admin notes
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_escrow_accounts_booking ON public.escrow_accounts(booking_id);
CREATE INDEX idx_escrow_accounts_user ON public.escrow_accounts(user_id);
CREATE INDEX idx_escrow_accounts_vendor ON public.escrow_accounts(vendor_id);
CREATE INDEX idx_escrow_accounts_status ON public.escrow_accounts(status);
CREATE INDEX idx_escrow_accounts_created ON public.escrow_accounts(created_at DESC);

CREATE INDEX idx_escrow_transactions_account ON public.escrow_transactions(escrow_account_id);
CREATE INDEX idx_escrow_transactions_type ON public.escrow_transactions(transaction_type);
CREATE INDEX idx_escrow_transactions_created ON public.escrow_transactions(created_at DESC);

CREATE INDEX idx_escrow_schedules_account ON public.escrow_release_schedules(escrow_account_id);
CREATE INDEX idx_escrow_schedules_status ON public.escrow_release_schedules(status);

CREATE INDEX idx_escrow_disputes_account ON public.escrow_disputes(escrow_account_id);
CREATE INDEX idx_escrow_disputes_status ON public.escrow_disputes(status);
CREATE INDEX idx_escrow_disputes_raised_by ON public.escrow_disputes(raised_by);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_escrow_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER escrow_accounts_updated_at
  BEFORE UPDATE ON public.escrow_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_escrow_updated_at();

CREATE TRIGGER escrow_transactions_updated_at
  BEFORE UPDATE ON public.escrow_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_escrow_updated_at();

CREATE TRIGGER escrow_schedules_updated_at
  BEFORE UPDATE ON public.escrow_release_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_escrow_updated_at();

CREATE TRIGGER escrow_disputes_updated_at
  BEFORE UPDATE ON public.escrow_disputes
  FOR EACH ROW
  EXECUTE FUNCTION update_escrow_updated_at();

-- Function to create escrow account for booking
CREATE OR REPLACE FUNCTION create_escrow_for_booking(
  p_booking_id UUID,
  p_user_id UUID,
  p_vendor_id UUID,
  p_total_amount DECIMAL,
  p_advance_percentage DECIMAL DEFAULT 30.00
)
RETURNS UUID AS $$
DECLARE
  v_escrow_id UUID;
  v_advance_amount DECIMAL;
  v_balance_amount DECIMAL;
BEGIN
  -- Calculate amounts
  v_advance_amount := p_total_amount * (p_advance_percentage / 100);
  v_balance_amount := p_total_amount - v_advance_amount;
  
  -- Create escrow account
  INSERT INTO public.escrow_accounts (
    booking_id,
    user_id,
    vendor_id,
    total_amount,
    advance_amount,
    balance_amount,
    status
  ) VALUES (
    p_booking_id,
    p_user_id,
    p_vendor_id,
    p_total_amount,
    v_advance_amount,
    v_balance_amount,
    'pending'
  )
  RETURNING id INTO v_escrow_id;
  
  RETURN v_escrow_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to release escrow funds
CREATE OR REPLACE FUNCTION release_escrow_funds(
  p_escrow_id UUID,
  p_amount DECIMAL,
  p_released_by UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_escrow RECORD;
  v_available_amount DECIMAL;
BEGIN
  -- Get escrow details
  SELECT * INTO v_escrow
  FROM public.escrow_accounts
  WHERE id = p_escrow_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Escrow account not found';
  END IF;
  
  -- Check if escrow is funded
  IF v_escrow.status != 'funded' THEN
    RAISE EXCEPTION 'Escrow must be in funded status to release';
  END IF;
  
  -- Calculate available amount
  v_available_amount := v_escrow.total_amount - v_escrow.released_amount - v_escrow.refunded_amount;
  
  IF p_amount > v_available_amount THEN
    RAISE EXCEPTION 'Insufficient funds in escrow';
  END IF;
  
  -- Update escrow account
  UPDATE public.escrow_accounts
  SET 
    released_amount = released_amount + p_amount,
    status = CASE 
      WHEN (released_amount + p_amount) >= total_amount THEN 'released'::escrow_status
      ELSE 'partial_released'::escrow_status
    END,
    release_approved_by = p_released_by,
    release_approved_at = now(),
    released_at = CASE 
      WHEN (released_amount + p_amount) >= total_amount THEN now()
      ELSE released_at
    END,
    notes = COALESCE(notes || E'\n', '') || COALESCE(p_notes, '')
  WHERE id = p_escrow_id;
  
  -- Create transaction record
  INSERT INTO public.escrow_transactions (
    escrow_account_id,
    transaction_type,
    amount,
    from_user_id,
    to_user_id,
    status,
    description,
    created_by,
    processed_at
  ) VALUES (
    p_escrow_id,
    'release',
    p_amount,
    v_escrow.user_id,
    v_escrow.vendor_id,
    'completed',
    'Funds released to vendor',
    p_released_by,
    now()
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to refund escrow funds
CREATE OR REPLACE FUNCTION refund_escrow_funds(
  p_escrow_id UUID,
  p_amount DECIMAL,
  p_refunded_by UUID,
  p_reason TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_escrow RECORD;
  v_available_amount DECIMAL;
BEGIN
  -- Get escrow details
  SELECT * INTO v_escrow
  FROM public.escrow_accounts
  WHERE id = p_escrow_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Escrow account not found';
  END IF;
  
  -- Calculate available amount for refund
  v_available_amount := v_escrow.total_amount - v_escrow.released_amount - v_escrow.refunded_amount;
  
  IF p_amount > v_available_amount THEN
    RAISE EXCEPTION 'Insufficient funds available for refund';
  END IF;
  
  -- Update escrow account
  UPDATE public.escrow_accounts
  SET 
    refunded_amount = refunded_amount + p_amount,
    status = CASE 
      WHEN (refunded_amount + p_amount) >= (total_amount - released_amount) THEN 'refunded'::escrow_status
      ELSE status
    END,
    notes = COALESCE(notes || E'\n', '') || 'Refund: ' || p_reason
  WHERE id = p_escrow_id;
  
  -- Create transaction record
  INSERT INTO public.escrow_transactions (
    escrow_account_id,
    transaction_type,
    amount,
    from_user_id,
    to_user_id,
    status,
    description,
    created_by,
    processed_at
  ) VALUES (
    p_escrow_id,
    'refund',
    p_amount,
    v_escrow.vendor_id,
    v_escrow.user_id,
    'completed',
    p_reason,
    p_refunded_by,
    now()
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE public.escrow_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_release_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_dispute_messages ENABLE ROW LEVEL SECURITY;

-- Escrow accounts policies
CREATE POLICY "Users can view their own escrow accounts"
  ON public.escrow_accounts FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = vendor_id);

CREATE POLICY "Admins can view all escrow accounts"
  ON public.escrow_accounts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Escrow transactions policies
CREATE POLICY "Users can view their escrow transactions"
  ON public.escrow_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.escrow_accounts
      WHERE id = escrow_account_id
      AND (user_id = auth.uid() OR vendor_id = auth.uid())
    )
  );

-- Disputes policies
CREATE POLICY "Users can view disputes they're involved in"
  ON public.escrow_disputes FOR SELECT
  USING (
    raised_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.escrow_accounts
      WHERE id = escrow_account_id
      AND (user_id = auth.uid() OR vendor_id = auth.uid())
    )
  );

CREATE POLICY "Users can create disputes for their escrows"
  ON public.escrow_disputes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.escrow_accounts
      WHERE id = escrow_account_id
      AND (user_id = auth.uid() OR vendor_id = auth.uid())
    )
  );

-- Comments
COMMENT ON TABLE public.escrow_accounts IS 'Main escrow accounts holding funds for bookings';
COMMENT ON TABLE public.escrow_transactions IS 'Ledger of all escrow transactions';
COMMENT ON TABLE public.escrow_release_schedules IS 'Milestone-based release schedules';
COMMENT ON TABLE public.escrow_disputes IS 'Dispute management for escrow accounts';
COMMENT ON FUNCTION create_escrow_for_booking IS 'Creates an escrow account for a booking with advance payment';
COMMENT ON FUNCTION release_escrow_funds IS 'Releases funds from escrow to vendor';
COMMENT ON FUNCTION refund_escrow_funds IS 'Refunds funds from escrow to customer';
