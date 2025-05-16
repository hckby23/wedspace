
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Logo from '@/components/Logo';

const VendorVenueSignup: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("vendor");

  const handleVendorSignup = () => {
    navigate('/vendor/signup');
  };
  
  const handleVenueSignup = () => {
    navigate('/venue/signup');
  };

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
        <div className="flex justify-center mb-8 border-b border-gray-200">
          <Link 
            to="/signup"
            className="px-4 py-2 text-gray-500"
          >
            Users
          </Link>
          <Link 
            to="/vendor-venue/signup"
            className="px-4 py-2 border-b-2 border-wed font-medium text-wed"
          >
            Vendors/Venues
          </Link>
        </div>
        
        <div className="my-auto max-w-md w-full mx-auto">
          <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-gray-50 border-b w-full grid grid-cols-2">
              <TabsTrigger value="vendor" className="data-[state=active]:bg-white data-[state=active]:text-wed">
                Join as Vendor
              </TabsTrigger>
              <TabsTrigger value="venue" className="data-[state=active]:bg-white data-[state=active]:text-wed">
                Join as Venue
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vendor" className="px-4 py-6">
              <h2 className="text-2xl font-semibold mb-4">Create Your Vendor Account</h2>
              <p className="mb-6 text-gray-600">
                Join wedspace as a vendor and reach thousands of engaged couples looking for your services.
              </p>
              <Button 
                onClick={handleVendorSignup} 
                className="w-full bg-wed text-white hover:bg-wed/90"
              >
                Continue as Vendor
              </Button>
            </TabsContent>

            <TabsContent value="venue" className="px-4 py-6">
              <h2 className="text-2xl font-semibold mb-4">List Your Venue</h2>
              <p className="mb-6 text-gray-600">
                Showcase your venue to thousands of couples and increase your bookings by joining wedspace.
              </p>
              <Button 
                onClick={handleVenueSignup}
                className="w-full bg-wed text-white hover:bg-wed/90"
              >
                Continue as Venue
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Already have an account? <Link to="/vendor-venue/login" className="text-wed hover:underline font-medium">Log In</Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3')"
      }}>
        <div className="h-full w-full bg-black/20 flex items-center justify-center p-12">
          <div className="text-white text-center max-w-lg">
            <h2 className="font-playfair text-4xl font-bold mb-4">
              Grow your wedding business
            </h2>
            <p className="text-white/80 text-lg">
              Connect with engaged couples and grow your business with our comprehensive platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorVenueSignup;
