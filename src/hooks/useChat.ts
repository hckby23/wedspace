import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/ChatService';
import type { Database } from '@/types/db';

type ChatConversation = Database['public']['Tables']['chat_conversations']['Row'];
type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];

export function useChat(conversationId: string | null) {
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chat-messages', conversationId],
    queryFn: () => conversationId ? chatService.getMessages(conversationId) : Promise.resolve([]),
    enabled: !!conversationId,
    refetchInterval: false // Real-time updates via subscription
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (params: {
      senderId: string;
      senderType: 'user' | 'vendor';
      content: string;
      messageType?: 'text' | 'image' | 'document';
      attachmentUrl?: string;
    }) => {
      if (!conversationId) throw new Error('No conversation ID');
      return chatService.sendMessage({
        conversationId,
        ...params
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', conversationId] });
    }
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (params: { userId: string; userType: 'user' | 'vendor' }) => {
      if (!conversationId) throw new Error('No conversation ID');
      return chatService.markAsRead(conversationId, params.userId, params.userType);
    }
  });

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = chatService.subscribeToMessages(conversationId, (newMessage) => {
      queryClient.setQueryData<ChatMessage[]>(
        ['chat-messages', conversationId],
        (old = []) => [newMessage, ...old]
      );
    });

    setIsConnected(true);

    return () => {
      channel.unsubscribe();
      setIsConnected(false);
    };
  }, [conversationId, queryClient]);

  const sendMessage = useCallback(
    async (params: {
      senderId: string;
      senderType: 'user' | 'vendor';
      content: string;
      messageType?: 'text' | 'image' | 'document';
      attachmentUrl?: string;
    }) => {
      return sendMessageMutation.mutateAsync(params);
    },
    [sendMessageMutation]
  );

  const markAsRead = useCallback(
    async (userId: string, userType: 'user' | 'vendor') => {
      return markAsReadMutation.mutateAsync({ userId, userType });
    },
    [markAsReadMutation]
  );

  return {
    messages: messages.reverse(), // Reverse to show oldest first
    isLoading,
    isConnected,
    sendMessage,
    markAsRead,
    isSending: sendMessageMutation.isPending
  };
}

export function useConversations(userId: string | null) {
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['chat-conversations', userId],
    queryFn: () => userId ? chatService.getUserConversations(userId) : Promise.resolve([]),
    enabled: !!userId,
    refetchInterval: 30000 // Refetch every 30s
  });

  return {
    conversations,
    isLoading
  };
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      userId: string;
      listingId?: string;
      venueId?: string;
      vendorId?: string;
      vendorUserId?: string;
    }) => chatService.getOrCreateConversation(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    }
  });
}
