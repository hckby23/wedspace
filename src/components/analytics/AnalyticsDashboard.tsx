"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer, 
  Clock,
  MapPin,
  Heart,
  Search,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsData {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    conversionRate: number;
    avgSessionDuration: number;
    bounceRate: number;
    totalBookings: number;
  };
  traffic: {
    sources: Array<{ name: string; visitors: number; percentage: number }>;
    devices: Array<{ name: string; visitors: number; percentage: number }>;
    locations: Array<{ city: string; visitors: number; percentage: number }>;
  };
  engagement: {
    topPages: Array<{ path: string; views: number; avgTime: number }>;
    searchQueries: Array<{ query: string; count: number; resultClicks: number }>;
    popularVenues: Array<{ name: string; views: number; inquiries: number }>;
    popularVendors: Array<{ name: string; views: number; contacts: number }>;
  };
  conversion: {
    funnelSteps: Array<{ step: string; users: number; dropoffRate: number }>;
    bookingsByCategory: Array<{ category: string; bookings: number; revenue: number }>;
    monthlyTrends: Array<{ month: string; bookings: number; revenue: number }>;
  };
}

interface AnalyticsDashboardProps {
  data?: AnalyticsData;
  isLoading?: boolean;
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  onRefresh?: () => void;
}

export function AnalyticsDashboard({
  data,
  isLoading = false,
  dateRange = '30d',
  onDateRangeChange,
  onRefresh
}: AnalyticsDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data for development
  const mockData: AnalyticsData = {
    overview: {
      totalViews: 125430,
      uniqueVisitors: 45230,
      conversionRate: 3.2,
      avgSessionDuration: 245,
      bounceRate: 42.5,
      totalBookings: 1450
    },
    traffic: {
      sources: [
        { name: 'Organic Search', visitors: 18500, percentage: 41 },
        { name: 'Direct', visitors: 13600, percentage: 30 },
        { name: 'Social Media', visitors: 6800, percentage: 15 },
        { name: 'Referral', visitors: 4530, percentage: 10 },
        { name: 'Paid Search', visitors: 1800, percentage: 4 }
      ],
      devices: [
        { name: 'Mobile', visitors: 27150, percentage: 60 },
        { name: 'Desktop', visitors: 13600, percentage: 30 },
        { name: 'Tablet', visitors: 4530, percentage: 10 }
      ],
      locations: [
        { city: 'Mumbai', visitors: 8500, percentage: 19 },
        { city: 'Delhi', visitors: 7200, percentage: 16 },
        { city: 'Bangalore', visitors: 6300, percentage: 14 },
        { city: 'Hyderabad', visitors: 4500, percentage: 10 },
        { city: 'Chennai', visitors: 4100, percentage: 9 }
      ]
    },
    engagement: {
      topPages: [
        { path: '/venues', views: 25400, avgTime: 180 },
        { path: '/vendors', views: 18200, avgTime: 165 },
        { path: '/search', views: 15600, avgTime: 120 },
        { path: '/planning', views: 12300, avgTime: 240 },
        { path: '/', views: 45200, avgTime: 90 }
      ],
      searchQueries: [
        { query: 'wedding venues mumbai', count: 2400, resultClicks: 1680 },
        { query: 'banquet halls delhi', count: 1800, resultClicks: 1260 },
        { query: 'wedding photographers', count: 1500, resultClicks: 1050 },
        { query: 'destination wedding', count: 1200, resultClicks: 840 },
        { query: 'wedding decorators', count: 1000, resultClicks: 700 }
      ],
      popularVenues: [
        { name: 'Grand Ballroom Mumbai', views: 1200, inquiries: 45 },
        { name: 'Royal Palace Delhi', views: 980, inquiries: 38 },
        { name: 'Garden Resort Goa', views: 850, inquiries: 32 },
        { name: 'Heritage Hotel Jaipur', views: 720, inquiries: 28 },
        { name: 'Luxury Banquet Pune', views: 650, inquiries: 25 }
      ],
      popularVendors: [
        { name: 'Elite Photography', views: 890, contacts: 67 },
        { name: 'Dream Decorators', views: 750, contacts: 52 },
        { name: 'Royal Caterers', views: 680, contacts: 48 },
        { name: 'Melody Music', views: 620, contacts: 41 },
        { name: 'Bridal Makeup Pro', views: 580, contacts: 38 }
      ]
    },
    conversion: {
      funnelSteps: [
        { step: 'Page View', users: 45230, dropoffRate: 0 },
        { step: 'Search/Browse', users: 28400, dropoffRate: 37.2 },
        { step: 'View Details', users: 15600, dropoffRate: 45.1 },
        { step: 'Contact/Inquiry', users: 4200, dropoffRate: 73.1 },
        { step: 'Booking', users: 1450, dropoffRate: 65.5 }
      ],
      bookingsByCategory: [
        { category: 'Venues', bookings: 850, revenue: 12500000 },
        { category: 'Photography', bookings: 320, revenue: 2400000 },
        { category: 'Catering', bookings: 180, revenue: 1800000 },
        { category: 'Decoration', bookings: 100, revenue: 800000 }
      ],
      monthlyTrends: [
        { month: 'Jan', bookings: 120, revenue: 1800000 },
        { month: 'Feb', bookings: 140, revenue: 2100000 },
        { month: 'Mar', bookings: 180, revenue: 2700000 },
        { month: 'Apr', bookings: 160, revenue: 2400000 },
        { month: 'May', bookings: 200, revenue: 3000000 },
        { month: 'Jun', bookings: 220, revenue: 3300000 }
      ]
    }
  };

  const analyticsData = data || mockData;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your platform performance and user engagement</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange?.(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalViews)}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unique Visitors</p>
                <p className="text-2xl font-bold">{formatNumber(analyticsData.overview.uniqueVisitors)}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Session</p>
                <p className="text-2xl font-bold">{formatDuration(analyticsData.overview.avgSessionDuration)}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</p>
                <p className="text-2xl font-bold">{analyticsData.overview.bounceRate}%</p>
              </div>
              <MousePointer className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalBookings)}</p>
              </div>
              <Calendar className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Traffic</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.traffic.sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm">{source.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatNumber(source.visitors)}</p>
                        <p className="text-xs text-gray-500">{source.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.traffic.devices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm">{device.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatNumber(device.visitors)}</p>
                        <p className="text-xs text-gray-500">{device.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Top Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.traffic.locations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-sm">{location.city}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatNumber(location.visitors)}</p>
                        <p className="text-xs text-gray-500">{location.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.engagement.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{page.path}</p>
                        <p className="text-xs text-gray-500">Avg. time: {formatDuration(page.avgTime)}</p>
                      </div>
                      <Badge variant="secondary">{formatNumber(page.views)} views</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Search Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Top Search Queries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.engagement.searchQueries.map((query, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{query.query}</p>
                        <p className="text-xs text-gray-500">{query.resultClicks} clicks</p>
                      </div>
                      <Badge variant="outline">{query.count} searches</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Venues */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Venues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.engagement.popularVenues.map((venue, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{venue.name}</p>
                        <p className="text-xs text-gray-500">{venue.inquiries} inquiries</p>
                      </div>
                      <Badge variant="secondary">{venue.views} views</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Vendors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.engagement.popularVendors.map((vendor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{vendor.name}</p>
                        <p className="text-xs text-gray-500">{vendor.contacts} contacts</p>
                      </div>
                      <Badge variant="secondary">{vendor.views} views</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Funnel */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Conversion Funnel</CardTitle>
                <CardDescription>User journey from page view to booking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.conversion.funnelSteps.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{step.step}</p>
                            <p className="text-sm text-gray-500">{formatNumber(step.users)} users</p>
                          </div>
                        </div>
                        {step.dropoffRate > 0 && (
                          <Badge variant="destructive">{step.dropoffRate}% drop-off</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bookings by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bookings by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.conversion.bookingsByCategory.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{category.category}</p>
                        <p className="text-xs text-gray-500">{formatCurrency(category.revenue)} revenue</p>
                      </div>
                      <Badge variant="secondary">{category.bookings} bookings</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.conversion.monthlyTrends.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{month.month}</p>
                        <p className="text-xs text-gray-500">{formatCurrency(month.revenue)}</p>
                      </div>
                      <Badge variant="outline">{month.bookings} bookings</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Page Views/min</p>
                    <p className="text-2xl font-bold">342</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Live Bookings</p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Searches</p>
                    <p className="text-2xl font-bold">89</p>
                  </div>
                  <Search className="w-6 h-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Real-time Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm">User from Mumbai viewed Grand Ballroom</p>
                      <p className="text-xs text-gray-500">{Math.floor(Math.random() * 60)} seconds ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
