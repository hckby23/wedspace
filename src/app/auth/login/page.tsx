"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2, Heart, Sparkles, Play } from "lucide-react";

export default function LoginPage() {
  const { signIn, signInWithGoogle, enableDemoMode } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password, rememberMe);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message);
      setGoogleLoading(false);
    }
  };

  const handleDemoMode = () => {
    enableDemoMode();
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 dark:from-rose-950/20 dark:via-amber-950/20 dark:to-orange-950/20">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-block mb-6">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                wedspace
              </div>
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome Back! 👋
            </h1>
            <p className="text-muted-foreground">Continue planning your perfect wedding</p>
          </div>

          <Card className="p-8 shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            {/* Google Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 mb-6"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/reset-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Logging In...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                  Sign up free
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleDemoMode}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                <Play className="w-4 h-4 mr-1" />
                Try Demo Mode (No login needed)
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Right: Hero */}
      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-primary via-rose-500 to-secondary text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-lg text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="font-display text-4xl font-bold mb-6">
            Continue Your Planning Journey
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Pick up right where you left off and bring your dream wedding to life
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="text-3xl font-bold mb-1">50K+</div>
              <div className="text-sm opacity-80">Happy Couples</div>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="text-3xl font-bold mb-1">2,500+</div>
              <div className="text-sm opacity-80">Verified Venues</div>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="text-3xl font-bold mb-1">5,000+</div>
              <div className="text-sm opacity-80">Top Vendors</div>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm opacity-80">Free Forever</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
