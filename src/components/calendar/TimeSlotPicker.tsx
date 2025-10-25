"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, IndianRupee, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimeSlot {
  id: string;
  time: string;
  endTime?: string;
  status: 'available' | 'booked' | 'limited';
  price?: number;
  maxGuests?: number;
  description?: string;
}

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedSlot?: string;
  onSlotSelect?: (slot: TimeSlot) => void;
  date?: Date;
  showPricing?: boolean;
  showCapacity?: boolean;
  className?: string;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  timeSlots,
  selectedSlot,
  onSlotSelect,
  date,
  showPricing = true,
  showCapacity = true,
  className
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  const categorizeTimeSlots = (slots: TimeSlot[]) => {
    return slots.reduce((acc, slot) => {
      const hour = parseInt(slot.time.split(':')[0]);
      let category: 'morning' | 'afternoon' | 'evening';
      
      if (hour < 12) {
        category = 'morning';
      } else if (hour < 17) {
        category = 'afternoon';
      } else {
        category = 'evening';
      }
      
      if (!acc[category]) acc[category] = [];
      acc[category].push(slot);
      
      return acc;
    }, {} as Record<'morning' | 'afternoon' | 'evening', TimeSlot[]>);
  };

  const categorizedSlots = categorizeTimeSlots(timeSlots);
  const filteredSlots = selectedCategory === 'all' 
    ? timeSlots 
    : categorizedSlots[selectedCategory] || [];

  const getStatusColor = (status: TimeSlot['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'limited':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'booked':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatTimeRange = (time: string, endTime?: string) => {
    if (endTime) {
      return `${time} - ${endTime}`;
    }
    return time;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-lg">
            Available Time Slots
            {date && (
              <span className="text-sm text-muted-foreground ml-2">
                for {date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            )}
          </h3>
        </div>
        
        {/* Category Filter */}
        <div className="flex items-center gap-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'morning', label: 'Morning' },
            { key: 'afternoon', label: 'Afternoon' },
            { key: 'evening', label: 'Evening' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(key as any)}
              className="text-xs"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Time Slots Grid */}
      {filteredSlots.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSlots.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            const isDisabled = slot.status === 'booked';
            
            return (
              <Card
                key={slot.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  {
                    "ring-2 ring-red-200 dark:ring-red-800 border-red-300 dark:border-red-700": isSelected,
                    "opacity-60 cursor-not-allowed": isDisabled,
                    "hover:border-red-200 dark:hover:border-red-800": !isDisabled && !isSelected
                  }
                )}
                onClick={() => !isDisabled && onSlotSelect?.(slot)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Time and Status */}
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-lg">
                        {formatTimeRange(slot.time, slot.endTime)}
                      </div>
                      <Badge className={cn("text-xs", getStatusColor(slot.status))}>
                        {slot.status === 'available' && 'Available'}
                        {slot.status === 'limited' && 'Limited'}
                        {slot.status === 'booked' && 'Booked'}
                      </Badge>
                    </div>

                    {/* Description */}
                    {slot.description && (
                      <p className="text-sm text-muted-foreground">
                        {slot.description}
                      </p>
                    )}

                    {/* Details */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        {/* Pricing */}
                        {showPricing && slot.price && (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <IndianRupee className="w-3 h-3" />
                            <span className="font-medium">{formatPrice(slot.price)}</span>
                          </div>
                        )}

                        {/* Capacity */}
                        {showCapacity && slot.maxGuests && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{slot.maxGuests} guests</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No time slots available for the selected category
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {timeSlots.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted p-3 rounded-lg">
          <div className="flex items-center gap-4">
            <span>
              {timeSlots.filter(s => s.status === 'available').length} available
            </span>
            <span>
              {timeSlots.filter(s => s.status === 'limited').length} limited
            </span>
            <span>
              {timeSlots.filter(s => s.status === 'booked').length} booked
            </span>
          </div>
          <div>
            Total: {timeSlots.length} slots
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
