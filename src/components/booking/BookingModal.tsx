"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Star,
  Heart,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateBooking } from "@/hooks/useBookings";
import { PaymentService } from "@/services/PaymentService";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: string;
    title: string;
    type: 'venue' | 'vendor';
    image: string;
    location: string;
    base_price: number;
    rating: number;
    review_count: number;
    owner: {
      name: string;
      phone: string;
      email: string;
    };
    amenities?: string[];
    capacity?: {
      min: number;
      max: number;
    };
  };
  selectedDate?: string;
  selectedTimeSlot?: string;
  guestCount?: number;
}

interface BookingFormData {
  eventDate: string;
  timeSlot: string;
  guestCount: number;
  eventType: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
}

export function BookingModal({
  isOpen,
  onClose,
  listing,
  selectedDate = '',
  selectedTimeSlot = '',
  guestCount = 50
}: BookingModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [formData, setFormData] = useState<BookingFormData>({
    eventDate: selectedDate,
    timeSlot: selectedTimeSlot,
    guestCount: guestCount,
    eventType: 'Wedding',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: ''
  });
  const [paymentType, setPaymentType] = useState<'advance' | 'full'>('advance');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const createBooking = useCreateBooking();

  const calculatePricing = () => {
    const baseAmount = listing.base_price;
    const guestMultiplier = Math.max(1, formData.guestCount / 100);
    const totalAmount = Math.round(baseAmount * guestMultiplier);
    
    const breakdown = PaymentService.calculatePaymentBreakdown(totalAmount, 30);
    
    return {
      basePrice: baseAmount,
      guestCount: formData.guestCount,
      totalAmount,
      ...breakdown
    };
  };

  const pricing = calculatePricing();

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitDetails = () => {
    // Validate form
    if (!formData.eventDate || !formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      alert('Please fill in all required fields');
      return;
    }

    setStep('payment');
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      const paymentAmount = paymentType === 'advance' ? pricing.advance : pricing.total;
      
      const success = await PaymentService.processBookingPayment({
        bookingId: 'temp_' + Date.now(), // Temporary ID, will be replaced after booking creation
        amount: paymentAmount,
        paymentType,
        customerDetails: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone
        },
        bookingDetails: {
          venueName: listing.title,
          eventDate: formData.eventDate
        },
        onSuccess: async (paymentDetails) => {
          // Create booking after successful payment
          try {
            await createBooking.mutateAsync({
              listing_id: listing.id,
              event_date: formData.eventDate,
              guest_count: formData.guestCount,
              total_amount: pricing.total,
              advance_amount: paymentType === 'advance' ? pricing.advance : pricing.total,
              special_requests: formData.specialRequests
            });
            
            setStep('confirmation');
          } catch (error) {
            console.error('Failed to create booking:', error);
            alert('Payment successful but booking creation failed. Please contact support.');
          }
        },
        onFailure: (error) => {
          console.error('Payment failed:', error);
          alert('Payment failed. Please try again.');
        }
      });

      if (!success.success) {
        alert(success.error || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('An error occurred while processing payment');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleClose = () => {
    setStep('details');
    setFormData({
      eventDate: selectedDate,
      timeSlot: selectedTimeSlot,
      guestCount: guestCount,
      eventType: 'Wedding',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      specialRequests: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-600" />
            {step === 'details' && 'Book Your Event'}
            {step === 'payment' && 'Payment Details'}
            {step === 'confirmation' && 'Booking Confirmed!'}
          </DialogTitle>
        </DialogHeader>

        {/* Listing Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <MapPin className="w-4 h-4" />
                  {listing.location}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{listing.rating}</span>
                    <span className="text-sm text-gray-500">({listing.review_count})</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {listing.type === 'venue' ? 'Venue' : 'Vendor'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {step === 'details' && (
          <div className="space-y-6">
            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="timeSlot">Time Slot</Label>
                <Input
                  id="timeSlot"
                  type="time"
                  value={formData.timeSlot}
                  onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guestCount">Guest Count</Label>
                <Input
                  id="guestCount"
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.guestCount}
                  onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Input
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => handleInputChange('eventType', e.target.value)}
                  placeholder="Wedding, Reception, etc."
                />
              </div>
            </div>

            {/* Customer Details */}
            <Separator />
            <h4 className="font-semibold text-gray-900 dark:text-white">Contact Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                placeholder="Any special requirements or requests..."
                rows={3}
              />
            </div>

            {/* Pricing Summary */}
            <Card className="bg-gray-50 dark:bg-gray-800">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Pricing Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>₹{pricing.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guest Count:</span>
                    <span>{pricing.guestCount} guests</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{pricing.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Advance (30%):</span>
                    <span>₹{pricing.advance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Remaining:</span>
                    <span>₹{pricing.remaining.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmitDetails} className="flex-1 bg-red-600 hover:bg-red-700">
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            {/* Payment Type Selection */}
            <div>
              <h4 className="font-semibold mb-3">Payment Option</h4>
              <div className="grid grid-cols-2 gap-3">
                <Card
                  className={cn(
                    "cursor-pointer transition-colors",
                    paymentType === 'advance' 
                      ? "ring-2 ring-red-600 bg-red-50 dark:bg-red-900/10" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setPaymentType('advance')}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-lg font-semibold">Pay Advance</div>
                    <div className="text-2xl font-bold text-red-600 mt-1">
                      ₹{pricing.advance.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">30% of total</div>
                  </CardContent>
                </Card>
                <Card
                  className={cn(
                    "cursor-pointer transition-colors",
                    paymentType === 'full' 
                      ? "ring-2 ring-red-600 bg-red-50 dark:bg-red-900/10" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setPaymentType('full')}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-lg font-semibold">Pay Full</div>
                    <div className="text-2xl font-bold text-green-600 mt-1">
                      ₹{pricing.total.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Complete payment</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Booking Summary */}
            <Card className="bg-gray-50 dark:bg-gray-800">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Event Date:</span>
                    <span>{new Date(formData.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guest Count:</span>
                    <span>{formData.guestCount} guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span>{formData.customerName}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Amount to Pay:</span>
                    <span>₹{(paymentType === 'advance' ? pricing.advance : pricing.total).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handlePayment} 
                disabled={isProcessingPayment}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isProcessingPayment ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Booking Confirmed!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your booking request has been submitted successfully. You will receive a confirmation email shortly.
              </p>
            </div>

            <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Booking ID:</span>
                    <span className="font-mono">WS{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Event Date:</span>
                    <span>{new Date(formData.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-semibold">₹{(paymentType === 'advance' ? pricing.advance : pricing.total).toLocaleString()}</span>
                  </div>
                  {paymentType === 'advance' && (
                    <div className="flex justify-between text-orange-600">
                      <span>Remaining:</span>
                      <span>₹{pricing.remaining.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Close
              </Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700">
                View Booking
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
