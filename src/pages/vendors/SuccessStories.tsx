
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';

const SuccessStories: React.FC = () => {
  const stories = [
    {
      id: 1,
      name: "Elegant Events Venue",
      type: "Venue",
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
      logo: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
      quote: "Since joining wedspace, we've seen a 70% increase in bookings and have been able to reach couples we never would have connected with before. The platform's tools have streamlined our operations and improved our client communications.",
      business: "A luxurious estate venue specializing in outdoor weddings with mountain views",
      stats: [
        { label: "Increase in Bookings", value: "70%" },
        { label: "New Leads per Month", value: "45+" },
        { label: "Revenue Growth", value: "62%" }
      ],
      testimonial: {
        author: "Rebecca Turner",
        role: "Owner & Director",
        content: "When we first joined wedspace, we were a new venue struggling to get noticed in a competitive market. The platform's visibility, combined with their vendor tools, helped us showcase our property to the right audience. Now we're booked solid for the next 18 months!"
      }
    },
    {
      id: 2,
      name: "Timeless Photography",
      type: "Photographer",
      location: "Chicago, IL",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      logo: "https://images.unsplash.com/photo-1557683316-973673baf926",
      quote: "wedspace has completely transformed my business. I've doubled my client base in just one year and have been able to focus on higher-value packages that showcase my best work.",
      business: "Award-winning wedding photography studio specializing in candid moments",
      stats: [
        { label: "Increase in Clients", value: "110%" },
        { label: "New Inquiries", value: "30+ monthly" },
        { label: "Avg. Package Value", value: "+40%" }
      ],
      testimonial: {
        author: "James Wilson",
        role: "Lead Photographer",
        content: "Before wedspace, I was spending thousands on advertising with minimal results. The platform's search algorithm and detailed portfolio options have allowed couples who truly value my style to find me. The quality of leads is unmatched by any other platform I've tried."
      }
    },
    {
      id: 3,
      name: "Blossoms & Blooms",
      type: "Florist",
      location: "Seattle, WA",
      image: "https://images.unsplash.com/photo-1561128290-215f032dc522",
      logo: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f",
      quote: "As a small floral design studio, wedspace gave us the platform we needed to compete with larger companies. Our bookings have tripled and we've been able to hire two new designers to handle the growth.",
      business: "Boutique floral design studio focusing on sustainable, locally-grown arrangements",
      stats: [
        { label: "Booking Increase", value: "205%" },
        { label: "Team Growth", value: "3 to 7 staff" },
        { label: "Return on Investment", value: "12x" }
      ],
      testimonial: {
        author: "Emma Chen",
        role: "Creative Director",
        content: "The wedspace platform has been instrumental in our growth. The ability to showcase our unique design philosophy and sustainability practices has attracted clients who truly value our approach. The built-in messaging and proposal tools have also streamlined our booking process tremendously."
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-space/10 to-wed/10 py-12">
          <div className="container-custom">
            <div className="max-w-3xl">
              <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">Vendor Success Stories</h1>
              <p className="text-gray-600 max-w-2xl mb-6">
                Discover how wedding professionals like you have grown their businesses with wedspace. From venues to photographers, caterers to planners, our platform helps vendors connect with couples and boost their bookings.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  className="bg-[#F59E0B] text-gray-800 hover:bg-[#F59E0B]/90 border border-[#F59E0B]"
                  onClick={() => window.location.href = "/vendor/signup"}
                >
                  Join as Vendor
                </Button>
                <Button variant="outline">
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container-custom py-12">
          <div className="flex flex-col gap-20">
            {stories.map((story, index) => (
              <div key={story.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-10 ${index !== stories.length - 1 ? 'pb-16 border-b border-gray-200' : ''}`}>
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative">
                    <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img 
                        src={story.logo}
                        alt={`${story.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <img 
                      src={story.image}
                      alt={story.name}
                      className="w-full h-80 object-cover rounded-lg shadow-md"
                    />
                    <Badge className="absolute top-4 right-4 bg-wed">{story.type}</Badge>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-6">
                    {story.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className="font-playfair text-2xl font-bold text-wed">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-2">{story.name}</h2>
                  <p className="text-gray-600 mb-4">{story.location}</p>
                  <p className="text-sm text-gray-500 mb-6">{story.business}</p>
                  
                  <blockquote className="text-xl italic font-medium text-gray-700 border-l-4 border-wed pl-4 mb-8">
                    "{story.quote}"
                  </blockquote>
                  
                  <Separator className="my-6" />
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} fill="#F59E0B" color="#F59E0B" size={18} />
                      ))}
                    </div>
                    <p className="italic mb-4">"{story.testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{story.testimonial.author}</div>
                      <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                      <div className="text-gray-600">{story.testimonial.role}</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="mt-8 bg-wed hover:bg-wed/90 self-start"
                    onClick={() => window.location.href = "/vendor/signup"}
                  >
                    Join wedspace as a Vendor
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4">Ready to Grow Your Wedding Business?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Join thousands of wedding professionals who are expanding their reach and booking more clients with wedspace.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                className="bg-[#F59E0B] text-gray-800 hover:bg-[#F59E0B]/90 border border-[#F59E0B]"
                onClick={() => window.location.href = "/vendor/signup"}
                size="lg"
              >
                Join as a Vendor
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.location.href = "/contact"}
              >
                Contact Sales Team
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SuccessStories;
