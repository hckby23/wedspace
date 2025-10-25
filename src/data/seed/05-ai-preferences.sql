-- AI Preferences Seed Data for Active Users
-- Diverse preference patterns for testing AI personalization

INSERT INTO ai_preferences (id, user_id, communication_style, language_preference, formality_level, response_length, wedding_style, budget_priority, event_type, preferred_vendors, cultural_traditions, regional_preferences, proactive_suggestions, auto_save_preferences, learning_enabled, share_with_partner, color_preferences, theme_preferences, music_preferences, cuisine_preferences, ai_reminder_frequency, suggestion_timing, data_collection_consent, analytics_enabled, third_party_sharing, preference_version, created_at, updated_at) VALUES

-- Modern tech-savvy couple
('AP000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'friendly', 'en', 4, 'moderate', ARRAY['modern', 'minimalist'], 'balanced', ARRAY['wedding', 'reception'], ARRAY['photographer', 'decorator', 'dj'], ARRAY['hindu'], ARRAY['north_indian'], true, true, true, true, ARRAY['blush', 'gold', 'white'], ARRAY['modern', 'elegant'], ARRAY['bollywood', 'edm'], ARRAY['north_indian', 'continental'], 'moderate', 'immediate', true, true, false, 1, NOW() - INTERVAL '1 month', NOW()),

-- Traditional luxury focused
('AP000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'formal', 'en', 5, 'detailed', ARRAY['traditional', 'grand'], 'luxury', ARRAY['wedding', 'sangeet', 'mehendi'], ARRAY['wedding_planner', 'photographer'], ARRAY['gujarati'], ARRAY['gujarati'], true, true, true, false, ARRAY['red', 'gold'], ARRAY['royal', 'traditional'], ARRAY['gujarati_folk'], ARRAY['gujarati'], 'frequent', 'immediate', true, true, false, 1, NOW() - INTERVAL '2 weeks', NOW()),

-- Budget-conscious practical
('AP000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'casual', 'mixed', 3, 'brief', ARRAY['modern'], 'value', ARRAY['wedding'], ARRAY['photographer'], ARRAY['hindu'], ARRAY['south_indian'], true, true, true, true, ARRAY['yellow', 'white'], ARRAY['simple'], ARRAY['tamil'], ARRAY['south_indian'], 'minimal', 'batched', true, true, false, 1, NOW() - INTERVAL '3 days', NOW()),

-- Destination wedding luxury
('AP000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'friendly', 'en', 4, 'detailed', ARRAY['modern', 'fusion'], 'quality', ARRAY['wedding', 'pre_wedding'], ARRAY['wedding_planner', 'photographer'], ARRAY['south_indian'], ARRAY['cosmopolitan'], true, true, true, true, ARRAY['coral', 'turquoise'], ARRAY['beach', 'tropical'], ARRAY['bollywood', 'edm'], ARRAY['multi_cuisine'], 'moderate', 'immediate', true, true, false, 1, NOW() - INTERVAL '4 months', NOW()),

-- Eco-conscious minimalist
('AP000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'friendly', 'en', 3, 'moderate', ARRAY['minimalist'], 'balanced', ARRAY['wedding'], ARRAY['photographer', 'decorator'], ARRAY['maharashtrian'], ARRAY['maharashtrian'], true, true, true, true, ARRAY['green', 'white'], ARRAY['eco_friendly', 'garden'], ARRAY['classical'], ARRAY['maharashtrian'], 'minimal', 'batched', true, true, false, 1, NOW() - INTERVAL '5 months', NOW());
