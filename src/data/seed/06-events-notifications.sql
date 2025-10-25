-- Events and Notifications Seed Data
-- Analytics events and user notifications for testing

-- ANALYTICS EVENTS
INSERT INTO events (id, user_id, listing_id, event_type, event_data, created_at) VALUES
-- User registration events
('E0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', NULL, 'user_registered', '{"source": "google", "device": "mobile"}', NOW() - INTERVAL '1 month'),
('E0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', NULL, 'user_registered', '{"source": "facebook", "device": "desktop"}', NOW() - INTERVAL '2 weeks'),

-- Listing views
('E0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'V0000000-0000-0000-0000-000000000001', 'listing_viewed', '{"duration": 45, "source": "search"}', NOW() - INTERVAL '5 days'),
('E0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'V0000000-0000-0000-0000-000000000003', 'listing_viewed', '{"duration": 120, "source": "recommendations"}', NOW() - INTERVAL '3 days'),
('E0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'VD000000-0000-0000-0000-000000000001', 'listing_viewed', '{"duration": 60, "source": "search"}', NOW() - INTERVAL '2 days'),

-- Inquiries sent
('E0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'V0000000-0000-0000-0000-000000000008', 'inquiry_sent', '{"message_length": 150}', NOW() - INTERVAL '1 month'),
('E0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', 'VD000000-0000-0000-0000-000000000003', 'inquiry_sent', '{"message_length": 200}', NOW() - INTERVAL '2 weeks'),

-- Bookings created
('E0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', 'V0000000-0000-0000-0000-000000000008', 'booking_created', '{"amount": 159300, "advance": 80000}', NOW() - INTERVAL '1 month'),
('E0000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000002', 'VD000000-0000-0000-0000-000000000003', 'booking_created', '{"amount": 112100, "advance": 50000}', NOW() - INTERVAL '2 weeks'),

-- Payments completed
('E0000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000004', 'V0000000-0000-0000-0000-000000000003', 'payment_completed', '{"amount": 885000, "payment_method": "razorpay"}', NOW() - INTERVAL '2 months'),
('E0000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000007', 'VD000000-0000-0000-0000-000000000001', 'payment_completed', '{"amount": 129800, "payment_method": "bank_transfer"}', NOW() - INTERVAL '1 month'),

-- AI assistant interactions
('E0000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000001', NULL, 'ai_assistant_query', '{"query": "Find venues under 2 lakhs", "response_time": 1200}', NOW() - INTERVAL '3 days'),
('E0000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000003', NULL, 'ai_assistant_query', '{"query": "Budget breakdown advice", "response_time": 800}', NOW() - INTERVAL '1 day'),

-- Reviews submitted
('E0000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000004', 'V0000000-0000-0000-0000-000000000003', 'review_submitted', '{"rating": 5, "has_photos": true}', NOW() - INTERVAL '1 month' + INTERVAL '15 days'),
('E0000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000007', 'VD000000-0000-0000-0000-000000000001', 'review_submitted', '{"rating": 5, "has_photos": true}', NOW() - INTERVAL '3 weeks'),

-- Favorites added
('E0000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000001', 'V0000000-0000-0000-0000-000000000001', 'favorite_added', '{}', NOW() - INTERVAL '1 week'),
('E0000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000002', 'VD000000-0000-0000-0000-000000000002', 'favorite_added', '{}', NOW() - INTERVAL '5 days');

-- NOTIFICATIONS
INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at) VALUES
-- Booking confirmations
('N0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'booking_confirmed', 'Booking Confirmed!', 'Your booking at Emerald Lawns has been confirmed for your wedding on the selected date.', '{"booking_id": "B0000000-0000-0000-0000-000000000008"}', true, NOW() - INTERVAL '3 weeks'),
('N0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'booking_confirmed', 'Booking Confirmed!', 'Your booking with Pixel Perfect Studios has been confirmed.', '{"booking_id": "B0000000-0000-0000-0000-000000000009"}', true, NOW() - INTERVAL '1 week'),

-- Payment reminders
('N0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'payment_reminder', 'Payment Reminder', 'Your balance payment of ₹79,300 for Emerald Lawns is due in 15 days.', '{"booking_id": "B0000000-0000-0000-0000-000000000008", "amount": 79300}', false, NOW() - INTERVAL '2 days'),
('N0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'payment_reminder', 'Payment Reminder', 'Your balance payment of ₹62,100 for Pixel Perfect Studios is due in 30 days.', '{"booking_id": "B0000000-0000-0000-0000-000000000009", "amount": 62100}', false, NOW() - INTERVAL '1 day'),

-- New messages
('N0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'message_received', 'New Message', 'Emerald Lawns has sent you a message regarding your booking.', '{"sender": "Emerald Lawns"}', false, NOW() - INTERVAL '5 hours'),
('N0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', 'message_received', 'New Message', 'Studio Frames Photography replied to your inquiry.', '{"sender": "Studio Frames"}', false, NOW() - INTERVAL '3 hours'),

-- AI recommendations
('N0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000004', 'ai_recommendation', 'AI Recommendations', 'We found 5 new venues matching your preferences and budget!', '{"recommendation_count": 5}', false, NOW() - INTERVAL '1 day'),
('N0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000005', 'ai_recommendation', 'Smart Suggestions', 'Based on your planning timeline, we suggest booking a photographer soon!', '{"suggestion_type": "timeline"}', false, NOW() - INTERVAL '2 days'),

-- Listing approvals (for vendors/venues)
('N0000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000001', 'listing_approved', 'Listing Approved', 'Your venue "The Grand Palace Hotel" has been approved and is now live!', '{"listing_id": "V0000000-0000-0000-0000-000000000001"}', true, NOW() - INTERVAL '2 years'),
('N0000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000001', 'listing_approved', 'Listing Approved', 'Your vendor profile "Studio Frames Photography" is now active.', '{"listing_id": "VD000000-0000-0000-0000-000000000001"}', true, NOW() - INTERVAL '3 years'),

-- Review responses
('N0000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000004', 'review_response', 'Review Response', 'Lakeview Palace has responded to your review.', '{"review_id": "R0000000-0000-0000-0000-000000000001"}', false, NOW() - INTERVAL '1 week'),

-- Price drops
('N0000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000009', 'price_drop', 'Price Alert!', 'A venue in your favorites has reduced prices by 15%!', '{"listing_id": "V0000000-0000-0000-0000-000000000012"}', false, NOW() - INTERVAL '3 days'),

-- Planning reminders
('N0000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000007', 'planning_reminder', 'Planning Reminder', 'Your wedding is in 2 months! Time to finalize decorations and makeup.', '{"days_remaining": 60}', false, NOW() - INTERVAL '1 day'),
('N0000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000008', 'planning_reminder', 'Action Needed', 'Your wedding is in 1 month! Don't forget to send invitations.', '{"days_remaining": 30}', false, NOW() - INTERVAL '2 hours'),

-- New availability
('N0000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000013', 'availability_alert', 'Venue Available!', 'Good news! Seaside Beach Resort is now available for your preferred date.', '{"listing_id": "V0000000-0000-0000-0000-000000000005"}', false, NOW() - INTERVAL '12 hours');
