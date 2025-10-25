# WedSpace Interconnections Documentation

## Overview
This document outlines all interconnections between components, services, hooks, and APIs in the WedSpace platform.

## Architecture Layers

### 1. Data Layer (Supabase)
- **Database**: PostgreSQL with RLS policies
- **Tables**: profiles, listings, bookings, reviews, payments, notifications, events, ai_preferences
- **Real-time**: Supabase subscriptions for live updates
- **Storage**: Media files and images

### 2. API Layer (Next.js API Routes)
All API routes are interconnected with the database and provide data to the frontend:

#### AI APIs
- `/api/ai/assistant` - AI chat assistant with context
- `/api/ai/preferences` - User AI preferences CRUD
- `/api/ai/chat` - Real-time AI conversations
- `/api/ai/search` - AI-powered smart search
- `/api/ai/image-match` - Visual similarity search
- `/api/ai/sort` - Smart sorting algorithms

#### Admin APIs
- `/api/admin/stats` - Platform statistics
- `/api/admin/activities` - Recent platform activities
- `/api/admin/top-performers` - Top listings performance
- `/api/admin/approvals` - Pending approvals management
- `/api/admin/listings/[id]/approve` - Approve listings
- `/api/admin/listings/[id]/reject` - Reject listings

#### Business APIs
- `/api/business/stats` - Business owner statistics
- `/api/business/bookings` - Business bookings management
- `/api/business/performance` - Listing performance metrics
- `/api/business/availability` - Availability management
- `/api/business/media` - Media upload and management

#### Core APIs
- `/api/listings` - Listings CRUD operations
- `/api/bookings` - Booking management
- `/api/favorites` - Favorites management
- `/api/reviews` - Reviews management
- `/api/notifications` - Notifications system
- `/api/payments` - Payment processing (Razorpay)
- `/api/analytics` - Analytics tracking

#### Health Check APIs
- `/api/health/database` - Database connectivity check
- `/api/health/ai` - AI service health check

### 3. Service Layer
Services provide business logic and connect APIs with frontend:

#### AI Services
- **AIService** (`/src/services/AIService.ts`)
  - Venue recommendations
  - Vendor recommendations
  - Smart search
  - Image matching
  - Budget optimization
  - Timeline generation
  - Vendor matching
  - Price prediction

- **OpenRouterService** (`/src/services/OpenRouterService.ts`)
  - LLM API integration
  - Function calling support
  - Streaming responses
  - Context management

- **EnhancedAIAssistant** (`/src/services/EnhancedAIAssistant.ts`)
  - Conversational AI
  - Tool execution
  - Context awareness
  - Multi-turn conversations

#### Other Services
- **AnalyticsService** (`/src/services/analytics.ts`)
  - Event tracking
  - User behavior analysis
  - Performance metrics

- **SEOService** (`/src/services/seo.ts`)
  - Metadata generation
  - Structured data
  - Sitemap generation

### 4. Hook Layer (React Hooks)
Custom hooks provide state management and API integration:

#### AI Hooks
- **useAI** - All AI service functions
- **useAIAssistant** - Chat assistant management
- **useAIPreferences** - User AI preferences

#### Dashboard Hooks
- **useAdmin** - Admin dashboard data
- **useBusinessDashboard** - Business owner dashboard data

#### Core Hooks
- **useAuth** - Authentication state
- **useListings** - Listings management
- **useBookings** - Bookings management
- **useFavorites** - Favorites management
- **useNotifications** - Notifications state
- **useVenues** - Venue-specific operations

### 5. Component Layer

#### AI Components
- **AIAssistantWidget** (`/src/components/ai/AIAssistantWidget.tsx`)
  - Uses: `useAIAssistant`
  - Features: Chat interface, suggestions, context-aware responses

- **AIRecommendations** (`/src/components/ai/AIRecommendations.tsx`)
  - Uses: `useAI`
  - Features: Personalized recommendations, match scores, filtering

#### Dashboard Components
- **AdminDashboard** (`/src/app/(business)/admin/dashboard/page.tsx`)
  - Uses: `useAdmin`
  - Features: Platform stats, activities, approvals management
  - Connected to: Admin APIs, Analytics

- **VendorDashboard** (`/src/app/(business)/vendor/dashboard/page.tsx`)
  - Uses: `useBusinessDashboard`
  - Features: Bookings, performance, availability
  - Connected to: Business APIs, Analytics

- **VenueDashboard** (`/src/app/(business)/venue/dashboard/page.tsx`)
  - Uses: `useBusinessDashboard`
  - Features: Bookings, performance, availability
  - Connected to: Business APIs, Analytics

#### Page Components
All pages are interconnected with appropriate services:

- **Home** - AI search, recommendations, analytics
- **Venues** - AI recommendations, smart filters, favorites
- **Vendors** - AI recommendations, smart filters, favorites
- **Search** - AI-powered search, multi-modal search
- **Planning Tools** - AI assistance, data management
- **Dashboard** - User data, AI insights

## Data Flow Patterns

### 1. User Action → API → Database → Response
```
User clicks "Search" 
→ useListings.search() 
→ /api/listings?query=... 
→ Supabase query 
→ Results returned 
→ Component updates
```

### 2. AI Interaction Flow
```
User sends message 
→ useAIAssistant.sendMessage() 
→ /api/ai/chat 
→ OpenRouterService.chat() 
→ AI response 
→ Tool execution (if needed) 
→ Final response 
→ Component updates
```

### 3. Real-time Updates
```
Database change 
→ Supabase real-time event 
→ useNotifications listener 
→ Component updates 
→ User sees notification
```

### 4. Admin Approval Flow
```
Admin clicks "Approve" 
→ useAdmin.approveListing() 
→ /api/admin/listings/[id]/approve 
→ Update database 
→ Send notification 
→ Log event 
→ Refresh dashboard
```

## Integration Points

### Frontend ↔ Backend
- All hooks use fetch() to call API routes
- Error handling at hook level
- Loading states managed by hooks
- TypeScript interfaces shared between layers

### Backend ↔ Database
- Supabase client in API routes
- RLS policies enforce security
- Typed queries with TypeScript
- Real-time subscriptions where needed

### AI Services ↔ Platform
- OpenRouter API for LLM
- Function calling for tool use
- Context-aware responses
- User preferences integration

### Analytics Integration
- Page views tracked automatically
- Event tracking in components
- Performance metrics collected
- User behavior analysis

## Environment Variables
All services require proper configuration:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Services
OPENROUTER_API_KEY=

# Payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

## Testing Integration Points

### Unit Tests
- Service functions
- Hook logic
- Component rendering

### Integration Tests
- API route handlers
- Database operations
- Service interactions

### E2E Tests
- User flows
- AI interactions
- Payment processing

## Monitoring & Health Checks

### Health Endpoints
- `/api/health/database` - Database connectivity
- `/api/health/ai` - AI service availability

### Performance Metrics
- API response times
- Database query performance
- AI response latency
- Page load times

## Future Interconnections

### Planned
1. Real-time collaborative planning tools
2. Advanced AI price negotiation
3. Multi-vendor package recommendations
4. Automated vendor matching
5. Smart calendar synchronization
6. Video call integration
7. Document e-signing
8. Advanced analytics dashboards

## Troubleshooting

### Common Issues
1. **AI not responding** - Check OPENROUTER_API_KEY
2. **Database errors** - Verify RLS policies
3. **Auth issues** - Check Supabase configuration
4. **Missing data** - Verify API route permissions

### Debug Tools
- Browser DevTools Network tab
- Supabase dashboard logs
- Next.js API route logs
- React DevTools for hooks

## Best Practices

1. **Always use hooks** - Don't call APIs directly from components
2. **Error handling** - Handle errors at hook level
3. **Loading states** - Show loading indicators
4. **Type safety** - Use TypeScript interfaces
5. **Real-time** - Use Supabase subscriptions for live data
6. **Analytics** - Track important user actions
7. **Security** - Verify permissions at API level
8. **Performance** - Cache when appropriate

---

Last Updated: October 2024
Maintained by: WedSpace Engineering Team
