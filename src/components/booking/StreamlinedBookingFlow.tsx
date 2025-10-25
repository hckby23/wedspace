"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  IndianRupee, 
  Clock, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useCreateBooking } from '@/hooks/useBookings';

interface BookingFlowProps {
  listingId: string;
  venueId?: string;
  vendorId?: string;
  listingName: string;
  basePrice: number;
  onComplete?: (bookingId: string) => void;
  onCancel?: () => void;
}

type BookingStep = 'date' | 'details' | 'payment' | 'confirm';

export default function StreamlinedBookingFlow({
  listingId,
  venueId,
  vendorId,
  listingName,
  basePrice,
  onComplete,
  onCancel
}: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('date');
  const [bookingData, setBookingData] = useState({
    eventDate: '',
    guestCount: 0,
    specialRequests: '',
    advanceAmount: basePrice * 0.3 // 30% advance
  });
  const [holdTimer, setHoldTimer] = useState<number | null>(null);

  const { mutateAsync: createBooking, isPending: isCreating } = useCreateBooking();

  // Step 1: Date Selection
  const renderDateSelection = () => (
    <div className="space-y-4">
      <div>
        <Label>Select Event Date</Label>
        <div className="flex gap-2 mt-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <Input
            type="date"
            value={bookingData.eventDate}
            onChange={(e) => {
              setBookingData({ ...bookingData, eventDate: e.target.value });
              // Start 6-hour hold timer
              setHoldTimer(Date.now() + 6 * 60 * 60 * 1000);
            }}
            min={new Date().toISOString().split('T')[0]}
            className="flex-1"
          />
        </div>
        {holdTimer && (
          <Badge variant="outline" className="mt-2 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Date held for 6 hours
          </Badge>
        )}
      </div>

      <Button
        onClick={() => setCurrentStep('details')}
        disabled={!bookingData.eventDate}
        className="w-full bg-red-600 hover:bg-red-700"
      >
        Continue
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  // Step 2: Event Details
  const renderDetailsStep = () => (
    <div className="space-y-4">
      <div>
        <Label>Number of Guests</Label>
        <div className="flex gap-2 mt-2">
          <Users className="w-5 h-5 text-gray-400" />
          <Input
            type="number"
            value={bookingData.guestCount || ''}
            onChange={(e) => setBookingData({ ...bookingData, guestCount: parseInt(e.target.value) || 0 })}
            placeholder="Enter guest count"
            min="1"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label>Special Requests (Optional)</Label>
        <textarea
          value={bookingData.specialRequests}
          onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
          placeholder="Any specific requirements..."
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentStep('date')}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={() => setCurrentStep('payment')}
          disabled={!bookingData.guestCount}
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Step 3: Payment
  const renderPaymentStep = () => {
    const totalAmount = basePrice;
    const advanceAmount = bookingData.advanceAmount;
    const balanceAmount = totalAmount - advanceAmount;

    return (
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Base Price:</span>
            <span className="font-medium">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm border-t pt-2 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Advance Payment (30%):</span>
            <span className="font-semibold text-red-600">₹{advanceAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Balance (Pay later):</span>
            <span className="font-medium">₹{balanceAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Escrow Protection</p>
              <p className="text-blue-700 dark:text-blue-300">
                Your payment is secured in escrow. Funds released to vendor post-event.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentStep('details')}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleBooking}
            disabled={isCreating}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <IndianRupee className="w-4 h-4 mr-2" />
                Pay ₹{advanceAmount.toLocaleString('en-IN')}
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Step 4: Confirmation
  const renderConfirmation = () => (
    <div className="text-center space-y-4 py-6">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Booking Confirmed!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your booking for {listingName} has been confirmed for {bookingData.eventDate}.
        </p>
      </div>
      <Button onClick={() => onComplete?.('booking-id')} className="bg-red-600 hover:bg-red-700">
        View Booking Details
      </Button>
    </div>
  );

  const handleBooking = async () => {
    try {
      await createBooking({
        listing_id: listingId,
        event_date: bookingData.eventDate,
        guest_count: bookingData.guestCount,
        total_amount: basePrice,
        advance_amount: bookingData.advanceAmount,
        special_requests: bookingData.specialRequests
      });

      setCurrentStep('confirm');
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const getStepProgress = () => {
    const steps: BookingStep[] = ['date', 'details', 'payment', 'confirm'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Book {listingName}</CardTitle>
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between text-xs">
            <span className={currentStep === 'date' ? 'text-red-600 font-medium' : 'text-gray-500'}>
              Date
            </span>
            <span className={currentStep === 'details' ? 'text-red-600 font-medium' : 'text-gray-500'}>
              Details
            </span>
            <span className={currentStep === 'payment' ? 'text-red-600 font-medium' : 'text-gray-500'}>
              Payment
            </span>
            <span className={currentStep === 'confirm' ? 'text-red-600 font-medium' : 'text-gray-500'}>
              Confirm
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {currentStep === 'date' && renderDateSelection()}
        {currentStep === 'details' && renderDetailsStep()}
        {currentStep === 'payment' && renderPaymentStep()}
        {currentStep === 'confirm' && renderConfirmation()}
      </CardContent>
    </Card>
  );
}
