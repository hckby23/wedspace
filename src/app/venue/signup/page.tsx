'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Users, 
  DollarSign,
  Star,
  Award,
  CheckCircle,
  ArrowRight,
  Crown,
  Zap,
  Target,
  TrendingUp,
  Heart,
  Calendar,
  Camera,
  Wifi,
  Car,
  Utensils,
  Music,
  Shield,
  Clock,
  ThumbsUp,
  Eye,
  MessageSquare,
  Rocket,
  Sparkles,
  Gift,
  Trophy,
  Globe
} from 'lucide-react';
import EnhancedPageHero from '@/components/layout/EnhancedPageHero';
import PageContainer from '@/components/layout/PageContainer';

interface FormData {
  venueName: string;
  venueType: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  capacity: string;
  packagePrice: string;
  amenities: string[];
  description: string;
  spaces: Array<{name: string; capacity: number; type: string}>;
  weekdayPrice: string;
  weekendPrice: string;
  policies: string;
}

export default function VenueSignup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    venueName: '',
    venueType: 'banquet-hall',
    city: '',
    address: '',
    email: '',
    phone: '',
    capacity: '',
    packagePrice: '',
    amenities: [],
    description: '',
    spaces: [],
    weekdayPrice: '',
    weekendPrice: '',
    policies: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        window.alert("Thank you! Your venue profile has been created. Our team will review and approve it within 24 hours.");
      }, 1500);
    }
  };

  const updateForm = (field: keyof FormData, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = form.amenities.includes(amenity)
      ? form.amenities.filter(a => a !== amenity)
      : [...form.amenities, amenity];
    updateForm('amenities', newAmenities);
  };

  const venueTypes = [
    { value: 'banquet-hall', label: 'Banquet Hall', icon: Building2 },
    { value: 'resort', label: 'Resort', icon: Globe },
    { value: 'hotel', label: 'Hotel', icon: Building2 },
    { value: 'farmhouse', label: 'Farmhouse', icon: Heart },
    { value: 'palace', label: 'Palace/Heritage', icon: Crown },
    { value: 'garden', label: 'Garden/Outdoor', icon: Sparkles },
    { value: 'club', label: 'Club', icon: Trophy },
    { value: 'other', label: 'Other', icon: Building2 }
  ];

  const amenitiesList = [
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'ac', label: 'Air Conditioning', icon: Zap },
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'catering', label: 'In-house Catering', icon: Utensils },
    { id: 'decoration', label: 'Decoration Services', icon: Sparkles },
    { id: 'music', label: 'Sound System', icon: Music },
    { id: 'photography', label: 'Photography Area', icon: Camera },
    { id: 'accommodation', label: 'Guest Accommodation', icon: Building2 }
  ];

  const benefits = [
    {
      icon: Eye,
      title: '10x More Visibility',
      description: 'Featured venues get 10x more profile views from engaged couples',
      color: 'text-blue-600'
    },
    {
      icon: Target,
      title: 'Quality Leads',
      description: 'Connect with couples whose budget and preferences match your venue',
      color: 'text-green-600'
    },
    {
      icon: TrendingUp,
      title: 'Higher Bookings',
      description: 'Average 300% increase in bookings within 6 months',
      color: 'text-purple-600'
    },
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'Build trust with verified badges and authentic reviews',
      color: 'text-red-600'
    }
  ];

  const stats = [
    { label: 'Active Couples', value: '50,000+', icon: Heart },
    { label: 'Monthly Searches', value: '2M+', icon: Eye },
    { label: 'Average Booking Value', value: '₹8.5L', icon: DollarSign },
    { label: 'Venue Success Rate', value: '94%', icon: TrendingUp }
  ];

  const steps = [
    { number: 1, title: 'Basic Information', description: 'Venue details and contact' },
    { number: 2, title: 'Venue Features', description: 'Capacity, pricing, and amenities' },
    { number: 3, title: 'Final Details', description: 'Description and submission' }
  ];

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Building2, text: "Venue Partner" }}
        title="List Your"
        titleGradient="Venue"
        description="Connect with couples planning their dream weddings at your venue."
      />

      <PageContainer className="py-12">

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why Partner with WedSpace?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of successful venues who've grown their business with our platform
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

      {/* Registration Form */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Get Your Venue Listed Today
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Complete our simple 3-step process to start receiving bookings
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mb-12">
              <div className="flex items-center space-x-8">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                      currentStep >= step.number 
                        ? 'bg-gradient-to-r from-red-600 to-amber-600 border-red-600 text-white' 
                        : 'border-gray-300 dark:border-gray-600 text-gray-400'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-semibold">{step.number}</span>
                      )}
                    </div>
                    <div className="ml-4 hidden sm:block">
                      <div className={`font-semibold ${currentStep >= step.number ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                        {step.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{step.description}</div>
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-8 hidden sm:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Basic Information
                      </h3>
                      
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

                        <div className="md:col-span-2">
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
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Venue Features
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="capacity" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                            Maximum Capacity *
                          </Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="capacity"
                              value={form.capacity}
                              onChange={(e) => updateForm('capacity', e.target.value)}
                              placeholder="e.g., 500 guests"
                              className="pl-10 h-12 bg-white dark:bg-gray-700"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="packagePrice" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                            Starting Package Price *
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="packagePrice"
                              value={form.packagePrice}
                              onChange={(e) => updateForm('packagePrice', e.target.value)}
                              placeholder="e.g., ₹2,50,000"
                              className="pl-10 h-12 bg-white dark:bg-gray-700"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-700 dark:text-gray-300 font-semibold mb-4 block">
                          Available Amenities (Select all that apply)
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {amenitiesList.map((amenity) => (
                            <div
                              key={amenity.id}
                              onClick={() => toggleAmenity(amenity.id)}
                              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                form.amenities.includes(amenity.id)
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-red-300'
                              }`}
                            >
                              <amenity.icon className={`w-6 h-6 mx-auto mb-2 ${
                                form.amenities.includes(amenity.id) ? 'text-red-600' : 'text-gray-400'
                              }`} />
                              <div className={`text-sm text-center ${
                                form.amenities.includes(amenity.id) 
                                  ? 'text-red-700 dark:text-red-300 font-medium' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {amenity.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Final Details
                      </h3>
                      
                      <div>
                        <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                          Venue Description
                        </Label>
                        <textarea
                          id="description"
                          value={form.description}
                          onChange={(e) => updateForm('description', e.target.value)}
                          placeholder="Describe your venue's unique features, ambiance, and what makes it special for weddings..."
                          rows={6}
                          className="w-full px-3 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:border-red-500 dark:focus:border-red-400 text-gray-900 dark:text-white resize-none"
                        />
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          What happens next?
                        </h4>
                        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                          <li className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            Our team will contact you within 24 hours
                          </li>
                          <li className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-blue-600" />
                            Professional photography session (free)
                          </li>
                          <li className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-blue-600" />
                            Profile optimization and listing setup
                          </li>
                          <li className="flex items-center gap-2">
                            <Rocket className="w-4 h-4 text-blue-600" />
                            Go live and start receiving bookings
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="flex-1 h-14 border-gray-300 dark:border-gray-600"
                      >
                        Previous Step
                      </Button>
                    )}
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
                      ) : currentStep < 3 ? (
                        <>
                          Next Step
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <p className="text-gray-600 dark:text-gray-300">
                Already have a listing?{' '}
                <Link href="/venue/login" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold">
                  Login to your account
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
