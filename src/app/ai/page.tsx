import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import EnhancedPageHero from '@/components/layout/EnhancedPageHero';
import PageContainer from '@/components/layout/PageContainer';
import { 
  Brain, 
  MessageSquare, 
  Search, 
  Image, 
  Calculator, 
  Calendar, 
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  Palette,
  TrendingUp
} from 'lucide-react';

export default function AIPage() {
  const aiFeatures = [
    {
      id: 'assistant',
      title: 'AI Wedding Assistant',
      description: 'Your personal AI wedding planner that understands your vision and helps you make informed decisions.',
      icon: MessageSquare,
      href: '/ai/assistant',
      status: 'live',
      features: ['Natural conversations', 'Context memory', 'Personalized advice', '24/7 availability']
    },
    {
      id: 'recommendations',
      title: 'Smart Recommendations',
      description: 'AI-powered venue and vendor suggestions based on your preferences, budget, and style.',
      icon: Target,
      href: '/ai/recommendations',
      status: 'live',
      features: ['Personalized matching', 'Budget optimization', 'Style analysis', 'Real-time updates']
    },
    {
      id: 'visual-search',
      title: 'Visual Style Matching',
      description: 'Upload inspiration photos and find venues that match your aesthetic vision.',
      icon: Image,
      href: '/ai/visual-search',
      status: 'beta',
      features: ['Image analysis', 'Style extraction', 'Color matching', 'Mood boards']
    },
    {
      id: 'budget-optimizer',
      title: 'Budget Intelligence',
      description: 'AI-driven budget planning with cost predictions and optimization suggestions.',
      icon: Calculator,
      href: '/ai/budget-optimizer',
      status: 'live',
      features: ['Cost prediction', 'Budget allocation', 'Savings finder', 'Market analysis']
    },
    {
      id: 'timeline-generator',
      title: 'Smart Timeline',
      description: 'Generate personalized wedding planning timelines with AI-optimized task sequencing.',
      icon: Calendar,
      href: '/ai/timeline-generator',
      status: 'live',
      features: ['Custom timelines', 'Task prioritization', 'Deadline tracking', 'Vendor coordination']
    },
    {
      id: 'search',
      title: 'Natural Language Search',
      description: 'Search venues and vendors using natural language queries and complex requirements.',
      icon: Search,
      href: '/ai/search',
      status: 'live',
      features: ['Semantic search', 'Intent recognition', 'Complex queries', 'Smart filters']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'beta': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'coming-soon': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Brain, text: "AI Features" }}
        title="AI-Powered"
        titleGradient="Wedding Planning"
        description="Experience intelligent wedding planning with our comprehensive AI suite."
      />

      <PageContainer className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-900 dark:to-amber-900 rounded-lg">
                        <IconComponent className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status === 'live' ? 'Live' : feature.status === 'beta' ? 'Beta' : 'Coming Soon'}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2 mb-6">
                      {feature.features.map((item, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Sparkles className="h-3 w-3 text-red-500 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href={feature.href}>
                      <Button 
                        className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white group-hover:shadow-md transition-all duration-300"
                        disabled={feature.status === 'coming-soon'}
                      >
                        {feature.status === 'coming-soon' ? 'Coming Soon' : 'Try Now'}
                        {feature.status !== 'coming-soon' && (
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        )}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
      </PageContainer>
    </main>
  );
}
