
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const VenueSuccessStories: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 bg-gradient-to-r from-space/5 to-wed/5">
        <div className="container-custom">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-center">Venue Success Stories</h1>
          <p className="text-lg text-center max-w-3xl mx-auto mb-12">
            Discover how venues across India have grown their business and hosted unforgettable weddings through wedspace.
          </p>
          
          <div className="space-y-16">
            {/* Success Story 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden md:flex">
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1519741497674-611481863552" 
                  alt="Taj Palace" 
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-1/2 md:overflow-y-auto">
                <h3 className="font-playfair text-2xl font-bold mb-2">Taj Palace, New Delhi</h3>
                <p className="text-wed font-medium mb-4">Featured Luxury Venue</p>
                <p className="mb-4">
                  "Partnering with wedspace has significantly increased our wedding inquiries by 40% in just six months. The platform's reach and audience targeting has helped us connect with couples who are specifically looking for our type of venue."
                </p>
                <p className="mb-4">
                  "The dashboard tools make it easy to manage inquiries, upload new photos, and showcase our facilities to potential clients. We've been able to secure bookings well in advance, allowing for better planning and resource allocation."
                </p>
                <p className="font-medium">
                  Vikram Singh, Events Director
                </p>
              </div>
            </div>
            
            {/* Success Story 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden md:flex md:flex-row-reverse">
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3" 
                  alt="The Leela Ambience" 
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-1/2 md:overflow-y-auto">
                <h3 className="font-playfair text-2xl font-bold mb-2">The Leela Ambience, Gurugram</h3>
                <p className="text-wed font-medium mb-4">Transformed Digital Presence</p>
                <p className="mb-4">
                  "Before wedspace, our online presence was limited to our own website and a few listing sites. Now, we're able to showcase our venue with high-quality images, detailed descriptions, and highlight the amenities that make us unique."
                </p>
                <p className="mb-4">
                  "The platform has helped us reach a younger, tech-savvy audience that prefers to plan their wedding online. The social media integration allows us to maintain consistency across all our channels and engage with clients effectively."
                </p>
                <p className="font-medium">
                  Anjali Mehta, Marketing Manager
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-wed/10 rounded-xl p-8 text-center">
            <h2 className="font-playfair text-2xl font-bold mb-4">Join Our Success Stories</h2>
            <p className="max-w-2xl mx-auto mb-6">
              Register your venue on wedspace today and connect with thousands of couples planning their perfect wedding day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/venue/signup" 
                className="bg-wed hover:bg-wed/90 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Register Your Venue
              </a>
              <a 
                href="/venue/login" 
                className="bg-white border border-wed text-wed hover:bg-gray-50 font-medium py-2 px-6 rounded-md transition-colors"
              >
                Login to Dashboard
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VenueSuccessStories;
