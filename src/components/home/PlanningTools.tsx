
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, Calendar, Users, DollarSign } from 'lucide-react';

const tools = [
  {
    title: 'Wedding Checklist',
    description: 'Stay on track with a personalized timeline of tasks',
    icon: CheckSquare,
    iconBg: 'bg-soft-pink',
    path: '/tools/checklist'
  },
  {
    title: 'Budget Planner',
    description: 'Manage expenses and track payments in one place',
    icon: DollarSign,
    iconBg: 'bg-soft-peach',
    path: '/tools/budget'
  },
  {
    title: 'Guest List Manager',
    description: 'Organize guests, track RSVPs, and manage seating',
    icon: Users,
    iconBg: 'bg-soft-gray',
    path: '/tools/guests'
  },
  {
    title: 'Wedding Timeline',
    description: 'Plan your wedding day schedule down to the minute',
    icon: Calendar,
    iconBg: 'bg-purple-100',
    path: '/tools/timeline'
  }
];

const PlanningTools: React.FC = () => {
  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="mb-10 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
            Wedding <span className="text-wed">Planning</span> Tools
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our comprehensive suite of tools makes planning your wedding effortless and enjoyable
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            
            return (
              <Card key={index} className="card-hover h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`${tool.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                    <IconComponent className="text-gray-700" size={24} />
                  </div>
                  <h3 className="font-playfair font-semibold text-xl mb-2">{tool.title}</h3>
                  <p className="text-gray-600 mb-5">{tool.description}</p>
                  <Link to={tool.path} className="mt-auto">
                    <Button variant="outline" className="border-gray-300 hover:border-wed hover:text-wed">
                      Try Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlanningTools;
