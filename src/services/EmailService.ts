// ============================================================================
// EMAIL SERVICE - Resend integration for transactional emails
// Free tier: 3,000 emails/month, 100/day
// ============================================================================

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@wedspace.in';
const REPLY_TO = process.env.RESEND_REPLY_TO || 'support@wedspace.in';

export class EmailService {
  // ============================================================================
  // LEAD & INQUIRY EMAILS
  // ============================================================================

  static async sendInquiryNotification(params: {
    vendorEmail: string;
    vendorName: string;
    customerName: string;
    customerEmail: string;
    message: string;
    eventDate?: string;
    budget?: string;
    leadId: string;
  }): Promise<void> {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: params.vendorEmail,
        replyTo: params.customerEmail,
        subject: `New inquiry from ${params.customerName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">New Inquiry Received!</h2>
            <p>Hi ${params.vendorName},</p>
            <p>You have a new inquiry from <strong>${params.customerName}</strong>.</p>
            
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Inquiry Details:</h3>
              ${params.eventDate ? `<p><strong>Event Date:</strong> ${params.eventDate}</p>` : ''}
              ${params.budget ? `<p><strong>Budget:</strong> ${params.budget}</p>` : ''}
              <p><strong>Message:</strong></p>
              <p>${params.message}</p>
            </div>

            <div style="background: #fef2f2; padding: 16px; border-radius: 8px; border-left: 4px solid #dc2626;">
              <p style="margin: 0;"><strong>⚡ Quick Tip:</strong> Respond within 4 hours to improve your ranking!</p>
            </div>

            <a href="${process.env.NEXT_PUBLIC_APP_URL}/vendor/dashboard?tab=leads&lead=${params.leadId}" 
               style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
              View & Respond
            </a>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              You're receiving this because you have a business profile on WedSpace.
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error sending inquiry notification:', error);
      throw error;
    }
  }

  static async sendInquiryConfirmation(params: {
    customerEmail: string;
    customerName: string;
    vendorName: string;
    message: string;
  }): Promise<void> {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: params.customerEmail,
        replyTo: REPLY_TO,
        subject: `Your inquiry to ${params.vendorName} has been sent`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Inquiry Sent Successfully!</h2>
            <p>Hi ${params.customerName},</p>
            <p>Your inquiry to <strong>${params.vendorName}</strong> has been delivered.</p>
            
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your Message:</strong></p>
              <p>${params.message}</p>
            </div>

            <p>The vendor will respond to you directly via email. You can also track your inquiry in your WedSpace dashboard.</p>

            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
              View Dashboard
            </a>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error sending inquiry confirmation:', error);
    }
  }

  // ============================================================================
  // QUOTE EMAILS
  // ============================================================================

  static async sendQuoteEmail(params: {
    customerEmail: string;
    customerName: string;
    vendorName: string;
    quoteNumber: string;
    total: number;
    validUntil: string;
    magicLinkToken: string;
  }): Promise<void> {
    try {
      const quoteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/quotes/${params.magicLinkToken}`;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: params.customerEmail,
        replyTo: REPLY_TO,
        subject: `Quote ${params.quoteNumber} from ${params.vendorName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">You've Received a Quote!</h2>
            <p>Hi ${params.customerName},</p>
            <p><strong>${params.vendorName}</strong> has sent you a quote for your wedding.</p>
            
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Quote #:</strong> ${params.quoteNumber}</p>
              <p><strong>Total:</strong> ₹${params.total.toLocaleString()}</p>
              <p><strong>Valid Until:</strong> ${params.validUntil}</p>
            </div>

            <a href="${quoteUrl}" 
               style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
              View Quote Details
            </a>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              This quote is valid until ${params.validUntil}. Click above to view full details and accept.
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error sending quote email:', error);
      throw error;
    }
  }

  // ============================================================================
  // MESSAGE NOTIFICATIONS
  // ============================================================================

  static async sendMessageNotification(params: {
    recipientEmail: string;
    recipientName: string;
    senderName: string;
    messageBody: string;
    leadId: string;
  }): Promise<void> {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: params.recipientEmail,
        replyTo: REPLY_TO,
        subject: `New message from ${params.senderName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">New Message</h2>
            <p>Hi ${params.recipientName},</p>
            <p>You have a new message from <strong>${params.senderName}</strong>:</p>
            
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p>${params.messageBody}</p>
            </div>

            <a href="${process.env.NEXT_PUBLIC_APP_URL}/vendor/dashboard?tab=messages&lead=${params.leadId}" 
               style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
              Reply in Dashboard
            </a>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error sending message notification:', error);
    }
  }

  // ============================================================================
  // REVIEW REQUESTS
  // ============================================================================

  static async sendReviewRequest(params: {
    customerEmail: string;
    customerName: string;
    vendorName: string;
    vendorId: string;
    leadId: string;
  }): Promise<void> {
    try {
      const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/vendors/${params.vendorId}/review?lead=${params.leadId}`;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: params.customerEmail,
        replyTo: REPLY_TO,
        subject: `How was your experience with ${params.vendorName}?`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Share Your Experience</h2>
            <p>Hi ${params.customerName},</p>
            <p>We hope you had a wonderful experience with <strong>${params.vendorName}</strong>!</p>
            
            <p>Your feedback helps other couples make better decisions and helps vendors improve their services.</p>

            <a href="${reviewUrl}" 
               style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
              Leave a Review
            </a>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              It only takes 2 minutes. Thank you for being part of the WedSpace community!
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error sending review request:', error);
    }
  }

  // ============================================================================
  // WEEKLY DIGEST
  // ============================================================================

  static async sendWeeklyDigest(params: {
    vendorEmail: string;
    vendorName: string;
    stats: {
      newLeads: number;
      profileViews: number;
      quotesSent: number;
      avgResponseTime: number;
    };
    topSuggestions: string[];
  }): Promise<void> {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: params.vendorEmail,
        replyTo: REPLY_TO,
        subject: `Your WedSpace Weekly Summary`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Weekly Performance Summary</h2>
            <p>Hi ${params.vendorName},</p>
            <p>Here's how your business performed this week:</p>
            
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Key Metrics</h3>
              <p><strong>New Leads:</strong> ${params.stats.newLeads}</p>
              <p><strong>Profile Views:</strong> ${params.stats.profileViews}</p>
              <p><strong>Quotes Sent:</strong> ${params.stats.quotesSent}</p>
              <p><strong>Avg Response Time:</strong> ${params.stats.avgResponseTime.toFixed(1)} hours</p>
            </div>

            ${params.topSuggestions.length > 0 ? `
              <div style="background: #fef2f2; padding: 16px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
                <h3 style="margin-top: 0;">Suggestions to Improve</h3>
                <ul>
                  ${params.topSuggestions.map(s => `<li>${s}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            <a href="${process.env.NEXT_PUBLIC_APP_URL}/vendor/dashboard" 
               style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
              View Full Dashboard
            </a>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error sending weekly digest:', error);
    }
  }

  // ============================================================================
  // VERIFICATION & ADMIN
  // ============================================================================

  static async sendVerificationApproval(params: {
    vendorEmail: string;
    vendorName: string;
  }): Promise<void> {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: params.vendorEmail,
        replyTo: REPLY_TO,
        subject: `Your WedSpace profile has been verified! ✓`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Congratulations! You're Verified</h2>
            <p>Hi ${params.vendorName},</p>
            <p>Great news! Your WedSpace business profile has been verified.</p>
            
            <div style="background: #d1fae5; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <p style="margin: 0;"><strong>What this means:</strong></p>
              <ul>
                <li>Verified badge on your profile</li>
                <li>Higher ranking in search results</li>
                <li>Increased trust from couples</li>
                <li>Priority in recommendations</li>
              </ul>
            </div>

            <a href="${process.env.NEXT_PUBLIC_APP_URL}/vendor/dashboard" 
               style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
              View Your Profile
            </a>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error sending verification approval:', error);
    }
  }

  // ============================================================================
  // BATCH SENDING (for digests)
  // ============================================================================

  static async sendBatch(emails: Array<{
    to: string;
    subject: string;
    html: string;
  }>): Promise<void> {
    // Resend free tier: 100 emails/day
    // Split into chunks and track daily quota
    const CHUNK_SIZE = 50;
    
    for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
      const chunk = emails.slice(i, i + CHUNK_SIZE);
      
      try {
        await Promise.all(
          chunk.map(email =>
            resend.emails.send({
              from: FROM_EMAIL,
              to: email.to,
              subject: email.subject,
              html: email.html,
            })
          )
        );
        
        // Add delay between chunks to respect rate limits
        if (i + CHUNK_SIZE < emails.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error('Error sending batch:', error);
      }
    }
  }
}
