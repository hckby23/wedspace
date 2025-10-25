"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Send,
  CheckCircle,
  DollarSign,
  Calendar,
  Users,
  MapPin,
  Search,
  Plus,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Clock,
  Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuickAction {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  action: () => void;
  color: string;
}

interface Suggestion {
  id: string;
  type: 'task' | 'budget' | 'vendor' | 'tip';
  text: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  priority?: 'high' | 'medium' | 'low';
}

export default function PlanningAssistant() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: '1',
      type: 'task',
      text: 'Book your venue - only 3 months until your wedding!',
      priority: 'high',
      action: {
        label: 'Find Venues',
        onClick: () => router.push('/explore')
      }
    },
    {
      id: '2',
      type: 'budget',
      text: 'You\'ve allocated ₹2.5L for venue. Top matches available.',
      priority: 'medium',
      action: {
        label: 'View Matches',
        onClick: () => router.push('/venues')
      }
    },
    {
      id: '3',
      type: 'tip',
      text: 'Book photographers 6-8 months in advance for best availability',
      priority: 'low',
      action: {
        label: 'Browse Photographers',
        onClick: () => router.push('/explore')
      }
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const quickActions: QuickAction[] = [
    {
      id: 'find',
      icon: Search,
      label: 'Find Vendors',
      description: 'Search venues & vendors',
      action: () => router.push('/explore'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'task',
      icon: CheckCircle,
      label: 'Add Task',
      description: 'Quick add to checklist',
      action: () => handleQuickCommand('add task'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'budget',
      icon: DollarSign,
      label: 'Track Budget',
      description: 'Update spending',
      action: () => router.push('/tools/budget'),
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'timeline',
      icon: Calendar,
      label: 'View Timeline',
      description: 'Check milestones',
      action: () => router.push('/tools/timeline'),
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const handleQuickCommand = async (command: string) => {
    setInput(command);
    await handleSend(command);
  };

  const handleSend = async (customInput?: string) => {
    const query = customInput || input;
    if (!query.trim()) return;

    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      processCommand(query);
      setInput('');
      setIsProcessing(false);
    }, 800);
  };

  const processCommand = (query: string) => {
    const lowerQuery = query.toLowerCase();

    // Task-related commands
    if (lowerQuery.includes('add task') || lowerQuery.includes('create task')) {
      const newSuggestion: Suggestion = {
        id: Date.now().toString(),
        type: 'task',
        text: `Added to your checklist: "${query.replace(/add task|create task/i, '').trim()}"`,
        action: {
          label: 'View Checklist',
          onClick: () => router.push('/tools/checklist')
        }
      };
      setSuggestions([newSuggestion, ...suggestions.slice(0, 2)]);
      return;
    }

    // Find/search commands
    if (lowerQuery.includes('find') || lowerQuery.includes('search') || lowerQuery.includes('show')) {
      router.push('/explore');
      return;
    }

    // Budget commands
    if (lowerQuery.includes('budget')) {
      router.push('/tools/budget');
      return;
    }

    // Timeline commands
    if (lowerQuery.includes('timeline') || lowerQuery.includes('schedule')) {
      router.push('/tools/timeline');
      return;
    }

    // Guests commands
    if (lowerQuery.includes('guest')) {
      router.push('/tools/guests');
      return;
    }

    // Default: treat as search
    router.push(`/explore?q=${encodeURIComponent(query)}`);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-amber-600 dark:text-amber-400';
      case 'low': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '💡';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-white to-primary/5 dark:from-gray-900 dark:via-gray-900 dark:to-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span>Planning Assistant</span>
          <Badge variant="secondary" className="ml-auto">
            AI Powered
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Ask me to find vendors, add tasks, manage budget, or plan your timeline
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action}
                className="group relative overflow-hidden rounded-xl p-4 bg-white dark:bg-gray-800 border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative">
                  <Icon className="w-5 h-5 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                  <h4 className="font-semibold text-sm mb-1">{action.label}</h4>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold">Smart Suggestions</h4>
            </div>
            
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-border hover:border-primary/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{getPriorityIcon(suggestion.priority)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground mb-2">{suggestion.text}</p>
                    {suggestion.action && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1 -ml-2"
                        onClick={suggestion.action.onClick}
                      >
                        {suggestion.action.label}
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getPriorityColor(suggestion.priority)}`}
                  >
                    {suggestion.priority || 'info'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Field */}
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything... (e.g., 'Find photographers in Delhi')"
            className="pr-12 h-12"
            disabled={isProcessing}
          />
          <Button
            size="icon"
            className="absolute right-1 top-1 h-10 w-10"
            onClick={() => handleSend()}
            disabled={!input.trim() || isProcessing}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Example Commands */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {[
            'Find venues in Delhi',
            'Add task: book photographer',
            'Show my budget',
            'Add guest'
          ].map((example) => (
            <button
              key={example}
              onClick={() => handleQuickCommand(example)}
              className="text-xs px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
