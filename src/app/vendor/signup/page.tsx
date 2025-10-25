"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  Star, 
  CheckCircle, 
  Camera, 
  Palette, 
  Music, 
  ChefHat,
  Sparkles,
  IndianRupee,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  BarChart3,
  MessageSquare,
  Globe,
  Zap,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileImage,
  Calendar,
  Target,
  Briefcase,
  Heart,
  Crown,
  Gem,
  Rocket,
  ChevronRight,
  Check,
  AlertCircle,
  Info,
  Lightbulb,
  Gift,
  Percent,
  DollarSign,
  Handshake,
  UserCheck,
  BadgeCheck,
  ShieldCheck,
  Verified,
  Eye,
  EyeOff,
  Lock,
  User,
  Building,

  Smartphone,
  AtSign,
  FileText,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Plus,
  X,
  Save,
  Send
} from "lucide-react";

interface VendorFormData {
  // Business Information
  businessName: string;
  category: string;
  subCategory: string;
  businessType: string;
  
  // Contact Information
  ownerName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  
  // Location
  city: string;
  state: string;
  address: string;
  pincode: string;
  
  // Business Details
  experience: string;
  teamSize: string;
  description: string;
  specialties: string[];
  
  // Pricing & Services
  startingPrice: string;
  priceRange: string;
  services: string[];
  packages: string[];
  
  // Online Presence
  website: string;
  instagram: string;
  facebook: string;
  youtube: string;
  
  // Portfolio
  portfolioImages: string[];
  portfolioVideos: string[];
  
  // Verification
  gstNumber: string;
  panNumber: string;
  businessLicense: string;
  
  // Terms
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

export default function VendorSignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<VendorFormData>({ 
    businessName: "",
    category: "",
    subCategory: "",
    businessType: "Individual",
    ownerName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    city: "",
    state: "",
    address: "",
    pincode: "",
    experience: "",
    teamSize: "1-5",
    description: "",
    specialties: [],
    startingPrice: "",
    priceRange: "",
    services: [],
    packages: [],
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
    portfolioImages: [],
    portfolioVideos: [],
    gstNumber: "",
    panNumber: "",
    businessLicense: "",
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const categories = [
    { name: 'Photographer', icon: Camera, color: 'bg-blue-500' },
    { name: 'Makeup Artist', icon: Palette, color: 'bg-pink-500' },
    { name: 'Decorator', icon: Sparkles, color: 'bg-purple-500' },
    { name: 'Caterer', icon: ChefHat, color: 'bg-orange-500' },
    { name: 'Music & DJ', icon: Music, color: 'bg-green-500' },
    { name: 'Wedding Planner', icon: Users, color: 'bg-red-500' },
    { name: 'Invitation Designer', icon: Mail, color: 'bg-indigo-500' },
    { name: 'Gifts & Favors', icon: Award, color: 'bg-yellow-500' }
  ];

  const benefits = [
    { icon: TrendingUp, title: 'Grow Your Business', desc: 'Reach thousands of couples planning their dream wedding' },
    { icon: Shield, title: 'Trusted Platform', desc: 'Join a verified network of professional wedding vendors' },
    { icon: BarChart3, title: 'Analytics & Insights', desc: 'Track your performance with detailed business analytics' },
    { icon: MessageSquare, title: 'Direct Communication', desc: 'Connect directly with couples through our platform' },
    { icon: Star, title: 'Build Your Reputation', desc: 'Showcase your work and collect verified reviews' },
    { icon: Zap, title: 'Instant Notifications', desc: 'Get notified immediately when couples inquire' }
  ];

  const priceBands = [
    'Under ₹25,000',
    '₹25,000 - ₹50,000',
    '₹50,000 - ₹1,00,000',
    '₹1,00,000 - ₹2,50,000',
    '₹2,50,000 - ₹5,00,000',
    'Above ₹5,00,000'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      window.alert("Thank you! Your vendor profile has been created. Our team will review and approve it within 24 hours.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-amber-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Building2 className="w-5 h-5" />
              <span className="text-sm font-medium">For Wedding Professionals</span>
            </div>
            <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6">
              Grow Your Wedding Business with WedSpace
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
              Join India's fastest-growing wedding platform and connect with couples planning their dream weddings
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Easy onboarding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Verified reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Left Column - Benefits */}
            <div className="space-y-8">
              <div>
                <h2 className="font-playfair text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Why Choose WedSpace?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{benefit.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Removed promotional stats to avoid hard-coded figures */}

              {/* Removed testimonial to avoid synthetic claims */}
            </div>

            {/* Right Column - Registration Form */}
            <div className="lg:sticky lg:top-24">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="font-playfair text-2xl text-gray-900 dark:text-white">
                    Start Your Journey
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Step {currentStep} of 8 - {['Account', 'Profile', 'Location', 'Media', 'Packages', 'Policies', 'Availability', 'Preview'][currentStep - 1]}
                  </p>
                  <div className="flex justify-center mt-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                        <div
                          key={step}
                          className={`w-6 h-2 rounded-full transition-all duration-300 ${
                            step <= currentStep ? 'bg-gradient-to-r from-red-600 to-amber-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {currentStep === 1 && (
                      <>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="businessName" className="text-gray-700 dark:text-gray-300">Business Name *</Label>
                            <Input
                              id="businessName"
                              value={form.businessName}
                              onChange={(e) => handleInputChange('businessName', e.target.value)}
                              placeholder="Your business name"
                              required
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label className="text-gray-700 dark:text-gray-300">Category *</Label>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                              {categories.map((cat) => (
                                <button
                                  key={cat.name}
                                  type="button"
                                  onClick={() => handleInputChange('category', cat.name)}
                                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                                    form.category === cat.name
                                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                      : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 ${cat.color} rounded-lg flex items-center justify-center`}>
                                      <cat.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{cat.name}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">City *</Label>
                              <Input
                                id="city"
                                value={form.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                placeholder="Your city"
                                required
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="experience" className="text-gray-700 dark:text-gray-300">Experience</Label>
                              <Input
                                id="experience"
                                value={form.experience}
                                onChange={(e) => handleInputChange('experience', e.target.value)}
                                placeholder="Years of experience"
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {currentStep === 2 && (
                      <>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Business Email *</Label>
                              <Input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="your@business.com"
                                required
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone Number *</Label>
                              <Input
                                id="phone"
                                value={form.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="+91 98765 43210"
                                required
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-gray-700 dark:text-gray-300">Price Range *</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              {priceBands.map((band) => (
                                <button
                                  key={band}
                                  type="button"
                                  onClick={() => handleInputChange('priceRange', band)}
                                  className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                                    form.priceRange === band
                                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                      : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'
                                  }`}
                                >
                                  <span className="text-sm font-medium">{band}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="website" className="text-gray-700 dark:text-gray-300">Website/Portfolio</Label>
                            <Input
                              id="website"
                              value={form.website}
                              onChange={(e) => handleInputChange('website', e.target.value)}
                              placeholder="https://yourwebsite.com"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {currentStep === 3 && (
                      <>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Service Description *</Label>
                            <Textarea
                              id="description"
                              value={form.description}
                              onChange={(e) => handleInputChange('description', e.target.value)}
                              placeholder="Tell couples about your services and what makes you special..."
                              rows={4}
                              required
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">Service Area *</Label>
                            <Input
                              id="address"
                              value={form.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              placeholder="Cities/areas you serve"
                              required
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {currentStep === 4 && (
                      <>
                        <div className="space-y-4">
                          <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Upload 8-12 hero photos</p>
                            <Button type="button" variant="outline" size="sm">
                              Choose Files
                            </Button>
                          </div>
                          <div>
                            <Label htmlFor="youtube" className="text-gray-700 dark:text-gray-300">Portfolio Video (YouTube/Vimeo)</Label>
                            <Input
                              id="youtube"
                              value={form.youtube}
                              onChange={(e) => handleInputChange('youtube', e.target.value)}
                              placeholder="https://youtube.com/..."
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {currentStep === 5 && (
                      <>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-gray-700 dark:text-gray-300">Package Name</Label>
                            <Input placeholder="e.g., Premium Photography Package" className="mt-1" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-gray-700 dark:text-gray-300">Starting Price</Label>
                              <Input
                                value={form.startingPrice}
                                onChange={(e) => handleInputChange('startingPrice', e.target.value)}
                                placeholder="₹50,000"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-700 dark:text-gray-300">Delivery Time</Label>
                              <Input placeholder="3-4 weeks" className="mt-1" />
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-700 dark:text-gray-300">What's Included</Label>
                            <Textarea placeholder="List package inclusions..." rows={3} className="mt-1" />
                          </div>
                        </div>
                      </>
                    )}

                    {currentStep === 6 && (
                      <>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-gray-700 dark:text-gray-300">Booking Terms</Label>
                            <Textarea placeholder="Advance required, payment milestones..." rows={3} className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-gray-700 dark:text-gray-300">Cancellation Policy</Label>
                            <Textarea placeholder="Describe your cancellation terms..." rows={3} className="mt-1" />
                          </div>
                        </div>
                      </>
                    )}

                    {currentStep === 7 && (
                      <>
                        <div className="space-y-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                              Mark dates when you're unavailable. You can update this anytime from your dashboard.
                            </p>
                          </div>
                          <div>
                            <Label className="text-gray-700 dark:text-gray-300">Busy Dates (comma-separated)</Label>
                            <Input placeholder="2025-12-25, 2025-12-31" className="mt-1" />
                          </div>
                        </div>
                      </>
                    )}

                    {currentStep === 8 && (
                      <>
                        <div className="space-y-4">
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Review Your Profile</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Business:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{form.businessName || '-'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Category:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{form.category || '-'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Location:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{form.city || '-'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Price Range:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{form.priceRange || '-'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What happens next?</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Team reviews your application (24hrs)
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Profile goes live once approved
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Start receiving inquiries immediately
                              </li>
                            </ul>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex gap-4">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="flex-1"
                        >
                          Previous
                        </Button>
                      )}
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white shadow-lg"
                      >
                        {currentStep === 8 ? 'Submit Application' : 'Continue'}
                      </Button>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Already have an account?{' '}
                        <Link href="/vendor/login" className="text-red-600 dark:text-red-400 hover:underline font-medium">
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
