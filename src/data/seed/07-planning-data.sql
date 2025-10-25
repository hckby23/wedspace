-- Planning Tools Seed Data
-- Checklist, Budget, Timeline, and Guest Management data

-- CHECKLIST TASKS
INSERT INTO checklist_tasks (id, user_id, task_title, task_description, category, priority, status, due_date, assigned_to, notes, created_at, completed_at) VALUES
-- User 1 - Early Planning
('CT000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Book Wedding Venue', 'Research and finalize the perfect venue for our ceremony and reception', 'venue', 'high', 'completed', NOW() + INTERVAL '11 months', 'Priya Sharma', 'Booked Emerald Lawns!', NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '1 week'),
('CT000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Hire Photographer', 'Find a photographer for candid and traditional shots', 'vendors', 'high', 'in_progress', NOW() + INTERVAL '10 months', NULL, 'Shortlisted 3 photographers', NOW() - INTERVAL '2 weeks', NULL),
('CT000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Create Guest List', 'Compile list of family and friends to invite', 'planning', 'medium', 'pending', NOW() + INTERVAL '8 months', 'Rahul Verma', NULL, NOW() - INTERVAL '1 week', NULL),

-- User 4 - Mid Planning
('CT000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'Book Makeup Artist', 'Schedule trial and book bridal makeup', 'vendors', 'high', 'completed', NOW() + INTERVAL '4 months', 'Divya Iyer', 'Booked Glam Studio', NOW() - INTERVAL '3 months', NOW() - INTERVAL '1 month'),
('CT000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000004', 'Finalize Catering Menu', 'Taste testing and menu selection', 'catering', 'high', 'completed', NOW() + INTERVAL '3 months', NULL, 'Menu finalized with Royal Caterers', NOW() - INTERVAL '4 months', NOW() - INTERVAL '2 months'),
('CT000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004', 'Order Wedding Invitations', 'Design and order wedding cards', 'invitations', 'high', 'in_progress', NOW() + INTERVAL '2 months', 'Rohit Kumar', 'Working on design', NOW() - INTERVAL '1 month', NULL),
('CT000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000004', 'Book Accommodation for Guests', 'Reserve hotel rooms for out-of-town guests', 'accommodation', 'medium', 'pending', NOW() + INTERVAL '2 months', NULL, NULL, NOW() - INTERVAL '2 weeks', NULL),

-- User 7 - Late Planning (Urgent tasks)
('CT000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000007', 'Final Venue Walkthrough', 'Check all arrangements at venue', 'venue', 'high', 'pending', NOW() + INTERVAL '1 week', 'Anjali Nair', 'Scheduled for next week', NOW() - INTERVAL '5 days', NULL),
('CT000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000007', 'Confirm RSVP Count', 'Get final headcount from all guests', 'planning', 'high', 'in_progress', NOW() + INTERVAL '3 weeks', NULL, '280 confirmed so far', NOW() - INTERVAL '1 month', NULL),
('CT000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000007', 'Marriage License', 'Complete marriage license paperwork', 'legal', 'high', 'completed', NOW() + INTERVAL '2 weeks', 'Aditya Pillai', 'Documents submitted', NOW() - INTERVAL '1 week', NOW() - INTERVAL '2 days'),
('CT000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000007', 'Pack Honeymoon Bags', 'Prepare luggage for honeymoon trip', 'honeymoon', 'low', 'pending', NOW() + INTERVAL '2 months' + INTERVAL '1 week', NULL, NULL, NOW() - INTERVAL '3 days', NULL);

-- BUDGET ITEMS
INSERT INTO budget_items (id, user_id, category, item_name, estimated_cost, actual_cost, paid_amount, vendor_name, payment_status, due_date, notes, created_at) VALUES
-- User 4 - Detailed Budget Tracking
('BI000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'venue', 'Heritage Resort Booking', 500000, 500000, 500000, 'Lakeview Palace', 'paid', NOW() - INTERVAL '2 months', 'Full payment made', NOW() - INTERVAL '8 months'),
('BI000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004', 'photography', 'Wedding Photography & Videography', 120000, 120000, 80000, 'Candid Moments', 'partial', NOW() + INTERVAL '5 months', 'Balance due before wedding', NOW() - INTERVAL '6 months'),
('BI000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', 'catering', 'Wedding Catering (500 guests)', 750000, 700000, 350000, 'Royal Caterers', 'partial', NOW() + INTERVAL '5 months', 'Advance paid', NOW() - INTERVAL '5 months'),
('BI000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'decoration', 'Floral & Stage Decoration', 250000, 230000, 100000, 'Bloom Events', 'partial', NOW() + INTERVAL '4 months', 'Design finalized', NOW() - INTERVAL '4 months'),
('BI000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000004', 'makeup', 'Bridal Makeup & Hair', 50000, 45000, 45000, 'Glam Studio', 'paid', NOW() + INTERVAL '5 months', 'Includes trial', NOW() - INTERVAL '3 months'),
('BI000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004', 'attire', 'Bridal Lehenga', 300000, 280000, 280000, 'Designer Boutique', 'paid', NULL, 'Custom designed', NOW() - INTERVAL '5 months'),
('BI000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000004', 'attire', 'Groom Sherwani', 80000, 75000, 75000, 'Mens Collection', 'paid', NULL, NULL, NOW() - INTERVAL '4 months'),
('BI000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000004', 'jewelry', 'Bridal Jewelry Set', 400000, 380000, 380000, 'Gold Palace', 'paid', NULL, 'Gold & diamonds', NOW() - INTERVAL '6 months'),
('BI000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000004', 'invitations', 'Wedding Invitations (600)', 60000, 55000, 0, 'Elegant Invites', 'pending', NOW() + INTERVAL '2 months', 'Design approved', NOW() - INTERVAL '2 months'),
('BI000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000004', 'entertainment', 'DJ & Sound System', 80000, 75000, 0, 'Beats Unlimited', 'pending', NOW() + INTERVAL '5 months', NULL, NOW() - INTERVAL '3 months'),
('BI000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000004', 'transportation', 'Wedding Car Rental', 50000, 45000, 0, 'Royal Ride', 'pending', NOW() + INTERVAL '5 months', 'Vintage car booked', NOW() - INTERVAL '2 months'),
('BI000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000004', 'honeymoon', 'Maldives Honeymoon Package', 350000, 320000, 100000, 'Travel Agency', 'partial', NOW() + INTERVAL '6 months', '7 nights package', NOW() - INTERVAL '2 months'),

-- User 9 - Budget Wedding
('BI000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000009', 'venue', 'Community Hall Booking', 30000, 30000, 15000, 'Community Hall', 'partial', NOW() + INTERVAL '7 months', 'Simple venue', NOW() - INTERVAL '1 month'),
('BI000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000009', 'photography', 'Basic Photography', 35000, 35000, 0, 'Budget Clicks', 'pending', NOW() + INTERVAL '7 months', NULL, NOW() - INTERVAL '3 weeks'),
('BI000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000009', 'catering', 'Catering (180 guests)', 108000, 100000, 0, 'Budget Bites', 'pending', NOW() + INTERVAL '7 months', 'Simple menu', NOW() - INTERVAL '2 weeks'),
('BI000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000009', 'decoration', 'Simple Decoration', 25000, 22000, 0, 'Local Decorator', 'pending', NOW() + INTERVAL '7 months', NULL, NOW() - INTERVAL '1 week'),

-- User 11 - Luxury Wedding
('BI000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000011', 'venue', 'Five Star Hotel Ballroom', 1200000, 1200000, 600000, 'Grand Palace Hotel', 'partial', NOW() + INTERVAL '6 months', 'Premium package', NOW() - INTERVAL '2 months'),
('BI000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000011', 'wedding_planner', 'Full Service Wedding Planning', 350000, 350000, 150000, 'Dream Weddings', 'partial', NOW() + INTERVAL '6 months', 'Managing everything', NOW() - INTERVAL '3 months'),
('BI000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000011', 'photography', 'Premium Photo & Video', 250000, 250000, 100000, 'Celebrity Photographer', 'partial', NOW() + INTERVAL '6 months', 'Pre-wedding done', NOW() - INTERVAL '2 months'),
('BI000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000011', 'entertainment', 'Live Band + DJ', 180000, 180000, 0, 'Elite Entertainment', 'pending', NOW() + INTERVAL '6 months', 'Premium package', NOW() - INTERVAL '1 month');

-- TIMELINE MILESTONES
INSERT INTO timeline_milestones (id, user_id, milestone_title, milestone_description, milestone_date, category, status, reminder_before, notes, created_at) VALUES
-- User 1 - Full Timeline
('TM000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Wedding Day', 'The big day!', NOW() + INTERVAL '12 months', 'ceremony', 'pending', 7, 'June wedding', NOW() - INTERVAL '1 month'),
('TM000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Venue Site Visit', 'Final walkthrough at Emerald Lawns', NOW() + INTERVAL '2 months', 'venue', 'pending', 3, NULL, NOW() - INTERVAL '2 weeks'),
('TM000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Photographer Meeting', 'Meet shortlisted photographers', NOW() + INTERVAL '1 month', 'vendors', 'pending', 5, 'Review portfolios', NOW() - INTERVAL '1 week'),
('TM000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Guest List Finalization', 'Complete guest list with addresses', NOW() + INTERVAL '6 months', 'planning', 'pending', 7, NULL, NOW() - INTERVAL '1 week'),

-- User 7 - Near Wedding Date
('TM000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000007', 'Wedding Day', 'Our special day', NOW() + INTERVAL '2 months', 'ceremony', 'pending', 7, NULL, NOW() - INTERVAL '8 months'),
('TM000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000007', 'Mehendi Ceremony', 'Mehendi function at home', NOW() + INTERVAL '2 months' - INTERVAL '2 days', 'pre_wedding', 'pending', 5, NULL, NOW() - INTERVAL '7 months'),
('TM000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007', 'Sangeet Night', 'Sangeet and cocktail party', NOW() + INTERVAL '2 months' - INTERVAL '1 day', 'pre_wedding', 'pending', 5, NULL, NOW() - INTERVAL '7 months'),
('TM000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000007', 'Reception', 'Evening reception', NOW() + INTERVAL '2 months' + INTERVAL '1 day', 'reception', 'pending', 5, NULL, NOW() - INTERVAL '7 months'),
('TM000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000007', 'Bridal Makeup Trial', 'Final makeup trial', NOW() + INTERVAL '2 weeks', 'preparation', 'pending', 3, NULL, NOW() - INTERVAL '1 week');

-- GUEST LIST
INSERT INTO guests (id, user_id, guest_name, guest_category, email, phone, address, invited_events, rsvp_status, guest_count, dietary_restrictions, accommodation_needed, notes, created_at) VALUES
-- User 4 - Comprehensive Guest List
('G0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Sharma Family', 'family', 'sharma.family@email.com', '+919876500001', 'Delhi', ARRAY['wedding', 'sangeet', 'reception'], 'confirmed', 5, ARRAY['vegetarian'], true, 'Bride side relatives', NOW() - INTERVAL '5 months'),
('G0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004', 'Kumar Family', 'family', 'kumar.family@email.com', '+919876500002', 'Mumbai', ARRAY['wedding', 'reception'], 'confirmed', 4, ARRAY[], true, 'Groom side relatives', NOW() - INTERVAL '5 months'),
('G0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', 'College Friends Group', 'friends', NULL, NULL, 'Bangalore', ARRAY['sangeet', 'wedding', 'reception'], 'confirmed', 8, ARRAY['non_veg'], false, 'Close college friends', NOW() - INTERVAL '4 months'),
('G0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'Office Colleagues', 'colleagues', NULL, NULL, 'Bangalore', ARRAY['reception'], 'pending', 12, ARRAY[], false, 'Current colleagues', NOW() - INTERVAL '3 months'),
('G0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000004', 'Neighbor Aunty', 'neighbors', 'neighbor@email.com', '+919876500005', 'Bangalore', ARRAY['wedding'], 'confirmed', 2, ARRAY['jain_vegetarian'], false, NULL, NOW() - INTERVAL '2 months'),

-- User 7 - Final RSVP Tracking
('G0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000007', 'Nair Family', 'family', 'nair@email.com', '+919876500010', 'Kerala', ARRAY['wedding', 'reception'], 'confirmed', 6, ARRAY['vegetarian'], true, NULL, NOW() - INTERVAL '7 months'),
('G0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007', 'School Friends', 'friends', NULL, NULL, 'Chennai', ARRAY['wedding'], 'confirmed', 5, ARRAY[], false, NULL, NOW() - INTERVAL '6 months'),
('G0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000007', 'Distant Relatives', 'family', NULL, NULL, 'Tamil Nadu', ARRAY['reception'], 'declined', 0, ARRAY[], false, 'Unable to attend', NOW() - INTERVAL '5 months'),
('G0000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000007', 'Boss and Team', 'colleagues', NULL, NULL, 'Chennai', ARRAY['reception'], 'confirmed', 4, ARRAY[], false, NULL, NOW() - INTERVAL '4 months');
