"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  Target,
  Sparkles,
  Filter,
  Search
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  done: boolean;
  category: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  createdAt: string;
}

const STORAGE_KEY = "ws_checklist_v1";

const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Book wedding venue',
    done: false,
    category: 'Venue',
    priority: 'high',
    dueDate: '2024-12-01',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Send save the dates',
    done: false,
    category: 'Invitations',
    priority: 'high',
    dueDate: '2024-11-15',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Book wedding photographer',
    done: false,
    category: 'Photography',
    priority: 'high',
    dueDate: '2024-11-30',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Choose wedding dress',
    done: false,
    category: 'Attire',
    priority: 'medium',
    dueDate: '2024-12-15',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Book caterer',
    done: false,
    category: 'Catering',
    priority: 'high',
    dueDate: '2024-11-20',
    createdAt: new Date().toISOString()
  }
];

const CATEGORIES = [
  'All',
  'Venue',
  'Catering',
  'Photography',
  'Invitations',
  'Attire',
  'Decor',
  'Music',
  'Transportation',
  'Other'
];

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Other');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const savedTasks = JSON.parse(raw);
        setTasks(savedTasks.length > 0 ? savedTasks : DEFAULT_TASKS);
      } else {
        setTasks(DEFAULT_TASKS);
      }
    } catch {
      setTasks(DEFAULT_TASKS);
    }
  }, []);

  // save
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tasks, selectedCategory, searchTerm]);

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const count = tasks.filter((t) => t.done).length;
    return Math.round((count / tasks.length) * 100);
  }, [tasks]);

  const categoryStats = useMemo(() => {
    const stats = CATEGORIES.slice(1).map(category => {
      const categoryTasks = tasks.filter(t => t.category === category);
      const completed = categoryTasks.filter(t => t.done).length;
      return {
        category,
        total: categoryTasks.length,
        completed,
        progress: categoryTasks.length > 0 ? Math.round((completed / categoryTasks.length) * 100) : 0
      };
    }).filter(stat => stat.total > 0);
    return stats;
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks((prev) => [
      ...prev,
      { 
        id: crypto.randomUUID(), 
        title: input.trim(), 
        done: false,
        category: newTaskCategory,
        priority: newTaskPriority,
        createdAt: new Date().toISOString()
      },
    ]);
    setInput("");
  };

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const removeTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: CheckCircle2, text: "Planning Tool" }}
        title="Wedding"
        titleGradient="Checklist"
        description="Stay organized and on track. Never miss an important task."
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
            <span className="text-2xl font-bold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {tasks.filter(t => t.done).length} of {tasks.length} tasks completed
          </p>
        </div>
      </EnhancedPageHero>

      <PageContainer className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Add Task */}
              <Card className="p-6">
                <h3 className="font-playfair text-lg font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-red-600" />
                  Add New Task
                </h3>
                <div className="space-y-4">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter task description..."
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={newTaskCategory} 
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm bg-background"
                    >
                      {CATEGORIES.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <select 
                      value={newTaskPriority} 
                      onChange={(e) => setNewTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                      className="px-3 py-2 border rounded-md text-sm bg-background"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <Button onClick={addTask} className="w-full bg-red-600 hover:bg-red-700">
                    Add Task
                  </Button>
                </div>
              </Card>

              {/* Category Filter */}
              <Card className="p-6">
                <h3 className="font-playfair text-lg font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-red-600" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => {
                    const count = category === 'All' ? tasks.length : tasks.filter(t => t.category === category).length;
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between ${
                          selectedCategory === category 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        <span className="text-sm font-medium">{category}</span>
                        <Badge variant="secondary" className="text-xs">{count}</Badge>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Category Progress */}
              <Card className="p-6">
                <h3 className="font-playfair text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-600" />
                  Progress by Category
                </h3>
                <div className="space-y-3">
                  {categoryStats.map((stat) => (
                    <div key={stat.category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{stat.category}</span>
                        <span className="text-xs text-muted-foreground">
                          {stat.completed}/{stat.total}
                        </span>
                      </div>
                      <Progress value={stat.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Tasks List */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <h2 className="font-playfair text-2xl font-semibold">
                  {selectedCategory === 'All' ? 'All Tasks' : `${selectedCategory} Tasks`}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredTasks.length} tasks
                </p>
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="space-y-3">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <Card key={task.id} className={`p-4 transition-all duration-200 hover:shadow-md ${
                    task.done ? 'bg-green-50/50 dark:bg-green-950/10 border-green-200' : 'hover:-translate-y-0.5'
                  }`}>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="flex-shrink-0 transition-colors hover:scale-110"
                      >
                        {task.done ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground hover:text-red-600" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${
                            task.done ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}>
                            {task.title}
                          </h3>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {task.category}
                          </span>
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTask(task.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="font-playfair text-xl font-semibold mb-2">
                      {searchTerm ? 'No matching tasks' : 'No tasks in this category'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm 
                        ? 'Try adjusting your search terms or filters.' 
                        : 'Add your first task to get started with planning!'}
                    </p>
                    {searchTerm && (
                      <Button 
                        variant="outline" 
                        onClick={() => setSearchTerm('')}
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
