-- WedSpace Seed Data
-- Sample data for development and testing

-- Insert sample profiles (admin and test users)
INSERT INTO public.profiles (id, email, full_name, role, phone, city, verified, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@wedspace.com', 'WedSpace Admin', 'admin', '+91-9999999999', 'Mumbai', true, now()),
('00000000-0000-0000-0000-000000000002', 'john@example.com', 'John Doe', 'user', '+91-9876543210', 'Mumbai', true, now()),
('00000000-0000-0000-0000-000000000003', 'priya@example.com', 'Priya Sharma', 'user', '+91-9876543211', 'Delhi', true, now()),
('00000000-0000-0000-0000-000000000004', 'vendor1@example.com', 'Raj Photography', 'vendor', '+91-9876543212', 'Mumbai', true, now()),
('00000000-0000-0000-0000-000000000005', 'venue1@example.com', 'Grand Palace Owner', 'venue_owner', '+91-9876543213', 'Mumbai', true, now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample venues
INSERT INTO public.venues (id, owner_id, name, description, address, city, state, lat, lng, capacity_min, capacity_max, price_per_plate, base_price, venue_type, verified, status, images, amenities, created_at) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'Grand Palace Banquet', 'Luxurious banquet hall perfect for grand weddings with traditional Indian architecture and modern amenities.', 'Andheri West, Mumbai', 'Mumbai', 'Maharashtra', 19.1136, 72.8697, 100, 500, 1200.00, 150000.00, 'Banquet Hall', true, 'active', ARRAY['/images/venues/grand-palace-1.jpg', '/images/venues/grand-palace-2.jpg'], ARRAY['AC', 'Parking', 'Catering', 'Decoration', 'Sound System'], now()),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'Seaside Resort', 'Beautiful beachside resort with stunning ocean views, perfect for destination weddings.', 'Juhu Beach, Mumbai', 'Mumbai', 'Maharashtra', 19.1075, 72.8263, 50, 300, 1800.00, 200000.00, 'Resort', true, 'active', ARRAY['/images/venues/seaside-1.jpg', '/images/venues/seaside-2.jpg'], ARRAY['Beach Access', 'AC', 'Parking', 'Catering', 'Rooms'], now()),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'Heritage Haveli', 'Traditional Rajasthani haveli with authentic architecture and royal ambiance.', 'Connaught Place, Delhi', 'Delhi', 'Delhi', 28.6315, 77.2167, 80, 400, 1500.00, 180000.00, 'Heritage', true, 'active', ARRAY['/images/venues/haveli-1.jpg', '/images/venues/haveli-2.jpg'], ARRAY['Traditional Decor', 'AC', 'Parking', 'Catering', 'Cultural Shows'], now()),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'Garden Paradise', 'Lush garden venue with natural beauty and outdoor ceremony spaces.', 'Bandra West, Mumbai', 'Mumbai', 'Maharashtra', 19.0596, 72.8295, 60, 250, 1000.00, 120000.00, 'Garden', true, 'active', ARRAY['/images/venues/garden-1.jpg', '/images/venues/garden-2.jpg'], ARRAY['Garden', 'Outdoor Ceremony', 'Parking', 'Catering'], now()),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'Royal Ballroom', 'Elegant ballroom with crystal chandeliers and premium interiors.', 'Powai, Mumbai', 'Mumbai', 'Maharashtra', 19.1176, 72.9060, 120, 600, 2000.00, 250000.00, 'Ballroom', true, 'active', ARRAY['/images/venues/ballroom-1.jpg', '/images/venues/ballroom-2.jpg'], ARRAY['Luxury Interiors', 'AC', 'Valet Parking', 'Premium Catering'], now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample vendors
INSERT INTO public.vendors (id, owner_id, name, category, description, city, state, price_range, rating, verified, status, images, portfolio_images, services_offered, contact_email, contact_phone, created_at) VALUES
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'Raj Photography Studio', 'Photography', 'Professional wedding photographers specializing in candid and traditional photography with 10+ years experience.', 'Mumbai', 'Maharashtra', 'Premium', 4.8, true, 'active', ARRAY['/images/vendors/raj-photo-1.jpg'], ARRAY['/portfolio/raj-1.jpg', '/portfolio/raj-2.jpg', '/portfolio/raj-3.jpg'], ARRAY['Wedding Photography', 'Pre-wedding Shoots', 'Candid Photography', 'Traditional Photography'], 'raj@rajphoto.com', '+91-9876543212', now()),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'Spice Garden Catering', 'Catering', 'Premium catering service offering authentic Indian cuisine and international dishes for weddings.', 'Mumbai', 'Maharashtra', 'Mid-range', 4.6, true, 'active', ARRAY['/images/vendors/spice-catering-1.jpg'], ARRAY['/portfolio/spice-1.jpg', '/portfolio/spice-2.jpg'], ARRAY['Indian Cuisine', 'Continental Food', 'Live Counters', 'Dessert Station'], 'info@spicegarden.com', '+91-9876543214', now()),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'Floral Dreams Decoration', 'Decoration', 'Creative wedding decorators specializing in floral arrangements and theme-based decorations.', 'Delhi', 'Delhi', 'Premium', 4.7, true, 'active', ARRAY['/images/vendors/floral-1.jpg'], ARRAY['/portfolio/floral-1.jpg', '/portfolio/floral-2.jpg'], ARRAY['Floral Decoration', 'Theme Decoration', 'Stage Setup', 'Lighting'], 'contact@floraldreams.com', '+91-9876543215', now()),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'Melody Music Band', 'Music', 'Live music band with versatile repertoire including Bollywood, classical, and western music.', 'Mumbai', 'Maharashtra', 'Mid-range', 4.5, true, 'active', ARRAY['/images/vendors/melody-1.jpg'], ARRAY['/portfolio/melody-1.jpg', '/portfolio/melody-2.jpg'], ARRAY['Live Band', 'DJ Services', 'Sound System', 'Bollywood Music'], 'bookings@melodyband.com', '+91-9876543216', now()),
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', 'Glamour Makeup Studio', 'Makeup', 'Professional bridal makeup artists with expertise in traditional and contemporary looks.', 'Mumbai', 'Maharashtra', 'Premium', 4.9, true, 'active', ARRAY['/images/vendors/glamour-1.jpg'], ARRAY['/portfolio/glamour-1.jpg', '/portfolio/glamour-2.jpg'], ARRAY['Bridal Makeup', 'Hair Styling', 'Mehendi', 'Family Makeup'], 'bookings@glamourstudio.com', '+91-9876543217', now())
ON CONFLICT (id) DO NOTHING;

-- Insert unified listings
INSERT INTO public.listings (id, owner_id, listing_type, venue_id, vendor_id, title, description, base_price, city, state, verified, status, featured, rating, review_count, created_at) VALUES
-- Venue listings
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'venue', '10000000-0000-0000-0000-000000000001', NULL, 'Grand Palace Banquet', 'Luxurious banquet hall perfect for grand weddings', 150000.00, 'Mumbai', 'Maharashtra', true, 'active', true, 4.8, 45, now()),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'venue', '10000000-0000-0000-0000-000000000002', NULL, 'Seaside Resort', 'Beautiful beachside resort with stunning ocean views', 200000.00, 'Mumbai', 'Maharashtra', true, 'active', true, 4.9, 32, now()),
('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'venue', '10000000-0000-0000-0000-000000000003', NULL, 'Heritage Haveli', 'Traditional Rajasthani haveli with royal ambiance', 180000.00, 'Delhi', 'Delhi', true, 'active', false, 4.7, 28, now()),
('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'venue', '10000000-0000-0000-0000-000000000004', NULL, 'Garden Paradise', 'Lush garden venue with natural beauty', 120000.00, 'Mumbai', 'Maharashtra', true, 'active', false, 4.6, 22, now()),
('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'venue', '10000000-0000-0000-0000-000000000005', NULL, 'Royal Ballroom', 'Elegant ballroom with crystal chandeliers', 250000.00, 'Mumbai', 'Maharashtra', true, 'active', true, 4.8, 38, now()),
-- Vendor listings
('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004', 'vendor', NULL, '20000000-0000-0000-0000-000000000001', 'Raj Photography Studio', 'Professional wedding photographers with 10+ years experience', 75000.00, 'Mumbai', 'Maharashtra', true, 'active', true, 4.8, 156, now()),
('30000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004', 'vendor', NULL, '20000000-0000-0000-0000-000000000002', 'Spice Garden Catering', 'Premium catering service with authentic Indian cuisine', 45000.00, 'Mumbai', 'Maharashtra', true, 'active', false, 4.6, 89, now()),
('30000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000004', 'vendor', NULL, '20000000-0000-0000-0000-000000000003', 'Floral Dreams Decoration', 'Creative wedding decorators specializing in floral arrangements', 65000.00, 'Delhi', 'Delhi', true, 'active', true, 4.7, 73, now()),
('30000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004', 'vendor', NULL, '20000000-0000-0000-0000-000000000004', 'Melody Music Band', 'Live music band with versatile repertoire', 35000.00, 'Mumbai', 'Maharashtra', true, 'active', false, 4.5, 64, now()),
('30000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000004', 'vendor', NULL, '20000000-0000-0000-0000-000000000005', 'Glamour Makeup Studio', 'Professional bridal makeup artists', 25000.00, 'Mumbai', 'Maharashtra', true, 'active', true, 4.9, 127, now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample media
INSERT INTO public.media (listing_id, url, type, caption, alt_text, sort_order, is_primary) VALUES
('30000000-0000-0000-0000-000000000001', '/images/venues/grand-palace-main.jpg', 'image', 'Main hall view', 'Grand Palace main banquet hall', 1, true),
('30000000-0000-0000-0000-000000000001', '/images/venues/grand-palace-stage.jpg', 'image', 'Stage setup', 'Decorated stage area', 2, false),
('30000000-0000-0000-0000-000000000002', '/images/venues/seaside-beach.jpg', 'image', 'Beach ceremony area', 'Beachside wedding ceremony setup', 1, true),
('30000000-0000-0000-0000-000000000006', '/images/vendors/raj-portfolio-1.jpg', 'image', 'Candid wedding shot', 'Beautiful candid moment capture', 1, true),
('30000000-0000-0000-0000-000000000006', '/images/vendors/raj-portfolio-2.jpg', 'image', 'Traditional ceremony', 'Traditional wedding ceremony photography', 2, false);

-- Insert sample availability (next 90 days)
INSERT INTO public.availability (listing_id, date, is_available, remaining_slots, price_override)
SELECT 
  l.id,
  current_date + (generate_series(1, 90) || ' days')::interval,
  CASE 
    WHEN EXTRACT(dow FROM current_date + (generate_series(1, 90) || ' days')::interval) IN (0, 6) THEN true -- weekends more available
    WHEN random() > 0.3 THEN true 
    ELSE false 
  END,
  1,
  CASE 
    WHEN EXTRACT(dow FROM current_date + (generate_series(1, 90) || ' days')::interval) IN (0, 6) THEN l.base_price * 1.2 -- weekend premium
    ELSE NULL 
  END
FROM public.listings l
WHERE l.listing_type = 'venue';

-- Insert sample inspiration posts
INSERT INTO public.inspiration_posts (title, description, image_url, tags, category, author_id, view_count, save_count) VALUES
('Rustic Garden Wedding Decor', 'Beautiful rustic themed wedding with natural elements and fairy lights', '/images/inspiration/rustic-garden.jpg', ARRAY['rustic', 'garden', 'fairy lights', 'natural'], 'Decoration', '00000000-0000-0000-0000-000000000001', 1250, 89),
('Traditional South Indian Wedding', 'Elegant traditional ceremony with gold and red theme', '/images/inspiration/south-indian.jpg', ARRAY['traditional', 'south indian', 'gold', 'red'], 'Ceremony', '00000000-0000-0000-0000-000000000001', 2100, 156),
('Beach Wedding Setup', 'Romantic beachside wedding with white and blue theme', '/images/inspiration/beach-wedding.jpg', ARRAY['beach', 'romantic', 'white', 'blue'], 'Venue', '00000000-0000-0000-0000-000000000001', 1800, 134),
('Mehendi Ceremony Ideas', 'Colorful mehendi ceremony with marigold decorations', '/images/inspiration/mehendi.jpg', ARRAY['mehendi', 'colorful', 'marigold', 'traditional'], 'Ceremony', '00000000-0000-0000-0000-000000000001', 950, 67),
('Modern Minimalist Wedding', 'Clean and elegant minimalist wedding design', '/images/inspiration/minimalist.jpg', ARRAY['modern', 'minimalist', 'elegant', 'clean'], 'Decoration', '00000000-0000-0000-0000-000000000001', 1450, 98);

-- Insert sample reels
INSERT INTO public.reels (title, description, video_url, thumbnail_url, tags, listing_id, author_id, view_count, like_count, duration_seconds) VALUES
('Grand Palace Wedding Highlight', 'Beautiful wedding moments at Grand Palace Banquet', '/videos/reels/grand-palace-wedding.mp4', '/images/reels/grand-palace-thumb.jpg', ARRAY['wedding', 'grand palace', 'celebration'], '30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 5600, 234, 45),
('Raj Photography Behind Scenes', 'Behind the scenes of a wedding photoshoot', '/videos/reels/raj-bts.mp4', '/images/reels/raj-bts-thumb.jpg', ARRAY['photography', 'behind scenes', 'wedding'], '30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004', 3200, 156, 30),
('Seaside Resort Drone View', 'Stunning aerial view of beachside wedding venue', '/videos/reels/seaside-drone.mp4', '/images/reels/seaside-drone-thumb.jpg', ARRAY['drone', 'beach', 'aerial', 'venue'], '30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 4800, 189, 25);

-- Insert sample reviews
INSERT INTO public.reviews (listing_id, user_id, rating, title, content, is_verified, status, helpful_count) VALUES
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 5, 'Perfect venue for our dream wedding', 'Grand Palace exceeded our expectations. The staff was professional, food was amazing, and the ambiance was perfect for our traditional wedding. Highly recommended!', true, 'approved', 12),
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 4, 'Great venue with minor issues', 'Beautiful venue with excellent facilities. The only issue was parking space during peak hours. Overall a good experience.', true, 'approved', 8),
('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 5, 'Outstanding photography service', 'Raj and his team captured every moment beautifully. The candid shots were amazing and they were very professional throughout the event.', true, 'approved', 15),
('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 5, 'Best photographers in Mumbai', 'Incredible work by Raj Photography. They understood our vision perfectly and delivered beyond expectations. Worth every penny!', true, 'approved', 9);

-- Insert sample moodboards
INSERT INTO public.moodboards (user_id, title, description, is_public, share_token) VALUES
('00000000-0000-0000-0000-000000000002', 'Our Dream Wedding', 'Collection of ideas for our upcoming wedding in December', false, NULL),
('00000000-0000-0000-0000-000000000003', 'Traditional Indian Wedding', 'Traditional ceremony ideas with modern touches', true, 'abc123def456');

-- Insert sample moodboard items
INSERT INTO public.moodboard_items (moodboard_id, item_type, listing_id, inspiration_id, notes, sort_order) VALUES
((SELECT id FROM public.moodboards WHERE title = 'Our Dream Wedding'), 'listing', '30000000-0000-0000-0000-000000000001', NULL, 'Perfect venue for our reception', 1),
((SELECT id FROM public.moodboards WHERE title = 'Our Dream Wedding'), 'listing', '30000000-0000-0000-0000-000000000006', NULL, 'Love their photography style', 2),
((SELECT id FROM public.moodboards WHERE title = 'Traditional Indian Wedding'), 'inspiration', NULL, (SELECT id FROM public.inspiration_posts WHERE title = 'Traditional South Indian Wedding'), 'Color scheme inspiration', 1);

-- Generate scorecards for all listings
SELECT public.recalculate_scorecard(id) FROM public.listings;

-- Insert sample events for analytics
INSERT INTO public.events (user_id, event_type, event_data, listing_id) VALUES
('00000000-0000-0000-0000-000000000002', 'listing_view', '{"source": "search"}', '30000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', 'listing_favorite', '{"collection": "default"}', '30000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000003', 'listing_view', '{"source": "featured"}', '30000000-0000-0000-0000-000000000006'),
('00000000-0000-0000-0000-000000000002', 'search', '{"query": "wedding venues mumbai", "filters": {"city": "Mumbai"}}', NULL);

-- Insert sample favorites
INSERT INTO public.favorites (user_id, listing_id, collection_name, notes) VALUES
('00000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'default', 'Perfect for our reception'),
('00000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000006', 'default', 'Love their portfolio'),
('00000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', 'venues', 'Traditional venue option');

-- Insert sample notifications
INSERT INTO public.notifications (user_id, type, title, message, data, read) VALUES
('00000000-0000-0000-0000-000000000002', 'system', 'Welcome to WedSpace!', 'Start planning your dream wedding with our curated vendors and venues.', '{"welcome": true}', false),
('00000000-0000-0000-0000-000000000004', 'system', 'Profile Verified', 'Your vendor profile has been verified and is now live on WedSpace.', '{"verification": "approved"}', true),
('00000000-0000-0000-0000-000000000005', 'system', 'New Inquiry', 'You have received a new inquiry for your venue.', '{"inquiry_id": "sample"}', false);
