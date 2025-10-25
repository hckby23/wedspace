"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Mail, 
  CheckCircle, 
  ArrowLeft, 
  Shield, 
  BarChart3, 
  MessageSquare, 
  Star, 
  TrendingUp,
  Users,
  Award,
  Clock,
  Zap,
  KeyRound,
  Lock,
  Loader2,
  ChevronRight
} from 'lucide-react';
import EnhancedPageHero from '@/components/layout/EnhancedPageHero';
import PageContainer from '@/components/layout/PageContainer';

export default function VendorLogin() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const sendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setResendCooldown(60);
      window.alert(`OTP sent to ${email}! (Demo: Use any 6-digit code)`);
    }, 1500);
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      window.alert("Login successful! Redirecting to your vendor dashboard...");
    }, 1500);
  };

  const resendOtp = () => {
    if (resendCooldown === 0) {
      sendOtp({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Building2, text: "Vendor Portal" }}
        title="Vendor"
        titleGradient="Login"
        description="Access your dashboard and manage your business."
      />

      <PageContainer className="py-12">
        <div className="max-w-lg mx-auto">

          {/* Login Form */}
          <Card className="border border-gray-200 dark:border-gray-700 shadow-2xl bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/10 dark:to-amber-900/10 border-b border-gray-200 dark:border-gray-700 text-center">
              <CardTitle className="font-playfair text-2xl text-gray-900 dark:text-white flex items-center justify-center">
                {otpSent ? (
                  <>
                    <KeyRound className="w-6 h-6 mr-3 text-red-600" />
                    Enter OTP
                  </>
                ) : (
                  <>
                    <Lock className="w-6 h-6 mr-3 text-red-600" />
                    Secure Login
                  </>
                )}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {otpSent ? "We've sent a 6-digit code to your email" : "Get instant access with OTP verification"}
              </p>
            </CardHeader>
            <CardContent className="p-8">
              {!otpSent ? (
                <form onSubmit={sendOtp} className="space-y-8">
                  <div>
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold text-lg mb-3 block">
                      Business Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@business.com"
                        className="pl-12 h-14 text-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg font-semibold rounded-xl"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-3" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-3" />
                        Send OTP
                      </>
                    )}
                  </Button>

                  {/* Trust Indicators */}
                  <div className="flex items-center justify-center gap-6 pt-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Instant Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Verified</span>
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={verifyOtp} className="space-y-8">
                  <div>
                    <Label htmlFor="otp" className="text-gray-700 dark:text-gray-300 font-semibold text-lg mb-3 block">
                      Enter 6-digit OTP
                    </Label>
                    <Input
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      maxLength={6}
                      className="h-16 text-center text-3xl tracking-[0.5em] font-bold bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 rounded-xl"
                      required
                    />
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Sent to <span className="font-medium text-gray-900 dark:text-white">{email}</span>
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={resendOtp}
                        disabled={resendCooldown > 0}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-14 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 text-lg font-semibold rounded-xl"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-3" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-3" />
                        Verify & Login
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                      setResendCooldown(0);
                    }}
                    className="w-full h-12 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Change Email
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="text-center mt-12 space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Don't have an account?{' '}
              <Link href="/vendor/signup" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold">
                Join as a vendor
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </Link>
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>Need help?</span>
              <a href="mailto:vendors@wedspace.com" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium">
                vendors@wedspace.com
              </a>
              <span>•</span>
              <a href="tel:+919876543210" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium">
                +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
