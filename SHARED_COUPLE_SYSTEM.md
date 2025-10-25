# Shared Couple Planning System - Complete Implementation Guide

## Overview

WedSpace now supports **Shared Couple Planning** - a system that allows any 2 separately created accounts to connect and collaborate on wedding planning while maintaining separate personal usage.

### Key Features
- ✅ **Connect Separate Accounts**: Two independent users can link accounts via invite
- ✅ **Personal + Shared Scopes**: Items can be personal OR wedding-shared
- ✅ **Flexible Switching**: Users switch between "My Items" and "Our Wedding" contexts
- ✅ **RLS Security**: Row-level security enforces access control
- ✅ **Activity Tracking**: All shared changes logged with activity feed

## Architecture

### Data Model

```
users (existing)
  ↓
weddings (new)
  ├─→ wedding_members (who's planning together)
  ├─→ wedding_invites (pending invites)
  └─→ wedding_settings (shared preferences)

planning items (checklist, budget, timeline, guests, favorites)
  ├─→ user_id (personal scope)
  └─→ wedding_id (shared scope)
```

### Scope Constraint
Every item has **EITHER** `user_id` OR `wedding_id` (never both, never neither):
```sql
CHECK (
  (user_id IS NOT NULL AND wedding_id IS NULL) OR
  (user_id IS NULL AND wedding_id IS NOT NULL)
)
```

## Implementation Status

### ✅ Completed (Database & APIs)

#### Database Migration
- **File**: `supabase/migrations/20250122_shared_couple_system.sql`
- **Tables Created**:
  - `weddings` - Wedding planning contexts
  - `wedding_members` - Couple + collaborator memberships
  - `wedding_invites` - Token-based invite system
  - `timeline_items` - Shared timeline planning
  - `guests` - Shared guest management
  - `favorites` - Shared venue/vendor favorites
  - `wedding_settings` - Shared preferences
  - `activity_events` - Activity tracking

- **Columns Added**:
  - `checklist_tasks.wedding_id`
  - `budget_items.wedding_id`
  - All with scope constraints + indexes

- **RLS Policies**: Personal + Wedding policies for all tables
- **Triggers**: Activity logging for shared changes

#### API Routes Created
1. **Wedding Management**
   - `POST /api/weddings` - Create wedding
   - `GET /api/weddings` - List user's weddings
   - `GET /api/weddings/[id]` - Get wedding with members
   - `PATCH /api/weddings/[id]` - Update wedding (owner/partner only)
   - `DELETE /api/weddings/[id]` - Delete wedding (owner only)

2. **Invite System**
   - `POST /api/weddings/[id]/invite` - Generate invite link
   - `POST /api/weddings/invite/accept` - Accept invite via token

3. **Scope-Aware Planning APIs** (Updated)
   - `/api/planning/checklist` - Supports `?weddingId=xxx` param
   - `/api/planning/budget` - Supports `weddingId` in GET/POST

#### Types & Hooks
- **Types**: `src/types/wedding.ts` - All wedding-related interfaces
- **Hook**: `src/hooks/useScope.ts` - Manages scope selection with localStorage
- **Component**: `src/components/layout/ContextSwitcher.tsx` - UI for switching scopes

### ⏳ Pending (Integration & UI)

#### API Updates Needed
- [ ] `/api/planning/budget/summary` - Filter by weddingId
- [ ] `/api/planning/timeline` - Create routes with scope support
- [ ] `/api/planning/guests` - Create routes with scope support
- [ ] `/api/favorites` - Add wedding scope support

#### AI Assistant Integration
- [ ] Update `src/app/api/ai/chat/route.ts` to accept `weddingId` in context
- [ ] Update `AIToolExecutor` to pass `weddingId` to tool calls
- [ ] Update tool definitions to support wedding scope

#### UI Components
- [ ] **Invite Modal** - `src/components/weddings/InvitePartnerModal.tsx`
- [ ] **Scope Toggle** - Per-item "Share with Partner" toggle
- [ ] **Wedding Settings Page** - `/weddings/[id]/settings`
- [ ] **Activity Feed** - Show partner's changes

#### Page Integration
- [ ] Add `<ContextSwitcher />` to main layout
- [ ] Update planning pages to use `useScope()` hook
- [ ] Add invite CTA to onboarding flow
- [ ] Show scope badges on list items

## Usage Guide

### For Developers

#### 1. Run Migration
```sql
-- Apply migration
psql -d your_database < supabase/migrations/20250122_shared_couple_system.sql
```

#### 2. Use Scope in Components
```tsx
import { useScope } from '@/hooks/useScope';

function ChecklistPage() {
  const { weddingId, isWedding, getScopeParams } = useScope();
  
  // Fetch with scope
  const { data } = useQuery({
    queryKey: ['checklist', weddingId],
    queryFn: () => fetch(`/api/planning/checklist?${new URLSearchParams(getScopeParams())}`)
  });
  
  // Create with scope
  const createTask = async (task) => {
    await fetch('/api/planning/checklist', {
      method: 'POST',
      body: JSON.stringify({
        task,
        weddingId // Pass scope
      })
    });
  };
}
```

#### 3. Add Context Switcher
```tsx
import ContextSwitcher from '@/components/layout/ContextSwitcher';

export default function Layout({ children }) {
  return (
    <div>
      <ContextSwitcher compact />
      {children}
    </div>
  );
}
```

### For Users

#### Creating a Wedding
```typescript
// POST /api/weddings
{
  "title": "Alex & Arya's Wedding",
  "event_date": "2025-12-25",
  "city": "Mumbai"
}
// Creator automatically added as 'owner'
```

#### Inviting Partner
```typescript
// POST /api/weddings/{wedding_id}/invite
{
  "email": "partner@example.com",
  "role": "partner"
}
// Returns: { invite, inviteUrl }
// Send inviteUrl to partner
```

#### Accepting Invite
```typescript
// POST /api/weddings/invite/accept
{
  "token": "abc123..."
}
// User added to wedding_members with 'partner' role
```

#### Switching Scope
```typescript
// User clicks "Our Wedding" in ContextSwitcher
setWeddingScope(weddingId, "Alex & Arya's Wedding");

// All subsequent API calls pass weddingId
// RLS automatically filters to shared items
```

## Security

### Row Level Security
Every table has **two policies**:

1. **Personal Policy**: `user_id = auth.uid() AND wedding_id IS NULL`
2. **Wedding Policy**: `wedding_id IN (SELECT wedding_id FROM wedding_members WHERE user_id = auth.uid() AND status = 'active')`

### Invite Tokens
- Randomly generated, 7-day expiry
- Email must match invitee's account email
- Single-use (status changes to 'accepted')

### Role Permissions
- **Owner**: Full control (edit, delete wedding)
- **Partner**: Edit wedding, manage shared data
- **Collaborator**: View + edit shared data (future use)

## Migration Path

### Existing Users
1. All current items remain **personal** (user_id set, wedding_id NULL)
2. No forced migration
3. User creates wedding when ready
4. User selectively moves items to wedding scope

### Backward Compatibility
- Personal-only usage continues to work
- APIs accept optional `weddingId` param
- Default behavior unchanged (personal scope)

## Testing Checklist

### Unit Tests
- [ ] RLS policies enforce correct access
- [ ] Scope constraint prevents invalid data
- [ ] Invite tokens validate correctly

### Integration Tests
- [ ] Two users join same wedding
- [ ] Both see shared items
- [ ] Third user cannot access
- [ ] Personal items remain separate

### E2E Scenarios
1. **New Couple**
   - User A creates wedding
   - User A invites User B
   - User B accepts
   - Both add/edit shared items

2. **Existing Users Connect**
   - User A has personal checklist (10 items)
   - User B has personal budget (5 items)
   - User A creates wedding, invites User B
   - User A moves 5 checklist items to wedding
   - User B moves 3 budget items to wedding
   - Both see shared items in "Our Wedding" context
   - Personal items still visible in "My Items"

3. **Scope Switching**
   - User adds task in personal scope
   - User switches to wedding scope
   - User adds task (now shared)
   - Partner sees only wedding task

## API Reference

### Weddings

#### Create Wedding
```http
POST /api/weddings
Content-Type: application/json

{
  "title": "Our Wedding",
  "event_date": "2025-12-25",
  "city": "Mumbai"
}

Response:
{
  "wedding": {
    "id": "uuid",
    "title": "Our Wedding",
    ...
  }
}
```

#### List Weddings
```http
GET /api/weddings

Response:
{
  "weddings": [
    {
      "id": "uuid",
      "title": "Our Wedding",
      "my_role": "owner",
      ...
    }
  ]
}
```

#### Invite to Wedding
```http
POST /api/weddings/{id}/invite
Content-Type: application/json

{
  "email": "partner@example.com",
  "role": "partner"
}

Response:
{
  "invite": {...},
  "inviteUrl": "https://wedspace.in/invite/abc123"
}
```

#### Accept Invite
```http
POST /api/weddings/invite/accept
Content-Type: application/json

{
  "token": "abc123"
}

Response:
{
  "success": true,
  "wedding_id": "uuid",
  "member": {...}
}
```

### Planning with Scope

#### Get Checklist (Personal)
```http
GET /api/planning/checklist

Response:
{
  "tasks": [
    { "id": "1", "user_id": "user123", "wedding_id": null, ... }
  ]
}
```

#### Get Checklist (Wedding)
```http
GET /api/planning/checklist?weddingId=uuid

Response:
{
  "tasks": [
    { "id": "2", "user_id": null, "wedding_id": "uuid", ... }
  ]
}
```

#### Create Task (Shared)
```http
POST /api/planning/checklist
Content-Type: application/json

{
  "task": { "title": "Book venue", ... },
  "weddingId": "uuid"
}

Response:
{
  "task": {
    "id": "3",
    "user_id": null,
    "wedding_id": "uuid",
    ...
  }
}
```

## Next Steps

### Phase 1: Core Integration (Week 1)
1. Add `<ContextSwitcher />` to main layout
2. Update planning pages to use `useScope()`
3. Test 2-user shared workflow

### Phase 2: UI Polish (Week 2)
4. Build InvitePartnerModal
5. Add scope badges to list items
6. Create wedding settings page
7. Show "Shared with Partner" indicators

### Phase 3: Advanced Features (Week 3-4)
8. Activity feed for partner changes
9. AI assistant wedding scope support
10. Real-time sync with Supabase subscriptions
11. Conflict resolution for concurrent edits
12. Mobile app scope switcher

## Troubleshooting

### "User not authorized" error
- Check RLS policies are enabled
- Verify user is in `wedding_members` with `status = 'active'`
- Confirm `weddingId` matches user's membership

### Scope constraint violation
- Ensure exactly one of `user_id` OR `wedding_id` is set
- Never set both or neither

### Invite not working
- Check token hasn't expired (7 days)
- Verify email matches user's account email
- Confirm invite status is 'pending'

## Support

For implementation questions:
1. Check this guide
2. Review `supabase/migrations/20250122_shared_couple_system.sql`
3. Examine `src/types/wedding.ts` for data structures
4. Test API routes with provided examples

---

**Status**: ✅ Database & APIs Complete | ⏳ UI Integration Pending
**Last Updated**: 2025-01-22
