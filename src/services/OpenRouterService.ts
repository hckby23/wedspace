/**
 * OpenRouter API Service
 * Provides AI capabilities through OpenRouter with function calling support
 */

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface OpenRouterFunction {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  functions?: OpenRouterFunction[];
  function_call?: 'auto' | 'none' | { name: string };
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string | null;
      function_call?: {
        name: string;
        arguments: string;
      };
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterService {
  private static readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private static readonly DEFAULT_MODEL = 'anthropic/claude-3.5-sonnet'; // or 'openai/gpt-4-turbo'

  /**
   * Send a chat completion request to OpenRouter
   */
  static async chat(request: Partial<OpenRouterRequest>): Promise<OpenRouterResponse> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY environment variable is not set');
    }

    const fullRequest: OpenRouterRequest = {
      model: request.model || this.DEFAULT_MODEL,
      messages: request.messages || [],
      functions: request.functions,
      function_call: request.function_call,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 2000,
      top_p: request.top_p ?? 1,
      frequency_penalty: request.frequency_penalty ?? 0,
      presence_penalty: request.presence_penalty ?? 0,
    };

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://wedspace.in',
        'X-Title': 'WedSpace AI Assistant',
      },
      body: JSON.stringify(fullRequest),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`OpenRouter API error: ${error.error || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Stream a chat completion (for real-time responses)
   */
  static async streamChat(
    request: Partial<OpenRouterRequest>,
    onChunk: (content: string) => void,
    onFunctionCall?: (name: string, args: string) => void
  ): Promise<void> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY environment variable is not set');
    }

    const fullRequest: OpenRouterRequest & { stream: boolean } = {
      model: request.model || this.DEFAULT_MODEL,
      messages: request.messages || [],
      functions: request.functions,
      function_call: request.function_call,
      temperature: request.temperature ?? 0.7,
      stream: true,
    };

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://wedspace.in',
        'X-Title': 'WedSpace AI Assistant',
      },
      body: JSON.stringify(fullRequest),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices[0]?.delta;

            if (delta?.content) {
              onChunk(delta.content);
            }

            if (delta?.function_call) {
              onFunctionCall?.(
                delta.function_call.name,
                delta.function_call.arguments
              );
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
  }

  /**
   * Create a system prompt with user context
   */
  static createSystemPrompt(context: {
    userPreferences?: any;
    budgetInfo?: any;
    eventDetails?: any;
    planningStage?: string;
  }): string {
    return `You are WedSpace AI, an intelligent wedding planning assistant specializing in the Indian wedding market.

**Your Capabilities:**
- Understand natural language queries about venues, vendors, and planning
- Recommend venues and vendors based on budget, location, and preferences
- Help manage wedding planning tasks, budget, timeline, and guest list
- Provide cultural insights for Indian weddings (Hindu, Muslim, Sikh, Christian traditions)
- Offer data-driven suggestions based on market trends and user preferences

**User Context:**
${context.userPreferences ? `Preferences: ${JSON.stringify(context.userPreferences, null, 2)}` : ''}
${context.budgetInfo ? `Budget: Total ${context.budgetInfo.total}, Spent ${context.budgetInfo.spent}, Remaining ${context.budgetInfo.remaining}` : ''}
${context.eventDetails ? `Event Details: ${JSON.stringify(context.eventDetails, null, 2)}` : ''}
${context.planningStage ? `Planning Stage: ${context.planningStage}` : ''}

**Guidelines:**
- Be warm, helpful, and culturally sensitive
- Provide specific, actionable recommendations
- Use rupees (₹) for all pricing
- Consider Indian wedding customs and traditions
- Ask clarifying questions when needed
- Use function calls to modify planning data when appropriate
- Proactively suggest optimizations and cost savings`;
  }

  /**
   * Parse function call arguments safely
   */
  static parseFunctionArguments<T = any>(args: string): T | null {
    try {
      return JSON.parse(args);
    } catch (e) {
      console.error('Failed to parse function arguments:', e);
      return null;
    }
  }
}
