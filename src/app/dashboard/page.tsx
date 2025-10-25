"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Users,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  Star,
  ChevronRight,
  Plus,
  Target,
  Sparkles,
  Camera,
  Music,
  Utensils,
  Palette,
  Gift,
  MapPin,
  Zap,
  ArrowRight
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import StatCard from "@/components/shared/StatCard";
import GlassCard from "@/components/shared/GlassCard";
import PlanningAssistant from "@/components/dashboard/PlanningAssistant";

// Lightweight dashboard pulling from localStorage-only MVP tools
export default function DashboardPage() {
  // checklist
  const [tasks, setTasks] = useState<any[]>([]);
  // budget
  const [items, setItems] = useState<any[]>([]);
  // guests
  const [guests, setGuests] = useState<any[]>([]);

  useEffect(() => {
    try { 
      const r = localStorage.getItem("ws_checklist_v1"); 
      if (r && r.trim()) setTasks(JSON.parse(r)); 
    } catch (e) {
      console.error("Error parsing checklist:", e);
      setTasks([]);
    }
    try { 
      const r = localStorage.getItem("ws_budget_v1"); 
      if (r && r.trim()) setItems(JSON.parse(r)); 
    } catch (e) {
      console.error("Error parsing budget:", e);
      setItems([]);
    }
    try { 
      const r = localStorage.getItem("ws_guests_v1"); 
      if (r && r.trim()) setGuests(JSON.parse(r)); 
    } catch (e) {
      console.error("Error parsing guests:", e);
      setGuests([]);
    }
  }, []);

  const checklistProgress = useMemo(() => {
    if (!tasks?.length) return 0;
    const done = tasks.filter((t) => t.done).length;
    return Math.round((done / tasks.length) * 100);
  }, [tasks]);

  const budgetTotal = useMemo(() => {
    if (!items || items.length === 0) return 0;
    return items.reduce((s: number, i: any) => s + (Number(i.amount) || 0), 0);
  }, [items]);

  const budgetUsed = useMemo(() => {
    if (!items || items.length === 0) return 0;
    return items.reduce((s: number, i: any) => s + (Number(i.spent) || 0), 0);
  }, [items]);

  const guestStats = useMemo(() => {
    const total = guests?.length || 0;
    const accepted = guests?.filter((g: any) => g.rsvp === "Accepted").length || 0;
    const declined = guests?.filter((g: any) => g.rsvp === "Declined").length || 0;
    const pending = Math.max(0, total - accepted - declined);
    return { total, accepted, declined, pending };
  }, [guests]);

  // Mock data for enhanced dashboard features
  const weddingDate = new Date('2024-12-15');
  const daysUntilWedding = Math.ceil((weddingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const recentActivity = [
    { id: 1, type: 'venue', action: 'Added to favorites', item: 'Royal Palace Banquet', time: '2 hours ago', icon: Heart },
    { id: 2, type: 'vendor', action: 'Contacted', item: 'Elegant Photography Studio', time: '1 day ago', icon: Camera },
    { id: 3, type: 'budget', action: 'Updated budget item', item: 'Catering - ₹2,50,000', time: '2 days ago', icon: IndianRupee },
    { id: 4, type: 'guest', action: 'Added guests', item: '15 new invitations', time: '3 days ago', icon: Users }
  ];

  const upcomingTasks = [
    { id: 1, task: 'Finalize venue booking', dueDate: '2024-08-15', priority: 'high', category: 'venue' },
    { id: 2, task: 'Send save the dates', dueDate: '2024-08-20', priority: 'medium', category: 'invitations' },
    { id: 3, task: 'Book photographer', dueDate: '2024-08-25', priority: 'high', category: 'vendor' },
    { id: 4, task: 'Taste menu samples', dueDate: '2024-09-01', priority: 'medium', category: 'catering' }
  ];

  const recommendations = [
    { id: 1, title: 'Complete your venue booking', description: 'You have 3 venues in favorites. Book soon for best dates!', action: 'View Venues', link: '/venues' },
    { id: 2, title: 'Set up guest RSVP system', description: 'Make it easy for guests to respond with our RSVP tools.', action: 'Setup RSVP', link: '/tools/guests' },
    { id: 3, title: 'Create wedding timeline', description: 'Plan your perfect day with our timeline builder.', action: 'Create Timeline', link: '/tools/timeline' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700';
      case 'low': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - Warm & Welcoming */}
      <section className="relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 dark:from-rose-950/20 dark:via-amber-950/20 dark:to-orange-950/20" />
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-30 dark:opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }} />
          {/* Gradient Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
        </div>
        
        <PageContainer className="relative z-10 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Welcome Message */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-4">
                <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0 px-4 py-1.5">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Wedding Dashboard
                </Badge>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
                Welcome Back! 👋
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6 max-w-xl">
                Your wedding planning journey continues. Let's make it perfect together!
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-border">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{daysUntilWedding} days to go</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-border">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-semibold">{checklistProgress}% Complete</span>
                </div>
              </div>
            </div>
            
            {/* Countdown Card */}
            <div className="lg:flex-shrink-0">
              <GlassCard className="min-w-[200px]" hover={false} glow>
                <div className="text-center p-2">
                  <div className="mb-2">
                    <Heart className="w-8 h-8 mx-auto text-primary" />
                  </div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-primary via-rose-500 to-secondary bg-clip-text text-transparent mb-2">
                    {daysUntilWedding}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">Days Until</div>
                  <div className="font-display text-xl font-semibold text-foreground">
                    Your Big Day ✨
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-16 bg-gradient-to-b from-background via-muted/20 to-background">
        <PageContainer>
          <div className="space-y-12">
            {/* AI Planning Assistant */}
            <PlanningAssistant />
            {/* Key Metrics - Enhanced Stats */}
            <div>
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Your Progress</h2>
                <p className="text-muted-foreground">Track your wedding planning journey at a glance</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/tools/checklist">
                  <StatCard
                    icon={CheckCircle}
                    label="Tasks Completed"
                    value={`${tasks.filter(t => t.done).length}/${tasks.length}`}
                    change={{ value: `${checklistProgress}%`, positive: checklistProgress > 50 }}
                  />
                </Link>

                <Link href="/tools/budget">
                  <StatCard
                    icon={IndianRupee}
                    label="Budget Allocated"
                    value={budgetTotal > 0 ? `₹${(budgetTotal/100000).toFixed(1)}L` : "Not set"}
                    change={budgetTotal > 0 ? { 
                      value: `${Math.round((budgetUsed/budgetTotal)*100)}% used`, 
                      positive: (budgetUsed/budgetTotal) < 0.8 
                    } : undefined}
                  />
                </Link>

                <Link href="/tools/guests">
                  <StatCard
                    icon={Users}
                    label="Guest Responses"
                    value={guestStats.total}
                    change={{ value: `${guestStats.accepted} confirmed`, positive: true }}
                  />
                </Link>

                <Link href="/favorites">
                  <StatCard
                    icon={Heart}
                    label="Saved Favorites"
                    value="12"
                    change={{ value: "3 venues", positive: true }}
                  />
                </Link>
              </div>
            </div>

            {/* Recent Activity & Upcoming Tasks - Glass Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <GlassCard hover={false}>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">Recent Activity</h3>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {recentActivity.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{activity.action}</p>
                          <p className="text-sm text-muted-foreground truncate">{activity.item}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <Button variant="outline" className="w-full mt-6 border-2 hover:bg-accent">
                  View All Activity
                </Button>
              </GlassCard>

              {/* Upcoming Tasks */}
              <GlassCard hover={false}>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">Upcoming Tasks</h3>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">{task.task}</p>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Due: {task.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-6 bg-gradient-to-r from-primary to-rose-600 hover:from-primary/90 hover:to-rose-600/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Task
                </Button>
              </GlassCard>
            </div>

            {/* AI Recommendations - Enhanced */}
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">AI Recommendations</h2>
                </div>
                <p className="text-muted-foreground">Smart suggestions based on your planning progress</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-border bg-gradient-to-br from-background to-muted/20 relative overflow-hidden">
                    {/* Decorative gradient */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:w-32 group-hover:h-32 transition-all duration-500" />
                    
                    <CardContent className="p-6 relative z-10">
                      <div className="mb-4">
                        <Zap className="w-8 h-8 text-primary mb-2" />
                      </div>
                      <h4 className="font-bold text-lg mb-2 text-foreground">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>
                      <Link href={rec.link}>
                        <Button className="w-full bg-gradient-to-r from-primary to-rose-600 hover:from-primary/90 hover:to-rose-600/90">
                          {rec.action}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Access - Vendor Categories */}
            <div>
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Quick Access</h2>
                <p className="text-muted-foreground">Jump to your most-used planning tools and vendor categories</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {[
                  { name: 'Venues', icon: MapPin, link: '/venues', color: 'from-rose-500 to-pink-500' },
                  { name: 'Photography', icon: Camera, link: '/vendors?category=photography', color: 'from-blue-500 to-purple-500' },
                  { name: 'Catering', icon: Utensils, link: '/vendors?category=catering', color: 'from-green-500 to-teal-500' },
                  { name: 'Decoration', icon: Palette, link: '/vendors?category=decoration', color: 'from-pink-500 to-red-500' },
                  { name: 'Music', icon: Music, link: '/vendors?category=music', color: 'from-yellow-500 to-orange-500' },
                  { name: 'Timeline', icon: Calendar, link: '/tools/timeline', color: 'from-purple-500 to-indigo-500' }
                ].map((tool, index) => {
                  const IconComponent = tool.icon;
                  return (
                    <Link key={index} href={tool.link}>
                      <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-110 text-center border-border relative overflow-hidden">
                        {/* Gradient background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 dark:group-hover:from-primary/20 dark:group-hover:to-secondary/20 transition-all duration-300" />
                        
                        <CardContent className="p-4 relative z-10">
                          <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-sm font-semibold group-hover:text-primary transition-colors">{tool.name}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
