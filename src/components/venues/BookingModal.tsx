"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  Users,
  IndianRupee,
  Phone,
  Mail,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DatePicker from '@/components/calendar/DatePicker';
import TimeSlotPicker, { TimeSlot } from '@/components/calendar/TimeSlotPicker';
import { Venue } from '@/components/venues/VenueCard';

interface BookingModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (bookingData: BookingFormData) => void;
}

export interface BookingFormData {
  venueId: string;
  eventDate: Date;
  timeSlot?: TimeSlot;
  guestCount: number;
  eventType: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  totalAmount: number;
}

const BookingModal: React.FC<BookingModalProps> = ({
  venue,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [step, setStep] = useState<'details' | 'datetime' | 'contact' | 'summary'>('details');
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    guestCount: 100,
    eventType: 'Wedding'
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!venue) return null;

  // Mock time slots - in real app, this would come from API based on selected date
  const mockTimeSlots: TimeSlot[] = [
    {
      id: '1',
      time: '10:00',
      endTime: '16:00',
      status: 'available',
      price: venue.price,
      maxGuests: venue.capacity,
      description: 'Morning ceremony with lunch'
    },
    {
      id: '2',
      time: '14:00',
      endTime: '20:00',
      status: 'available',
      price: venue.price * 1.2,
      maxGuests: venue.capacity,
      description: 'Afternoon ceremony with dinner'
    },
    {
      id: '3',
      time: '18:00',
      endTime: '23:00',
      status: 'available',
      price: venue.price * 1.5,
      maxGuests: venue.capacity,
      description: 'Evening ceremony with dinner'
    }
  ];

  const eventTypes = [
    'Wedding',
    'Engagement',
    'Reception',
    'Anniversary',
    'Birthday Party',
    'Corporate Event',
    'Other'
  ];

  const validateStep = (currentStep: string): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 'details':
        if (!formData.guestCount || formData.guestCount < 1) {
          newErrors.guestCount = 'Please enter number of guests';
        }
        if (formData.guestCount && formData.guestCount > venue.capacity) {
          newErrors.guestCount = `Maximum capacity is ${venue.capacity} guests`;
        }
        if (!formData.eventType) {
          newErrors.eventType = 'Please select event type';
        }
        break;

      case 'datetime':
        if (!formData.eventDate) {
          newErrors.eventDate = 'Please select event date';
        }
        if (!selectedTimeSlot) {
          newErrors.timeSlot = 'Please select a time slot';
        }
        break;

      case 'contact':
        if (!formData.customerName?.trim()) {
          newErrors.customerName = 'Please enter your name';
        }
        if (!formData.customerEmail?.trim()) {
          newErrors.customerEmail = 'Please enter your email';
        } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
          newErrors.customerEmail = 'Please enter a valid email';
        }
        if (!formData.customerPhone?.trim()) {
          newErrors.customerPhone = 'Please enter your phone number';
        } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.customerPhone)) {
          newErrors.customerPhone = 'Please enter a valid phone number';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;

    const steps = ['details', 'datetime', 'contact', 'summary'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1] as any);
    }
  };

  const handleBack = () => {
    const steps = ['details', 'datetime', 'contact', 'summary'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1] as any);
    }
  };

  const handleSubmit = () => {
    if (!validateStep('contact')) return;

    const bookingData: BookingFormData = {
      venueId: venue.id,
      eventDate: formData.eventDate!,
      timeSlot: selectedTimeSlot,
      guestCount: formData.guestCount!,
      eventType: formData.eventType!,
      customerName: formData.customerName!,
      customerEmail: formData.customerEmail!,
      customerPhone: formData.customerPhone!,
      specialRequests: formData.specialRequests,
      totalAmount: selectedTimeSlot?.price || venue.price
    };

    onSubmit?.(bookingData);
    onClose();
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const renderStepContent = () => {
    switch (step) {
      case 'details':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventType">Event Type *</Label>
              <select
                id="eventType"
                value={formData.eventType || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value }))}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              >
                <option value="">Select event type</option>
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.eventType && (
                <p className="text-sm text-red-600 mt-1">{errors.eventType}</p>
              )}
            </div>

            <div>
              <Label htmlFor="guestCount">Number of Guests *</Label>
              <Input
                id="guestCount"
                type="number"
                min="1"
                max={venue.capacity}
                value={formData.guestCount || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, guestCount: parseInt(e.target.value) || 0 }))}
                placeholder="Enter number of guests"
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Maximum capacity: {venue.capacity} guests
              </p>
              {errors.guestCount && (
                <p className="text-sm text-red-600 mt-1">{errors.guestCount}</p>
              )}
            </div>
          </div>
        );

      case 'datetime':
        return (
          <div className="space-y-4">
            <div>
              <Label>Event Date *</Label>
              <DatePicker
                value={formData.eventDate}
                onChange={(date) => setFormData(prev => ({ ...prev, eventDate: date }))}
                placeholder="Select event date"
                minDate={new Date()}
                className="mt-1"
              />
              {errors.eventDate && (
                <p className="text-sm text-red-600 mt-1">{errors.eventDate}</p>
              )}
            </div>

            {formData.eventDate && (
              <div>
                <TimeSlotPicker
                  timeSlots={mockTimeSlots}
                  selectedSlot={selectedTimeSlot?.id}
                  onSlotSelect={setSelectedTimeSlot}
                  date={formData.eventDate}
                  showPricing={true}
                  showCapacity={true}
                />
                {errors.timeSlot && (
                  <p className="text-sm text-red-600 mt-1">{errors.timeSlot}</p>
                )}
              </div>
            )}
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Enter your full name"
                className="mt-1"
              />
              {errors.customerName && (
                <p className="text-sm text-red-600 mt-1">{errors.customerName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="Enter your email address"
                className="mt-1"
              />
              {errors.customerEmail && (
                <p className="text-sm text-red-600 mt-1">{errors.customerEmail}</p>
              )}
            </div>

            <div>
              <Label htmlFor="customerPhone">Phone Number *</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                placeholder="Enter your phone number"
                className="mt-1"
              />
              {errors.customerPhone && (
                <p className="text-sm text-red-600 mt-1">{errors.customerPhone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                placeholder="Any special requirements or requests..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue:</span>
                  <span className="font-medium">{venue.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event Type:</span>
                  <span>{formData.eventType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{formData.eventDate?.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                {selectedTimeSlot && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span>{selectedTimeSlot.time} - {selectedTimeSlot.endTime}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests:</span>
                  <span>{formData.guestCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact:</span>
                  <span>{formData.customerName}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-green-600">
                      {formatPrice(selectedTimeSlot?.price || venue.price)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                    Booking Request
                  </p>
                  <p className="text-blue-700 dark:text-blue-400">
                    This will send a booking request to the venue. They will contact you within 24 hours to confirm availability and discuss details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'details': return 'Event Details';
      case 'datetime': return 'Date & Time';
      case 'contact': return 'Contact Information';
      case 'summary': return 'Review & Confirm';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-600" />
            Book {venue.name}
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Step {['details', 'datetime', 'contact', 'summary'].indexOf(step) + 1} of 4:</span>
            <span>{getStepTitle()}</span>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="flex gap-1 mb-4">
          {['details', 'datetime', 'contact', 'summary'].map((s, index) => (
            <div
              key={s}
              className={cn(
                "flex-1 h-2 rounded-full transition-colors",
                index <= ['details', 'datetime', 'contact', 'summary'].indexOf(step)
                  ? "bg-red-600"
                  : "bg-gray-200 dark:bg-gray-700"
              )}
            />
          ))}
        </div>

        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 'details'}
          >
            Back
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {step === 'summary' ? (
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Send Booking Request
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
