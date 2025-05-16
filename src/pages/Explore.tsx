
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExploreFilter from '@/components/explore/ExploreFilter';
import ExploreContent from '@/components/explore/ExploreContent';
import ExploreSidebar from '@/components/explore/ExploreSidebar';

const Explore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('trending');
  const [currentLocation, setCurrentLocation] = useState<string>('');

  const handleLocationChange = (location: string) => {
    setCurrentLocation(location);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-space/10 to-wed/10 py-8">
          <div className="container-custom">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">Explore Wedding Ideas</h1>
            <p className="text-gray-600 max-w-2xl mb-6">
              Discover trending wedding themes, ideas, and inspiration from couples and vendors around the world.
            </p>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full sm:w-auto grid-cols-3 sm:inline-flex mb-6">
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="new">Newest</TabsTrigger>
              </TabsList>
              
              <div className="container-custom px-0 py-6">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="w-full lg:w-3/4">
                    <ExploreFilter 
                      currentLocation={currentLocation} 
                      onLocationChange={handleLocationChange} 
                    />
                    <TabsContent value="trending" className="mt-6">
                      <ExploreContent type="trending" />
                    </TabsContent>
                    <TabsContent value="popular" className="mt-6">
                      <ExploreContent type="trending" />
                    </TabsContent>
                    <TabsContent value="new" className="mt-6">
                      <ExploreContent type="new" />
                    </TabsContent>
                  </div>
                  <div className="w-full lg:w-1/4">
                    <ExploreSidebar />
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
