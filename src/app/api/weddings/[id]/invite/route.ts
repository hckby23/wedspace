import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['partner', 'collaborator']).optional().default('partner')
});

function generateToken(): string {
  return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, role } = inviteSchema.parse(body);

    // Check if email already has an account and is a member
    const { data: inviteeProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (inviteeProfile) {
      const { data: existingMember } = await supabase
        .from('wedding_members')
        .select('user_id')
        .eq('wedding_id', params.id)
        .eq('user_id', inviteeProfile.id)
        .single();

      if (existingMember) {
        return NextResponse.json({ error: 'User already a member' }, { status: 400 });
      }
    }

    // Check for pending invite
    const { data: existingInvite } = await supabase
      .from('wedding_invites')
      .select('id')
      .eq('wedding_id', params.id)
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (existingInvite) {
      return NextResponse.json({ error: 'Invite already sent' }, { status: 400 });
    }

    // Generate unique token
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Create invite
    const { data: invite, error: inviteError } = await supabase
      .from('wedding_invites')
      .insert({
        wedding_id: params.id,
        email,
        token,
        role,
        invited_by: user.id,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (inviteError) throw inviteError;

    // TODO: Send email with invite link (integrate with email service)
    const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/invite/${token}`;

    return NextResponse.json({ 
      invite,
      inviteUrl
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    console.error('Invite POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
