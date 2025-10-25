"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  Share2, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Globe,
  Calendar,
  Clock,
  Shield,
  Award,
  CheckCircle,
  MessageCircle,
  IndianRupee,
  Sparkles,
  Users,
  Camera,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MOCK_VENDORS } from "@/data/mockVendors";
import { getMockAvailability, getUrgencyInfo } from "@/data/mockAvailability";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }> | { id: string };
}

export default function VendorDetailPage({ params }: Props) {
  const [id, setId] = useState<string>('');
  const [vendor, setVendor] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Initialize params
  useEffect(() => {
    const initializeParams = async () => {
      try {
        const resolvedParams = params instanceof Promise ? await params : params;
        setId(resolvedParams.id);
      } catch (error) {
        console.error('Error processing params:', error);
      }
    };
    
    initializeParams();
  }, [params]);

  // Initialize vendor data
  useEffect(() => {
    if (!id) return;
    
    const foundVendor = MOCK_VENDORS.find((v) => v.id === id);
    setVendor(foundVendor);
  }, [id]);

  if (!vendor) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Vendor Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The vendor you're looking for doesn't exist.</p>
            <Link href="/vendors">
              <Button>Back to Vendors</Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  const availability = getMockAvailability(vendor.id);
  const urgencyInfo = getUrgencyInfo(vendor.id);

  // Get next 30 days for calendar
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Image Gallery */}
      <Section className="pt-24 pb-12 bg-white dark:bg-gray-800">
        <PageContainer>
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-red-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/vendors" className="hover:text-red-600">Vendors</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white">{vendor.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <Carousel className="w-full">
                <CarouselContent>
                  {vendor.portfolio_images?.map((image: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                        <img
                          src={image}
                          alt={`${vendor.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>

            {/* Vendor Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                      {vendor.name}
                    </h1>
                    {vendor.verified && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="mb-4">
                    {vendor.category}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setLiked(!liked)}
                    className={liked ? 'text-red-600 border-red-600' : ''}
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{vendor.rating}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    ({vendor.review_count} reviews)
                  </span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Responds in {vendor.response_time_hours}h</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
                <MapPin className="w-5 h-5" />
                <span>{vendor.city}, {vendor.state}</span>
              </div>

              {/* Price Range */}
              <div className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/10 dark:to-amber-900/10 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starting Price</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{vendor.price_range}</p>
                  </div>
                  <IndianRupee className="w-12 h-12 text-red-600 opacity-20" />
                </div>
              </div>

              {/* Availability Badge */}
              {urgencyInfo && (
                <div className="mb-6">
                  <Badge 
                    variant={urgencyInfo.urgencyLevel === 'high' ? 'destructive' : 'outline'}
                    className="text-sm py-2 px-4"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {urgencyInfo.message}
                  </Badge>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Inquiry
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t dark:border-gray-700 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{vendor.contact_phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{vendor.contact_email}</span>
                </div>
                {vendor.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                      Visit Website
                      <ExternalLink className="w-3 h-3 inline ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* Main Content Tabs */}
      <Section className="py-12">
        <PageContainer>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {vendor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {vendor.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Why Choose Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Verified Professional</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Background checked and verified by WedSpace</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Quick Response</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Responds within {vendor.response_time_hours} hours</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Highly Rated</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{vendor.rating}/5 stars from {vendor.review_count} reviews</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Flexible Cancellation</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{vendor.cancellation_policy}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {vendor.services_offered?.map((service: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-white font-medium">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Availability Calendar
                    </CardTitle>
                    {urgencyInfo && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{urgencyInfo.availableCount}</span> of{' '}
                        <span className="font-medium">{urgencyInfo.totalCount}</span> dates available
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
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
                            ${isSelected ? 'ring-2 ring-red-600' : ''}
                            ${slot ? getStatusColor(slot.status) : 'border-gray-200 dark:border-gray-700'}
                            hover:shadow-md
                          `}
                        >
                          <div className="text-sm font-medium">{date.getDate()}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Blocked</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                    <p className="text-gray-600 dark:text-gray-400">Reviews coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </PageContainer>
      </Section>
    </main>
  );
}
