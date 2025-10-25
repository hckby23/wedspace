"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import {
  CheckCircle,
  Clock,
  Users,
  IndianRupee,
  Calendar,
  ListTodo,
  Target,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Plus,
  Heart,
  MapPin,
  Camera,
  Music,
  Utensils,
  Flower,
  Gift,
  Star,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

const planningTools = [
  {
    id: "checklist",
    title: "Wedding Checklist",
    description: "Track tasks by timeline with smart reminders",
    href: "/tools/checklist",
    icon: ListTodo,
    progress: 65,
    totalTasks: 47,
    completedTasks: 31,
    urgentTasks: 3,
    color: "from-blue-500 to-indigo-600",
    status: "On Track"
  },
  {
    id: "budget",
    title: "Budget Tracker",
    description: "Plan and monitor wedding expenses",
    href: "/tools/budget",
    icon: IndianRupee,
    progress: 78,
    totalBudget: 500000,
    spentBudget: 390000,
    remainingBudget: 110000,
    color: "from-green-500 to-emerald-600",
    status: "Under Budget"
  },
  {
    id: "guests",
    title: "Guest Management",
    description: "Manage invitations, RSVPs, and seating",
    href: "/tools/guests",
    icon: Users,
    progress: 45,
    totalGuests: 150,
    confirmedGuests: 68,
    pendingRsvps: 82,
    color: "from-purple-500 to-violet-600",
    status: "Pending RSVPs"
  },
  {
    id: "timeline",
    title: "Day-of Timeline",
    description: "Build your wedding day schedule",
    href: "/tools/timeline",
    icon: Calendar,
    progress: 30,
    totalEvents: 12,
    scheduledEvents: 4,
    pendingEvents: 8,
    color: "from-red-500 to-pink-600",
    status: "In Progress"
  }
];

const quickActions = [
  {
    title: "Find Venues",
    description: "Browse and shortlist venues",
    href: "/venues",
    icon: MapPin,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
  },
  {
    title: "Book Vendors",
    description: "Connect with photographers, caterers",
    href: "/vendors",
    icon: Camera,
    color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
  },
  {
    title: "View Favorites",
    description: "Your saved venues and vendors",
    href: "/favorites",
    icon: Heart,
    color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
  },
  {
    title: "Get Inspiration",
    description: "Browse wedding ideas and themes",
    href: "/ideas",
    icon: Sparkles,
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
  }
];

const upcomingTasks = [
  {
    id: 1,
    title: "Book wedding venue",
    dueDate: "In 3 days",
    priority: "high",
    category: "Venue"
  },
  {
    id: 2,
    title: "Send save the dates",
    dueDate: "In 1 week",
    priority: "medium",
    category: "Invitations"
  },
  {
    id: 3,
    title: "Schedule cake tasting",
    dueDate: "In 2 weeks",
    priority: "medium",
    category: "Catering"
  },
  {
    id: 4,
    title: "Book photographer",
    dueDate: "In 3 weeks",
    priority: "high",
    category: "Photography"
  }
];

const recentActivity = [
  {
    id: 1,
    action: "Added venue to favorites",
    item: "The Grand Palace Hotel",
    time: "2 hours ago",
    type: "favorite"
  },
  {
    id: 2,
    action: "Completed task",
    item: "Research wedding photographers",
    time: "1 day ago",
    type: "task"
  },
  {
    id: 3,
    action: "Updated budget",
    item: "Venue booking deposit",
    time: "2 days ago",
    type: "budget"
  },
  {
    id: 4,
    action: "Sent inquiry",
    item: "Floral arrangements vendor",
    time: "3 days ago",
    type: "vendor"
  }
];

export default function PlanningPage() {
  const [activeView, setActiveView] = useState("overview");
  
  const overallProgress = Math.round(
    planningTools.reduce((acc, tool) => acc + tool.progress, 0) / planningTools.length
  );

  const daysUntilWedding = 180; // Mock data
  const weddingDate = "March 15, 2025";

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Sparkles, text: "AI-Powered Planning" }}
        title="Your Wedding"
        titleGradient="Planning Hub"
        description="Stay organized with smart tools. Monitor progress, manage tasks, and plan your perfect day."
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md mx-auto">
          <div className="flex items-center justify-center gap-4">
            <Calendar className="w-8 h-8 text-primary" />
            <div>
              <div className="text-4xl font-bold text-foreground">{daysUntilWedding}</div>
              <div className="text-sm text-muted-foreground">Days Until Your Wedding</div>
            </div>
          </div>
          <div className="mt-6">
            <Progress value={overallProgress} className="h-3" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Overall Progress</span>
              <span className="font-semibold text-foreground">{overallProgress}%</span>
            </div>
          </div>
        </div>
      </EnhancedPageHero>

      <PageContainer className="py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Overall Progress
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                You're {overallProgress}% complete with your wedding planning
              </p>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-4 mb-6">
              <div 
                className="bg-gradient-to-r from-red-500 to-amber-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600 mb-1">31</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Tasks Complete</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">16</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Tasks Remaining</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600 mb-1">₹3.9L</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Budget Spent</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-1">68</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">RSVPs Confirmed</div>
              </div>
            </div>
          </div>
        {/* Planning Tools */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Planning Tools
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive tools to help you plan every aspect of your wedding
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {planningTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card key={tool.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant={tool.status === "On Track" ? "default" : tool.status === "Under Budget" ? "secondary" : "outline"}>
                        {tool.status}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{tool.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{tool.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <span>Progress</span>
                        <span>{tool.progress}%</span>
                      </div>
                      <Progress value={tool.progress} className="h-2" />
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      {tool.id === "checklist" && `${tool.completedTasks}/${tool.totalTasks} tasks completed`}
                      {tool.id === "budget" && `₹${(tool.spentBudget / 100000).toFixed(1)}L of ₹${(tool.totalBudget / 100000).toFixed(1)}L spent`}
                      {tool.id === "guests" && `${tool.confirmedGuests}/${tool.totalGuests} guests confirmed`}
                      {tool.id === "timeline" && `${tool.scheduledEvents}/${tool.totalEvents} events scheduled`}
                    </div>
                    
                    <Button asChild className="w-full">
                      <Link href={tool.href}>
                        Open Tool
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        
        {/* Quick Actions & Tasks */}
        <div className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Quick Actions */}
            <div>
              <h2 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6">
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{action.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{action.description}</p>
                        <Button asChild variant="outline" size="sm">
                          <Link href={action.href}>
                            Get Started
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white">
                  Upcoming Tasks
                </h2>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/tools/checklist">View All</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <Card key={task.id} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                              {task.priority === "high" ? <AlertCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                              {task.priority}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{task.category}</span>
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">{task.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{task.dueDate}</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <Card key={activity.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === "favorite" ? "bg-red-100 dark:bg-red-900/30" :
                        activity.type === "task" ? "bg-green-100 dark:bg-green-900/30" :
                        activity.type === "budget" ? "bg-blue-100 dark:bg-blue-900/30" :
                        "bg-purple-100 dark:bg-purple-900/30"
                      }`}>
                        {activity.type === "favorite" && <Heart className="w-5 h-5 text-red-600" />}
                        {activity.type === "task" && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {activity.type === "budget" && <IndianRupee className="w-5 h-5 text-blue-600" />}
                        {activity.type === "vendor" && <Users className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white">
                          <span className="font-medium">{activity.action}</span>
                          <span className="text-gray-600 dark:text-gray-300"> - {activity.item}</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-primary via-rose-500 to-secondary rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-white opacity-90" />
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
            Need Help Planning?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Our wedding planning experts are here to help you create the perfect day. Get personalized assistance and guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
              <Users className="w-5 h-5 mr-2" />
              Talk to Expert
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Consultation
            </Button>
          </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
