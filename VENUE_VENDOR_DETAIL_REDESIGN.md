# Venue & Vendor Detail Pages - Comprehensive Redesign Guide

## Current Status
Both pages exist with functional code but need modernization to match the design system used across other redesigned pages.

## Design Goals

### 1. **Visual Consistency**
- Match red+amber gradient theme
- Full dark mode support with proper contrast
- Consistent card styling with hover effects
- Modern typography with Playfair Display
- Professional spacing and layout

### 2. **Enhanced User Experience**
- Progressive disclosure of information
- Clear CTA hierarchy
- Trust signals prominently displayed
- Mobile-first responsive design
- Smooth transitions and animations

### 3. **Booking Flow Optimization**
- Sticky booking card on desktop
- Quick inquiry form
- Date/guest count selector
- Price transparency
- Availability indicators

## Venue Detail Page Improvements

### Hero Section
**Before**: Basic image gallery with navigation
**After**: 
```tsx
- Full-width hero with gradient overlay
- Professional image grid (1 large + 4 thumbnails)
- Lightbox/modal for full gallery view
- Quick action buttons (Save, Share, Virtual Tour)
- Verified badge with trust indicators
- Rating display with review count
```

### Information Architecture
```
├── Hero (Images + Quick Actions)
├── Title Bar (Name, Location, Rating, Price)
├── Quick Stats (Capacity, Space, Amenities count)
├── Tabs Navigation
│   ├── Overview
│   │   ├── Description
│   │   ├── Key Features (icons + text)
│   │   ├── Amenities Grid
│   │   └── Spaces Breakdown
│   ├── Gallery
│   │   ├── Photo Grid
│   │   ├── 360° Tours
│   │   └── Floor Plans
│   ├── Pricing & Packages
│   │   ├── Package Cards
│   │   ├── What's Included
│   │   ├── Add-ons
│   │   └── Payment Terms
│   ├── Reviews
│   │   ├── Rating Breakdown
│   │   ├── Verified Reviews List
│   │   ├── Photos from Events
│   │   └── Response from Venue
│   ├── Availability
│   │   ├── Calendar View
│   │   ├── Blocked Dates
│   │   ├── Peak/Off-peak Pricing
│   │   └── Booking Timeline
│   └── Location & Policies
│       ├── Interactive Map
│       ├── Directions
│       ├── Parking Info
│       ├── Policies & Rules
│       └── FAQ Accordion
├── Sidebar (Sticky)
│   ├── Booking Card
│   │   ├── Price Display
│   │   ├── Date Selector
│   │   ├── Guest Count
│   │   ├── Event Type
│   │   ├── Estimated Total
│   │   └── CTA Buttons
│   ├── Contact Info
│   │   ├── Phone (Click to Call)
│   │   ├── Email
│   │   └── WhatsApp
│   └── Quick Facts
│       ├── Response Time
│       ├── Booking Lead Time
│       └── Cancellation Policy
└── Related Venues Carousel
```

### Key Components to Add

#### 1. EnhancedGallery Component
```tsx
<EnhancedGallery
  images={venue.images}
  videos={venue.videos}
  virtualTours={venue.virtualTours}
  floorPlans={venue.floorPlans}
/>
```

**Features**:
- Grid layout (1 large + 4 small)
- Click to open lightbox
- Keyboard navigation
- Touch gestures for mobile
- Download button
- Share specific image

#### 2. BookingCard Component (Sticky Sidebar)
```tsx
<Card className="sticky top-24 shadow-xl">
  <CardHeader>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold">₹{price}</span>
      <span className="text-sm text-muted-foreground">/event</span>
    </div>
  </CardHeader>
  <CardContent>
    {/* Date picker */}
    {/* Guest count */}
    {/* Event type dropdown */}
    {/* Estimated total */}
    <Button size="lg" className="w-full">Check Availability</Button>
    <Button size="lg" variant="outline" className="w-full">Send Inquiry</Button>
  </CardContent>
</Card>
```

#### 3. ReviewCard Component
```tsx
<Card className="hover:shadow-lg transition-all">
  <CardContent className="p-6">
    <div className="flex items-start gap-4">
      <Avatar />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-semibold">{reviewerName}</h4>
          {verified && <Badge variant="verified">Verified</Badge>}
        </div>
        <div className="flex items-center gap-1 mb-2">
          <StarRating value={rating} />
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
        <p className="text-sm">{comment}</p>
        {photos && <ReviewPhotos photos={photos} />}
        <div className="flex items-center gap-4 mt-3">
          <Button variant="ghost" size="sm">
            <ThumbsUp className="w-4 h-4 mr-1" /> Helpful ({helpfulCount})
          </Button>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

#### 4. AvailabilityCalendar Component
```tsx
<Card>
  <CardHeader>
    <CardTitle>Check Availability</CardTitle>
  </CardHeader>
  <CardContent>
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={setSelectedDate}
      disabled={blockedDates}
      className="rounded-md border"
    />
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-500 rounded" />
        <span>Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-500 rounded" />
        <span>Booked</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-yellow-500 rounded" />
        <span>Peak Season</span>
      </div>
    </div>
  </CardContent>
</Card>
```

### Dark Mode Considerations
```css
/* Hero Section */
bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900

/* Cards */
bg-white dark:bg-gray-800
border-gray-200 dark:border-gray-700

/* Text */
text-gray-900 dark:text-white
text-gray-600 dark:text-gray-300

/* Interactive Elements */
hover:bg-gray-50 dark:hover:bg-gray-700/50

/* Badges */
bg-green-50 dark:bg-green-900/20
text-green-700 dark:text-green-300
```

## Vendor Detail Page Improvements

### Hero Section
```tsx
- Cover photo with gradient overlay
- Profile picture (circular, large)
- Verification badge
- Rating & reviews count
- Category badges
- Years in business
- Response rate indicator
```

### Information Architecture
```
├── Hero (Cover + Profile)
├── Title Bar (Name, Category, Location, Rating)
├── Quick Stats (Projects, Response Time, Starting Price)
├── Tabs Navigation
│   ├── Overview
│   │   ├── Bio/Description
│   │   ├── Services Offered
│   │   ├── Specializations
│   │   ├── Service Areas
│   │   └── Work Hours
│   ├── Portfolio
│   │   ├── Photo Gallery (Masonry)
│   │   ├── Video Reels
│   │   ├── Before/After (if applicable)
│   │   └── Category Filters
│   ├── Packages & Pricing
│   │   ├── Package Cards
│   │   │   ├── Package Name
│   │   │   ├── Price
│   │   │   ├── Inclusions List
│   │   │   ├── Delivery Time
│   │   │   └── CTA Button
│   │   ├── Add-ons & Extras
│   │   └── Custom Package Inquiry
│   ├── Reviews & Testimonials
│   │   ├── Rating Breakdown by Category
│   │   │   ├── Quality
│   │   │   ├── Professionalism
│   │   │   ├── Value for Money
│   │   │   └── Communication
│   │   ├── Verified Reviews
│   │   ├── Photo Reviews
│   │   └── Vendor Responses
│   └── FAQs & Policies
│       ├── Common Questions
│       ├── Booking Process
│       ├── Cancellation Policy
│       ├── Payment Terms
│       └── Travel Charges
├── Sidebar (Sticky)
│   ├── Contact Card
│   │   ├── Send Inquiry Button
│   │   ├── Call Now Button
│   │   ├── WhatsApp Button
│   │   └── Response Time Indicator
│   ├── Quick Info
│   │   ├── Experience
│   │   ├── Team Size
│   │   ├── Projects Completed
│   │   └── Availability This Month
│   └── Trust Indicators
│       ├── Verified Badge
│       ├── Insurance Info
│       ├── Awards
│       └── Certifications
└── Related Vendors Carousel
```

### Key Components to Add

#### 1. VendorHeader Component
```tsx
<div className="relative">
  {/* Cover Photo */}
  <div className="h-64 bg-gradient-to-br from-red-600 via-rose-500 to-amber-500">
    {coverImage && <img src={coverImage} className="w-full h-full object-cover" />}
  </div>
  
  {/* Profile Section */}
  <div className="max-w-7xl mx-auto px-4 -mt-20">
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Avatar className="w-32 h-32 border-4 border-background">
          <AvatarImage src={profileImage} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{name}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge variant="verified">
                  <Award className="w-3 h-3 mr-1" />
                  Verified Vendor
                </Badge>
                <Badge>{category}</Badge>
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <span className="font-semibold">{rating}</span>
                  <span className="text-muted-foreground ml-1">({reviewCount} reviews)</span>
                </div>
              </div>
              <p className="text-muted-foreground">{tagline}</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</div>
```

#### 2. PackageCard Component
```tsx
<Card className="hover:shadow-xl transition-all hover:scale-105">
  <CardHeader>
    <div className="flex items-start justify-between">
      <div>
        <CardTitle>{packageName}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{deliveryTime}</p>
      </div>
      {popular && (
        <Badge variant="featured">
          <Sparkles className="w-3 h-3 mr-1" />
          Popular
        </Badge>
      )}
    </div>
  </CardHeader>
  <CardContent>
    <div className="mb-4">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">₹{price}</span>
        {wasPrice && (
          <span className="text-lg text-muted-foreground line-through">₹{wasPrice}</span>
        )}
      </div>
    </div>
    
    <div className="space-y-2 mb-6">
      <h4 className="font-semibold text-sm">What's Included:</h4>
      <ul className="space-y-2">
        {inclusions.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
    
    <Button className="w-full">
      <MessageCircle className="w-4 h-4 mr-2" />
      Get Quote
    </Button>
  </CardContent>
</Card>
```

#### 3. PortfolioGallery Component
```tsx
<div className="space-y-6">
  {/* Category Filters */}
  <div className="flex flex-wrap gap-2">
    <Button
      variant={activeCategory === 'all' ? 'default' : 'outline'}
      size="sm"
      onClick={() => setActiveCategory('all')}
    >
      All Work
    </Button>
    {categories.map((cat) => (
      <Button
        key={cat.id}
        variant={activeCategory === cat.id ? 'default' : 'outline'}
        size="sm"
        onClick={() => setActiveCategory(cat.id)}
      >
        {cat.name} ({cat.count})
      </Button>
    ))}
  </div>
  
  {/* Masonry Gallery */}
  <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
    {filteredImages.map((image) => (
      <div key={image.id} className="break-inside-avoid mb-4">
        <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
          <div className="relative">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-auto transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-semibold">{image.title}</p>
                <p className="text-white/80 text-sm">{image.category}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    ))}
  </div>
</div>
```

## Implementation Checklist

### Phase 1: Foundation (2-3 hours)
- [ ] Create EnhancedGallery component
- [ ] Create BookingCard component (sticky sidebar)
- [ ] Update hero sections with gradients
- [ ] Add dark mode variants to all sections

### Phase 2: Content Sections (3-4 hours)
- [ ] Redesign tabs navigation
- [ ] Implement ReviewCard component
- [ ] Create PackageCard component
- [ ] Add AvailabilityCalendar integration
- [ ] Build PortfolioGallery for vendors

### Phase 3: Interactive Features (2-3 hours)
- [ ] Lightbox modal for images
- [ ] Booking flow modals
- [ ] Contact form drawer
- [ ] Share functionality
- [ ] Save to favorites with scope support

### Phase 4: Polish (1-2 hours)
- [ ] Mobile responsiveness testing
- [ ] Dark mode testing
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] SEO metadata

## CSS/Tailwind Patterns

### Hero Gradient Overlay
```tsx
<div className="relative">
  <img src={heroImage} className="w-full h-full object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
</div>
```

### Card Hover Effects
```tsx
<Card className="
  transition-all duration-300
  hover:shadow-xl hover:scale-[1.02]
  border border-gray-200 dark:border-gray-700
  bg-white dark:bg-gray-800
">
```

### Sticky Sidebar
```tsx
<div className="lg:col-span-1">
  <div className="sticky top-24 space-y-6">
    {/* Content */}
  </div>
</div>
```

### Rating Display
```tsx
<div className="flex items-center gap-1">
  {[1, 2, 3, 4, 5].map((star) => (
    <Star
      key={star}
      className={`w-4 h-4 ${
        star <= rating
          ? 'fill-amber-400 text-amber-400'
          : 'text-gray-300 dark:text-gray-600'
      }`}
    />
  ))}
</div>
```

## Next Steps

1. **Apply to Venue Page**: `/src/app/venues/[id]/page.tsx`
   - Refactor hero section
   - Add sticky booking card
   - Implement tabs with enhanced content
   - Add lightbox gallery

2. **Apply to Vendor Page**: `/src/app/vendors/[id]/page.tsx`
   - Redesign header with cover + profile
   - Create package cards grid
   - Build portfolio masonry gallery
   - Add booking inquiry flow

3. **Create Shared Components**:
   - `src/components/detail/EnhancedGallery.tsx`
   - `src/components/detail/BookingCard.tsx`
   - `src/components/detail/ReviewCard.tsx`
   - `src/components/detail/PackageCard.tsx`
   - `src/components/detail/PortfolioGallery.tsx`

4. **Test Thoroughly**:
   - Different screen sizes
   - Dark/light mode transitions
   - Touch gestures on mobile
   - Keyboard navigation
   - Screen reader compatibility

---

**Status**: Design Specification Complete
**Ready for**: Implementation
**Estimated Time**: 8-12 hours total
