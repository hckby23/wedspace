import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { EnhancedAIAssistant, type AssistantContext } from '@/services/EnhancedAIAssistant';
import { z } from 'zod';

const chatRequestSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
  context: z.object({
    userId: z.string(),
    weddingId: z.string().optional(),
    userPreferences: z.any().optional(),
    budgetInfo: z.object({
      total: z.number().optional(),
      spent: z.number().optional(),
      remaining: z.number().optional()
    }).optional(),
    eventDetails: z.object({
      date: z.string().optional(),
      guestCount: z.number().optional(),
      location: z.string().optional()
    }).optional(),
    planningStage: z.string().optional()
  })
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { message, conversationId, context } = chatRequestSchema.parse(body);
    const weddingId = context.weddingId || body.weddingId;

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure userId matches authenticated user
    if (context.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Fetch user preferences if not provided
    let userPreferences = context.userPreferences;
    if (!userPreferences) {
      const { data: prefs } = await supabase
        .from('ai_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      userPreferences = prefs;
    }

    // Fetch budget info if not provided
    let budgetInfo = context.budgetInfo;
    if (!budgetInfo) {
      const { data: budgetItems } = await supabase
        .from('budget_items')
        .select('amount, actual_amount')
        .eq('user_id', user.id);

      if (budgetItems && budgetItems.length > 0) {
        const total = budgetItems.reduce((sum, item) => sum + item.amount, 0);
        const spent = budgetItems.reduce((sum, item) => sum + (item.actual_amount || item.amount), 0);
        budgetInfo = { total, spent, remaining: total - spent };
      }
    }

    // Fetch event details if not provided
    let eventDetails = context.eventDetails;
    if (!eventDetails) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('wedding_date, city, guest_count_estimate')
        .eq('id', user.id)
        .single();

      if (profile) {
        eventDetails = {
          date: profile.wedding_date,
          guestCount: profile.guest_count_estimate,
          location: profile.city
        };
      }
    }

    // Build complete context
    const fullContext: AssistantContext = {
      userId: user.id,
      conversationId,
      weddingId,
      userPreferences,
      budgetInfo: budgetInfo as any,
      eventDetails,
      planningStage: context.planningStage || 'mid'
    };

    // Initialize AI assistant
    const assistant = new EnhancedAIAssistant();

    // Get AI response
    const response = await assistant.chat(message, fullContext);

    // Log interaction for analytics
    await supabase.from('ai_interactions').insert({
      user_id: user.id,
      conversation_id: response.conversationId,
      user_message: message,
      ai_response: response.message,
      tools_used: response.toolsUsed || [],
      tokens_used: response.metadata?.tokensUsed || 0,
      response_time_ms: response.metadata?.responseTime || 0
    });

    return NextResponse.json({
      success: true,
      response: response.message,
      conversationId: response.conversationId,
      suggestions: response.suggestions,
      toolsUsed: response.toolsUsed,
      metadata: response.metadata
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('AI Chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
