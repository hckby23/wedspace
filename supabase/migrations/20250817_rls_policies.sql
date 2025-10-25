-- WedSpace Row Level Security Policies
-- Comprehensive RLS policies for all tables

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user owns a listing
CREATE OR REPLACE FUNCTION public.owns_listing(listing_id UUID, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.listings 
    WHERE id = listing_id AND owner_id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Venues policies (legacy table, keep for backward compatibility)
DROP POLICY IF EXISTS "Allow public read access to venues" ON public.venues;

CREATE POLICY "Public can view active verified venues" ON public.venues
  FOR SELECT USING (status = 'active' AND verified = true);

CREATE POLICY "Owners can manage their venues" ON public.venues
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all venues" ON public.venues
  FOR ALL USING (public.is_admin());

-- Vendors policies (legacy table, keep for backward compatibility)
DROP POLICY IF EXISTS "Allow public read access to vendors" ON public.vendors;

CREATE POLICY "Public can view active verified vendors" ON public.vendors
  FOR SELECT USING (status = 'active' AND verified = true);

CREATE POLICY "Owners can manage their vendors" ON public.vendors
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all vendors" ON public.vendors
  FOR ALL USING (public.is_admin());

-- Listings policies (main unified table)
CREATE POLICY "Public can view active verified listings" ON public.listings
  FOR SELECT USING (status = 'active' AND verified = true);

CREATE POLICY "Owners can view their own listings" ON public.listings
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Owners can manage their listings" ON public.listings
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all listings" ON public.listings
  FOR ALL USING (public.is_admin());

-- Media policies
CREATE POLICY "Public can view media for active listings" ON public.media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.listings l 
      WHERE l.id = media.listing_id 
      AND l.status = 'active' 
      AND l.verified = true
    )
  );

CREATE POLICY "Listing owners can manage their media" ON public.media
  FOR ALL USING (public.owns_listing(listing_id));

CREATE POLICY "Admins can manage all media" ON public.media
  FOR ALL USING (public.is_admin());

-- Inspiration posts policies
CREATE POLICY "Public can view inspiration posts" ON public.inspiration_posts
  FOR SELECT USING (true);

CREATE POLICY "Authors can manage their posts" ON public.inspiration_posts
  FOR ALL USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all inspiration posts" ON public.inspiration_posts
  FOR ALL USING (public.is_admin());

-- Reels policies
CREATE POLICY "Public can view reels" ON public.reels
  FOR SELECT USING (true);

CREATE POLICY "Authors can manage their reels" ON public.reels
  FOR ALL USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all reels" ON public.reels
  FOR ALL USING (public.is_admin());

-- Moodboards policies
CREATE POLICY "Users can view public moodboards" ON public.moodboards
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own moodboards" ON public.moodboards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own moodboards" ON public.moodboards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all moodboards" ON public.moodboards
  FOR SELECT USING (public.is_admin());

-- Moodboard items policies
CREATE POLICY "Users can view items in accessible moodboards" ON public.moodboard_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.moodboards m 
      WHERE m.id = moodboard_items.moodboard_id 
      AND (m.user_id = auth.uid() OR m.is_public = true)
    )
  );

CREATE POLICY "Users can manage items in their moodboards" ON public.moodboard_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.moodboards m 
      WHERE m.id = moodboard_items.moodboard_id 
      AND m.user_id = auth.uid()
    )
  );

-- Reviews policies
CREATE POLICY "Public can view approved reviews" ON public.reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own reviews" ON public.reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create reviews for their bookings" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id 
    AND (booking_id IS NULL OR EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.id = reviews.booking_id 
      AND b.user_id = auth.uid()
      AND b.booking_status = 'completed'
    ))
  );

CREATE POLICY "Users can update their own pending reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can manage all reviews" ON public.reviews
  FOR ALL USING (public.is_admin());

-- Scorecards policies
CREATE POLICY "Public can view scorecards for active listings" ON public.scorecards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.listings l 
      WHERE l.id = scorecards.listing_id 
      AND l.status = 'active' 
      AND l.verified = true
    )
  );

CREATE POLICY "Listing owners can view their scorecards" ON public.scorecards
  FOR SELECT USING (public.owns_listing(listing_id));

CREATE POLICY "Admins can manage all scorecards" ON public.scorecards
  FOR ALL USING (public.is_admin());

-- Availability policies
CREATE POLICY "Public can view availability for active listings" ON public.availability
  FOR SELECT USING (
    listing_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.listings l 
      WHERE l.id = availability.listing_id 
      AND l.status = 'active' 
      AND l.verified = true
    )
  );

CREATE POLICY "Listing owners can manage their availability" ON public.availability
  FOR ALL USING (
    listing_id IS NOT NULL AND public.owns_listing(listing_id)
  );

CREATE POLICY "Admins can manage all availability" ON public.availability
  FOR ALL USING (public.is_admin());

-- Negotiations policies
CREATE POLICY "Users can view their own negotiations" ON public.negotiations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Listing owners can view negotiations for their listings" ON public.negotiations
  FOR SELECT USING (public.owns_listing(listing_id));

CREATE POLICY "Users can create negotiations" ON public.negotiations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Participants can update negotiations" ON public.negotiations
  FOR UPDATE USING (
    auth.uid() = user_id OR public.owns_listing(listing_id)
  );

CREATE POLICY "Admins can view all negotiations" ON public.negotiations
  FOR SELECT USING (public.is_admin());

-- Bookings policies
DROP POLICY IF EXISTS "Allow users to view their own bookings" ON public.bookings;

CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Listing owners can view bookings for their listings" ON public.bookings
  FOR SELECT USING (
    listing_id IS NOT NULL AND public.owns_listing(listing_id)
  );

CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Participants can update bookings" ON public.bookings
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    (listing_id IS NOT NULL AND public.owns_listing(listing_id))
  );

CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (public.is_admin());

-- Visits policies
CREATE POLICY "Users can view their own visits" ON public.visits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Listing owners can view visits for their listings" ON public.visits
  FOR SELECT USING (public.owns_listing(listing_id));

CREATE POLICY "Users can create visits" ON public.visits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Participants can update visits" ON public.visits
  FOR UPDATE USING (
    auth.uid() = user_id OR public.owns_listing(listing_id)
  );

CREATE POLICY "Admins can view all visits" ON public.visits
  FOR SELECT USING (public.is_admin());

-- Payments policies
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update payments" ON public.payments
  FOR UPDATE USING (true); -- Webhook updates

CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL USING (public.is_admin());

-- Favorites policies
CREATE POLICY "Users can manage their own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all notifications" ON public.notifications
  FOR ALL USING (public.is_admin());

-- Admin audit policies
CREATE POLICY "Admins can view audit logs" ON public.admin_audit
  FOR SELECT USING (public.is_admin());

CREATE POLICY "System can create audit logs" ON public.admin_audit
  FOR INSERT WITH CHECK (true);

-- Events policies (analytics)
CREATE POLICY "Users can view their own events" ON public.events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create events" ON public.events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all events" ON public.events
  FOR SELECT USING (public.is_admin());

-- Waitlist policies (existing table)
CREATE POLICY "Public can insert into waitlist" ON public.waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage waitlist" ON public.waitlist
  FOR ALL USING (public.is_admin());
