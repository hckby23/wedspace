"use client";

import React, { useState } from 'react';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Users, 
  IndianRupee, 
  Star, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  Clock,
  Camera,
  Wifi,
  Car,
  Utensils,
  Music,
  Shield,
  Award,
  Heart,
  Share2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AvailabilityCalendar, { AvailabilitySlot } from '@/components/calendar/AvailabilityCalendar';
import { Venue } from '@/components/venues/VenueCard';

interface VenueDetailsDrawerProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingRequest?: (venue: Venue) => void;
  onFavoriteToggle?: (venueId: string) => void;
}

const VenueDetailsDrawer: React.FC<VenueDetailsDrawerProps> = ({
  venue,
  isOpen,
  onClose,
  onBookingRequest,
  onFavoriteToggle
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>();

  if (!venue) return null;

  // Mock availability data - in real app, this would come from API
  const mockAvailability: AvailabilitySlot[] = [
    {
      date: '2024-08-20',
      status: 'available',
      price: venue.price,
      maxGuests: venue.capacity,
      timeSlots: [
        { id: '1', time: '10:00', status: 'available', price: venue.price },
        { id: '2', time: '14:00', status: 'available', price: venue.price },
        { id: '3', time: '18:00', status: 'booked' }
      ]
    },
    {
      date: '2024-08-21',
      status: 'limited',
      price: venue.price * 1.2,
      maxGuests: venue.capacity,
      timeSlots: [
        { id: '4', time: '16:00', status: 'available', price: venue.price * 1.2 }
      ]
    },
    {
      date: '2024-08-22',
      status: 'booked'
    }
  ];

  const images = venue.images || [venue.image];
  
  const amenities = [
    { icon: Wifi, label: 'Free WiFi', available: true },
    { icon: Car, label: 'Parking', available: true },
    { icon: Utensils, label: 'Catering', available: true },
    { icon: Music, label: 'Sound System', available: true },
    { icon: Camera, label: 'Photography', available: false },
    { icon: Shield, label: 'Security', available: true }
  ];

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DrawerHeader className="flex-shrink-0 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DrawerTitle className="text-xl font-playfair">
                  {venue.name}
                </DrawerTitle>
                <DrawerDescription className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4" />
                  {venue.location}
                </DrawerDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFavoriteToggle?.(venue.id)}
                  className="h-8 w-8 p-0"
                >
                  <Heart className={cn(
                    "w-4 h-4",
                    venue.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                  )} />
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <Share2 className="w-4 h-4" />
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 sticky top-0 bg-background z-10">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <div className="p-4 space-y-6">
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 mt-0">
                  {/* Key Info Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Card>
                      <CardContent className="p-3 text-center">
                        <IndianRupee className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <div className="font-semibold text-sm">{formatPrice(venue.price)}</div>
                        <div className="text-xs text-muted-foreground">Starting from</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <div className="font-semibold text-sm">{venue.capacity}</div>
                        <div className="text-xs text-muted-foreground">Max guests</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Star className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                        <div className="font-semibold text-sm">{venue.rating}</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                        <div className="font-semibold text-sm">{venue.verified ? 'Yes' : 'No'}</div>
                        <div className="text-xs text-muted-foreground">Verified</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {venue.featured && (
                      <Badge className="bg-gradient-to-r from-red-500 to-amber-500 text-white">
                        Featured
                      </Badge>
                    )}
                    {venue.verified && (
                      <Badge variant="success">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge variant="outline">{venue.type}</Badge>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold mb-2">About this venue</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {venue.description || "Experience the perfect blend of elegance and tradition at this stunning venue. With its beautiful architecture and modern amenities, it provides the ideal setting for your special day."}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="font-semibold mb-3">Amenities</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg border text-sm",
                            amenity.available 
                              ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 opacity-60"
                          )}
                        >
                          <amenity.icon className="w-4 h-4" />
                          <span>{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>+91 98765 43210</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>contact@{venue.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span>www.{venue.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Gallery Tab */}
                <TabsContent value="gallery" className="space-y-4 mt-0">
                  <div className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={images[currentImageIndex]}
                        alt={`${venue.name} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {images.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-white/90 dark:bg-gray-900/90"
                          onClick={() => navigateImage('prev')}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-white/90 dark:bg-gray-900/90"
                          onClick={() => navigateImage('next')}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.slice(0, 8).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={cn(
                            "aspect-square rounded overflow-hidden border-2 transition-all",
                            currentImageIndex === index 
                              ? "border-red-500" 
                              : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                          )}
                        >
                          <img
                            src={image}
                            alt={`${venue.name} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Availability Tab */}
                <TabsContent value="availability" className="mt-0">
                  <AvailabilityCalendar
                    availability={mockAvailability}
                    selectedDate={selectedDate}
                    onDateSelect={(date) => setSelectedDate(date)}
                    showPricing={true}
                    showTimeSlots={true}
                  />
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-4 mt-0">
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Reviews coming soon</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Footer */}
          <DrawerFooter className="flex-shrink-0 border-t">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open(`tel:+919876543210`, '_self')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700"
                onClick={() => onBookingRequest?.(venue)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Now
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default VenueDetailsDrawer;
