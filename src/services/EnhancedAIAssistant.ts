/**
 * Enhanced AI Assistant Service
 * Integrates OpenRouter API with function calling to provide intelligent wedding planning assistance
 */

import { OpenRouterService, type OpenRouterMessage } from './OpenRouterService';
import { AI_TOOLS, TOOL_CATEGORIES } from './AIToolDefinitions';
import { AIToolExecutor, type ToolExecutionResult } from './AIToolExecutor';

export interface AssistantContext {
  userId: string;
  conversationId?: string;
  weddingId?: string;
  userPreferences?: any;
  budgetInfo?: {
    total: number;
    spent: number;
    remaining: number;
  };
  eventDetails?: {
    date?: string;
    guestCount?: number;
    location?: string;
  };
  planningStage?: string;
  recentInteractions?: any[];
}

export interface AssistantResponse {
  message: string;
  conversationId: string;
  toolsUsed?: string[];
  recommendations?: any[];
  suggestions?: string[];
  metadata?: {
    tokensUsed: number;
    responseTime: number;
  };
}

export class EnhancedAIAssistant {
  private conversationHistory: Map<string, OpenRouterMessage[]> = new Map();
  private maxHistoryLength = 20; // Keep last 20 messages

  /**
   * Send a message to the AI assistant
   */
  async chat(
    message: string,
    context: AssistantContext
  ): Promise<AssistantResponse> {
    const startTime = Date.now();
    const conversationId = context.conversationId || this.generateConversationId();
    
    // Get or initialize conversation history
    let history = this.conversationHistory.get(conversationId) || [];
    
    // Build system prompt
    const systemPrompt = OpenRouterService.createSystemPrompt({
      userPreferences: context.userPreferences,
      budgetInfo: context.budgetInfo,
      eventDetails: context.eventDetails,
      planningStage: context.planningStage
    });

    // Prepare messages
    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    // Determine which tools to make available based on query
    const availableTools = this.selectRelevantTools(message, context);

    try {
      // Call OpenRouter with function calling
      const response = await OpenRouterService.chat({
        messages,
        functions: availableTools,
        function_call: 'auto',
        temperature: 0.7,
        max_tokens: 1500
      });

      const choice = response.choices[0];
      const toolsUsed: string[] = [];
      let finalMessage = choice.message.content || '';

      // Check if AI wants to use a tool
      if (choice.message.function_call) {
        const toolName = choice.message.function_call.name;
        const toolArgs = OpenRouterService.parseFunctionArguments(
          choice.message.function_call.arguments
        );

        if (toolArgs) {
          toolsUsed.push(toolName);

          // Execute the tool
          const executor = new AIToolExecutor(context.userId, context.weddingId);
          const toolResult = await executor.execute(toolName, toolArgs);

          // Add function result to conversation
          messages.push({
            role: 'function',
            name: toolName,
            content: JSON.stringify(toolResult)
          });

          // Get AI's final response incorporating the tool result
          const followUpResponse = await OpenRouterService.chat({
            messages,
            temperature: 0.7,
            max_tokens: 1000
          });

          finalMessage = followUpResponse.choices[0].message.content || finalMessage;
        }
      }

      // Update conversation history
      history.push(
        { role: 'user', content: message },
        { role: 'assistant', content: finalMessage }
      );

      // Trim history if needed
      if (history.length > this.maxHistoryLength) {
        history = history.slice(-this.maxHistoryLength);
      }

      this.conversationHistory.set(conversationId, history);

      // Generate suggestions for follow-up questions
      const suggestions = this.generateSuggestions(message, context, toolsUsed);

      return {
        message: finalMessage,
        conversationId,
        toolsUsed,
        suggestions,
        metadata: {
          tokensUsed: response.usage.total_tokens,
          responseTime: Date.now() - startTime
        }
      };

    } catch (error) {
      console.error('AI Assistant error:', error);
      
      // Fallback response
      return {
        message: "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question.",
        conversationId,
        suggestions: [
          "Show me venues in my area",
          "Help me plan my budget",
          "What tasks should I complete next?"
        ]
      };
    }
  }

  /**
   * Stream a response (for real-time chat UI)
   */
  async streamChat(
    message: string,
    context: AssistantContext,
    onChunk: (chunk: string) => void,
    onComplete: (response: AssistantResponse) => void
  ): Promise<void> {
    const conversationId = context.conversationId || this.generateConversationId();
    const history = this.conversationHistory.get(conversationId) || [];

    const systemPrompt = OpenRouterService.createSystemPrompt({
      userPreferences: context.userPreferences,
      budgetInfo: context.budgetInfo,
      eventDetails: context.eventDetails,
      planningStage: context.planningStage
    });

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    const availableTools = this.selectRelevantTools(message, context);
    let fullResponse = '';
    let functionCallName = '';
    let functionCallArgs = '';

    try {
      await OpenRouterService.streamChat(
        {
          messages,
          functions: availableTools,
          function_call: 'auto',
          temperature: 0.7
        },
        (chunk) => {
          fullResponse += chunk;
          onChunk(chunk);
        },
        (name, args) => {
          functionCallName = name;
          functionCallArgs += args;
        }
      );

      // Handle function call if present
      const toolsUsed: string[] = [];
      if (functionCallName && functionCallArgs) {
        toolsUsed.push(functionCallName);
        const toolArgs = OpenRouterService.parseFunctionArguments(functionCallArgs);
        
        if (toolArgs) {
          const executor = new AIToolExecutor(context.userId, context.weddingId);
          await executor.execute(functionCallName, toolArgs);
        }
      }

      // Update history
      history.push(
        { role: 'user', content: message },
        { role: 'assistant', content: fullResponse }
      );
      this.conversationHistory.set(conversationId, history);

      onComplete({
        message: fullResponse,
        conversationId,
        toolsUsed,
        suggestions: this.generateSuggestions(message, context, toolsUsed)
      });

    } catch (error) {
      console.error('Stream error:', error);
      onComplete({
        message: "Sorry, I encountered an error while processing your request.",
        conversationId,
        suggestions: []
      });
    }
  }

  /**
   * Clear conversation history
   */
  clearConversation(conversationId: string): void {
    this.conversationHistory.delete(conversationId);
  }

  /**
   * Get conversation history
   */
  getConversationHistory(conversationId: string): OpenRouterMessage[] {
    return this.conversationHistory.get(conversationId) || [];
  }

  /**
   * Select relevant tools based on the query and context
   */
  private selectRelevantTools(message: string, context: AssistantContext): typeof AI_TOOLS {
    const lowerMessage = message.toLowerCase();
    const selectedTools: typeof AI_TOOLS = [];

    // Always include basic tools
    selectedTools.push(...TOOL_CATEGORIES.SEARCH);
    selectedTools.push(...TOOL_CATEGORIES.PREFERENCES);

    // Add tools based on keywords
    if (lowerMessage.match(/task|todo|checklist|remind|complete/)) {
      selectedTools.push(...TOOL_CATEGORIES.CHECKLIST);
    }

    if (lowerMessage.match(/budget|cost|price|spend|payment|pay/)) {
      selectedTools.push(...TOOL_CATEGORIES.BUDGET);
    }

    if (lowerMessage.match(/timeline|schedule|deadline|when|date/)) {
      selectedTools.push(...TOOL_CATEGORIES.TIMELINE);
    }

    if (lowerMessage.match(/guest|invite|rsvp|attendance/)) {
      selectedTools.push(...TOOL_CATEGORIES.GUESTS);
    }

    if (lowerMessage.match(/venue|hall|location|place/)) {
      const venueTool = AI_TOOLS.find(t => t.name === 'search_venues');
      if (venueTool) selectedTools.push(venueTool);
    }

    if (lowerMessage.match(/vendor|photographer|caterer|decorator|makeup/)) {
      const vendorTool = AI_TOOLS.find(t => t.name === 'search_vendors');
      if (vendorTool) selectedTools.push(vendorTool);
    }

    if (lowerMessage.match(/export|download|save|backup/)) {
      selectedTools.push(...TOOL_CATEGORIES.EXPORT);
    }

    // Remove duplicates
    return Array.from(new Set(selectedTools));
  }

  /**
   * Generate smart follow-up suggestions
   */
  private generateSuggestions(
    message: string,
    context: AssistantContext,
    toolsUsed: string[]
  ): string[] {
    const suggestions: string[] = [];

    // Context-aware suggestions
    if (toolsUsed.includes('add_checklist_task')) {
      suggestions.push(
        "What other tasks should I add?",
        "Show me my current checklist",
        "What tasks are high priority?"
      );
    }

    if (toolsUsed.includes('add_budget_item')) {
      suggestions.push(
        "Show me my budget summary",
        "What's my remaining budget?",
        "Suggest budget optimizations"
      );
    }

    if (toolsUsed.includes('search_venues') || toolsUsed.includes('search_vendors')) {
      suggestions.push(
        "Compare these options",
        "What are the pros and cons?",
        "Show me similar options"
      );
    }

    // Default suggestions based on planning stage
    if (context.planningStage === 'early') {
      suggestions.push(
        "Help me set a realistic budget",
        "Create a planning timeline",
        "What should I book first?"
      );
    } else if (context.planningStage === 'mid') {
      suggestions.push(
        "Review my progress",
        "What am I missing?",
        "Suggest vendors I haven't booked"
      );
    }

    // General helpful suggestions
    if (suggestions.length < 3) {
      suggestions.push(
        "Show me my wedding dashboard",
        "What tasks are due soon?",
        "Recommend venues in my budget"
      );
    }

    return suggestions.slice(0, 4);
  }

  /**
   * Generate a unique conversation ID
   */
  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get conversation insights (for analytics)
   */
  getConversationInsights(conversationId: string): {
    messageCount: number;
    toolUsageCount: number;
    averageResponseLength: number;
  } {
    const history = this.conversationHistory.get(conversationId) || [];
    const assistantMessages = history.filter(m => m.role === 'assistant');
    const functionCalls = history.filter(m => m.role === 'function');

    return {
      messageCount: history.length,
      toolUsageCount: functionCalls.length,
      averageResponseLength: assistantMessages.reduce((sum, m) => sum + (m.content?.length || 0), 0) / (assistantMessages.length || 1)
    };
  }
}
