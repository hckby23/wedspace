"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import EnhancedPageHero from '@/components/layout/EnhancedPageHero';
import PageContainer from '@/components/layout/PageContainer';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart,
  Lightbulb,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  recommended: number;
  items: BudgetItem[];
}

interface BudgetItem {
  name: string;
  cost: number;
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'booked' | 'paid';
}

export default function BudgetOptimizerPage() {
  const [totalBudget, setTotalBudget] = useState(1000000);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRecommended = categories.reduce((sum, cat) => sum + cat.recommended, 0);
  const remaining = totalBudget - totalSpent;

  const optimizationSuggestions: Array<{type:'savings'|'warning'|'opportunity'; title:string; description:string; impact:'low'|'medium'|'high';}> = [];

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Calculator, text: 'AI' }}
        title="Budget"
        titleGradient="Optimizer"
        description="Smart budget planning with AI-powered cost optimization."
      />

      <PageContainer className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Budget Overview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Budget
                  </label>
                  <Input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Allocated</span>
                    <span className="font-medium">₹{totalAllocated.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Spent</span>
                    <span className="font-medium text-red-600">₹{totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Remaining</span>
                    <span className="font-medium text-green-600">₹{remaining.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Budget Used</span>
                    <span>{((totalSpent / totalBudget) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(totalSpent / totalBudget) * 100} className="h-2" />
                </div>

                {/* AI Insights */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">AI Insights</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>On track with spending</span>
                    </div>
                    <div className="flex items-center text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span>3 optimization opportunities</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Optimization Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  AI Optimization Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {optimizationSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          suggestion.type === 'savings' ? 'bg-green-100 dark:bg-green-900' :
                          suggestion.type === 'warning' ? 'bg-red-100 dark:bg-red-900' :
                          'bg-blue-100 dark:bg-blue-900'
                        }`}>
                          {suggestion.type === 'savings' ? (
                            <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : suggestion.type === 'warning' ? (
                            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {suggestion.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            {suggestion.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Budget Breakdown by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categories.map((category, index) => {
                    const percentage = (category.allocated / totalBudget) * 100;
                    const spentPercentage = (category.spent / category.allocated) * 100;
                    const isOverRecommended = category.allocated > category.recommended;
                    
                    return (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {category.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                              <span>Allocated: ₹{category.allocated.toLocaleString()}</span>
                              <span>Spent: ₹{category.spent.toLocaleString()}</span>
                              {isOverRecommended && (
                                <span className="text-amber-600 dark:text-amber-400 flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Over recommended
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {percentage.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              of budget
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                            <span>Spending Progress</span>
                            <span>{spentPercentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={spentPercentage} className="h-2" />
                        </div>

                        {/* Category Items */}
                        <div className="pl-4 space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center justify-between py-2 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                              <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  item.status === 'paid' ? 'bg-green-500' :
                                  item.status === 'booked' ? 'bg-blue-500' :
                                  'bg-gray-400'
                                }`} />
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {item.name}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  item.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                }`}>
                                  {item.priority}
                                </span>
                              </div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                ₹{item.cost.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Market Analysis & Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <TrendingDown className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">15%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Decoration costs down</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹2.5L</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Average venue cost</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">8%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Photography rates up</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
