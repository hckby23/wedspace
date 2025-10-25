-- KYC Verification System
-- Vendor and venue verification with Aadhaar, GST, and document verification

-- Verification status enum
CREATE TYPE verification_status AS ENUM (
  'pending',
  'in_review',
  'verified',
  'rejected',
  'expired',
  'suspended'
);

-- Document type enum
CREATE TYPE document_type AS ENUM (
  'aadhaar',
  'pan',
  'gst',
  'business_license',
  'trade_license',
  'fssai',
  'police_verification',
  'bank_statement',
  'address_proof',
  'identity_proof',
  'other'
);

-- Badge tier enum
CREATE TYPE badge_tier AS ENUM (
  'none',
  'bronze',
  'silver',
  'gold',
  'platinum',
  'elite'
);

-- Vendor verification table
CREATE TABLE IF NOT EXISTS public.vendor_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User/Vendor
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id),
  
  -- Personal details
  full_name TEXT NOT NULL,
  business_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Address
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  
  -- Verification documents
  aadhaar_number TEXT,
  aadhaar_verified BOOLEAN DEFAULT false,
  aadhaar_verified_at TIMESTAMP WITH TIME ZONE,
  
  pan_number TEXT,
  pan_verified BOOLEAN DEFAULT false,
  pan_verified_at TIMESTAMP WITH TIME ZONE,
  
  gst_number TEXT,
  gst_verified BOOLEAN DEFAULT false,
  gst_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Business details
  business_type TEXT, -- 'individual', 'partnership', 'company', 'llp'
  years_in_business INTEGER,
  business_registration_number TEXT,
  
  -- Verification status
  overall_status verification_status DEFAULT 'pending' NOT NULL,
  badge_tier badge_tier DEFAULT 'none' NOT NULL,
  
  -- Verification scores
  identity_score INTEGER DEFAULT 0 CHECK (identity_score >= 0 AND identity_score <= 100),
  business_score INTEGER DEFAULT 0 CHECK (business_score >= 0 AND business_score <= 100),
  trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  overall_score INTEGER DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  
  -- Review
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  rejection_reason TEXT,
  
  -- Expiry
  verification_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  UNIQUE(user_id, listing_id)
);

-- Verification documents table
CREATE TABLE IF NOT EXISTS public.verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference
  verification_id UUID NOT NULL REFERENCES public.vendor_verifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Document details
  document_type document_type NOT NULL,
  document_number TEXT,
  document_name TEXT NOT NULL,
  
  -- File storage
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  
  -- Verification
  status verification_status DEFAULT 'pending' NOT NULL,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  
  -- OCR/Extraction
  extracted_data JSONB,
  ocr_confidence DECIMAL(5,2),
  
  -- Expiry
  document_expires_at DATE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Verification checks log
CREATE TABLE IF NOT EXISTS public.verification_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference
  verification_id UUID NOT NULL REFERENCES public.vendor_verifications(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.verification_documents(id),
  
  -- Check details
  check_type TEXT NOT NULL, -- 'aadhaar_api', 'gst_api', 'manual_review', 'ocr', 'face_match'
  check_provider TEXT, -- 'digilocker', 'karza', 'manual', etc.
  
  -- Result
  status TEXT NOT NULL, -- 'success', 'failed', 'pending', 'error'
  result_data JSONB,
  confidence_score DECIMAL(5,2),
  
  -- API details
  api_request JSONB,
  api_response JSONB,
  api_error TEXT,
  
  -- Cost
  cost_amount DECIMAL(10,2),
  cost_currency TEXT DEFAULT 'INR',
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Badge criteria table
CREATE TABLE IF NOT EXISTS public.badge_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Badge details
  tier badge_tier NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  color TEXT,
  
  -- Requirements
  min_identity_score INTEGER DEFAULT 0,
  min_business_score INTEGER DEFAULT 0,
  min_trust_score INTEGER DEFAULT 0,
  min_overall_score INTEGER DEFAULT 0,
  
  required_verifications TEXT[], -- ['aadhaar', 'gst', 'pan']
  min_completed_bookings INTEGER DEFAULT 0,
  min_rating DECIMAL(3,2) DEFAULT 0,
  min_reviews INTEGER DEFAULT 0,
  
  -- Benefits
  benefits TEXT[],
  priority_support BOOLEAN DEFAULT false,
  featured_listing BOOLEAN DEFAULT false,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX idx_vendor_verifications_user ON public.vendor_verifications(user_id);
CREATE INDEX idx_vendor_verifications_listing ON public.vendor_verifications(listing_id);
CREATE INDEX idx_vendor_verifications_status ON public.vendor_verifications(overall_status);
CREATE INDEX idx_vendor_verifications_badge ON public.vendor_verifications(badge_tier);

CREATE INDEX idx_verification_documents_verification ON public.verification_documents(verification_id);
CREATE INDEX idx_verification_documents_user ON public.verification_documents(user_id);
CREATE INDEX idx_verification_documents_type ON public.verification_documents(document_type);
CREATE INDEX idx_verification_documents_status ON public.verification_documents(status);

CREATE INDEX idx_verification_checks_verification ON public.verification_checks(verification_id);
CREATE INDEX idx_verification_checks_type ON public.verification_checks(check_type);
CREATE INDEX idx_verification_checks_status ON public.verification_checks(status);

-- Triggers
CREATE TRIGGER vendor_verifications_updated_at
  BEFORE UPDATE ON public.vendor_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_escrow_updated_at();

CREATE TRIGGER verification_documents_updated_at
  BEFORE UPDATE ON public.verification_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_escrow_updated_at();

-- Function to calculate verification scores
CREATE OR REPLACE FUNCTION calculate_verification_scores(p_verification_id UUID)
RETURNS VOID AS $$
DECLARE
  v_identity_score INTEGER := 0;
  v_business_score INTEGER := 0;
  v_trust_score INTEGER := 0;
  v_overall_score INTEGER := 0;
  v_verification RECORD;
  v_doc_count INTEGER;
BEGIN
  -- Get verification details
  SELECT * INTO v_verification
  FROM public.vendor_verifications
  WHERE id = p_verification_id;
  
  -- Identity score (max 100)
  IF v_verification.aadhaar_verified THEN
    v_identity_score := v_identity_score + 40;
  END IF;
  
  IF v_verification.pan_verified THEN
    v_identity_score := v_identity_score + 30;
  END IF;
  
  -- Check for additional identity documents
  SELECT COUNT(*) INTO v_doc_count
  FROM public.verification_documents
  WHERE verification_id = p_verification_id
  AND document_type IN ('identity_proof', 'address_proof')
  AND status = 'verified';
  
  v_identity_score := v_identity_score + LEAST(v_doc_count * 15, 30);
  
  -- Business score (max 100)
  IF v_verification.gst_verified THEN
    v_business_score := v_business_score + 50;
  END IF;
  
  IF v_verification.business_registration_number IS NOT NULL THEN
    v_business_score := v_business_score + 20;
  END IF;
  
  IF v_verification.years_in_business >= 5 THEN
    v_business_score := v_business_score + 20;
  ELSIF v_verification.years_in_business >= 2 THEN
    v_business_score := v_business_score + 10;
  END IF;
  
  -- Check for business documents
  SELECT COUNT(*) INTO v_doc_count
  FROM public.verification_documents
  WHERE verification_id = p_verification_id
  AND document_type IN ('business_license', 'trade_license', 'fssai')
  AND status = 'verified';
  
  v_business_score := v_business_score + LEAST(v_doc_count * 10, 30);
  
  -- Trust score (based on reviews, ratings, bookings)
  -- This would be calculated from actual booking/review data
  v_trust_score := 50; -- Placeholder
  
  -- Overall score (weighted average)
  v_overall_score := (v_identity_score * 0.3 + v_business_score * 0.4 + v_trust_score * 0.3)::INTEGER;
  
  -- Update scores
  UPDATE public.vendor_verifications
  SET 
    identity_score = v_identity_score,
    business_score = v_business_score,
    trust_score = v_trust_score,
    overall_score = v_overall_score,
    updated_at = now()
  WHERE id = p_verification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to assign badge tier
CREATE OR REPLACE FUNCTION assign_badge_tier(p_verification_id UUID)
RETURNS badge_tier AS $$
DECLARE
  v_verification RECORD;
  v_badge badge_tier := 'none';
  v_criteria RECORD;
BEGIN
  -- Get verification details
  SELECT * INTO v_verification
  FROM public.vendor_verifications
  WHERE id = p_verification_id;
  
  -- Check badge criteria from highest to lowest
  FOR v_criteria IN
    SELECT * FROM public.badge_criteria
    WHERE is_active = true
    ORDER BY display_order DESC
  LOOP
    IF v_verification.identity_score >= v_criteria.min_identity_score
      AND v_verification.business_score >= v_criteria.min_business_score
      AND v_verification.trust_score >= v_criteria.min_trust_score
      AND v_verification.overall_score >= v_criteria.min_overall_score
    THEN
      v_badge := v_criteria.tier;
      EXIT;
    END IF;
  END LOOP;
  
  -- Update badge
  UPDATE public.vendor_verifications
  SET badge_tier = v_badge
  WHERE id = p_verification_id;
  
  RETURN v_badge;
END;
$$ LANGUAGE plpgsql;

-- Function to verify Aadhaar (placeholder for API integration)
CREATE OR REPLACE FUNCTION verify_aadhaar(
  p_verification_id UUID,
  p_aadhaar_number TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_check_id UUID;
BEGIN
  -- Log verification check
  INSERT INTO public.verification_checks (
    verification_id,
    check_type,
    check_provider,
    status,
    started_at
  ) VALUES (
    p_verification_id,
    'aadhaar_api',
    'digilocker',
    'pending',
    now()
  )
  RETURNING id INTO v_check_id;
  
  -- In production, this would call DigiLocker or Aadhaar verification API
  -- For now, simulate success
  
  UPDATE public.verification_checks
  SET 
    status = 'success',
    completed_at = now(),
    duration_ms = 1000,
    confidence_score = 95.0
  WHERE id = v_check_id;
  
  -- Update verification
  UPDATE public.vendor_verifications
  SET 
    aadhaar_verified = true,
    aadhaar_verified_at = now()
  WHERE id = p_verification_id;
  
  -- Recalculate scores
  PERFORM calculate_verification_scores(p_verification_id);
  PERFORM assign_badge_tier(p_verification_id);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default badge criteria
INSERT INTO public.badge_criteria (tier, name, description, min_overall_score, display_order) VALUES
('bronze', 'Bronze Verified', 'Basic verification complete', 30, 1),
('silver', 'Silver Verified', 'Enhanced verification with business documents', 50, 2),
('gold', 'Gold Verified', 'Comprehensive verification with strong track record', 70, 3),
('platinum', 'Platinum Verified', 'Premium verification with excellent reputation', 85, 4),
('elite', 'Elite Verified', 'Top-tier verification with outstanding credentials', 95, 5)
ON CONFLICT (tier) DO NOTHING;

-- RLS Policies
ALTER TABLE public.vendor_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_checks ENABLE ROW LEVEL SECURITY;

-- Verification policies
CREATE POLICY "Users can view their own verification"
  ON public.vendor_verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their verification"
  ON public.vendor_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their verification"
  ON public.vendor_verifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Document policies
CREATE POLICY "Users can manage their documents"
  ON public.verification_documents FOR ALL
  USING (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE public.vendor_verifications IS 'KYC verification for vendors and venues';
COMMENT ON TABLE public.verification_documents IS 'Uploaded verification documents';
COMMENT ON TABLE public.badge_criteria IS 'Badge tier requirements and benefits';
COMMENT ON FUNCTION verify_aadhaar IS 'Verify Aadhaar number via API (placeholder)';
