"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedPageHero from '@/components/layout/EnhancedPageHero';
import PageContainer from '@/components/layout/PageContainer';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar,
  DollarSign,
  Eye,
  Heart,
  Star,
  ArrowUp,
  ArrowDown,
  Activity,
  Target,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Filter,
  Download,
  RefreshCw,
  PieChart,
  LineChart,
  BarChart,
  Search,
  MessageSquare,
  UserCheck,
  ShoppingBag,
  CreditCard,
  Zap,
  Award,
  TrendingDown
} from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const metrics = [
    { label: 'Total Users', value: '50,234', change: '+12%', trend: 'up', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Venues', value: '2,456', change: '+8%', trend: 'up', icon: MapPin, color: 'bg-green-500' },
    { label: 'Monthly Bookings', value: '1,234', change: '+15%', trend: 'up', icon: Calendar, color: 'bg-purple-500' },
    { label: 'Revenue', value: '₹45.6L', change: '+22%', trend: 'up', icon: DollarSign, color: 'bg-amber-500' },
    { label: 'Page Views', value: '2.4M', change: '+18%', trend: 'up', icon: Eye, color: 'bg-indigo-500' },
    { label: 'Conversion Rate', value: '3.2%', change: '+0.8%', trend: 'up', icon: Target, color: 'bg-rose-500' },
    { label: 'Avg. Session', value: '4m 32s', change: '+1m 12s', trend: 'up', icon: Clock, color: 'bg-cyan-500' },
    { label: 'Bounce Rate', value: '24.5%', change: '-2.1%', trend: 'up', icon: Activity, color: 'bg-orange-500' }
  ];

  const trafficSources = [
    { source: 'Organic Search', visitors: '18,456', percentage: 45, color: 'bg-green-500' },
    { source: 'Direct', visitors: '12,234', percentage: 30, color: 'bg-blue-500' },
    { source: 'Social Media', visitors: '6,789', percentage: 17, color: 'bg-purple-500' },
    { source: 'Referrals', visitors: '2,345', percentage: 6, color: 'bg-orange-500' },
    { source: 'Email', visitors: '823', percentage: 2, color: 'bg-pink-500' }
  ];

  const topPages = [
    { page: '/venues', views: '45,234', bounce: '22%', time: '3m 45s' },
    { page: '/vendors', views: '32,156', bounce: '28%', time: '2m 56s' },
    { page: '/search', views: '28,945', bounce: '19%', time: '4m 12s' },
    { page: '/planning', views: '21,678', bounce: '31%', time: '5m 23s' },
    { page: '/about', views: '18,234', bounce: '45%', time: '1m 34s' }
  ];

  const deviceStats = [
    { device: 'Mobile', users: '28,456', percentage: 57 },
    { device: 'Desktop', users: '18,234', percentage: 36 },
    { device: 'Tablet', users: '3,544', percentage: 7 }
  ];

  const recentActivity = [
    { action: 'New venue registration', user: 'The Grand Palace', time: '2 minutes ago', type: 'venue' },
    { action: 'Booking completed', user: 'Priya & Arjun', time: '5 minutes ago', type: 'booking' },
    { action: 'Review submitted', user: 'Artistic Moments', time: '8 minutes ago', type: 'review' },
    { action: 'Payment processed', user: 'Wedding Bells Catering', time: '12 minutes ago', type: 'payment' },
    { action: 'New user signup', user: 'Sneha Sharma', time: '15 minutes ago', type: 'user' }
  ];

  const conversionFunnel = [
    { stage: 'Visitors', count: 50234, percentage: 100, color: 'bg-blue-500' },
    { stage: 'Engaged Users', count: 25117, percentage: 50, color: 'bg-green-500' },
    { stage: 'Inquiries', count: 7535, percentage: 15, color: 'bg-yellow-500' },
    { stage: 'Bookings', count: 1507, percentage: 3, color: 'bg-purple-500' },
    { stage: 'Completed', count: 1234, percentage: 2.5, color: 'bg-red-500' }
  ];

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: BarChart3, text: 'Analytics' }}
        title="Analytics"
        titleGradient="Dashboard"
        description="Comprehensive platform performance and user insights."
      />
      <PageContainer className="py-12">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {['24h', '7d', '30d', '90d'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedPeriod === period
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <Card key={metric.label} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {metric.value}
                    </p>
                    <div className="flex items-center">
                      {metric.trend === 'up' ? (
                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {metric.change}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        vs last period
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.color}`}>
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Analytics Tabs */}
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Traffic Sources */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Traffic Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficSources.map((source) => (
                      <div key={source.source} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {source.source}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {source.visitors}
                          </span>
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${source.color}`}
                              style={{ width: `${source.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                            {source.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="h-5 w-5 mr-2" />
                    Device Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deviceStats.map((device) => (
                      <div key={device.device} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {device.device === 'Mobile' && <Smartphone className="h-4 w-4" />}
                            {device.device === 'Desktop' && <Monitor className="h-4 w-4" />}
                            {device.device === 'Tablet' && <Monitor className="h-4 w-4" />}
                            <span className="text-sm font-medium">{device.device}</span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {device.users}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Pages & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Top Pages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPages.map((page, index) => (
                      <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{page.page}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {page.views} views
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {page.bounce} bounce
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {page.time} avg
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'venue' ? 'bg-green-100 text-green-600' :
                          activity.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                          activity.type === 'payment' ? 'bg-purple-100 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.type === 'venue' && <MapPin className="h-3 w-3" />}
                          {activity.type === 'booking' && <Calendar className="h-3 w-3" />}
                          {activity.type === 'review' && <Star className="h-3 w-3" />}
                          {activity.type === 'payment' && <CreditCard className="h-3 w-3" />}
                          {activity.type === 'user' && <Users className="h-3 w-3" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="conversions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Conversion Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionFunnel.map((stage, index) => (
                    <div key={stage.stage} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {stage.stage}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {stage.count.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({stage.percentage}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
                        <div
                          className={`h-8 rounded-full ${stage.color} transition-all duration-1000 flex items-center justify-center`}
                          style={{ width: `${stage.percentage}%` }}
                        >
                          <span className="text-white text-xs font-medium">
                            {stage.percentage}%
                          </span>
                        </div>
                      </div>
                      {index < conversionFunnel.length - 1 && (
                        <div className="flex justify-center mt-2">
                          <ArrowDown className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tab contents would go here */}
          <TabsContent value="traffic">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Traffic Analytics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Detailed traffic analysis and user behavior insights
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    User Engagement
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    User interaction patterns and engagement metrics
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Revenue Analytics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Financial performance and revenue optimization insights
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </main>
  );
}
