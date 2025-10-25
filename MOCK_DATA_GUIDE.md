# Mock Data & Calendar System Guide

## Overview

Mock data has been added to test the calendar system and filtering functionality without requiring a database connection.

## Files Created

### 1. Mock Availability Data
**Location**: `/src/data/mockAvailability.ts`

**Features**:
- Generates 90 days of availability for each venue/vendor
- Random booking/blocking status (15% booked, 5% blocked)
- Weekend pricing (30% higher)
- Urgency indicators based on availability percentage

**Usage**:
```tsx
import { getMockAvailability, getUrgencyInfo } from '@/data/mockAvailability';

// Get availability for a venue
const availability = getMockAvailability('1'); // venue ID

// Get urgency info
const urgency = getUrgencyInfo('1');
console.log(urgency.message); // "Only 25 dates left!"
```

### 2. Mock Vendors Data
**Location**: `/src/data/mockVendors.ts`

**Includes**:
- 6 vendors across different categories
- Photography, Decoration, Catering, Entertainment, Makeup, Videography
- Full contact info, portfolio images, services offered
- Rating and review counts

**Filter Functions**:
```tsx
import { 
  MOCK_VENDORS,
  filterVendorsByCategory,
  filterVendorsByCity,
  searchVendors,
  getVendorCategories,
  getVendorCities
} from '@/data/mockVendors';

// Filter by category
const photographers = filterVendorsByCategory('Photography');

// Search
const results = searchVendors('makeup');

// Get all categories
const categories = getVendorCategories();
```

### 3. Enhanced Venues Data
**Location**: `/src/data/venues.ts`

**Added**:
- TypeScript interface for Venue type
- Filter and search utilities
- City and tag extraction functions

**Filter Functions**:
```tsx
import { 
  FEATURED_VENUES,
  filterVenuesByCity,
  filterVenuesByCapacity,
  filterVenuesByRating,
  searchVenues,
  getVenueCities,
  getVenueTags
} from '@/data/venues';

// Filter by city
const delhiVenues = filterVenuesByCity('Delhi');

// Filter by capacity
const largeVenues = filterVenuesByCapacity(300, 1000);

// Search
const results = searchVenues('luxury hotel');
```

## Demo Page

### Calendar Demo Page
**Location**: `/src/app/demo/calendar/page.tsx`

**Features**:
- ✅ Search venues and vendors
- ✅ Filter by city/category
- ✅ View availability calendar (30 days)
- ✅ Urgency indicators
- ✅ Date selection with status display
- ✅ Responsive grid layout
- ✅ Dark mode support

**Access**: Navigate to `/demo/calendar`

**How it works**:
1. Search or filter venues/vendors
2. Click on a card to select
3. View 30-day availability calendar
4. Click dates to see details
5. Color-coded status (green=available, red=booked, gray=blocked)

## Mock Data Structure

### Availability Slot
```typescript
{
  id: string;
  venue_id?: string;
  vendor_id?: string;
  date: string; // ISO format
  status: 'available' | 'booked' | 'blocked' | 'pending';
  price_override: number | null; // Weekend pricing
  booking_id: string | null;
  notes: string | null;
}
```

### Urgency Info
```typescript
{
  availableCount: number;
  totalCount: number;
  bookedCount: number;
  urgencyLevel: 'low' | 'medium' | 'high';
  message: string; // "Only 25 dates left!"
}
```

## Integration Examples

### 1. Add Calendar to Venue Detail Page

```tsx
import { getMockAvailability, getUrgencyInfo } from '@/data/mockAvailability';

function VenueDetailPage({ venueId }) {
  const availability = getMockAvailability(venueId);
  const urgency = getUrgencyInfo(venueId);
  
  return (
    <div>
      {urgency && (
        <Badge variant={urgency.urgencyLevel === 'high' ? 'destructive' : 'default'}>
          {urgency.message}
        </Badge>
      )}
      
      <AvailabilityCalendar
        availability={availability.map(slot => ({
          date: slot.date,
          status: slot.status,
          price: slot.price_override
        }))}
      />
    </div>
  );
}
```

### 2. Add Filters to Venues Page

```tsx
import { filterVenuesByCity, getVenueCities } from '@/data/venues';

function VenuesPage() {
  const [selectedCity, setSelectedCity] = useState('all');
  const cities = getVenueCities();
  const venues = filterVenuesByCity(selectedCity);
  
  return (
    <div>
      <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
        <option value="all">All Cities</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      
      <div className="grid grid-cols-3 gap-4">
        {venues.map(venue => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
}
```

### 3. Add Vendor Search

```tsx
import { searchVendors } from '@/data/mockVendors';

function VendorSearch() {
  const [query, setQuery] = useState('');
  const results = searchVendors(query);
  
  return (
    <div>
      <Input
        placeholder="Search vendors..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      <div className="grid grid-cols-3 gap-4">
        {results.map(vendor => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
    </div>
  );
}
```

## Availability Status Colors

```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
    case 'booked':
      return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
    case 'blocked':
      return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
  }
};
```

## Mock Data IDs

### Venues
- `'1'` - The Grand New Delhi
- `'2'` - Jaypee Greens Golf & Spa Resort
- `'3'` - Radisson Blu MBD Hotel
- `'4'` - The Leela Ambience
- `'5'` - ITC Grand Bharat
- `'6'` - Taj Palace

### Vendors
- `'v1'` - Elegant Photography
- `'v2'` - Dream Decorators
- `'v3'` - Royal Caterers
- `'v4'` - Melody Music & DJ
- `'v5'` - Glamour Makeup Studio
- `'v6'` - Cinematic Films

## Testing Checklist

- [✅] Mock availability generates correctly
- [✅] Urgency levels calculate properly
- [✅] Venue filters work (city, capacity, rating)
- [✅] Vendor filters work (category, city)
- [✅] Search functions return correct results
- [✅] Calendar displays 30 days
- [✅] Date selection shows details
- [✅] Dark mode works throughout
- [✅] Responsive on mobile

## Next Steps

1. **Replace with Real Data**: When Supabase is connected, replace mock functions with API calls
2. **Add Real-time Updates**: Use Supabase subscriptions for live availability
3. **Booking Integration**: Connect calendar to booking flow
4. **Price Calculation**: Add dynamic pricing based on date/season
5. **Vendor Availability**: Add time slots for vendors

## Performance Notes

- Mock data is generated once and cached
- Filter functions are optimized with early returns
- Calendar only shows 30 days to limit DOM nodes
- Use React.memo for venue/vendor cards if needed

## Accessibility

- All interactive elements have proper ARIA labels
- Keyboard navigation supported
- Color contrast meets WCAG 2.1 AA standards
- Screen reader friendly status announcements
