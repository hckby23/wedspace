import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const acceptSchema = z.object({
  token: z.string()
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { token } = acceptSchema.parse(body);

    // Get invite
    const { data: invite, error: inviteError } = await supabase
      .from('wedding_invites')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 404 });
    }

    // Check expiry
    if (new Date(invite.expires_at) < new Date()) {
      await supabase
        .from('wedding_invites')
        .update({ status: 'expired' })
        .eq('id', invite.id);
      
      return NextResponse.json({ error: 'Invite expired' }, { status: 400 });
    }

    // Get user's email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    // Verify email matches
    if (profile?.email !== invite.email) {
      return NextResponse.json({ error: 'Invite is for a different email address' }, { status: 403 });
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from('wedding_members')
      .select('user_id')
      .eq('wedding_id', invite.wedding_id)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      // Mark invite as accepted
      await supabase
        .from('wedding_invites')
        .update({ status: 'accepted' })
        .eq('id', invite.id);
      
      return NextResponse.json({ error: 'Already a member', wedding_id: invite.wedding_id }, { status: 400 });
    }

    // Add to wedding members
    const { data: member, error: memberError } = await supabase
      .from('wedding_members')
      .insert({
        wedding_id: invite.wedding_id,
        user_id: user.id,
        role: invite.role,
        status: 'active',
        invited_by: invite.invited_by
      })
      .select()
      .single();

    if (memberError) throw memberError;

    // Mark invite as accepted
    await supabase
      .from('wedding_invites')
      .update({ status: 'accepted' })
      .eq('id', invite.id);

    return NextResponse.json({ 
      success: true,
      wedding_id: invite.wedding_id,
      member
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    console.error('Accept invite error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
