import { useMutation, useQueryClient } from '@tanstack/react-query';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOrder {
  payment_id: string;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: async (data: {
      booking_id: string;
      amount: number;
      payment_type: 'advance' | 'full' | 'remaining';
    }) => {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }
      return response.json() as Promise<PaymentOrder>;
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

export function useRazorpayPayment() {
  const createOrder = useCreatePaymentOrder();
  const verifyPayment = useVerifyPayment();

  const processPayment = async (
    bookingData: {
      booking_id: string;
      amount: number;
      payment_type: 'advance' | 'full' | 'remaining';
    },
    userDetails: {
      name: string;
      email: string;
      contact: string;
    }
  ) => {
    try {
      // Create order
      const order = await createOrder.mutateAsync(bookingData);

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      // Open Razorpay checkout
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'WedSpace',
        description: 'Wedding Service Payment',
        order_id: order.razorpay_order_id,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.contact,
        },
        theme: {
          color: '#dc2626',
        },
        handler: async (response: any) => {
          try {
            await verifyPayment.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            return { success: true };
          } catch (error) {
            console.error('Payment verification failed:', error);
            throw error;
          }
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  };

  return {
    processPayment,
    isCreatingOrder: createOrder.isPending,
    isVerifying: verifyPayment.isPending,
  };
}
