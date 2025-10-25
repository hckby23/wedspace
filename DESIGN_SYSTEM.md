# WedSpace Design System & UI/UX Guidelines

## Design Philosophy

### Core Principles
1. **Modern Minimalism** - Clean, uncluttered interfaces with strategic white space
2. **Progressive Disclosure** - Show essential info first, details on demand
3. **Consistent Dark Mode** - Equal attention to light and dark mode experiences
4. **Intuitive Navigation** - Clear information hierarchy and predictable patterns
5. **Indian Market Focus** - Cultural relevance with global design standards

## Color System

### Light Mode
```css
--background: 0 0% 100%        /* Pure white */
--foreground: 0 0% 13%         /* Near black */
--card: 0 0% 100%              /* White cards */
--card-foreground: 0 0% 13%    /* Dark text */
--muted: 0 0% 96%              /* Light gray */
--muted-foreground: 0 0% 46%   /* Medium gray */
--border: 0 0% 90%             /* Light borders */

/* Brand Colors */
--primary: 0 77% 50%           /* Red #D32F2F */
--secondary: 40 95% 56%        /* Mustard/Amber #FFB300 */
```

### Dark Mode
```css
--background: 0 0% 7%          /* Very dark gray */
--foreground: 0 0% 100%        /* Pure white */
--card: 0 0% 12%               /* Dark card */
--card-foreground: 0 0% 100%   /* White text */
--muted: 0 0% 18%              /* Dark muted */
--muted-foreground: 0 0% 69%   /* Light gray */
--border: 0 0% 20%             /* Dark borders */

/* Brand Colors */
--primary: 0 100% 66%          /* Brighter red for contrast */
--secondary: 45 100% 62%       /* Brighter amber for contrast */
```

## Typography

### Font Families
- **Headings**: Playfair Display (serif) - Elegant and emotional
- **Body**: Inter (sans-serif) - Clean and readable
- **Code**: JetBrains Mono (monospace) - Technical clarity

### Type Scale
```css
h1: text-3xl sm:text-4xl md:text-5xl  /* 48-80px */
h2: text-2xl sm:text-3xl md:text-4xl  /* 36-56px */
h3: text-xl sm:text-2xl               /* 24-32px */
h4: text-lg                            /* 20px */
body: text-base                        /* 16px */
small: text-sm                         /* 14px */
```

## Spacing System

### Consistent Spacing Scale
```
xs:  4px   (gap-1, p-1, m-1)
sm:  8px   (gap-2, p-2, m-2)
md:  16px  (gap-4, p-4, m-4)
lg:  24px  (gap-6, p-6, m-6)
xl:  32px  (gap-8, p-8, m-8)
2xl: 48px  (gap-12, p-12, m-12)
3xl: 64px  (gap-16, p-16, m-16)
```

### Section Spacing
- **Between sections**: 64-80px (py-16 to py-20)
- **Section padding**: 32-48px (px-8 to px-12)
- **Card padding**: 24px (p-6)
- **Component gap**: 16-24px (gap-4 to gap-6)

## Component Patterns

### Card Design
```tsx
<Card className="overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-300">
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>
```

### Section Container
```tsx
<section className="py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    {/* Content */}
  </div>
</section>
```

### Hero Section
```tsx
<section className="relative py-20 sm:py-32 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    {/* Hero content */}
  </div>
</section>
```

## Page Structure Standards

### Standard Page Layout
```tsx
<div className="min-h-screen bg-background">
  {/* Hero/Header Section */}
  <section className="relative py-20">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
    
    {/* Content */}
    <div className="relative max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4">Page Title</h1>
      <p className="text-lg text-muted-foreground">Page description</p>
    </div>
  </section>

  {/* Main Content Section */}
  <section className="py-16 px-4">
    <div className="max-w-7xl mx-auto">
      {/* Cards, grids, content */}
    </div>
  </section>
</div>
```

## Dark Mode Best Practices

### Always Include Dark Mode Variants
```tsx
// ❌ BAD - Only light mode
<div className="bg-white text-gray-900">

// ✅ GOOD - Both modes
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// ✅ BETTER - Use design tokens
<div className="bg-background text-foreground">
```

### Gradient Backgrounds
```tsx
// Light mode subtle, dark mode visible
<div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
```

### Interactive Elements
```tsx
// Consistent hover states
<button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
  {/* Content */}
</button>
```

## Information Hierarchy

### Progressive Disclosure Pattern
1. **Primary Info** (always visible)
   - Essential details at a glance
   - Call-to-action buttons
   - Key metrics

2. **Secondary Info** (expand/collapse)
   - Additional details
   - Less frequently needed data
   - Toggleable sections

3. **Tertiary Info** (tooltips, modals)
   - Help text
   - Technical details
   - Advanced options

### Card Information Structure
```tsx
<Card>
  {/* Primary: Image + Title + Price */}
  <img src="..." alt="..." />
  <h3>Venue Name</h3>
  <p className="text-2xl font-bold">₹50,000</p>
  
  {/* Secondary: Quick details */}
  <div className="flex gap-2 text-sm text-muted-foreground">
    <span>Capacity: 200</span>
    <span>Location: Mumbai</span>
  </div>
  
  {/* Tertiary: View details button */}
  <Button variant="outline" size="sm">View Details</Button>
</Card>
```

## Component Library Standards

### Button Variants
- **Primary**: Main actions (Book Now, Sign Up)
- **Secondary**: Supporting actions (Learn More)
- **Outline**: Subtle actions (View Details)
- **Ghost**: Minimal actions (Edit, Delete)

### Badge Variants
- **Default**: General labels
- **Success**: Positive states (Available, Verified)
- **Warning**: Attention needed (Limited, Ending Soon)
- **Destructive**: Negative states (Unavailable, Cancelled)

### Input Standards
- **Consistent height**: h-10 or h-11
- **Clear labels**: Always include labels
- **Helper text**: Validation messages below
- **Icons**: Leading icons for context

## Responsive Design

### Breakpoints
```
sm:  640px   - Large phones
md:  768px   - Tablets
lg:  1024px  - Small laptops
xl:  1280px  - Desktops
2xl: 1536px  - Large screens
```

### Mobile-First Approach
```tsx
// Start with mobile, add larger screens
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

## Animation Standards

### Transitions
- **Duration**: 200-300ms for interactions
- **Easing**: ease-out for most animations
- **Properties**: transform, opacity, colors

### Hover Effects
```tsx
// Subtle lift
hover:shadow-md hover:-translate-y-0.5

// Scale effect
hover:scale-105

// Opacity change
hover:opacity-90
```

## Accessibility

### Always Include
- `aria-label` for icon-only buttons
- `alt` text for all images
- Proper heading hierarchy (h1 → h2 → h3)
- Focus states for keyboard navigation
- Sufficient color contrast (4.5:1 minimum)

### Focus States
```tsx
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

## Page-Specific Patterns

### Dashboard Pages
- Stats cards at top (4-6 key metrics)
- Charts/graphs in middle section
- Recent activity/tables at bottom
- Sidebar for navigation (optional)

### Listing Pages
- Filters in sidebar (desktop) or drawer (mobile)
- Grid/list view toggle
- Sort options prominent
- Pagination at bottom

### Detail Pages
- Image gallery at top
- Key info (title, price, rating) prominent
- Tabs for different sections (Details, Reviews, etc.)
- Sticky CTA button (mobile)

### Form Pages
- Multi-step for long forms
- Progress indicator
- Validation on blur
- Clear error messages

## Performance Considerations

### Lazy Loading
- Images: Use Next.js Image component
- Components: React.lazy for route-based splitting
- Heavy features: Load on demand

### Optimizations
- Minimize re-renders
- Debounce search inputs
- Virtualize long lists
- Cache API responses

## Implementation Checklist

For every page, ensure:
- [ ] Dark mode fully implemented with design tokens
- [ ] Responsive across all breakpoints
- [ ] Proper spacing and typography scale
- [ ] Consistent component patterns
- [ ] Progressive disclosure for complex info
- [ ] Accessibility standards met
- [ ] Performance optimizations applied
- [ ] Animations and transitions smooth
- [ ] Error and loading states handled
- [ ] Mobile navigation intuitive
