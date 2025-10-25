
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Star } from 'lucide-react';

const Advertise: React.FC = () => {
  const benefits = [
    {
      title: "Targeted Exposure",
      description: "Reach engaged couples who are actively planning their weddings and searching for vendors like you.",
      icon: "https://images.unsplash.com/photo-1557683304-673a23048d34"
    },
    {
      title: "Premium Placement",
      description: "Get featured in search results, recommendation feeds, and editorial content for maximum visibility.",
      icon: "https://images.unsplash.com/photo-1579546929662-711aa81148cf"
    },
    {
      title: "Audience Insights",
      description: "Access detailed analytics about your profile visitors, helping you refine your marketing approach.",
      icon: "https://images.unsplash.com/photo-1551288049-bebda4e38f71"
    },
    {
      title: "Brand Building",
      description: "Showcase your unique style and services to establish your brand in the competitive wedding industry.",
      icon: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3"
    }
  ];

  const packages = {
    features: [
      "Vendor Profile Listing",
      "Business Description",
      "Photo Gallery",
      "Contact Information",
      "Reviews Display",
      "Featured in Search Results",
      "Category Sponsorship",
      "Homepage Feature",
      "Regional Spotlight",
      "Editorial Features",
      "Dedicated Account Manager",
      "Performance Analytics"
    ],
    tiers: [
      {
        name: "Basic",
        price: "$29",
        period: "per month",
        features: [true, true, true, true, true, false, false, false, false, false, false, false],
        popular: false,
        cta: "Get Started",
        description: "Essential visibility for new wedding vendors"
      },
      {
        name: "Professional",
        price: "$79",
        period: "per month",
        features: [true, true, true, true, true, true, true, false, false, false, false, true],
        popular: true,
        cta: "Choose Professional",
        description: "Enhanced visibility for established businesses"
      },
      {
        name: "Premium",
        price: "$199",
        period: "per month",
        features: [true, true, true, true, true, true, true, true, true, true, true, true],
        popular: false,
        cta: "Choose Premium",
        description: "Maximum exposure for industry leaders"
      }
    ],
    spotlight: {
      title: "Regional Spotlight Packages",
      description: "Dominate your local market with enhanced visibility in specific geographic areas.",
      tiers: [
        {
          region: "Single City",
          price: "$149",
          period: "per month",
          includes: ["Featured placement in city search results", "City guide inclusion", "Local event promotions"]
        },
        {
          region: "Metro Area",
          price: "$249",
          period: "per month",
          includes: ["Coverage across multiple cities", "Metro area guide features", "Regional email features"]
        },
        {
          region: "State-Wide",
          price: "$449",
          period: "per month",
          includes: ["State-wide visibility", "Multi-region placement", "State trend reports inclusion"]
        }
      ]
    }
  };

  const testimonials = [
    {
      quote: "The advertising package on wedspace has been our best marketing investment. We've seen a 230% increase in quality leads and bookings since upgrading to the Professional plan.",
      author: "Jessica Martin",
      business: "Enchanted Gardens Venue",
      location: "Denver, CO"
    },
    {
      quote: "Being featured on the homepage for our region brought us incredible exposure. We booked 15 weddings in just one month after our feature went live.",
      author: "Michael Chen",
      business: "Timeless Photography",
      location: "Seattle, WA"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-space/10 to-wed/10 py-12">
          <div className="container-custom">
            <div className="max-w-3xl">
              <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">Advertise on wedspace</h1>
              <p className="text-gray-600 max-w-2xl mb-6">
                Connect with engaged couples, grow your brand, and book more weddings with our targeted advertising solutions designed specifically for wedding professionals.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  className="bg-[#F59E0B] text-gray-800 hover:bg-[#F59E0B]/90 border border-[#F59E0B]"
                >
                  View Advertising Options
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/contact"}
                >
                  Contact Sales Team
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container-custom py-12">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-3">Why Advertise With Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform connects wedding professionals like you with engaged couples who are actively planning their perfect day.
            </p>
          </div>
          
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                  <img src={benefit.icon} alt={benefit.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-playfair text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
          
          {/* Stats */}
          <div className="bg-wed/5 rounded-lg p-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="font-playfair text-4xl font-bold text-wed mb-2">500K+</p>
                <p className="text-gray-600">Monthly Active Users</p>
              </div>
              <div>
                <p className="font-playfair text-4xl font-bold text-wed mb-2">82%</p>
                <p className="text-gray-600">Conversion Rate</p>
              </div>
              <div>
                <p className="font-playfair text-4xl font-bold text-wed mb-2">15M+</p>
                <p className="text-gray-600">Monthly Page Views</p>
              </div>
              <div>
                <p className="font-playfair text-4xl font-bold text-wed mb-2">3.2M</p>
                <p className="text-gray-600">Couples Reached Annually</p>
              </div>
            </div>
          </div>
          
          {/* Advertising Packages */}
          <div className="mb-16">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-center">Advertising Packages</h2>
            
            <Tabs defaultValue="packages">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="packages">Standard Packages</TabsTrigger>
                <TabsTrigger value="spotlight">Regional Spotlight</TabsTrigger>
              </TabsList>
              
              <TabsContent value="packages">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.tiers.map((tier, index) => (
                    <Card key={index} className={`flex flex-col overflow-hidden ${tier.popular ? 'ring-2 ring-wed' : ''} relative`}>
                      {tier.popular && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-wed text-white text-xs font-semibold px-3 py-1 rounded-bl">
                            Most Popular
                          </div>
                        </div>
                      )}
                      <div className="p-6 bg-gray-50 border-b">
                        <h3 className="font-playfair text-xl font-bold">{tier.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                        <div className="flex items-end">
                          <span className="font-playfair text-3xl font-bold">{tier.price}</span>
                          <span className="text-gray-600 ml-1">{tier.period}</span>
                        </div>
                      </div>
                      <div className="p-6 flex-grow">
                        <ul className="space-y-4">
                          {packages.features.map((feature, i) => (
                            <li key={i} className={`flex items-center ${tier.features[i] ? 'text-gray-800' : 'text-gray-400'}`}>
                              {tier.features[i] ? (
                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                              ) : (
                                <div className="h-5 w-5 mr-2 flex-shrink-0" />
                              )}
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6 mt-auto">
                        <Button 
                          className={`w-full ${tier.popular ? 'bg-wed hover:bg-wed/90' : ''}`}
                          variant={tier.popular ? 'default' : 'outline'}
                          onClick={() => window.location.href = "/vendor/signup"}
                        >
                          {tier.cta}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="spotlight">
                <div className="bg-gray-50 p-8 rounded-lg mb-8">
                  <h3 className="font-playfair text-2xl font-semibold mb-2">{packages.spotlight.title}</h3>
                  <p className="text-gray-600 mb-6">{packages.spotlight.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.spotlight.tiers.map((region, index) => (
                    <Card key={index} className="overflow-hidden flex flex-col">
                      <div className="p-6 bg-gray-50 border-b">
                        <h3 className="font-playfair text-xl font-bold">{region.region}</h3>
                        <div className="flex items-end mt-4">
                          <span className="font-playfair text-3xl font-bold">{region.price}</span>
                          <span className="text-gray-600 ml-1">{region.period}</span>
                        </div>
                      </div>
                      <div className="p-6 flex-grow">
                        <ul className="space-y-4">
                          {region.includes.map((feature, i) => (
                            <li key={i} className="flex items-center">
                              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6 mt-auto">
                        <Button 
                          variant="outline"
                          className="w-full"
                          onClick={() => window.location.href = "/contact"}
                        >
                          Contact Sales
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-center">What Vendors Are Saying</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-8 relative">
                  <div className="absolute top-4 right-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-lg italic mb-6">"{testimonial.quote}"</blockquote>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-gray-600">{testimonial.business}</p>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* CTA */}
          <div className="bg-gradient-to-r from-wed/10 to-space/10 rounded-lg p-8 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4">Ready to Grow Your Wedding Business?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Join thousands of wedding professionals who are expanding their reach and booking more clients with wedspace advertising.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                className="bg-[#F59E0B] text-gray-800 hover:bg-[#F59E0B]/90 border border-[#F59E0B]"
                onClick={() => window.location.href = "/vendor/signup"}
              >
                Join as a Vendor
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/contact"}
              >
                Schedule a Consultation
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Advertise;
