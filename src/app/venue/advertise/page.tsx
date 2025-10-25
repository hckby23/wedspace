"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Camera,
  Award,
  DollarSign,
  Search,
  Shield,
  Crown,
  Sparkles,
  Rocket
} from "lucide-react";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";

interface ContactForm {
  venueName: string;
  email: string;
  phone: string;
  city: string;
  venueType: string;
  goals: string;
  budget: string;
}

const advertisingPackages = [
  {
    name: "Starter",
    price: "₹15,000",
    period: "/month",
    description: "Perfect for new venues getting started",
    features: [
      "Featured in search results",
      "Basic analytics dashboard",
      "Email support",
      "Up to 50 leads/month",
      "Standard listing optimization"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "₹35,000",
    period: "/month",
    description: "Most popular choice for growing venues",
    features: [
      "Premium search placement",
      "Advanced analytics & insights",
      "Priority phone support",
      "Up to 150 leads/month",
      "Professional photography session",
      "Social media promotion",
      "Featured venue badge"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "₹75,000",
    period: "/month",
    description: "Maximum visibility for established venues",
    features: [
      "Top search placement guarantee",
      "Dedicated account manager",
      "24/7 priority support",
      "Unlimited leads",
      "Monthly photography updates",
      "Exclusive marketing campaigns",
      "Custom venue showcase"
    ],
    popular: false
  }
];

const benefits = [
  {
    icon: TrendingUp,
    title: "3x More Bookings",
    description: "Our advertising partners see an average 300% increase in qualified inquiries",
    stat: "300%",
    color: "text-green-600"
  },
  {
    icon: Target,
    title: "Targeted Reach",
    description: "Connect with couples in your city, budget range, and preferred wedding style",
    stat: "95%",
    color: "text-blue-600"
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track ROI, lead quality, and booking conversion with detailed insights",
    stat: "Real-time",
    color: "text-purple-600"
  },
  {
    icon: Award,
    title: "Premium Placement",
    description: "Featured positioning in search results and curated venue collections",
    stat: "Top 3",
    color: "text-amber-600"
  }
];

const stats = [
  { value: "2.5M+", label: "Monthly venue searches" },
  { value: "85%", label: "Lead to booking conversion" },
  { value: "1000+", label: "Partner venues" },
  { value: "4.9/5", label: "Partner satisfaction" }
];

const venueTypes = [
  { value: "", label: "Select venue type" },
  { value: "banquet-hall", label: "Banquet Hall" },
  { value: "hotel", label: "Hotel" },
  { value: "resort", label: "Resort" },
  { value: "heritage", label: "Heritage Venue" },
  { value: "farmhouse", label: "Farmhouse" },
  { value: "destination", label: "Destination Venue" },
  { value: "other", label: "Other" }
];

export default function VenueAdvertisePage() {
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ContactForm>({
    venueName: '',
    email: '',
    phone: '',
    city: '',
    venueType: '',
    goals: '',
    budget: ''
  });

  const updateForm = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      window.alert("Thank you! Our advertising team will contact you within 24 hours with a customized proposal.");
      setForm({
        venueName: '',
        email: '',
        phone: '',
        city: '',
        venueType: '',
        goals: '',
        budget: ''
      });
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Rocket, text: "Venue Advertising" }}
        title="Premium"
        titleGradient="Advertising"
        description="Increase bookings and reach qualified couples with targeted advertising."
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
              Our advertising solutions are designed specifically for the Indian wedding market
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                  </div>
                  {/* Removed numeric stat display to avoid hard-coded claims */}
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

      {/* Advertising Packages */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Advertising Package
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Flexible plans designed to fit venues of all sizes and budgets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {advertisingPackages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 ${
                  pkg.popular ? 'ring-2 ring-red-500 dark:ring-red-400' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{pkg.description}</p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">{pkg.price}</span>
                      <span className="text-gray-600 dark:text-gray-300">{pkg.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => setSelectedPackage(pkg.name)}
                    className={`w-full h-12 ${
                      pkg.popular 
                        ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white' 
                        : 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white'
                    } shadow-lg font-semibold`}
                  >
                    {pkg.popular ? (
                      <>
                        <Crown className="w-5 h-5 mr-2" />
                        Get Started
                      </>
                    ) : (
                      'Choose Plan'
                    )}
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
                Get Your Custom Advertising Proposal
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Tell us about your venue and goals, and we'll create a tailored advertising strategy
              </p>
            </div>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="venueName" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Venue Name *
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="venueName"
                          value={form.venueName}
                          onChange={(e) => updateForm('venueName', e.target.value)}
                          placeholder="Your Venue Name"
                          className="pl-10 h-12 bg-white dark:bg-gray-700"
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
                          placeholder="your@venue.com"
                          className="pl-10 h-12 bg-white dark:bg-gray-700"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Phone Number *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="phone"
                          value={form.phone}
                          onChange={(e) => updateForm('phone', e.target.value)}
                          placeholder="+91 98765 43210"
                          className="pl-10 h-12 bg-white dark:bg-gray-700"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        City *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="city"
                          value={form.city}
                          onChange={(e) => updateForm('city', e.target.value)}
                          placeholder="Mumbai, Delhi, Bangalore..."
                          className="pl-10 h-12 bg-white dark:bg-gray-700"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="venueType" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Venue Type *
                      </Label>
                      <select
                        id="venueType"
                        value={form.venueType}
                        onChange={(e) => updateForm('venueType', e.target.value)}
                        className="w-full h-12 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:border-red-500 dark:focus:border-red-400 text-gray-900 dark:text-white"
                        required
                      >
                        {venueTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="budget" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Monthly Budget
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="budget"
                          value={form.budget}
                          onChange={(e) => updateForm('budget', e.target.value)}
                          placeholder="e.g., ₹25,000 - ₹50,000"
                          className="pl-10 h-12 bg-white dark:bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="goals" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                      Advertising Goals
                    </Label>
                    <textarea
                      id="goals"
                      value={form.goals}
                      onChange={(e) => updateForm('goals', e.target.value)}
                      placeholder="Tell us about your goals: increase bookings, reach premium clients, expand to new markets, etc."
                      rows={4}
                      className="w-full px-3 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:border-red-500 dark:focus:border-red-400 text-gray-900 dark:text-white resize-none"
                    />
                  </div>

                  {selectedPackage && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        Selected Package: {selectedPackage}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        Our team will contact you with a detailed proposal for the {selectedPackage} package.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white shadow-lg text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5 mr-2" />
                        Get Custom Proposal
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <p className="text-gray-600 dark:text-gray-300">
                Already advertising with us?{' '}
                <Link href="/venue/login" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold">
                  Access your dashboard
                  <ArrowRight className="w-4 h-4 inline ml-1" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      </PageContainer>
    </main>
  );
}
