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
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Eye, 
  EyeOff,
  BarChart3,
  Calendar,
  Users,
  Star,
  Clock,
  Award,
  TrendingUp,
  MessageSquare,
  Camera,
  Zap
} from "lucide-react";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface OTPForm {
  otp: string;
}

const benefits = [
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track bookings, revenue, and performance metrics in real-time",
    color: "text-blue-600"
  },
  {
    icon: Calendar,
    title: "Booking Management",
    description: "Manage availability, bookings, and customer communications",
    color: "text-green-600"
  },
  {
    icon: Users,
    title: "Lead Generation",
    description: "Connect with couples actively planning their weddings",
    color: "text-purple-600"
  },
  {
    icon: Star,
    title: "Review Management",
    description: "Showcase testimonials and manage your venue's reputation",
    color: "text-amber-600"
  }
];

const stats = [
  { value: "2.5x", label: "Average booking increase" },
  { value: "24/7", label: "Customer support" },
  { value: "95%", label: "Partner satisfaction" },
  { value: "1000+", label: "Successful venues" }
];

const features = [
  { icon: TrendingUp, text: "Increase bookings by 250%" },
  { icon: MessageSquare, text: "Direct communication with couples" },
  { icon: Camera, text: "Professional photography support" },
  { icon: Zap, text: "Instant booking confirmations" }
];

export default function VenueLoginPage() {
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [otpForm, setOTPForm] = useState<OTPForm>({
    otp: ''
  });

  const updateLoginForm = (field: keyof LoginForm, value: string | boolean) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
  };

  const updateOTPForm = (field: keyof OTPForm, value: string) => {
    setOTPForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      window.alert("Login successful! Redirecting to venue dashboard...");
      // In real implementation: router.push('/venue/dashboard');
    }, 1500);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      window.alert("OTP sent to your email successfully!");
    }, 1000);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      window.alert("OTP verified! Redirecting to venue dashboard...");
      // In real implementation: router.push('/venue/dashboard');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Building2, text: "Venue Portal" }}
        title="Venue"
        titleGradient="Login"
        description="Access your venue dashboard and manage bookings."
      />

      <PageContainer className="py-12">
        <div className="max-w-lg mx-auto">
              <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
                <div className="text-center mb-8">
                  <h2 className="font-playfair text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Venue Login
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Access your venue management dashboard
                  </p>
                </div>

                {/* Login Method Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-8">
                  <button
                    onClick={() => setLoginMethod('password')}
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      loginMethod === 'password'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Password Login
                  </button>
                  <button
                    onClick={() => setLoginMethod('otp')}
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      loginMethod === 'otp'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    OTP Login
                  </button>
                </div>

                {/* Password Login Form */}
                {loginMethod === 'password' && (
                  <form onSubmit={handlePasswordLogin} className="space-y-6">
                    <div>
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Business Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => updateLoginForm('email', e.target.value)}
                          placeholder="your@venue.com"
                          className="pl-10 h-12 bg-white dark:bg-gray-700"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Password
                      </Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={loginForm.password}
                          onChange={(e) => updateLoginForm('password', e.target.value)}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 h-12 bg-white dark:bg-gray-700"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="rememberMe"
                          type="checkbox"
                          checked={loginForm.rememberMe}
                          onChange={(e) => updateLoginForm('rememberMe', e.target.checked)}
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <Label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                          Remember me
                        </Label>
                      </div>
                      <Link 
                        href="/auth/forgot-password" 
                        className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white shadow-lg text-lg font-semibold"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In to Dashboard
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {/* OTP Login Form */}
                {loginMethod === 'otp' && (
                  <div className="space-y-6">
                    {!otpSent ? (
                      <form onSubmit={handleSendOTP} className="space-y-6">
                        <div>
                          <Label htmlFor="otpEmail" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                            Business Email
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="otpEmail"
                              type="email"
                              value={loginForm.email}
                              onChange={(e) => updateLoginForm('email', e.target.value)}
                              placeholder="your@venue.com"
                              className="pl-10 h-12 bg-white dark:bg-gray-700"
                              required
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white shadow-lg text-lg font-semibold"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                              Sending OTP...
                            </>
                          ) : (
                            <>
                              <Phone className="w-5 h-5 mr-2" />
                              Send OTP
                            </>
                          )}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">OTP Sent Successfully</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            We've sent a 6-digit code to <span className="font-medium">{loginForm.email}</span>
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="otp" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                            Enter OTP
                          </Label>
                          <Input
                            id="otp"
                            value={otpForm.otp}
                            onChange={(e) => updateOTPForm('otp', e.target.value)}
                            placeholder="123456"
                            className="h-12 text-center text-2xl tracking-widest bg-white dark:bg-gray-700"
                            maxLength={6}
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white shadow-lg text-lg font-semibold"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Verify & Login
                            </>
                          )}
                        </Button>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                          >
                            Didn't receive the code? <span className="font-medium">Resend OTP</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                <div className="mt-8 text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    Don't have a venue listing?{' '}
                    <Link href="/venue/signup" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold">
                      List your venue for free
                      <ArrowRight className="w-4 h-4 inline ml-1" />
                    </Link>
                  </p>
                </div>
              </div>
        </div>
      </PageContainer>
    </main>
  );
}
