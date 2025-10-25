"use client";

import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'system' | 'promotion' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  action_url?: string;
  action_label?: string;
  metadata?: Record<string, any>;
  created_at: string;
  expires_at?: string;
}

export interface NotificationServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export class NotificationService {
  // Create a new notification
  static async createNotification(data: {
    user_id: string;
    title: string;
    message: string;
    type: Notification['type'];
    priority?: Notification['priority'];
    action_url?: string;
    action_label?: string;
    metadata?: Record<string, any>;
    expires_at?: string;
  }): Promise<NotificationServiceResponse<Notification>> {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          ...data,
          priority: data.priority || 'medium',
          read: false
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      // Send real-time notification
      await this.sendRealtimeNotification(notification);

      return { data: notification, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Get user notifications
  static async getUserNotifications(
    userId: string,
    options: {
      unreadOnly?: boolean;
      type?: Notification['type'];
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<NotificationServiceResponse<{ notifications: Notification[]; total: number }>> {
    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      if (options.unreadOnly) {
        query = query.eq('read', false);
      }

      if (options.type) {
        query = query.eq('type', options.type);
      }

      // Filter out expired notifications
      query = query.or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

      query = query.order('created_at', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return {
        data: {
          notifications: data || [],
          total: count || 0
        },
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Mark notification as read
  static async markAsRead(
    notificationId: string
  ): Promise<NotificationServiceResponse<Notification>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(
    userId: string
  ): Promise<NotificationServiceResponse<{ count: number }>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)
        .select('id');

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return {
        data: { count: data?.length || 0 },
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Delete notification
  static async deleteNotification(
    notificationId: string
  ): Promise<NotificationServiceResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: true, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Get unread count
  static async getUnreadCount(
    userId: string
  ): Promise<NotificationServiceResponse<number>> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false)
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: count || 0, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Send booking-related notifications
  static async sendBookingNotification(
    userId: string,
    bookingId: string,
    type: 'created' | 'confirmed' | 'cancelled' | 'reminder',
    bookingDetails: {
      venueName: string;
      eventDate: string;
      amount?: number;
    }
  ): Promise<NotificationServiceResponse<Notification>> {
    const notificationData = this.getBookingNotificationData(type, bookingDetails);
    
    return this.createNotification({
      user_id: userId,
      title: notificationData.title,
      message: notificationData.message,
      type: 'booking',
      priority: notificationData.priority,
      action_url: `/bookings/${bookingId}`,
      action_label: 'View Booking',
      metadata: { booking_id: bookingId, type }
    });
  }

  // Send payment-related notifications
  static async sendPaymentNotification(
    userId: string,
    paymentId: string,
    type: 'success' | 'failed' | 'pending',
    paymentDetails: {
      amount: number;
      bookingId: string;
      venueName: string;
    }
  ): Promise<NotificationServiceResponse<Notification>> {
    const notificationData = this.getPaymentNotificationData(type, paymentDetails);
    
    return this.createNotification({
      user_id: userId,
      title: notificationData.title,
      message: notificationData.message,
      type: 'payment',
      priority: notificationData.priority,
      action_url: `/bookings/${paymentDetails.bookingId}`,
      action_label: 'View Details',
      metadata: { payment_id: paymentId, booking_id: paymentDetails.bookingId, type }
    });
  }

  // Send system notifications
  static async sendSystemNotification(
    userId: string,
    title: string,
    message: string,
    priority: Notification['priority'] = 'medium',
    actionUrl?: string,
    actionLabel?: string
  ): Promise<NotificationServiceResponse<Notification>> {
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: 'system',
      priority,
      action_url: actionUrl,
      action_label: actionLabel
    });
  }

  // Send promotional notifications
  static async sendPromotionalNotification(
    userId: string,
    title: string,
    message: string,
    actionUrl?: string,
    actionLabel?: string,
    expiresAt?: string
  ): Promise<NotificationServiceResponse<Notification>> {
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: 'promotion',
      priority: 'low',
      action_url: actionUrl,
      action_label: actionLabel,
      expires_at: expiresAt
    });
  }

  // Bulk send notifications
  static async sendBulkNotifications(
    userIds: string[],
    notificationData: {
      title: string;
      message: string;
      type: Notification['type'];
      priority?: Notification['priority'];
      action_url?: string;
      action_label?: string;
      expires_at?: string;
    }
  ): Promise<NotificationServiceResponse<{ sent: number; failed: number }>> {
    try {
      const notifications = userIds.map(userId => ({
        user_id: userId,
        ...notificationData,
        priority: notificationData.priority || 'medium',
        read: false
      }));

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      // Send real-time notifications
      for (const notification of data) {
        await this.sendRealtimeNotification(notification);
      }

      return {
        data: { sent: data.length, failed: 0 },
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Clean up expired notifications
  static async cleanupExpiredNotifications(): Promise<NotificationServiceResponse<{ deleted: number }>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select('id');

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return {
        data: { deleted: data?.length || 0 },
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Private helper methods
  private static getBookingNotificationData(
    type: string,
    details: { venueName: string; eventDate: string; amount?: number }
  ) {
    switch (type) {
      case 'created':
        return {
          title: 'Booking Request Submitted',
          message: `Your booking request for ${details.venueName} on ${new Date(details.eventDate).toLocaleDateString()} has been submitted and is pending confirmation.`,
          priority: 'medium' as const
        };
      case 'confirmed':
        return {
          title: 'Booking Confirmed! 🎉',
          message: `Great news! Your booking for ${details.venueName} on ${new Date(details.eventDate).toLocaleDateString()} has been confirmed.`,
          priority: 'high' as const
        };
      case 'cancelled':
        return {
          title: 'Booking Cancelled',
          message: `Your booking for ${details.venueName} on ${new Date(details.eventDate).toLocaleDateString()} has been cancelled.`,
          priority: 'high' as const
        };
      case 'reminder':
        return {
          title: 'Upcoming Event Reminder',
          message: `Reminder: Your event at ${details.venueName} is scheduled for ${new Date(details.eventDate).toLocaleDateString()}.`,
          priority: 'medium' as const
        };
      default:
        return {
          title: 'Booking Update',
          message: `There's an update regarding your booking for ${details.venueName}.`,
          priority: 'medium' as const
        };
    }
  }

  private static getPaymentNotificationData(
    type: string,
    details: { amount: number; venueName: string }
  ) {
    const formattedAmount = `₹${details.amount.toLocaleString()}`;
    
    switch (type) {
      case 'success':
        return {
          title: 'Payment Successful ✅',
          message: `Your payment of ${formattedAmount} for ${details.venueName} has been processed successfully.`,
          priority: 'high' as const
        };
      case 'failed':
        return {
          title: 'Payment Failed ❌',
          message: `Your payment of ${formattedAmount} for ${details.venueName} could not be processed. Please try again.`,
          priority: 'urgent' as const
        };
      case 'pending':
        return {
          title: 'Payment Pending',
          message: `Your payment of ${formattedAmount} for ${details.venueName} is being processed.`,
          priority: 'medium' as const
        };
      default:
        return {
          title: 'Payment Update',
          message: `There's an update regarding your payment for ${details.venueName}.`,
          priority: 'medium' as const
        };
    }
  }

  private static async sendRealtimeNotification(notification: Notification): Promise<void> {
    try {
      // Send real-time notification via Supabase realtime
      await supabase.channel('notifications')
        .send({
          type: 'broadcast',
          event: 'new_notification',
          payload: notification
        });
    } catch (error) {
      console.error('Failed to send realtime notification:', error);
    }
  }
}
