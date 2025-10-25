import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a stub implementation of the planning assistant API
// In a real implementation, this would connect to OpenAI or another AI service
export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    // Get the last user message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    
    // Simple response based on keywords in the user's message
    let responseContent = "I'm your wedding planning assistant. How can I help you today?";
    
    if (lastUserMessage) {
      const userMessage = lastUserMessage.content.toLowerCase();
      
      if (userMessage.includes('venue') || userMessage.includes('location')) {
        responseContent = "Looking for the perfect venue? I recommend considering factors like guest count, budget, and location. Would you like me to help you search for venues in a specific area?";
      } else if (userMessage.includes('budget') || userMessage.includes('cost')) {
        responseContent = "Managing your wedding budget is crucial. Typically, venues take about 40-50% of the total budget, catering about 20-25%, and the rest is divided among photography, attire, decor, and other elements. What's your total budget range?";
      } else if (userMessage.includes('vendor') || userMessage.includes('caterer') || userMessage.includes('photographer')) {
        responseContent = "Finding reliable vendors is important for your special day. I can help you find top-rated vendors based on your style preferences and budget. What specific type of vendor are you looking for?";
      } else if (userMessage.includes('date') || userMessage.includes('season')) {
        responseContent = "The wedding date affects many aspects including venue availability, costs, and guest attendance. In India, wedding seasons typically fall between October-December and January-March. Do you have a specific month in mind?";
      }
    }
    
    // Return the response in the format expected by the AI SDK
    return NextResponse.json({
      role: 'assistant',
      content: responseContent,
    });
  } catch (error) {
    console.error('Error in planning assistant API:', error);
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 }
    );
  }
}
