import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Heart, Share, MapPin, Check, Star, Mail, Phone, Globe } from 'lucide-react';
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
import { FEATURED_VENDORS } from '@/data/vendors';

const VendorDetail: React.FC = () => {
  const { id } = useParams();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [liked, setLiked] = useState(false);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | null>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Get vendor data
    setLoading(true);
    const foundVendor = FEATURED_VENDORS.find(v => v.id === id);
    setVendor(foundVendor);
    setLoading(false);
    
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
    
    toast.success(`Consultation request sent for ${date.toLocaleDateString()}`);
    // In a real app, this would navigate to a booking flow or send an inquiry
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wed"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="container-custom text-center">
            <h1 className="font-playfair text-3xl font-bold mb-4">Vendor Not Found</h1>
            <p className="text-gray-600 mb-6">The vendor you're looking for doesn't exist or has been removed.</p>
            <Link to="/vendors">
              <Button>Browse All Vendors</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Generate some sample images if the vendor doesn't have them
  const vendorImages = vendor.images || [
    vendor.image,
    'https://images.unsplash.com/photo-1519741497674-611481863552',
    'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Image Gallery */}
        <section className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {vendorImages.map((image: string, index: number) => (
                <CarouselItem key={index}>
                  <div className="w-full h-[60vh] relative">
                    <img 
                      src={image} 
                      alt={`${vendor.name} - Image ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <CarouselPrevious className="relative" />
              <CarouselNext className="relative" />
            </div>
          </Carousel>
        </section>
        
        {/* Vendor Information */}
        <section className="py-8">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Details */}
              <div className="w-full lg:w-2/3">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="font-playfair font-bold text-3xl md:text-4xl mb-3">
                      {vendor.name}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin size={18} className="mr-1" />
                      <span>{vendor.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                        <Star size={16} className="mr-1" fill="currentColor" />
                        <span>{vendor.rating}</span>
                      </div>
                      <span className="text-gray-500">({vendor.reviewCount || vendor.reviews?.length || '100+'} reviews)</span>
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
                  <Badge className="bg-space hover:bg-space">{vendor.category}</Badge>
                  {vendor.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline">{tag}</Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center p-4 bg-soft-gray rounded-lg">
                    <Mail className="text-space mr-3" size={24} />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{vendor.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-soft-pink rounded-lg">
                    <Phone className="text-space mr-3" size={24} />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{vendor.phone}</p>
                    </div>
                  </div>
                  
                  {vendor.website && (
                    <div className="flex items-center p-4 bg-soft-peach rounded-lg">
                      <Globe className="text-space mr-3" size={24} />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <p className="font-medium">{vendor.website}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <Tabs defaultValue="overview">
                  <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                    {vendor.coordinates && <TabsTrigger value="location">Location</TabsTrigger>}
                    {vendor.faqs && vendor.faqs.length > 0 && <TabsTrigger value="faqs">FAQs</TabsTrigger>}
                    {vendor.reviews && vendor.reviews.length > 0 && <TabsTrigger value="reviews">Reviews</TabsTrigger>}
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <div>
                      <p className="text-lg mb-4">{vendor.description}</p>
                      <p className="whitespace-pre-line text-gray-700">{vendor.longDescription}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="services">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(vendor.services || [
                        `${vendor.category} Services`,
                        'Wedding Day Coverage',
                        'Consultation',
                        'Custom Packages',
                        'Local Services in Delhi NCR'
                      ]).map((service: string, index: number) => (
                        <div key={index} className="flex items-center p-2">
                          <Check size={18} className="text-green-500 mr-2" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  {vendor.coordinates && (
                    <TabsContent value="location">
                      <div className="space-y-4">
                        <p className="text-lg mb-2">Find {vendor.name} at:</p>
                        <p className="text-gray-700 mb-4">{vendor.location}</p>
                        
                        {!googleMapsApiKey ? (
                          <GoogleMapsApiInput onApiKeySet={setGoogleMapsApiKey} />
                        ) : (
                          <div className="h-[400px]">
                            <VenueMap 
                              name={vendor.name}
                              address={vendor.location}
                              coordinates={vendor.coordinates}
                            />
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  )}
                  
                  {vendor.faqs && vendor.faqs.length > 0 && (
                    <TabsContent value="faqs">
                      <div className="space-y-6">
                        {vendor.faqs.map((faq: any, index: number) => (
                          <div key={index}>
                            <h3 className="font-playfair font-semibold text-lg mb-1">{faq.question}</h3>
                            <p className="text-gray-700">{faq.answer}</p>
                            {index < vendor.faqs.length - 1 && <Separator className="mt-4" />}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  )}
                  
                  {vendor.reviews && vendor.reviews.length > 0 && (
                    <TabsContent value="reviews">
                      <div className="space-y-6">
                        {vendor.reviews.map((review: any) => (
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
                  )}
                </Tabs>
              </div>
              
              {/* Right Column - Booking */}
              <div className="w-full lg:w-1/3">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                  <h3 className="font-playfair font-semibold text-xl mb-4">Book a Consultation</h3>
                  
                  <div className="mb-4">
                    <p className="text-gray-600 mb-1">Starting from</p>
                    <p className="text-2xl font-playfair font-semibold text-space">{vendor.startingPrice.replace('From ', '')}</p>
                    {vendor.priceRange && (
                      <p className="text-sm text-gray-500">Full range: {vendor.priceRange}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <p className="font-medium mb-2">Select a date</p>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      disabled={(date) => {
                        // Disable past dates and dates more than 6 months in the future
                        const today = new Date();
                        const maxDate = new Date();
                        maxDate.setMonth(today.getMonth() + 6);
                        return date < today || date > maxDate;
                      }}
                    />
                  </div>
                  
                  <Button 
                    className="w-full bg-space hover:bg-space/90 mb-3"
                    onClick={handleBooking}
                  >
                    Request Consultation
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    Contact Vendor
                  </Button>
                  
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    No payment required for initial consultation
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

export default VendorDetail;
