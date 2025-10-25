import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const assistantQuerySchema = z.object({
  message: z.string().min(1),
  context: z.object({
    user_id: z.string().optional(),
    budget: z.number().optional(),
    guest_count: z.number().optional(),
    event_date: z.string().optional(),
    location: z.string().optional(),
    preferences: z.array(z.string()).optional(),
  }).optional(),
  conversation_id: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { message, context, conversation_id } = assistantQuerySchema.parse(body);

    // Get user context if available
    let userProfile = null;
    if (context?.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', context.user_id)
        .single();
      userProfile = profile;
    }

    // Build context for AI assistant
    const systemPrompt = `You are WedSpace AI, a helpful wedding planning assistant for the Indian market. 
    You help couples find venues, vendors, and plan their perfect wedding.
    
    User Context:
    ${userProfile ? `- User: ${userProfile.full_name} from ${userProfile.city}` : ''}
    ${context?.budget ? `- Budget: ₹${context.budget.toLocaleString()}` : ''}
    ${context?.guest_count ? `- Guest Count: ${context.guest_count}` : ''}
    ${context?.event_date ? `- Event Date: ${context.event_date}` : ''}
    ${context?.location ? `- Preferred Location: ${context.location}` : ''}
    ${context?.preferences ? `- Preferences: ${context.preferences.join(', ')}` : ''}
    
    Guidelines:
    - Be helpful, friendly, and culturally aware of Indian wedding traditions
    - Provide specific recommendations when possible
    - Ask clarifying questions to better understand needs
    - Suggest venues and vendors from our platform
    - Help with budget planning and timeline management
    - Be concise but informative`;

    // Get relevant listings based on context
    let relevantListings = [];
    if (context?.location || context?.budget) {
      const { data: listings } = await supabase
        .rpc('search_listings', {
          search_query: message,
          city_filter: context?.location || null,
          max_price: context?.budget || null,
          guest_count_filter: context?.guest_count || null,
          limit_count: 5,
          offset_count: 0,
        });
      relevantListings = listings || [];
    }

    // Mock AI response (replace with actual AI service)
    const aiResponse = generateMockAIResponse(message, context, relevantListings);

    // Log the conversation
    if (context?.user_id) {
      await supabase.from('events').insert({
        user_id: context.user_id,
        event_type: 'ai_assistant_query',
        event_data: {
          message,
          context,
          response: aiResponse,
          conversation_id,
        },
      });
    }

    return NextResponse.json({
      response: aiResponse,
      suggestions: generateSuggestions(message, context),
      recommendations: relevantListings.slice(0, 3),
      conversation_id: conversation_id || generateConversationId(),
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    console.error('AI Assistant error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateMockAIResponse(message: string, context: any, listings: any[]): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('venue') || lowerMessage.includes('hall')) {
    if (context?.budget && context.budget < 100000) {
      return `Based on your budget of ₹${context.budget.toLocaleString()}, I'd recommend looking at garden venues or community halls. These typically offer great value while still providing a beautiful setting for your wedding. ${listings.length > 0 ? `I found ${listings.length} venues that match your criteria.` : ''}`;
    } else if (context?.guest_count && context.guest_count > 500) {
      return `For a large wedding with ${context.guest_count} guests, you'll need a spacious venue. I recommend banquet halls or large resorts that can accommodate your guest list comfortably. ${listings.length > 0 ? `Here are some options that can handle your guest count.` : ''}`;
    } else {
      return `I can help you find the perfect venue! ${context?.location ? `In ${context.location}, ` : ''}there are many beautiful options ranging from traditional banquet halls to modern resorts. What type of ambiance are you looking for - traditional, modern, or outdoor?`;
    }
  }
  
  if (lowerMessage.includes('photographer') || lowerMessage.includes('photography')) {
    return `Great choice focusing on photography! Your wedding photos will be treasured forever. I recommend looking for photographers who specialize in Indian weddings and understand the various ceremonies. ${listings.length > 0 ? `I found some excellent photographers in your area.` : ''} Would you prefer traditional posed shots, candid photography, or a mix of both?`;
  }
  
  if (lowerMessage.includes('budget') || lowerMessage.includes('cost')) {
    return `Wedding budgeting is crucial for a stress-free planning experience. ${context?.budget ? `With your budget of ₹${context.budget.toLocaleString()}, ` : ''}I recommend allocating: 40-50% for venue & catering, 10-15% for photography, 10-15% for decoration, 8-10% for attire & jewelry, and keeping 10-15% as buffer. Would you like me to help break this down further?`;
  }
  
  if (lowerMessage.includes('timeline') || lowerMessage.includes('planning')) {
    return `Wedding planning timeline is key to a smooth celebration! ${context?.event_date ? `With your wedding on ${context.event_date}, ` : ''}I recommend starting venue booking 6-12 months ahead, photographer booking 4-6 months ahead, and finalizing decorations 2-3 months before. Would you like a detailed month-by-month checklist?`;
  }
  
  return `I'm here to help with your wedding planning! Whether you need venue recommendations, vendor suggestions, budget planning, or timeline management, I can assist you. ${context?.location ? `Since you're planning in ${context.location}, ` : ''}I can provide personalized recommendations. What specific aspect of wedding planning would you like help with?`;
}

function generateSuggestions(message: string, context: any): string[] {
  const suggestions = [
    "Show me venues under ₹2 lakhs",
    "Find photographers in Mumbai",
    "Help me plan my wedding timeline",
    "What's a good budget breakdown?",
    "Show me decoration ideas",
  ];
  
  if (context?.location) {
    suggestions.unshift(`Find vendors in ${context.location}`);
  }
  
  if (context?.budget) {
    suggestions.unshift(`Show venues under ₹${context.budget.toLocaleString()}`);
  }
  
  return suggestions.slice(0, 4);
}

function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
