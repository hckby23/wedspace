"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import EnhancedPageHero from '@/components/layout/EnhancedPageHero';
import PageContainer from '@/components/layout/PageContainer';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  MapPin,
  Camera,
  Utensils,
  Palette,
  Music,
  Car,
  Gift
} from 'lucide-react';

interface TimelineTask {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
  status: 'pending' | 'in-progress' | 'completed';
  dependencies?: string[];
  icon: any;
}

export default function TimelineGeneratorPage() {
  const [weddingDate, setWeddingDate] = useState('');
  const [guestCount, setGuestCount] = useState(200);
  const [budget, setBudget] = useState(1000000);
  const [weddingStyle, setWeddingStyle] = useState('traditional');
  const [timeline, setTimeline] = useState<TimelineTask[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTimeline = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/timeline-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weddingDate, guestCount, budget, weddingStyle }),
      });
      if (res.ok) {
        const data = await res.json();
        setTimeline((data?.timeline as TimelineTask[]) || []);
      } else {
        setTimeline([]);
      }
    } catch {
      setTimeline([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 'pending': return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Calendar, text: 'AI' }}
        title="Timeline"
        titleGradient="Generator"
        description="Create a personalized wedding planning timeline with AI optimization."
      />

      <PageContainer className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Wedding Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Wedding Date
                  </label>
                  <Input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Guest Count
                  </label>
                  <Input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Budget (₹)
                  </label>
                  <Input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Wedding Style
                  </label>
                  <select
                    value={weddingStyle}
                    onChange={(e) => setWeddingStyle(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="traditional">Traditional Indian</option>
                    <option value="modern">Modern</option>
                    <option value="destination">Destination</option>
                    <option value="intimate">Intimate</option>
                  </select>
                </div>

                <Button 
                  onClick={generateTimeline}
                  disabled={!weddingDate || isGenerating}
                  className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white"
                >
                  {isGenerating ? 'Generating...' : 'Generate AI Timeline'}
                </Button>

                {timeline.length > 0 && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Progress Overview</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400">Completed</span>
                        <span>{timeline.filter(t => t.status === 'completed').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-600 dark:text-blue-400">In Progress</span>
                        <span>{timeline.filter(t => t.status === 'in-progress').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Pending</span>
                        <span>{timeline.filter(t => t.status === 'pending').length}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-3">
            {isGenerating ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <span className="text-lg text-gray-600 dark:text-gray-300">
                    Generating your personalized timeline...
                  </span>
                </div>
              </div>
            ) : timeline.length > 0 ? (
              <div className="space-y-6">
                {/* Timeline Header */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Your Wedding Planning Timeline</span>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {timeline.length} Tasks
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      AI-optimized timeline based on your wedding date: <strong>{weddingDate}</strong>, 
                      guest count: <strong>{guestCount}</strong>, and <strong>{weddingStyle}</strong> style.
                    </p>
                  </CardContent>
                </Card>

                {/* Timeline Items */}
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  
                  <div className="space-y-6">
                    {timeline.map((task, index) => {
                      const IconComponent = task.icon;
                      return (
                        <div key={task.id} className="relative flex items-start space-x-4">
                          {/* Timeline Dot */}
                          <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 border-white dark:border-gray-900 ${
                            task.status === 'completed' ? 'bg-green-100 dark:bg-green-900' :
                            task.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900' :
                            'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            {task.status === 'completed' ? (
                              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            ) : task.status === 'in-progress' ? (
                              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <IconComponent className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                            )}
                          </div>

                          {/* Task Card */}
                          <Card className="flex-1">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {task.title}
                                  </h3>
                                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                                    {task.description}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                  <Badge className={getStatusColor(task.status)}>
                                    {task.status.replace('-', ' ')}
                                  </Badge>
                                  <Badge className={getPriorityColor(task.priority)}>
                                    {task.priority} priority
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {task.timeframe}
                                  </div>
                                  <Badge variant="outline">
                                    {task.category}
                                  </Badge>
                                </div>
                                
                                {task.dependencies && task.dependencies.length > 0 && (
                                  <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Depends on previous tasks
                                  </div>
                                )}
                              </div>

                              {task.status === 'pending' && (
                                <div className="mt-4 flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    Mark as Started
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Get Recommendations
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Insights */}
                <Card className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950 dark:to-amber-950 border-red-200 dark:border-red-800">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                          AI Planning Insights
                        </h3>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                          <li>• Start venue booking immediately - popular dates fill up 8-12 months in advance</li>
                          <li>• Photography booking is critical path - affects all other visual planning decisions</li>
                          <li>• Consider booking catering and decoration together for better coordination</li>
                          <li>• Your {weddingStyle} style typically requires 6+ months for proper vendor coordination</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Generate Your Wedding Timeline
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Enter your wedding details to get a personalized AI-generated planning timeline
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
