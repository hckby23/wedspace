-- Comprehensive User Profiles Seed Data
-- Covers various user types, locations, and wedding stages

-- Admin User
INSERT INTO profiles (id, email, full_name, phone, city, state, user_type, avatar_url, wedding_date, partner_name, budget_range, guest_count, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@wedspace.in', 'Admin User', '+919876543210', 'Mumbai', 'Maharashtra', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', NULL, NULL, NULL, NULL, NOW() - INTERVAL '1 year');

-- Couple Users (Planning Stage)
INSERT INTO profiles (id, email, full_name, phone, city, state, user_type, avatar_url, wedding_date, partner_name, budget_range, guest_count, created_at) VALUES
-- Early Planning
('10000000-0000-0000-0000-000000000001', 'priya.sharma@email.com', 'Priya Sharma', '+919876543211', 'Delhi', 'Delhi', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', NOW() + INTERVAL '12 months', 'Rahul Verma', '1500000-2000000', 300, NOW() - INTERVAL '1 month'),
('10000000-0000-0000-0000-000000000002', 'aarav.patel@email.com', 'Aarav Patel', '+919876543212', 'Ahmedabad', 'Gujarat', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=aarav', NOW() + INTERVAL '10 months', 'Ananya Singh', '2000000-3000000', 400, NOW() - INTERVAL '2 weeks'),
('10000000-0000-0000-0000-000000000003', 'sneha.reddy@email.com', 'Sneha Reddy', '+919876543213', 'Hyderabad', 'Telangana', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha', NOW() + INTERVAL '14 months', 'Karthik Menon', '1000000-1500000', 250, NOW() - INTERVAL '3 days'),

-- Mid Planning
('10000000-0000-0000-0000-000000000004', 'rohit.kumar@email.com', 'Rohit Kumar', '+919876543214', 'Bangalore', 'Karnataka', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohit', NOW() + INTERVAL '6 months', 'Divya Iyer', '3000000-4000000', 500, NOW() - INTERVAL '4 months'),
('10000000-0000-0000-0000-000000000005', 'meera.joshi@email.com', 'Meera Joshi', '+919876543215', 'Pune', 'Maharashtra', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera', NOW() + INTERVAL '5 months', 'Arjun Desai', '2500000-3500000', 350, NOW() - INTERVAL '5 months'),
('10000000-0000-0000-0000-000000000006', 'vikram.singh@email.com', 'Vikram Singh', '+919876543216', 'Jaipur', 'Rajasthan', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram', NOW() + INTERVAL '4 months', 'Kavya Rao', '4000000-5000000', 600, NOW() - INTERVAL '6 months'),

-- Late Planning
('10000000-0000-0000-0000-000000000007', 'anjali.nair@email.com', 'Anjali Nair', '+919876543217', 'Chennai', 'Tamil Nadu', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=anjali', NOW() + INTERVAL '2 months', 'Aditya Pillai', '1800000-2500000', 300, NOW() - INTERVAL '8 months'),
('10000000-0000-0000-0000-000000000008', 'siddharth.mehta@email.com', 'Siddharth Mehta', '+919876543218', 'Kolkata', 'West Bengal', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=siddharth', NOW() + INTERVAL '1 month', 'Isha Chatterjee', '2200000-3000000', 400, NOW() - INTERVAL '10 months'),

-- Budget Conscious
('10000000-0000-0000-0000-000000000009', 'ravi.agarwal@email.com', 'Ravi Agarwal', '+919876543219', 'Lucknow', 'Uttar Pradesh', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ravi', NOW() + INTERVAL '8 months', 'Pooja Gupta', '500000-800000', 200, NOW() - INTERVAL '2 months'),
('10000000-0000-0000-0000-000000000010', 'neha.kapoor@email.com', 'Neha Kapoor', '+919876543220', 'Chandigarh', 'Punjab', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=neha', NOW() + INTERVAL '9 months', 'Kunal Bhatia', '700000-1000000', 180, NOW() - INTERVAL '1 month'),

-- Luxury Segment
('10000000-0000-0000-0000-000000000011', 'aryan.malhotra@email.com', 'Aryan Malhotra', '+919876543221', 'Mumbai', 'Maharashtra', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=aryan', NOW() + INTERVAL '7 months', 'Tara Shah', '8000000-10000000', 800, NOW() - INTERVAL '3 months'),
('10000000-0000-0000-0000-000000000012', 'ishaan.oberoi@email.com', 'Ishaan Oberoi', '+919876543222', 'Delhi', 'Delhi', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ishaan', NOW() + INTERVAL '11 months', 'Natasha Kohli', '6000000-8000000', 700, NOW() - INTERVAL '2 months'),

-- Destination Wedding
('10000000-0000-0000-0000-000000000013', 'karan.khanna@email.com', 'Karan Khanna', '+919876543223', 'Goa', 'Goa', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=karan', NOW() + INTERVAL '13 months', 'Simran Kaur', '3500000-4500000', 250, NOW() - INTERVAL '1 week'),
('10000000-0000-0000-0000-000000000014', 'radhika.das@email.com', 'Radhika Das', '+919876543224', 'Udaipur', 'Rajasthan', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=radhika', NOW() + INTERVAL '15 months', 'Varun Bajaj', '5000000-6000000', 400, NOW() - INTERVAL '4 days'),

-- Small Intimate Weddings
('10000000-0000-0000-0000-000000000015', 'tanvi.saxena@email.com', 'Tanvi Saxena', '+919876543225', 'Indore', 'Madhya Pradesh', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=tanvi', NOW() + INTERVAL '6 months', 'Harsh Jain', '800000-1200000', 80, NOW() - INTERVAL '3 months');

-- Vendor Users
INSERT INTO profiles (id, email, full_name, phone, city, state, user_type, avatar_url, business_name, created_at) VALUES
-- Photographers
('20000000-0000-0000-0000-000000000001', 'studio.frames@email.com', 'Rajesh Kapoor', '+919876543301', 'Mumbai', 'Maharashtra', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=StudioFrames', 'Studio Frames Photography', NOW() - INTERVAL '3 years'),
('20000000-0000-0000-0000-000000000002', 'candid.moments@email.com', 'Amit Shah', '+919876543302', 'Delhi', 'Delhi', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=CandidMoments', 'Candid Moments', NOW() - INTERVAL '5 years'),
('20000000-0000-0000-0000-000000000003', 'pixel.perfect@email.com', 'Priya Malhotra', '+919876543303', 'Bangalore', 'Karnataka', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=PixelPerfect', 'Pixel Perfect Studios', NOW() - INTERVAL '4 years'),

-- Caterers
('20000000-0000-0000-0000-000000000004', 'royal.caterers@email.com', 'Suresh Kumar', '+919876543304', 'Jaipur', 'Rajasthan', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=RoyalCaterers', 'Royal Caterers', NOW() - INTERVAL '10 years'),
('20000000-0000-0000-0000-000000000005', 'spice.garden@email.com', 'Meena Iyer', '+919876543305', 'Chennai', 'Tamil Nadu', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=SpiceGarden', 'Spice Garden Catering', NOW() - INTERVAL '8 years'),
('20000000-0000-0000-0000-000000000006', 'fusion.feast@email.com', 'Rakesh Verma', '+919876543306', 'Pune', 'Maharashtra', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=FusionFeast', 'Fusion Feast', NOW() - INTERVAL '6 years'),

-- Decorators
('20000000-0000-0000-0000-000000000007', 'bloom.events@email.com', 'Kavita Sharma', '+919876543307', 'Hyderabad', 'Telangana', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=BloomEvents', 'Bloom Events & Decor', NOW() - INTERVAL '7 years'),
('20000000-0000-0000-0000-000000000008', 'elegant.affairs@email.com', 'Nikhil Desai', '+919876543308', 'Ahmedabad', 'Gujarat', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=ElegantAffairs', 'Elegant Affairs', NOW() - INTERVAL '9 years'),

-- Makeup Artists
('20000000-0000-0000-0000-000000000009', 'glam.studio@email.com', 'Anita Reddy', '+919876543309', 'Bangalore', 'Karnataka', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=GlamStudio', 'Glam Studio', NOW() - INTERVAL '5 years'),
('20000000-0000-0000-0000-000000000010', 'beauty.bliss@email.com', 'Pooja Singh', '+919876543310', 'Delhi', 'Delhi', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=BeautyBliss', 'Beauty Bliss', NOW() - INTERVAL '6 years'),

-- DJ/Entertainment
('20000000-0000-0000-0000-000000000011', 'beats.unlimited@email.com', 'DJ Rocky', '+919876543311', 'Mumbai', 'Maharashtra', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=BeatsUnlimited', 'Beats Unlimited', NOW() - INTERVAL '4 years'),
('20000000-0000-0000-0000-000000000012', 'rhythm.nation@email.com', 'Arjun Nair', '+919876543312', 'Goa', 'Goa', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=RhythmNation', 'Rhythm Nation Entertainment', NOW() - INTERVAL '3 years'),

-- Mehendi Artists
('20000000-0000-0000-0000-000000000013', 'henna.art@email.com', 'Fatima Khan', '+919876543313', 'Lucknow', 'Uttar Pradesh', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=HennaArt', 'Henna Art by Fatima', NOW() - INTERVAL '5 years'),

-- Wedding Planners
('20000000-0000-0000-0000-000000000014', 'dream.weddings@email.com', 'Rhea Kapoor', '+919876543314', 'Mumbai', 'Maharashtra', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=DreamWeddings', 'Dream Weddings', NOW() - INTERVAL '8 years'),
('20000000-0000-0000-0000-000000000015', 'perfect.events@email.com', 'Varun Malhotra', '+919876543315', 'Delhi', 'Delhi', 'vendor', 'https://api.dicebear.com/7.x/initials/svg?seed=PerfectEvents', 'Perfect Events Co.', NOW() - INTERVAL '10 years');

-- Venue Owners
INSERT INTO profiles (id, email, full_name, phone, city, state, user_type, avatar_url, business_name, created_at) VALUES
('30000000-0000-0000-0000-000000000001', 'grandpalace.hotel@email.com', 'Vikram Mehta', '+919876543401', 'Mumbai', 'Maharashtra', 'venue_owner', 'https://api.dicebear.com/7.x/initials/svg?seed=GrandPalace', 'The Grand Palace Hotel', NOW() - INTERVAL '15 years'),
('30000000-0000-0000-0000-000000000002', 'royal.gardens@email.com', 'Sunita Patel', '+919876543402', 'Ahmedabad', 'Gujarat', 'venue_owner', 'https://api.dicebear.com/7.x/initials/svg?seed=RoyalGardens', 'Royal Gardens Resort', NOW() - INTERVAL '12 years'),
('30000000-0000-0000-0000-000000000003', 'lakeview.resort@email.com', 'Ashok Kumar', '+919876543403', 'Udaipur', 'Rajasthan', 'venue_owner', 'https://api.dicebear.com/7.x/initials/svg?seed=Lakeview', 'Lakeview Palace', NOW() - INTERVAL '20 years'),
('30000000-0000-0000-0000-000000000004', 'paradise.banquet@email.com', 'Ramesh Joshi', '+919876543404', 'Pune', 'Maharashtra', 'venue_owner', 'https://api.dicebear.com/7.x/initials/svg?seed=Paradise', 'Paradise Banquet Hall', NOW() - INTERVAL '10 years'),
('30000000-0000-0000-0000-000000000005', 'heritage.haveli@email.com', 'Madhuri Singh', '+919876543405', 'Jaipur', 'Rajasthan', 'venue_owner', 'https://api.dicebear.com/7.x/initials/svg?seed=Heritage', 'Heritage Haveli', NOW() - INTERVAL '25 years'),
('30000000-0000-0000-0000-000000000006', 'beach.resort@email.com', 'Carlos D''Souza', '+919876543406', 'Goa', 'Goa', 'venue_owner', 'https://api.dicebear.com/7.x/initials/svg?seed=BeachResort', 'Seaside Beach Resort', NOW() - INTERVAL '8 years'),
('30000000-0000-0000-0000-000000000007', 'green.valley@email.com', 'Ravi Sharma', '+919876543407', 'Bangalore', 'Karnataka', 'venue_owner', 'https://api.dicebear.com/7.x/initials/svg?seed=GreenValley', 'Green Valley Convention', NOW() - INTERVAL '7 years'),
('30000000-0000-0000-0000-000000000008', 'skyline.hotel@email.com', 'Deepak Rao', '+919876543408', 'Hyderabad', 'Telangana', 'venue_owner', 'https://api.dicebear.com/7.x/initials/svg?seed=Skyline', 'Skyline Hotel & Banquets', NOW() - INTERVAL '13 years'),
('30000000-0000-0000-0000-000000000009', 'emerald.lawns@email.com', 'Priya Reddy', '+919876543409', 'Chennai', 'Tamil Nadu', 'venue_owner', 'https://api.dicebear.com/7.x/initials/svg?seed=Emerald', 'Emerald Lawns', NOW() - INTERVAL '9 years'),
('30000000-0000-0000-0000-000000000010', 'crystal.palace@email.com', 'Manish Agarwal', '+919876543410', 'Kolkata', 'West Bengal', 'venue_owner', 'https://api.dicebear.com/7.x/initials/svg?seed=Crystal', 'Crystal Palace', NOW() - INTERVAL '18 years');

-- Regular browsing users (not yet planning)
INSERT INTO profiles (id, email, full_name, phone, city, state, user_type, avatar_url, created_at) VALUES
('40000000-0000-0000-0000-000000000001', 'user1@email.com', 'Anika Verma', '+919876543501', 'Mumbai', 'Maharashtra', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=anika', NOW() - INTERVAL '2 weeks'),
('40000000-0000-0000-0000-000000000002', 'user2@email.com', 'Rohan Gupta', '+919876543502', 'Delhi', 'Delhi', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohan', NOW() - INTERVAL '1 week'),
('40000000-0000-0000-0000-000000000003', 'user3@email.com', 'Shreya Kulkarni', '+919876543503', 'Pune', 'Maharashtra', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=shreya', NOW() - INTERVAL '3 days'),
('40000000-0000-0000-0000-000000000004', 'user4@email.com', 'Aditya Menon', '+919876543504', 'Bangalore', 'Karnataka', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=aditya', NOW() - INTERVAL '1 day'),
('40000000-0000-0000-0000-000000000005', 'user5@email.com', 'Diya Patel', '+919876543505', 'Ahmedabad', 'Gujarat', 'couple', 'https://api.dicebear.com/7.x/avataaars/svg?seed=diya', NOW() - INTERVAL '5 hours');
