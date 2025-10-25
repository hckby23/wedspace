
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const VenueAdvertise: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-space/10 to-wed/10">
          <div className="container-custom text-center">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              Grow Your Venue Business with wedspace
            </h1>
            <p className="text-lg max-w-3xl mx-auto mb-10">
              Connect with thousands of engaged couples actively planning their wedding day. 
              Showcase your venue to the right audience and increase bookings year-round.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                className="bg-wed hover:bg-wed/90 text-gray-800 px-8 py-6 text-lg"
                asChild
              >
                <a href="/venue/signup">Register Your Venue</a>
              </Button>
              <Button 
                variant="outline" 
                className="border-wed text-wed hover:bg-wed/10 px-8 py-6 text-lg"
                asChild
              >
                <a href="/venue/success-stories">See Success Stories</a>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="font-playfair text-3xl font-bold mb-12 text-center">
              Why List Your Venue on wedspace
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="w-12 h-12 bg-wed/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wed"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Increased Visibility</h3>
                <p>
                  Get your venue in front of engaged couples actively searching for their perfect wedding location. Our platform receives thousands of searches monthly.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="w-12 h-12 bg-wed/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wed"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Quality Leads</h3>
                <p>
                  Connect with couples who are serious about booking. Our tailored search experience ensures you receive relevant inquiries from interested couples.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="w-12 h-12 bg-wed/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wed"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Easy Management</h3>
                <p>
                  Manage your venue profile, respond to inquiries, and update availability all from one intuitive dashboard designed specifically for venue owners.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="font-playfair text-3xl font-bold mb-4 text-center">
              Advertising Plans
            </h2>
            <p className="text-center max-w-2xl mx-auto mb-12">
              Choose the plan that works best for your venue. All plans include a comprehensive venue profile, appearance in search results, and access to our venue management dashboard.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-2">Basic Listing</h3>
                  <p className="text-gray-600 mb-4">Perfect for small venues just getting started</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">₹15,000</span>
                    <span className="text-gray-600"> / year</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Standard venue profile</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Up to 10 photos</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Basic search result placement</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Inquiry management tools</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full bg-wed hover:bg-wed/90 text-gray-800">
                    Get Started
                  </Button>
                </div>
              </div>
              
              {/* Premium Plan */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-wed relative">
                <div className="absolute top-0 right-0 bg-wed text-white px-4 py-1 text-sm font-medium">
                  MOST POPULAR
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-2">Premium Listing</h3>
                  <p className="text-gray-600 mb-4">For established venues wanting more exposure</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">₹30,000</span>
                    <span className="text-gray-600"> / year</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Enhanced venue profile</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Up to 30 photos and 2 videos</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Priority search placement</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Featured in regional collections</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Monthly performance reports</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full bg-wed hover:bg-wed/90 text-gray-800">
                    Get Started
                  </Button>
                </div>
              </div>
              
              {/* Elite Plan */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-2">Elite Listing</h3>
                  <p className="text-gray-600 mb-4">For luxury venues seeking top placement</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">₹50,000</span>
                    <span className="text-gray-600"> / year</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Premium venue profile with virtual tour</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Unlimited photos and videos</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Top search placement</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Featured on homepage rotation</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>Social media promotion</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full bg-wed hover:bg-wed/90 text-gray-800">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-wed/10">
          <div className="container-custom text-center">
            <h2 className="font-playfair text-3xl font-bold mb-4">
              Ready to Showcase Your Venue?
            </h2>
            <p className="max-w-2xl mx-auto mb-8">
              Join thousands of venues across India who have found success on wedspace. 
              Registration takes less than 10 minutes, and our team is here to help.
            </p>
            <Button 
              className="bg-wed hover:bg-wed/90 text-gray-800 px-8 py-6 text-lg"
              asChild
            >
              <a href="/venue/signup">Register Your Venue Now</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VenueAdvertise;
