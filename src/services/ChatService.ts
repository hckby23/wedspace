import { createClient } from '@/integrations/supabase/client';
import type { Database } from '@/types/db';

type ChatConversation = Database['public']['Tables']['chat_conversations']['Row'];
type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
type MessageInsert = Database['public']['Tables']['chat_messages']['Insert'];

export class ChatService {
  private supabase = createClient();

  // Create or get conversation
  async getOrCreateConversation(params: {
    userId: string;
    listingId?: string;
    venueId?: string;
    vendorId?: string;
    vendorUserId?: string;
  }): Promise<ChatConversation | null> {
    try {
      // Check if conversation exists
      let query = this.supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', params.userId);

      if (params.listingId) query = query.eq('listing_id', params.listingId);
      if (params.venueId) query = query.eq('venue_id', params.venueId);
      if (params.vendorId) query = query.eq('vendor_id', params.vendorId);

      const { data: existing } = await query.single();

      if (existing) return existing;

      // Create new conversation
      const { data, error } = await this.supabase
        .from('chat_conversations')
        .insert({
          user_id: params.userId,
          listing_id: params.listingId || null,
          venue_id: params.venueId || null,
          vendor_id: params.vendorId || null,
          vendor_user_id: params.vendorUserId || null,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }

  // Send message
  async sendMessage(params: {
    conversationId: string;
    senderId: string;
    senderType: 'user' | 'vendor';
    content: string;
    messageType?: 'text' | 'image' | 'document';
    attachmentUrl?: string;
    attachmentType?: string;
  }): Promise<ChatMessage | null> {
    try {
      const { data, error } = await this.supabase
        .from('chat_messages')
        .insert({
          conversation_id: params.conversationId,
          sender_id: params.senderId,
          sender_type: params.senderType,
          content: params.content,
          message_type: params.messageType || 'text',
          attachment_url: params.attachmentUrl || null,
          attachment_type: params.attachmentType || null,
          status: 'sent'
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation last_message
      await this.supabase
        .from('chat_conversations')
        .update({
          last_message: params.content,
          last_message_at: new Date().toISOString(),
          ...(params.senderType === 'user' 
            ? { unread_count_vendor: 1 } 
            : { unread_count_user: 1 })
        })
        .eq('id', params.conversationId);

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  // Get messages for conversation
  async getMessages(conversationId: string, limit = 50): Promise<ChatMessage[]> {
    try {
      const { data, error } = await this.supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  // Get user conversations
  async getUserConversations(userId: string): Promise<ChatConversation[]> {
    try {
      const { data, error } = await this.supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  // Mark messages as read
  async markAsRead(conversationId: string, userId: string, userType: 'user' | 'vendor'): Promise<void> {
    try {
      // Update message status
      await this.supabase
        .from('chat_messages')
        .update({ status: 'read', read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId);

      // Reset unread count
      const updateField = userType === 'user' ? 'unread_count_user' : 'unread_count_vendor';
      await this.supabase
        .from('chat_conversations')
        .update({ [updateField]: 0 })
        .eq('id', conversationId);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }

  // Subscribe to new messages
  subscribeToMessages(conversationId: string, callback: (message: ChatMessage) => void) {
    return this.supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => callback(payload.new as ChatMessage)
      )
      .subscribe();
  }

  // Upload attachment (simplified - would use Supabase storage in production)
  async uploadAttachment(file: File): Promise<string | null> {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await this.supabase.storage
        .from('chat-attachments')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = this.supabase.storage
        .from('chat-attachments')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      return null;
    }
  }
}

export const chatService = new ChatService();
