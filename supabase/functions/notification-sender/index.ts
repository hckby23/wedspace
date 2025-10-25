import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationRequest {
  user_ids: string[]
  title: string
  message: string
  type: 'booking' | 'payment' | 'review' | 'negotiation' | 'system' | 'marketing'
  data?: Record<string, any>
  send_email?: boolean
  send_push?: boolean
  schedule_at?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { 
      user_ids, 
      title, 
      message, 
      type, 
      data, 
      send_email = false, 
      send_push = false,
      schedule_at 
    }: NotificationRequest = await req.json()

    if (!user_ids || user_ids.length === 0 || !title || !message) {
      return new Response(
        JSON.stringify({ error: 'User IDs, title, and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create in-app notifications
    const notifications = user_ids.map(user_id => ({
      user_id,
      type,
      title,
      message,
      data: data || {},
      created_at: schedule_at || new Date().toISOString()
    }))

    const { data: createdNotifications, error: notificationError } = await supabase
      .from('notifications')
      .insert(notifications)
      .select()

    if (notificationError) {
      console.error('Failed to create notifications:', notificationError)
      return new Response(
        JSON.stringify({ error: 'Failed to create notifications' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let emailResults = []
    let pushResults = []

    // Send email notifications if requested
    if (send_email) {
      emailResults = await sendEmailNotifications(supabase, user_ids, title, message, type, data)
    }

    // Send push notifications if requested
    if (send_push) {
      pushResults = await sendPushNotifications(supabase, user_ids, title, message, data)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        notifications_created: createdNotifications?.length || 0,
        email_sent: emailResults.length,
        push_sent: pushResults.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Notification sender error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function sendEmailNotifications(
  supabase: any, 
  userIds: string[], 
  title: string, 
  message: string, 
  type: string,
  data?: Record<string, any>
): Promise<any[]> {
  try {
    // Get user email addresses
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .in('id', userIds)

    if (error || !users) {
      console.error('Failed to fetch user emails:', error)
      return []
    }

    const emailPromises = users.map(async (user: any) => {
      if (!user.email) return null

      try {
        // Use a service like Resend, SendGrid, or AWS SES
        const emailService = Deno.env.get('EMAIL_SERVICE_URL')
        const emailApiKey = Deno.env.get('EMAIL_API_KEY')

        if (!emailService || !emailApiKey) {
          console.log('Email service not configured, skipping email for:', user.email)
          return null
        }

        const emailTemplate = generateEmailTemplate(title, message, type, user.full_name, data)

        const response = await fetch(emailService, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${emailApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'WedSpace <notifications@wedspace.com>',
            to: [user.email],
            subject: title,
            html: emailTemplate,
          }),
        })

        if (response.ok) {
          console.log('Email sent successfully to:', user.email)
          return { user_id: user.id, email: user.email, status: 'sent' }
        } else {
          console.error('Failed to send email to:', user.email, response.status)
          return { user_id: user.id, email: user.email, status: 'failed' }
        }

      } catch (error) {
        console.error('Email sending error for user:', user.id, error)
        return { user_id: user.id, email: user.email, status: 'error' }
      }
    })

    const results = await Promise.all(emailPromises)
    return results.filter(result => result !== null)

  } catch (error) {
    console.error('Email notification error:', error)
    return []
  }
}

async function sendPushNotifications(
  supabase: any,
  userIds: string[],
  title: string,
  message: string,
  data?: Record<string, any>
): Promise<any[]> {
  try {
    // Get user push tokens (would need to store these in profiles or separate table)
    const { data: pushTokens, error } = await supabase
      .from('user_push_tokens')
      .select('user_id, token, platform')
      .in('user_id', userIds)
      .eq('active', true)

    if (error || !pushTokens || pushTokens.length === 0) {
      console.log('No push tokens found for users')
      return []
    }

    const pushPromises = pushTokens.map(async (tokenData: any) => {
      try {
        // Use Firebase Cloud Messaging or similar service
        const fcmServerKey = Deno.env.get('FCM_SERVER_KEY')
        
        if (!fcmServerKey) {
          console.log('FCM not configured, skipping push notification')
          return null
        }

        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Authorization': `key=${fcmServerKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: tokenData.token,
            notification: {
              title,
              body: message,
              icon: '/favicon.png',
              click_action: 'https://wedspace.com/dashboard'
            },
            data: data || {}
          }),
        })

        if (response.ok) {
          console.log('Push notification sent to:', tokenData.user_id)
          return { user_id: tokenData.user_id, status: 'sent' }
        } else {
          console.error('Failed to send push notification:', response.status)
          return { user_id: tokenData.user_id, status: 'failed' }
        }

      } catch (error) {
        console.error('Push notification error:', error)
        return { user_id: tokenData.user_id, status: 'error' }
      }
    })

    const results = await Promise.all(pushPromises)
    return results.filter(result => result !== null)

  } catch (error) {
    console.error('Push notification error:', error)
    return []
  }
}

function generateEmailTemplate(
  title: string, 
  message: string, 
  type: string, 
  userName?: string,
  data?: Record<string, any>
): string {
  const greeting = userName ? `Hi ${userName},` : 'Hello,'
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626, #f59e0b); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>WedSpace</h1>
          <p>Plan beautifully. Book confidently.</p>
        </div>
        <div class="content">
          <p>${greeting}</p>
          <h2>${title}</h2>
          <p>${message}</p>
          ${data?.action_url ? `<a href="${data.action_url}" class="button">View Details</a>` : ''}
        </div>
        <div class="footer">
          <p>© 2024 WedSpace. All rights reserved.</p>
          <p>You're receiving this because you have an account with WedSpace.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
