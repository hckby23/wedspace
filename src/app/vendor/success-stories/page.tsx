'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Star, 
  Award, 
  Users, 
  BarChart3, 
  Target,
  Camera,
  Palette,
  Music,
  Utensils,
  Calendar,
  Sparkles,
  Quote,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Heart,
  Zap,
  Crown,
  Trophy,
  ThumbsUp,
  MessageSquare,
  Eye,
  DollarSign,
  Rocket,
  Building2,
  PlayCircle
} from 'lucide-react';
import EnhancedPageHero from '@/components/layout/EnhancedPageHero';
import PageContainer from '@/components/layout/PageContainer';

export default function VendorSuccessStories() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Categories', icon: Award },
    { id: 'photography', label: 'Photography', icon: Camera },
    { id: 'makeup', label: 'Makeup & Beauty', icon: Palette },
    { id: 'music', label: 'Music & DJ', icon: Music },
    { id: 'catering', label: 'Catering', icon: Utensils },
    { id: 'planning', label: 'Wedding Planning', icon: Calendar },
    { id: 'decor', label: 'Decoration', icon: Sparkles }
  ];

  const featuredStories = [
    {
      id: 1,
      name: "LensCraft Studio",
      category: "photography",
      owner: "Rajesh Sharma",
      location: "Mumbai, Maharashtra",
      image: "/api/placeholder/400/300",
      beforeMetric: "12 bookings/month",
      afterMetric: "45 bookings/month",
      growth: "+275%",
      timeframe: "6 months",
      revenue: "₹8.5L/month",
      rating: 4.9,
      reviews: 156,
      story: "After joining WedSpace, our visibility increased dramatically. The premium placement and analytics helped us understand our customers better and optimize our packages.",
      testimonial: "WedSpace transformed our business. We went from struggling to find clients to being booked 3 months in advance. The platform's targeting is incredible.",
      keyWins: [
        "Premium placement in search results",
        "Advanced analytics insights",
        "Direct client communication tools",
        "Verified vendor badge"
      ],
      featured: true
    },
    {
      id: 2,
      name: "Glow & Grace MUA",
      category: "makeup",
      owner: "Priya Patel",
      location: "Delhi, NCR",
      image: "/api/placeholder/400/300",
      beforeMetric: "8 bookings/month",
      afterMetric: "32 bookings/month",
      growth: "+300%",
      timeframe: "4 months",
      revenue: "₹4.2L/month",
      rating: 4.8,
      reviews: 89,
      story: "The featured placement and social media promotion through WedSpace helped us reach brides we never could have found otherwise.",
      testimonial: "I was skeptical about advertising, but WedSpace's targeted approach brought me quality leads. Now I'm booked solid and raising my rates!",
      keyWins: [
        "Featured in category listings",
        "Social media promotion",
        "Quality lead filtering",
        "Portfolio showcase tools"
      ],
      featured: true
    },
    {
      id: 3,
      name: "Raga Strings",
      category: "music",
      owner: "Amit Kumar",
      location: "Bangalore, Karnataka",
      image: "/api/placeholder/400/300",
      beforeMetric: "15 events/month",
      afterMetric: "38 events/month",
      growth: "+153%",
      timeframe: "5 months",
      revenue: "₹6.8L/month",
      rating: 4.7,
      reviews: 124,
      story: "WedSpace's review management system helped us maintain consistent 5-star ratings, which boosted our ranking significantly.",
      testimonial: "The platform's review system and fast response tools helped us build trust with couples. Our booking rate doubled in just 5 months.",
      keyWins: [
        "Review management system",
        "Fast response tools",
        "Event calendar integration",
        "Multi-city presence"
      ],
      featured: false
    },
    {
      id: 4,
      name: "Royal Feast Catering",
      category: "catering",
      owner: "Suresh Gupta",
      location: "Jaipur, Rajasthan",
      image: "/api/placeholder/400/300",
      beforeMetric: "6 weddings/month",
      afterMetric: "28 weddings/month",
      growth: "+367%",
      timeframe: "8 months",
      revenue: "₹12.5L/month",
      rating: 4.9,
      reviews: 203,
      story: "WedSpace's enterprise package gave us dedicated account management and custom campaigns that transformed our business.",
      testimonial: "From a small local caterer to serving destination weddings across Rajasthan - WedSpace made this growth possible with their premium advertising.",
      keyWins: [
        "Dedicated account manager",
        "Custom marketing campaigns",
        "Destination wedding leads",
        "Premium vendor status"
      ],
      featured: true
    },
    {
      id: 5,
      name: "Dream Planners",
      category: "planning",
      owner: "Neha Singh",
      location: "Pune, Maharashtra",
      image: "/api/placeholder/400/300",
      beforeMetric: "4 weddings/month",
      afterMetric: "18 weddings/month",
      growth: "+350%",
      timeframe: "7 months",
      revenue: "₹9.2L/month",
      rating: 4.8,
      reviews: 67,
      story: "The AI-powered lead matching helped us connect with couples whose vision aligned perfectly with our planning style.",
      testimonial: "WedSpace's smart matching system brings us clients who are genuinely excited about our approach. The quality of leads is exceptional.",
      keyWins: [
        "AI-powered lead matching",
        "Portfolio optimization tools",
        "Client communication suite",
        "Vendor network access"
      ],
      featured: false
    },
    {
      id: 6,
      name: "Sparkle Decor",
      category: "decor",
      owner: "Kavita Joshi",
      location: "Ahmedabad, Gujarat",
      image: "/api/placeholder/400/300",
      beforeMetric: "10 events/month",
      afterMetric: "35 events/month",
      growth: "+250%",
      timeframe: "6 months",
      revenue: "₹7.8L/month",
      rating: 4.9,
      reviews: 142,
      story: "The visual portfolio tools and featured placement helped showcase our work to couples looking for unique decoration themes.",
      testimonial: "Our bookings tripled after optimizing our profile with WedSpace's tools. The platform really understands what couples are looking for.",
      keyWins: [
        "Visual portfolio optimization",
        "Theme-based categorization",
        "Seasonal campaign features",
        "Vendor collaboration tools"
      ],
      featured: false
    }
  ];

  const filteredStories = selectedCategory === 'all' 
    ? featuredStories 
    : featuredStories.filter(story => story.category === selectedCategory);

  const stats = [
    { label: 'Average Growth', value: '275%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Success Rate', value: '94%', icon: Target, color: 'text-blue-600' },
    { label: 'Happy Vendors', value: '2,500+', icon: Users, color: 'text-purple-600' },
    { label: 'Avg. ROI', value: '450%', icon: DollarSign, color: 'text-red-600' }
  ];

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Trophy, text: "Success Stories" }}
        title="Vendor"
        titleGradient="Success Stories"
        description="See how vendors are growing their businesses with WedSpace."
      />

      <PageContainer className="py-12">

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 ${
                  selectedCategory === category.id 
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white' 
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Vendor Success Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From small local businesses to industry leaders - see how WedSpace helps vendors achieve extraordinary growth
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {filteredStories.map((story, index) => (
              <Card key={story.id} className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 ${story.featured ? 'ring-2 ring-red-500' : ''}`}>
                {story.featured && (
                  <div className="absolute -top-3 left-6">
                    <Badge className="bg-gradient-to-r from-red-600 to-amber-600 text-white px-3 py-1">
                      Featured Success
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-amber-600 rounded-full flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-playfair text-xl font-bold text-gray-900 dark:text-white">
                          {story.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {story.location}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Owner: {story.owner}
                        </p>
                      </div>
                    </div>
                    {/* Removed numeric growth/timeframe claims */}
                  </div>

                  {/* Removed numeric before/after and revenue/rating metrics */}

                  {/* Story */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Success Story</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {story.story}
                    </p>
                  </div>

                  {/* Removed testimonial quotes to avoid unverifiable claims */}

                  {/* Key Wins */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Success Factors</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {story.keyWins.map((win, winIndex) => (
                        <div key={winIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{win}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white">
                      <Rocket className="w-4 h-4 mr-2" />
                      Start My Success Story
                    </Button>
                    <Button variant="outline" className="border-gray-300 dark:border-gray-600">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact {story.owner}
                    </Button>
                  </div>
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
