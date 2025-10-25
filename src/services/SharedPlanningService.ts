import { createClient } from '@/integrations/supabase/client';
import type { Database } from '@/types/db';

type SharedAccess = Database['public']['Tables']['shared_planning_access']['Row'];
type SharedAccessInsert = Database['public']['Tables']['shared_planning_access']['Insert'];

export class SharedPlanningService {
  private supabase = createClient();

  // Invite someone to collaborate
  async inviteCollaborator(params: {
    userId: string;
    email: string;
    accessLevel: 'view' | 'edit' | 'admin';
  }): Promise<SharedAccess | null> {
    try {
      const invitationToken = this.generateToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      const { data, error } = await this.supabase
        .from('shared_planning_access')
        .insert({
          user_id: params.userId,
          shared_with_email: params.email,
          access_level: params.accessLevel,
          invitation_status: 'pending',
          invitation_token: invitationToken,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // TODO: Send invitation email
      await this.sendInvitationEmail(params.email, invitationToken);

      return data;
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      return null;
    }
  }

  // Accept invitation
  async acceptInvitation(token: string, userId: string): Promise<boolean> {
    try {
      const { data: invitation } = await this.supabase
        .from('shared_planning_access')
        .select('*')
        .eq('invitation_token', token)
        .eq('invitation_status', 'pending')
        .single();

      if (!invitation) return false;

      // Check if expired
      if (new Date(invitation.expires_at!) < new Date()) {
        return false;
      }

      const { error } = await this.supabase
        .from('shared_planning_access')
        .update({
          invitation_status: 'accepted',
          shared_with_user_id: userId
        })
        .eq('id', invitation.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error accepting invitation:', error);
      return false;
    }
  }

  // Get collaborators for a user
  async getCollaborators(userId: string): Promise<SharedAccess[]> {
    try {
      const { data, error } = await this.supabase
        .from('shared_planning_access')
        .select('*')
        .eq('user_id', userId)
        .eq('invitation_status', 'accepted');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      return [];
    }
  }

  // Get invitations for a user (they were invited)
  async getMyInvitations(userEmail: string): Promise<SharedAccess[]> {
    try {
      const { data, error } = await this.supabase
        .from('shared_planning_access')
        .select('*')
        .eq('shared_with_email', userEmail)
        .eq('invitation_status', 'pending');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching invitations:', error);
      return [];
    }
  }

  // Remove collaborator
  async removeCollaborator(accessId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('shared_planning_access')
        .delete()
        .eq('id', accessId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing collaborator:', error);
      return false;
    }
  }

  // Update access level
  async updateAccessLevel(accessId: string, newLevel: 'view' | 'edit' | 'admin'): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('shared_planning_access')
        .update({ access_level: newLevel })
        .eq('id', accessId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating access level:', error);
      return false;
    }
  }

  // Check if user has access to another user's planning
  async hasAccess(ownerId: string, accessorId: string): Promise<{
    hasAccess: boolean;
    level?: 'view' | 'edit' | 'admin';
  }> {
    try {
      const { data } = await this.supabase
        .from('shared_planning_access')
        .select('access_level')
        .eq('user_id', ownerId)
        .eq('shared_with_user_id', accessorId)
        .eq('invitation_status', 'accepted')
        .single();

      if (!data) return { hasAccess: false };

      return {
        hasAccess: true,
        level: data.access_level
      };
    } catch (error) {
      return { hasAccess: false };
    }
  }

  // Helper: Generate random token
  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Helper: Send invitation email (mock - would use real email service)
  private async sendInvitationEmail(email: string, token: string): Promise<void> {
    console.log(`Sending invitation to ${email} with token ${token}`);
    // In production: integrate with email service (SendGrid, AWS SES, etc.)
  }
}

export const sharedPlanningService = new SharedPlanningService();
