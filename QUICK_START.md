# WedSpace - Quick Start Guide

## 🚀 View the Calendar Demo

```bash
npm run dev
# Navigate to: http://localhost:3000/demo/calendar
```

## 📋 What You'll See

### Interactive Features
- ✅ **Search Bar** - Find venues/vendors instantly
- ✅ **City Filter** - Filter venues by location
- ✅ **Category Filter** - Filter vendors by service type
- ✅ **Venue Cards** - Click to view availability
- ✅ **Vendor Cards** - Click to view availability
- ✅ **30-Day Calendar** - Color-coded availability
- ✅ **Urgency Badges** - "Only X dates left!"
- ✅ **Date Details** - Click dates for info

### Color Legend
- 🟢 **Green** = Available
- 🔴 **Red** = Booked
- ⚫ **Gray** = Blocked/Maintenance

## 🎯 Quick Code Examples

### Get Availability
```tsx
import { getMockAvailability, getUrgencyInfo } from '@/data/mockAvailability';

const availability = getMockAvailability('1'); // venue ID
const urgency = getUrgencyInfo('1');
// urgency.message = "Only 25 dates left!"
```

### Filter Venues
```tsx
import { filterVenuesByCity, searchVenues } from '@/data/venues';

const delhiVenues = filterVenuesByCity('Delhi');
const luxuryVenues = searchVenues('luxury');
```

### Filter Vendors
```tsx
import { filterVendorsByCategory } from '@/data/mockVendors';

const photographers = filterVendorsByCategory('Photography');
```

## 📊 Available Mock Data

### Venues (6)
- The Grand New Delhi
- Jaypee Greens Golf & Spa Resort
- Radisson Blu MBD Hotel
- The Leela Ambience
- ITC Grand Bharat
- Taj Palace

### Vendors (6)
- Elegant Photography
- Dream Decorators
- Royal Caterers
- Melody Music & DJ
- Glamour Makeup Studio
- Cinematic Films

## 🔧 Integration Examples

### Add Calendar to Any Page
```tsx
import { getMockAvailability } from '@/data/mockAvailability';

function MyPage({ entityId }) {
  const availability = getMockAvailability(entityId);
  
  return (
    <div className="grid grid-cols-7 gap-2">
      {availability.slice(0, 30).map(slot => (
        <div key={slot.date} className={getStatusColor(slot.status)}>
          {new Date(slot.date).getDate()}
        </div>
      ))}
    </div>
  );
}
```

### Add Urgency Badge
```tsx
import { getUrgencyInfo } from '@/data/mockAvailability';

function VenueCard({ venueId }) {
  const urgency = getUrgencyInfo(venueId);
  
  return (
    <Badge variant={urgency.urgencyLevel === 'high' ? 'destructive' : 'outline'}>
      {urgency.message}
    </Badge>
  );
}
```

### Add Search & Filter
```tsx
import { searchVenues, filterVenuesByCity } from '@/data/venues';

function VenuesList() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('all');
  
  const venues = query 
    ? searchVenues(query)
    : filterVenuesByCity(city);
  
  return (
    <div>
      <Input value={query} onChange={(e) => setQuery(e.target.value)} />
      <select value={city} onChange={(e) => setCity(e.target.value)}>
        <option value="all">All Cities</option>
        {/* ... */}
      </select>
      {venues.map(v => <VenueCard key={v.id} venue={v} />)}
    </div>
  );
}
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `/src/data/mockAvailability.ts` | Availability data & urgency |
| `/src/data/mockVendors.ts` | Vendor data & filters |
| `/src/data/venues.ts` | Venue data & filters |
| `/src/app/demo/calendar/page.tsx` | Demo page |
| `MOCK_DATA_GUIDE.md` | Full documentation |

## ✅ Build Status

```
✓ 91/91 pages built successfully
✓ 0 errors
✓ Demo page at /demo/calendar
```

## 🎨 UI Components Used

- `Card` - Container for venue/vendor cards
- `Badge` - Urgency indicators
- `Input` - Search bar
- `Tabs` - Venue/Vendor switcher
- `Button` - Interactive elements

## 🌙 Dark Mode

All components support dark mode:
- Automatic theme detection
- Proper contrast ratios
- Smooth transitions

## 📱 Responsive

- Mobile-first design
- Grid adapts to screen size
- Touch-friendly interactions

## 🔗 Related Features

- **Chat System** - `/src/components/chat/`
- **Booking Flow** - `/src/components/booking/`
- **AI Search** - `/src/services/EnhancedSearchService.ts`
- **Planning Tools** - `/src/components/planning/`

## 📚 Full Documentation

- `MOCK_DATA_GUIDE.md` - Complete API reference
- `INTEGRATION_GUIDE.md` - Feature integration
- `IMPLEMENTATION_SUMMARY.md` - All features
- `MOCK_DATA_SUMMARY.md` - This implementation

---

**Ready to use!** Start with `/demo/calendar` and explore the mock data system.
