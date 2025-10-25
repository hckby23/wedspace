-- Shared Couple Planning System Migration
-- Enables 2 separate accounts to connect and share wedding planning data
-- while maintaining personal data separation

-- ============================================================================
-- WEDDINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.weddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  event_date DATE,
  city TEXT,
  guest_count_estimate INTEGER,
  total_budget NUMERIC DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- WEDDING MEMBERS (couples + collaborators)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.wedding_members (
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'partner', 'collaborator')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('invited', 'active', 'left')),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (wedding_id, user_id)
);

-- ============================================================================
-- WEDDING INVITES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.wedding_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'partner' CHECK (role IN ('partner', 'collaborator')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS wedding_invites_token_idx ON public.wedding_invites(token);
CREATE INDEX IF NOT EXISTS wedding_invites_email_idx ON public.wedding_invites(email);

-- ============================================================================
-- ADD WEDDING_ID TO EXISTING PLANNING TABLES
-- ============================================================================

-- Checklist Tasks
ALTER TABLE public.checklist_tasks 
  ADD COLUMN IF NOT EXISTS wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE;

ALTER TABLE public.checklist_tasks
  ADD CONSTRAINT IF NOT EXISTS checklist_scope_ck CHECK (
    (user_id IS NOT NULL AND wedding_id IS NULL) OR
    (user_id IS NULL AND wedding_id IS NOT NULL)
  );

CREATE INDEX IF NOT EXISTS checklist_tasks_wedding_idx ON public.checklist_tasks(wedding_id);

-- Budget Items
ALTER TABLE public.budget_items
  ADD COLUMN IF NOT EXISTS wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE;

ALTER TABLE public.budget_items
  ADD CONSTRAINT IF NOT EXISTS budget_scope_ck CHECK (
    (user_id IS NOT NULL AND wedding_id IS NULL) OR
    (user_id IS NULL AND wedding_id IS NOT NULL)
  );

CREATE INDEX IF NOT EXISTS budget_items_wedding_idx ON public.budget_items(wedding_id);

-- Timeline Items (create if doesn't exist)
CREATE TABLE IF NOT EXISTS public.timeline_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  category TEXT,
  completed BOOLEAN DEFAULT false,
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT timeline_scope_ck CHECK (
    (user_id IS NOT NULL AND wedding_id IS NULL) OR
    (user_id IS NULL AND wedding_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS timeline_items_wedding_idx ON public.timeline_items(wedding_id);
CREATE INDEX IF NOT EXISTS timeline_items_user_idx ON public.timeline_items(user_id);

-- Guests
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  category TEXT,
  side TEXT CHECK (side IN ('bride', 'groom', 'both')),
  rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'confirmed', 'declined')),
  plus_one BOOLEAN DEFAULT false,
  dietary_restrictions TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT guests_scope_ck CHECK (
    (user_id IS NOT NULL AND wedding_id IS NULL) OR
    (user_id IS NULL AND wedding_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS guests_wedding_idx ON public.guests(wedding_id);
CREATE INDEX IF NOT EXISTS guests_user_idx ON public.guests(user_id);

-- Favorites / Saved Items
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  list_name TEXT DEFAULT 'default',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT favorites_scope_ck CHECK (
    (user_id IS NOT NULL AND wedding_id IS NULL) OR
    (user_id IS NULL AND wedding_id IS NOT NULL)
  ),
  UNIQUE(user_id, listing_id, list_name),
  UNIQUE(wedding_id, listing_id, list_name)
);

CREATE INDEX IF NOT EXISTS favorites_wedding_idx ON public.favorites(wedding_id);
CREATE INDEX IF NOT EXISTS favorites_user_idx ON public.favorites(user_id);

-- User Settings (wedding-level settings)
CREATE TABLE IF NOT EXISTS public.wedding_settings (
  wedding_id UUID PRIMARY KEY REFERENCES public.weddings(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Events
CREATE TABLE IF NOT EXISTS public.activity_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS activity_events_wedding_idx ON public.activity_events(wedding_id);
CREATE INDEX IF NOT EXISTS activity_events_created_idx ON public.activity_events(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Weddings
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY weddings_select_policy ON public.weddings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.wedding_members wm
      WHERE wm.wedding_id = weddings.id
        AND wm.user_id = auth.uid()
        AND wm.status = 'active'
    )
  );

CREATE POLICY weddings_insert_policy ON public.weddings
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY weddings_update_policy ON public.weddings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.wedding_members wm
      WHERE wm.wedding_id = weddings.id
        AND wm.user_id = auth.uid()
        AND wm.role IN ('owner', 'partner')
        AND wm.status = 'active'
    )
  );

-- Wedding Members
ALTER TABLE public.wedding_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY wedding_members_select_policy ON public.wedding_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.wedding_members wm
      WHERE wm.wedding_id = wedding_members.wedding_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'active'
    )
  );

CREATE POLICY wedding_members_insert_policy ON public.wedding_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.wedding_members wm
      WHERE wm.wedding_id = wedding_members.wedding_id
        AND wm.user_id = auth.uid()
        AND wm.role IN ('owner', 'partner')
        AND wm.status = 'active'
    ) OR invited_by = auth.uid()
  );

-- Wedding Invites
ALTER TABLE public.wedding_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY wedding_invites_select_policy ON public.wedding_invites
  FOR SELECT USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.wedding_members wm
      WHERE wm.wedding_id = wedding_invites.wedding_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'active'
    )
  );

CREATE POLICY wedding_invites_insert_policy ON public.wedding_invites
  FOR INSERT WITH CHECK (invited_by = auth.uid());

-- Checklist Tasks (update existing policies)
DROP POLICY IF EXISTS checklist_user_policy ON public.checklist_tasks;

CREATE POLICY checklist_personal_policy ON public.checklist_tasks
  FOR ALL USING (user_id = auth.uid() AND wedding_id IS NULL);

CREATE POLICY checklist_wedding_policy ON public.checklist_tasks
  FOR ALL USING (
    wedding_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.wedding_members wm
      WHERE wm.wedding_id = checklist_tasks.wedding_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'active'
    )
  );

-- Budget Items (update existing policies)
DROP POLICY IF EXISTS budget_user_policy ON public.budget_items;

CREATE POLICY budget_personal_policy ON public.budget_items
  FOR ALL USING (user_id = auth.uid() AND wedding_id IS NULL);

CREATE POLICY budget_wedding_policy ON public.budget_items
  FOR ALL USING (
    wedding_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.wedding_members wm
      WHERE wm.wedding_id = budget_items.wedding_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'active'
    )
  );

-- Timeline Items
ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY timeline_personal_policy ON public.timeline_items
  FOR ALL USING (user_id = auth.uid() AND wedding_id IS NULL);

CREATE POLICY timeline_wedding_policy ON public.timeline_items
  FOR ALL USING (
    wedding_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.wedding_members wm
      WHERE wm.wedding_id = timeline_items.wedding_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'active'
    )
  );

-- Guests
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY guests_personal_policy ON public.guests
  FOR ALL USING (user_id = auth.uid() AND wedding_id IS NULL);

CREATE POLICY guests_wedding_policy ON public.guests
  FOR ALL USING (
    wedding_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.wedding_members wm
      WHERE wm.wedding_id = guests.wedding_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'active'
    )
  );

-- Favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY favorites_personal_policy ON public.favorites
  FOR ALL USING (user_id = auth.uid() AND wedding_id IS NULL);

CREATE POLICY favorites_wedding_policy ON public.favorites
  FOR ALL USING (
    wedding_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.wedding_members wm
      WHERE wm.wedding_id = favorites.wedding_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'active'
    )
  );

-- Wedding Settings
ALTER TABLE public.wedding_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY wedding_settings_policy ON public.wedding_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.wedding_members wm
      WHERE wm.wedding_id = wedding_settings.wedding_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'active'
    )
  );

-- Activity Events
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY activity_events_policy ON public.activity_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.wedding_members wm
      WHERE wm.wedding_id = activity_events.wedding_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'active'
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user is member of wedding
CREATE OR REPLACE FUNCTION is_wedding_member(p_wedding_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.wedding_members
    WHERE wedding_id = p_wedding_id
      AND user_id = p_user_id
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log activity
CREATE OR REPLACE FUNCTION log_wedding_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.wedding_id IS NOT NULL THEN
    INSERT INTO public.activity_events (wedding_id, user_id, event_type, event_data)
    VALUES (
      NEW.wedding_id,
      auth.uid(),
      TG_TABLE_NAME || '_' || TG_OP,
      row_to_json(NEW)::jsonb
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activity triggers
CREATE TRIGGER checklist_activity_trigger
  AFTER INSERT OR UPDATE ON public.checklist_tasks
  FOR EACH ROW EXECUTE FUNCTION log_wedding_activity();

CREATE TRIGGER budget_activity_trigger
  AFTER INSERT OR UPDATE ON public.budget_items
  FOR EACH ROW EXECUTE FUNCTION log_wedding_activity();

CREATE TRIGGER guests_activity_trigger
  AFTER INSERT OR UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION log_wedding_activity();

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE public.weddings IS 'Shared wedding planning contexts for couples';
COMMENT ON TABLE public.wedding_members IS 'Members (couples + collaborators) of a wedding';
COMMENT ON TABLE public.wedding_invites IS 'Pending invitations to join a wedding';
COMMENT ON COLUMN public.checklist_tasks.wedding_id IS 'If set, task is shared across wedding members';
COMMENT ON COLUMN public.budget_items.wedding_id IS 'If set, budget item is shared across wedding members';
