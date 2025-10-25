import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Heart, Share, MapPin, Users, DollarSign, Check, Star, Phone, Mail, Globe } from 'lucide-react';
import { toast } from 'sonner';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import VenueMap from '@/components/venues/VenueMap';
import GoogleMapsApiInput from '@/components/venues/GoogleMapsApiInput';
import { FEATURED_VENUES } from '@/data/venues';

const VenueDetail: React.FC = () => {
  const { id } = useParams();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [liked, setLiked] = useState(false);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | null>(null);
  const [venue, setVenue] = useState<any>(null);
  
  useEffect(() => {
    // Get venue data
    const foundVenue = FEATURED_VENUES.find(v => v.id === id);
    setVenue(foundVenue);
    
    // Check for saved API key
    const savedApiKey = localStorage.getItem('googleMapsApiKey');
    if (savedApiKey) {
      setGoogleMapsApiKey(savedApiKey);
    }
  }, [id]);
  
  const toggleLike = () => {
    setLiked(!liked);
    if (!liked) {
      toast.success('Added to favorites');
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };
  
  const handleBooking = () => {
    if (!date) {
      toast.error('Please select a date first');
      return;
    }
    
    toast.success(`Booking request sent for ${date.toLocaleDateString()}`);
    // In a real app, this would navigate to a booking flow or send an inquiry
  };

  if (!venue) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading venue information...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Image Gallery */}
        <section className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {venue.image && (
                <CarouselItem>
                  <div className="w-full h-[60vh] relative">
                    <img 
                      src={venue.image} 
                      alt={`${venue.name}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <CarouselPrevious className="relative" />
              <CarouselNext className="relative" />
            </div>
          </Carousel>
        </section>
        
        {/* Venue Information */}
        <section className="py-8">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Details */}
              <div className="w-full lg:w-2/3">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="font-playfair font-bold text-3xl md:text-4xl mb-3">
                      {venue.name}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin size={18} className="mr-1" />
                      <span>{venue.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                        <Star size={16} className="mr-1" fill="currentColor" />
                        <span>{venue.rating}</span>
                      </div>
                      <span className="text-gray-500">({venue.reviewCount || '100+'} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={toggleLike} className={liked ? "text-red-500" : ""}>
                      <Heart size={20} className={liked ? "fill-current" : ""} />
                    </Button>
                    <Button variant="outline" onClick={handleShare}>
                      <Share size={20} />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-6">
                  {venue.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline">{tag}</Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center p-4 bg-soft-gray rounded-lg">
                    <DollarSign className="text-wed mr-3" size={24} />
                    <div>
                      <p className="text-sm text-gray-500">Price Range</p>
                      <p className="font-medium">{venue.priceRange}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-soft-pink rounded-lg">
                    <Users className="text-wed mr-3" size={24} />
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="font-medium">{venue.capacity ? `${venue.capacity.min}-${venue.capacity.max} guests` : '100-500 guests'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-soft-peach rounded-lg">
                    <Check className="text-wed mr-3" size={24} />
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p className="font-medium">Check calendar</p>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="overview">
                  <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <div>
                      <p className="text-lg mb-4">{venue.description}</p>
                      {venue.longDescription && (
                        <p className="whitespace-pre-line text-gray-700">{venue.longDescription}</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="location">
                    <div className="space-y-4">
                      <p className="text-lg mb-2">Find {venue.name} at:</p>
                      <p className="text-gray-700 mb-4">{venue.location}</p>
                      
                      {!googleMapsApiKey ? (
                        <GoogleMapsApiInput onApiKeySet={setGoogleMapsApiKey} />
                      ) : (
                        <div className="h-[400px]">
                          <VenueMap 
                            name={venue.name}
                            address={venue.location}
                            coordinates={venue.coordinates}
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contact">
                    <div className="space-y-6">
                      <h3 className="font-playfair text-xl font-semibold mb-4">Contact Information</h3>
                      
                      {venue.contactInfo && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {venue.contactInfo.phone && (
                            <div className="flex items-start gap-3">
                              <div className="bg-soft-gray p-3 rounded-full">
                                <Phone className="text-wed" size={20} />
                              </div>
                              <div>
                                <h4 className="font-medium">Phone</h4>
                                <p className="text-gray-700">{venue.contactInfo.phone}</p>
                              </div>
                            </div>
                          )}
                          
                          {venue.contactInfo.email && (
                            <div className="flex items-start gap-3">
                              <div className="bg-soft-pink p-3 rounded-full">
                                <Mail className="text-wed" size={20} />
                              </div>
                              <div>
                                <h4 className="font-medium">Email</h4>
                                <p className="text-gray-700">{venue.contactInfo.email}</p>
                              </div>
                            </div>
                          )}
                          
                          {venue.contactInfo.website && (
                            <div className="flex items-start gap-3">
                              <div className="bg-soft-peach p-3 rounded-full">
                                <Globe className="text-wed" size={20} />
                              </div>
                              <div>
                                <h4 className="font-medium">Website</h4>
                                <p className="text-gray-700">{venue.contactInfo.website}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-8">
                        <Button className="bg-wed hover:bg-wed/90">
                          Contact Venue Directly
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="amenities">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(venue.amenities || [
                        'Banquet Halls', 'Lawns/Poolside', 'Bridal Suite',
                        'In-house Catering', 'Alcohol License', 'DJ/Music',
                        'Parking', 'Accommodation', 'Air Conditioning'
                      ]).map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center p-2">
                          <Check size={18} className="text-green-500 mr-2" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews">
                    <div className="space-y-6">
                      {(venue.reviews || [
                        {
                          id: '1',
                          author: 'Priya & Rahul',
                          date: 'March 2023',
                          rating: 5,
                          content: `${venue.name} exceeded all our expectations! The venue is even more beautiful in person, and the staff was incredibly helpful throughout the planning process. Our guests are still talking about how magical our wedding was.`
                        },
                        {
                          id: '2',
                          author: 'Ananya & Vikram',
                          date: 'December 2022',
                          rating: 4,
                          content: `We had our dream wedding at ${venue.name}. The venue was stunning and made for perfect photos. The only small issue was coordinating with some of the staff members, but overall it was a wonderful experience.`
                        }
                      ]).map((review: any) => (
                        <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">{review.author}</div>
                            <div className="text-gray-500 text-sm">{review.date}</div>
                          </div>
                          <div className="flex mb-2">
                            {Array(5).fill(0).map((_, i) => (
                              <Star 
                                key={i} 
                                size={16} 
                                className={i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Right Column - Booking */}
              <div className="w-full lg:w-1/3">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                  <h3 className="font-playfair font-semibold text-xl mb-4">Book this Venue</h3>
                  
                  <div className="mb-4">
                    <p className="text-gray-600 mb-1">Starting from</p>
                    <p className="text-2xl font-playfair font-semibold text-wed">
                      {venue.priceRange.split(' - ')[0]}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="font-medium mb-2">Select a date</p>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      disabled={(date) => {
                        // Disable past dates and dates more than a year in the future
                        const today = new Date();
                        const maxDate = new Date();
                        maxDate.setFullYear(today.getFullYear() + 1);
                        return date < today || date > maxDate;
                      }}
                    />
                  </div>
                  
                  <Button 
                    className="w-full bg-wed hover:bg-wed/90 mb-3"
                    onClick={handleBooking}
                  >
                    Request Booking
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    Contact Venue
                  </Button>
                  
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    No payment required to book
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default VenueDetail;
