"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import { Heart, MessageCircle, Share2, User, Calendar, TrendingUp } from "lucide-react";

const communityPosts = [
  {
    id: 1,
    title: "Our Dream Wedding at Taj Palace",
    excerpt: "Sharing our magical wedding experience at Taj Palace, Delhi. From the stunning decor to the exceptional service, everything was perfect!",
    author: "Priya & Rahul",
    date: "2 days ago",
    category: "Real Wedding",
    likes: 124,
    comments: 18,
    image: "/api/placeholder/400/250",
    trending: true
  },
  {
    id: 2,
    title: "Budget-Friendly Decor Ideas That Wow",
    excerpt: "10 creative and affordable decoration ideas that will transform your wedding venue without breaking the bank. Perfect for couples on a budget!",
    author: "Wedding Decor Expert",
    date: "5 days ago",
    category: "Tips & Ideas",
    likes: 89,
    comments: 12,
    image: "/api/placeholder/400/250"
  },
  {
    id: 3,
    title: "Choosing the Perfect Wedding Photographer",
    excerpt: "Essential tips for selecting a wedding photographer who will capture your special moments beautifully. What to look for and questions to ask.",
    author: "Photography Studio",
    date: "1 week ago",
    category: "Vendor Tips",
    likes: 67,
    comments: 8,
    image: "/api/placeholder/400/250"
  },
  {
    id: 4,
    title: "Monsoon Wedding Planning Guide",
    excerpt: "Planning a monsoon wedding in India? Here's your complete guide to handling weather challenges while creating a beautiful celebration.",
    author: "WedSpace Team",
    date: "1 week ago",
    category: "Planning Guide",
    likes: 156,
    comments: 23,
    image: "/api/placeholder/400/250"
  },
  {
    id: 5,
    title: "Traditional vs Modern: Finding Your Style",
    excerpt: "Balancing traditional Indian wedding customs with modern aesthetics. Real couples share how they created their perfect blend.",
    author: "Style Consultant",
    date: "2 weeks ago",
    category: "Style Guide",
    likes: 92,
    comments: 15,
    image: "/api/placeholder/400/250"
  },
  {
    id: 6,
    title: "Vendor Spotlight: Best Caterers in Mumbai",
    excerpt: "Discover Mumbai's top wedding caterers who are creating unforgettable culinary experiences for couples across the city.",
    author: "Food & Events",
    date: "2 weeks ago",
    category: "Vendor Spotlight",
    likes: 78,
    comments: 9,
    image: "/api/placeholder/400/250"
  }
];

const categories = [
  { name: "All", count: 156 },
  { name: "Real Weddings", count: 45 },
  { name: "Tips & Ideas", count: 38 },
  { name: "Vendor Tips", count: 29 },
  { name: "Planning Guide", count: 24 },
  { name: "Style Guide", count: 20 }
];

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Heart, text: "Community" }}
        title="Wedding"
        titleGradient="Community"
        description="Tips, inspiration, and real stories from couples and vendors. Join thousands of couples planning their perfect wedding."
      >
        <div className="flex gap-3 justify-center">
          <Button className="bg-gradient-to-r from-primary via-rose-500 to-secondary text-white">
            Share Your Story
          </Button>
          <Button variant="outline">Explore Posts</Button>
        </div>
      </EnhancedPageHero>

      <PageContainer className="py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="font-playfair text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-center justify-between group"
                    >
                      <span className="text-sm font-medium group-hover:text-red-600 transition-colors">
                        {category.name}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Topics */}
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="font-playfair text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                  Trending
                </h3>
                <div className="space-y-3">
                  {["Destination Weddings", "Budget Planning", "Vendor Reviews", "Decor Ideas"].map((topic) => (
                    <div key={topic} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                      #{topic.replace(" ", "").toLowerCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="lg:w-3/4">
            <div className="mb-8">
              <h2 className="font-playfair text-2xl font-semibold mb-2">Latest Stories</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {communityPosts.map((post) => (
                <Card key={post.id} className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-900/20 dark:to-amber-900/20" />
                    {post.trending && (
                      <Badge className="absolute top-3 left-3 bg-red-600 text-white">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    <Badge variant="secondary" className="absolute top-3 right-3">
                      {post.category}
                    </Badge>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-playfair text-xl font-semibold mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-red-600 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-red-600 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                      </div>
                      <button className="text-muted-foreground hover:text-red-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="flex gap-3 justify-center">
              <Button className="bg-gradient-to-r from-primary via-rose-500 to-secondary text-white">
                Share Your Story
              </Button>
              <Button variant="outline">Explore Posts</Button>
            </div>
          </div>
        </div>
        </PageContainer>
      </main>
  );
}
