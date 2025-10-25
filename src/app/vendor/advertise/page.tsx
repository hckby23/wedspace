'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Users, 
  Star, 
  Award,
  Zap,
  Crown,
  Gem,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Building2,
  Camera,
  Palette,
  Music,
  Utensils,
  Gift,
  Calendar,
  FileText,
  Sparkles,
  DollarSign,
  Eye,
  MessageSquare,
  TrendingDown,
  Shield,
  Clock,
  Rocket
} from 'lucide-react';
import EnhancedPageHero from '@/components/layout/EnhancedPageHero';
import PageContainer from '@/components/layout/PageContainer';

interface FormData {
  businessName: string;
  category: string;
  city: string;
  email: string;
  phone: string;
  message: string;
  budget: string;
}

export default function VendorAdvertise() {
  const [form, setForm] = useState<FormData>({ 
    businessName: '', 
    category: 'Photographer', 
    city: '', 
    email: '', 
    phone: '', 
    message: '',
    budget: 'starter'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      window.alert("Thank you! Our advertising team will contact you within 24 hours with a customized media kit and pricing options.");
    }, 1500);
  };

  const updateForm = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const categories = [
    { value: 'Photographer', icon: Camera, label: 'Photography' },
    { value: 'Makeup', icon: Palette, label: 'Makeup & Beauty' },
    { value: 'Decor', icon: Sparkles, label: 'Decoration' },
    { value: 'Catering', icon: Utensils, label: 'Catering' },
    { value: 'Music', icon: Music, label: 'Music & DJ' },
    { value: 'Planner', icon: Calendar, label: 'Wedding Planner' },
    { value: 'Invites', icon: FileText, label: 'Invitations' },
    { value: 'Gifts', icon: Gift, label: 'Gifts & Favors' }
  ];

  const packages = [
    {
      name: 'Starter',
      value: 'starter',
      price: '₹15,000',
      period: '/month',
      popular: false,
      features: [
        'Featured in category listings',
        'Basic analytics dashboard',
        'Up to 50 leads/month',
        'Email support',
        'Standard listing badge'
      ],
      color: 'from-blue-600 to-blue-700'
    },
    {
      name: 'Professional',
      value: 'professional',
      price: '₹35,000',
      period: '/month',
      popular: true,
      features: [
        'Premium placement in all searches',
        'Advanced analytics & insights',
        'Unlimited leads',
        'Priority phone support',
        'Verified vendor badge',
        'Social media promotion',
        'Featured in newsletters'
      ],
      color: 'from-red-600 to-amber-600'
    },
    {
      name: 'Enterprise',
      value: 'enterprise',
      price: '₹75,000',
      period: '/month',
      popular: false,
      features: [
        'Top placement guarantee',
        'Custom analytics reports',
        'Dedicated account manager',
        '24/7 priority support',
        'Premium vendor badge',
        'Homepage featured spots',
        'Custom marketing campaigns',
        'API access for integrations'
      ],
      color: 'from-purple-600 to-pink-600'
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Greater Visibility',
      description: 'Stand out with premium placement and improved profile discoverability',
      color: 'text-green-600'
    },
    {
      icon: Target,
      title: 'Precision Targeting',
      description: 'Reach couples by location, budget, style, and preferred dates',
      color: 'text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Actionable Analytics',
      description: 'Understand performance with lead quality and conversion insights',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Growing Audience',
      description: 'Access an expanding network of engaged couples across India',
      color: 'text-red-600'
    }
  ];

  const stats: Array<{label:string; value:string; icon:any}> = [];

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Crown, text: "Vendor Advertising" }}
        title="Grow Your"
        titleGradient="Wedding Business"
        description="Reach couples planning their dream weddings with targeted advertising."
      />

      <PageContainer className="py-12">

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why Advertise with WedSpace?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of successful vendors who've grown their business with our targeted advertising platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
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

      {/* Pricing Packages */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Growth Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Flexible advertising packages designed to fit your business goals and budget
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 ${pkg.popular ? 'ring-2 ring-red-500 scale-105' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-red-600 to-amber-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center mx-auto mb-4`}>
                    {index === 0 && <Zap className="w-8 h-8 text-white" />}
                    {index === 1 && <Crown className="w-8 h-8 text-white" />}
                    {index === 2 && <Gem className="w-8 h-8 text-white" />}
                  </div>
                  <CardTitle className="font-playfair text-2xl text-gray-900 dark:text-white">
                    {pkg.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{pkg.price}</span>
                    <span className="text-gray-600 dark:text-gray-300">{pkg.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                  <Button 
                    className={`w-full mt-8 ${pkg.popular ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700' : 'bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800'} text-white shadow-lg`}
                    onClick={() => updateForm('budget', pkg.value)}
                  >
                    Choose {pkg.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Get Your Custom Media Kit
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Tell us about your business and we'll create a personalized advertising strategy
              </p>
            </div>

            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="businessName" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Business Name *
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="businessName"
                          value={form.businessName}
                          onChange={(e) => updateForm('businessName', e.target.value)}
                          placeholder="Your Business Name"
                          className="pl-10 h-12 bg-white dark:bg-gray-800"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Category *
                      </Label>
                      <select
                        id="category"
                        value={form.category}
                        onChange={(e) => updateForm('category', e.target.value)}
                        className="w-full h-12 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:border-red-500 dark:focus:border-red-400 text-gray-900 dark:text-white"
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Primary City *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="city"
                          value={form.city}
                          onChange={(e) => updateForm('city', e.target.value)}
                          placeholder="Mumbai, Delhi, Bangalore..."
                          className="pl-10 h-12 bg-white dark:bg-gray-800"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Business Email *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => updateForm('email', e.target.value)}
                          placeholder="your@business.com"
                          className="pl-10 h-12 bg-white dark:bg-gray-800"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="phone"
                          value={form.phone}
                          onChange={(e) => updateForm('phone', e.target.value)}
                          placeholder="+91 98765 43210"
                          className="pl-10 h-12 bg-white dark:bg-gray-800"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="budget" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Preferred Package
                      </Label>
                      <select
                        id="budget"
                        value={form.budget}
                        onChange={(e) => updateForm('budget', e.target.value)}
                        className="w-full h-12 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:border-red-500 dark:focus:border-red-400 text-gray-900 dark:text-white"
                      >
                        <option value="starter">Starter - ₹15,000/month</option>
                        <option value="professional">Professional - ₹35,000/month</option>
                        <option value="enterprise">Enterprise - ₹75,000/month</option>
                        <option value="custom">Custom Package</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                      Tell us about your business goals
                    </Label>
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => updateForm('message', e.target.value)}
                      placeholder="What are your main advertising objectives? Any specific target audience or geographic focus?"
                      rows={4}
                      className="w-full px-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:border-red-500 dark:focus:border-red-400 text-gray-900 dark:text-white resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 h-14 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white shadow-lg text-lg font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5 mr-3" />
                          Get My Media Kit
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-14 px-8 border-gray-300 dark:border-gray-600"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Call Us Instead
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      </PageContainer>
    </main>
  );
}
