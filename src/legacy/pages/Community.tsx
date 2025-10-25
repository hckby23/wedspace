
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import CommunityPosts from '@/components/community/CommunityPosts';
import CommunityTopics from '@/components/community/CommunityTopics';
import CommunitySidebar from '@/components/community/CommunitySidebar';
import { Search } from 'lucide-react';

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('discussions');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // In a real app, this would trigger a search
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-space/10 to-wed/10 py-8">
          <div className="container-custom">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">Wedding Community</h1>
            <p className="text-gray-600 max-w-2xl mb-6">
              Join conversations with couples, planners, and vendors. Share your experiences, ask questions, 
              and connect with others planning their wedding journey.
            </p>
            
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Search discussions, blogs, and topics" 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-space hover:bg-space/90">Search</Button>
            </form>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid w-full sm:w-auto grid-cols-3 sm:inline-flex">
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="blogs">Blogs</TabsTrigger>
                <TabsTrigger value="questions">Q&A</TabsTrigger>
              </TabsList>
              
              <div className="container-custom py-6 px-0">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="w-full lg:w-2/3">
                    <TabsContent value="discussions" className="mt-0">
                      <CommunityPosts type="discussions" />
                    </TabsContent>
                    <TabsContent value="blogs" className="mt-0">
                      <CommunityPosts type="blogs" />
                    </TabsContent>
                    <TabsContent value="questions" className="mt-0">
                      <CommunityPosts type="questions" />
                    </TabsContent>
                  </div>
                  <div className="w-full lg:w-1/3 space-y-6">
                    <Button className="w-full bg-wed hover:bg-wed/90 text-white">Start a New Topic</Button>
                    <CommunityTopics />
                    <CommunitySidebar />
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

export default Community;
