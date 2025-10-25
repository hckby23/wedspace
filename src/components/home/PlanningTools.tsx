"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Calendar, Users, DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import Section from '@/components/layout/Section';

const tools = [
  {
    title: 'Wedding Checklist',
    description: 'Stay organized with AI-powered task recommendations and timeline management',
    icon: CheckSquare,
    iconColor: 'text-pink-600',
    iconBg: 'bg-pink-50 dark:bg-pink-900/20',
    path: '/tools/checklist',
    badge: 'Most Popular',
    badgeVariant: 'featured' as const
  },
  {
    title: 'Budget Planner',
    description: 'Smart expense tracking with vendor cost predictions and savings tips',
    icon: DollarSign,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50 dark:bg-green-900/20',
    path: '/tools/budget',
    badge: 'AI-Powered',
    badgeVariant: 'info' as const
  },
  {
    title: 'Guest List Manager',
    description: 'Effortless RSVP tracking, seating arrangements, and guest communications',
    icon: Users,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    path: '/tools/guests'
  },
  {
    title: 'Wedding Timeline',
    description: 'Minute-by-minute scheduling with vendor coordination and reminders',
    icon: Calendar,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50 dark:bg-purple-900/20',
    path: '/tools/timeline'
  }
];

const PlanningTools: React.FC = () => {
  return (
    <Section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
          <Sparkles className="w-3 h-3 mr-1" />
          AI-Powered Planning Suite
        </Badge>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
          Smart Wedding <span className="text-primary">Planning Tools</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Streamline your wedding planning with intelligent tools that adapt to your preferences and budget
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, index) => {
          const IconComponent = tool.icon;
          
          return (
            <Link key={index} href={tool.path} className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50 group-hover:border-primary/20">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  {/* Badge */}
                  {tool.badge && (
                    <Badge 
                      variant={tool.badgeVariant || 'outline'} 
                      className="mb-4 text-xs"
                    >
                      {tool.badge}
                    </Badge>
                  )}
                  
                  {/* Icon */}
                  <div className={`${tool.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`${tool.iconColor} group-hover:scale-110 transition-transform duration-300`} size={28} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-playfair font-semibold text-xl mb-3 group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                    {tool.description}
                  </p>
                  
                  {/* CTA */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 mt-auto"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </Section>
  );
};

export default PlanningTools;
