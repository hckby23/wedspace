-- Comprehensive Bookings and Reviews Seed Data
-- Various booking states, review types, and payment statuses

-- COMPLETED BOOKINGS WITH REVIEWS
INSERT INTO bookings (id, user_id, listing_id, event_date, guest_count, event_type, status, base_amount, additional_services, discount_amount, tax_amount, final_price, commission_amount, payment_status, advance_paid, balance_due, booking_notes, created_at, confirmed_at, completed_at) VALUES
-- Luxury venue booking
('B0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'V0000000-0000-0000-0000-000000000003', NOW() - INTERVAL '2 months', 450, 'wedding', 'completed', 500000, JSONB_BUILD_OBJECT('decor', 50000, 'catering', 200000), 0, 135000, 885000, 88500, 'paid', 300000, 0, 'Beautiful heritage venue, everything was perfect!', NOW() - INTERVAL '8 months', NOW() - INTERVAL '7 months', NOW() - INTERVAL '2 months'),

('B0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000006', 'V0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 months', 800, 'wedding', 'completed', 300000, JSONB_BUILD_OBJECT('valet', 20000, 'lighting', 30000), 15000, 95500, 430500, 43050, 'paid', 150000, 0, 'Grand celebration, guests loved it', NOW() - INTERVAL '10 months', NOW() - INTERVAL '9 months', NOW() - INTERVAL '3 months'),

-- Photography bookings
('B0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000007', 'VD000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 month', 300, 'wedding', 'completed', 85000, JSONB_BUILD_OBJECT('album', 15000, 'drone', 10000), 0, 19800, 129800, 12980, 'paid', 50000, 0, 'Amazing photography team', NOW() - INTERVAL '6 months', NOW() - INTERVAL '5 months', NOW() - INTERVAL '1 month'),

('B0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000011', 'VD000000-0000-0000-0000-000000000002', NOW() - INTERVAL '4 months', 600, 'wedding', 'completed', 120000, JSONB_BUILD_OBJECT('pre_wedding', 30000, 'album', 20000), 0, 30600, 200600, 20060, 'paid', 80000, 0, 'Best decision for our wedding', NOW() - INTERVAL '9 months', NOW() - INTERVAL '8 months', NOW() - INTERVAL '4 months'),

-- Catering bookings
('B0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'VD000000-0000-0000-0000-000000000005', NOW() - INTERVAL '2 months', 350, 'wedding', 'completed', 525000, JSONB_BUILD_OBJECT('live_counters', 50000), 25000, 99000, 649000, 64900, 'paid', 250000, 0, 'Food was delicious, guests raved about it', NOW() - INTERVAL '7 months', NOW() - INTERVAL '6 months', NOW() - INTERVAL '2 months'),

-- Decorator bookings
('B0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000012', 'VD000000-0000-0000-0000-000000000009', NOW() - INTERVAL '3 months', 700, 'wedding', 'completed', 200000, JSONB_BUILD_OBJECT('additional_flowers', 30000), 0, 41400, 271400, 27140, 'paid', 100000, 0, 'Stunning decoration, exceeded expectations', NOW() - INTERVAL '8 months', NOW() - INTERVAL '7 months', NOW() - INTERVAL '3 months'),

-- Budget venue booking
('B0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000009', 'V0000000-0000-0000-0000-000000000011', NOW() - INTERVAL '1 month', 180, 'wedding', 'completed', 30000, JSONB_BUILD_OBJECT('chairs', 5000), 0, 6300, 41300, 4130, 'paid', 20000, 0, 'Good value for money', NOW() - INTERVAL '5 months', NOW() - INTERVAL '4 months', NOW() - INTERVAL '1 month'),

-- CONFIRMED UPCOMING BOOKINGS
('B0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', 'V0000000-0000-0000-0000-000000000008', NOW() + INTERVAL '6 months', 300, 'wedding', 'confirmed', 120000, JSONB_BUILD_OBJECT('lighting', 15000), 0, 24300, 159300, 15930, 'partial', 80000, 79300, 'Excited for the garden venue!', NOW() - INTERVAL '1 month', NOW() - INTERVAL '3 weeks', NULL),

('B0000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000002', 'VD000000-0000-0000-0000-000000000003', NOW() + INTERVAL '4 months', 400, 'wedding', 'confirmed', 75000, JSONB_BUILD_OBJECT('pre_wedding', 25000), 5000, 17100, 112100, 11210, 'partial', 50000, 62100, 'Looking forward to the shoot', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '1 week', NULL),

('B0000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000003', 'V0000000-0000-0000-0000-000000000017', NOW() + INTERVAL '8 months', 750, 'wedding', 'confirmed', 450000, JSONB_BUILD_OBJECT('folk_show', 50000, 'extra_decorations', 30000), 0, 95400, 625400, 62540, 'partial', 250000, 375400, 'Royal palace wedding dreams coming true', NOW() - INTERVAL '1 week', NOW() - INTERVAL '4 days', NULL),

-- PENDING BOOKINGS
('B0000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000013', 'V0000000-0000-0000-0000-000000000005', NOW() + INTERVAL '9 months', 250, 'wedding', 'pending', 400000, JSONB_BUILD_OBJECT('beach_setup', 40000), 0, 79200, 519200, 51920, 'pending', 0, 519200, 'Waiting for venue confirmation', NOW() - INTERVAL '2 days', NULL, NULL),

('B0000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000014', 'VD000000-0000-0000-0000-000000000019', NOW() + INTERVAL '10 months', 400, 'wedding', 'pending', 250000, NULL, 0, 45000, 295000, 29500, 'pending', 0, 295000, 'Inquiry about full planning package', NOW() - INTERVAL '1 day', NULL, NULL),

('B0000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000015', 'VD000000-0000-0000-0000-000000000012', NOW() + INTERVAL '3 months', 80, 'engagement', 'pending', 45000, JSONB_BUILD_OBJECT('trial', 5000), 0, 9000, 59000, 5900, 'pending', 0, 59000, 'Checking availability', NOW() - INTERVAL '5 hours', NULL, NULL),

-- CANCELLED BOOKINGS
('B0000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000010', 'V0000000-0000-0000-0000-000000000006', NOW() + INTERVAL '5 months', 500, 'wedding', 'cancelled', 150000, NULL, 0, 27000, 177000, 17700, 'refunded', 75000, 0, 'Had to change date, venue not available', NOW() - INTERVAL '3 months', NOW() - INTERVAL '2 months', NULL);

-- REVIEWS FOR COMPLETED BOOKINGS
INSERT INTO reviews (id, listing_id, user_id, booking_id, rating, title, review_text, pros, cons, photos, verified_booking, helpful_count, created_at) VALUES
-- Venue Reviews
('R0000000-0000-0000-0000-000000000001', 'V0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', 'B0000000-0000-0000-0000-000000000001', 5, 'Dream Wedding at Lakeview Palace', 'Absolutely stunning heritage venue! The palace provided a royal ambiance that made our wedding truly magical. The staff was professional, the lake view was breathtaking, and our guests are still talking about it. Worth every penny!', ARRAY['Heritage architecture', 'Lake view', 'Professional staff', 'Beautiful courtyards', 'Excellent food'], ARRAY['A bit expensive'], ARRAY['https://images.unsplash.com/photo-1519167758481-83f29da8c0f7'], true, 24, NOW() - INTERVAL '1 month' + INTERVAL '15 days'),

('R0000000-0000-0000-0000-000000000002', 'V0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006', 'B0000000-0000-0000-0000-000000000002', 5, 'Perfect Grand Celebration', 'The Grand Palace Hotel exceeded all expectations! The banquet hall was spacious and elegant, the valet service was smooth, and the coordination was flawless. Highly recommend for large weddings.', ARRAY['Spacious hall', 'Valet parking', 'Professional coordination', 'Great location', 'AC facilities'], ARRAY[], ARRAY['https://images.unsplash.com/photo-1519167758481-83f29da8c0f7'], true, 18, NOW() - INTERVAL '2 months' + INTERVAL '20 days'),

('R0000000-0000-0000-0000-000000000003', 'V0000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000009', 'B0000000-0000-0000-0000-000000000007', 4, 'Good Budget Option', 'Simple venue perfect for our intimate wedding. The hall was clean and well-maintained. While it lacks luxury amenities, it served our purpose well within our budget.', ARRAY['Affordable', 'Clean', 'Good location', 'Cooperative staff'], ARRAY['Basic facilities', 'Limited parking'], NULL, true, 12, NOW() - INTERVAL '3 weeks'),

-- Vendor Reviews
('R0000000-0000-0000-0000-000000000004', 'VD000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000007', 'B0000000-0000-0000-0000-000000000003', 5, 'Studio Frames - Best Photography Team!', 'The team from Studio Frames was absolutely amazing! They captured every emotion beautifully. The candid shots are stunning, and the pre-wedding shoot was creative. The drone footage added a cinematic touch. Highly professional and worth the investment!', ARRAY['Creative shots', 'Professional team', 'Quick delivery', 'Great communication', 'Drone coverage'], ARRAY[], ARRAY['https://images.unsplash.com/photo-1606216794074-735e91aa2c92'], true, 31, NOW() - INTERVAL '3 weeks'),

('R0000000-0000-0000-0000-000000000005', 'VD000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000011', 'B0000000-0000-0000-0000-000000000004', 5, 'Candid Moments - Award Worthy Work', 'Candid Moments truly lives up to their name! The documentary style photography captured our wedding story beautifully. Every moment was preserved naturally. The quality of work is international standard. Best decision we made!', ARRAY['Documentary style', 'Natural shots', 'High quality', 'Professional editing', 'Instagram reels'], ARRAY['Premium pricing'], ARRAY['https://images.unsplash.com/photo-1519741497674-611481863552'], true, 28, NOW() - INTERVAL '3 months' + INTERVAL '10 days'),

('R0000000-0000-0000-0000-000000000006', 'VD000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'B0000000-0000-0000-0000-000000000005', 5, 'Royal Caterers - Food Was Exceptional', 'The food quality and service from Royal Caterers was outstanding! Authentic Rajasthani cuisine that our guests absolutely loved. The live counters were a hit, and the presentation was beautiful. Definitely recommend for anyone wanting authentic flavors.', ARRAY['Delicious food', 'Live counters', 'Professional service', 'Clean setup', 'Variety of dishes'], ARRAY[], NULL, true, 22, NOW() - INTERVAL '1 month' + INTERVAL '25 days'),

('R0000000-0000-0000-0000-000000000007', 'VD000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000012', 'B0000000-0000-0000-0000-000000000006', 5, 'Bloom Events - Decoration Beyond Imagination', 'Bloom Events transformed our venue into a fairytale! The floral arrangements were exquisite, and the lighting created the perfect ambiance. Every detail was thoughtfully designed. Our mandap was absolutely stunning!', ARRAY['Beautiful florals', 'Creative design', 'Perfect lighting', 'Attention to detail', 'Professional team'], ARRAY[], ARRAY['https://images.unsplash.com/photo-1519225421980-715cb0215aed'], true, 26, NOW() - INTERVAL '2 months' + INTERVAL '15 days'),

-- Mixed Reviews
('R0000000-0000-0000-0000-000000000008', 'V0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002', NULL, 4, 'Beautiful Garden Venue', 'Emerald Lawns is a beautiful venue with well-maintained gardens. The fairy lights in the evening created a romantic atmosphere. Only issue was parking could have been better organized during peak hours.', ARRAY['Beautiful garden', 'Fairy lights', 'Good stage setup', 'Cooperative staff'], ARRAY['Parking management', 'Can get warm in summer'], NULL, false, 8, NOW() - INTERVAL '2 weeks'),

('R0000000-0000-0000-0000-000000000009', 'VD000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000001', NULL, 4, 'Good DJ Service', 'Beats Unlimited provided good music and sound quality. The DJ was responsive to requests, though we felt the lighting could have been more elaborate for the price point.', ARRAY['Good music selection', 'Professional DJ', 'Quality sound', 'Responsive'], ARRAY['Lighting could be better', 'Setup time was long'], NULL, false, 5, NOW() - INTERVAL '1 week'),

-- Critical but Fair Reviews
('R0000000-0000-0000-0000-000000000010', 'V0000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000001', NULL, 3, 'Average Experience at Paradise Banquet', 'The venue itself is decent but we faced coordination issues. The AC was not working properly in one section, and the catering service was delayed. The management did try to resolve issues but it affected our event flow.', ARRAY['Good location', 'Decent hall size'], ARRAY['Poor AC in some areas', 'Coordination issues', 'Delayed service'], NULL, false, 3, NOW() - INTERVAL '4 days'),

-- Positive Reviews from Different Users
('R0000000-0000-0000-0000-000000000011', 'VD000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000003', NULL, 5, 'Glam Studio Made Me Look Gorgeous', 'Best bridal makeup! I felt like a queen. The makeup lasted the entire day and looked flawless in photos. The hairstyling was also perfect. Thank you Glam Studio!', ARRAY['Flawless makeup', 'Great hairstyling', 'Long lasting', 'Professional', 'Friendly artist'], ARRAY[], ARRAY['https://images.unsplash.com/photo-1487412947147-5cebf100ffc2'], false, 15, NOW() - INTERVAL '10 days'),

('R0000000-0000-0000-0000-000000000012', 'VD000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000004', NULL, 5, 'Intricate Mehendi Designs', 'Fatima created the most beautiful mehendi on my hands! The design was intricate and elegant. The color came out dark and lasted for weeks. Everyone complimented my mehendi!', ARRAY['Intricate designs', 'Dark color', 'Professional', 'Quick work', 'Beautiful patterns'], ARRAY[], ARRAY['https://images.unsplash.com/photo-1610484969794-42e1d7e4a2db'], false, 11, NOW() - INTERVAL '5 days'),

('R0000000-0000-0000-0000-000000000013', 'V0000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000005', NULL, 5, 'Hilltop Manor - Spectacular Views', 'The hilltop location provides breathtaking panoramic views. Perfect for a destination wedding. The villa is luxurious and well-maintained. The pool area is beautiful!', ARRAY['Stunning views', 'Luxury villa', 'Great location', 'Beautiful pool', 'Privacy'], ARRAY['Bit remote'], NULL, false, 9, NOW() - INTERVAL '2 days'),

('R0000000-0000-0000-0000-000000000014', 'VD000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000008', NULL, 5, 'Dream Weddings Planned Everything Perfectly', 'Hiring Dream Weddings was the best decision! They handled everything from vendor coordination to timeline management. We could enjoy our wedding stress-free. Highly professional team!', ARRAY['Full service', 'Professional team', 'Vendor coordination', 'Stress-free planning', 'Budget management'], ARRAY[], NULL, false, 19, NOW() - INTERVAL '1 week'),

('R0000000-0000-0000-0000-000000000015', 'VD000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000010', NULL, 4, 'Fusion Feast - Unique Menu', 'Amazing fusion catering! The menu was creative and delicious. Guests loved the variety. The molecular gastronomy station was a hit. A bit pricey but worth it for the unique experience.', ARRAY['Creative menu', 'Delicious food', 'Live stations', 'Presentation', 'Unique offerings'], ARRAY['Premium pricing'], NULL, false, 7, NOW() - INTERVAL '3 days');
