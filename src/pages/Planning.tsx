
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Calendar, CheckCircle2, ClipboardCheck, CreditCard, ListChecks, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlanningPage: React.FC = () => {
  const [progress, setProgress] = useState(45); // Planning progress percentage
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample data for booked venues/vendors
  const bookedVenue = {
    name: "Rosewood Gardens",
    date: "August 15, 2023",
    image: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?auto=format&fit=crop&q=80&w=600",
    status: "Confirmed",
    nextPayment: "June 1, 2023",
    amountDue: "$2,500"
  };
  
  const bookedVendors = [
    {
      name: "Elegant Photography",
      type: "Photography",
      image: "https://images.unsplash.com/photo-1532038890877-fca062d3b271?auto=format&fit=crop&q=80&w=400",
      status: "Confirmed",
      nextPayment: "July 1, 2023",
      amountDue: "$800"
    },
    {
      name: "Delicious Catering Co.",
      type: "Catering",
      image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=400",
      status: "Pending Contract",
      nextPayment: "June 15, 2023",
      amountDue: "$1,200"
    }
  ];

  const upcomingTasks = [
    { name: "Send invitations", deadline: "3 weeks", priority: "High" },
    { name: "Order flowers", deadline: "1 month", priority: "Medium" },
    { name: "Book accommodation", deadline: "2 weeks", priority: "High" },
    { name: "Final menu tasting", deadline: "1 month", priority: "Medium" }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Wedding Planning | wedspace</title>
        <meta name="description" content="Plan your perfect wedding day with our suite of planning tools and resources." />
      </Helmet>
      <Navbar />
      
      <main className="flex-1 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom py-12">
          <div className="mb-8">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">Your Wedding Planning</h1>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <p className="text-gray-600 mb-4 md:mb-0">Track your progress, manage bookings, and stay organized.</p>
              <div className="flex items-center">
                <div className="mr-4">
                  <p className="text-sm text-gray-500">Planning Progress</p>
                  <Progress value={progress} className="w-40 h-2" />
                </div>
                <p className="font-medium">{progress}%</p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="mb-4 grid w-full grid-cols-5 max-w-4xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="guests">Guest List</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Access Tools */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ListChecks className="mr-2 h-5 w-5" />
                      Planning Tools
                    </CardTitle>
                    <CardDescription>Quick access to planning essentials</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="flex-col h-20 py-2" asChild>
                      <Link to="/tools/checklist">
                        <ClipboardCheck className="h-5 w-5 mb-1" />
                        <span>Checklist</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-col h-20 py-2" asChild>
                      <Link to="/tools/budget">
                        <CreditCard className="h-5 w-5 mb-1" />
                        <span>Budget</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-col h-20 py-2" asChild>
                      <Link to="/tools/guests">
                        <Users className="h-5 w-5 mb-1" />
                        <span>Guests</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-col h-20 py-2" asChild>
                      <Link to="/tools/timeline">
                        <Calendar className="h-5 w-5 mb-1" />
                        <span>Timeline</span>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Priority Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle>Priority Tasks</CardTitle>
                    <CardDescription>Your upcoming to-do items</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingTasks.map((task, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${task.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'}`} />
                          <span>{task.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">Due: {task.deadline}</span>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link to="/tools/checklist">
                        View all tasks <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Important Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Important Dates</CardTitle>
                    <CardDescription>Key dates to remember</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 border rounded-lg bg-red-50 border-red-200">
                      <p className="font-medium">Wedding Day</p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">August 15, 2023</p>
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          96 days left
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Final Venue Payment</p>
                      <p className="text-sm text-gray-600">June 1, 2023</p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">RSVP Deadline</p>
                      <p className="text-sm text-gray-600">July 1, 2023</p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Final Dress Fitting</p>
                      <p className="text-sm text-gray-600">July 20, 2023</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Booked Venue */}
              <div>
                <h2 className="text-xl font-medium mb-4">Your Booked Venue</h2>
                {bookedVenue ? (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3">
                        <img 
                          src={bookedVenue.image} 
                          alt={bookedVenue.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold">{bookedVenue.name}</h3>
                            <div className="flex items-center text-green-600">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              <span className="text-sm">{bookedVenue.status}</span>
                            </div>
                          </div>
                          <p className="text-gray-600">Reserved for: {bookedVenue.date}</p>
                          
                          <div className="mt-4 flex flex-wrap gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Next Payment Due</p>
                              <p className="font-medium">{bookedVenue.nextPayment}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Amount</p>
                              <p className="font-medium">{bookedVenue.amountDue}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <Button variant="outline" className="mr-2">View Details</Button>
                          <Button>Contact Venue</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center py-10 text-center">
                      <p className="text-gray-500 mb-4">You haven't booked a venue yet</p>
                      <Button asChild>
                        <Link to="/venues">Browse Venues</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Booked Vendors */}
              <div>
                <h2 className="text-xl font-medium mb-4">Your Booked Vendors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookedVendors.map((vendor, index) => (
                    <Card key={index}>
                      <div className="aspect-video w-full">
                        <img
                          src={vendor.image}
                          alt={vendor.name}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        <CardDescription>{vendor.type}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">Status:</span>
                          <span className={`text-sm ${vendor.status === 'Confirmed' ? 'text-green-600' : 'text-amber-600'}`}>
                            {vendor.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Next Payment:</span>
                          <span className="text-sm">{vendor.nextPayment}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Amount:</span>
                          <span className="text-sm">{vendor.amountDue}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" className="w-full">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  {/* Add More Card */}
                  <Card className="border-dashed flex flex-col">
                    <CardContent className="flex flex-col items-center justify-center py-10 h-full text-center">
                      <p className="text-gray-500 mb-4">Add more vendors to your wedding team</p>
                      <Button asChild>
                        <Link to="/vendors">Browse Vendors</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="checklist">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">Wedding Checklist</h2>
                <p className="mb-6">Redirecting to your checklist...</p>
                <div className="flex justify-center">
                  <Button asChild>
                    <Link to="/tools/checklist">Go to Checklist</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="budget">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">Wedding Budget</h2>
                <p className="mb-6">Redirecting to your budget planner...</p>
                <div className="flex justify-center">
                  <Button asChild>
                    <Link to="/tools/budget">Go to Budget</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="guests">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">Guest List Management</h2>
                <p className="mb-6">Redirecting to your guest list manager...</p>
                <div className="flex justify-center">
                  <Button asChild>
                    <Link to="/tools/guests">Go to Guest List</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="timeline">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">Wedding Timeline</h2>
                <p className="mb-6">Redirecting to your timeline planner...</p>
                <div className="flex justify-center">
                  <Button asChild>
                    <Link to="/tools/timeline">Go to Timeline</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PlanningPage;
