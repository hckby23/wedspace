
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Lock, Phone } from 'lucide-react';
import Logo from '@/components/Logo';
import { Helmet } from 'react-helmet';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Logging in with:', { email });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Login successful!');
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = () => {
    toast.info('Phone login coming soon!');
  };

  const handleGoogleLogin = () => {
    toast.info('Google login coming soon!');
  };

  const handleAppleLogin = () => {
    toast.info('Apple login coming soon!');
  };

  return (
    <div className="min-h-screen flex">
      <Helmet>
        <title>Login - wedspace | Wedding Planning Platform</title>
        <meta name="description" content="Log in to your wedspace account to access your wedding planning tools and dashboard." />
      </Helmet>

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-10 lg:p-16">
        <div className="mb-4">
          <Link to="/">
            <span className="inline-block">
              <Logo />
            </span>
          </Link>
        </div>
        
        {/* Account type switcher */}
        <div className="flex justify-center mb-8 border-b border-gray-200">
          <Link 
            to="/login"
            className="px-4 py-2 border-b-2 border-red-500 font-medium text-red-500"
          >
            Users
          </Link>
          <Link 
            to="/vendor-venue/login"
            className="px-4 py-2 text-gray-500"
          >
            Vendors/Venues
          </Link>
        </div>

        <div className="my-auto max-w-md w-full mx-auto">
          <div className="text-center mb-6">
            <h2 className="font-semibold text-2xl">Welcome back</h2>
            <p className="text-gray-600">Log in to your wedspace account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-red-500 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium" 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-red-500 font-medium hover:underline">
                Sign up
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">OR CONTINUE WITH</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                type="button" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handlePhoneLogin}
              >
                <Phone className="h-5 w-5" />
                <span>Continue with Phone</span>
              </Button>
              
              <Button 
                variant="outline" 
                type="button" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.24 3.639-4.792 3.639-3.872 0-6.999-3.127-6.999-7 0-3.872 3.127-6.999 7-6.999 2.29 0 3.768 1.103 4.149 1.403l2.778-2.687c-.258-.176-.521-.339-.798-.489-2.136-1.809-4.922-2.83-7.321-2.83-5.455 0-9.91 4.455-9.91 9.909 0 5.454 4.455 9.908 9.91 9.908 5.454 0 9.909-4.454 9.909-9.908 0-.662-.057-1.297-.158-1.902l-.004-.006c.573-.388 1.12-.892 1.563-1.499z"></path>
                </svg>
                <span>Continue with Google</span>
              </Button>
              
              <Button 
                variant="outline" 
                type="button" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleAppleLogin}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 384 512">
                  <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                </svg>
                <span>Continue with Apple</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1550005809-91ad75fb315f')"
      }}>
        <div className="h-full w-full bg-black/20 flex items-center justify-center p-12">
          <div className="text-white text-center max-w-lg">
            <h2 className="font-playfair text-4xl font-bold mb-4">
              Have Your Dream Wedding
            </h2>
            <p className="text-white/80 text-lg">
              Find venues, book vendors, and organize every detail with our intuitive planning tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
