"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Target, 
  TrendingUp, 
  Calculator, 
  CheckCircle, 
  AlertTriangle, 
  IndianRupee,
  Filter,
  Search,
  FileText,
  Settings
} from "lucide-react";

interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'booked' | 'paid';
  vendor?: string;
  notes?: string;
  actualAmount?: number;
  createdAt: string;
}

const STORAGE_KEY = "ws_budget_v2";
const SETTINGS_KEY = "ws_budget_settings";

const DEFAULT_CATEGORIES = [
  { name: 'Venue', icon: '🏛️', percentage: 40 },
  { name: 'Catering', icon: '🍽️', percentage: 25 },
  { name: 'Photography', icon: '📸', percentage: 10 },
  { name: 'Decor', icon: '💐', percentage: 8 },
  { name: 'Makeup & Styling', icon: '💄', percentage: 5 },
  { name: 'Music & Entertainment', icon: '🎵', percentage: 5 },
  { name: 'Transport', icon: '🚗', percentage: 3 },
  { name: 'Miscellaneous', icon: '📋', percentage: 4 }
];

export default function BudgetPage() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [totalBudget, setTotalBudget] = useState<number>(1000000);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Venue");
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [vendor, setVendor] = useState("");
  const [notes, setNotes] = useState("");
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState("");

  // Load data from localStorage
  useEffect(() => {
    try {
      const itemsData = localStorage.getItem(STORAGE_KEY);
      const settingsData = localStorage.getItem(SETTINGS_KEY);
      
      if (itemsData) setItems(JSON.parse(itemsData));
      if (settingsData) {
        const settings = JSON.parse(settingsData);
        setTotalBudget(settings.totalBudget || 1000000);
      }
    } catch (error) {
      console.error('Error loading budget data:', error);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ totalBudget }));
    } catch (error) {
      console.error('Error saving budget data:', error);
    }
  }, [items, totalBudget]);

  // Calculations
  const totalSpent = useMemo(() => 
    items.reduce((sum, item) => sum + (item.actualAmount || item.amount), 0), [items]
  );
  
  const totalPlanned = useMemo(() => 
    items.reduce((sum, item) => sum + item.amount, 0), [items]
  );
  
  const remaining = totalBudget - totalSpent;
  const budgetUsedPercentage = (totalSpent / totalBudget) * 100;
  
  const categoryBreakdown = useMemo(() => {
    const breakdown = new Map<string, { planned: number; spent: number; count: number }>();
    
    items.forEach(item => {
      const current = breakdown.get(item.category) || { planned: 0, spent: 0, count: 0 };
      breakdown.set(item.category, {
        planned: current.planned + item.amount,
        spent: current.spent + (item.actualAmount || item.amount),
        count: current.count + 1
      });
    });
    
    return Array.from(breakdown.entries()).map(([category, data]) => ({
      category,
      ...data,
      percentage: (data.spent / totalSpent) * 100 || 0
    }));
  }, [items, totalSpent]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesSearch = !searchTerm || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [items, filterCategory, searchTerm]);

  const addOrUpdateItem = () => {
    const amt = Number(amount);
    if (!name.trim() || !amt || amt <= 0) {
      window.alert('Please enter a valid item name and amount');
      return;
    }

    const now = new Date().toISOString();
    const itemData: BudgetItem = {
      id: editingItem?.id || crypto.randomUUID(),
      name: name.trim(),
      amount: amt,
      category,
      priority,
      status: 'planned',
      vendor: vendor.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: editingItem?.createdAt || now
    };

    if (editingItem) {
      setItems(prev => prev.map(item => item.id === editingItem.id ? itemData : item));
    } else {
      setItems(prev => [...prev, itemData]);
    }

    // Reset form
    setName("");
    setAmount("");
    setVendor("");
    setNotes("");
    setEditingItem(null);
  };

  const editItem = (item: BudgetItem) => {
    setEditingItem(item);
    setName(item.name);
    setAmount(item.amount.toString());
    setCategory(item.category);
    setPriority(item.priority);
    setVendor(item.vendor || "");
    setNotes(item.notes || "");
  };

  const deleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateItemStatus = (id: string, status: BudgetItem['status'], actualAmount?: number) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status, actualAmount }
        : item
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'booked': return 'bg-orange-100 text-orange-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Calculator, text: "Planning Tool" }}
        title="Wedding"
        titleGradient="Budget Planner"
        description="Track expenses, manage vendors, and stay within budget."
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold text-foreground">₹{totalBudget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Spent</p>
              <p className="text-2xl font-bold text-foreground">₹{totalSpent.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={Math.min(budgetUsedPercentage, 100)} className="h-3" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Usage</span>
              <span className="font-semibold text-foreground">{budgetUsedPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setTotalBudget(prev => {
              const newBudget = prompt('Enter your total budget (₹):', prev.toString());
              return newBudget ? Number(newBudget) || prev : prev;
            })}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Set Budget
          </Button>
        </div>
      </EnhancedPageHero>

      <PageContainer className="py-12">

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold text-foreground">₹{totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Calculator className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Planned</p>
                <p className="text-2xl font-bold text-foreground">₹{totalPlanned.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className="text-2xl font-bold text-foreground">₹{totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${
                remaining >= 0 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {remaining >= 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className={`text-2xl font-bold ${
                  remaining >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{Math.abs(remaining).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card className="p-6 mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Budget Usage</h3>
            <Badge variant={budgetUsedPercentage > 100 ? 'destructive' : budgetUsedPercentage > 80 ? 'secondary' : 'default'}>
              {budgetUsedPercentage.toFixed(1)}% Used
            </Badge>
          </div>
          <Progress value={Math.min(budgetUsedPercentage, 100)} className="h-3" />
          {budgetUsedPercentage > 100 && (
            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Budget exceeded by ₹{(totalSpent - totalBudget).toLocaleString()}
            </p>
          )}
        </Card>

        {/* Add/Edit Item Form */}
        <Card className="p-6 mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Wedding Hall Booking"
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50000"
                  className="pl-8 h-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                {DEFAULT_CATEGORIES.map(cat => (
                  <option key={cat.name} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor/Supplier</Label>
              <Input
                id="vendor"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="Vendor name (optional)"
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes (optional)"
                className="h-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={addOrUpdateItem} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
            {editingItem && (
              <Button variant="outline" onClick={() => {
                setEditingItem(null);
                setName("");
                setAmount("");
                setVendor("");
                setNotes("");
              }}>
                Cancel
              </Button>
            )}
          </div>
        </Card>

        {/* Filters and Search */}
        <Card className="p-4 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search items, vendors, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">All Categories</option>
                {DEFAULT_CATEGORIES.map(cat => (
                  <option key={cat.name} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Items List */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Budget Items ({filteredItems.length})</h3>
              <div className="text-sm text-muted-foreground">
                Total: ₹{filteredItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </div>
            </div>
            
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No items found. Add your first budget item above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map(item => (
                  <div key={item.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge className={getPriorityColor(item.priority)} variant="outline">
                            {item.priority}
                          </Badge>
                          <Badge className={getStatusColor(item.status)} variant="outline">
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{DEFAULT_CATEGORIES.find(c => c.name === item.category)?.icon} {item.category}</span>
                          {item.vendor && <span>👤 {item.vendor}</span>}
                          {item.notes && <span>📝 {item.notes}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold text-lg">₹{item.amount.toLocaleString()}</div>
                          {item.actualAmount && item.actualAmount !== item.amount && (
                            <div className="text-sm text-muted-foreground">
                              Actual: ₹{item.actualAmount.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editItem(item)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteItem(item.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </PageContainer>
    </main>
  );
}
