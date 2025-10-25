
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  CheckSquare, 
  Heart, 
  Clock, 
  DollarSign, 
  Users, 
  CalendarDays,
  CheckCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="font-playfair font-bold text-3xl md:text-4xl mb-2">
              Welcome back, Sarah
            </h1>
            <p className="text-gray-600">
              Your wedding is in <span className="font-medium">248 days</span> • September 15, 2025
            </p>
          </div>
          
          {/* Planning Progress */}
          <div className="mb-10">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Planning Progress</CardTitle>
                  <span className="text-wed font-medium">55% Complete</span>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={55} className="h-2 mb-4" />
                <div className="text-sm text-gray-500">
                  You're on track with your planning! Next task: Book your florist.
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <Link to="/tools/checklist">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <CheckSquare className="w-10 h-10 text-wed mb-3" />
                  <h3 className="font-medium mb-1">Wedding Checklist</h3>
                  <p className="text-sm text-gray-500">3 tasks due this week</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/tools/budget">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <DollarSign className="w-10 h-10 text-wed mb-3" />
                  <h3 className="font-medium mb-1">Budget Tracker</h3>
                  <p className="text-sm text-gray-500">$8,500 remaining</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/tools/guests">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Users className="w-10 h-10 text-wed mb-3" />
                  <h3 className="font-medium mb-1">Guest List</h3>
                  <p className="text-sm text-gray-500">120 of 150 confirmed</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/tools/timeline">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Clock className="w-10 h-10 text-wed mb-3" />
                  <h3 className="font-medium mb-1">Timeline</h3>
                  <p className="text-sm text-gray-500">View your day-of schedule</p>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Tasks */}
            <div className="lg:col-span-2">
              <h2 className="font-playfair font-semibold text-2xl mb-4">Upcoming Tasks</h2>
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 p-3 bg-soft-pink/50 rounded-lg">
                      <div className="bg-soft-pink rounded-full p-2">
                        <Calendar className="w-5 h-5 text-wed" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Book florist consultation</p>
                        <p className="text-sm text-gray-500">Due in 5 days</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Complete
                      </Button>
                    </li>
                    
                    <li className="flex items-center gap-3 p-3 bg-soft-peach/50 rounded-lg">
                      <div className="bg-soft-peach rounded-full p-2">
                        <CalendarDays className="w-5 h-5 text-space" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Schedule menu tasting</p>
                        <p className="text-sm text-gray-500">Due in 14 days</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Complete
                      </Button>
                    </li>
                    
                    <li className="flex items-center gap-3 p-3 bg-soft-gray/50 rounded-lg">
                      <div className="bg-soft-gray rounded-full p-2">
                        <Users className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Send save-the-dates</p>
                        <p className="text-sm text-gray-500">Due in 21 days</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Complete
                      </Button>
                    </li>
                  </ul>
                  
                  <div className="mt-6">
                    <Link to="/tools/checklist">
                      <Button variant="outline" className="w-full">
                        View All Tasks
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Saved Venues & Vendors */}
            <div>
              <h2 className="font-playfair font-semibold text-2xl mb-4">Saved Items</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3" 
                        alt="Crystal Garden Estate" 
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-grow">
                        <p className="font-medium">Crystal Garden Estate</p>
                        <p className="text-sm text-gray-500">Venue • Booked</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <img 
                        src="https://images.unsplash.com/photo-1507290439931-a861b5a38200" 
                        alt="Elegant Blooms" 
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-grow">
                        <p className="font-medium">Elegant Blooms</p>
                        <p className="text-sm text-gray-500">Florist</p>
                      </div>
                      <Heart className="w-5 h-5 text-wed fill-current" />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <img 
                        src="https://images.unsplash.com/photo-1552334978-5f1649aef15d" 
                        alt="Moments Captured" 
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-grow">
                        <p className="font-medium">Moments Captured</p>
                        <p className="text-sm text-gray-500">Photography</p>
                      </div>
                      <Heart className="w-5 h-5 text-wed fill-current" />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link to="/favorites">
                      <Button variant="outline" className="w-full">
                        View All Favorites
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
