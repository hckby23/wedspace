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
  ExternalLink,
  AlertCircle,
  TrendingUp,
  Eye,
  Briefcase,
  Target
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MOCK_VENDORS } from "@/data/mockVendors";
import { getMockAvailability, getUrgencyInfo } from "@/data/mockAvailability";
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
              <Button className="bg-gradient-to-r from-red-600 to-red-700">Back to Vendors</Button>
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
      <section className="relative bg-white dark:bg-gray-800 pt-20">
        <PageContainer>
          {/* Breadcrumb */}
          <div className="py-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/vendors" className="hover:text-red-600 transition-colors">Vendors</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white font-medium">{vendor.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 pb-12">
            {/* Image Gallery */}
            <div>
              <Carousel className="w-full">
                <CarouselContent>
                  {vendor.portfolio_images?.map((image: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                        <img
                          src={image}
                          alt={`${vendor.name} - Portfolio ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>

              {/* Image Thumbnails */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {vendor.portfolio_images?.slice(0, 4).map((image: string, i: number) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity">
                    <img src={image} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                      {vendor.name}
                    </h1>
                    {vendor.verified && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-0">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <Badge variant="outline" className="mb-4 text-sm">
                    {vendor.category}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setLiked(!liked)}
                    className={`${liked ? 'text-red-600 border-red-600 bg-red-50 dark:bg-red-900/20' : ''}`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Rating & Stats */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{vendor.rating}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    ({vendor.review_count} reviews)
                  </span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">1.8K views</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 mb-6">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{vendor.city}, {vendor.state}</span>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="border-0 bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-900/10 dark:to-amber-900/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                        <IndianRupee className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Starting Price</p>
                        <p className="font-bold text-gray-900 dark:text-white">{vendor.price_range}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Response Time</p>
                        <p className="font-bold text-gray-900 dark:text-white">{vendor.response_time_hours}h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                        <Briefcase className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Experience</p>
                        <p className="font-bold text-gray-900 dark:text-white">{vendor.years_experience}+ years</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                        <Target className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
                        <p className="font-bold text-gray-900 dark:text-white">{vendor.completed_projects}+ events</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Availability Badge */}
              {urgencyInfo && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/10 dark:to-amber-900/10 rounded-xl border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{urgencyInfo.message}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {urgencyInfo.bookedCount} dates already booked • Book now to secure your date
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1 h-12 bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Inquiry
                </Button>
                <Button variant="outline" className="h-12 px-6 border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
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
      </section>

      {/* Main Content Tabs */}
      <section className="py-12">
        <PageContainer>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-amber-600 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-amber-600 data-[state=active]:text-white">
                Services
              </TabsTrigger>
              <TabsTrigger value="availability" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-amber-600 data-[state=active]:text-white">
                Availability
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-amber-600 data-[state=active]:text-white">
                Reviews
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="w-6 h-6 text-red-600" />
                    About {vendor.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    {vendor.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Why Choose Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-lg">Verified Professional</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Background checked and verified by WedSpace</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-xl">
                      <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-lg">Quick Response</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Responds within {vendor.response_time_hours} hours</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-lg">Highly Rated</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{vendor.rating}/5 stars from {vendor.review_count} clients</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl">
                      <Award className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-lg">Experienced</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{vendor.years_experience}+ years in the industry</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Shield className="w-6 h-6 text-blue-600" />
                    Cancellation Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {vendor.cancellation_policy}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="w-6 h-6 text-red-600" />
                    Services Offered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vendor.services_offered?.map((service: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-900/20 dark:to-amber-900/20 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Calendar className="w-6 h-6 text-red-600" />
                      Availability Calendar
                    </CardTitle>
                    {urgencyInfo && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-green-600">{urgencyInfo.availableCount}</span> of{' '}
                        <span className="font-medium">{urgencyInfo.totalCount}</span> dates available
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-3">
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
                            p-3 rounded-xl border-2 transition-all text-center font-medium
                            ${isSelected ? 'ring-2 ring-red-600 ring-offset-2 dark:ring-offset-gray-900' : ''}
                            ${slot ? getStatusColor(slot.status) : 'border-gray-200 dark:border-gray-700 hover:border-red-600 dark:hover:border-red-600'}
                            hover:shadow-lg transform hover:scale-105
                          `}
                        >
                          <div className="text-base">{date.getDate()}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Blocked</span>
                    </div>
                  </div>

                  {/* Selected Date Info */}
                  {selectedDate && (() => {
                    const selectedSlot = availability.find(a => a.date === selectedDate);
                    return selectedSlot && (
                      <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-gray-200 dark:border-gray-600">
                        <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                          {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                            <Badge className={`${getStatusColor(selectedSlot.status)} text-sm px-3 py-1`}>
                              {selectedSlot.status.toUpperCase()}
                            </Badge>
                          </div>
                          {selectedSlot.price_override && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Price:</span>
                              <span className="font-bold text-xl text-gray-900 dark:text-white">
                                ₹{selectedSlot.price_override.toLocaleString('en-IN')}
                              </span>
                            </div>
                          )}
                          {selectedSlot.status === 'available' && (
                            <Button className="w-full mt-4 h-12 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-semibold shadow-lg">
                              <Calendar className="w-4 h-4 mr-2" />
                              Book This Date
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                      Customer Reviews
                    </CardTitle>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 px-4 py-2 rounded-full">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-xl text-gray-900 dark:text-white">{vendor.rating}</span>
                      <span className="text-gray-600 dark:text-gray-400">({vendor.review_count} reviews)</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">Reviews Coming Soon</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      This vendor has {vendor.review_count} verified reviews. Check back soon to read them!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </PageContainer>
      </section>
    </main>
  );
}
