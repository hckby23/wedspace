
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-wed/10 to-space/10">
          <div className="container-custom text-center">
            <h1 className="font-playfair font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              About <span className="text-wed">wed</span><span className="text-space">space</span>
            </h1>
            <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
              Your comprehensive wedding planning platform designed to make your special day perfect.
            </p>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="w-full lg:w-1/2">
                <h2 className="font-playfair font-bold text-3xl md:text-4xl mb-6">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  Wedding planning should be as joyful as the celebration itself. That's why we created wedspace—to transform what can be an overwhelming process into a delightful journey.
                </p>
                <p className="text-gray-700 mb-4">
                  Founded in 2020 by a team of wedding industry professionals and tech enthusiasts, wedspace bridges the gap between couples and wedding vendors through intuitive technology and personalized service.
                </p>
                <p className="text-gray-700">
                  Our platform connects couples with carefully vetted venues and vendors while providing powerful planning tools that simplify every step of the wedding journey—from "Yes!" to "I do."
                </p>
              </div>
              <div className="w-full lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d" 
                  alt="Couple planning their wedding" 
                  className="rounded-lg shadow-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Mission */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
              <div className="w-full lg:w-1/2">
                <h2 className="font-playfair font-bold text-3xl md:text-4xl mb-6">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                  We believe that every couple deserves a wedding that authentically reflects their relationship, values, and dreams—without unnecessary stress or complications.
                </p>
                <p className="text-gray-700 mb-4">
                  Our mission is to empower couples with the resources, support, and inspiration they need to create meaningful celebrations while supporting the talented professionals who bring these events to life.
                </p>
                <p className="text-gray-700">
                  Whether you're planning an intimate backyard gathering or an elaborate destination event, we're committed to making your wedding planning experience as beautiful as the day itself.
                </p>
              </div>
              <div className="w-full lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1529636798458-92182e662485" 
                  alt="Wedding celebration" 
                  className="rounded-lg shadow-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Team */}
        <section className="py-16">
          <div className="container-custom text-center">
            <h2 className="font-playfair font-bold text-3xl md:text-4xl mb-8">Meet Our Team</h2>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto mb-12">
              Our diverse team brings together expertise from the wedding industry, technology, design, and customer service to create the ultimate wedding planning platform.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="group">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white text-left">
                      <p className="font-medium">Founder & CEO</p>
                    </div>
                  </div>
                </div>
                <h3 className="font-playfair font-semibold text-xl mb-1">Wedding Expert</h3>
                <p className="text-gray-600">Former wedding planner with over a decade of experience</p>
              </div>
              
              {/* Team Member 2 */}
              <div className="group">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white text-left">
                      <p className="font-medium">Co-Founder & CTO</p>
                    </div>
                  </div>
                </div>
                <h3 className="font-playfair font-semibold text-xl mb-1">Tech Expert</h3>
                <p className="text-gray-600">Tech innovator passionate about user experience</p>
              </div>
              
              {/* Team Member 3 */}
              <div className="group">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white text-left">
                      <p className="font-medium">Head of Vendor Relations</p>
                    </div>
                  </div>
                </div>
                <h3 className="font-playfair font-semibold text-xl mb-1">Vendor Manager</h3>
                <p className="text-gray-600">Building our network of exceptional wedding professionals</p>
              </div>
              
              {/* Team Member 4 */}
              <div className="group">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white text-left">
                      <p className="font-medium">Creative Director</p>
                    </div>
                  </div>
                </div>
                <h3 className="font-playfair font-semibold text-xl mb-1">Design Expert</h3>
                <p className="text-gray-600">Design expert with an eye for wedding aesthetics</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Join Us CTA */}
        <section className="py-16 bg-gradient-to-r from-wed/10 to-space/10">
          <div className="container-custom text-center">
            <h2 className="font-playfair font-bold text-3xl md:text-4xl mb-6">
              Join Our Wedding Community
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
              Whether you're planning your wedding or you're a wedding professional, become part of our growing community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-wed hover:bg-wed/90" size="lg" asChild>
                <Link to="/signup">Create Free Account</Link>
              </Button>
              <Button variant="outline" className="border-wed text-wed hover:bg-wed/5" size="lg" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
