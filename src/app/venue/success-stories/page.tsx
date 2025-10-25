"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  TrendingUp, 
  Star, 
  Users, 
  Calendar, 
  MapPin, 
  Quote, 
  ArrowRight, 
  Award, 
  BarChart3, 
  Heart, 
  Camera, 
  Phone, 
  Mail,
  CheckCircle,
  Crown,
  Sparkles,
  Target,
  DollarSign,
  Clock,
  Zap
} from "lucide-react";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";

interface SuccessStory {
  id: string;
  venueName: string;
  location: string;
  venueType: string;
  image: string;
  beforeStats: {
    monthlyBookings: number;
    inquiries: number;
    rating: number;
  };
  afterStats: {
    monthlyBookings: number;
    inquiries: number;
    rating: number;
  };
  improvements: {
    bookingIncrease: string;
    inquiryIncrease: string;
    ratingImprovement: string;
    revenueGrowth: string;
  };
  testimonial: {
    quote: string;
    author: string;
    position: string;
  };
  keyStrategies: string[];
  timeline: string;
  featured: boolean;
}

const successStories: SuccessStory[] = [
  {
    id: "1",
    venueName: "The Grand Pavilion",
    location: "Delhi NCR",
    venueType: "Luxury Banquet Hall",
    image: "/api/placeholder/400/300",
    beforeStats: {
      monthlyBookings: 8,
      inquiries: 45,
      rating: 4.2
    },
    afterStats: {
      monthlyBookings: 18,
      inquiries: 125,
      rating: 4.8
    },
    improvements: {
      bookingIncrease: "125%",
      inquiryIncrease: "178%",
      ratingImprovement: "0.6",
      revenueGrowth: "₹45L"
    },
    testimonial: {
      quote: "WedSpace transformed our business completely. The targeted advertising and professional photography brought us premium clients we never reached before.",
      author: "Rajesh Sharma",
      position: "Owner, The Grand Pavilion"
    },
    keyStrategies: [
      "Premium search placement",
      "Professional photography",
      "Targeted advertising campaigns",
      "Review management system"
    ],
    timeline: "6 months",
    featured: true
  },
  {
    id: "2",
    venueName: "Lakeside Manor Resort",
    location: "Udaipur, Rajasthan",
    venueType: "Destination Wedding Resort",
    image: "/api/placeholder/400/300",
    beforeStats: {
      monthlyBookings: 5,
      inquiries: 28,
      rating: 4.0
    },
    afterStats: {
      monthlyBookings: 12,
      inquiries: 85,
      rating: 4.7
    },
    improvements: {
      bookingIncrease: "140%",
      inquiryIncrease: "203%",
      ratingImprovement: "0.7",
      revenueGrowth: "₹32L"
    },
    testimonial: {
      quote: "The analytics dashboard helped us understand our customers better. We optimized our packages and saw immediate results in bookings.",
      author: "Priya Mehta",
      position: "Marketing Manager, Lakeside Manor"
    },
    keyStrategies: [
      "Data-driven optimization",
      "Package restructuring",
      "Social media promotion",
      "Customer journey mapping"
    ],
    timeline: "4 months",
    featured: false
  },
  {
    id: "3",
    venueName: "Marigold Gardens",
    location: "Bangalore, Karnataka",
    venueType: "Garden Wedding Venue",
    image: "/api/placeholder/400/300",
    beforeStats: {
      monthlyBookings: 12,
      inquiries: 65,
      rating: 4.1
    },
    afterStats: {
      monthlyBookings: 22,
      inquiries: 140,
      rating: 4.9
    },
    improvements: {
      bookingIncrease: "83%",
      inquiryIncrease: "115%",
      ratingImprovement: "0.8",
      revenueGrowth: "₹28L"
    },
    testimonial: {
      quote: "The review management and customer communication tools helped us build stronger relationships. Our repeat business increased by 60%.",
      author: "Amit Patel",
      position: "Director, Marigold Gardens"
    },
    keyStrategies: [
      "Review optimization",
      "Customer communication",
      "Repeat business focus",
      "Quality service enhancement"
    ],
    timeline: "8 months",
    featured: false
  }
];

const overallStats: Array<any> = [];

const benefits = [
  {
    icon: Target,
    title: "Targeted Marketing",
    description: "Reach couples actively planning weddings in your area"
  },
  {
    icon: Camera,
    title: "Professional Photography",
    description: "High-quality images that showcase your venue's beauty"
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Data-driven decisions to optimize your business"
  },
  {
    icon: Award,
    title: "Premium Placement",
    description: "Featured positioning in search results and collections"
  }
];

export default function VenueSuccessStoriesPage() {
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Award, text: "Success Stories" }}
        title="Venue"
        titleGradient="Success Stories"
        description="See how venues are growing their business with WedSpace."
      />

      <PageContainer className="py-12">

      {/* Overall Stats removed to avoid hard-coded numeric claims */}

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Featured Success Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Learn from venues that have transformed their business with our platform
            </p>
          </div>

          <div className="space-y-12">
            {successStories.map((story, index) => (
              <Card 
                key={story.id} 
                className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 ${
                  story.featured ? 'ring-2 ring-red-500 dark:ring-red-400' : ''
                }`}
              >
                {story.featured && (
                  <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white px-6 py-3 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold">Featured Success Story</span>
                  </div>
                )}
                
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-amber-600 rounded-full flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white">
                            {story.venueName}
                          </h3>
                          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{story.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              <span>{story.venueType}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Numeric before/after metrics removed */}

                      {/* Key numeric improvements removed */}
                    </div>

                    <div>
                      {/* Testimonial removed to avoid unverifiable claims */}

                      {/* Key Strategies */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Success Strategies</h4>
                        <ul className="space-y-2">
                          {story.keyStrategies.map((strategy, strategyIndex) => (
                            <li key={strategyIndex} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{strategy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Timeline */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4" />
                        <span>Results achieved in {story.timeline}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-6">
              How We Drive Success
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive approach ensures every venue partner achieves their growth goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      </PageContainer>
    </main>
  );
}
