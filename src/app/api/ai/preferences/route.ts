import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { DEFAULT_AI_PREFERENCES } from '@/types/ai-preferences';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch or create AI preferences
    let { data: preferences, error } = await supabase
      .from('ai_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // No preferences found, create default ones
      const { data: newPreferences, error: createError } = await supabase
        .from('ai_preferences')
        .insert({
          user_id: user.id,
          ...DEFAULT_AI_PREFERENCES,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating AI preferences:', createError);
        return NextResponse.json({ error: 'Failed to create preferences' }, { status: 500 });
      }

      preferences = newPreferences;
    } else if (error) {
      console.error('Error fetching AI preferences:', error);
      return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('AI Preferences GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();

    const { data: preferences, error } = await supabase
      .from('ai_preferences')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating AI preferences:', error);
      return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('AI Preferences PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Reset to default preferences
    const { data: preferences, error } = await supabase
      .from('ai_preferences')
      .update({
        ...DEFAULT_AI_PREFERENCES,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error resetting AI preferences:', error);
      return NextResponse.json({ error: 'Failed to reset preferences' }, { status: 500 });
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('AI Preferences DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
