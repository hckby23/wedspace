"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import { 
  Download, 
  ExternalLink, 
  Calendar, 
  Users, 
  TrendingUp, 
  Award,
  FileText,
  Image,
  Video,
  Newspaper,
  Globe,
  Star,
  Heart,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

const pressReleases = [
  {
    id: 1,
    title: "WedSpace Raises $15M Series A to Revolutionize Wedding Planning in India",
    date: "December 15, 2024",
    category: "Funding",
    excerpt: "AI-powered wedding platform secures funding from leading VCs to expand across 50+ Indian cities and enhance vendor ecosystem.",
    readTime: "3 min read",
    featured: true
  },
  {
    id: 2,
    title: "WedSpace Launches AI Wedding Assistant Powered by Advanced Machine Learning",
    date: "November 28, 2024",
    category: "Product",
    excerpt: "Revolutionary AI assistant helps couples plan their perfect wedding with personalized recommendations and real-time vendor matching.",
    readTime: "4 min read",
    featured: false
  },
  {
    id: 3,
    title: "WedSpace Partners with 10,000+ Verified Vendors Across India",
    date: "October 22, 2024",
    category: "Partnership",
    excerpt: "Platform reaches major milestone with comprehensive vendor network spanning venues, photographers, decorators, and catering services.",
    readTime: "2 min read",
    featured: false
  },
  {
    id: 4,
    title: "WedSpace Wins 'Best Wedding Tech Platform' at India Digital Awards 2024",
    date: "September 18, 2024",
    category: "Awards",
    excerpt: "Recognition for innovative approach to digitizing India's $100+ billion wedding industry with AI-first technology.",
    readTime: "3 min read",
    featured: false
  }
];

const mediaCoverage = [
  {
    id: 1,
    publication: "Economic Times",
    title: "How WedSpace is Transforming India's Wedding Industry with AI",
    date: "January 8, 2025",
    type: "Feature Article",
    logo: "📰",
    url: "#"
  },
  {
    id: 2,
    publication: "TechCrunch",
    title: "WedSpace's AI-First Approach to Wedding Planning in India",
    date: "December 20, 2024",
    type: "Startup Profile",
    logo: "🚀",
    url: "#"
  },
  {
    id: 3,
    publication: "YourStory",
    title: "From Idea to $15M: The WedSpace Journey",
    date: "December 16, 2024",
    type: "Founder Interview",
    logo: "💡",
    url: "#"
  },
  {
    id: 4,
    publication: "Mint",
    title: "Digital Wedding Planning: The New Normal in Post-COVID India",
    date: "November 30, 2024",
    type: "Industry Analysis",
    logo: "📊",
    url: "#"
  },
  {
    id: 5,
    publication: "Forbes India",
    title: "Top 10 Wedding Tech Startups to Watch in 2024",
    date: "November 15, 2024",
    type: "List Feature",
    logo: "🏆",
    url: "#"
  },
  {
    id: 6,
    publication: "Business Standard",
    title: "WedSpace: Bringing Technology to Traditional Indian Weddings",
    date: "October 28, 2024",
    type: "Business Profile",
    logo: "💼",
    url: "#"
  }
];

const brandAssets = [
  {
    category: "Logos",
    icon: Image,
    items: [
      { name: "Primary Logo (SVG)", size: "Vector", format: "SVG" },
      { name: "Primary Logo (PNG)", size: "2000x800px", format: "PNG" },
      { name: "Logo Mark Only", size: "1000x1000px", format: "PNG" },
      { name: "White Logo", size: "Vector", format: "SVG" }
    ]
  },
  {
    category: "Brand Guidelines",
    icon: FileText,
    items: [
      { name: "Brand Style Guide", size: "24 pages", format: "PDF" },
      { name: "Color Palette", size: "1 page", format: "PDF" },
      { name: "Typography Guide", size: "4 pages", format: "PDF" },
      { name: "Logo Usage Guidelines", size: "8 pages", format: "PDF" }
    ]
  },
  {
    category: "Marketing Materials",
    icon: Video,
    items: [
      { name: "Product Demo Video", size: "2:30 min", format: "MP4" },
      { name: "Company Presentation", size: "32 slides", format: "PPTX" },
      { name: "Fact Sheet", size: "2 pages", format: "PDF" },
      { name: "High-res Screenshots", size: "Various", format: "PNG" }
    ]
  }
];

const companyStats = [
  { label: "Active Users", value: "500K+", icon: Users },
  { label: "Verified Vendors", value: "10,000+", icon: Award },
  { label: "Cities Covered", value: "50+", icon: MapPin },
  { label: "Weddings Planned", value: "25,000+", icon: Heart },
  { label: "Customer Rating", value: "4.8/5", icon: Star },
  { label: "Growth Rate", value: "300% YoY", icon: TrendingUp }
];

export default function PressPage() {
  const [activeTab, setActiveTab] = useState('releases');

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Newspaper, text: "Press & Media" }}
        title="Press &"
        titleGradient="Media"
        description="Media kit, brand assets, press releases, and coverage of WedSpace - India's leading AI-powered wedding planning platform."
      />

      <PageContainer className="py-12">
        {/* Company Stats */}
        <div className="py-12 bg-gradient-to-br from-red-50/50 to-amber-50/50 dark:from-red-950/20 dark:to-amber-950/20 rounded-2xl mb-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
            WedSpace by the Numbers
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Leading the digital transformation of India's $100+ billion wedding industry
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {companyStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="p-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-red-500 to-amber-500 rounded-full flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
              </Card>
            );
          })}
        </div>
        </div>

        {/* Navigation Tabs */}
        <div className="py-8">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { id: 'releases', label: 'Press Releases', icon: Newspaper },
            { id: 'coverage', label: 'Media Coverage', icon: Globe },
            { id: 'assets', label: 'Brand Assets', icon: Download }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                    : 'hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Press Releases Tab */}
        {activeTab === 'releases' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Latest Press Releases</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Stay updated with WedSpace's latest announcements, product launches, and company milestones.
              </p>
            </div>

            <div className="grid gap-6">
              {pressReleases.map((release) => (
                <Card key={release.id} className={`p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  release.featured 
                    ? 'bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/30 border-red-200 dark:border-red-800' 
                    : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge 
                          variant={release.featured ? "default" : "secondary"}
                          className={release.featured ? 'bg-gradient-to-r from-red-600 to-red-700' : ''}
                        >
                          {release.category}
                        </Badge>
                        {release.featured && (
                          <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {release.date}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer">
                        {release.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {release.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{release.readTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 lg:ml-6">
                      <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Read Full Release
                      </Button>
                      <Button size="sm" variant="outline" className="hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Media Coverage Tab */}
        {activeTab === 'coverage' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Media Coverage</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                See how leading publications are covering WedSpace's impact on the wedding industry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediaCoverage.map((article) => (
                <Card key={article.id} className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{article.logo}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{article.type}</Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{article.date}</span>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">
                        {article.publication}
                      </p>
                      
                      <Button size="sm" variant="outline" className="w-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Read Article
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Brand Assets Tab */}
        {activeTab === 'assets' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Brand Assets & Media Kit</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Download high-quality logos, brand guidelines, and marketing materials for media use.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {brandAssets.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card key={index} className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-amber-500 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{category.category}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                          <div>
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.size} • {item.format}</div>
                          </div>
                          <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/20">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                      <Download className="w-4 h-4 mr-2" />
                      Download All {category.category}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-red-500 to-amber-500 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold mb-2">Press Inquiries</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">For media and press related questions</p>
            <a href="mailto:press@wedspace.in" className="text-red-600 dark:text-red-400 hover:underline font-medium">
              press@wedspace.in
            </a>
          </Card>
          
          <Card className="p-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-red-500 to-amber-500 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold mb-2">Media Hotline</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">24/7 media support line</p>
            <a href="tel:+911234567890" className="text-red-600 dark:text-red-400 hover:underline font-medium">
              +91 12345 67890
            </a>
          </Card>
          
          <Card className="p-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-red-500 to-amber-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold mb-2">Partnership Team</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Business and partnership inquiries</p>
            <a href="mailto:partnerships@wedspace.in" className="text-red-600 dark:text-red-400 hover:underline font-medium">
              partnerships@wedspace.in
            </a>
          </Card>
        </div>
      </PageContainer>
    </main>
  );
}
