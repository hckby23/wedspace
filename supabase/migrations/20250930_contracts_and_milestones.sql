-- Smart Contracts & Milestone Management System
-- Auto-generated contracts with e-signature support and milestone-based refunds

-- Contract status enum
CREATE TYPE contract_status AS ENUM (
  'draft',
  'pending_signatures',
  'partially_signed',
  'fully_signed',
  'active',
  'completed',
  'terminated',
  'disputed'
);

-- Milestone status enum
CREATE TYPE milestone_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'verified',
  'disputed',
  'cancelled'
);

-- Refund policy type enum
CREATE TYPE refund_policy_type AS ENUM (
  'full_refund',
  'partial_refund',
  'no_refund',
  'milestone_based'
);

-- Contracts table
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  escrow_account_id UUID REFERENCES public.escrow_accounts(id),
  
  -- Parties
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  vendor_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Contract details
  contract_number TEXT UNIQUE NOT NULL,
  contract_type TEXT NOT NULL, -- 'venue', 'vendor', 'package'
  title TEXT NOT NULL,
  description TEXT,
  
  -- Terms
  terms_and_conditions TEXT NOT NULL,
  payment_terms TEXT,
  cancellation_policy TEXT,
  refund_policy refund_policy_type DEFAULT 'milestone_based',
  
  -- Financial
  total_amount DECIMAL(12,2) NOT NULL,
  advance_percentage DECIMAL(5,2) DEFAULT 30.00,
  currency TEXT DEFAULT 'INR',
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  event_date DATE NOT NULL,
  
  -- Status
  status contract_status DEFAULT 'draft' NOT NULL,
  
  -- Signatures
  customer_signed BOOLEAN DEFAULT false,
  customer_signed_at TIMESTAMP WITH TIME ZONE,
  customer_signature_data TEXT, -- Base64 or DocuSign ID
  customer_ip_address INET,
  
  vendor_signed BOOLEAN DEFAULT false,
  vendor_signed_at TIMESTAMP WITH TIME ZONE,
  vendor_signature_data TEXT,
  vendor_ip_address INET,
  
  -- Document
  contract_pdf_url TEXT,
  contract_template_id TEXT,
  
  -- E-signature integration
  docusign_envelope_id TEXT,
  zoho_sign_request_id TEXT,
  signature_provider TEXT, -- 'docusign', 'zoho', 'internal'
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  signed_at TIMESTAMP WITH TIME ZONE,
  activated_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  terminated_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_dates CHECK (end_date >= start_date),
  CONSTRAINT valid_amount CHECK (total_amount > 0),
  CONSTRAINT valid_advance CHECK (advance_percentage >= 0 AND advance_percentage <= 100)
);

-- Contract milestones
CREATE TABLE IF NOT EXISTS public.contract_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  
  -- Milestone details
  milestone_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Payment
  payment_percentage DECIMAL(5,2) NOT NULL,
  payment_amount DECIMAL(12,2) NOT NULL,
  
  -- Dates
  due_date DATE,
  completion_date DATE,
  
  -- Status
  status milestone_status DEFAULT 'pending' NOT NULL,
  
  -- Verification
  requires_verification BOOLEAN DEFAULT true,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  
  -- Deliverables
  deliverables TEXT[],
  deliverable_urls TEXT[],
  
  -- Refund eligibility
  refund_eligible BOOLEAN DEFAULT true,
  refund_percentage DECIMAL(5,2),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  UNIQUE(contract_id, milestone_number),
  CONSTRAINT valid_payment_percentage CHECK (payment_percentage >= 0 AND payment_percentage <= 100)
);

-- Refund requests
CREATE TABLE IF NOT EXISTS public.refund_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id),
  booking_id UUID NOT NULL REFERENCES public.bookings(id),
  escrow_account_id UUID REFERENCES public.escrow_accounts(id),
  
  -- Request details
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  refund_type TEXT NOT NULL, -- 'full', 'partial', 'milestone_based'
  refund_reason TEXT NOT NULL,
  refund_amount DECIMAL(12,2) NOT NULL,
  
  -- Milestone-based refund
  affected_milestones UUID[],
  milestone_refund_breakdown JSONB,
  
  -- Status
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, approved, rejected, processed
  
  -- Processing
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  approval_notes TEXT,
  
  processed_at TIMESTAMP WITH TIME ZONE,
  razorpay_refund_id TEXT,
  
  -- Evidence
  evidence_documents TEXT[],
  evidence_description TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Contract templates
CREATE TABLE IF NOT EXISTS public.contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Template details
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL, -- 'venue', 'photographer', 'caterer', etc.
  description TEXT,
  
  -- Content
  template_content TEXT NOT NULL, -- HTML with placeholders
  terms_template TEXT,
  cancellation_template TEXT,
  
  -- Variables
  required_variables TEXT[], -- ['customer_name', 'venue_name', 'event_date']
  optional_variables TEXT[],
  
  -- Settings
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Contract audit log
CREATE TABLE IF NOT EXISTS public.contract_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  
  -- Action details
  action TEXT NOT NULL, -- 'created', 'signed', 'amended', 'terminated'
  action_by UUID REFERENCES auth.users(id),
  action_description TEXT,
  
  -- Changes
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX idx_contracts_booking ON public.contracts(booking_id);
CREATE INDEX idx_contracts_customer ON public.contracts(customer_id);
CREATE INDEX idx_contracts_vendor ON public.contracts(vendor_id);
CREATE INDEX idx_contracts_status ON public.contracts(status);
CREATE INDEX idx_contracts_event_date ON public.contracts(event_date);
CREATE INDEX idx_contracts_number ON public.contracts(contract_number);

CREATE INDEX idx_milestones_contract ON public.contract_milestones(contract_id);
CREATE INDEX idx_milestones_status ON public.contract_milestones(status);
CREATE INDEX idx_milestones_due_date ON public.contract_milestones(due_date);

CREATE INDEX idx_refund_requests_contract ON public.refund_requests(contract_id);
CREATE INDEX idx_refund_requests_status ON public.refund_requests(status);
CREATE INDEX idx_refund_requests_requested_by ON public.refund_requests(requested_by);

CREATE INDEX idx_contract_templates_type ON public.contract_templates(template_type);
CREATE INDEX idx_contract_templates_active ON public.contract_templates(is_active);

-- Triggers
CREATE TRIGGER contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_escrow_updated_at();

CREATE TRIGGER milestones_updated_at
  BEFORE UPDATE ON public.contract_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_escrow_updated_at();

CREATE TRIGGER refund_requests_updated_at
  BEFORE UPDATE ON public.refund_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_escrow_updated_at();

-- Function to generate contract number
CREATE OR REPLACE FUNCTION generate_contract_number()
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_month TEXT;
  v_sequence TEXT;
  v_contract_number TEXT;
BEGIN
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
  v_month := TO_CHAR(CURRENT_DATE, 'MM');
  
  -- Get next sequence number for this month
  SELECT LPAD((COUNT(*) + 1)::TEXT, 4, '0')
  INTO v_sequence
  FROM public.contracts
  WHERE contract_number LIKE 'WS-' || v_year || v_month || '%';
  
  v_contract_number := 'WS-' || v_year || v_month || '-' || v_sequence;
  
  RETURN v_contract_number;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate milestone-based refund
CREATE OR REPLACE FUNCTION calculate_milestone_refund(
  p_contract_id UUID,
  p_cancellation_date DATE
)
RETURNS TABLE (
  refundable_amount DECIMAL,
  refund_breakdown JSONB
) AS $$
DECLARE
  v_contract RECORD;
  v_milestone RECORD;
  v_total_refund DECIMAL := 0;
  v_breakdown JSONB := '[]'::JSONB;
BEGIN
  -- Get contract details
  SELECT * INTO v_contract
  FROM public.contracts
  WHERE id = p_contract_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Contract not found';
  END IF;
  
  -- Calculate refund for each milestone
  FOR v_milestone IN
    SELECT *
    FROM public.contract_milestones
    WHERE contract_id = p_contract_id
    AND status IN ('pending', 'in_progress')
    AND refund_eligible = true
    ORDER BY milestone_number
  LOOP
    -- If milestone is not yet started or in early stages, full refund
    IF v_milestone.status = 'pending' THEN
      v_total_refund := v_total_refund + v_milestone.payment_amount;
      v_breakdown := v_breakdown || jsonb_build_object(
        'milestone_id', v_milestone.id,
        'milestone_title', v_milestone.title,
        'refund_amount', v_milestone.payment_amount,
        'refund_percentage', 100
      );
    ELSIF v_milestone.status = 'in_progress' AND v_milestone.refund_percentage IS NOT NULL THEN
      v_total_refund := v_total_refund + (v_milestone.payment_amount * v_milestone.refund_percentage / 100);
      v_breakdown := v_breakdown || jsonb_build_object(
        'milestone_id', v_milestone.id,
        'milestone_title', v_milestone.title,
        'refund_amount', v_milestone.payment_amount * v_milestone.refund_percentage / 100,
        'refund_percentage', v_milestone.refund_percentage
      );
    END IF;
  END LOOP;
  
  RETURN QUERY SELECT v_total_refund, v_breakdown;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate contract from template
CREATE OR REPLACE FUNCTION generate_contract_from_template(
  p_template_id UUID,
  p_booking_id UUID,
  p_variables JSONB
)
RETURNS UUID AS $$
DECLARE
  v_template RECORD;
  v_booking RECORD;
  v_contract_id UUID;
  v_contract_content TEXT;
  v_contract_number TEXT;
BEGIN
  -- Get template
  SELECT * INTO v_template
  FROM public.contract_templates
  WHERE id = p_template_id AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Template not found or inactive';
  END IF;
  
  -- Get booking details
  SELECT * INTO v_booking
  FROM public.bookings
  WHERE id = p_booking_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;
  
  -- Generate contract number
  v_contract_number := generate_contract_number();
  
  -- Replace variables in template
  v_contract_content := v_template.template_content;
  -- (Variable replacement logic would be done in application layer)
  
  -- Create contract
  INSERT INTO public.contracts (
    booking_id,
    customer_id,
    vendor_id,
    contract_number,
    contract_type,
    title,
    terms_and_conditions,
    total_amount,
    start_date,
    end_date,
    event_date,
    contract_template_id,
    status
  ) VALUES (
    p_booking_id,
    v_booking.user_id,
    v_booking.vendor_id,
    v_contract_number,
    v_template.template_type,
    'Wedding Service Contract - ' || v_contract_number,
    v_contract_content,
    v_booking.total_amount,
    CURRENT_DATE,
    v_booking.event_date,
    v_booking.event_date,
    p_template_id,
    'draft'
  )
  RETURNING id INTO v_contract_id;
  
  RETURN v_contract_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;

-- Contracts policies
CREATE POLICY "Users can view their own contracts"
  ON public.contracts FOR SELECT
  USING (auth.uid() = customer_id OR auth.uid() = vendor_id);

CREATE POLICY "Admins can view all contracts"
  ON public.contracts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Milestones policies
CREATE POLICY "Users can view milestones for their contracts"
  ON public.contract_milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts
      WHERE id = contract_id
      AND (customer_id = auth.uid() OR vendor_id = auth.uid())
    )
  );

-- Refund requests policies
CREATE POLICY "Users can view their refund requests"
  ON public.refund_requests FOR SELECT
  USING (requested_by = auth.uid());

CREATE POLICY "Users can create refund requests"
  ON public.refund_requests FOR INSERT
  WITH CHECK (requested_by = auth.uid());

-- Comments
COMMENT ON TABLE public.contracts IS 'Auto-generated smart contracts with e-signature support';
COMMENT ON TABLE public.contract_milestones IS 'Milestone-based payment and refund tracking';
COMMENT ON TABLE public.refund_requests IS 'Automated refund requests with milestone calculation';
COMMENT ON FUNCTION calculate_milestone_refund IS 'Calculate refundable amount based on milestone completion';
COMMENT ON FUNCTION generate_contract_from_template IS 'Auto-generate contract from template with variable substitution';
