"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Clock, User, ChevronRight } from 'lucide-react';
import { useConversations } from '@/hooks/useChat';
import ChatWindow from '../chat/ChatWindow';
import type { Database } from '@/types/db';

type ChatConversation = Database['public']['Tables']['chat_conversations']['Row'];

interface ChatInboxWidgetProps {
  userId: string;
  userType: 'vendor' | 'venue';
  className?: string;
}

export default function ChatInboxWidget({ userId, userType, className = '' }: ChatInboxWidgetProps) {
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const { conversations, isLoading } = useConversations(userId);
  const currentUserType: 'vendor' | 'user' = userType === 'vendor' ? 'vendor' : 'user';

  const getUnreadCount = () => {
    return conversations.reduce((total, conv) => {
      return total + (currentUserType === 'vendor' ? conv.unread_count_vendor : conv.unread_count_user);
    }, 0);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (selectedConversation) {
    return (
      <div className={className}>
        <ChatWindow
          conversationId={selectedConversation.id}
          currentUserId={userId}
          currentUserType={currentUserType}
          recipientName={selectedConversation.listing_id || 'User'}
          onClose={() => setSelectedConversation(null)}
        />
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            Inbox
            {getUnreadCount() > 0 && (
              <Badge className="bg-red-600 text-white">
                {getUnreadCount()}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.slice(0, 5).map((conversation) => {
              const unreadCount = currentUserType === 'vendor' 
                ? conversation.unread_count_vendor 
                : conversation.unread_count_user;

              return (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className="p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate">
                            {conversation.listing_id || 'New Inquiry'}
                          </span>
                          {unreadCount > 0 && (
                            <Badge className="bg-red-600 text-white text-xs">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conversation.last_message || 'Start conversation'}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-500">
                          <Clock className="w-3 h-3" />
                          {conversation.last_message_at ? formatTime(conversation.last_message_at) : 'New'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
