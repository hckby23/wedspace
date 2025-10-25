# WedSpace - AI-Powered Wedding Planning Platform 🎉

WedSpace is India's leading AI-powered wedding planning platform built with Next.js 15, TypeScript, and Supabase. It provides a comprehensive marketplace connecting couples with venues and vendors, featuring secure escrow payments, AI recommendations, and complete planning tools.

## 🌟 Key Features

### For Couples
- **AI-Powered Search** - Smart venue and vendor recommendations
- **Secure Escrow Payments** - Safe transactions with advance/balance payments
- **Complete Planning Suite** - Checklist, budget tracker, guest list, timeline
- **Visual Discovery** - AI image matching for venue inspiration
- **Real-time Availability** - Live booking calendar and instant confirmations
- **Favorites & Collections** - Save and organize your dream vendors

### For Vendors & Venues
- **Business Dashboard** - Manage bookings, payments, and analytics
- **Escrow Protection** - Secure payment release after service delivery
- **Lead Management** - Track inquiries and conversions
- **Performance Analytics** - Insights on views, bookings, and revenue
- **Verified Badges** - Build trust with verified status
- **Marketing Tools** - Featured listings and promotional campaigns

### Platform Features
- **Escrow Payment System** - Secure fund holding with dispute resolution
- **Commission Management** - Automated 10% platform fee calculation
- **Dispute Resolution** - Admin-managed conflict resolution
- **Real-time Notifications** - In-app and email notifications
- **Dark Mode** - Full theme support across all pages
- **Mobile Responsive** - Optimized for all devices
- **SEO Optimized** - Structured data and metadata for search engines

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn UI** - Accessible component library
- **React Query** - Data fetching and caching
- **Lucide Icons** - Beautiful icon library

### Backend
- **Supabase** - PostgreSQL database with real-time features
- **Row-Level Security** - Database-level authorization
- **Edge Functions** - Serverless functions on Deno
- **Razorpay** - Payment gateway with escrow support

### Integrations
- **Google Maps API** - Location services and mapping
- **Vercel AI SDK** - AI assistant and recommendations
- **Google Analytics 4** - User analytics and tracking
- **Razorpay Webhooks** - Automated payment processing

## 📋 Prerequisites

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)
- Razorpay account (test mode available)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🛠️ Setup & Installation

### 1. Clone and Install

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd wedspace

# Install dependencies
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE=your_service_role_key

# Razorpay (required for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Google Maps (required)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push

# (Optional) Seed sample data
supabase db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### 5. Deploy Edge Functions (Optional)

```bash
# Deploy all edge functions
supabase functions deploy razorpay-webhook
supabase functions deploy image-embeddings
supabase functions deploy notification-sender
supabase functions deploy ai-search-ranking
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn UI (based on Radix UI)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Query
- **Backend Integration**: Supabase
- **Deployment**: Optimized for Vercel

## Deployment

This project is optimized for deployment on Vercel. For detailed deployment instructions, see the [VERCEL.md](./VERCEL.md) file.

To build the project locally, run:

```bash
npm run build
```

This will create a `dist` folder with the built project that can be deployed to any static hosting service.

## 💰 Escrow Payment System

WedSpace features a comprehensive escrow system for secure transactions:

### How It Works

1. **Booking Creation** - Customer selects venue/vendor and creates booking
2. **Escrow Account** - Automatically created with advance payment (30% default)
3. **Payment** - Customer pays through Razorpay, funds held in escrow
4. **Service Delivery** - Vendor delivers service on event date
5. **Confirmation** - Customer confirms OR auto-release after 7 days
6. **Release** - Funds released to vendor (minus 10% commission)

### Key Features

- **Advance + Balance Payments** - Flexible payment schedules
- **Auto-Release** - Automatic fund release after service delivery
- **Dispute Resolution** - Admin-managed conflict resolution
- **Commission Management** - Automated platform fee calculation
- **Transaction Audit** - Complete transaction history
- **Refund Support** - Full or partial refunds with reason tracking

### API Endpoints

```typescript
POST /api/escrow              // Create escrow account
POST /api/escrow/fund         // Mark as funded after payment
POST /api/escrow/release      // Release funds to vendor
POST /api/escrow/refund       // Refund to customer
POST /api/escrow/dispute      // Create dispute
PATCH /api/escrow/dispute     // Update dispute (admin)
```

## 📁 Project Structure

```
/Users/adi/Documents/ws2/
├── supabase/
│   ├── migrations/           # Database migrations (6 files)
│   │   └── 20250930_escrow_system.sql  # Escrow tables
│   └── functions/            # Edge functions (4 functions)
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes (36 endpoints)
│   │   │   ├── escrow/       # Escrow management
│   │   │   ├── payments/     # Payment processing
│   │   │   ├── bookings/     # Booking management
│   │   │   └── ...
│   │   ├── venues/           # Venue pages
│   │   ├── vendors/          # Vendor pages
│   │   ├── tools/            # Planning tools
│   │   └── ...               # 37 total pages
│   │
│   ├── components/           # React components (111 total)
│   │   ├── ui/               # shadcn UI components (51)
│   │   ├── ai/               # AI features (5)
│   │   ├── venues/           # Venue components (7)
│   │   ├── performance/      # Performance monitoring (3)
│   │   └── seo/              # SEO components (2)
│   │
│   ├── services/             # Business logic
│   │   ├── EscrowService.ts  # Escrow management
│   │   ├── PaymentService.ts # Payment processing
│   │   ├── AIService.ts      # AI features
│   │   └── ...
│   │
│   ├── hooks/                # Custom React hooks (13)
│   ├── integrations/         # External APIs
│   ├── lib/                  # Utilities
│   ├── types/                # TypeScript types
│   └── config/               # Configuration
│
├── .env.example              # Environment template
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind configuration
└── IMPLEMENTATION_SUMMARY.md # Complete implementation guide
```
