"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { useCreateConversation } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';

interface ChatButtonProps {
  listingId?: string;
  venueId?: string;
  vendorId?: string;
  vendorUserId?: string;
  recipientName: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export default function ChatButton({
  listingId,
  venueId,
  vendorId,
  vendorUserId,
  recipientName,
  variant = 'default',
  size = 'default',
  className = ''
}: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { user } = useAuth();
  const createConversation = useCreateConversation();

  const handleOpenChat = async () => {
    if (!user?.id) {
      // Redirect to login or show auth modal
      window.alert('Please sign in to start a conversation');
      return;
    }

    if (!conversationId) {
      // Create or get conversation
      const conversation = await createConversation.mutateAsync({
        userId: user.id,
        listingId,
        venueId,
        vendorId,
        vendorUserId
      });

      if (conversation) {
        setConversationId(conversation.id);
        setIsOpen(true);
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpenChat}
        className={`gap-2 ${className}`}
        disabled={createConversation.isPending}
      >
        <MessageCircle className="w-4 h-4" />
        {createConversation.isPending ? 'Starting Chat...' : 'Chat Now'}
      </Button>

      {isOpen && conversationId && user?.id && (
        <div className="fixed bottom-4 right-4 w-96 z-50 shadow-2xl">
          <ChatWindow
            conversationId={conversationId}
            currentUserId={user.id}
            currentUserType="user"
            recipientName={recipientName}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
}
