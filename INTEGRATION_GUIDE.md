# Feature Integration Guide

This guide explains how to integrate all the new features into existing pages.

## 1. Chat System Integration

### Venue Detail Page (`/src/app/venues/[id]/page.tsx`)

Add ChatButton component:

```tsx
import ChatButton from '@/components/chat/ChatButton';

// In the component JSX, add alongside other action buttons:
<ChatButton
  listingId={venue.id}
  venueId={venue.id}
  recipientName={venue.name}
  variant="default"
  className="w-full"
/>
```

### Vendor Dashboard (`/src/app/(business)/vendor/dashboard/page.tsx`)

Add Chat Inbox Widget:

```tsx
import ChatInboxWidget from '@/components/dashboard/ChatInboxWidget';

// In the dashboard:
<ChatInboxWidget
  userId={user.id}
  userType="vendor"
  className="col-span-full lg:col-span-1"
/>
```

## 2. AI Search Integration

### Search Page (`/src/app/search/page.tsx`)

Add Image Search capability:

```tsx
import ImageSearchUpload from '@/components/search/ImageSearchUpload';
import { enhancedSearchService } from '@/services/EnhancedSearchService';

// Add image search tab:
<Tabs defaultValue="text">
  <TabsList>
    <TabsTrigger value="text">Text Search</TabsTrigger>
    <TabsTrigger value="image">Image Search</TabsTrigger>
  </TabsList>
  
  <TabsContent value="image">
    <ImageSearchUpload
      onResults={(results) => setSearchResults(results)}
      onError={(error) => console.error(error)}
    />
  </TabsContent>
</Tabs>
```

## 3. Calendar System Integration

### Venue Detail Page - Availability Calendar

```tsx
import { useCalendar } from '@/hooks/useCalendar';
import { AvailabilityCalendar } from '@/components/calendar/AvailabilityCalendar';

// Inside component:
const { availability, urgencyInfo } = useCalendar({
  venueId: venue.id,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
});

// Display calendar:
<AvailabilityCalendar
  availability={availability}
  onDateSelect={(date) => setSelectedDate(date)}
  selectedDate={selectedDate}
/>

// Show urgency badge:
{urgencyInfo && (
  <Badge variant={urgencyInfo.urgencyLevel === 'high' ? 'destructive' : 'default'}>
    {urgencyInfo.message}
  </Badge>
)}
```

## 4. Booking Flow Integration

### Replace old booking modal with StreamlinedBookingFlow:

```tsx
import StreamlinedBookingFlow from '@/components/booking/StreamlinedBookingFlow';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const [showBooking, setShowBooking] = useState(false);

// Booking button:
<Button onClick={() => setShowBooking(true)}>
  Book Now
</Button>

// Booking dialog:
<Dialog open={showBooking} onOpenChange={setShowBooking}>
  <DialogContent className="max-w-3xl">
    <StreamlinedBookingFlow
      listingId={venue.id}
      venueId={venue.id}
      listingName={venue.name}
      basePrice={venue.price}
      onComplete={(bookingId) => {
        setShowBooking(false);
        router.push(`/bookings/${bookingId}`);
      }}
      onCancel={() => setShowBooking(false)}
    />
  </DialogContent>
</Dialog>
```

## 5. Planning Tools - Collaborative Features

### Dashboard Page (`/src/app/dashboard/page.tsx`)

Add Collaborator Manager:

```tsx
import CollaboratorManager from '@/components/planning/CollaboratorManager';

// In dashboard:
<CollaboratorManager
  userId={user.id}
  className="col-span-full lg:col-span-1"
/>
```

## 6. Enhanced Search Bar

### Update SearchBar usage in Header/Hero:

```tsx
import { enhancedSearchService } from '@/services/EnhancedSearchService';

const handleSearch = async (query: string) => {
  const results = await enhancedSearchService.search({ query });
  // Process results
  router.push(`/search?q=${encodeURIComponent(query)}`);
};

<SearchBar
  onSearch={handleSearch}
  placeholderSuggestions={[
    'Wedding venues in Delhi',
    'Beach wedding in Goa',
    'Luxury hotels for weddings'
  ]}
/>
```

## 7. Venue/Vendor Dashboard Enhancements

### Add real-time analytics to business dashboards:

```tsx
// In vendor/venue dashboard:
import { useConversations } from '@/hooks/useChat';
import { useCalendar } from '@/hooks/useCalendar';

const { conversations } = useConversations(userId);
const { availability, urgencyInfo } = useCalendar({
  venueId: venueId,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
});

// Display metrics:
<Card>
  <CardContent>
    <div className="text-2xl font-bold">
      {conversations.filter(c => c.unread_count_vendor > 0).length}
    </div>
    <div className="text-sm text-gray-500">Unread Messages</div>
  </CardContent>
</Card>

<Card>
  <CardContent>
    <div className="text-2xl font-bold">
      {availability.filter(a => a.status === 'available').length}
    </div>
    <div className="text-sm text-gray-500">Available Dates</div>
  </CardContent>
</Card>
```

## Testing Checklist

- [ ] Chat: Can send/receive messages in real-time
- [ ] Search: Image upload returns relevant results
- [ ] Calendar: Shows real-time availability updates
- [ ] Booking: 3-step flow completes successfully
- [ ] Planning: Can invite collaborators
- [ ] Dashboard: Shows live chat inbox
- [ ] Mobile: All features work on mobile devices

## Environment Variables Required

Ensure these are set in `.env.local`:

```env
# Existing
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key

# For AI features
OPENAI_API_KEY=your_openai_key

# For payments
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## Database Setup

Run migrations to create new tables:

```sql
-- Chat tables
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id),
  venue_id UUID REFERENCES venues(id),
  vendor_id UUID REFERENCES vendors(id),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  vendor_user_id UUID REFERENCES auth.users(id),
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  unread_count_user INTEGER DEFAULT 0,
  unread_count_vendor INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id) NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  sender_type TEXT CHECK (sender_type IN ('user', 'vendor')) NOT NULL,
  message_type TEXT DEFAULT 'text',
  content TEXT NOT NULL,
  attachment_url TEXT,
  attachment_type TEXT,
  status TEXT DEFAULT 'sent',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar table
CREATE TABLE availability_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id),
  vendor_id UUID REFERENCES vendors(id),
  listing_id UUID REFERENCES listings(id),
  date DATE NOT NULL,
  time_slot TEXT,
  status TEXT DEFAULT 'available',
  price_override DECIMAL,
  booking_id UUID REFERENCES bookings(id),
  min_guest_count INTEGER,
  max_guest_count INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(venue_id, date, time_slot)
);

-- Shared planning table
CREATE TABLE shared_planning_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  shared_with_email TEXT NOT NULL,
  shared_with_user_id UUID REFERENCES auth.users(id),
  access_level TEXT CHECK (access_level IN ('view', 'edit', 'admin')) DEFAULT 'view',
  invitation_status TEXT CHECK (invitation_status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  invitation_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_chat_conversations_user ON chat_conversations(user_id);
CREATE INDEX idx_chat_conversations_vendor ON chat_conversations(vendor_user_id);
CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX idx_availability_venue_date ON availability_calendar(venue_id, date);
CREATE INDEX idx_shared_planning_user ON shared_planning_access(user_id);
```

## Next Steps

1. **Deploy Database Changes**: Run migrations on production Supabase
2. **Test Each Feature**: Follow testing checklist above
3. **Monitor Performance**: Check React Query cache behavior
4. **Optimize**: Add lazy loading for chat components
5. **Documentation**: Update user-facing docs with new features

## Support

For issues or questions:
- Check existing hooks in `/src/hooks/`
- Review services in `/src/services/`
- Test components in isolation first
- Ensure Supabase real-time is enabled for chat
