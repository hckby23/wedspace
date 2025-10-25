"use client";

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: 'created' | 'attempted' | 'paid' | 'failed';
  created_at: number;
  notes?: Record<string, string>;
}

export interface PaymentDetails {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export class PaymentService {
  private static RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  // Load Razorpay script
  static async loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Create payment order
  static async createOrder(data: {
    amount: number;
    currency?: string;
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<PaymentServiceResponse<PaymentOrder>> {
    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: data.amount * 100, // Convert to paise
          currency: data.currency || 'INR',
          receipt: data.receipt,
          notes: data.notes
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: error.message || 'Failed to create order', success: false };
      }

      const order = await response.json();
      return { data: order, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Process payment
  static async processPayment(options: {
    orderId: string;
    amount: number;
    currency?: string;
    name: string;
    description: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    onSuccess: (paymentDetails: PaymentDetails) => void;
    onFailure: (error: any) => void;
    onDismiss?: () => void;
  }): Promise<PaymentServiceResponse<boolean>> {
    try {
      const scriptLoaded = await this.loadRazorpayScript();
      if (!scriptLoaded) {
        return { data: null, error: 'Failed to load Razorpay script', success: false };
      }

      if (!this.RAZORPAY_KEY_ID) {
        return { data: null, error: 'Razorpay key not configured', success: false };
      }

      const razorpayOptions = {
        key: this.RAZORPAY_KEY_ID,
        amount: options.amount * 100, // Convert to paise
        currency: options.currency || 'INR',
        name: options.name,
        description: options.description,
        order_id: options.orderId,
        handler: (response: PaymentDetails) => {
          options.onSuccess(response);
        },
        prefill: {
          name: options.customerName,
          email: options.customerEmail,
          contact: options.customerPhone,
        },
        theme: {
          color: '#dc2626', // WedSpace red theme
        },
        modal: {
          ondismiss: options.onDismiss || (() => {}),
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      
      razorpay.on('payment.failed', (response: any) => {
        options.onFailure(response.error);
      });

      razorpay.open();
      
      return { data: true, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Verify payment
  static async verifyPayment(paymentDetails: PaymentDetails): Promise<PaymentServiceResponse<{
    verified: boolean;
    payment: any;
  }>> {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentDetails),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: error.message || 'Payment verification failed', success: false };
      }

      const result = await response.json();
      return { data: result, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Get payment details
  static async getPaymentDetails(paymentId: string): Promise<PaymentServiceResponse<any>> {
    try {
      const response = await fetch(`/api/payments/${paymentId}`);
      
      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: error.message || 'Failed to fetch payment details', success: false };
      }

      const payment = await response.json();
      return { data: payment, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Refund payment
  static async refundPayment(data: {
    paymentId: string;
    amount?: number;
    reason?: string;
    receipt?: string;
  }): Promise<PaymentServiceResponse<any>> {
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: error.message || 'Refund failed', success: false };
      }

      const refund = await response.json();
      return { data: refund, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Get payment history
  static async getPaymentHistory(filters: {
    bookingId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<PaymentServiceResponse<{
    payments: any[];
    total: number;
    pagination: { page: number; limit: number; pages: number };
  }>> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });

      const response = await fetch(`/api/payments?${queryParams}`);
      
      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: error.message || 'Failed to fetch payment history', success: false };
      }

      const result = await response.json();
      return { data: result, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Process booking payment with escrow
  static async processBookingPaymentWithEscrow(options: {
    bookingId: string;
    userId: string;
    vendorId: string;
    totalAmount: number;
    advancePercentage?: number;
    paymentType: 'advance' | 'full';
    customerDetails: {
      name: string;
      email: string;
      phone: string;
    };
    bookingDetails: {
      venueName: string;
      eventDate: string;
    };
    onSuccess: (paymentDetails: PaymentDetails, escrowId: string) => void;
    onFailure: (error: any) => void;
  }): Promise<PaymentServiceResponse<{ escrowId: string; orderId: string }>> {
    try {
      const advancePercentage = options.advancePercentage || 30;
      const paymentAmount = options.paymentType === 'full' 
        ? options.totalAmount 
        : options.totalAmount * (advancePercentage / 100);

      // Step 1: Create escrow account
      const escrowResponse = await fetch('/api/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: options.bookingId,
          user_id: options.userId,
          vendor_id: options.vendorId,
          total_amount: options.totalAmount,
          advance_percentage: advancePercentage,
          commission_percentage: 10,
          auto_release_days: 7
        })
      });

      if (!escrowResponse.ok) {
        const error = await escrowResponse.json();
        return { data: null, error: error.message || 'Failed to create escrow', success: false };
      }

      const { escrow } = await escrowResponse.json();

      // Step 2: Create Razorpay order
      const orderResult = await this.createOrder({
        amount: paymentAmount,
        receipt: `escrow_${escrow.id}_${options.paymentType}`,
        notes: {
          escrow_id: escrow.id,
          booking_id: options.bookingId,
          payment_type: options.paymentType,
          venue_name: options.bookingDetails.venueName,
          event_date: options.bookingDetails.eventDate,
        }
      });

      if (!orderResult.success || !orderResult.data) {
        return { data: null, error: orderResult.error, success: false };
      }

      // Step 3: Process payment
      const paymentResult = await this.processPayment({
        orderId: orderResult.data.id,
        amount: paymentAmount,
        name: 'WedSpace',
        description: `${options.paymentType === 'advance' ? 'Advance' : 'Full'} payment for ${options.bookingDetails.venueName}`,
        customerName: options.customerDetails.name,
        customerEmail: options.customerDetails.email,
        customerPhone: options.customerDetails.phone,
        onSuccess: async (paymentDetails) => {
          // Mark escrow as funded
          await fetch('/api/escrow/fund', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              escrow_id: escrow.id,
              razorpay_payment_id: paymentDetails.razorpay_payment_id
            })
          });
          
          options.onSuccess(paymentDetails, escrow.id);
        },
        onFailure: options.onFailure
      });

      if (!paymentResult.success) {
        return { data: null, error: paymentResult.error, success: false };
      }

      return { 
        data: { escrowId: escrow.id, orderId: orderResult.data.id }, 
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

  // Process booking payment workflow (legacy - without escrow)
  static async processBookingPayment(options: {
    bookingId: string;
    amount: number;
    paymentType: 'advance' | 'full' | 'remaining';
    customerDetails: {
      name: string;
      email: string;
      phone: string;
    };
    bookingDetails: {
      venueName: string;
      eventDate: string;
    };
    onSuccess: (paymentDetails: PaymentDetails) => void;
    onFailure: (error: any) => void;
  }): Promise<PaymentServiceResponse<boolean>> {
    try {
      // Create order
      const orderResult = await this.createOrder({
        amount: options.amount,
        receipt: `booking_${options.bookingId}_${options.paymentType}`,
        notes: {
          booking_id: options.bookingId,
          payment_type: options.paymentType,
          venue_name: options.bookingDetails.venueName,
          event_date: options.bookingDetails.eventDate,
        }
      });

      if (!orderResult.success || !orderResult.data) {
        return { data: null, error: orderResult.error, success: false };
      }

      // Process payment
      const paymentResult = await this.processPayment({
        orderId: orderResult.data.id,
        amount: options.amount,
        name: 'WedSpace',
        description: `${options.paymentType === 'advance' ? 'Advance' : options.paymentType === 'full' ? 'Full' : 'Remaining'} payment for ${options.bookingDetails.venueName}`,
        customerName: options.customerDetails.name,
        customerEmail: options.customerDetails.email,
        customerPhone: options.customerDetails.phone,
        onSuccess: async (paymentDetails) => {
          // Verify payment
          const verificationResult = await this.verifyPayment(paymentDetails);
          if (verificationResult.success) {
            options.onSuccess(paymentDetails);
          } else {
            options.onFailure({ description: 'Payment verification failed' });
          }
        },
        onFailure: options.onFailure,
      });

      return paymentResult;
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Format amount for display
  static formatAmount(amount: number, currency = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Calculate payment breakdown
  static calculatePaymentBreakdown(totalAmount: number, advancePercentage = 30): {
    total: number;
    advance: number;
    remaining: number;
    advancePercentage: number;
  } {
    const advance = Math.round((totalAmount * advancePercentage) / 100);
    const remaining = totalAmount - advance;

    return {
      total: totalAmount,
      advance,
      remaining,
      advancePercentage
    };
  }

  // Get payment status color
  static getPaymentStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'captured':
      case 'success':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'pending':
      case 'created':
      case 'attempted':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'failed':
      case 'error':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'refunded':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  }

  // Get payment method icon
  static getPaymentMethodIcon(method: string): string {
    switch (method.toLowerCase()) {
      case 'card':
        return '💳';
      case 'netbanking':
        return '🏦';
      case 'wallet':
        return '👛';
      case 'upi':
        return '📱';
      default:
        return '💰';
    }
  }
}
