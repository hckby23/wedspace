"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  IndianRupee,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AvailabilitySlot {
  date: string;
  status: 'available' | 'booked' | 'limited' | 'blocked';
  price?: number;
  maxGuests?: number;
  timeSlots?: {
    id: string;
    time: string;
    status: 'available' | 'booked';
    price?: number;
  }[];
  notes?: string;
}

interface AvailabilityCalendarProps {
  availability: AvailabilitySlot[];
  onDateSelect?: (date: string, slot?: AvailabilitySlot) => void;
  onTimeSlotSelect?: (date: string, timeSlot: any) => void;
  selectedDate?: string;
  selectedTimeSlot?: string;
  showPricing?: boolean;
  showTimeSlots?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  availability,
  onDateSelect,
  onTimeSlotSelect,
  selectedDate,
  selectedTimeSlot,
  showPricing = true,
  showTimeSlots = true,
  minDate = new Date(),
  maxDate,
  className
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Create availability map for quick lookup
  const availabilityMap = useMemo(() => {
    const map = new Map<string, AvailabilitySlot>();
    availability.forEach(slot => {
      map.set(slot.date, slot);
    });
    return map;
  }, [availability]);

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0];
      const isCurrentMonth = current.getMonth() === month;
      const isToday = current.toDateString() === new Date().toDateString();
      const isPast = current < minDate;
      const isFuture = maxDate && current > maxDate;
      const availability = availabilityMap.get(dateStr);
      
      days.push({
        date: new Date(current),
        dateStr,
        isCurrentMonth,
        isToday,
        isPast,
        isFuture,
        availability,
        isSelectable: !isPast && !isFuture && isCurrentMonth && availability
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentMonth, availabilityMap, minDate, maxDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  const getStatusColor = (status: AvailabilitySlot['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'limited':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'booked':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'blocked':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
      default:
        return 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-500';
    }
  };

  const getStatusIcon = (status: AvailabilitySlot['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-3 h-3" />;
      case 'limited':
        return <AlertCircle className="w-3 h-3" />;
      case 'booked':
        return <XCircle className="w-3 h-3" />;
      case 'blocked':
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const selectedSlot = selectedDate ? availabilityMap.get(selectedDate) : null;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-playfair text-xl font-semibold text-foreground">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const isSelected = selectedDate === day.dateStr;
                  const availability = day.availability;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (day.isSelectable && onDateSelect) {
                          onDateSelect(day.dateStr, availability);
                        }
                      }}
                      disabled={!day.isSelectable}
                      className={cn(
                        "relative p-2 h-16 text-sm border rounded-lg transition-all duration-200",
                        "hover:border-red-200 dark:hover:border-red-800",
                        {
                          // Base styles
                          "bg-background border-border": true,
                          
                          // Current month
                          "text-foreground": day.isCurrentMonth,
                          "text-muted-foreground": !day.isCurrentMonth,
                          
                          // Today
                          "ring-2 ring-red-200 dark:ring-red-800": day.isToday,
                          
                          // Selected
                          "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-700": isSelected,
                          
                          // Disabled
                          "opacity-50 cursor-not-allowed": !day.isSelectable,
                          "cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/10": day.isSelectable,
                          
                          // Availability status
                          "border-green-200 dark:border-green-800": availability?.status === 'available',
                          "border-yellow-200 dark:border-yellow-800": availability?.status === 'limited',
                          "border-red-200 dark:border-red-800": availability?.status === 'booked',
                          "border-gray-200 dark:border-gray-700": availability?.status === 'blocked',
                        }
                      )}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className={cn(
                          "font-medium",
                          day.isToday && "text-red-600 dark:text-red-400"
                        )}>
                          {day.date.getDate()}
                        </span>
                        
                        {availability && (
                          <div className="flex items-center gap-1 mt-1">
                            {getStatusIcon(availability.status)}
                            {showPricing && availability.price && (
                              <span className="text-xs text-muted-foreground">
                                ₹{(availability.price / 1000).toFixed(0)}k
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-4">
          {selectedSlot ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarIcon className="w-5 h-5 text-red-600" />
                  {new Date(selectedDate!).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedSlot.status)}>
                    {getStatusIcon(selectedSlot.status)}
                    <span className="ml-1 capitalize">{selectedSlot.status}</span>
                  </Badge>
                </div>

                {/* Pricing */}
                {showPricing && selectedSlot.price && (
                  <div className="flex items-center gap-2 text-sm">
                    <IndianRupee className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{formatPrice(selectedSlot.price)}</span>
                    <span className="text-muted-foreground">per event</span>
                  </div>
                )}

                {/* Guest Capacity */}
                {selectedSlot.maxGuests && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Up to {selectedSlot.maxGuests} guests</span>
                  </div>
                )}

                {/* Time Slots */}
                {showTimeSlots && selectedSlot.timeSlots && selectedSlot.timeSlots.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      Available Time Slots
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedSlot.timeSlots.map((timeSlot) => (
                        <button
                          key={timeSlot.id}
                          onClick={() => onTimeSlotSelect?.(selectedDate!, timeSlot)}
                          disabled={timeSlot.status === 'booked'}
                          className={cn(
                            "p-2 text-xs rounded border transition-colors",
                            {
                              "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/30": 
                                timeSlot.status === 'available',
                              "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed": 
                                timeSlot.status === 'booked',
                              "ring-2 ring-red-200 dark:ring-red-800": 
                                selectedTimeSlot === timeSlot.id
                            }
                          )}
                        >
                          <div>{timeSlot.time}</div>
                          {timeSlot.price && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatPrice(timeSlot.price)}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedSlot.notes && (
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {selectedSlot.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Select a date to view availability details
                </p>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <AlertCircle className="w-3 h-3 text-yellow-600" />
                <span>Limited availability</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <XCircle className="w-3 h-3 text-red-600" />
                <span>Booked</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <XCircle className="w-3 h-3 text-gray-500" />
                <span>Blocked</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
