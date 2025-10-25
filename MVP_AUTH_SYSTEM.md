# MVP Authentication System - Simple & Free

## Core Philosophy
**"Get users planning in 30 seconds or less"**

For MVP: Zero friction, zero cost, maximum value delivery.

---

## Authentication Strategy

### What We DON'T Need (MVP)
❌ Payment/subscription gates
❌ Email verification (friction point)
❌ Complex password requirements
❌ Multi-step registration forms
❌ Phone number verification
❌ KYC/identity verification
❌ Premium/free tier differentiation

### What We DO Need (MVP)
✅ Email + Password signup (simple)
✅ Google OAuth (one-click)
✅ Guest/Demo mode (try before signup)
✅ Remember me (localStorage)
✅ Password reset (basic)
✅ Auto-login on first visit
✅ Profile completion (optional, post-signup)

---

## User Flows

### Flow 1: Guest Mode (Zero Friction)
```
User visits site
   ↓
Clicks "Try Demo" or starts planning
   ↓
All features work (data saved to localStorage)
   ↓
Prompt to save progress (after 3 actions)
   ↓
Quick signup → Data syncs to account
```

**Benefits**:
- Try before signup
- No commitment needed
- Experience full product
- Convert when invested

### Flow 2: Email Signup (Quick)
```
User clicks "Get Started"
   ↓
Simple form:
   • Email
   • Password (min 6 chars)
   • Optional: Name
   ↓
Click "Start Planning" (one button)
   ↓
Auto-login → Dashboard
   ↓
Profile completion banner (dismissible)
```

**Time**: ~20 seconds

### Flow 3: Google OAuth (Fastest)
```
User clicks "Continue with Google"
   ↓
Google auth popup
   ↓
Auto-login → Dashboard
   ↓
Done!
```

**Time**: ~5 seconds

### Flow 4: Password Reset (Simple)
```
Forgot password link
   ↓
Enter email
   ↓
Magic link sent (Supabase handles it)
   ↓
Click link → Reset password
   ↓
Auto-login
```

---

## Database Schema (Minimal)

### Users Table (Supabase Auth)
```sql
-- Handled by Supabase automatically
auth.users
  - id (uuid, pk)
  - email (unique)
  - encrypted_password
  - created_at
  - last_sign_in_at
```

### Profiles Table (Extended Info)
```sql
profiles
  - id (uuid, pk, fk to auth.users)
  - email (text)
  - full_name (text, nullable)
  - avatar_url (text, nullable)
  - wedding_date (date, nullable)
  - partner_name (text, nullable)
  - city (text, nullable)
  - guest_count (int, nullable)
  - budget_range (text, nullable)
  - onboarding_completed (boolean, default false)
  - is_demo_user (boolean, default false)
  - created_at (timestamp)
  - updated_at (timestamp)
```

**RLS Policies**:
```sql
-- Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

---

## UI Components

### 1. Signup Page (`/auth/signup`)

**Layout**:
```
┌─────────────────────────────────────────────┐
│                                             │
│          [WedSpace Logo]                    │
│                                             │
│   Start Planning Your Perfect Wedding      │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ [G] Continue with Google            │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ─────────── or ───────────                │
│                                             │
│  Email                                      │
│  [____________________________]             │
│                                             │
│  Password (min 6 characters)                │
│  [____________________________]             │
│                                             │
│  [ ] Remember me                            │
│                                             │
│  [     Start Planning (Free)     ]         │
│                                             │
│  Already have an account? [Login]          │
│                                             │
│  Or [Try Demo Mode] (no signup needed)     │
│                                             │
└─────────────────────────────────────────────┘
```

**Features**:
- Clean, minimal design
- Google button prominent
- Email/password below
- Demo mode option
- No marketing copy clutter
- Mobile-first responsive

### 2. Login Page (`/auth/login`)

**Layout**:
```
┌─────────────────────────────────────────────┐
│                                             │
│          [WedSpace Logo]                    │
│                                             │
│       Welcome Back! 👋                      │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ [G] Continue with Google            │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ─────────── or ───────────                │
│                                             │
│  Email                                      │
│  [____________________________]             │
│                                             │
│  Password                                   │
│  [____________________________]             │
│                                             │
│  [ ] Remember me    [Forgot password?]     │
│                                             │
│  [         Login         ]                  │
│                                             │
│  Don't have an account? [Sign up free]     │
│                                             │
└─────────────────────────────────────────────┘
```

### 3. Profile Completion (Post-Signup Modal)

**Optional, Dismissible Banner**:
```
┌─────────────────────────────────────────────┐
│ ✨ Complete your profile for better         │
│    recommendations                   [x]    │
│                                             │
│  Wedding Date: [____] (optional)            │
│  Partner Name: [____] (optional)            │
│  City: [____] (optional)                    │
│  Guest Count: [____] (optional)             │
│                                             │
│  [Skip for Now]  [Save & Get Recommendations]│
└─────────────────────────────────────────────┘
```

**Can be dismissed and shown again later in Settings**

---

## Authentication Context

### AuthProvider Component
```tsx
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isDemoMode: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  enableDemoMode: () => void;
  convertDemoToAccount: (email: string, password: string) => Promise<void>;
}
```

### Usage in Components
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signIn, isDemoMode } = useAuth();
  
  if (isDemoMode) {
    return <DemoBanner />;
  }
  
  if (!user) {
    return <LoginPrompt />;
  }
  
  return <AuthenticatedContent />;
}
```

---

## Protected Routes

### Public Routes (No Auth Required)
- `/` - Home
- `/explore` - Explore
- `/venues` - Venues (read-only)
- `/vendors` - Vendors (read-only)
- `/about` - About
- `/contact` - Contact
- `/auth/login` - Login
- `/auth/signup` - Signup

### Protected Routes (Auth Required)
- `/dashboard` - Dashboard
- `/planning` - Planning hub
- `/tools/*` - All planning tools
- `/favorites` - Favorites
- `/profile` - Profile settings

### Demo Mode Access
- Can use planning tools (data in localStorage)
- Can't save to account
- Prompted to signup after 3-5 actions
- Can convert demo data to account

---

## Implementation Plan

### Phase 1: Basic Auth (2-3 hours)
1. ✅ Create AuthContext with Supabase
2. ✅ Implement email/password signup
3. ✅ Implement email/password login
4. ✅ Implement logout
5. ✅ Create protected route wrapper

### Phase 2: OAuth (1 hour)
6. ✅ Setup Google OAuth in Supabase
7. ✅ Add Google login button
8. ✅ Handle OAuth callback

### Phase 3: Demo Mode (2 hours)
9. ✅ Create demo mode state
10. ✅ LocalStorage data handling
11. ✅ Demo to account conversion
12. ✅ Demo mode banner/prompts

### Phase 4: UI Components (2-3 hours)
13. ✅ Redesign signup page (modern)
14. ✅ Redesign login page (modern)
15. ✅ Create profile completion modal
16. ✅ Add password reset flow

### Phase 5: Polish (1-2 hours)
17. ✅ Add loading states
18. ✅ Error handling
19. ✅ Success messages
20. ✅ Remember me functionality
21. ✅ Auto-login on first visit

**Total Time**: 8-11 hours

---

## Key Features

### 1. Demo Mode
**Purpose**: Let users try before committing

```tsx
// Enable demo mode
const enableDemoMode = () => {
  localStorage.setItem('demo_mode', 'true');
  localStorage.setItem('demo_user_id', uuid());
  // All planning tools work normally with localStorage
};

// Convert demo to account
const convertDemoToAccount = async (email, password) => {
  const demoData = {
    checklist: JSON.parse(localStorage.getItem('ws_checklist_v1')),
    budget: JSON.parse(localStorage.getItem('ws_budget_v1')),
    guests: JSON.parse(localStorage.getItem('ws_guests_v1'))
  };
  
  await signUp(email, password);
  await syncDemoDataToAccount(demoData);
  localStorage.removeItem('demo_mode');
};
```

### 2. Auto-Login
**Purpose**: Reduce friction for returning users

```tsx
useEffect(() => {
  // Check for existing session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    setUser(session.user);
    fetchProfile(session.user.id);
  }
}, []);
```

### 3. Remember Me
**Purpose**: Long-lasting sessions

```tsx
const signIn = async (email, password, rememberMe) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (rememberMe && data.session) {
    // Supabase handles this automatically with localStorage
    // Session persists across browser closes
  }
};
```

### 4. Guest Actions Prompt
**Purpose**: Convert users when invested

```tsx
const checkGuestActionsCount = () => {
  const actions = parseInt(localStorage.getItem('guest_actions') || '0');
  
  if (actions >= 3 && !user && !isDemoMode) {
    showSignupPrompt({
      title: "Save your progress!",
      message: "You're doing great! Create a free account to save your planning.",
      cta: "Sign up free"
    });
  }
};
```

---

## Error Handling

### User-Friendly Messages
```tsx
const getErrorMessage = (error: any) => {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Email or password incorrect. Please try again.';
    case 'Email not confirmed':
      return 'Please check your email to verify your account.';
    case 'User already registered':
      return 'This email is already registered. Try logging in instead.';
    default:
      return 'Something went wrong. Please try again.';
  }
};
```

### Validation
```tsx
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 6;
};
```

---

## Security (MVP Level)

### What We Include
✅ HTTPS (via Vercel/deployment)
✅ Password hashing (Supabase handles)
✅ JWT tokens (Supabase handles)
✅ RLS policies (database level)
✅ CSRF protection (Next.js default)
✅ XSS prevention (React default)

### What We Skip (For Later)
⏭️ 2FA (not MVP critical)
⏭️ Email verification (friction)
⏭️ Rate limiting (low traffic)
⏭️ Session management (basic is fine)
⏭️ IP logging (privacy concern)

---

## Onboarding Flow

### First-Time User Journey
```
1. Land on homepage
2. Click "Get Started"
3. See signup options:
   • Google (recommended)
   • Email
   • Demo mode
4. Choose option → Create account
5. Auto-login → Redirect to dashboard
6. See welcome banner with quick tips
7. Dismiss banner → Start planning
```

**No multi-step wizard**
**No forced profile completion**
**No payment prompts**

---

## Mobile Considerations

### Touch-Friendly
- Large tap targets (min 44x44px)
- Easy-to-type forms
- Password reveal button
- Autofocus on inputs
- Show keyboard automatically

### Progressive Web App (PWA)
- Add to home screen prompt
- Offline support for planning tools
- Push notifications (optional)

---

## Analytics Events

Track these for conversion optimization:

```tsx
// Signup events
analytics.track('signup_started', { method: 'email' | 'google' | 'demo' });
analytics.track('signup_completed', { method, time_taken });
analytics.track('signup_failed', { method, error });

// Login events
analytics.track('login_started', { method });
analytics.track('login_completed', { method });
analytics.track('login_failed', { method, error });

// Demo conversion
analytics.track('demo_mode_enabled');
analytics.track('demo_to_account_prompted');
analytics.track('demo_converted', { actions_taken });
```

---

## Testing Checklist

### Signup Flow
- [ ] Email signup works
- [ ] Google signup works
- [ ] Demo mode activates
- [ ] Passwords are hashed
- [ ] Duplicate email prevented
- [ ] Auto-login after signup
- [ ] Profile created successfully

### Login Flow
- [ ] Email login works
- [ ] Google login works
- [ ] Remember me persists
- [ ] Wrong password shows error
- [ ] Non-existent email shows error
- [ ] Auto-redirect to dashboard

### Demo Mode
- [ ] Demo enables without signup
- [ ] Planning tools work
- [ ] Data saves to localStorage
- [ ] Prompt appears after actions
- [ ] Conversion syncs data
- [ ] Demo data clears after conversion

### Protected Routes
- [ ] Unauthenticated redirects to login
- [ ] Demo users can access tools
- [ ] Logged-in users see full features
- [ ] Logout clears session

---

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Auth state management
├── hooks/
│   ├── useAuth.ts               # Auth hook
│   └── useDemoMode.ts           # Demo mode hook
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx         # Login page (redesigned)
│   │   ├── signup/
│   │   │   └── page.tsx         # Signup page (redesigned)
│   │   └── reset-password/
│   │       └── page.tsx         # Password reset
│   └── api/
│       └── auth/
│           ├── callback/route.ts  # OAuth callback
│           └── demo-convert/route.ts # Demo conversion
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── GoogleLoginButton.tsx
│   │   ├── DemoModeButton.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ProfileCompletionBanner.tsx
│   └── ui/
│       └── AuthLayout.tsx        # Shared auth page layout
└── lib/
    ├── supabase.ts               # Supabase client
    └── auth-helpers.ts           # Auth utilities
```

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth (optional for MVP)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Cost Analysis (MVP)

### Supabase Free Tier
- 50,000 monthly active users ✅
- Unlimited API requests ✅
- 500 MB database ✅ (plenty for MVP)
- Social OAuth included ✅
- Row Level Security ✅

**Total Cost**: $0/month

### No Payment Required Until
- 50K+ monthly users
- 500 MB+ database
- Enterprise features needed

---

## Success Metrics

### Signup Metrics
- **Conversion Rate**: Homepage → Signup
- **Method Distribution**: Email vs Google vs Demo
- **Time to Signup**: Target < 30 seconds
- **Completion Rate**: Start signup → Complete

### Engagement Metrics
- **Demo Conversion**: Demo users → Accounts
- **Activation**: Signup → First planning action
- **Retention**: Day 1, Day 7, Day 30 login rates

### Friction Points
- **Drop-off**: Where users abandon signup
- **Errors**: Most common error messages
- **Support**: Auth-related help requests

---

## Next Steps (Implementation Order)

### Week 1: Core Auth
1. Create AuthContext
2. Implement email/password auth
3. Create login/signup pages
4. Add protected routes

### Week 2: Enhancements
5. Add Google OAuth
6. Implement demo mode
7. Create profile completion
8. Add remember me

### Week 3: Polish
9. Error handling
10. Loading states
11. Success messages
12. Mobile optimization

---

## Summary

**Goal**: Get users planning in < 30 seconds
**Strategy**: Zero friction, maximum value
**Cost**: $0 (Supabase free tier)
**Features**: Email, Google, Demo mode
**Time to Build**: 8-11 hours

**Philosophy**: Remove every obstacle between user and value delivery.

---

**Status**: ✅ Planned & Ready to Implement
**Next**: Build AuthContext and redesign auth pages
