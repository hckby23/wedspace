/**
 * Wedding and Shared Planning Types
 * Supports personal vs shared (couple) data scopes
 */

export type WeddingRole = 'owner' | 'partner' | 'collaborator';
export type MemberStatus = 'invited' | 'active' | 'left';
export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';
export type Scope = 'personal' | 'wedding';

export interface Wedding {
  id: string;
  title: string;
  event_date?: string;
  city?: string;
  guest_count_estimate?: number;
  total_budget?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  members?: WeddingMember[];
  my_role?: WeddingRole;
}

export interface WeddingMember {
  wedding_id: string;
  user_id: string;
  role: WeddingRole;
  status: MemberStatus;
  invited_by?: string;
  joined_at: string;
  created_at: string;
  user?: {
    id: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface WeddingInvite {
  id: string;
  wedding_id: string;
  email: string;
  token: string;
  role: WeddingRole;
  status: InviteStatus;
  invited_by?: string;
  expires_at: string;
  created_at: string;
}

export interface WeddingWithMembers extends Wedding {
  members: WeddingMember[];
  my_role?: WeddingRole;
}

export interface ActivityEvent {
  id: string;
  wedding_id: string;
  user_id?: string;
  event_type: string;
  event_data: Record<string, any>;
  created_at: string;
  user?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface ScopeContext {
  scope: Scope;
  weddingId?: string;
  userId: string;
}

// For API requests
export interface CreateWeddingRequest {
  title: string;
  event_date?: string;
  city?: string;
  guest_count_estimate?: number;
  total_budget?: number;
}

export interface InviteToWeddingRequest {
  email: string;
  role?: WeddingRole;
}

export interface AcceptInviteRequest {
  token: string;
}

export interface UpdateWeddingRequest {
  title?: string;
  event_date?: string;
  city?: string;
  guest_count_estimate?: number;
  total_budget?: number;
}

// For items that can be personal or shared
export interface ScopedItem {
  user_id?: string;
  wedding_id?: string;
}

export interface MoveScopeRequest {
  scope: Scope;
  wedding_id?: string;
}
