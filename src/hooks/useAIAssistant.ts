"use client";

import { useState, useCallback } from 'react';
import { AIService } from '@/services/AIService';

export interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  recommendations?: any[];
}

export function useAIAssistant() {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    message: string,
    context?: {
      userPreferences?: Record<string, any>;
      currentPage?: string;
    }
  ) => {
    setLoading(true);
    setError(null);

    // Add user message
    const userMessage: AssistantMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const result = await AIService.chatWithAssistant(message, {
        conversationId: conversationId || undefined,
        ...context,
      });

      if (result.success && result.data) {
        // Add assistant response
        const assistantMessage: AssistantMessage = {
          role: 'assistant',
          content: result.data.response,
          timestamp: new Date(),
          suggestions: result.data.suggestions,
          recommendations: result.data.recommendations,
        };
        setMessages(prev => [...prev, assistantMessage]);
        setConversationId(result.data.conversationId);
        return result.data;
      } else {
        setError(result.error || 'Failed to get response');
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearConversation,
    conversationId,
  };
}
