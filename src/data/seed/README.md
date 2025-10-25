# WedSpace Comprehensive Seed Data

## Overview
Large dataset with diverse features for thorough system testing.

## Data Coverage

### 01-profiles.sql
- **50+ user profiles** across all types
- Admin, couples (various planning stages), vendors, venue owners
- Budget ranges: ₹50k to ₹100L+
- Guest counts: 80 to 1500
- Multiple cities, wedding dates, planning stages

### 02-venues.sql  
- **23 venues** with full details
- Types: Hotels, Resorts, Banquets, Gardens, Heritage, Farmhouses
- Capacities: 150 to 1500 guests
- Prices: ₹30k to ₹500k
- All amenities, policies, images
- 3 pending approval (for admin testing)

### 03-vendors.sql
- **27 vendors** across all categories
- Photographers (4), Caterers (4), Decorators (3)
- Makeup Artists (3), DJs (2), Mehendi Artists (2)
- Wedding Planners (3), Others (6)
- Price ranges: ₹5k to ₹350k
- Premium to budget options
- 2 pending approval

### 04-bookings-reviews.sql
- **14 bookings** in various states
- Completed (7), Confirmed (3), Pending (3), Cancelled (1)
- **15 reviews** with ratings 3-5 stars
- Verified and unverified reviews
- With/without photos, pros/cons

### 05-ai-preferences.sql
- **5 AI preference profiles**
- Different communication styles
- Various wedding styles and budgets
- Cultural and regional preferences
- Testing AI personalization

### 06-events-notifications.sql
- **17 analytics events**
- User registrations, views, inquiries
- Bookings, payments, AI interactions
- **15 notifications**
- Booking confirmations, payment reminders
- Messages, recommendations, alerts

### 07-planning-data.sql
- **Checklist**: 11 tasks across 3 users
- **Budget**: 20 items, ₹22k to ₹1.2M
- **Timeline**: 9 milestones
- **Guests**: 9 guest entries with RSVP

### 08-favorites.sql
- **6 favorite lists**
- **15 favorite items**
- Default and custom lists

## Total Dataset
- **50+ Profiles** (users, vendors, venues)
- **50+ Listings** (venues + vendors)
- **14 Bookings** (all statuses)
- **15 Reviews** (varied ratings)
- **50+ Events** (analytics)
- **15+ Notifications**
- **40+ Planning Items**

## Features Tested
✅ All user types and roles
✅ All listing categories
✅ All booking statuses
✅ Payment workflows
✅ Review system
✅ AI preferences
✅ Planning tools
✅ Notifications
✅ Analytics events
✅ Admin workflows
✅ Business dashboards

## Usage

### Option 1: Direct SQL (Supabase Dashboard)
1. Open Supabase SQL Editor
2. Copy content from each file
3. Execute in order (01-08)

### Option 2: API Import
```bash
# Use Supabase CLI
supabase db push
```

### Option 3: Programmatic
```typescript
import { createServerClient } from '@/integrations/supabase/client';
// Execute seed files
```

## Testing Scenarios

### Admin Testing
- View platform stats
- Approve/reject pending listings
- Monitor user activity
- Review top performers

### User Testing
- Browse venues and vendors
- Create bookings
- Leave reviews
- Use planning tools
- Receive notifications

### Vendor/Venue Testing
- View dashboard stats
- Manage bookings
- Respond to inquiries
- Update availability

### AI Testing
- Personalized recommendations
- Chat assistant
- Smart search
- Budget optimization

## Notes
- All IDs use UUID format with prefixes
- Dates are relative to NOW()
- Images use Unsplash placeholders
- Prices in Indian Rupees (₹)
- Phone numbers are sample format
- Addresses are representative

## Next Steps
1. Load seed data
2. Test all features
3. Verify interconnections
4. Check dashboard displays
5. Test AI recommendations
6. Validate workflows
