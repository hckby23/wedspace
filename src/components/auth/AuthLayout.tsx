
import React from 'react';
import Logo from '../Logo';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  type: 'login' | 'signup' | 'forgot-password' | 'vendor-login' | 'vendor-signup' | 'venue-login' | 'venue-signup';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  type 
}) => {
  return (
    <div className="min-h-screen flex">
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
        {(type.includes('login') || type.includes('signup')) && (
          <div className="flex justify-center mb-8 border-b border-gray-200">
            <Link 
              to={type.includes('login') ? "/login" : "/signup"} 
              className={`px-4 py-2 ${!type.includes('vendor') && !type.includes('venue') ? 'border-b-2 border-red-500 font-medium text-red-500' : 'text-gray-500'}`}
            >
              Users
            </Link>
            <Link 
              to={type.includes('login') ? "/vendor-venue/login" : "/vendor-venue/signup"} 
              className={`px-4 py-2 ${(type.includes('vendor') || type.includes('venue')) ? 'border-b-2 border-red-500 font-medium text-red-500' : 'text-gray-500'}`}
            >
              Vendors/Venues
            </Link>
          </div>
        )}
        
        <div className="my-auto max-w-md w-full mx-auto">
          <h1 className="font-playfair text-3xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600 mb-8">{subtitle}</p>}
          
          {children}
          
          <div className="mt-6 text-center">
            {type === 'login' && (
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-red-500 hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
            )}
            
            {type === 'signup' && (
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-red-500 hover:underline font-medium">
                  Log In
                </Link>
              </p>
            )}
            
            {type === 'forgot-password' && (
              <p className="text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="text-red-500 hover:underline font-medium">
                  Log In
                </Link>
              </p>
            )}
            
            {type === 'vendor-login' && (
              <p className="text-gray-600">
                Not a vendor yet?{' '}
                <Link to="/vendor/signup" className="text-red-500 hover:underline font-medium">
                  Join as Vendor
                </Link>
              </p>
            )}
            
            {type === 'vendor-signup' && (
              <p className="text-gray-600">
                Already a vendor?{' '}
                <Link to="/vendor/login" className="text-red-500 hover:underline font-medium">
                  Log In
                </Link>
              </p>
            )}
            
            {type === 'venue-login' && (
              <p className="text-gray-600">
                Not registered as a venue?{' '}
                <Link to="/venue/signup" className="text-red-500 hover:underline font-medium">
                  Register as Venue
                </Link>
              </p>
            )}
            
            {type === 'venue-signup' && (
              <p className="text-gray-600">
                Already registered?{' '}
                <Link to="/venue/login" className="text-red-500 hover:underline font-medium">
                  Log In
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{
        backgroundImage: type.includes('venue') || type.includes('vendor') 
          ? "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3')"
          : "url('https://images.unsplash.com/photo-1550005809-91ad75fb315f')"
      }}>
        <div className="h-full w-full bg-black/20 flex items-center justify-center p-12">
          <div className="text-white text-center max-w-lg">
            <h2 className="font-playfair text-4xl font-bold mb-4">
              {type.includes('venue') || type.includes('vendor')
                ? "Grow your wedding business" 
                : "Have Your Dream Wedding"}
            </h2>
            <p className="text-white/80 text-lg">
              {type.includes('venue') || type.includes('vendor')
                ? "Connect with engaged couples and grow your business with our comprehensive platform."
                : "Find venues, book vendors, and organize every detail with our intuitive planning tools."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
