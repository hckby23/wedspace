"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import { useAdmin } from "@/hooks/useAdmin";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Eye,
  Users,
  Building,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Shield,
  FileText,
  MessageSquare,
  Star,
  MapPin,
  Phone,
  Mail,
  Filter,
  Search,
  Download,
  Plus,
  Activity,
  Target,
  Zap,
  Award,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const mockMonthlyData = [
  { month: 'Jan', users: 120, bookings: 45 },
  { month: 'Feb', users: 180, bookings: 68 },
  { month: 'Mar', users: 240, bookings: 92 },
  { month: 'Apr', users: 310, bookings: 115 },
  { month: 'May', users: 390, bookings: 145 },
  { month: 'Jun', users: 480, bookings: 178 },
];

const mockCategoryData = [
  { name: 'Venues', value: 45, count: 125, color: '#3b82f6' },
  { name: 'Photographers', value: 25, count: 78, color: '#10b981' },
  { name: 'Caterers', value: 15, count: 42, color: '#f59e0b' },
  { name: 'Decorators', value: 10, count: 28, color: '#8b5cf6' },
  { name: 'Others', value: 5, count: 15, color: '#6b7280' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  
  // Use real data from useAdmin hook
  const {
    stats,
    activities,
    topPerformers,
    pendingApprovals,
    loading,
    error,
    refetch,
    approveListing,
    rejectListing,
  } = useAdmin();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': case 'under_review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected': case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: BarChart3, text: 'Admin' }}
        title="Admin"
        titleGradient="Dashboard"
        description="Platform management and oversight"
      />
      <PageContainer className="py-12">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {['7d', '30d', '90d'].map((period) => (
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
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={refetch} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="gap-2 bg-red-600 hover:bg-red-700">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalUsers.toLocaleString() || '0'}</p>
                      <div className="flex items-center mt-2">
                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-500">+12%</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{((stats?.monthlyRevenue || 0) / 1000000).toFixed(1)}M</p>
                      <div className="flex items-center mt-2">
                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-500">+18%</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-green-500">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Listings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.activeListings.toLocaleString() || '0'}</p>
                      <div className="flex items-center mt-2">
                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-500">+8%</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-500">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approvals</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.pendingApprovals || 0}</p>
                      <div className="flex items-center mt-2">
                        <Clock className="h-4 w-4 text-orange-500 mr-1" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Requires attention</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-500">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Platform Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mockMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="users" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="bookings" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {mockCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {mockCategoryData.map((category, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                          <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
                        </div>
                        <span className="font-medium">{category.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                    <Button variant="outline" size="sm">View All</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            activity.type === 'booking' ? 'bg-green-100 text-green-600' :
                            activity.type === 'venue' ? 'bg-blue-100 text-blue-600' :
                            activity.type === 'vendor' ? 'bg-purple-100 text-purple-600' :
                            activity.type === 'payment' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {activity.type === 'booking' && <Calendar className="h-3 w-3" />}
                            {activity.type === 'venue' && <Building className="h-3 w-3" />}
                            {activity.type === 'vendor' && <UserCheck className="h-3 w-3" />}
                            {activity.type === 'payment' && <DollarSign className="h-3 w-3" />}
                            {activity.type === 'user' && <Users className="h-3 w-3" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.description}</p>
                            {activity.amount && (
                              <p className="text-sm text-green-600 dark:text-green-400 font-medium">{activity.amount}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Top Performers
                    </CardTitle>
                    <Button variant="outline" size="sm">View All</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.map((performer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                            {performer.type === 'venue' ? (
                              <Building className="w-5 h-5 text-red-600 dark:text-red-400" />
                            ) : (
                              <UserCheck className="w-5 h-5 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{performer.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span>{performer.bookings} bookings</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span>{performer.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">{performer.revenue}</p>
                          <Badge variant="outline">#{index + 1}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Pending Approvals ({pendingApprovals.length})
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          item.type === 'venue' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                        }`}>
                          {item.type === 'venue' ? (
                            <Building className="w-6 h-6" />
                          ) : (
                            <UserCheck className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.type === 'venue' ? item.location : item.category}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Submitted: {item.submitted}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => approveListing(item.id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => rejectListing(item.id, 'Does not meet listing standards')}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs with placeholder content */}
          <TabsContent value="users">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">User Management</h3>
                  <p className="text-gray-600 dark:text-gray-300">Comprehensive user management and analytics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Listings Management</h3>
                  <p className="text-gray-600 dark:text-gray-300">Manage venues, vendors, and all platform listings</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Reports & Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300">Detailed reports and business intelligence</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </main>
  );
}
