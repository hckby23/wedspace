
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { DollarSign, Plus, Trash2, Edit } from 'lucide-react';

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  estimatedAmount: number;
  actualAmount: number;
  paid: number;
}

interface BudgetCategory {
  id: string;
  name: string;
  items: BudgetItem[];
}

const Budget: React.FC = () => {
  const [totalBudget, setTotalBudget] = useState(25000);
  const [categories, setCategories] = useState<BudgetCategory[]>([
    {
      id: 'venue',
      name: 'Venue & Catering',
      items: [
        {
          id: 'venue-1',
          category: 'Venue & Catering',
          description: 'Venue rental fee',
          estimatedAmount: 5000,
          actualAmount: 5200,
          paid: 2500
        },
        {
          id: 'venue-2',
          category: 'Venue & Catering',
          description: 'Catering (per person)',
          estimatedAmount: 6000,
          actualAmount: 6500,
          paid: 3000
        },
        {
          id: 'venue-3',
          category: 'Venue & Catering',
          description: 'Alcohol and beverages',
          estimatedAmount: 2000,
          actualAmount: 1800,
          paid: 1800
        },
      ]
    },
    {
      id: 'attire',
      name: 'Attire & Beauty',
      items: [
        {
          id: 'attire-1',
          category: 'Attire & Beauty',
          description: 'Wedding dress',
          estimatedAmount: 2000,
          actualAmount: 2200,
          paid: 2200
        },
        {
          id: 'attire-2',
          category: 'Attire & Beauty',
          description: 'Suit/Tuxedo',
          estimatedAmount: 800,
          actualAmount: 750,
          paid: 750
        },
        {
          id: 'attire-3',
          category: 'Attire & Beauty',
          description: 'Hair and makeup',
          estimatedAmount: 500,
          actualAmount: 550,
          paid: 275
        },
      ]
    },
    {
      id: 'photography',
      name: 'Photography & Video',
      items: [
        {
          id: 'photo-1',
          category: 'Photography & Video',
          description: 'Photographer',
          estimatedAmount: 2500,
          actualAmount: 3000,
          paid: 1500
        },
        {
          id: 'photo-2',
          category: 'Photography & Video',
          description: 'Videographer',
          estimatedAmount: 1800,
          actualAmount: 1800,
          paid: 900
        },
      ]
    },
    {
      id: 'flowers',
      name: 'Flowers & Decor',
      items: [
        {
          id: 'flowers-1',
          category: 'Flowers & Decor',
          description: 'Bouquets and boutonnieres',
          estimatedAmount: 800,
          actualAmount: 750,
          paid: 375
        },
        {
          id: 'flowers-2',
          category: 'Flowers & Decor',
          description: 'Ceremony and reception decor',
          estimatedAmount: 1200,
          actualAmount: 1500,
          paid: 750
        },
      ]
    },
  ]);
  
  const calculateTotalEstimated = () => {
    return categories.reduce((total, category) => {
      return total + category.items.reduce((sum, item) => sum + item.estimatedAmount, 0);
    }, 0);
  };
  
  const calculateTotalActual = () => {
    return categories.reduce((total, category) => {
      return total + category.items.reduce((sum, item) => sum + item.actualAmount, 0);
    }, 0);
  };
  
  const calculateTotalPaid = () => {
    return categories.reduce((total, category) => {
      return total + category.items.reduce((sum, item) => sum + item.paid, 0);
    }, 0);
  };
  
  const calculateRemainingBudget = () => {
    return totalBudget - calculateTotalActual();
  };
  
  const handleUpdateBudget = () => {
    toast.success(`Budget updated to $${totalBudget.toLocaleString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container-custom max-w-6xl">
          <div className="mb-8">
            <h1 className="font-playfair font-bold text-3xl md:text-4xl mb-4">
              Wedding Budget Planner
            </h1>
            <p className="text-gray-600">
              Track and manage all your wedding expenses in one place.
            </p>
          </div>
          
          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <DollarSign className="text-gray-500 mr-1" size={16} />
                  <div className="text-3xl font-bold">{totalBudget.toLocaleString()}</div>
                </div>
                <div className="flex items-end mt-4">
                  <Input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="mr-2"
                  />
                  <Button onClick={handleUpdateBudget} className="bg-wed hover:bg-wed/90">Update</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Spent So Far</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <DollarSign className="text-gray-500 mr-1" size={16} />
                  <div className="text-3xl font-bold">{calculateTotalPaid().toLocaleString()}</div>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  of ${calculateTotalActual().toLocaleString()} actual costs
                </div>
                <Progress 
                  value={(calculateTotalPaid() / calculateTotalActual()) * 100} 
                  className="h-2 mt-4" 
                />
              </CardContent>
            </Card>
            
            <Card className={calculateRemainingBudget() < 0 ? "border-red-500" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Remaining Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <DollarSign className={`mr-1 ${calculateRemainingBudget() < 0 ? "text-red-500" : "text-gray-500"}`} size={16} />
                  <div className={`text-3xl font-bold ${calculateRemainingBudget() < 0 ? "text-red-500" : ""}`}>
                    {calculateRemainingBudget().toLocaleString()}
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {((calculateRemainingBudget() / totalBudget) * 100).toFixed(1)}% of total budget
                </div>
                <Progress 
                  value={Math.max(0, (calculateRemainingBudget() / totalBudget) * 100)} 
                  className={`h-2 mt-4 ${calculateRemainingBudget() < 0 ? "bg-red-200" : ""}`}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Budget Details */}
          <Tabs defaultValue="details" className="mb-8">
            <TabsList>
              <TabsTrigger value="details">Budget Details</TabsTrigger>
              <TabsTrigger value="summary">Budget Summary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <div className="space-y-6">
                {categories.map(category => (
                  <div key={category.id} className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-playfair font-semibold text-lg">{category.name}</h3>
                      <div className="text-right">
                        <div className="text-space font-medium">
                          ${category.items.reduce((sum, item) => sum + item.actualAmount, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Estimated: ${category.items.reduce((sum, item) => sum + item.estimatedAmount, 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="text-gray-600 text-xs font-medium uppercase tracking-wider">
                          <tr>
                            <th className="text-left py-2">Description</th>
                            <th className="text-right py-2">Estimated</th>
                            <th className="text-right py-2">Actual</th>
                            <th className="text-right py-2">Paid</th>
                            <th className="text-right py-2">Status</th>
                            <th className="text-right py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {category.items.map(item => (
                            <tr key={item.id} className="text-sm">
                              <td className="py-3">{item.description}</td>
                              <td className="py-3 text-right">${item.estimatedAmount.toLocaleString()}</td>
                              <td className="py-3 text-right">${item.actualAmount.toLocaleString()}</td>
                              <td className="py-3 text-right">${item.paid.toLocaleString()}</td>
                              <td className="py-3 text-right">
                                {item.paid === item.actualAmount ? (
                                  <span className="text-green-500 text-xs font-medium bg-green-50 py-1 px-2 rounded">Paid</span>
                                ) : item.paid > 0 ? (
                                  <span className="text-amber-500 text-xs font-medium bg-amber-50 py-1 px-2 rounded">Partial</span>
                                ) : (
                                  <span className="text-red-500 text-xs font-medium bg-red-50 py-1 px-2 rounded">Unpaid</span>
                                )}
                              </td>
                              <td className="py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <button className="text-gray-500 hover:text-gray-700">
                                    <Edit size={16} />
                                  </button>
                                  <button className="text-gray-500 hover:text-red-500">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="mt-4">
                      <Plus className="mr-1" size={16} />
                      Add Item
                    </Button>
                  </div>
                ))}
                
                <div className="flex justify-center">
                  <Button className="bg-wed hover:bg-wed/90">
                    <Plus className="mr-2" size={16} />
                    Add Category
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="summary" className="mt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-playfair font-semibold text-lg mb-4">Budget Summary</h3>
                
                <div className="space-y-4">
                  {categories.map(category => {
                    const estimatedTotal = category.items.reduce((sum, item) => sum + item.estimatedAmount, 0);
                    const actualTotal = category.items.reduce((sum, item) => sum + item.actualAmount, 0);
                    const difference = actualTotal - estimatedTotal;
                    
                    return (
                      <div key={category.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-gray-500">
                            {Math.round((actualTotal / calculateTotalActual()) * 100)}% of total
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${actualTotal.toLocaleString()}</p>
                          <p className={`text-sm ${difference > 0 ? 'text-red-500' : difference < 0 ? 'text-green-500' : 'text-gray-500'}`}>
                            {difference > 0 ? '+' : ''}{difference.toLocaleString()} vs. budget
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-center font-semibold">
                    <div>
                      <p>Total</p>
                      <p className="text-sm text-gray-500">
                        {Math.round((calculateTotalActual() / totalBudget) * 100)}% of budget
                      </p>
                    </div>
                    <div className="text-right">
                      <p>${calculateTotalActual().toLocaleString()}</p>
                      <p className={`text-sm ${calculateRemainingBudget() < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {calculateRemainingBudget() >= 0 ? 'Under budget by ' : 'Over budget by '}
                        ${Math.abs(calculateRemainingBudget()).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-center">
            <Button className="bg-wed hover:bg-wed/90">
              Export Budget Report
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Budget;
