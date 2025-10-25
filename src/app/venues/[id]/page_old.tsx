"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  Share, 
  MapPin, 
  Users, 
  DollarSign, 
  Check, 
  Star, 
  Phone, 
  Mail, 
  Globe,
  Calendar,
  Clock,
  Wifi,
  Car,
  Utensils,
  Camera,
  Music,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight,
  Play,
  Download,
  Share2,
  MessageCircle,
  ThumbsUp,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
  Gift,
  Flower2
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import VenueMap from "@/components/venues/VenueMap";
import GoogleMapsApiInput from "@/components/venues/GoogleMapsApiInput";
import { FEATURED_VENUES } from "@/data/venues";
import { getMockAvailability, getUrgencyInfo } from "@/data/mockAvailability";
import Section from "@/components/layout/Section";

interface Props {
  params: Promise<{ id: string }> | { id: string };
}

export default function Page({ params }: Props) {
  const [id, setId] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [liked, setLiked] = useState(false);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | null>(null);
  const [venue, setVenue] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [eventType, setEventType] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    budget: ''
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [showContactForm, setShowContactForm] = useState(false);

  // Initialize params
  useEffect(() => {
    const initializeParams = async () => {
      try {
        // Handle both Promise and direct object for params
        const resolvedParams = params instanceof Promise ? await params : params;
        setId(resolvedParams.id);
      } catch (error) {
        console.error('Error processing params:', error);
      }
    };
    
    initializeParams();
  }, [params]);

  // Initialize venue data when id is available
  useEffect(() => {
    if (!id) return;
    
    const foundVenue = FEATURED_VENUES.find((v) => v.id.toString() === id);
    setVenue(foundVenue);

    const savedApiKey = typeof window !== "undefined" ? localStorage.getItem("googleMapsApiKey") : null;
    if (savedApiKey) setGoogleMapsApiKey(savedApiKey);
  }, [id]);

  // Enhanced venue data with more details
  const enhancedVenue = venue ? {
    ...venue,
    images: venue.image ? [venue.image, venue.image, venue.image] : [],
    amenities: venue.amenities || [
      'Air Conditioning', 'Parking Available', 'Catering Services', 'Sound System',
      'Lighting Equipment', 'Bridal Room', 'Guest Restrooms', 'Dance Floor',
      'Stage/Platform', 'WiFi Available', 'Security', 'Valet Parking'
    ],
    features: [
      'Indoor/Outdoor Options',
      'Professional Photography Allowed',
      'Decoration Flexibility',
      'Multiple Event Spaces',
      'Vendor Flexibility',
      'Late Night Events'
    ],
    policies: [
      'Advance booking required',
      'Cancellation policy applies',
      'Security deposit required',
      'No outside alcohol policy',
      'Decoration guidelines apply'
    ],
    reviews: [
      {
        id: 1,
        name: 'Priya & Arjun',
        rating: 5,
        date: '2024-01-15',
        comment: 'Absolutely stunning venue! The staff was incredibly helpful and the facilities exceeded our expectations. Our wedding was perfect!',
        verified: true,
        helpful: 24
      },
      {
        id: 2,
        name: 'Kavya & Rohit',
        rating: 5,
        date: '2024-02-20',
        comment: 'Beautiful location with amazing food and service. The management team made our special day stress-free and memorable.',
        verified: true,
        helpful: 18
      },
      {
        id: 3,
        name: 'Meera & Vikash',
        rating: 4,
        date: '2024-03-10',
        comment: 'Great venue with excellent amenities. The only minor issue was parking during peak hours, but overall fantastic experience.',
        verified: true,
        helpful: 12
      }
    ],
    faqs: [
      {
        question: 'What is the minimum booking duration?',
        answer: 'We require a minimum booking of 4 hours for wedding events, with full-day packages available.'
      },
      {
        question: 'Do you provide catering services?',
        answer: 'Yes, we have in-house catering with customizable menus, or you can choose from our approved vendor list.'
      },
      {
        question: 'Is there parking available?',
        answer: 'Yes, we provide complimentary parking for up to 200 vehicles with valet service available.'
      },
      {
        question: 'Can we decorate the venue?',
        answer: 'Absolutely! We welcome decorations and work with many professional decorators. Some restrictions apply for safety.'
      }
    ]
  } : null;

  const toggleLike = () => {
    setLiked((prev) => !prev);
    const message = !liked ? 'Added to favorites ❤️' : 'Removed from favorites';
    if (typeof window !== "undefined") window.alert(message);
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        window.alert('Link copied to clipboard! 📋');
      } catch (err) {
        window.alert('Unable to copy link');
      }
    }
  };

  const handleBookingRequest = () => {
    if (!selectedDate || !guestCount) {
      window.alert('Please fill in the date and guest count');
      return;
    }
    window.alert(`Booking request sent! 🎉\n\nVenue: ${venue?.name}\nDate: ${selectedDate}\nGuests: ${guestCount}\n\nYou'll receive a response within 24 hours.`);
  };

  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      window.alert('Please fill in all required fields');
      return;
    }
    window.alert(`Message sent successfully! 📧\n\nThank you ${contactForm.name}, we'll get back to you within 24 hours.`);
    setContactForm({ name: '', email: '', phone: '', message: '', budget: '' });
    setShowContactForm(false);
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!enhancedVenue?.images) return;
    const totalImages = enhancedVenue.images.length;
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    } else {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }
  };

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (!enhancedVenue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Venue not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Hero Image Gallery */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="relative w-full h-full">
          {enhancedVenue.images && enhancedVenue.images.length > 0 ? (
            <img 
              src={enhancedVenue.images[currentImageIndex]} 
              alt={`${enhancedVenue.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-50 via-white to-amber-50 dark:from-red-950/20 dark:via-gray-900 dark:to-amber-950/20 flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No images available</p>
              </div>
            </div>
          )}
          
          {/* Image Navigation */}
          {enhancedVenue.images && enhancedVenue.images.length > 1 && (
            <>
              <button
                onClick={() => handleImageNavigation('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => handleImageNavigation('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {enhancedVenue.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Overlay Actions */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleLike}
              className={`bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-sm ${liked ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleShare}
              className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 backdrop-blur-sm"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Venue Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 backdrop-blur-sm">
              <Award className="w-4 h-4 mr-2" />
              Verified Venue
            </Badge>
          </div>
        </div>
      </section>

      {/* Enhanced Venue Information */}
      <Section className="py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-3">{enhancedVenue.name}</h1>
                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{enhancedVenue.location}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <div className="flex items-center bg-secondary/10 text-secondary px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        <span className="font-semibold">{enhancedVenue.rating}</span>
                      </div>
                      <span className="text-muted-foreground ml-2">({enhancedVenue.reviewCount || "150+"} reviews)</span>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {enhancedVenue.tags?.map((tag: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Key Information Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 border-0 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg mr-3">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price Range</p>
                    <p className="font-semibold">{enhancedVenue.priceRange}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Starting from per event</p>
              </Card>

              <Card className="p-6 border-0 bg-gradient-to-br from-secondary/5 to-secondary/10">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-secondary/10 rounded-lg mr-3">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-semibold">
                      {enhancedVenue.capacity ? `${enhancedVenue.capacity.min}-${enhancedVenue.capacity.max}` : "100-500"} guests
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Flexible seating arrangements</p>
              </Card>

              <Card className="p-6 border-0 bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Availability</p>
                    <p className="font-semibold text-green-600">Available</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Check specific dates below</p>
              </Card>
            </div>

            {/* Enhanced Tabs Section */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="p-6 border-0 bg-gradient-to-br from-background to-muted/20">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-primary" />
                    About This Venue
                  </h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {enhancedVenue.description}
                    </p>
                    {enhancedVenue.longDescription && (
                      <div className={`text-muted-foreground leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                        <p className="whitespace-pre-line">{enhancedVenue.longDescription}</p>
                      </div>
                    )}
                    {enhancedVenue.longDescription && (
                      <Button
                        variant="ghost"
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="mt-2 p-0 h-auto text-primary"
                      >
                        {showFullDescription ? 'Show Less' : 'Read More'}
                      </Button>
                    )}
                  </div>
                </Card>

                {/* Features */}
                <Card className="p-6 border-0 bg-gradient-to-br from-background to-muted/20">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-primary" />
                    Key Features
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {enhancedVenue.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Policies */}
                <Card className="p-6 border-0 bg-gradient-to-br from-background to-muted/20">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary" />
                    Venue Policies
                  </h3>
                  <div className="space-y-2">
                    {enhancedVenue.policies.map((policy: string, index: number) => (
                      <div key={index} className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{policy}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="amenities" className="space-y-6">
                <Card className="p-6 border-0 bg-gradient-to-br from-background to-muted/20">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-primary" />
                    Amenities & Services
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {enhancedVenue.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 bg-primary/10 rounded-lg mr-3">
                          {amenity.includes('Air') && <Wifi className="w-4 h-4 text-primary" />}
                          {amenity.includes('Parking') && <Car className="w-4 h-4 text-primary" />}
                          {amenity.includes('Catering') && <Utensils className="w-4 h-4 text-primary" />}
                          {amenity.includes('Sound') && <Music className="w-4 h-4 text-primary" />}
                          {!amenity.includes('Air') && !amenity.includes('Parking') && !amenity.includes('Catering') && !amenity.includes('Sound') && (
                            <CheckCircle className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="availability" className="space-y-6">
                <Card className="p-6 border-0 bg-gradient-to-br from-background to-muted/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-primary" />
                      Availability Calendar
                    </h3>
                    {(() => {
                      const urgencyInfo = getUrgencyInfo(id);
                      return urgencyInfo && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">{urgencyInfo.availableCount}</span> of{' '}
                          <span className="font-medium">{urgencyInfo.totalCount}</span> dates available
                        </div>
                      );
                    })()}
                  </div>
                  
                  {(() => {
                    const availability = getMockAvailability(id);
                    const urgencyInfo = getUrgencyInfo(id);
                    const getNext30Days = () => {
                      const days = [];
                      const today = new Date();
                      for (let i = 0; i < 30; i++) {
                        const date = new Date(today);
                        date.setDate(today.getDate() + i);
                        days.push(date);
                      }
                      return days;
                    };
                    const next30Days = getNext30Days();
                    
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'available':
                          return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
                        case 'booked':
                          return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
                        case 'blocked':
                          return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
                        default:
                          return 'bg-gray-50 dark:bg-gray-900 text-gray-500';
                      }
                    };

                    return (
                      <>
                        {urgencyInfo && (
                          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/10 dark:to-amber-900/10 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-center gap-3">
                              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{urgencyInfo.message}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {urgencyInfo.bookedCount} dates already booked this season
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-7 gap-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                              {day}
                            </div>
                          ))}
                          
                          {next30Days.map((date) => {
                            const dateStr = date.toISOString().split('T')[0];
                            const slot = availability.find(a => a.date === dateStr);
                            const isSelected = selectedDate === dateStr;
                            
                            return (
                              <button
                                key={dateStr}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`
                                  p-3 rounded-lg border transition-all text-center
                                  ${isSelected ? 'ring-2 ring-primary' : ''}
                                  ${slot ? getStatusColor(slot.status) : 'border-border hover:border-primary/50'}
                                  hover:shadow-md
                                `}
                              >
                                <div className="text-sm font-medium">{date.getDate()}</div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-border">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800" />
                            <span className="text-sm text-muted-foreground">Available</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800" />
                            <span className="text-sm text-muted-foreground">Booked</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
                            <span className="text-sm text-muted-foreground">Blocked</span>
                          </div>
                        </div>

                        {/* Selected Date Info */}
                        {selectedDate && (() => {
                          const selectedSlot = availability.find(a => a.date === selectedDate);
                          return selectedSlot && (
                            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                              <h4 className="font-semibold mb-2">Selected Date: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Status:</span>
                                  <Badge className={getStatusColor(selectedSlot.status)}>
                                    {selectedSlot.status}
                                  </Badge>
                                </div>
                                {selectedSlot.price_override && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Price:</span>
                                    <span className="font-medium">
                                      ₹{selectedSlot.price_override.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                )}
                                {selectedSlot.status === 'available' && (
                                  <Button className="w-full mt-4 bg-gradient-to-r from-primary to-secondary">
                                    Book This Date
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    );
                  })()}
                </Card>
              </TabsContent>

              <TabsContent value="location" className="space-y-6">
                <Card className="p-6 border-0 bg-gradient-to-br from-background to-muted/20">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    Location & Directions
                  </h3>
                  <p className="text-muted-foreground mb-6">{enhancedVenue.location}</p>
                  
                  {!googleMapsApiKey ? (
                    <GoogleMapsApiInput onApiKeySet={setGoogleMapsApiKey} />
                  ) : (
                    <div className="h-[400px] rounded-lg overflow-hidden">
                      <VenueMap
                        name={enhancedVenue.name}
                        address={enhancedVenue.location}
                        lat={enhancedVenue.coordinates?.lat}
                        lng={enhancedVenue.coordinates?.lng}
                      />
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Star className="w-5 h-5 mr-2 text-secondary fill-current" />
                    Guest Reviews
                  </h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-secondary fill-current" />
                    <span className="ml-1 font-semibold">{enhancedVenue.rating}</span>
                    <span className="text-muted-foreground ml-2">({enhancedVenue.reviews.length} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {enhancedVenue.reviews.map((review: any) => (
                    <Card key={review.id} className="p-6 border-0 bg-gradient-to-br from-background to-muted/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            {review.name.split(' ')[0][0]}{review.name.split(' ')[2] ? review.name.split(' ')[2][0] : ''}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-semibold">{review.name}</span>
                              {review.verified && (
                                <Badge variant="outline" className="ml-2 text-xs text-green-600 border-green-200">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center mt-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-secondary fill-current" />
                              ))}
                              <span className="text-xs text-muted-foreground ml-2">{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{review.comment}</p>
                      <div className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Helpful ({review.helpful})
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <Card className="p-6 border-0 bg-gradient-to-br from-background to-muted/20">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                    Contact Information
                  </h3>
                  
                  {enhancedVenue.contactInfo ? (
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {enhancedVenue.contactInfo.phone && (
                        <div className="flex items-center p-4 bg-muted/30 rounded-lg">
                          <div className="p-3 bg-primary/10 rounded-full mr-4">
                            <Phone className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Phone</h4>
                            <p className="text-muted-foreground">{enhancedVenue.contactInfo.phone}</p>
                          </div>
                        </div>
                      )}
                      
                      {enhancedVenue.contactInfo.email && (
                        <div className="flex items-center p-4 bg-muted/30 rounded-lg">
                          <div className="p-3 bg-primary/10 rounded-full mr-4">
                            <Mail className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Email</h4>
                            <p className="text-muted-foreground">{enhancedVenue.contactInfo.email}</p>
                          </div>
                        </div>
                      )}
                      
                      {enhancedVenue.contactInfo.website && (
                        <div className="flex items-center p-4 bg-muted/30 rounded-lg">
                          <div className="p-3 bg-primary/10 rounded-full mr-4">
                            <Globe className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Website</h4>
                            <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Visit Website
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Contact information will be provided after booking inquiry</p>
                    </div>
                  )}
                  
                  <Separator className="my-6" />
                  
                  {/* Contact Form */}
                  <div>
                    <h4 className="font-semibold mb-4">Send a Message</h4>
                    <Button 
                      onClick={() => setShowContactForm(!showContactForm)}
                      variant="outline" 
                      className="w-full mb-4"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {showContactForm ? 'Hide Contact Form' : 'Show Contact Form'}
                    </Button>
                    
                    {showContactForm && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              value={contactForm.name}
                              onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                              placeholder="Your full name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={contactForm.email}
                              onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={contactForm.phone}
                              onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                              placeholder="+91 98765 43210"
                            />
                          </div>
                          <div>
                            <Label htmlFor="budget">Budget Range</Label>
                            <Input
                              id="budget"
                              value={contactForm.budget}
                              onChange={(e) => setContactForm({...contactForm, budget: e.target.value})}
                              placeholder="₹2-5 Lakhs"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            value={contactForm.message}
                            onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                            placeholder="Tell us about your event requirements..."
                            rows={4}
                          />
                        </div>
                        <Button onClick={handleContactSubmit} className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Enhanced Booking Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Main Booking Card */}
              <Card className="p-6 border-0 bg-gradient-to-br from-background to-muted/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Book This Venue
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="event-date">Event Date *</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guest-count">Number of Guests *</Label>
                    <Input
                      id="guest-count"
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      placeholder="e.g., 200"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="event-type">Event Type</Label>
                    <Input
                      id="event-type"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      placeholder="Wedding, Reception, etc."
                    />
                  </div>
                  
                  <Button 
                    onClick={handleBookingRequest} 
                    className="w-full"
                    size="lg"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Send Booking Inquiry
                  </Button>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Instant response within 24 hours</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>No booking fees or hidden charges</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Direct communication with venue</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Secure and verified venue</span>
                  </div>
                </div>
              </Card>
              
              {/* FAQ Card */}
              <Card className="p-6 border-0 bg-gradient-to-br from-background to-muted/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-primary" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {enhancedVenue.faqs.map((faq: any, index: number) => (
                    <div key={index} className="border-b border-muted/30 pb-3 last:border-b-0">
                      <h4 className="font-medium text-sm mb-2">{faq.question}</h4>
                      <p className="text-xs text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
